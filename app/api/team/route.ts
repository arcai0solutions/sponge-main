import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    description: string;
    image_url?: string | null;
    tag: string;
    sort_order?: number;
    created_at?: string;
    updated_at?: string;
}

// GET — Fetch all team members
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('team_members')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching team members:', error);
            return NextResponse.json({ error: error.message, data: [] }, { status: 500 });
        }

        return NextResponse.json({ data: data || [] });
    } catch (err: any) {
        console.error('Server error in team GET API:', err);
        return NextResponse.json({ error: err?.message || 'Internal server error', data: [] }, { status: 500 });
    }
}

// POST — Create new team member
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, role, description, image_url, tag, sort_order } = body;

        if (!name || !tag) {
            return NextResponse.json(
                { error: 'Name and tag/niche are required fields.' },
                { status: 400 }
            );
        }

        const { data, error } = await supabaseAdmin
            .from('team_members')
            .insert([{
                name,
                role: role || 'Team Member',
                description: description || '',
                image_url: image_url || null,
                tag: tag.trim(),
                sort_order: sort_order ?? 0
            }])
            .select()
            .single();

        if (error) {
            console.error('Error creating team member:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        console.error('Server error in team POST API:', err);
        return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
    }
}

// PUT — Update existing team member
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, role, description, image_url, tag, sort_order } = body;

        if (!id) {
            return NextResponse.json({ error: 'Team member ID is required for updates.' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('team_members')
            .update({
                name,
                role,
                description,
                image_url,
                tag,
                sort_order,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating team member:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        console.error('Server error in team PUT API:', err);
        return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
    }
}

// DELETE — Remove team member
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Team member ID is required.' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('team_members')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting team member:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Server error in team DELETE API:', err);
        return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
    }
}
