import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Filter, X } from 'lucide-react'
import type { MonitoringActivity, MonitoringFilterState } from '@/services/monitoring'

type FilterUpdater = (prev: MonitoringFilterState) => MonitoringFilterState

interface FilterBarProps {
  activities: MonitoringActivity[]
  filters: MonitoringFilterState
  onFilterChange: (updater: FilterUpdater) => void
  onReset: () => void
}

export function FilterBar({ activities, filters, onFilterChange, onReset }: FilterBarProps) {
  const statuses = useMemo(
    () => Array.from(new Set(activities.map((a) => a.status || 'To Do'))).sort(),
    [activities],
  )
  const assignees = useMemo(() => {
    const map = new Map<string, string>()
    activities.forEach((a) => {
      if (a.assignee_id && a.assignee_name) map.set(a.assignee_id, a.assignee_name)
    })
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [activities])
  const stages = useMemo(
    () => Array.from(new Set(activities.map((a) => a.current_stage).filter(Boolean))) as string[],
    [activities],
  )
  const priorities = useMemo(
    () => Array.from(new Set(activities.map((a) => a.priority).filter(Boolean))) as string[],
    [activities],
  )
  const projects = useMemo(
    () => Array.from(new Set(activities.map((a) => a.project).filter(Boolean))) as string[],
    [activities],
  )

  const hasActiveFilters =
    JSON.stringify(filters) !==
    JSON.stringify({
      statuses: [],
      assigneeId: null,
      stage: null,
      priority: null,
      project: null,
      dueDateRisk: null,
      approvalDelay: false,
      unassigned: false,
    })

  return (
    <Card className="shadow-sm">
      <CardContent className="p-3 flex flex-wrap items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
        <Select
          value={filters.statuses.length > 0 ? filters.statuses[0] : 'all'}
          onValueChange={(v) =>
            onFilterChange((prev) => ({ ...prev, statuses: v === 'all' ? [] : [v] }))
          }
        >
          <SelectTrigger className="w-[150px] h-8 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.unassigned ? 'unassigned' : filters.assigneeId || 'all'}
          onValueChange={(v) =>
            onFilterChange((prev) => ({
              ...prev,
              assigneeId: v === 'all' || v === 'unassigned' ? null : v,
              unassigned: v === 'unassigned',
            }))
          }
        >
          <SelectTrigger className="w-[150px] h-8 text-xs">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {assignees.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.stage || 'all'}
          onValueChange={(v) =>
            onFilterChange((prev) => ({ ...prev, stage: v === 'all' ? null : v }))
          }
        >
          <SelectTrigger className="w-[150px] h-8 text-xs">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {stages.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.priority || 'all'}
          onValueChange={(v) =>
            onFilterChange((prev) => ({ ...prev, priority: v === 'all' ? null : v }))
          }
        >
          <SelectTrigger className="w-[130px] h-8 text-xs">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {priorities.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.project || 'all'}
          onValueChange={(v) =>
            onFilterChange((prev) => ({ ...prev, project: v === 'all' ? null : v }))
          }
        >
          <SelectTrigger className="w-[150px] h-8 text-xs">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="h-8 text-xs ml-auto" onClick={onReset}>
            <X className="w-3 h-3 mr-1" />
            Reset
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
