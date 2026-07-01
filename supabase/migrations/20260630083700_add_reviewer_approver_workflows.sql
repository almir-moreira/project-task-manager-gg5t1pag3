INSERT INTO public.workflows (role, stage, step, category)
SELECT * FROM (VALUES
  ('Team Leader Review', 1, 1, 'Review'),
  ('Head Review', 1, 2, 'Review'),
  ('CPO Review', 1, 3, 'Review'),
  ('Head Approval', 2, 1, 'Approval'),
  ('CPO Approval', 2, 2, 'Approval'),
  ('SG Approval', 2, 3, 'Approval')
) AS t(role, stage, step, category)
WHERE NOT EXISTS (
  SELECT 1 FROM public.workflows w WHERE w.role = t.role
);
