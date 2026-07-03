import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  Activity,
  Clock,
  ListTodo,
  PauseCircle,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Timer,
} from 'lucide-react'
import type { MonitoringActivity, MonitoringFilterState } from '@/services/monitoring'
import { getDueDateRisk, isApprovalDelayed } from '@/services/monitoring'

type FilterUpdater = (prev: MonitoringFilterState) => MonitoringFilterState

interface KpiCardsProps {
  activities: MonitoringActivity[]
  filters: MonitoringFilterState
  onFilterChange: (updater: FilterUpdater) => void
}

interface KpiItem {
  key: string
  label: string
  count: number
  icon: typeof Activity
  bg: string
  text: string
  isActive: boolean
  onClick: () => void
}

export function KpiCards({ activities, filters, onFilterChange }: KpiCardsProps) {
  const total = activities.length
  const inProgress = activities.filter((a) => a.status === 'In Progress').length
  const toDo = activities.filter((a) => a.status === 'To Do').length
  const onHold = activities.filter((a) => a.status === 'On Hold').length
  const rejected = activities.filter((a) => a.status === 'Rejected').length
  const done = activities.filter((a) => a.status === 'Done').length
  const pastDue = activities.filter((a) => getDueDateRisk(a) === 'Overdue').length
  const delayed = activities.filter((a) => isApprovalDelayed(a)).length

  const clearKpiFilters = (prev: MonitoringFilterState): MonitoringFilterState => ({
    ...prev,
    statuses: [],
    dueDateRisk: null,
    approvalDelay: false,
    unassigned: false,
  })

  const toggleStatus =
    (status: string): FilterUpdater =>
    (prev) => ({
      ...clearKpiFilters(prev),
      statuses: prev.statuses.length === 1 && prev.statuses[0] === status ? [] : [status],
    })

  const items: KpiItem[] = [
    {
      key: 'total',
      label: 'Total Activities',
      count: total,
      icon: Activity,
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-700 dark:text-slate-300',
      isActive:
        filters.statuses.length === 0 &&
        !filters.dueDateRisk &&
        !filters.approvalDelay &&
        !filters.unassigned,
      onClick: () => onFilterChange(clearKpiFilters),
    },
    {
      key: 'inProgress',
      label: 'In Progress',
      count: inProgress,
      icon: Clock,
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
      isActive: filters.statuses.length === 1 && filters.statuses[0] === 'In Progress',
      onClick: () => onFilterChange(toggleStatus('In Progress')),
    },
    {
      key: 'toDo',
      label: 'To Do / Pending',
      count: toDo,
      icon: ListTodo,
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-600 dark:text-slate-300',
      isActive: filters.statuses.length === 1 && filters.statuses[0] === 'To Do',
      onClick: () => onFilterChange(toggleStatus('To Do')),
    },
    {
      key: 'onHold',
      label: 'On Hold',
      count: onHold,
      icon: PauseCircle,
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-600 dark:text-amber-400',
      isActive: filters.statuses.length === 1 && filters.statuses[0] === 'On Hold',
      onClick: () => onFilterChange(toggleStatus('On Hold')),
    },
    {
      key: 'rejected',
      label: 'Rejected',
      count: rejected,
      icon: XCircle,
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-600 dark:text-orange-400',
      isActive: filters.statuses.length === 1 && filters.statuses[0] === 'Rejected',
      onClick: () => onFilterChange(toggleStatus('Rejected')),
    },
    {
      key: 'done',
      label: 'Done',
      count: done,
      icon: CheckCircle2,
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      isActive: filters.statuses.length === 1 && filters.statuses[0] === 'Done',
      onClick: () => onFilterChange(toggleStatus('Done')),
    },
    {
      key: 'pastDue',
      label: 'Past Due',
      count: pastDue,
      icon: AlertCircle,
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-600 dark:text-red-400',
      isActive: filters.dueDateRisk === 'Overdue',
      onClick: () =>
        onFilterChange((prev) => ({
          ...clearKpiFilters(prev),
          dueDateRisk: prev.dueDateRisk === 'Overdue' ? null : 'Overdue',
        })),
    },
    {
      key: 'delayed',
      label: 'Delayed Approvals > 48h',
      count: delayed,
      icon: Timer,
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-600 dark:text-purple-400',
      isActive: filters.approvalDelay,
      onClick: () =>
        onFilterChange((prev) => ({
          ...clearKpiFilters(prev),
          approvalDelay: !prev.approvalDelay,
        })),
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Card
            key={item.key}
            className={cn(
              'border-none shadow-sm hover:shadow-md transition-all cursor-pointer',
              item.bg,
              item.isActive && 'ring-2 ring-primary ring-offset-1',
            )}
            onClick={item.onClick}
          >
            <CardContent className="p-3 sm:p-4 flex flex-col items-center text-center gap-1.5">
              <Icon className={cn('w-6 h-6', item.text)} />
              <p className={cn('text-2xl font-bold tracking-tighter', item.text)}>{item.count}</p>
              <p
                className={cn(
                  'text-[10px] font-medium uppercase tracking-wider leading-tight',
                  item.text,
                )}
              >
                {item.label}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
