import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Filter, RotateCcw } from 'lucide-react'
import type { MonitoringActivity, MonitoringFilterState } from '@/services/monitoring'
import { getAssigneeName, getOwnerName } from '@/services/monitoring'

interface FilterBarProps {
  activities: MonitoringActivity[]
  filters: MonitoringFilterState
  onFilterChange: (filters: MonitoringFilterState) => void
  onReset: () => void
}

const STATUSES = [
  'To Do',
  'In Progress',
  'On Hold',
  'SPM Clearance',
  'Head Clearance',
  'Head Approval',
  'CPO Approval',
  'SG Approval',
  'Rejected',
  'Done',
  'Not specified',
]
const STAGES = ['Preparation', 'Feedback', 'Review', 'Approval', 'Done']
const DUE_DATE_RISKS = [
  'Overdue',
  'Due in next 7 days',
  'Due in next 30 days',
  'Future',
  'No due date',
]

export function FilterBar({ activities, filters, onFilterChange, onReset }: FilterBarProps) {
  const assignees = Array.from(new Set(activities.map(getAssigneeName))).sort()
  const owners = Array.from(new Set(activities.map(getOwnerName))).sort()

  return (
    <div className="flex flex-wrap items-end gap-3 p-4 bg-muted/30 rounded-lg border">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-2">
        <Filter className="w-4 h-4" /> Filters
      </div>
      <FilterSelect
        label="Status"
        value={filters.status}
        options={STATUSES}
        onChange={(v) => onFilterChange({ ...filters, status: v })}
      />
      <FilterSelect
        label="Current Stage"
        value={filters.stage}
        options={STAGES}
        onChange={(v) => onFilterChange({ ...filters, stage: v })}
      />
      <FilterSelect
        label="Assignee"
        value={filters.assignee}
        options={assignees}
        onChange={(v) => onFilterChange({ ...filters, assignee: v })}
      />
      <FilterSelect
        label="Project Owner"
        value={filters.owner}
        options={owners}
        onChange={(v) => onFilterChange({ ...filters, owner: v })}
      />
      <FilterSelect
        label="Due Date Risk"
        value={filters.dueDateRisk}
        options={DUE_DATE_RISKS}
        onChange={(v) => onFilterChange({ ...filters, dueDateRisk: v })}
      />
      <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5">
        <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
      </Button>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Select value={value || 'all'} onValueChange={onChange}>
        <SelectTrigger className="w-[160px] h-8 text-xs">
          <SelectValue placeholder={`All ${label}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
