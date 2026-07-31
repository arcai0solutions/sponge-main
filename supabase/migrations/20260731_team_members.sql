-- ========================================================
-- Sponge Global — Team Members & Storage Migration
-- ========================================================

-- 1. Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'Team Member',
    description TEXT,
    image_url TEXT,
    tag TEXT NOT NULL DEFAULT 'General',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster filtering by tag and sorting
CREATE INDEX IF NOT EXISTS idx_team_members_tag ON public.team_members(tag);
CREATE INDEX IF NOT EXISTS idx_team_members_sort_order ON public.team_members(sort_order);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies for team_members table
CREATE POLICY "Allow public read access on team_members" 
    ON public.team_members 
    FOR SELECT 
    USING (true);

CREATE POLICY "Allow write access on team_members" 
    ON public.team_members 
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- 4. Create Storage Bucket for Team Images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'team-members',
    'team-members',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage RLS Policies for team-members bucket
CREATE POLICY "Public Read Team Images" 
    ON storage.objects 
    FOR SELECT 
    USING (bucket_id = 'team-members');

CREATE POLICY "Allow Upload Team Images" 
    ON storage.objects 
    FOR INSERT 
    WITH CHECK (bucket_id = 'team-members');

CREATE POLICY "Allow Update Team Images" 
    ON storage.objects 
    FOR UPDATE 
    WITH CHECK (bucket_id = 'team-members');

CREATE POLICY "Allow Delete Team Images" 
    ON storage.objects 
    FOR DELETE 
    USING (bucket_id = 'team-members');
