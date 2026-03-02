import { openai } from '@ai-sdk/openai';
import { generateText, tool, stepCountIs } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/ai-context';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';
import { Resend } from 'resend';
import { generateProposalEmail } from '@/lib/email-template';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

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
            stopWhen: stepCountIs(3),
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
                })
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
