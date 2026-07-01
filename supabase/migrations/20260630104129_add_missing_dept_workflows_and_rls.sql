UPDATE public.workflows
SET category = 'Departmental'
WHERE role IN ('COMMS', 'EOSG', 'OPS', 'Partnerships', 'Relex', 'Legal', 'GoB', 'Protocol', 'EMS', 'Procurement', 'Technology', 'M&E', 'Social Media')
  AND COALESCE(category, 'Review') != 'Departmental';

INSERT INTO public.workflows (role, stage, step, category)
SELECT * FROM (VALUES
  ('Relex', 3, 5, 'Departmental'),
  ('Legal', 3, 6, 'Departmental'),
  ('GoB', 3, 7, 'Departmental'),
  ('Protocol', 3, 8, 'Departmental'),
  ('EMS', 3, 9, 'Departmental'),
  ('Procurement', 3, 10, 'Departmental'),
  ('Technology', 3, 11, 'Departmental'),
  ('M&E', 3, 12, 'Departmental'),
  ('Social Media', 3, 13, 'Departmental')
) AS t(role, stage, step, category)
WHERE NOT EXISTS (
  SELECT 1 FROM public.workflows w WHERE w.role = t.role
);

DROP POLICY IF EXISTS "auth_all_workflows" ON public.workflows;
CREATE POLICY "auth_all_workflows" ON public.workflows
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all_activities" ON public.activities;
CREATE POLICY "auth_all_activities" ON public.activities
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
