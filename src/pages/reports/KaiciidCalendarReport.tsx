import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

type CalendarReportRow = {
  start_date: string | null
  end_date: string | null
  event_name: string | null
  event_category: string | null
  location: string | null
  pax: number | null
  approval_status: string | null
  date_location_status: string | null
  project_owner_name: string | null
  short_description: string | null
  cost_center_code: string | null
  ems_protocol_involvement: string | null
  month_label: string | null
  sort_date: string | null
}

const formatValue = (value: string | null): string => {
  if (!value || value.trim() === '') return 'Not specified'
  return value
}

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function KaiciidCalendarReport() {
  const [data, setData] = useState<CalendarReportRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    setLoading(true)
    setError(false)
    const { data: result, error: err } = await supabase
      .from('calendar_report_view')
      .select(
        'start_date, end_date, event_name, event_category, location, pax, approval_status, date_location_status, project_owner_name, short_description, cost_center_code, ems_protocol_involvement, month_label, sort_date',
      )
      .order('sort_date', { ascending: true })
      .order('end_date', { ascending: true })
      .order('event_name', { ascending: true })

    if (err) {
      setError(true)
    } else {
      setData((result as CalendarReportRow[]) ?? [])
    }
    setLoading(false)
  }

  const groupedData = useMemo(() => {
    const groups: Record<string, CalendarReportRow[]> = {}
    const sorted = [...data].sort((a, b) => {
      const sortA = a.sort_date ?? ''
      const sortB = b.sort_date ?? ''
      if (sortA !== sortB) return sortA.localeCompare(sortB)
      const endA = a.end_date ?? ''
      const endB = b.end_date ?? ''
      if (endA !== endB) return endA.localeCompare(endB)
      const nameA = a.event_name ?? ''
      const nameB = b.event_name ?? ''
      return nameA.localeCompare(nameB)
    })

    for (const row of sorted) {
      const key = row.month_label ?? 'Unscheduled'
      if (!groups[key]) groups[key] = []
      groups[key].push(row)
    }

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [data])

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">KAICIID Events Calendar</h1>
        <p className="text-muted-foreground mt-1">
          Automated report of activities marked for calendar inclusion.
        </p>
      </div>

      {loading && (
        <Card>
          <CardHeader>
            <CardTitle>Loading KAICIID Events Calendar...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </CardContent>
        </Card>
      )}

      {error && !loading && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              Unable to load the KAICIID Events Calendar report.
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {!loading && !error && data.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground">No calendar activities found.</CardTitle>
          </CardHeader>
        </Card>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="space-y-8">
          {groupedData.map(([monthLabel, rows]) => (
            <Card key={monthLabel}>
              <CardHeader className="border-b bg-muted/40">
                <CardTitle className="text-lg">{monthLabel}</CardTitle>
                <CardDescription>{rows.length} event(s)</CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Name of Event</TableHead>
                      <TableHead>Event Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">PAX</TableHead>
                      <TableHead>Approval</TableHead>
                      <TableHead>Date & Location Status</TableHead>
                      <TableHead>Project Owner</TableHead>
                      <TableHead>Short Description</TableHead>
                      <TableHead>Cost Centre</TableHead>
                      <TableHead>Involvement of EMS/Protocol</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, idx) => (
                      <TableRow key={`${monthLabel}-${idx}`}>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(row.start_date)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(row.end_date)}
                        </TableCell>
                        <TableCell className="font-medium">{formatValue(row.event_name)}</TableCell>
                        <TableCell>{formatValue(row.event_category)}</TableCell>
                        <TableCell>{formatValue(row.location)}</TableCell>
                        <TableCell className="text-right">{row.pax ?? '—'}</TableCell>
                        <TableCell>{formatValue(row.approval_status)}</TableCell>
                        <TableCell>{formatValue(row.date_location_status)}</TableCell>
                        <TableCell>{formatValue(row.project_owner_name)}</TableCell>
                        <TableCell
                          className="max-w-[250px] truncate"
                          title={row.short_description ?? ''}
                        >
                          {formatValue(row.short_description)}
                        </TableCell>
                        <TableCell>{formatValue(row.cost_center_code)}</TableCell>
                        <TableCell>{formatValue(row.ems_protocol_involvement)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
