import { useMemo } from 'react'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import type { CalendarReportRow } from '@/services/calendar-report'
import { validateRows } from './data-quality-utils'

interface DataQualityWarningsProps {
  rows: CalendarReportRow[]
}

export function DataQualityWarnings({ rows }: DataQualityWarningsProps) {
  const { summary, affected } = useMemo(() => validateRows(rows), [rows])

  if (rows.length === 0) return null

  if (affected.length === 0) {
    return (
      <Card className="mb-6 border-emerald-200 bg-emerald-50">
        <CardContent className="flex items-center gap-2 py-3 px-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="text-sm text-emerald-800">
            No data quality issues found for the selected filters.
          </span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6 border-amber-200 bg-amber-50">
      <CardContent className="py-4 px-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <h3 className="text-sm font-semibold text-amber-900">Data Quality Warnings</h3>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
          {summary.map(({ label, count }) => (
            <span key={label} className="text-xs text-amber-800">
              {count} {count === 1 ? 'activity is' : 'activities are'} missing {label}.
            </span>
          ))}
        </div>

        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {affected.map(({ row, missingFields }) => {
            const rowId = row.id ?? row.activity_id
            const linkId = row.task_number || rowId
            const link = linkId ? `/tasks/${linkId}` : null
            const eventName = (row.event_name || row.activity_name || 'Untitled').trim()
            const taskNum = row.task_number || '—'

            return (
              <div
                key={rowId ?? `${row.start_date}-${eventName}`}
                className="text-xs text-amber-900"
              >
                {link ? (
                  <Link
                    to={link}
                    title="Open activity"
                    className="font-medium underline hover:text-amber-700"
                  >
                    {taskNum} — {eventName}
                  </Link>
                ) : (
                  <span className="font-medium">
                    {taskNum} — {eventName}
                  </span>
                )}
                <span className="text-amber-700"> | Missing: {missingFields.join(', ')}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
