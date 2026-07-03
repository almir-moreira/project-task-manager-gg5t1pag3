import type { CalendarReportRow } from '@/services/calendar-report'

export interface FieldCheck {
  label: string
  critical: boolean
  getValue: (row: CalendarReportRow) => string | number | null | undefined
}

export const DATA_QUALITY_FIELDS: FieldCheck[] = [
  { label: 'Start Date', critical: true, getValue: (r) => r.start_date },
  { label: 'End Date', critical: true, getValue: (r) => r.end_date },
  { label: 'Name of Event', critical: true, getValue: (r) => r.event_name || r.activity_name },
  { label: 'Event Category', critical: true, getValue: (r) => r.event_category },
  { label: 'Location', critical: true, getValue: (r) => r.location || r.event_location },
  {
    label: 'Approval',
    critical: true,
    getValue: (r) => r.approval_status || r.event_approval_status,
  },
  { label: 'Date Status', critical: true, getValue: (r) => r.date_status || r.event_date_status },
  {
    label: 'Location Status',
    critical: true,
    getValue: (r) => r.location_status || r.event_location_status,
  },
  { label: 'Project Owner', critical: true, getValue: (r) => r.project_owner_name },
  { label: 'Cost Centre', critical: true, getValue: (r) => r.cost_center_code },
  { label: 'PAX', critical: false, getValue: (r) => r.pax },
  { label: 'Short Description', critical: false, getValue: (r) => r.short_description },
  {
    label: 'EMS/Protocol',
    critical: false,
    getValue: (r) => {
      if (r.ems_protocol_involvement) return r.ems_protocol_involvement
      if (r.inv_ems && r.inv_protocol) return 'EMS & Protocol'
      if (r.inv_ems) return 'EMS'
      if (r.inv_protocol) return 'Protocol'
      return null
    },
  },
]

export function isMissing(value: string | number | null | undefined): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'number') return false
  const trimmed = value.trim()
  return trimmed === '' || trimmed === 'Not specified' || trimmed === '—'
}

export interface DataQualityIssue {
  row: CalendarReportRow
  missingFields: string[]
}

export function validateRows(rows: CalendarReportRow[]): {
  summary: Array<{ label: string; count: number }>
  affected: DataQualityIssue[]
} {
  const countMap = new Map<string, number>()
  for (const field of DATA_QUALITY_FIELDS) {
    countMap.set(field.label, 0)
  }

  const affected: DataQualityIssue[] = []

  for (const row of rows) {
    const missing: string[] = []
    for (const field of DATA_QUALITY_FIELDS) {
      if (isMissing(field.getValue(row))) {
        missing.push(field.label)
        countMap.set(field.label, (countMap.get(field.label) ?? 0) + 1)
      }
    }
    if (missing.length > 0) {
      affected.push({ row, missingFields: missing })
    }
  }

  const summary = Array.from(countMap.entries())
    .filter(([, count]) => count > 0)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)

  return { summary, affected }
}
