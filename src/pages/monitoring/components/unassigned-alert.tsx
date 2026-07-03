import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { UserX } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MonitoringFilterState } from '@/services/monitoring'

type FilterUpdater = (prev: MonitoringFilterState) => MonitoringFilterState

interface Props {
  count: number
  filters: MonitoringFilterState
  onFilterChange: (updater: FilterUpdater) => void
}

export function UnassignedAlert({ count, filters, onFilterChange }: Props) {
  if (count === 0) return null

  const handleClick = () => {
    onFilterChange((prev) => ({
      ...prev,
      unassigned: !prev.unassigned,
      assigneeId: prev.unassigned ? prev.assigneeId : null,
    }))
  }

  return (
    <Alert
      className={cn(
        'cursor-pointer transition-all border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700',
        filters.unassigned && 'ring-2 ring-blue-500',
      )}
      onClick={handleClick}
    >
      <UserX className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="text-blue-800 dark:text-blue-300 text-sm font-semibold">
        {count} {count === 1 ? 'activity is' : 'activities are'} currently unassigned
      </AlertTitle>
      <AlertDescription className="text-blue-700 dark:text-blue-400 text-xs">
        Click here to {filters.unassigned ? 'clear' : 'apply'} the unassigned filter and review
        workload distribution.
      </AlertDescription>
    </Alert>
  )
}
