DO $$
BEGIN
  ALTER TABLE public.workflows ADD COLUMN IF NOT EXISTS activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE;
END $$;

DROP POLICY IF EXISTS "auth_all_projects" ON public.projects;
CREATE POLICY "auth_all_projects" ON public.projects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
