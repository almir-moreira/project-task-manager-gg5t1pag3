import { BarChart, Bar, XAxis, YAxis, Cell } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { MonitoringActivity, MonitoringFilterState } from '@/services/monitoring'

type FilterUpdater = (prev: MonitoringFilterState) => MonitoringFilterState

interface Props {
  activities: MonitoringActivity[]
  filters: MonitoringFilterState
  onFilterChange: (updater: FilterUpdater) => void
}

export function StageBottleneckChart({ activities, filters, onFilterChange }: Props) {
  const counts = activities.reduce(
    (acc, a) => {
      const s = a.current_stage || 'Unknown'
      acc[s] = (acc[s] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const data = Object.entries(counts)
    .map(([stage, count]) => ({ stage, count }))
    .sort((a, b) => b.count - a.count)
  const maxCount = Math.max(...data.map((d) => d.count), 1)

  const handleClick = (stage: string) => {
    onFilterChange((prev) => ({ ...prev, stage: prev.stage === stage ? null : stage }))
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Activities by Current Stage</CardTitle>
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
        <CardTitle className="text-sm font-semibold">Activities by Current Stage</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[220px] w-full">
          <BarChart data={data} margin={{ top: 10, bottom: 40 }}>
            <XAxis
              dataKey="stage"
              tick={{ fontSize: 10 }}
              angle={-30}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.stage}
                  cursor="pointer"
                  fill={filters.stage === entry.stage ? 'hsl(262, 83%, 58%)' : 'hsl(262, 83%, 70%)'}
                  onClick={() => handleClick(entry.stage)}
                />
              ))}
            </Bar>
            <ChartTooltip content={<ChartTooltipContent />} />
          </BarChart>
        </ChartContainer>
        <p className="text-[10px] text-muted-foreground mt-2">Click a bar to filter by stage</p>
      </CardContent>
    </Card>
  )
}

export function PipelineFunnel({ activities }: { activities: MonitoringActivity[] }) {
  const counts = activities.reduce(
    (acc, a) => {
      const s = a.current_stage || 'Unknown'
      acc[s] = (acc[s] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const data = Object.entries(counts)
    .map(([stage, count]) => ({ stage, count }))
    .sort((a, b) => b.count - a.count)
  const maxCount = Math.max(...data.map((d) => d.count), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Pipeline Funnel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No data available</p>
        ) : (
          data.map(({ stage, count }) => (
            <div key={stage} className="flex items-center gap-3">
              <span className="text-xs w-28 text-right truncate shrink-0" title={stage}>
                {stage}
              </span>
              <div className="flex-1 bg-muted rounded h-7 relative overflow-hidden">
                <div
                  className="h-full bg-primary/25 flex items-center justify-end pr-2 transition-all duration-300"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                >
                  <span className="text-xs font-semibold">{count}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
