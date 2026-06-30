-- Remove departmental workflow configurations (EOSG, OPS, COMMS, Partnerships)
-- and their activity_workflow instances

DELETE FROM public.activity_workflows
WHERE workflow_id IN (
  SELECT id FROM public.workflows
  WHERE role IN ('EOSG', 'OPS', 'COMMS', 'Partnerships')
);

DELETE FROM public.workflows
WHERE role IN ('EOSG', 'OPS', 'COMMS', 'Partnerships');
