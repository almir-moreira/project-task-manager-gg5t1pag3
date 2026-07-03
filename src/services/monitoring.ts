import { supabase } from '@/lib/supabase/client'

export interface MonitoringActivity {
  id: string
  activity_name: string
  task_number: string | null
  current_stage: string | null
  stage_started_at: string | null
  updated_at: string | null
  status: string | null
  end_date: string | null
  assignee_id: string | null
  project_owner_id: string | null
  priority: string | null
  assignee: { name: string | null } | null
  project_owner: { name: string | null } | null
}

export interface MonitoringFilterState {
  status: string
  stage: string
  assignee: string
  owner: string
  dueDateRisk: string
}

const APPROVAL_STATUSES = [
  'SPM Clearance',
  'Head Clearance',
  'Head Approval',
  'CPO Approval',
  'SG Approval',
]
const DONE_STATUSES = ['Done', 'Rejected']

export async function fetchMonitoringData(): Promise<MonitoringActivity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select(
      `id, activity_name, task_number, current_stage, stage_started_at,
      updated_at, status, end_date, assignee_id, project_owner_id, priority,
      assignee:profiles!activities_assignee_id_fkey(name),
      project_owner:profiles!activities_project_owner_id_fkey(name)`,
    )
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []) as MonitoringActivity[]
}

export function getAgingHours(dateString?: string | null, fallback?: string | null): number {
  const date = dateString || fallback
  if (!date) return 0
  return Math.abs(new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60)
}

export function getAgingDays(dateString?: string | null, fallback?: string | null): number {
  return Math.floor(getAgingHours(dateString, fallback) / 24)
}

export function getAssigneeName(a: MonitoringActivity): string {
  return a.assignee?.name || 'Unassigned'
}

export function getOwnerName(a: MonitoringActivity): string {
  return a.project_owner?.name || 'Unassigned'
}

export function isPastDue(a: MonitoringActivity): boolean {
  if (!a.end_date || DONE_STATUSES.includes(a.status || '')) return false
  return new Date(a.end_date) < new Date()
}

export function isDelayedApproval(a: MonitoringActivity): boolean {
  return (
    APPROVAL_STATUSES.includes(a.status || '') &&
    getAgingHours(a.stage_started_at, a.updated_at) > 48
  )
}

export function getDueDateRisk(a: MonitoringActivity): string {
  if (!a.end_date) return 'No due date'
  if (DONE_STATUSES.includes(a.status || '')) return 'Future'
  const now = new Date()
  const due = new Date(a.end_date)
  if (due < now) return 'Overdue'
  const diffDays = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 7) return 'Due in next 7 days'
  if (diffDays <= 30) return 'Due in next 30 days'
  return 'Future'
}

export function getAgingBucket(days: number): string {
  if (days <= 2) return '0–2 days'
  if (days <= 7) return '3–7 days'
  if (days <= 14) return '8–14 days'
  if (days <= 30) return '15–30 days'
  return '30+ days'
}

export function applyFilters(
  activities: MonitoringActivity[],
  filters: MonitoringFilterState,
): MonitoringActivity[] {
  return activities.filter((a) => {
    if (filters.status !== 'all') {
      const status = a.status || 'Not specified'
      if (status !== filters.status) return false
    }
    if (filters.stage !== 'all' && (a.current_stage || 'Preparation') !== filters.stage)
      return false
    if (filters.assignee !== 'all' && getAssigneeName(a) !== filters.assignee) return false
    if (filters.owner !== 'all' && getOwnerName(a) !== filters.owner) return false
    if (filters.dueDateRisk !== 'all' && getDueDateRisk(a) !== filters.dueDateRisk) return false
    return true
  })
}

export const DEFAULT_FILTERS: MonitoringFilterState = {
  status: 'all',
  stage: 'all',
  assignee: 'all',
  owner: 'all',
  dueDateRisk: 'all',
}
