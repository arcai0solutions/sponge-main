-- Migration: Add notes column to leads and contacts_archive
-- Run this in your Supabase SQL Editor

-- 1. Add notes column to leads
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. Add notes column to contacts_archive
ALTER TABLE public.contacts_archive ADD COLUMN IF NOT EXISTS notes TEXT;

-- 3. Update the sync trigger to include notes
CREATE OR REPLACE FUNCTION sync_lead_to_archive()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.contacts_archive (
        original_lead_id, email, full_name, phone, company, subject, message, notes, source, metadata, is_deleted_from_crm
    ) VALUES (
        NEW.id, NEW.email, NEW.full_name, NEW.phone, NEW.company, NEW.subject, NEW.message, NEW.notes, NEW.source, NEW.metadata, false
    ) ON CONFLICT (original_lead_id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        company = EXCLUDED.company,
        subject = EXCLUDED.subject,
        message = EXCLUDED.message,
        notes = EXCLUDED.notes,
        source = EXCLUDED.source,
        metadata = EXCLUDED.metadata,
        is_deleted_from_crm = false,
        updated_at = now();
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Update submit_contact_form RPC to accept notes
CREATE OR REPLACE FUNCTION submit_contact_form(
    p_full_name TEXT,
    p_email TEXT,
    p_phone TEXT DEFAULT NULL,
    p_company TEXT DEFAULT NULL,
    p_subject TEXT DEFAULT NULL,
    p_message TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL,
    p_source TEXT DEFAULT 'website',
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_pipeline_id UUID;
    v_stage_id UUID;
    v_lead_id UUID;
BEGIN
    -- 1. Get or create default pipeline
    SELECT id INTO v_pipeline_id FROM public.pipelines ORDER BY sort_order ASC, created_at ASC LIMIT 1;
    IF v_pipeline_id IS NULL THEN
        INSERT INTO public.pipelines (name, sort_order) VALUES ('Default Pipeline', 0) RETURNING id INTO v_pipeline_id;
    END IF;
    
    -- 2. Get or create first stage in that pipeline
    SELECT id INTO v_stage_id FROM public.stages WHERE pipeline_id = v_pipeline_id ORDER BY sort_order ASC, created_at ASC LIMIT 1;
    IF v_stage_id IS NULL THEN
        INSERT INTO public.stages (pipeline_id, name, sort_order) VALUES (v_pipeline_id, 'New Leads', 0) RETURNING id INTO v_stage_id;
    END IF;
    
    -- 3. Insert lead
    INSERT INTO public.leads (
        full_name, email, phone, company, subject, message, notes, source, metadata, pipeline_id, stage_id, sort_order
    ) VALUES (
        p_full_name, p_email, p_phone, p_company, p_subject, p_message, p_notes, p_source, p_metadata, v_pipeline_id, v_stage_id, 0
    ) RETURNING id INTO v_lead_id;
    
    RETURN v_lead_id;
END;
$$;
