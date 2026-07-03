import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts'
import type { MonitoringActivity } from '@/services/monitoring'
import { getAssigneeName } from '@/services/monitoring'

export function AssigneeWorkloadChart({ activities }: { activities: MonitoringActivity[] }) {
  const counts = activities.reduce(
    (acc, a) => {
      const name = getAssigneeName(a)
      acc[name] = (acc[name] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const data = Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15)

  const config = { count: { label: 'Activities', color: 'hsl(var(--chart-2))' } }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workload by Assignee</CardTitle>
        <CardDescription>Activity count per assignee (top 15)</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center pt-12">No data available</p>
        ) : (
          <ChartContainer config={config} className="w-full h-full">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 10, right: 20, top: 5, bottom: 5 }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={4}>
                <LabelList position="right" className="text-xs" />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
