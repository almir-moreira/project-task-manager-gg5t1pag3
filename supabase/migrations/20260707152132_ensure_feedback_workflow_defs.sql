INSERT INTO public.workflows (role, stage, step, category, activity_id)
SELECT role, 1, step, 'Feedback', NULL
FROM (VALUES
  ('Partnerships', 1),
  ('Relex', 2),
  ('Legal', 3),
  ('Governing Bodies', 4),
  ('Protocol', 5),
  ('EMS', 6),
  ('Procurement', 7),
  ('Technology', 8),
  ('M&E', 9),
  ('COMMS', 10),
  ('Social Media', 11)
) AS t(role, step)
WHERE NOT EXISTS (
  SELECT 1 FROM public.workflows
  WHERE workflows.role = t.role AND workflows.activity_id IS NULL
);
