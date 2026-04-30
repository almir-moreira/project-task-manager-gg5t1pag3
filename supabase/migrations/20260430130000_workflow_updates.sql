CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  stage INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP POLICY IF EXISTS "auth_all_workflows" ON public.workflows;
CREATE POLICY "auth_all_workflows" ON public.workflows FOR ALL TO authenticated USING (true) WITH CHECK (true);
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

DO $do$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.workflows WHERE role = 'EOSG') THEN
    INSERT INTO public.workflows (role, stage) VALUES ('EOSG', 1);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.workflows WHERE role = 'OPS') THEN
    INSERT INTO public.workflows (role, stage) VALUES ('OPS', 2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.workflows WHERE role = 'COMMS') THEN
    INSERT INTO public.workflows (role, stage) VALUES ('COMMS', 3);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.workflows WHERE role = 'Partnerships') THEN
    INSERT INTO public.workflows (role, stage) VALUES ('Partnerships', 4);
  END IF;
END $do$;

ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS wf_eosg BOOLEAN DEFAULT false;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS wf_eosg_reviewer_id UUID REFERENCES public.profiles(id);

ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS wf_ops BOOLEAN DEFAULT false;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS wf_ops_reviewer_id UUID REFERENCES public.profiles(id);

ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS wf_comms BOOLEAN DEFAULT false;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS wf_comms_reviewer_id UUID REFERENCES public.profiles(id);

ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS wf_partnerships BOOLEAN DEFAULT false;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS wf_partnerships_reviewer_id UUID REFERENCES public.profiles(id);
