export interface StageStatusSyncResult {
  needsSync: boolean
  updates: Record<string, any>
}

export function getStageStatusSync(activity: any): StageStatusSyncResult {
  if (!activity) return { needsSync: false, updates: {} }
  const status = activity.status
  const currentStage = activity.current_stage
  if (status === 'Done' && currentStage !== 'Done') {
    return { needsSync: true, updates: { current_stage: 'Done' } }
  }
  return { needsSync: false, updates: {} }
}

export function areAllRequiredApprovalsComplete(activity: any): boolean {
  if (!activity) return false
  if (activity.current_stage !== 'Approval') return false
  const checks: boolean[] = []
  if (activity.wf_head_approver_required) checks.push(!!activity.approver_head_approved)
  if (activity.wf_cpo_approver_required) checks.push(!!activity.approver_cpo_approved)
  if (activity.wf_sg_approver_required) checks.push(!!activity.approver_sg_approved)
  return checks.length > 0 && checks.every(Boolean)
}

export function getCompletionUpdates(): { status: string; current_stage: string } {
  return { status: 'Done', current_stage: 'Done' }
}
