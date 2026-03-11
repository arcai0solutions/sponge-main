import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
);

export async function POST(request: NextRequest) {
    try {
        const { visitorId, pagePath, referrer } = await request.json();

        if (!visitorId || !pagePath) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        await supabaseAdmin.rpc('log_page_visit', {
            p_visitor_id: visitorId,
            p_page_path: pagePath,
            p_referrer: referrer || null,
        });

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
