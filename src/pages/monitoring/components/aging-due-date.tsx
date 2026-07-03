import { BarChart, Bar, XAxis, YAxis, Cell, PieChart, Pie } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { MonitoringActivity, MonitoringFilterState } from '@/services/monitoring'
import { computeAging, getDueDateRisk } from '@/services/monitoring'

type FilterUpdater = (prev: MonitoringFilterState) => MonitoringFilterState

const AGING_BUCKETS = [
  { key: '0-7 days', min: 0, max: 7, color: 'hsl(160, 84%, 39%)' },
  { key: '8-30 days', min: 8, max: 30, color: 'hsl(221, 83%, 53%)' },
  { key: '31-60 days', min: 31, max: 60, color: 'hsl(38, 92%, 50%)' },
  { key: '60+ days', min: 61, max: Infinity, color: 'hsl(0, 84%, 60%)' },
]

const RISK_COLORS: Record<string, string> = {
  Overdue: 'hsl(0, 84%, 60%)',
  'Due Soon': 'hsl(38, 92%, 50%)',
  'On Time': 'hsl(160, 84%, 39%)',
  'No Due Date': 'hsl(215, 20%, 65%)',
}

export function AgingBuckets({ activities }: { activities: MonitoringActivity[] }) {
  const data = AGING_BUCKETS.map((bucket) => ({
    name: bucket.key,
    count: activities.filter((a) => {
      const days = computeAging(a).days
      return days >= bucket.min && days <= bucket.max
    }).length,
    color: bucket.color,
  }))

  const agingLabel = activities.some((a) => a.stage_started_at)
    ? 'Days in current stage'
    : activities.some((a) => a.updated_at)
      ? 'Days since last update'
      : 'Age since creation'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Aging Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[200px] w-full">
          <BarChart data={data} margin={{ top: 10, bottom: 30 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
            <ChartTooltip content={<ChartTooltipContent />} />
          </BarChart>
        </ChartContainer>
        <p className="text-[10px] text-muted-foreground mt-2">Metric: {agingLabel}</p>
      </CardContent>
    </Card>
  )
}

interface DueDateRiskProps {
  activities: MonitoringActivity[]
  filters: MonitoringFilterState
  onFilterChange: (updater: FilterUpdater) => void
}

export function DueDateRiskCard({ activities, filters, onFilterChange }: DueDateRiskProps) {
  const counts = activities.reduce(
    (acc, a) => {
      const r = getDueDateRisk(a)
      acc[r] = (acc[r] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const total = activities.length
  const data = Object.entries(counts).map(([risk, count]) => ({
    risk,
    count,
    pct: total > 0 ? Math.round((count / total) * 100) : 0,
  }))

  const handleClick = (risk: string) => {
    onFilterChange((prev) => ({ ...prev, dueDateRisk: prev.dueDateRisk === risk ? null : risk }))
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Due Date Risk</CardTitle>
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
        <CardTitle className="text-sm font-semibold">Due Date Risk</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[160px] mx-auto">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="risk"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={65}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.risk}
                  fill={RISK_COLORS[entry.risk] || 'hsl(0, 0%, 50%)'}
                  cursor="pointer"
                  opacity={!filters.dueDateRisk || filters.dueDateRisk === entry.risk ? 1 : 0.3}
                  onClick={() => handleClick(entry.risk)}
                />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent nameKey="risk" />} />
          </PieChart>
        </ChartContainer>
        <div className="mt-2 space-y-1">
          {data.map((entry) => (
            <div
              key={entry.risk}
              className={cn(
                'flex items-center justify-between text-xs cursor-pointer rounded px-2 py-1 hover:bg-muted/50',
                filters.dueDateRisk === entry.risk && 'bg-muted',
              )}
              onClick={() => handleClick(entry.risk)}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: RISK_COLORS[entry.risk] }}
                />
                <span className="font-medium">{entry.risk}</span>
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
