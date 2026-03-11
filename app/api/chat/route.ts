import { openai } from '@ai-sdk/openai';
import { generateText, tool, stepCountIs } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/ai-context';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { Resend } from 'resend';
import { generateProposalEmail } from '@/lib/email-template';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

// Service-role client for server-side operations that bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
);

// ── Rate Limiting ────────────────────────────────────────────────────────────
// In-memory store: email -> { count, firstSent timestamp }.
// Resets on cold start but serves as a fast first-line guard.
const proposalRateLimit = new Map<string, { count: number; firstSent: number }>();
const RATE_LIMIT_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_PROPOSALS_PER_EMAIL = 3;          // per 24h window

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        // Validate API key
        if (!process.env.OPENAI_API_KEY) {
            return new Response(JSON.stringify({ error: 'API key not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { messages, sessionId } = await req.json();

        // Validate messages
        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: 'Messages required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Extract the latest user message to log to Supabase
        const latestMessage = messages[messages.length - 1];

        if (sessionId && latestMessage && latestMessage.role === 'user') {
            // Log user message to Supabase asynchronously (don't block the request)
            supabase.from('chat_messages').insert([
                {
                    session_id: sessionId,
                    role: 'user',
                    content: typeof latestMessage.content === 'string' ? latestMessage.content : '',
                }
            ]).then(({ error }) => {
                if (error) console.error("Error logging user message to Supabase:", error);
            });
        }

        // Format messages for the API — ai SDK v6 uses role/content shape
        const formattedMessages = messages.map((msg: { role: string; content: unknown }) => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: typeof msg.content === 'string' ? msg.content : '',
        }));

        // Call OpenAI with tool support.
        // ai SDK v6: tool() uses `inputSchema` (not `parameters`).
        // `maxSteps` allows generateText to run the tool and then produce a final text reply.
        const result = await generateText({
            model: openai('gpt-4o-mini'),
            system: SYSTEM_PROMPT,
            messages: formattedMessages,
            stopWhen: stepCountIs(5),
            tools: {
                sendProposal: tool({
                    description: 'Generate and email a custom pricing proposal to a prospect.',
                    inputSchema: z.object({
                        name: z.string().describe("The prospect's full name"),
                        email: z.string().email().describe("The prospect's email address"),
                        company: z.string().describe("The prospect's company name"),
                        employeeCount: z.number().describe("Number of employees requiring training"),
                        services: z.array(z.string()).describe("List of Sponge Global services the prospect is interested in"),
                    }),
                    execute: async ({ name, email, company, employeeCount, services }) => {
                        console.log(`Executing sendProposal tool for ${email}...`);

                        // ── Layer 1: In-memory rate limit ──────────────────
                        const key = email.toLowerCase();
                        const record = proposalRateLimit.get(key);
                        if (record) {
                            // Reset window if 24h has passed
                            if (Date.now() - record.firstSent > RATE_LIMIT_MS) {
                                proposalRateLimit.delete(key);
                            } else if (record.count >= MAX_PROPOSALS_PER_EMAIL) {
                                console.warn(`Rate limit hit for ${key} (${record.count} proposals)`);
                                return { success: false, rateLimited: true, hoursUntilReset: Math.ceil((RATE_LIMIT_MS - (Date.now() - record.firstSent)) / 3600000) };
                            }
                        }

                        // ── Layer 2: Supabase persistent check ────────────
                        // Counts across all serverless instances / cold starts.
                        const since = new Date(Date.now() - RATE_LIMIT_MS).toISOString();
                        const { data: recentProposals } = await supabase
                            .from('chat_messages')
                            .select('id')
                            .eq('role', 'proposal_sent')
                            .eq('session_id', key)
                            .gte('created_at', since);

                        if (recentProposals && recentProposals.length >= MAX_PROPOSALS_PER_EMAIL) {
                            console.warn(`Supabase rate limit hit for ${key}`);
                            return { success: false, rateLimited: true, hoursUntilReset: 24 };
                        }

                        // Demo Pricing Logic Based on Service Names
                        let totalPrice = 0;
                        const servicesLower = services.map((s: string) => s.toLowerCase());

                        // Calculating costs based on rules
                        if (servicesLower.some((s: string) => s.includes('mindset'))) {
                            totalPrice += 5000 + (employeeCount * 50);
                        }
                        if (servicesLower.some((s: string) => s.includes('upskilling'))) {
                            totalPrice += 7500 + (employeeCount * 75);
                        }
                        if (servicesLower.some((s: string) => s.includes('succession'))) {
                            totalPrice += 10000;
                        }
                        if (servicesLower.some((s: string) => s.includes('lms') || s.includes('management'))) {
                            totalPrice += 15000;
                        }
                        // Default Fallback Flat Base if no matches
                        if (totalPrice === 0) {
                            totalPrice = 3000 + (employeeCount * 25);
                        }

                        // Generate the HTML Email string
                        const htmlContent = generateProposalEmail(name, company, employeeCount, services, totalPrice);

                        // Send Email via Resend
                        try {
                            const { data, error } = await resend.emails.send({
                                from: 'Sponge AI <noreply@spongeglobal.com>',
                                to: email,
                                subject: `Custom Proposal for ${company} | Sponge Global`,
                                html: htmlContent,
                            });

                            console.log('Resend response:', data);

                            if (error) {
                                console.error('Resend Error:', error);
                                return {
                                    success: false,
                                    emailError: (error as { message?: string }).message ?? 'Email delivery failed',
                                    proposalDetails: { name, company, employeeCount, services, totalPrice }
                                };
                            }

                            // ── Log successful send for rate limiting ─────
                            const key = email.toLowerCase();
                            const existing = proposalRateLimit.get(key);
                            if (existing && Date.now() - existing.firstSent <= RATE_LIMIT_MS) {
                                proposalRateLimit.set(key, { count: existing.count + 1, firstSent: existing.firstSent });
                            } else {
                                proposalRateLimit.set(key, { count: 1, firstSent: Date.now() });
                            }
                            // Persist to Supabase for cross-instance protection
                            supabase.from('chat_messages').insert([{
                                session_id: email.toLowerCase(),
                                role: 'proposal_sent',
                                content: `Proposal sent to ${email} for ${company}`
                            }]).then(({ error: logErr }) => {
                                if (logErr) console.error('Failed to log proposal send:', logErr);
                            });

                            return {
                                success: true,
                                message: `Proposal sent successfully to ${email}`,
                                proposalDetails: { name, company, employeeCount, services, totalPrice }
                            };
                        } catch (e: unknown) {
                            const err = e as Error;
                            console.error('Email caught error:', err);
                            return {
                                success: false,
                                emailError: err.message,
                                proposalDetails: { name, company, employeeCount, services, totalPrice }
                            };
                        }
                    }
                }),
                saveLead: tool({
                description: 'Save a customer as a new lead in the CRM. Use this when you have gathered enough info about a prospect during the conversation. Generate notes summarizing what the customer is interested in based on the conversation.',
                inputSchema: z.object({
                    name: z.string().describe("The prospect's full name"),
                    phone: z.string().optional().describe("The prospect's phone number"),
                    email: z.string().optional().describe("The prospect's email address (use a placeholder if not provided)"),
                    company: z.string().optional().describe("The prospect's company name"),
                    notes: z.string().describe("AI-generated summary of the conversation: what the customer seemed interested in, key topics discussed, and any specific needs or requirements mentioned."),
                }),
                execute: async ({ name, phone, email, company, notes }) => {
                    console.log(`Executing saveLead tool for ${name}...`);
                    try {
                        const { data, error } = await supabaseAdmin.rpc('submit_contact_form', {
                            p_full_name: name,
                            p_email: email || 'no-email-provided@pending.com',
                            p_phone: phone || null,
                            p_company: company || null,
                            p_subject: 'AI Agent Lead',
                            p_message: null,
                            p_notes: notes,
                            p_source: 'ai_agent',
                        });

                        if (error) {
                            console.error('Supabase saveLead error:', error);
                            return { success: false, error: error.message };
                        }

                        return {
                            success: true,
                            leadId: data,
                            message: `Lead saved successfully for ${name}`,
                        };
                    } catch (e: unknown) {
                        const err = e as Error;
                        console.error('saveLead caught error:', err);
                        return { success: false, error: err.message };
                    }
                }
            }),
                subscribeNewsletter: tool({
                    description: 'Subscribe a user to the Sponge Global newsletter. Use this when a user agrees to receive updates and provides their email address.',
                    inputSchema: z.object({
                        email: z.string().email().describe("The user's email address for the newsletter subscription"),
                        topic_interest: z.string().describe("The specific service or topic the user is interested in based on the conversation (e.g., 'E-Learning Content Creation', 'LMS Solutions'), or 'general' if no specific interest was detected"),
                    }),
                    execute: async ({ email, topic_interest }) => {
                        console.log(`Executing subscribeNewsletter tool for ${email} (topic: ${topic_interest})...`);
                        try {
                            const { data, error } = await supabaseAdmin.rpc('subscribe_email_list', {
                                p_email: email,
                                p_topic_interest: topic_interest,
                                p_source: 'ai_agent',
                                p_source_page: null,
                            });

                            if (error) {
                                console.error('Supabase subscribeNewsletter error:', error);
                                return { success: false, error: error.message };
                            }

                            return {
                                success: true,
                                message: `Successfully subscribed ${email} to newsletter updates on ${topic_interest}`,
                            };
                        } catch (e: unknown) {
                            const err = e as Error;
                            console.error('subscribeNewsletter caught error:', err);
                            return { success: false, error: err.message };
                        }
                    }
                }),
            }
        });

        const responseText = result.text ?? '';

        if (sessionId) {
            // Log AI response to Supabase asynchronously
            supabase.from('chat_messages').insert([
                {
                    session_id: sessionId,
                    role: 'assistant',
                    content: responseText,
                }
            ]).then(({ error }) => {
                if (error) console.error("Error logging AI message to Supabase:", error);
            });
        }

        // Return response
        return new Response(JSON.stringify({ content: responseText }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: unknown) {
        const err = error as Error;
        console.error('Chat API Error:', err);
        return new Response(JSON.stringify({
            error: 'Internal server error',
            details: err.message ?? String(error),
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
