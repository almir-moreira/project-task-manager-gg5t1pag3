import { WORKFLOW_STEPS } from '@/pages/tasks/components/tabs/workflow-steps-config'
import { findInProgressIndex } from '@/lib/stage-aware-workflow'

export interface ComputedWorkflowStep {
  id: string
  name: string
  category: 'Planning' | 'Review' | 'Approval'
  order: number
  status: 'Completed' | 'In Progress' | 'Pending'
}

export function computeWorkflowSteps(
  activity: any,
  activityWorkflows: any[] = [],
  wfMap: Record<string, string> = {},
): ComputedWorkflowStep[] {
  const enabledSteps = WORKFLOW_STEPS.filter((s) => !!activity[s.enabledField])

  const steps: ComputedWorkflowStep[] = enabledSteps.map((s) => {
    const wfId = wfMap[s.workflowRole] ?? null
    const aw = wfId ? activityWorkflows.find((a) => a.workflow_id === wfId) : null

    let status: 'Completed' | 'In Progress' | 'Pending' = 'Pending'

    if (s.approvedField && activity[s.approvedField]) {
      status = 'Completed'
    }

    if (aw && (aw.status === 'Completed' || aw.status === 'Approved')) {
      status = 'Completed'
    }

    if (!s.approvedField && aw && aw.comments && aw.completed_at) {
      status = 'Completed'
    }

    const category = s.category === 'Feedback' ? 'Planning' : (s.category as 'Review' | 'Approval')

    return {
      id: s.id,
      name: s.displayName,
      category,
      order: s.order,
      status,
    }
  })

  const inProgressIndex = findInProgressIndex(
    steps.map((s) => ({ status: s.status, category: s.category })),
    activity.current_stage,
  )
  if (inProgressIndex !== -1) {
    steps[inProgressIndex].status = 'In Progress'
  }

  return steps
}

export function getProgressPercentage(steps: ComputedWorkflowStep[]): number {
  if (steps.length === 0) return 0
  const completed = steps.filter((s) => s.status === 'Completed').length
  return Math.round((completed / steps.length) * 100)
}
