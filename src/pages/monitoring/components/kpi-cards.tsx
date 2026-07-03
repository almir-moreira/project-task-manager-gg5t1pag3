import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  ListTodo,
  Clock,
  AlertCircle,
  PauseCircle,
  XCircle,
  CheckCircle2,
  Activity,
  AlertTriangle,
} from 'lucide-react'
import type { MonitoringActivity } from '@/services/monitoring'
import { isPastDue, isDelayedApproval } from '@/services/monitoring'

interface KpiCardsProps {
  activities: MonitoringActivity[]
}

export function KpiCards({ activities }: KpiCardsProps) {
  const total = activities.length
  const inProgress = activities.filter((a) => a.status === 'In Progress').length
  const toDo = activities.filter((a) => a.status === 'To Do' || !a.status).length
  const pastDue = activities.filter(isPastDue).length
  const onHold = activities.filter((a) => a.status === 'On Hold').length
  const rejected = activities.filter((a) => a.status === 'Rejected').length
  const done = activities.filter((a) => a.status === 'Done').length
  const delayedApprovals = activities.filter(isDelayedApproval).length

  const cards = [
    {
      label: 'Total Activities',
      count: total,
      icon: Activity,
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-600 dark:text-slate-300',
    },
    {
      label: 'In Progress',
      count: inProgress,
      icon: Clock,
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'To Do / Pending',
      count: toDo,
      icon: ListTodo,
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-600 dark:text-slate-300',
    },
    {
      label: 'Past Due',
      count: pastDue,
      icon: AlertCircle,
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-600 dark:text-red-400',
    },
    {
      label: 'On Hold',
      count: onHold,
      icon: PauseCircle,
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Rejected',
      count: rejected,
      icon: XCircle,
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: 'Done',
      count: done,
      icon: CheckCircle2,
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Delayed Approvals >48h',
      count: delayedApprovals,
      icon: AlertTriangle,
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-600 dark:text-red-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card
            key={card.label}
            className={cn('border-none shadow-sm hover:shadow-md transition-shadow', card.bg)}
          >
            <CardContent className="p-3 sm:p-4 flex flex-col items-center text-center gap-1.5">
              <Icon className={cn('w-6 h-6', card.text)} />
              <p className={cn('text-2xl font-bold tracking-tighter', card.text)}>{card.count}</p>
              <p
                className={cn(
                  'text-[10px] font-medium uppercase tracking-wider leading-tight',
                  card.text,
                )}
              >
                {card.label}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
