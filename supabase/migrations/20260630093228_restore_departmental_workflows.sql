INSERT INTO public.workflows (role, stage, step, category)
SELECT * FROM (VALUES
  ('COMMS', 3, 1, 'Departmental'),
  ('EOSG', 3, 2, 'Departmental'),
  ('OPS', 3, 3, 'Departmental'),
  ('Partnerships', 3, 4, 'Departmental')
) AS t(role, stage, step, category)
WHERE NOT EXISTS (
  SELECT 1 FROM public.workflows w WHERE w.role = t.role
);
