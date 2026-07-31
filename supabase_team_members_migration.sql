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
-- Allow anyone (public/anonymous) to view team members
CREATE POLICY "Allow public read access on team_members" 
    ON public.team_members 
    FOR SELECT 
    USING (true);

-- Allow anonymous & authenticated users full access (for Next.js API / service integration)
CREATE POLICY "Allow write access on team_members" 
    ON public.team_members 
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- 4. Create Storage Bucket for Team Images (if storage extension is enabled)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'team-members',
    'team-members',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage RLS Policies for team-members bucket
-- Public read access for images
CREATE POLICY "Public Read Team Images" 
    ON storage.objects 
    FOR SELECT 
    USING (bucket_id = 'team-members');

-- Upload / Insert access
CREATE POLICY "Allow Upload Team Images" 
    ON storage.objects 
    FOR INSERT 
    WITH CHECK (bucket_id = 'team-members');

-- Update access
CREATE POLICY "Allow Update Team Images" 
    ON storage.objects 
    FOR UPDATE 
    WITH CHECK (bucket_id = 'team-members');

-- Delete access
CREATE POLICY "Allow Delete Team Images" 
    ON storage.objects 
    FOR DELETE 
    USING (bucket_id = 'team-members');

-- 6. Insert initial sample team members (optional seed data)
INSERT INTO public.team_members (name, role, tag, description, sort_order) VALUES
('Dr. Amila Jayasinghe', 'Lead Training Strategist', 'Communication', 'Specializing in corporate communication architecture, leadership capability building, and organizational performance transformation.', 1),
('Kavinda Senanayake', 'Head of Executive Coaching', 'Leadership', 'Over 15 years of experience scaling high-performing enterprise teams and executive coaching across South Asia.', 2),
('Nimesha Perera', 'Senior Talent Architect', 'Strategy', 'Expert in custom competency framework design, capability assessments, and workforce optimization.', 3),
('Tharindu Fernando', 'Digital Experience Lead', 'Technology', 'Leading digital learning platforms, AI integration, and interactive capability modules for modern enterprises.', 4)
ON CONFLICT DO NOTHING;
