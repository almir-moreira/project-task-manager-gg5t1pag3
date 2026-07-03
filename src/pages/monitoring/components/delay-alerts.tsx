import { Link } from 'react-router-dom'
import { Check, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { getAgingHours, isDelayedApproval } from '@/services/monitoring'

export function DelayAlerts({ activities }: { activities: MonitoringActivity[] }) {
  const delayed = activities.filter(isDelayedApproval)

  return (
    <Card className="border-red-200">
      <CardHeader className="bg-red-50/50 dark:bg-red-950/20 border-b border-red-100 dark:border-red-900/30">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <CardTitle>Delay Alerts (Approval &gt; 48h)</CardTitle>
        </div>
        <CardDescription>Activities in an approval state for more than 48 hours</CardDescription>
      </CardHeader>
      <CardContent className="p-0 overflow-y-auto max-h-[350px]">
        {delayed.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
            <Check className="w-8 h-8 text-emerald-500 mb-2 opacity-50" />
            No delayed approvals. Excellent!
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time in Stage</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {delayed.map((a) => (
                <TableRow key={a.id} className="bg-red-50/20 dark:bg-red-950/10">
                  <TableCell className="font-medium">
                    <Link
                      to={`/tasks/${a.task_number || a.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {a.task_number || a.id.slice(0, 8)}
                    </Link>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {a.activity_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {a.status || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive" className="font-mono">
                      {Math.floor(getAgingHours(a.stage_started_at, a.updated_at))} hours
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/tasks/${a.task_number || a.id}`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
