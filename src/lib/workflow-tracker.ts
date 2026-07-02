import { WORKFLOW_STEPS } from '@/pages/tasks/components/tabs/workflow-steps-config'

export interface TrackerStep {
  id: string
  label: string
  status: 'Completed' | 'In Progress' | 'Pending'
  stage: string
  order: number
}

export interface TrackerStage {
  name: string
  steps: TrackerStep[]
}

export interface WorkflowTracker {
  hasWorkflow: boolean
  stages: TrackerStage[]
  completedCount: number
  totalCount: number
  progressPercent: number
  currentStepName: string
}

export interface StepStatusStyle {
  bg: string
  border: string
  text: string
  dot: string
}

const VISIBLE_STAGES = ['Feedback', 'Review', 'Approval'] as const

function getShortLabel(displayName: string, category: string): string {
  const suffix = ` ${category}`
  if (displayName.endsWith(suffix)) {
    return displayName.slice(0, -suffix.length)
  }
  return displayName
}

export function getStatusStyles(status: string): StepStatusStyle {
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

export function computeTracker(
  activity: any,
  activityWorkflows: any[] = [],
  wfMap: Record<string, string> = {},
): WorkflowTracker {
  const enabledSteps = WORKFLOW_STEPS.filter(
    (s) =>
      VISIBLE_STAGES.includes(s.category as (typeof VISIBLE_STAGES)[number]) &&
      !!activity[s.enabledField],
  )

  if (enabledSteps.length === 0) {
    return {
      hasWorkflow: false,
      stages: [],
      completedCount: 0,
      totalCount: 0,
      progressPercent: 0,
      currentStepName: '',
    }
  }

  const steps: TrackerStep[] = enabledSteps
    .map((s) => {
      const wfId = wfMap[s.workflowRole] ?? null
      const aw = wfId ? activityWorkflows.find((a) => a.workflow_id === wfId) : null

      let status: 'Completed' | 'In Progress' | 'Pending' = 'Pending'

      if (s.approvedField && activity[s.approvedField]) {
        status = 'Completed'
      }

      if (aw && (aw.status === 'Completed' || aw.status === 'Approved')) {
        status = 'Completed'
      }

      return {
        id: s.id,
        label: getShortLabel(s.displayName, s.category),
        status,
        stage: s.category,
        order: s.order,
      }
    })
    .sort((a, b) => a.order - b.order)

  const firstPendingIndex = steps.findIndex((s) => s.status === 'Pending')
  if (firstPendingIndex !== -1) {
    steps[firstPendingIndex].status = 'In Progress'
  }

  const stages: TrackerStage[] = VISIBLE_STAGES.map((stageName) => ({
    name: stageName,
    steps: steps.filter((s) => s.stage === stageName),
  })).filter((stage) => stage.steps.length > 0)

  const totalCount = steps.length
  const completedCount = steps.filter((s) => s.status === 'Completed').length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const currentStep = steps.find((s) => s.status === 'In Progress')
  const currentStepName = currentStep ? `${currentStep.label} (${currentStep.stage})` : ''

  return {
    hasWorkflow: true,
    stages,
    completedCount,
    totalCount,
    progressPercent,
    currentStepName,
  }
}
