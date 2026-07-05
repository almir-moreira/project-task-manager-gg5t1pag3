import {
  canApproveCurrentStep,
  isAdmin,
  isActivityFinalized,
  type PermissionActivity,
  type PermissionUser,
} from '@/lib/permissions'

export interface ApprovalStepDef {
  id: string
  requiredField: string
  approvedField: string
  stepName: string
}

export const APPROVAL_STEPS_ORDER: ApprovalStepDef[] = [
  {
    id: 'rev-team-leader',
    requiredField: 'wf_team_leader_required',
    approvedField: 'reviewer_team_leader_approved',
    stepName: 'SPM Clearance',
  },
  {
    id: 'rev-head',
    requiredField: 'wf_head_reviewer_required',
    approvedField: 'reviewer_head_approved',
    stepName: 'Head Clearance',
  },
  {
    id: 'rev-cpo',
    requiredField: 'wf_cpo_reviewer_required',
    approvedField: 'reviewer_cpo_approved',
    stepName: 'CPO Approval',
  },
  {
    id: 'app-head',
    requiredField: 'wf_head_approver_required',
    approvedField: 'approver_head_approved',
    stepName: 'Head Approval',
  },
  {
    id: 'app-cpo',
    requiredField: 'wf_cpo_approver_required',
    approvedField: 'approver_cpo_approved',
    stepName: 'CPO Approval',
  },
  {
    id: 'app-sg',
    requiredField: 'wf_sg_approver_required',
    approvedField: 'approver_sg_approved',
    stepName: 'SG Approval',
  },
]

export const ROLE_TO_STEP_NAME: Record<string, string> = {
  'Team Leader Review': 'SPM Clearance',
  'Head Review': 'Head Clearance',
  'Head Approval': 'Head Approval',
  'CPO Approval': 'CPO Approval',
  'SG Approval': 'SG Approval',
  'CPO Review': 'CPO Approval',
}

export type StepState = 'completed' | 'active' | 'future' | 'not-required'

export function getApprovalStepState(
  activity: PermissionActivity | null | undefined,
  approvedField: string,
): StepState {
  if (!activity) return 'not-required'
  const step = APPROVAL_STEPS_ORDER.find((s) => s.approvedField === approvedField)
  if (!step) return 'not-required'
  const a = activity as any
  if (!a[step.requiredField]) return 'not-required'
  if (a[step.approvedField]) return 'completed'
  const firstActive = APPROVAL_STEPS_ORDER.find((s) => a[s.requiredField] && !a[s.approvedField])
  if (firstActive && firstActive.approvedField === approvedField) return 'active'
  return 'future'
}

export interface ApprovalActionResult {
  allowed: boolean
  reason: string
  stepState: StepState
}

export function canActOnApprovalStep(
  user: PermissionUser | null | undefined,
  activity: PermissionActivity | null | undefined,
  approvedField: string,
  workflowStep: string,
): ApprovalActionResult {
  const stepState = getApprovalStepState(activity, approvedField)

  if (stepState === 'not-required') {
    return { allowed: false, reason: 'This step is not required for this activity.', stepState }
  }

  if (!user) {
    return {
      allowed: false,
      reason: 'You can view this approval step, but you do not have permission to act on it.',
      stepState,
    }
  }

  if (isAdmin(user)) {
    return { allowed: true, reason: 'Admin override active.', stepState }
  }

  if (isActivityFinalized(activity)) {
    return {
      allowed: false,
      reason: 'This activity is finalized and cannot be modified.',
      stepState,
    }
  }

  if (stepState === 'completed') {
    return { allowed: false, reason: 'This step has already been completed.', stepState }
  }

  if (stepState === 'future') {
    return {
      allowed: false,
      reason: 'This step has not been reached in the workflow yet.',
      stepState,
    }
  }

  if (!canApproveCurrentStep(user, activity, workflowStep)) {
    return {
      allowed: false,
      reason: 'You can view this approval step, but you do not have permission to act on it.',
      stepState,
    }
  }

  return { allowed: true, reason: 'You are authorized to act on this step.', stepState }
}
