import * as XLSX from 'xlsx'
import type { MonthGroup, CalendarReportRow } from '@/services/calendar-report'
import { formatDate } from '@/lib/utils'

const DATE_FORMAT = 'dd MMM yyyy'
const TIMESTAMP_FORMAT = "dd MMM yyyy 'at' HH:mm"

export interface ExportFilterState {
  year: string
  month: string
  category: string
  approval: string
  projectOwner: string
  location: string
  costCenter: string
}

const HEADERS = [
  'Month',
  'Start Date',
  'End Date',
  'Name of Event',
  'Category',
  'Location',
  'PAX',
  'Approval',
  'Date & Location Status',
  'Project Owner',
  'Short Description of Event',
  'Cost Centre',
  'Involvement of EMS / Protocol',
]

const DISCLAIMER =
  'Disclaimer: Events and dates are subject to change. This calendar represents the best information available at the time of issuance.'

function dv(v: string | null | undefined, fb = '—'): string {
  if (v === null || v === undefined || v === '') return fb
  return v
}

function normCat(v: string | null | undefined): string {
  if (!v) return ''
  const l = v.toLowerCase().trim()
  if (l === 'kaiciid event') return 'KAICIID Event'
  if (l === 'kaiciid co-organized event') return 'KAICIID Co-organized Event'
  if (l === 'participation') return 'Participation'
  return v
}

function emsLabel(r: CalendarReportRow): string {
  if (r.ems_protocol_involvement) return r.ems_protocol_involvement
  if (r.inv_ems && r.inv_protocol) return 'EMS & Protocol'
  if (r.inv_ems) return 'EMS'
  if (r.inv_protocol) return 'Protocol'
  return 'None'
}

function filterSummary(f: ExportFilterState): string {
  return [
    `Year ${f.year || 'All'}`,
    f.month === 'all' ? 'All months' : f.month,
    f.category === 'all' ? 'All categories' : f.category,
    f.approval === 'all' ? 'All approval statuses' : f.approval,
    f.projectOwner === 'all' ? 'All owners' : f.projectOwner,
    f.location === 'all' ? 'All locations' : f.location,
    f.costCenter === 'all' ? 'All cost centres' : f.costCenter,
  ].join(' | ')
}

function getPrimaryFilterSlug(filters: ExportFilterState): string {
  if (filters.approval !== 'all') return filters.approval.replace(/\s+/g, '-')
  if (filters.category !== 'all') return filters.category.replace(/\s+/g, '-')
  if (filters.month !== 'all') return filters.month.replace(/\s+/g, '-')
  if (filters.projectOwner !== 'all') return filters.projectOwner.replace(/\s+/g, '-')
  if (filters.location !== 'all') return filters.location.replace(/\s+/g, '-')
  if (filters.costCenter !== 'all') return filters.costCenter.replace(/\s+/g, '-')
  return 'All'
}

function rowToArray(row: CalendarReportRow, monthLabel: string): (string | number)[] {
  return [
    monthLabel || 'Unknown',
    row.start_date ? formatDate(row.start_date, DATE_FORMAT) : '—',
    row.end_date ? formatDate(row.end_date, DATE_FORMAT) : '—',
    dv(row.event_name || row.activity_name),
    dv(normCat(row.event_category) || null, 'Not specified'),
    dv(row.location || row.event_location, 'Not specified'),
    row.pax !== null && row.pax !== undefined ? row.pax : '—',
    dv(row.approval_status || row.event_approval_status),
    dv(row.date_location_status, 'Not specified'),
    dv(row.project_owner_name, 'Not specified'),
    dv(row.short_description),
    dv(row.cost_center_code),
    emsLabel(row),
  ]
}

function collectRows(groups: MonthGroup[]): { rows: (string | number)[][]; monthLabels: string[] } {
  const rows: (string | number)[][] = []
  const monthLabels: string[] = []
  for (const group of groups) {
    for (const row of group.rows) {
      rows.push(rowToArray(row, group.monthLabel))
      monthLabels.push(group.monthLabel)
    }
  }
  return { rows, monthLabels }
}

export function exportCalendarCsv(groups: MonthGroup[], filters: ExportFilterState): void {
  const { rows } = collectRows(groups)

  const csvLines: string[] = []
  csvLines.push(HEADERS.map(escapeCsvField).join(','))

  for (const row of rows) {
    csvLines.push(row.map((cell) => escapeCsvField(String(cell))).join(','))
  }

  const csvContent = csvLines.join('\r\n')
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `KAICIID-Calendar-${filters.year || 'All-Years'}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function exportCalendarExcel(groups: MonthGroup[], filters: ExportFilterState): void {
  const { rows } = collectRows(groups)
  const wb = XLSX.utils.book_new()

  const titleRow = [`KAICIID CALENDAR ${filters.year || 'All Years'}`]
  const generatedRow = [`Generated on: ${formatDate(new Date().toISOString(), TIMESTAMP_FORMAT)}`]
  const filtersRow = [`Filters: ${filterSummary(filters)}`]
  const blankRow: string[] = []

  const aoa: (string | number)[][] = [
    titleRow,
    generatedRow,
    filtersRow,
    blankRow,
    HEADERS,
    ...rows,
    blankRow,
    [DISCLAIMER],
  ]

  const ws = XLSX.utils.aoa_to_sheet(aoa)

  const colCount = HEADERS.length
  for (let c = 0; c < colCount; c++) {
    const colLetter = XLSX.utils.encode_col(c)
    let maxLen = 10
    for (const row of aoa) {
      const cellVal = row[c]
      if (cellVal !== undefined && cellVal !== null) {
        const len = String(cellVal).length
        if (len > maxLen) maxLen = len
      }
    }
    ws['!cols'] = ws['!cols'] || []
    ws['!cols'][c] = { wch: Math.min(maxLen + 2, 60) }
  }

  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: colCount - 1 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: colCount - 1 } },
    { s: { r: aoa.length - 1, c: 0 }, e: { r: aoa.length - 1, c: colCount - 1 } },
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'KAICIID Calendar')

  const primaryFilter = getPrimaryFilterSlug(filters)
  XLSX.writeFile(wb, `KAICIID-Calendar-${filters.year || 'All-Years'}-${primaryFilter}.xlsx`)
}
