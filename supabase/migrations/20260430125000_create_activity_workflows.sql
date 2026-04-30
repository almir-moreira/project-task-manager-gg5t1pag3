CREATE TABLE IF NOT EXISTS public.activity_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Pending',
  comments TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(activity_id, workflow_id)
);

ALTER TABLE public.activity_workflows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_all_activity_workflows" ON public.activity_workflows;
CREATE POLICY "auth_all_activity_workflows" ON public.activity_workflows
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DO $$
DECLARE
  wf_eosg_id UUID;
  wf_ops_id UUID;
  wf_comms_id UUID;
  wf_partnerships_id UUID;
  act RECORD;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.workflows LIMIT 1) THEN
    INSERT INTO public.workflows (role, stage) VALUES
      ('EOSG', 1),
      ('OPS', 2),
      ('COMMS', 3),
      ('Partnerships', 4);
  END IF;

  SELECT id INTO wf_eosg_id FROM public.workflows WHERE role = 'EOSG' LIMIT 1;
  SELECT id INTO wf_ops_id FROM public.workflows WHERE role = 'OPS' LIMIT 1;
  SELECT id INTO wf_comms_id FROM public.workflows WHERE role = 'COMMS' LIMIT 1;
  SELECT id INTO wf_partnerships_id FROM public.workflows WHERE role = 'Partnerships' LIMIT 1;

  FOR act IN SELECT id, wf_eosg, wf_ops, wf_comms, wf_partnerships, 
             wf_eosg_reviewer_id, wf_ops_reviewer_id, wf_comms_reviewer_id, wf_partnerships_reviewer_id
             FROM public.activities
  LOOP
    IF act.wf_eosg = true AND wf_eosg_id IS NOT NULL THEN
      INSERT INTO public.activity_workflows (activity_id, workflow_id, reviewer_id)
      VALUES (act.id, wf_eosg_id, act.wf_eosg_reviewer_id) ON CONFLICT DO NOTHING;
    END IF;

    IF act.wf_ops = true AND wf_ops_id IS NOT NULL THEN
      INSERT INTO public.activity_workflows (activity_id, workflow_id, reviewer_id)
      VALUES (act.id, wf_ops_id, act.wf_ops_reviewer_id) ON CONFLICT DO NOTHING;
    END IF;

    IF act.wf_comms = true AND wf_comms_id IS NOT NULL THEN
      INSERT INTO public.activity_workflows (activity_id, workflow_id, reviewer_id)
      VALUES (act.id, wf_comms_id, act.wf_comms_reviewer_id) ON CONFLICT DO NOTHING;
    END IF;

    IF act.wf_partnerships = true AND wf_partnerships_id IS NOT NULL THEN
      INSERT INTO public.activity_workflows (activity_id, workflow_id, reviewer_id)
      VALUES (act.id, wf_partnerships_id, act.wf_partnerships_reviewer_id) ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
END $$;
