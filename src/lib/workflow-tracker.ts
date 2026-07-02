export type WorkflowStage = 'Planning' | 'Feedback' | 'Review' | 'Approval'
export type StepStatus = 'Pending' | 'In Progress' | 'Completed'

const STAGE_ORDER: Record<WorkflowStage, number> = {
  Planning: 0,
  Feedback: 1,
  Review: 2,
  Approval: 3,
}

interface StepConfig {
  id: string
  label: string
  stage: WorkflowStage
  stepOrder: number
  enabledField: string
  reviewerIdField: string
  approvedField?: string
  commentsField?: string
  dateField?: string
  workflowRole: string
}

const STEP_CONFIGS: StepConfig[] = [
  {
    id: 'eosg',
    label: 'EOSG Planning',
    stage: 'Planning',
    stepOrder: 1,
    enabledField: 'wf_eosg',
    reviewerIdField: 'wf_eosg_reviewer_id',
    workflowRole: 'EOSG',
  },
  {
    id: 'ops',
    label: 'OPS Planning',
    stage: 'Planning',
    stepOrder: 2,
    enabledField: 'wf_ops',
    reviewerIdField: 'wf_ops_reviewer_id',
    workflowRole: 'OPS',
  },
  {
    id: 'partnerships',
    label: 'Partnerships Feedback',
    stage: 'Feedback',
    stepOrder: 1,
    enabledField: 'wf_partnerships',
    reviewerIdField: 'wf_partnerships_reviewer_id',
    workflowRole: 'Partnerships',
  },
  {
    id: 'relex',
    label: 'Relex Feedback',
    stage: 'Feedback',
    stepOrder: 2,
    enabledField: 'wf_relex',
    reviewerIdField: 'wf_relex_reviewer_id',
    workflowRole: 'Relex',
  },
  {
    id: 'legal',
    label: 'Legal Feedback',
    stage: 'Feedback',
    stepOrder: 3,
    enabledField: 'wf_legal',
    reviewerIdField: 'wf_legal_reviewer_id',
    workflowRole: 'Legal',
  },
  {
    id: 'gob',
    label: 'GoB Feedback',
    stage: 'Feedback',
    stepOrder: 4,
    enabledField: 'wf_gob',
    reviewerIdField: 'wf_gob_reviewer_id',
    workflowRole: 'GoB',
  },
  {
    id: 'protocol',
    label: 'Protocol Feedback',
    stage: 'Feedback',
    stepOrder: 5,
    enabledField: 'wf_protocol',
    reviewerIdField: 'wf_protocol_reviewer_id',
    workflowRole: 'Protocol',
  },
  {
    id: 'ems',
    label: 'EMS Feedback',
    stage: 'Feedback',
    stepOrder: 6,
    enabledField: 'wf_ems',
    reviewerIdField: 'wf_ems_reviewer_id',
    workflowRole: 'EMS',
  },
  {
    id: 'procurement',
    label: 'Procurement Feedback',
    stage: 'Feedback',
    stepOrder: 7,
    enabledField: 'wf_procurement',
    reviewerIdField: 'wf_procurement_reviewer_id',
    workflowRole: 'Procurement',
  },
  {
    id: 'technology',
    label: 'Technology Feedback',
    stage: 'Feedback',
    stepOrder: 8,
    enabledField: 'wf_technology',
    reviewerIdField: 'wf_technology_reviewer_id',
    workflowRole: 'Technology',
  },
  {
    id: 'mne',
    label: 'M&E Feedback',
    stage: 'Feedback',
    stepOrder: 9,
    enabledField: 'wf_mne',
    reviewerIdField: 'wf_mne_reviewer_id',
    workflowRole: 'M&E',
  },
  {
    id: 'comms',
    label: 'Communications Feedback',
    stage: 'Feedback',
    stepOrder: 10,
    enabledField: 'wf_comms',
    reviewerIdField: 'wf_comms_reviewer_id',
    workflowRole: 'COMMS',
  },
  {
    id: 'social-media',
    label: 'Social Media Feedback',
    stage: 'Feedback',
    stepOrder: 11,
    enabledField: 'wf_social_media',
    reviewerIdField: 'wf_social_media_reviewer_id',
    workflowRole: 'Social Media',
  },
  {
    id: 'rev-team-leader',
    label: 'Team Leader Review',
    stage: 'Review',
    stepOrder: 1,
    enabledField: 'wf_team_leader_required',
    reviewerIdField: 'reviewer_team_leader_id',
    approvedField: 'reviewer_team_leader_approved',
    commentsField: 'reviewer_team_leader_comments',
    dateField: 'reviewer_team_leader_date',
    workflowRole: 'Team Leader Review',
  },
  {
    id: 'rev-head',
    label: 'Head Review',
    stage: 'Review',
    stepOrder: 2,
    enabledField: 'wf_head_reviewer_required',
    reviewerIdField: 'reviewer_head_id',
    approvedField: 'reviewer_head_approved',
    commentsField: 'reviewer_head_comments',
    dateField: 'reviewer_head_date',
    workflowRole: 'Head Review',
  },
  {
    id: 'rev-cpo',
    label: 'CPO Review',
    stage: 'Review',
    stepOrder: 3,
    enabledField: 'wf_cpo_reviewer_required',
    reviewerIdField: 'reviewer_cpo_id',
    approvedField: 'reviewer_cpo_approved',
    commentsField: 'reviewer_cpo_comments',
    dateField: 'reviewer_cpo_date',
    workflowRole: 'CPO Review',
  },
  {
    id: 'app-head',
    label: 'Head Approval',
    stage: 'Approval',
    stepOrder: 1,
    enabledField: 'wf_head_approver_required',
    reviewerIdField: 'approver_head_id',
    approvedField: 'approver_head_approved',
    commentsField: 'approver_head_comments',
    dateField: 'approver_head_date',
    workflowRole: 'Head Approval',
  },
  {
    id: 'app-cpo',
    label: 'CPO Approval',
    stage: 'Approval',
    stepOrder: 2,
    enabledField: 'wf_cpo_approver_required',
    reviewerIdField: 'approver_cpo_id',
    approvedField: 'approver_cpo_approved',
    commentsField: 'approver_cpo_comments',
    dateField: 'approver_cpo_date',
    workflowRole: 'CPO Approval',
  },
  {
    id: 'app-sg',
    label: 'Secretary General Approval',
    stage: 'Approval',
    stepOrder: 3,
    enabledField: 'wf_sg_approver_required',
    reviewerIdField: 'approver_sg_id',
    approvedField: 'approver_sg_approved',
    commentsField: 'approver_sg_comments',
    dateField: 'approver_sg_date',
    workflowRole: 'SG Approval',
  },
]

export interface TrackerStep {
  id: string
  label: string
  stage: WorkflowStage
  stageOrder: number
  stepOrder: number
  status: StepStatus
  reviewerId: string | null
  date: string | null
  comments: string
}

export interface TrackerStageGroup {
  name: WorkflowStage
  order: number
  steps: TrackerStep[]
}

export interface TrackerResult {
  steps: TrackerStep[]
  stages: TrackerStageGroup[]
  completedCount: number
  totalCount: number
  progressPercent: number
  currentStepName: string
  hasWorkflow: boolean
}

function normalizeStatus(raw: string): StepStatus {
  const s = raw.toLowerCase().trim()
  if (['completed', 'complete', 'approved', 'done'].includes(s)) return 'Completed'
  if (['in progress', 'in-progress', 'inprogress', 'active'].includes(s)) return 'In Progress'
  return 'Pending'
}

export function computeTracker(
  activity: Record<string, any>,
  activityWorkflows: any[],
  wfMap: Record<string, string>,
): TrackerResult {
  const enabled = STEP_CONFIGS.filter((c) => !!activity[c.enabledField])

  if (enabled.length === 0) {
    return {
      steps: [],
      stages: [],
      completedCount: 0,
      totalCount: 0,
      progressPercent: 0,
      currentStepName: 'Not started',
      hasWorkflow: false,
    }
  }

  const steps: TrackerStep[] = enabled.map((cfg) => {
    const wfId = wfMap[cfg.workflowRole] ?? null
    const aw = wfId ? activityWorkflows.find((a) => a.workflow_id === wfId) : null
    const reviewerId = activity[cfg.reviewerIdField] || aw?.reviewer_id || null

    let status: StepStatus = 'Pending'
    let comments = cfg.commentsField ? activity[cfg.commentsField] || '' : ''
    let date: string | null = cfg.dateField ? activity[cfg.dateField] || null : null

    if (aw) {
      if (aw.status) status = normalizeStatus(aw.status)
      if (aw.comments) comments = aw.comments
      if (aw.completed_at) date = aw.completed_at
    }

    if (cfg.approvedField && activity[cfg.approvedField]) {
      status = 'Completed'
    }

    return {
      id: cfg.id,
      label: cfg.label,
      stage: cfg.stage,
      stageOrder: STAGE_ORDER[cfg.stage],
      stepOrder: cfg.stepOrder,
      status,
      reviewerId,
      date,
      comments,
    }
  })

  steps.sort((a, b) => a.stageOrder - b.stageOrder || a.stepOrder - b.stepOrder)

  const firstPendingIdx = steps.findIndex((s) => s.status === 'Pending')
  if (firstPendingIdx !== -1) {
    steps[firstPendingIdx].status = 'In Progress'
  }

  const stageMap = new Map<WorkflowStage, TrackerStep[]>()
  for (const step of steps) {
    const arr = stageMap.get(step.stage) || []
    arr.push(step)
    stageMap.set(step.stage, arr)
  }

  const stages: TrackerStageGroup[] = Array.from(stageMap.entries())
    .map(([name, stepList]) => ({
      name,
      order: STAGE_ORDER[name],
      steps: stepList.sort((a, b) => a.stepOrder - b.stepOrder),
    }))
    .sort((a, b) => a.order - b.order)

  const completedCount = steps.filter((s) => s.status === 'Completed').length
  const totalCount = steps.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  let currentStepName = 'Completed'
  const inProgress = steps.find((s) => s.status === 'In Progress')
  if (inProgress) {
    currentStepName = inProgress.label
  } else {
    const firstNotCompleted = steps.find((s) => s.status !== 'Completed')
    if (firstNotCompleted) currentStepName = firstNotCompleted.label
  }

  return {
    steps,
    stages,
    completedCount,
    totalCount,
    progressPercent,
    currentStepName,
    hasWorkflow: true,
  }
}

export function getStatusStyles(status: StepStatus) {
  switch (status) {
    case 'Completed':
      return {
        bg: 'bg-[#DCFCE7]',
        border: 'border-[#86EFAC]',
        text: 'text-[#166534]',
        dot: 'bg-[#166534]',
      }
    case 'In Progress':
      return {
        bg: 'bg-[#DBEAFE]',
        border: 'border-[#93C5FD]',
        text: 'text-[#1E3A8A]',
        dot: 'bg-[#1E3A8A]',
      }
    default:
      return {
        bg: 'bg-[#FEE2E2]',
        border: 'border-[#FCA5A5]',
        text: 'text-[#991B1B]',
        dot: 'bg-[#991B1B]',
      }
  }
}
