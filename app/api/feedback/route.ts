import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET — fetch all approved feedbacks (public, for website display)
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('client_feedbacks')
            .select('id, author, company, content, created_at')
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ feedbacks: data || [] });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST — submit feedback via token
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, author, company, content } = body;

        if (!token || !author || !content) {
            return NextResponse.json(
                { error: 'Token, author name, and feedback content are required.' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase.rpc('submit_client_feedback', {
            p_token: token,
            p_author: author,
            p_company: company || null,
            p_content: content,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
