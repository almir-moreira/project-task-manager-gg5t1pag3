import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { PieChart, Pie, Cell } from 'recharts'
import type { MonitoringActivity } from '@/services/monitoring'

const STATUS_COLORS: Record<string, string> = {
  'To Do': 'hsl(var(--chart-1))',
  'In Progress': 'hsl(var(--chart-2))',
  'On Hold': 'hsl(var(--chart-3))',
  Rejected: 'hsl(var(--chart-4))',
  Done: 'hsl(var(--chart-5))',
  'Not specified': 'hsl(var(--muted-foreground))',
  'SPM Clearance': 'hsl(280, 60%, 55%)',
  'Head Clearance': 'hsl(280, 50%, 60%)',
  'Head Approval': 'hsl(280, 55%, 50%)',
  'CPO Approval': 'hsl(280, 45%, 65%)',
  'SG Approval': 'hsl(280, 65%, 45%)',
}

export function StatusDistributionChart({ activities }: { activities: MonitoringActivity[] }) {
  const statusCounts = activities.reduce(
    (acc, a) => {
      const status = a.status || 'Not specified'
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const data = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
    fill: STATUS_COLORS[name] || 'hsl(var(--muted))',
  }))
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const config = Object.fromEntries(
    data.map((d) => [d.name.toLowerCase().replace(/\s+/g, ''), { label: d.name, color: d.fill }]),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Status Distribution</CardTitle>
        <CardDescription>
          Breakdown of activities by status with counts and percentages
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm">No data available</p>
        ) : (
          <ChartContainer config={config} className="w-full h-full max-w-[350px]">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    nameKey="name"
                    formatter={(value, name) => [
                      `${value} (${total ? Math.round((Number(value) / total) * 100) : 0}%)`,
                      name,
                    ]}
                  />
                }
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
