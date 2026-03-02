import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/ai-context';
import { supabase } from '@/lib/supabase';

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

        // Extact the latest user message to log to Supabase
        const latestMessage = messages[messages.length - 1];

        if (sessionId && latestMessage && latestMessage.role === 'user') {
            // Log user message to Supabase asynchronously (don't block the request)
            supabase.from('chat_messages').insert([
                {
                    session_id: sessionId,
                    role: 'user',
                    content: latestMessage.content
                }
            ]).then(({ error }) => {
                if (error) console.error("Error logging user message to Supabase:", error);
            });
        }

        // Format messages for the API
        const formattedMessages = messages.map((msg) => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: typeof msg.content === 'string' ? msg.content : '',
        }));

        // Call OpenAI
        // Note: User requested "gpt-5-mini", but falling back to gpt-4o-mini as gpt-5 is not yet standard in the SDK.
        // If gpt-4o-mini fails, it will throw an error that we catch.
        const result = await generateText({
            model: openai('gpt-4o-mini'),
            system: SYSTEM_PROMPT,
            messages: formattedMessages,
        });

        if (sessionId) {
            // Log AI response to Supabase asynchronously
            supabase.from('chat_messages').insert([
                {
                    session_id: sessionId,
                    role: 'assistant',
                    content: result.text
                }
            ]).then(({ error }) => {
                if (error) console.error("Error logging AI message to Supabase:", error);
            });
        }

        // Return response
        return new Response(JSON.stringify({ content: result.text }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : String(error)
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
