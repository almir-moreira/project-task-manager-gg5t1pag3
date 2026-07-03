import jsPDF from 'jspdf'
import 'jspdf-autotable'
import type { MonthGroup, CalendarReportRow } from '@/services/calendar-report'
import { formatDate } from '@/lib/utils'

const DATE_FORMAT = 'd MMM yyyy'
const TIMESTAMP_FORMAT = "d MMM yyyy 'at' HH:mm"

export interface PdfFilterState {
  year: string
  month: string
  category: string
  approval: string
  projectOwner: string
  location: string
  costCenter: string
}

const HEADERS = [
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

const COL_WIDTHS: Record<number, number> = {
  0: 18,
  1: 18,
  2: 38,
  3: 26,
  4: 22,
  5: 10,
  6: 18,
  7: 24,
  8: 22,
  9: 60,
  10: 16,
  11: 22,
}

const C_TEAL: [number, number, number] = [0, 87, 107]
const C_GREY: [number, number, number] = [229, 231, 235]
const C_BLUE: [number, number, number] = [219, 234, 254]
const C_RED: [number, number, number] = [252, 165, 165]
const C_WHITE: [number, number, number] = [255, 255, 255]
const C_GREEN: [number, number, number] = [220, 252, 231]

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

function filterSummary(f: PdfFilterState): string {
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

function rowToCells(r: CalendarReportRow): string[] {
  return [
    r.start_date ? formatDate(r.start_date, DATE_FORMAT) : '—',
    r.end_date ? formatDate(r.end_date, DATE_FORMAT) : '—',
    dv(r.event_name || r.activity_name),
    dv(normCat(r.event_category) || null, 'Not specified'),
    dv(r.location || r.event_location, 'Not specified'),
    r.pax !== null && r.pax !== undefined ? String(r.pax) : '—',
    dv(r.approval_status || r.event_approval_status),
    dv(r.date_location_status, 'Not specified'),
    dv(r.project_owner_name, 'Not specified'),
    dv(r.short_description),
    dv(r.cost_center_code),
    emsLabel(r),
  ]
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const img = new Image()
    img.src = '/kaiciid-logo.svg'
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Logo load failed'))
    })
    const canvas = document.createElement('canvas')
    const scale = 3
    canvas.width = img.naturalWidth * scale
    canvas.height = img.naturalHeight * scale
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.scale(scale, scale)
    ctx.drawImage(img, 0, 0)
    return canvas.toDataURL('image/png')
  } catch {
    return null
  }
}

export async function exportCalendarPdf(
  groups: MonthGroup[],
  filters: PdfFilterState,
): Promise<void> {
  const logoDataUrl = await loadLogoDataUrl()
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 1.5
  const headerY = 10

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, 'PNG', margin, headerY - 6, 30, 7.2)
  }

  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(17, 24, 39)
  const titleX = logoDataUrl ? margin + 32 : margin
  doc.text(`KAICIID CALENDAR ${filters.year || 'All Years'}`, titleX, headerY)

  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(75, 85, 99)
  doc.text(`Generated on: ${formatDate(new Date().toISOString(), TIMESTAMP_FORMAT)}`, margin, 15)
  doc.text(`Filters: ${filterSummary(filters)}`, margin, 19)

  let cursorY = 24

  for (const group of groups) {
    if (cursorY > pageHeight - 25) {
      doc.addPage()
      cursorY = 10
    }

    doc.setFillColor(...C_TEAL)
    doc.rect(margin, cursorY, pageWidth - 2 * margin, 5, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    const count = group.rows.length
    doc.text(
      `${group.monthLabel} — ${count} event${count !== 1 ? 's' : ''}`,
      margin + 2,
      cursorY + 3.5,
    )
    cursorY += 5

    ;(doc as any).autoTable({
      startY: cursorY,
      head: [HEADERS],
      body: group.rows.map(rowToCells),
      margin: { left: margin, right: margin, bottom: 10 },
      columnStyles: Object.fromEntries(
        Object.entries(COL_WIDTHS).map(([k, v]) => [k, { cellWidth: v }]),
      ),
      headStyles: {
        fillColor: C_TEAL,
        textColor: C_WHITE,
        fontSize: 6,
        fontStyle: 'bold',
        lineWidth: 0.1,
        lineColor: [209, 213, 219],
      },
      bodyStyles: {
        fontSize: 6,
        textColor: [17, 24, 39],
        lineWidth: 0.1,
        lineColor: [209, 213, 219],
        cellPadding: 1,
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      didParseCell: (data: any) => {
        if (data.section !== 'body') return
        const row = group.rows[data.row.index]
        if (!row) return
        const ci = data.column.index
        if (ci === 3) {
          const n = (row.event_category ?? '').toLowerCase().trim()
          if (n === 'participation') data.cell.styles.fillColor = C_GREY
          else if (n === 'kaiciid event' || n === 'kaiciid co-organized event')
            data.cell.styles.fillColor = C_BLUE
        }
        if (ci === 6) {
          const s = ((row.approval_status || row.event_approval_status) ?? '').toLowerCase().trim()
          if (s === 'in process') data.cell.styles.fillColor = C_RED
          else if (s === 'approved') data.cell.styles.fillColor = C_WHITE
        }
        if (ci === 8) data.cell.styles.fillColor = C_GREEN
      },
    })

    cursorY = ((doc as any).lastAutoTable?.finalY ?? cursorY) + 4
  }

  if (cursorY > pageHeight - 15) {
    doc.addPage()
    cursorY = 15
  }
  doc.setFontSize(7)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(102, 102, 102)
  doc.text(DISCLAIMER, margin, cursorY + 5, {
    maxWidth: pageWidth - 2 * margin,
  })

  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(75, 85, 99)
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 3, {
      align: 'center',
    })
  }

  doc.save(`KAICIID-Calendar-${filters.year || 'All-Years'}.pdf`)
}
