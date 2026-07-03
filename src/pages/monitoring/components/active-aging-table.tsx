import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { MonitoringActivity } from '@/services/monitoring'
import { getAgingDays, getAssigneeName } from '@/services/monitoring'

export function ActiveAgingTable({ activities }: { activities: MonitoringActivity[] }) {
  const active = activities
    .filter((a) => (a.current_stage || 'Preparation') !== 'Done')
    .sort(
      (a, b) =>
        getAgingDays(b.stage_started_at, b.updated_at) -
        getAgingDays(a.stage_started_at, a.updated_at),
    )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <CardTitle>Active Activities Aging</CardTitle>
        </div>
        <CardDescription>Days spent in the current workflow stage</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Number</TableHead>
              <TableHead>Activity Name</TableHead>
              <TableHead>Current Stage</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead className="hidden md:table-cell">Due Date</TableHead>
              <TableHead className="text-right">Days in Stage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {active.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No active activities to display.
                </TableCell>
              </TableRow>
            ) : (
              active.map((a) => {
                const days = getAgingDays(a.stage_started_at, a.updated_at)
                return (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      <Link
                        to={`/tasks/${a.task_number || a.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {a.task_number || 'Unnamed'}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={a.activity_name}>
                      {a.activity_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-muted">
                        {a.current_stage || 'Preparation'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{getAssigneeName(a)}</TableCell>
                    <TableCell className="text-xs hidden md:table-cell whitespace-nowrap">
                      {a.end_date || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-mono ${days > 14 ? 'text-red-600 font-bold' : days > 7 ? 'text-amber-600 font-bold' : ''}`}
                      >
                        {days} {days === 1 ? 'day' : 'days'}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
