-- ============================================================================
-- DATA CLEANUP REPORT: Inconsistent Governing Bodies Workflow Key
-- ============================================================================
-- This report identifies records that may have been saved under inconsistent
-- workflow role keys ('GoB' vs 'Governing Bodies').
--
-- CONTEXT:
--   The feedbackService.ts used workflowRole: 'Governing Bodies' while
--   workflow-steps-config.tsx used workflowRole: 'GoB'. This mismatch caused
--   the workflow tracker to not find activity_workflow records created by
--   the Feedback UI for the Governing Bodies unit.
--
-- INSTRUCTIONS:
--   Run these SELECT queries manually to identify affected records.
--   DO NOT execute any UPDATE/DELETE statements until explicitly approved.
-- ============================================================================

-- 1. Workflow definitions with legacy 'GoB' role (should be 'Governing Bodies')
SELECT
    id,
    role,
    activity_id,
    category,
    stage,
    step,
    created_at
FROM public.workflows
WHERE role = 'GoB'
ORDER BY created_at;

-- 2. Activity workflows linked to legacy 'GoB' workflow definitions
SELECT
    aw.id,
    aw.activity_id,
    aw.workflow_id,
    aw.status,
    aw.comments,
    aw.completed_at,
    aw.reviewer_id,
    w.role AS workflow_role,
    a.task_number,
    a.activity_name
FROM public.activity_workflows aw
JOIN public.workflows w ON aw.workflow_id = w.id
WHERE w.role = 'GoB'
ORDER BY aw.created_at;

-- 3. Activities with Governing Bodies feedback enabled (wf_gob = true)
--    that may have activity_workflows under the legacy 'GoB' key
SELECT
    a.id,
    a.task_number,
    a.activity_name,
    a.wf_gob,
    a.wf_gob_reviewer_id,
    a.current_stage,
    a.status
FROM public.activities a
WHERE a.wf_gob = true
ORDER BY a.task_number;

-- 4. Check for duplicate workflow definitions (both 'GoB' and 'Governing Bodies')
SELECT
    role,
    count(*) AS definition_count
FROM public.workflows
WHERE role IN ('GoB', 'Governing Bodies')
  AND activity_id IS NULL
GROUP BY role;

-- 5. Activities that have activity_workflows under BOTH 'GoB' and
--    'Governing Bodies' workflow definitions (potential duplicates)
SELECT
    a.task_number,
    a.activity_name,
    gob_aw.id AS gob_aw_id,
    gob_aw.status AS gob_status,
    gob_aw.comments AS gob_comments,
    gb_aw.id AS gb_aw_id,
    gb_aw.status AS gb_status,
    gb_aw.comments AS gb_comments
FROM public.activities a
JOIN public.activity_workflows gob_aw ON gob_aw.activity_id = a.id
JOIN public.workflows gob_w ON gob_aw.workflow_id = gob_w.id AND gob_w.role = 'GoB'
LEFT JOIN public.activity_workflows gb_aw ON gb_aw.activity_id = a.id
JOIN public.workflows gb_w ON gb_aw.workflow_id = gb_w.id AND gb_w.role = 'Governing Bodies'
WHERE a.wf_gob = true
ORDER BY a.task_number;

-- 6. Specific check for A-10017 (mentioned in user story)
SELECT
    a.id,
    a.task_number,
    a.activity_name,
    a.wf_gob,
    a.wf_gob_reviewer_id,
    a.current_stage,
    a.status,
    w.role AS workflow_role,
    aw.id AS activity_workflow_id,
    aw.status AS aw_status,
    aw.comments AS aw_comments,
    aw.completed_at AS aw_completed_at
FROM public.activities a
LEFT JOIN public.activity_workflows aw ON aw.activity_id = a.id
LEFT JOIN public.workflows w ON aw.workflow_id = w.id
WHERE a.task_number = 'A-10017'
ORDER BY w.role;
