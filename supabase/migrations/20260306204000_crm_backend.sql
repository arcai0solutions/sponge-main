-- Migration for CRM, Kanban, Contacts Archive, and Email List Capture

-- ENABLE UUID OSSP if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- 1. Contacts Archive Table
-- Acts as historical storage
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contacts_archive (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_lead_id UUID UNIQUE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    company TEXT,
    subject TEXT,
    message TEXT,
    source TEXT DEFAULT 'website',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_deleted_from_crm BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for searching contacts
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts_archive(email);

-- --------------------------------------------------------
-- 2. CRM Pipelines
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pipelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------
-- 3. Pipeline Stages (Columns)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_id UUID NOT NULL REFERENCES public.pipelines(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------
-- 4. CRM Leads
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    subject TEXT,
    message TEXT,
    source TEXT DEFAULT 'website',
    metadata JSONB DEFAULT '{}'::jsonb,
    pipeline_id UUID NOT NULL REFERENCES public.pipelines(id) ON DELETE RESTRICT,
    stage_id UUID NOT NULL REFERENCES public.stages(id) ON DELETE RESTRICT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------
-- 5. Email Subscriptions (Newsletter Popup)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.email_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    topic_interest TEXT NOT NULL,
    source TEXT DEFAULT 'popup',
    source_page TEXT,
    subscribed_at TIMESTAMPTZ DEFAULT now()
);

-- Prevent duplicate subscriptions for same email and topic
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_subscriptions_email_topic ON public.email_subscriptions(email, topic_interest);

-- --------------------------------------------------------
-- updated_at Triggers (Universal)
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pipelines_modtime BEFORE UPDATE ON public.pipelines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stages_modtime BEFORE UPDATE ON public.stages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_modtime BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_archive_modtime BEFORE UPDATE ON public.contacts_archive FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------
-- Leads <-> Contacts Archive Triggers (Business Logic)
-- --------------------------------------------------------

-- Trigger 1: Sync lead updates/inserts into contacts_archive
CREATE OR REPLACE FUNCTION sync_lead_to_archive()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.contacts_archive (
        original_lead_id, email, full_name, phone, company, subject, message, source, metadata, is_deleted_from_crm
    ) VALUES (
        NEW.id, NEW.email, NEW.full_name, NEW.phone, NEW.company, NEW.subject, NEW.message, NEW.source, NEW.metadata, false
    ) ON CONFLICT (original_lead_id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        company = EXCLUDED.company,
        subject = EXCLUDED.subject,
        message = EXCLUDED.message,
        source = EXCLUDED.source,
        metadata = EXCLUDED.metadata,
        is_deleted_from_crm = false,
        updated_at = now();
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_lead_upsert
AFTER INSERT OR UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION sync_lead_to_archive();

-- Trigger 2: Mark as deleted in archive when removed from Leads
CREATE OR REPLACE FUNCTION mark_lead_deleted_in_archive()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.contacts_archive
    SET is_deleted_from_crm = true,
        deleted_at = now(),
        updated_at = now()
    WHERE original_lead_id = OLD.id;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_lead_delete
AFTER DELETE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION mark_lead_deleted_in_archive();

-- --------------------------------------------------------
-- RPC Functions
-- --------------------------------------------------------

-- 1. submit_contact_form: Creates a lead via website securely
CREATE OR REPLACE FUNCTION submit_contact_form(
    p_full_name TEXT,
    p_email TEXT,
    p_phone TEXT DEFAULT NULL,
    p_company TEXT DEFAULT NULL,
    p_subject TEXT DEFAULT NULL,
    p_message TEXT DEFAULT NULL,
    p_source TEXT DEFAULT 'website',
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER -- bypassing RLS so public anon users can submit securely
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
        full_name, email, phone, company, subject, message, source, metadata, pipeline_id, stage_id, sort_order
    ) VALUES (
        p_full_name, p_email, p_phone, p_company, p_subject, p_message, p_source, p_metadata, v_pipeline_id, v_stage_id, 0
    ) RETURNING id INTO v_lead_id;
    
    RETURN v_lead_id;
END;
$$;

-- 2. subscribe_email_list: Saves a new email subscription
CREATE OR REPLACE FUNCTION subscribe_email_list(
    p_email TEXT,
    p_topic_interest TEXT,
    p_source TEXT DEFAULT 'popup',
    p_source_page TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.email_subscriptions (email, topic_interest, source, source_page)
    VALUES (p_email, p_topic_interest, p_source, p_source_page)
    ON CONFLICT (email, topic_interest) DO NOTHING;
    
    RETURN jsonb_build_object('success', true, 'message', 'Subscribed successfully');
END;
$$;

-- 3. move_lead: updates stage and order in Kanban
CREATE OR REPLACE FUNCTION move_lead(
    p_lead_id UUID,
    p_new_stage_id UUID,
    p_new_sort_order INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
BEGIN
    -- Assumes calling context is authenticated admin, meaning standard RLS applies natively to the update call.
    UPDATE public.leads
    SET stage_id = p_new_stage_id,
        sort_order = p_new_sort_order,
        updated_at = now()
    WHERE id = p_lead_id;
    
    RETURN jsonb_build_object('success', true, 'lead_id', p_lead_id);
END;
$$;

-- --------------------------------------------------------
-- Row Level Security (RLS) Configuration
-- --------------------------------------------------------

ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts_archive ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Deny all by default, only allow authenticated admins to read/manage.
-- Authenticated users (admins) can DO ALL:
CREATE POLICY "Admins full access to pipelines" ON public.pipelines FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access to stages" ON public.stages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access to leads" ON public.leads FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access to contacts_archive" ON public.contacts_archive FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access to email_subscriptions" ON public.email_subscriptions FOR ALL USING (auth.role() = 'authenticated');

-- Explanation:
-- Public forms should NOT insert directly into leads or subscriptions tables.
-- They execute the `SECURITY DEFINER` RPC methods. Thus, public table access is safely closed.
