-- Add indexes for performant dashboard queries
CREATE INDEX IF NOT EXISTS idx_activity_workflows_activity_id ON public.activity_workflows(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_workflows_workflow_id ON public.activity_workflows(workflow_id);
CREATE INDEX IF NOT EXISTS idx_activity_workflows_status ON public.activity_workflows(status);
CREATE INDEX IF NOT EXISTS idx_activity_workflows_reviewer_id ON public.activity_workflows(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_activity_workflows_created_at ON public.activity_workflows(created_at);

-- Clean up orphaned 'Governing Bodies' workflow (code uses 'GoB')
DELETE FROM public.activity_workflows WHERE workflow_id IN (
  SELECT id FROM public.workflows WHERE role = 'Governing Bodies' AND activity_id IS NULL
);
DELETE FROM public.workflows WHERE role = 'Governing Bodies' AND activity_id IS NULL;

-- Ensure all 17 workflow definitions exist
-- 6 Review/Approval workflows
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
  SELECT 1 FROM public.workflows w WHERE w.role = t.role AND w.activity_id IS NULL
);

-- 11 Feedback workflows
INSERT INTO public.workflows (role, stage, step, category)
SELECT * FROM (VALUES
  ('Partnerships', 3, 1, 'Feedback'),
  ('Relex', 3, 2, 'Feedback'),
  ('Legal', 3, 3, 'Feedback'),
  ('GoB', 3, 4, 'Feedback'),
  ('Protocol', 3, 5, 'Feedback'),
  ('EMS', 3, 6, 'Feedback'),
  ('Procurement', 3, 7, 'Feedback'),
  ('Technology', 3, 8, 'Feedback'),
  ('M&E', 3, 9, 'Feedback'),
  ('COMMS', 3, 10, 'Feedback'),
  ('Social Media', 3, 11, 'Feedback')
) AS t(role, stage, step, category)
WHERE NOT EXISTS (
  SELECT 1 FROM public.workflows w WHERE w.role = t.role AND w.activity_id IS NULL
);

-- Backfill activity_workflows for existing activities with boolean flags set
DO $$
DECLARE
  mapping RECORD;
  act RECORD;
  wf_id UUID;
BEGIN
  FOR mapping IN
    SELECT * FROM (VALUES
      ('wf_partnerships', 'wf_partnerships_reviewer_id', 'Partnerships'),
      ('wf_relex', 'wf_relex_reviewer_id', 'Relex'),
      ('wf_legal', 'wf_legal_reviewer_id', 'Legal'),
      ('wf_gob', 'wf_gob_reviewer_id', 'GoB'),
      ('wf_protocol', 'wf_protocol_reviewer_id', 'Protocol'),
      ('wf_ems', 'wf_ems_reviewer_id', 'EMS'),
      ('wf_procurement', 'wf_procurement_reviewer_id', 'Procurement'),
      ('wf_technology', 'wf_technology_reviewer_id', 'Technology'),
      ('wf_mne', 'wf_mne_reviewer_id', 'M&E'),
      ('wf_comms', 'wf_comms_reviewer_id', 'COMMS'),
      ('wf_social_media', 'wf_social_media_reviewer_id', 'Social Media'),
      ('wf_team_leader_required', 'reviewer_team_leader_id', 'Team Leader Review'),
      ('wf_head_reviewer_required', 'reviewer_head_id', 'Head Review'),
      ('wf_cpo_reviewer_required', 'reviewer_cpo_id', 'CPO Review'),
      ('wf_head_approver_required', 'approver_head_id', 'Head Approval'),
      ('wf_cpo_approver_required', 'approver_cpo_id', 'CPO Approval'),
      ('wf_sg_approver_required', 'approver_sg_id', 'SG Approval')
    ) AS t(bool_col, reviewer_col, workflow_role)
  LOOP
    SELECT id INTO wf_id FROM public.workflows
    WHERE role = mapping.workflow_role AND activity_id IS NULL LIMIT 1;

    IF wf_id IS NOT NULL THEN
      FOR act IN EXECUTE format(
        'SELECT id, %I as reviewer_val FROM public.activities WHERE %I = true',
        mapping.reviewer_col, mapping.bool_col
      )
      LOOP
        INSERT INTO public.activity_workflows (activity_id, workflow_id, reviewer_id, status)
        VALUES (act.id, wf_id, act.reviewer_val, 'Pending')
        ON CONFLICT (activity_id, workflow_id) DO NOTHING;
      END LOOP;
    END IF;
  END LOOP;
END $$;
