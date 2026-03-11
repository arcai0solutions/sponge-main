-- Migration: Dashboard analytics tables
-- Run this in your Supabase SQL Editor

-- =============================================
-- 1. Page Visits Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.page_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visitor_id TEXT NOT NULL,
    page_path TEXT NOT NULL,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_visits_visitor ON public.page_visits(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_path ON public.page_visits(page_path);
CREATE INDEX IF NOT EXISTS idx_page_visits_created ON public.page_visits(created_at);

-- RLS
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- Admins can read all
CREATE POLICY "Admins full access to page_visits" ON public.page_visits FOR ALL USING (auth.role() = 'authenticated');

-- RPC to log a visit (SECURITY DEFINER so anon users can insert)
CREATE OR REPLACE FUNCTION log_page_visit(
    p_visitor_id TEXT,
    p_page_path TEXT,
    p_referrer TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.page_visits (visitor_id, page_path, referrer)
    VALUES (p_visitor_id, p_page_path, p_referrer);
END;
$$;

-- =============================================
-- 2. Admin Notes Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.admin_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access to admin_notes" ON public.admin_notes FOR ALL USING (auth.role() = 'authenticated');

CREATE TRIGGER update_admin_notes_modtime BEFORE UPDATE ON public.admin_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
