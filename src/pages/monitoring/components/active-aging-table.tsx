import { useNavigate } from 'react-router-dom'
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
import { getStatusColor } from '@/lib/status-colors'
import type { MonitoringActivity } from '@/services/monitoring'
import { computeAging, getAgingMetricLabel } from '@/services/monitoring'

export function ActiveAgingTable({ activities }: { activities: MonitoringActivity[] }) {
  const navigate = useNavigate()
  const metricLabel = getAgingMetricLabel(activities)

  const sorted = [...activities]
    .map((a) => ({ activity: a, aging: computeAging(a) }))
    .sort((a, b) => b.aging.days - a.aging.days)
    .slice(0, 10)

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-muted/30 py-3 px-4 border-b">
        <CardTitle className="text-sm font-semibold">Top Aging Activities</CardTitle>
        <p className="text-[10px] text-muted-foreground mt-0.5">Metric: {metricLabel}</p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/10 hover:bg-muted/10">
              <TableHead className="font-medium text-xs">Task #</TableHead>
              <TableHead className="font-medium text-xs">Activity</TableHead>
              <TableHead className="font-medium text-xs">Status</TableHead>
              <TableHead className="font-medium text-xs">Stage</TableHead>
              <TableHead className="font-medium text-xs">Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground text-sm">
                  No activities found.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map(({ activity: a, aging }) => (
                <TableRow
                  key={a.id}
                  className="cursor-pointer hover:bg-slate-50 dark:hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/tasks/${a.task_number || a.id}`)}
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
                  <TableCell className="text-xs">
                    <span className="font-semibold">{aging.days}d</span>
                    <span className="text-[10px] text-muted-foreground ml-1">{aging.label}</span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
