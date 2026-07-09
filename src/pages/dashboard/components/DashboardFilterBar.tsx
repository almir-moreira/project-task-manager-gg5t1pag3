import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Filter, X } from 'lucide-react'

export interface DashboardFilters {
  stage: string | null
  status: string | null
  categoryId: string | null
  typeId: string | null
  assigneeId: string | null
  overdueOnly: boolean
  pendingFeedbackOnly: boolean
  pendingApprovalOnly: boolean
}

export const DEFAULT_DASHBOARD_FILTERS: DashboardFilters = {
  stage: null,
  status: null,
  categoryId: null,
  typeId: null,
  assigneeId: null,
  overdueOnly: false,
  pendingFeedbackOnly: false,
  pendingApprovalOnly: false,
}

interface DashboardFilterBarProps {
  filters: DashboardFilters
  onFilterChange: (updater: (prev: DashboardFilters) => DashboardFilters) => void
  onReset: () => void
  stages: string[]
  statuses: string[]
  categories: { id: string; name: string }[]
  taskTypes: { id: string; name: string }[]
  assignees: { id: string; name: string }[]
}

function ToggleFilter({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Switch checked={checked} onCheckedChange={onChange} />
      <span className="text-xs whitespace-nowrap">{label}</span>
    </div>
  )
}

export function DashboardFilterBar({
  filters,
  onFilterChange,
  onReset,
  stages,
  statuses,
  categories,
  taskTypes,
  assignees,
}: DashboardFilterBarProps) {
  const hasActiveFilters = JSON.stringify(filters) !== JSON.stringify(DEFAULT_DASHBOARD_FILTERS)

  return (
    <Card className="shadow-sm border-border">
      <CardContent className="p-3 flex flex-wrap items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
        <Select
          value={filters.stage || 'all'}
          onValueChange={(v) =>
            onFilterChange((prev) => ({ ...prev, stage: v === 'all' ? null : v }))
          }
        >
          <SelectTrigger className="w-[160px] h-8 text-xs">
            <SelectValue placeholder="Current Stage" />
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
          value={filters.status || 'all'}
          onValueChange={(v) =>
            onFilterChange((prev) => ({ ...prev, status: v === 'all' ? null : v }))
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
          value={filters.categoryId || 'all'}
          onValueChange={(v) =>
            onFilterChange((prev) => ({ ...prev, categoryId: v === 'all' ? null : v }))
          }
        >
          <SelectTrigger className="w-[150px] h-8 text-xs">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.typeId || 'all'}
          onValueChange={(v) =>
            onFilterChange((prev) => ({ ...prev, typeId: v === 'all' ? null : v }))
          }
        >
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {taskTypes.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.assigneeId || 'all'}
          onValueChange={(v) =>
            onFilterChange((prev) => ({ ...prev, assigneeId: v === 'all' ? null : v }))
          }
        >
          <SelectTrigger className="w-[160px] h-8 text-xs">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            {assignees.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ToggleFilter
          checked={filters.overdueOnly}
          onChange={(v) => onFilterChange((prev) => ({ ...prev, overdueOnly: v }))}
          label="Overdue"
        />
        <ToggleFilter
          checked={filters.pendingFeedbackOnly}
          onChange={(v) => onFilterChange((prev) => ({ ...prev, pendingFeedbackOnly: v }))}
          label="Pending Feedback"
        />
        <ToggleFilter
          checked={filters.pendingApprovalOnly}
          onChange={(v) => onFilterChange((prev) => ({ ...prev, pendingApprovalOnly: v }))}
          label="Pending Approval"
        />
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
