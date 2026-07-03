import { supabase } from '@/lib/supabase/client'

export interface CalendarReportRow {
  id: string | null
  activity_id: string | null
  task_number: string | null
  start_date: string | null
  end_date: string | null
  event_name: string | null
  activity_name: string | null
  event_category: string | null
  location: string | null
  event_location: string | null
  pax: number | null
  event_participants_count: number | null
  approval_status: string | null
  event_approval_status: string | null
  date_status: string | null
  event_date_status: string | null
  location_status: string | null
  event_location_status: string | null
  date_location_status: string | null
  short_description: string | null
  project_owner_id: string | null
  project_owner_name: string | null
  cost_center_id: string | null
  cost_center_code: string | null
  cost_center_name: string | null
  category_name: string | null
  category_id: string | null
  status: string | null
  priority: string | null
  current_stage: string | null
  created_at: string | null
  updated_at: string | null
  inv_ems: boolean | null
  inv_protocol: boolean | null
  event_include_calendar: boolean | null
  month_start: string | null
  month_label: string | null
  sort_date: string | null
  ems_protocol_involvement: string | null
}

export interface MonthGroup {
  monthStart: string
  monthLabel: string
  rows: CalendarReportRow[]
}

function groupByMonth(rows: CalendarReportRow[]): MonthGroup[] {
  const map = new Map<string, MonthGroup>()

  for (const row of rows) {
    const key = row.month_start ?? 'unknown'
    if (!map.has(key)) {
      map.set(key, {
        monthStart: row.month_start ?? '',
        monthLabel: row.month_label ?? 'Unknown',
        rows: [],
      })
    }
    map.get(key)!.rows.push(row)
  }

  const groups = Array.from(map.values())
  groups.sort((a, b) => {
    if (!a.monthStart) return 1
    if (!b.monthStart) return -1
    return a.monthStart.localeCompare(b.monthStart)
  })

  for (const group of groups) {
    group.rows.sort((a, b) => {
      const aSort = a.sort_date ?? a.start_date ?? ''
      const bSort = b.sort_date ?? b.start_date ?? ''
      if (aSort !== bSort) return aSort.localeCompare(bSort)
      const aEnd = a.end_date ?? ''
      const bEnd = b.end_date ?? ''
      if (aEnd !== bEnd) return aEnd.localeCompare(bEnd)
      const aName = a.event_name ?? a.activity_name ?? ''
      const bName = b.event_name ?? b.activity_name ?? ''
      return aName.localeCompare(bName)
    })
  }

  return groups
}

export async function getCalendarReport(): Promise<MonthGroup[]> {
  const { data, error } = await supabase
    .from('calendar_report_view')
    .select('*')
    .order('sort_date', { ascending: true })
    .order('end_date', { ascending: true })
    .order('event_name', { ascending: true })

  if (error) throw error

  return groupByMonth((data ?? []) as CalendarReportRow[])
}
