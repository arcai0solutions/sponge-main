-- Migration: Client Feedback System
-- Allows admins to generate shareable links for clients to submit feedback,
-- which can then be approved and displayed on the website.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- 1. Client Feedbacks Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.client_feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    author TEXT,
    company TEXT,
    content TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast token lookups (public submission page)
CREATE INDEX IF NOT EXISTS idx_client_feedbacks_token ON public.client_feedbacks(token);
-- Index for fast status filtering (website display)
CREATE INDEX IF NOT EXISTS idx_client_feedbacks_status ON public.client_feedbacks(status);

-- Auto-update updated_at on row changes
CREATE TRIGGER update_client_feedbacks_modtime
    BEFORE UPDATE ON public.client_feedbacks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------------------
-- 2. RPC: Submit feedback via public token
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION submit_client_feedback(
    p_token UUID,
    p_author TEXT,
    p_company TEXT DEFAULT NULL,
    p_content TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_id UUID;
BEGIN
    -- Only allow submission if the token exists and feedback hasn't been submitted yet
    SELECT id INTO v_id
    FROM public.client_feedbacks
    WHERE token = p_token AND author IS NULL AND content IS NULL;

    IF v_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid or already used feedback link.');
    END IF;

    UPDATE public.client_feedbacks
    SET author = p_author,
        company = p_company,
        content = p_content,
        status = 'pending',
        updated_at = now()
    WHERE id = v_id;

    RETURN jsonb_build_object('success', true, 'message', 'Feedback submitted successfully.');
END;
$$;

-- --------------------------------------------------------
-- 3. Row Level Security
-- --------------------------------------------------------
ALTER TABLE public.client_feedbacks ENABLE ROW LEVEL SECURITY;

-- Authenticated admins can do everything
CREATE POLICY "Admins full access to client_feedbacks"
    ON public.client_feedbacks FOR ALL
    USING (auth.role() = 'authenticated');

-- Public (anon) users can read approved feedbacks (for the website)
CREATE POLICY "Public can read approved feedbacks"
    ON public.client_feedbacks FOR SELECT
    USING (status = 'approved');

-- --------------------------------------------------------
-- 4. Seed existing feedbacks as pre-approved
-- --------------------------------------------------------
INSERT INTO public.client_feedbacks (author, company, content, status) VALUES
(
    'Tharushka Fernando',
    'Ceylinco Life Insurance Ltd',
    E'Dear Sam,\n\nI''m writing this note to sincerely thank you for the excellent series of training sessions you conducted for our 20 teams.\n\nWe concluded the final round last week, and I''m happy to share that the senior board members were extremely impressed with the quality of the presentations, particularly the confidence, structure, and language used. They even inquired about the trainer behind the sessions, as they clearly noticed a significant improvement compared to previous competitions.\n\nWe truly appreciate the effort and dedication you put into grooming the teams. It was evident that you went above and beyond what was initially agreed upon, and for that, we are deeply grateful.\n\nAll the best.\n\nThanks and Regards,\nTharushka Fernando\nCeylinco Life Insurance Ltd,\nCeylinco Life Tower,\n106, Havelock Road,\nColombo 05,\nSri Lanka.\nPhone: (+94)11-2461351 /0786690909\nwww.ceylincolife.com',
    'approved'
),
(
    'Isuru Chandradasa',
    'Department of Human Resources Management, University of Colombo',
    E'Dear Sir/Madam,\n\nA very good morning!\n\nOn behalf of the Department of Human Resources Management, University of Colombo, I would like to extend our sincere gratitude for your invaluable contribution to the HR Analytics Bootcamp 2026.\n\nYour session added tremendous value to the program, and we are truly appreciative of the time, expertise, and practical insights you generously shared with our students. Your engaging delivery and real-world perspectives significantly enhanced their understanding of HR Analytics and its strategic importance in today''s organizations.\n\nI am especially pleased to share that, based on student feedback, the bootcamp has been a resounding success. Participants highly appreciated the clarity, relevance, and practical orientation of the sessions. Your contribution played a vital role in creating this meaningful learning experience.\n\nWe deeply value your support and professionalism, and we sincerely look forward to future opportunities to collaborate with you in advancing industry-academia engagement initiatives. A few photos were taken, and the event is attached to this email for your kind perusal\n\nThank you once again for being part of this important journey.\n\nBest regards\n\nIsuru Chandradasa\nDepartment of Human Resources Management\nFaculty of Management and Finance\nUniversity of Colombo\nColombo 03\nSri Lanka',
    'approved'
);
