import { supabase } from '@/lib/supabase/client'

export interface MonitoringActivity {
  id: string
  task_number: string | null
  activity_name: string
  status: string | null
  priority: string | null
  current_stage: string | null
  assignee_id: string | null
  assignee_name: string | null
  project_owner_id: string | null
  project_owner_name: string | null
  project: string | null
  start_date: string | null
  end_date: string | null
  created_at: string | null
  updated_at: string | null
  stage_started_at: string | null
  cost_estimated: number | null
}

export interface MonitoringFilterState {
  statuses: string[]
  assigneeId: string | null
  stage: string | null
  priority: string | null
  project: string | null
  dueDateRisk: string | null
  approvalDelay: boolean
  unassigned: boolean
}

export const DEFAULT_FILTERS: MonitoringFilterState = {
  statuses: [],
  assigneeId: null,
  stage: null,
  priority: null,
  project: null,
  dueDateRisk: null,
  approvalDelay: false,
  unassigned: false,
}

const APPROVAL_STAGES = [
  'SPM Clearance',
  'Head Clearance',
  'Head Approval',
  'CPO Approval',
  'SG Approval',
]

export async function fetchMonitoringData(): Promise<MonitoringActivity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select(`
      id, task_number, activity_name, status, priority, current_stage,
      assignee_id, project_owner_id, project, start_date, end_date,
      created_at, updated_at, stage_started_at, cost_estimated,
      assignee:profiles!activities_assignee_id_fkey(name),
      project_owner:profiles!activities_project_owner_id_fkey(name)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []).map((row: any) => ({
    id: row.id,
    task_number: row.task_number,
    activity_name: row.activity_name || '',
    status: row.status,
    priority: row.priority,
    current_stage: row.current_stage,
    assignee_id: row.assignee_id,
    assignee_name: row.assignee?.name || null,
    project_owner_id: row.project_owner_id,
    project_owner_name: row.project_owner?.name || null,
    project: row.project,
    start_date: row.start_date,
    end_date: row.end_date,
    created_at: row.created_at,
    updated_at: row.updated_at,
    stage_started_at: row.stage_started_at,
    cost_estimated: row.cost_estimated,
  }))
}

export function computeAging(activity: MonitoringActivity): { days: number; label: string } {
  const now = new Date()
  if (activity.stage_started_at) {
    const diff = Math.floor(
      (now.getTime() - new Date(activity.stage_started_at).getTime()) / 86400000,
    )
    return { days: diff, label: 'Days in current stage' }
  }
  if (activity.updated_at) {
    const diff = Math.floor((now.getTime() - new Date(activity.updated_at).getTime()) / 86400000)
    return { days: diff, label: 'Days since last update' }
  }
  if (activity.created_at) {
    const diff = Math.floor((now.getTime() - new Date(activity.created_at).getTime()) / 86400000)
    return { days: diff, label: 'Age since creation' }
  }
  return { days: 0, label: 'Age since creation' }
}

export function getDueDateRisk(activity: MonitoringActivity): string {
  if (!activity.end_date || activity.status === 'Done' || activity.status === 'Rejected')
    return 'No Due Date'
  const diffDays = Math.ceil((new Date(activity.end_date).getTime() - Date.now()) / 86400000)
  if (diffDays < 0) return 'Overdue'
  if (diffDays <= 7) return 'Due Soon'
  return 'On Time'
}

export function isApprovalDelayed(activity: MonitoringActivity): boolean {
  if (!APPROVAL_STAGES.includes(activity.status || '')) return false
  if (!activity.stage_started_at) return false
  return (Date.now() - new Date(activity.stage_started_at).getTime()) / 3600000 > 48
}

export function applyFilters(
  activities: MonitoringActivity[],
  filters: MonitoringFilterState,
): MonitoringActivity[] {
  return activities.filter((a) => {
    if (filters.statuses.length > 0 && !filters.statuses.includes(a.status || 'To Do')) return false
    if (filters.assigneeId && a.assignee_id !== filters.assigneeId) return false
    if (filters.unassigned && a.assignee_id !== null) return false
    if (filters.stage && a.current_stage !== filters.stage) return false
    if (filters.priority && a.priority !== filters.priority) return false
    if (filters.project && a.project !== filters.project) return false
    if (filters.dueDateRisk && getDueDateRisk(a) !== filters.dueDateRisk) return false
    if (filters.approvalDelay && !isApprovalDelayed(a)) return false
    return true
  })
}

export function getAgingMetricLabel(activities: MonitoringActivity[]): string {
  const hasStageStarted = activities.some((a) => a.stage_started_at)
  if (hasStageStarted) return 'Days in current stage (stage_started_at)'
  const hasUpdatedAt = activities.some((a) => a.updated_at)
  if (hasUpdatedAt) return 'Days since last update (updated_at)'
  return 'Age since creation (created_at)'
}
