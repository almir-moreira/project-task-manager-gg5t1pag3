import { PieChart, Pie, Cell } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { MonitoringActivity, MonitoringFilterState } from '@/services/monitoring'

type FilterUpdater = (prev: MonitoringFilterState) => MonitoringFilterState

const STATUS_COLORS: Record<string, string> = {
  'To Do': 'hsl(215, 20%, 65%)',
  'In Progress': 'hsl(221, 83%, 53%)',
  'On Hold': 'hsl(38, 92%, 50%)',
  'SPM Clearance': 'hsl(262, 83%, 58%)',
  'Head Clearance': 'hsl(262, 83%, 58%)',
  'Head Approval': 'hsl(262, 83%, 58%)',
  'CPO Approval': 'hsl(262, 83%, 58%)',
  'SG Approval': 'hsl(262, 83%, 58%)',
  Rejected: 'hsl(0, 84%, 60%)',
  Done: 'hsl(160, 84%, 39%)',
}

interface Props {
  activities: MonitoringActivity[]
  filters: MonitoringFilterState
  onFilterChange: (updater: FilterUpdater) => void
}

export function StatusDistributionChart({ activities, filters, onFilterChange }: Props) {
  const counts = activities.reduce(
    (acc, a) => {
      const s = a.status || 'To Do'
      acc[s] = (acc[s] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const total = activities.length
  const data = Object.entries(counts).map(([status, count]) => ({
    status,
    count,
    pct: total > 0 ? Math.round((count / total) * 100) : 0,
  }))

  const handleClick = (status: string) => {
    onFilterChange((prev) => ({
      ...prev,
      statuses: prev.statuses.length === 1 && prev.statuses[0] === status ? [] : [status],
    }))
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Activity Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">No data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Activity Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[180px] mx-auto">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={STATUS_COLORS[entry.status] || 'hsl(0, 0%, 50%)'}
                  cursor="pointer"
                  opacity={
                    filters.statuses.length === 0 || filters.statuses.includes(entry.status)
                      ? 1
                      : 0.3
                  }
                  onClick={() => handleClick(entry.status)}
                />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
          </PieChart>
        </ChartContainer>
        <div className="mt-3 space-y-1">
          {data.map((entry) => (
            <div
              key={entry.status}
              className={cn(
                'flex items-center justify-between text-xs cursor-pointer rounded px-2 py-1 transition-colors hover:bg-muted/50',
                filters.statuses.includes(entry.status) && 'bg-muted',
              )}
              onClick={() => handleClick(entry.status)}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: STATUS_COLORS[entry.status] || 'hsl(0, 0%, 50%)' }}
                />
                <span className="font-medium">{entry.status}</span>
              </div>
              <span className="text-muted-foreground">
                {entry.count} — {entry.pct}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
