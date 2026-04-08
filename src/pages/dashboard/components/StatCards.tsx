import { Card, CardContent } from '@/components/ui/card'
import { useAppContext } from '@/stores/main'
import { TaskStatus } from '@/lib/types'
import { CheckCircle2, Clock, AlertCircle, PauseCircle, XCircle, ListTodo } from 'lucide-react'
import { cn } from '@/lib/utils'

const config: Record<TaskStatus, { icon: any; bg: string; text: string }> = {
  'To Do': {
    icon: ListTodo,
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-300',
  },
  'In Progress': {
    icon: Clock,
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
  },
  'Past Due': {
    icon: AlertCircle,
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-600 dark:text-red-400',
  },
  'On Hold': {
    icon: PauseCircle,
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-600 dark:text-amber-400',
  },
  Rejected: {
    icon: XCircle,
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-600 dark:text-orange-400',
  },
  Done: {
    icon: CheckCircle2,
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  'SPM Clearance': { icon: Clock, bg: 'bg-blue-50', text: 'text-blue-500' },
  'Head Clearance': { icon: Clock, bg: 'bg-blue-50', text: 'text-blue-500' },
  'CPO Approval': { icon: Clock, bg: 'bg-blue-50', text: 'text-blue-500' },
  'SG Approval': { icon: Clock, bg: 'bg-blue-50', text: 'text-blue-500' },
}

export function StatCards() {
  const { tasks } = useAppContext()

  const displayStatuses: TaskStatus[] = [
    'To Do',
    'In Progress',
    'Past Due',
    'On Hold',
    'Rejected',
    'Done',
  ]

  const counts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {displayStatuses.map((status) => {
        const conf = config[status]
        const Icon = conf.icon
        return (
          <Card
            key={status}
            className={cn('border-none shadow-sm hover:shadow-md transition-shadow', conf.bg)}
          >
            <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center justify-center gap-2">
              <Icon className={cn('w-8 h-8', conf.text)} />
              <div className="space-y-1">
                <p className={cn('text-3xl font-bold tracking-tighter', conf.text)}>
                  {counts[status] || 0}
                </p>
                <p className={cn('text-xs font-medium uppercase tracking-wider', conf.text)}>
                  {status}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
