INSERT INTO public.workflows (role, stage, step, category, activity_id)
SELECT 'Governing Bodies', 1, 1, 'Feedback', NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public.workflows
  WHERE role = 'Governing Bodies' AND activity_id IS NULL
);

INSERT INTO public.workflows (role, stage, step, category, activity_id)
SELECT 'Partnerships', 1, 2, 'Feedback', NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public.workflows
  WHERE role = 'Partnerships' AND activity_id IS NULL
);
