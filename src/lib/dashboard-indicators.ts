import { computeTracker, TrackerStage } from '@/lib/workflow-tracker'

export interface ActivityIndicators {
  currentStage: string | null
  isOverdue: boolean
  pendingFeedback: boolean
  completedFeedbackCount: number
  totalFeedbackCount: number
  pendingReview: boolean
  pendingApproval: boolean
  finalApprovalPending: boolean
}

export function deriveIndicators(
  activity: any,
  activityWorkflows: any[] = [],
  wfMap: Record<string, string> = {},
): ActivityIndicators {
  const tracker = computeTracker(activity, activityWorkflows, wfMap)
  const currentStage = activity.current_stage || null

  const isOverdue =
    !!activity.end_date &&
    new Date(activity.end_date) < new Date() &&
    activity.status !== 'Done' &&
    activity.status !== 'Rejected'

  const feedbackStage = tracker.stages.find((s: TrackerStage) => s.name === 'Feedback')
  const reviewStage = tracker.stages.find((s: TrackerStage) => s.name === 'Review')
  const approvalStage = tracker.stages.find((s: TrackerStage) => s.name === 'Approval')

  const totalFeedbackCount = feedbackStage?.steps.length ?? 0
  const completedFeedbackCount =
    feedbackStage?.steps.filter((s) => s.status === 'Completed').length ?? 0
  const pendingFeedback = totalFeedbackCount > 0 && completedFeedbackCount < totalFeedbackCount
  const pendingReview = reviewStage
    ? reviewStage.steps.some((s) => s.status !== 'Completed')
    : false
  const pendingApproval = approvalStage
    ? approvalStage.steps.some((s) => s.status !== 'Completed')
    : false
  const finalApprovalPending =
    !!currentStage && currentStage.toLowerCase().includes('approval') && pendingApproval

  return {
    currentStage,
    isOverdue,
    pendingFeedback,
    completedFeedbackCount,
    totalFeedbackCount,
    pendingReview,
    pendingApproval,
    finalApprovalPending,
  }
}
