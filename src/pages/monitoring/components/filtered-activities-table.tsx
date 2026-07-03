import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getStatusColor } from '@/lib/status-colors'
import { formatDate } from '@/lib/utils'
import { Eye } from 'lucide-react'
import type { MonitoringActivity } from '@/services/monitoring'
import { computeAging, getAgingMetricLabel } from '@/services/monitoring'

interface Props {
  activities: MonitoringActivity[]
}

export function FilteredActivitiesTable({ activities }: Props) {
  const metricLabel = getAgingMetricLabel(activities)

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-muted/30 py-3 px-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <CardTitle className="text-sm font-semibold">Filtered Activities</CardTitle>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Showing {activities.length} activit{activities.length === 1 ? 'y' : 'ies'} · Aging
            metric: {metricLabel}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/10 hover:bg-muted/10">
              <TableHead className="font-medium text-xs">Task Number</TableHead>
              <TableHead className="font-medium text-xs">Activity Name</TableHead>
              <TableHead className="font-medium text-xs">Status</TableHead>
              <TableHead className="font-medium text-xs">Current Stage</TableHead>
              <TableHead className="font-medium text-xs hidden md:table-cell">Assignee</TableHead>
              <TableHead className="font-medium text-xs hidden lg:table-cell">
                Project Owner
              </TableHead>
              <TableHead className="font-medium text-xs hidden sm:table-cell">Due Date</TableHead>
              <TableHead className="font-medium text-xs">Days in Stage / Age</TableHead>
              <TableHead className="font-medium text-xs">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground text-sm">
                  No activities found for the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              activities.map((a) => {
                const aging = computeAging(a)
                return (
                  <TableRow
                    key={a.id}
                    className="hover:bg-slate-50 dark:hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium text-xs">
                      {a.task_number || a.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs" title={a.activity_name}>
                      {a.activity_name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] border-0 ${getStatusColor(a.status)}`}
                      >
                        {a.status || 'To Do'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {a.current_stage || '-'}
                    </TableCell>
                    <TableCell className="text-xs hidden md:table-cell">
                      {a.assignee_name || 'Unassigned'}
                    </TableCell>
                    <TableCell className="text-xs hidden lg:table-cell">
                      {a.project_owner_name || '-'}
                    </TableCell>
                    <TableCell className="text-xs hidden sm:table-cell whitespace-nowrap">
                      {a.end_date ? formatDate(a.end_date, 'MMM d, yyyy') : '-'}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex flex-col">
                        <span className="font-semibold">{aging.days}d</span>
                        <span className="text-[10px] text-muted-foreground">{aging.label}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link to={`/tasks/${a.task_number || a.id}`}>
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                      </Link>
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
