import { BarChart, Bar, XAxis, YAxis, Cell } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { MonitoringActivity, MonitoringFilterState } from '@/services/monitoring'

type FilterUpdater = (prev: MonitoringFilterState) => MonitoringFilterState

interface Props {
  activities: MonitoringActivity[]
  filters: MonitoringFilterState
  onFilterChange: (updater: FilterUpdater) => void
}

export function AssigneeWorkloadChart({ activities, filters, onFilterChange }: Props) {
  const counts = activities.reduce(
    (acc, a) => {
      const id = a.assignee_id || 'unassigned'
      const name = a.assignee_name || 'Unassigned'
      if (!acc[id]) acc[id] = { id, name, count: 0 }
      acc[id].count++
      return acc
    },
    {} as Record<string, { id: string; name: string; count: number }>,
  )

  const data = Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)

  const handleClick = (id: string) => {
    if (id === 'unassigned') {
      onFilterChange((prev) => ({ ...prev, unassigned: !prev.unassigned, assigneeId: null }))
      return
    }
    onFilterChange((prev) => ({
      ...prev,
      assigneeId: prev.assigneeId === id ? null : id,
      unassigned: false,
    }))
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Workload by Assignee</CardTitle>
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
        <CardTitle className="text-sm font-semibold">Workload by Assignee</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[280px] w-full">
          <BarChart layout="vertical" data={data} margin={{ left: 10, right: 20 }}>
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.id}
                  cursor="pointer"
                  fill={
                    filters.assigneeId === entry.id ||
                    (filters.unassigned && entry.id === 'unassigned')
                      ? 'hsl(221, 83%, 53%)'
                      : 'hsl(221, 83%, 70%)'
                  }
                  onClick={() => handleClick(entry.id)}
                />
              ))}
            </Bar>
            <ChartTooltip content={<ChartTooltipContent />} />
          </BarChart>
        </ChartContainer>
        <p className="text-[10px] text-muted-foreground mt-2">Click a bar to filter by assignee</p>
      </CardContent>
    </Card>
  )
}
