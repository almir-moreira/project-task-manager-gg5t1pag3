/**
 * Centralized permission and access-control logic for the application.
 *
 * All authorization rules — role-based, unit-based, and workflow-based —
 * are housed here so that every component enforces the same restrictions.
 *
 * -----------------------------------------------------------------------------
 * SAMPLE TEST SCENARIOS (developer validation)
 *
 * 1. Admin user editing a Done activity:
 *    isAdmin({ role: 'Admin' }) → true
 *    canEditActivity(adminUser, doneActivity) → true   (only admins can edit Done)
 *
 * 2. Programme Manager editing a To-Do activity they own:
 *    canEditActivity(pmUser, toDoActivity) → true      (is owner)
 *
 * 3. Read Only user trying to create an activity:
 *    canCreateActivity({ role: 'Read Only' }) → false
 *
 * 4. Feedback Unit User trying to create:
 *    canCreateActivity({ role: 'Feedback Unit User' }) → false
 *
 * 5. Legal unit member providing feedback on activity with wf_legal=true:
 *    canProvideFeedback(legalUser, activityWithWfLegal, 'Legal') → true
 *
 * 6. Non-legal user trying to provide legal feedback:
 *    canProvideFeedback(commsUser, activityWithWfLegal, 'Legal') → false
 *
 * 7. SPM approving SPM Clearance step where they are the reviewer_team_leader_id:
 *    canApproveCurrentStep(spmUser, activity, 'SPM Clearance') → true
 *
 * 8. CPO viewing kaiciid-calendar report:
 *    canViewReport(cpoUser, 'kaiciid-calendar') → true
 *
 * 9. Collaborator viewing kaiciid-calendar report:
 *    canViewReport(collaboratorUser, 'kaiciid-calendar') → false
 *
 * 10. Null / undefined safety:
 *     isAdmin(null) → false
 *     canEditActivity(null, activity) → false
 *     canEditActivity(user, null) → false
 * -----------------------------------------------------------------------------
 */

import type { Database } from '@/lib/supabase/types'

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

/** The full set of roles defined in the database `user_role` enum. */
export type UserRole = Database['public']['Enums']['user_role']

/** The full set of task statuses defined in the database `task_status` enum. */
export type TaskStatus = Database['public']['Enums']['task_status']

/**
 * Represents a user / profile for permission checks.
 * `units` is an array of unit names the user belongs to (via `user_units` link).
 */
export interface PermissionUser {
  id: string
  role: UserRole | null
  units: string[]
}

/**
 * Represents an activity (task) for permission checks.
 * Only the fields relevant to access-control are required.
 */
export interface PermissionActivity {
  id: string
  status: TaskStatus | null
  project_owner_id: string | null
  assignee_id: string | null
  // Unit-involvement flags
  wf_comms: boolean | null
  wf_eosg: boolean | null
  wf_ops: boolean | null
  wf_partnerships: boolean | null
  wf_relex: boolean | null
  wf_legal: boolean | null
  wf_gob: boolean | null
  wf_protocol: boolean | null
  wf_ems: boolean | null
  wf_procurement: boolean | null
  wf_technology: boolean | null
  wf_mne: boolean | null
  wf_social_media: boolean | null
  // Reviewer / approver assignment fields
  reviewer_team_leader_id: string | null
  reviewer_head_id: string | null
  reviewer_cpo_id: string | null
  approver_head_id: string | null
  approver_cpo_id: string | null
  approver_sg_id: string | null
  // Workflow-required flags
  wf_team_leader_required: boolean | null
  wf_head_reviewer_required: boolean | null
  wf_cpo_reviewer_required: boolean | null
  wf_head_approver_required: boolean | null
  wf_cpo_approver_required: boolean | null
  wf_sg_approver_required: boolean | null
}

/**
 * Represents a workflow step for permission checks.
 */
export interface PermissionWorkflowStep {
  role: string
  reviewer_id: string | null
}

// ---------------------------------------------------------------------------
// Role & Unit Mapping
// ---------------------------------------------------------------------------

/** Roles that are considered administrators (treated equivalently). */
export const ADMIN_ROLES: UserRole[] = ['Admin', 'Administrator']

/** Roles allowed to create activities. */
export const CREATE_ACTIVITY_ROLES: UserRole[] = [
  'Admin',
  'Administrator',
  'Programme Manager',
  'SPM',
  'PROD Head',
  'CPO',
  'PROD Team Assistant',
]

/** Roles explicitly denied activity creation. */
export const NO_CREATE_ROLES: UserRole[] = ['Read Only', 'Feedback Unit User']

/** Roles that may edit activities they own (non-admin). */
export const EDIT_ELIGIBLE_ROLES: UserRole[] = [
  'Project Manager',
  'SPM',
  'Programme Manager',
  'PROD Head',
  'CPO',
  'PROD Team Assistant',
  'Team Assistant',
]

/** Roles allowed to view reports. */
export const REPORT_VIEWER_ROLES: UserRole[] = [
  'Admin',
  'Administrator',
  'CPO',
  'PROD Head',
  'Head',
  'PROD Team Assistant',
  'Programme Manager',
]

/** Mapping from unit display names to the corresponding `wf_*` field on Activity. */
export const UNIT_WF_FIELD_MAP: Record<string, keyof PermissionActivity> = {
  Legal: 'wf_legal',
  EMS: 'wf_ems',
  RELEX: 'wf_relex',
  COMMD: 'wf_comms',
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

/** Mapping from workflow step label to the activity fields that store reviewer IDs. */
export const STEP_ASSIGNEE_MAP: Record<string, (keyof PermissionActivity)[]> = {
  'SPM Clearance': ['reviewer_team_leader_id'],
  'Head Clearance': ['reviewer_head_id'],
  'Head Approval': ['approver_head_id'],
  'CPO Approval': ['reviewer_cpo_id', 'approver_cpo_id'],
  'SG Approval': ['approver_sg_id'],
}

/** Mapping from workflow step label to the roles allowed to approve that step. */
export const STEP_ROLE_MAP: Record<string, UserRole[]> = {
  'SPM Clearance': ['SPM'],
  'Head Clearance': ['PROD Head', 'Head'],
  'Head Approval': ['PROD Head', 'Head'],
  'CPO Approval': ['CPO'],
  'SG Approval': ['EOSG Assistant'],
}

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Normalizes the user's role string for consistent comparison.
 * Treats `Administrator` as `Admin`.
 */
function normalizeRole(role: string | null | undefined): string | null {
  if (!role) return null
  if (role === 'Administrator') return 'Admin'
  return role
}

/**
 * Returns true if the user role is `Admin` or `Administrator`.
 * These two roles are treated as equivalent for administrative access.
 */
export function isAdmin(user: PermissionUser | null | undefined): boolean {
  if (!user || !user.role) return false
  const role = normalizeRole(user.role)
  return role === 'Admin'
}

/**
 * Returns true if the user role is `Read Only`.
 * Read Only users cannot perform any write operations.
 */
export function isReadOnly(user: PermissionUser | null | undefined): boolean {
  if (!user || !user.role) return false
  return user.role === 'Read Only'
}

/**
 * Checks if the user has a specific role.
 * Role normalization is applied so `hasRole(user, 'Admin')` returns true
 * for both `Admin` and `Administrator`.
 *
 * @param user   - The permission user object.
 * @param role   - The role to check against.
 */
export function hasRole(user: PermissionUser | null | undefined, role: UserRole): boolean {
  if (!user || !user.role) return false
  return normalizeRole(user.role) === normalizeRole(role)
}

/**
 * Checks if the user is associated with a specific unit via the `user_units` link.
 *
 * @param user      - The permission user object.
 * @param unitName  - The unit name to check (e.g., 'Legal', 'EMS').
 */
export function belongsToUnit(user: PermissionUser | null | undefined, unitName: string): boolean {
  if (!user || !user.units || user.units.length === 0) return false
  return user.units.includes(unitName)
}

/**
 * Returns true for Admin, Programme Manager, SPM, PROD Head, CPO, and
 * PROD Team Assistant roles. Returns false for Read Only and Feedback Unit Users.
 *
 * @param user - The permission user object.
 */
export function canCreateActivity(user: PermissionUser | null | undefined): boolean {
  if (!user || !user.role) return false
  if (NO_CREATE_ROLES.includes(user.role)) return false
  return CREATE_ACTIVITY_ROLES.includes(user.role)
}

/**
 * Determines whether the user may edit the given activity.
 *
 * Business rules:
 * - Admins can always edit (including Done activities).
 * - Non-admin users cannot edit activities with status `Done` or `Rejected`.
 * - The project owner can edit if the activity is not finalized.
 * - The assignee can edit if the activity is not finalized.
 * - Users with an eligible role (PM, SPM, etc.) can edit non-finalized activities.
 *
 * @param user     - The permission user object.
 * @param activity - The activity to check edit permissions for.
 */
export function canEditActivity(
  user: PermissionUser | null | undefined,
  activity: PermissionActivity | null | undefined,
): boolean {
  if (!user || !activity) return false
  if (isAdmin(user)) return true

  const status = activity.status
  if (status === 'Done' || status === 'Rejected') return false

  const isOwner = activity.project_owner_id === user.id
  const isAssignee = activity.assignee_id === user.id
  if (isOwner || isAssignee) return true

  const role = normalizeRole(user.role)
  if (role && EDIT_ELIGIBLE_ROLES.some((r) => normalizeRole(r) === role)) {
    return true
  }

  return false
}

/**
 * Returns true only if the user belongs to the specified unit AND the activity
 * has that unit's involvement flag enabled (e.g., `wf_legal` is true).
 *
 * @param user     - The permission user object.
 * @param activity - The activity to check.
 * @param unitName - The unit label (e.g., 'Legal', 'EMS').
 */
export function canProvideFeedback(
  user: PermissionUser | null | undefined,
  activity: PermissionActivity | null | undefined,
  unitName: string,
): boolean {
  if (!user || !activity) return false
  if (isAdmin(user)) return true

  const wfField = UNIT_WF_FIELD_MAP[unitName]
  if (!wfField) return false

  const isFlagEnabled = activity[wfField] === true
  if (!isFlagEnabled) return false

  return belongsToUnit(user, unitName)
}

/**
 * Returns true if the user's role matches the role required for the workflow step
 * OR if the user is explicitly assigned as the reviewer/approver for that step.
 *
 * @param user         - The permission user object.
 * @param activity     - The activity being approved.
 * @param workflowStep - The label of the workflow step (e.g., 'SPM Clearance').
 */
export function canApproveCurrentStep(
  user: PermissionUser | null | undefined,
  activity: PermissionActivity | null | undefined,
  workflowStep: string,
): boolean {
  if (!user || !activity) return false
  if (isAdmin(user)) return true

  // Check role match
  const allowedRoles = STEP_ROLE_MAP[workflowStep]
  if (allowedRoles && allowedRoles.includes(user.role)) {
    return true
  }

  // Check explicit assignment as reviewer/approver
  const fields = STEP_ASSIGNEE_MAP[workflowStep] || []
  return fields.some((field) => activity[field] === user.id)
}

/**
 * Defines visibility logic for specific reports based on roles.
 *
 * @param user        - The permission user object.
 * @param reportName  - The identifier of the report (e.g., 'kaiciid-calendar').
 */
export function canViewReport(
  user: PermissionUser | null | undefined,
  reportName: string,
): boolean {
  if (!user || !user.role) return false
  if (isAdmin(user)) return true

  // All authenticated users can view the calendar report (read-only report)
  if (reportName === 'kaiciid-calendar') {
    return REPORT_VIEWER_ROLES.includes(user.role)
  }

  // Default: only report viewers can see reports
  return REPORT_VIEWER_ROLES.includes(user.role)
}

/**
 * Returns true if the user can delete the given activity.
 * Only admins can delete activities.
 *
 * @param user - The permission user object.
 */
export function canDeleteActivity(user: PermissionUser | null | undefined): boolean {
  return isAdmin(user)
}

/**
 * Returns true if the user can manage users (create, update roles, delete).
 * Restricted to Admin and Administrator roles.
 *
 * @param user - The permission user object.
 */
export function canManageUsers(user: PermissionUser | null | undefined): boolean {
  return isAdmin(user)
}

/**
 * Returns true if the user can access the admin panel.
 * Admins and Programme Managers have access.
 *
 * @param user - The permission user object.
 */
export function canAccessAdmin(user: PermissionUser | null | undefined): boolean {
  if (!user || !user.role) return false
  if (isAdmin(user)) return true
  return user.role === 'Programme Manager'
}
