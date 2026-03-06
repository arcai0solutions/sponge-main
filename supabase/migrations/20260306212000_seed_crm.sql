-- Migration for Seeding CRM Default Data

-- --------------------------------------------------------
-- 1. Create Default Pipelines if none exist
-- --------------------------------------------------------
DO $$
DECLARE
    v_sales_pipeline_id UUID;
    v_support_pipeline_id UUID;
    v_stage_id UUID;
BEGIN
    -- Only seed if the pipelines table is completely empty
    IF NOT EXISTS (SELECT 1 FROM public.pipelines) THEN
        
        -- Insert 'Sales Pipeline'
        INSERT INTO public.pipelines (name, sort_order)
        VALUES ('Sales Pipeline', 0)
        RETURNING id INTO v_sales_pipeline_id;

        -- Insert stages for Sales Pipeline
        INSERT INTO public.stages (pipeline_id, name, sort_order) VALUES (v_sales_pipeline_id, 'New Leads', 0);
        INSERT INTO public.stages (pipeline_id, name, sort_order) VALUES (v_sales_pipeline_id, 'Contacted', 1);
        INSERT INTO public.stages (pipeline_id, name, sort_order) VALUES (v_sales_pipeline_id, 'In Negotiation', 2);
        INSERT INTO public.stages (pipeline_id, name, sort_order) VALUES (v_sales_pipeline_id, 'Closed Won', 3);
        INSERT INTO public.stages (pipeline_id, name, sort_order) VALUES (v_sales_pipeline_id, 'Closed Lost', 4);

        -- Insert 'Support Tickets' Pipeline
        INSERT INTO public.pipelines (name, sort_order)
        VALUES ('Support Tickets', 1)
        RETURNING id INTO v_support_pipeline_id;

        -- Insert stages for Support Pipeline
        INSERT INTO public.stages (pipeline_id, name, sort_order) VALUES (v_support_pipeline_id, 'Open', 0);
        INSERT INTO public.stages (pipeline_id, name, sort_order) VALUES (v_support_pipeline_id, 'In Progress', 1);
        INSERT INTO public.stages (pipeline_id, name, sort_order) VALUES (v_support_pipeline_id, 'Resolved', 2);

        -- Optional: Add a sample lead to demonstrate the UI
        SELECT id INTO v_stage_id FROM public.stages WHERE pipeline_id = v_sales_pipeline_id AND name = 'New Leads' LIMIT 1;
        
        IF v_stage_id IS NOT NULL THEN
            INSERT INTO public.leads (full_name, email, phone, company, subject, message, source, pipeline_id, stage_id, sort_order)
            VALUES (
                'John Doe (Sample)', 
                'john.doe@example.com', 
                '+1-555-0123', 
                'Acme Corp', 
                'Interested in Corporate Training', 
                'Hi, I would like to know more about your Learning Management Systems for a team of 50.', 
                'manual', 
                v_sales_pipeline_id, 
                v_stage_id, 
                0
            );
        END IF;

    END IF;
END $$;
