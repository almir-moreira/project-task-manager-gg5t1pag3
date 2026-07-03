import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Cell,
  FunnelChart,
  Funnel,
} from 'recharts'
import type { MonitoringActivity } from '@/services/monitoring'

const STAGES = ['Preparation', 'Feedback', 'Review', 'Approval', 'Done']

const STAGE_COLORS: Record<string, string> = {
  Preparation: 'hsl(var(--chart-1))',
  Feedback: 'hsl(var(--chart-2))',
  Review: 'hsl(var(--chart-3))',
  Approval: 'hsl(var(--chart-4))',
  Done: 'hsl(var(--chart-5))',
}

export function StageBottleneckChart({ activities }: { activities: MonitoringActivity[] }) {
  const data = STAGES.map((stage) => ({
    name: stage,
    value: activities.filter((a) => (a.current_stage || 'Preparation') === stage).length,
    fill: STAGE_COLORS[stage],
  }))
  const config = Object.fromEntries(
    STAGES.map((s) => [s.toLowerCase(), { label: s, color: STAGE_COLORS[s] }]),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activities by Current Stage</CardTitle>
        <CardDescription>Distribution across workflow stages</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={config} className="w-full h-full">
          <BarChart data={data} margin={{ left: 5, right: 5, top: 10, bottom: 5 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              allowDecimals={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={4}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
              <LabelList position="top" className="text-xs" />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function PipelineFunnel({ activities }: { activities: MonitoringActivity[] }) {
  const funnelData = STAGES.map((stage) => ({
    name: stage,
    value: activities.filter((a) => (a.current_stage || 'Preparation') === stage).length,
    fill: `var(--color-${stage.toLowerCase()})`,
  }))
  const chartConfig = Object.fromEntries(
    STAGES.map((s, i) => [s.toLowerCase(), { label: s, color: `hsl(var(--chart-${i + 1}))` }]),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline Funnel</CardTitle>
        <CardDescription>Activities distributed by their current workflow stage</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pt-4 flex justify-center">
        <ChartContainer config={chartConfig} className="w-full h-full max-w-[400px]">
          <FunnelChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Funnel dataKey="value" data={funnelData} isAnimationActive>
              <LabelList position="right" fill="#888" stroke="none" dataKey="name" />
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Funnel>
          </FunnelChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
