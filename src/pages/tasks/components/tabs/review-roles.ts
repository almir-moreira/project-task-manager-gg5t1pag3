export interface RoleConfig {
  label: string
  requiredField: string
  idField: string
  commentsField: string
  dateField: string
  approvedField: string
}

export const REVIEWER_ROLES: RoleConfig[] = [
  {
    label: 'Team Leader',
    requiredField: 'wf_team_leader_required',
    idField: 'reviewer_team_leader_id',
    commentsField: 'reviewer_team_leader_comments',
    dateField: 'reviewer_team_leader_date',
    approvedField: 'reviewer_team_leader_approved',
  },
  {
    label: 'Head',
    requiredField: 'wf_head_reviewer_required',
    idField: 'reviewer_head_id',
    commentsField: 'reviewer_head_comments',
    dateField: 'reviewer_head_date',
    approvedField: 'reviewer_head_approved',
  },
  {
    label: 'CPO',
    requiredField: 'wf_cpo_reviewer_required',
    idField: 'reviewer_cpo_id',
    commentsField: 'reviewer_cpo_comments',
    dateField: 'reviewer_cpo_date',
    approvedField: 'reviewer_cpo_approved',
  },
]

export const APPROVER_ROLES: RoleConfig[] = [
  {
    label: 'Head',
    requiredField: 'wf_head_approver_required',
    idField: 'approver_head_id',
    commentsField: 'approver_head_comments',
    dateField: 'approver_head_date',
    approvedField: 'approver_head_approved',
  },
  {
    label: 'CPO',
    requiredField: 'wf_cpo_approver_required',
    idField: 'approver_cpo_id',
    commentsField: 'approver_cpo_comments',
    dateField: 'approver_cpo_date',
    approvedField: 'approver_cpo_approved',
  },
  {
    label: 'SG',
    requiredField: 'wf_sg_approver_required',
    idField: 'approver_sg_id',
    commentsField: 'approver_sg_comments',
    dateField: 'approver_sg_date',
    approvedField: 'approver_sg_approved',
  },
]
