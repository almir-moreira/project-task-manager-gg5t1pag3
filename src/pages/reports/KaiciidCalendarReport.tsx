import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { CalendarDays, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  getCalendarReport,
  type MonthGroup,
  type CalendarReportRow,
} from '@/services/calendar-report'
import { formatDate } from '@/lib/utils'

const DATE_FORMAT = 'd MMM yyyy'

const MONTH_HEADER_STYLE: CSSProperties = {
  backgroundColor: '#00576B',
}

const PROJECT_OWNER_STYLE: CSSProperties = {
  backgroundColor: '#DCFCE7',
  color: '#166534',
}

function getDisplayValue(value: string | null | undefined, fallback = '—'): string {
  if (value === null || value === undefined || value === '') return fallback
  return value
}

function getCategoryCellStyle(category: string | null | undefined): CSSProperties {
  const normalized = (category ?? '').toLowerCase().trim()
  if (normalized === 'participation') {
    return { backgroundColor: '#E5E7EB', color: '#374151' }
  }
  if (normalized === 'kaiciid event' || normalized === 'kaiciid co-organized event') {
    return { backgroundColor: '#DBEAFE', color: '#1E3A8A' }
  }
  return {}
}

function getApprovalCellStyle(status: string | null | undefined): CSSProperties {
  const normalized = (status ?? '').toLowerCase().trim()
  if (normalized === 'in process') {
    return { backgroundColor: '#FCA5A5', color: '#7F1D1D' }
  }
  if (normalized === 'approved') {
    return { backgroundColor: '#FFFFFF', color: '#111827' }
  }
  return {}
}

function getEmsProtocolLabel(row: CalendarReportRow): string {
  if (row.ems_protocol_involvement) return row.ems_protocol_involvement
  if (row.inv_ems && row.inv_protocol) return 'EMS & Protocol'
  if (row.inv_ems) return 'EMS'
  if (row.inv_protocol) return 'Protocol'
  return 'None'
}

function MonthSection({ group }: { group: MonthGroup }) {
  return (
    <Card className="mb-6 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3" style={MONTH_HEADER_STYLE}>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-white" />
          <span className="text-base font-semibold text-white">{group.monthLabel}</span>
        </div>
        <span className="text-sm font-normal text-white/80">
          {group.rows.length} event{group.rows.length !== 1 ? 's' : ''}
        </span>
      </div>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[1400px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b-2">
                <TableHead className="w-[100px] min-w-[100px] whitespace-nowrap">
                  Start Date
                </TableHead>
                <TableHead className="w-[100px] min-w-[100px] whitespace-nowrap">
                  End Date
                </TableHead>
                <TableHead className="min-w-[200px] max-w-[320px]">Name of Event</TableHead>
                <TableHead className="w-[140px] min-w-[120px]">Category</TableHead>
                <TableHead className="w-[130px] min-w-[120px]">Location</TableHead>
                <TableHead className="w-[60px] min-w-[60px] text-center whitespace-nowrap">
                  PAX
                </TableHead>
                <TableHead className="w-[110px] min-w-[110px] whitespace-nowrap">
                  Approval
                </TableHead>
                <TableHead className="w-[130px] min-w-[120px]">
                  Date &amp; Location Status
                </TableHead>
                <TableHead className="w-[130px] min-w-[120px]">Project Owner</TableHead>
                <TableHead className="min-w-[200px] max-w-[360px]">Short Description</TableHead>
                <TableHead className="w-[100px] min-w-[100px] whitespace-nowrap">
                  Cost Centre
                </TableHead>
                <TableHead className="w-[110px] min-w-[110px]">EMS / Protocol</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.rows.map((row) => {
                const rowId = row.id ?? row.activity_id
                const link = rowId ? `/tasks/${rowId}` : null
                const eventName = getDisplayValue(row.event_name || row.activity_name, '—')
                const approvalStatus = row.approval_status || row.event_approval_status
                const categoryStyle = getCategoryCellStyle(row.event_category)
                const approvalStyle = getApprovalCellStyle(approvalStatus)

                return (
                  <TableRow
                    key={rowId ?? `${row.start_date}-${row.event_name}`}
                    className={link ? 'cursor-pointer hover:bg-muted/50' : ''}
                  >
                    <TableCell className="whitespace-nowrap text-sm">
                      {row.start_date ? formatDate(row.start_date, DATE_FORMAT) : '—'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {row.end_date ? formatDate(row.end_date, DATE_FORMAT) : '—'}
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className="font-medium leading-snug break-words">{eventName}</span>
                    </TableCell>
                    <TableCell className="text-sm" style={categoryStyle}>
                      {getDisplayValue(row.event_category, 'Not specified')}
                    </TableCell>
                    <TableCell className="text-sm">
                      {getDisplayValue(row.location || row.event_location, 'Not specified')}
                    </TableCell>
                    <TableCell className="text-center text-sm whitespace-nowrap">
                      {row.pax !== null && row.pax !== undefined ? row.pax : '—'}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap" style={approvalStyle}>
                      {getDisplayValue(approvalStatus, '—')}
                    </TableCell>
                    <TableCell className="text-sm">
                      {getDisplayValue(row.date_location_status, 'Not specified')}
                    </TableCell>
                    <TableCell className="text-sm" style={PROJECT_OWNER_STYLE}>
                      {getDisplayValue(row.project_owner_name, 'Not specified')}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <span className="leading-snug break-words">
                        {getDisplayValue(row.short_description, '—')}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {getDisplayValue(row.cost_center_code, '—')}
                    </TableCell>
                    <TableCell className="text-sm">{getEmsProtocolLabel(row)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default function KaiciidCalendarReport() {
  const [groups, setGroups] = useState<MonthGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getCalendarReport()
      .then((data) => {
        if (!cancelled) {
          setGroups(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Calendar report error:', err)
          setError('Unable to load the KAICIID Events Calendar report.')
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">KAICIID Events Calendar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Chronological monthly overview of organization events and activities.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/">Back to Dashboard</Link>
        </Button>
      </div>

      {loading && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Skeleton className="h-4 w-4 rounded-full" />
            <span className="text-sm">Loading KAICIID Events Calendar...</span>
          </div>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="h-12 w-full rounded-none" />
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && !loading && (
        <Card className="border-destructive/50">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && groups.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 pt-12 pb-12">
            <CalendarDays className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No calendar events found. Events marked for calendar inclusion will appear here.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && groups.length > 0 && (
        <div>
          {groups.map((group) => (
            <MonthSection key={group.monthStart || group.monthLabel} group={group} />
          ))}
        </div>
      )}
    </div>
  )
}
