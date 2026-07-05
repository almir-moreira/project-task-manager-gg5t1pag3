export interface PermissionUser {
  id: string
  role: string | null
  units: string[]
}

const UNIT_WF_FIELD_MAP: Record<string, string> = {
  Legal: 'wf_legal',
  EMS: 'wf_ems',
  RELEX: 'wf_relex',
  COMMD: 'wf_commd',
  Communications: 'wf_comms',
  COMMS: 'wf_comms',
  Procurement: 'wf_procurement',
  Protocol: 'wf_protocol',
  Partnerships: 'wf_partnerships',
  'Governing Bodies': 'wf_gob',
  GoB: 'wf_gob',
  'M&E': 'wf_mne',
  Technology: 'wf_technology',
  'Social Media': 'wf_social_media',
}

export function isAdmin(user: PermissionUser | null): boolean {
  return user?.role === 'Admin' || user?.role === 'Administrator'
}

export function canCreateActivity(user: PermissionUser | null): boolean {
  if (!user) return false
  return ['Admin', 'Administrator', 'Programme Manager', 'PROD Team Assistant'].includes(
    user.role || '',
  )
}

export function canEditActivity(user: PermissionUser | null, activity: any): boolean {
  if (!user || !activity) return false
  if (isAdmin(user)) return true
  if (activity.status === 'Done' || activity.status === 'Rejected') return false
  const isOwner = activity.project_owner_id === user.id
  const isAssignee = activity.assignee_id === user.id
  return isOwner || isAssignee
}

export function canProvideFeedback(
  user: PermissionUser | null,
  activity: any,
  unitLabel: string,
): boolean {
  if (!user || !activity) return false
  if (isAdmin(user)) return true
  const wfField = UNIT_WF_FIELD_MAP[unitLabel]
  if (!wfField || !activity[wfField]) return false
  return user.units.some((unitName) => UNIT_WF_FIELD_MAP[unitName] === wfField)
}

export function canApproveCurrentStep(
  user: PermissionUser | null,
  activity: any,
  step: string,
): boolean {
  if (!user || !activity) return false
  if (isAdmin(user)) return true

  const roleMatches: boolean = (() => {
    switch (step) {
      case 'SPM Clearance':
        return user.role === 'SPM'
      case 'Head Clearance':
      case 'Head Approval':
        return user.role === 'PROD Head' || user.role === 'Head'
      case 'CPO Approval':
        return user.role === 'CPO'
      case 'SG Approval':
        return user.role === 'EOSG Assistant'
      default:
        return false
    }
  })()

  if (!roleMatches) return false

  const stepAssigneeMap: Record<string, string[]> = {
    'SPM Clearance': ['reviewer_team_leader_id'],
    'Head Clearance': ['reviewer_head_id'],
    'Head Approval': ['approver_head_id'],
    'CPO Approval': ['reviewer_cpo_id', 'approver_cpo_id'],
    'SG Approval': ['approver_sg_id'],
  }

  const fields = stepAssigneeMap[step] || []
  return fields.some((f) => activity[f] === user.id)
}

export function canViewReport(user: PermissionUser | null, _report: string): boolean {
  if (!user) return false
  const allowedRoles = ['Admin', 'Administrator', 'CPO', 'PROD Head', 'Head', 'PROD Team Assistant']
  return allowedRoles.includes(user.role || '')
}
