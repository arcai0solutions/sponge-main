-- Migration: Add category column to admin_notes for multi-column notes
-- Categories: 'finance', 'general', 'client'

ALTER TABLE public.admin_notes
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'general'
CHECK (category IN ('finance', 'general', 'client'));

-- Index for fast category filtering
CREATE INDEX IF NOT EXISTS idx_admin_notes_category ON public.admin_notes(category);
