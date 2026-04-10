import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getStatusColor } from '@/lib/status-colors'

const allStatuses = [
  'To Do',
  'In Progress',
  'On Hold',
  'SPM Clearance',
  'Head Clearance',
  'CPO Approval',
  'SG Approval',
  'Rejected',
  'Done',
]

export function ProgressBoard({ tasks = [] }: { tasks?: any[] }) {
  const counts = tasks.reduce(
    (acc, activity) => {
      acc[activity.status] = (acc[activity.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <Card className="shadow-sm border-border overflow-hidden">
      <CardHeader className="bg-muted/30 py-3 px-4 border-b border-border">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex overflow-x-auto pb-2 scrollbar-thin hide-scrollbar">
          {allStatuses.map((status, index) => {
            const count = counts[status] || 0
            const statusClass = getStatusColor(status)
            const bgClass =
              statusClass.split(' ').find((c) => c.startsWith('bg-')) || 'bg-slate-200'
            const borderColor = bgClass.replace('bg-', 'border-')

            return (
              <div
                key={status}
                className={cn(
                  'flex-shrink-0 flex flex-col items-center justify-center p-4 min-w-[120px] border-t-4',
                  borderColor,
                  index !== allStatuses.length - 1 && 'border-r border-r-border',
                )}
              >
                <span className="text-3xl font-light text-foreground">{count}</span>
                <span className="text-xs text-muted-foreground mt-1 font-medium text-center">
                  {status}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
