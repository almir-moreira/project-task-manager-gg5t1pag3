import { useState, useEffect } from 'react'
import { Check, Clock, AlertTriangle, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { FunnelChart, Funnel, LabelList, Cell } from 'recharts'

const STAGES = ['Preparation', 'Feedback', 'Review', 'Approval', 'Done']

export default function MonitoringPage() {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('activities')
      .select('id, activity_name, task_number, current_stage, stage_started_at')

    if (data) {
      setActivities(data)
    }
    setLoading(false)
  }

  const calculateAgingDays = (dateString?: string) => {
    if (!dateString) return 0
    const diffTime = Math.abs(new Date().getTime() - new Date(dateString).getTime())
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  }

  const calculateAgingHours = (dateString?: string) => {
    if (!dateString) return 0
    const diffTime = Math.abs(new Date().getTime() - new Date(dateString).getTime())
    return diffTime / (1000 * 60 * 60)
  }

  const funnelData = STAGES.map((stage) => ({
    name: stage,
    value: activities.filter((a) => (a.current_stage || 'Preparation') === stage).length,
    fill: `var(--color-${stage.toLowerCase()})`,
  }))

  const activeActivities = activities.filter((a) => a.current_stage !== 'Done')

  const delayedApprovals = activities.filter((a) => {
    return (
      (a.current_stage || 'Preparation') === 'Approval' &&
      calculateAgingHours(a.stage_started_at) > 48
    )
  })

  const chartConfig = {
    preparation: { label: 'Preparation', color: 'hsl(var(--chart-1))' },
    feedback: { label: 'Feedback', color: 'hsl(var(--chart-2))' },
    review: { label: 'Review', color: 'hsl(var(--chart-3))' },
    approval: { label: 'Approval', color: 'hsl(var(--chart-4))' },
    done: { label: 'Done', color: 'hsl(var(--chart-5))' },
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Monitoring Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Funnel</CardTitle>
            <CardDescription>
              Activities distributed by their current workflow stage
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4 flex justify-center">
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

        <Card className="border-red-200">
          <CardHeader className="bg-red-50/50 border-b border-red-100">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <CardTitle>Delay Alerts (Approval &gt; 48h)</CardTitle>
            </div>
            <CardDescription>Activities stuck in Approval for more than 48 hours</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto max-h-[350px]">
            {delayedApprovals.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                <Check className="w-8 h-8 text-emerald-500 mb-2 opacity-50" />
                No delayed approvals. Excellent!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Time in Stage</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {delayedApprovals.map((a) => (
                    <TableRow key={a.id} className="bg-red-50/20">
                      <TableCell className="font-medium">
                        {a.task_number}
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {a.activity_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive" className="font-mono">
                          {Math.floor(calculateAgingHours(a.stage_started_at))} hours
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/tasks/${a.id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <CardTitle>Active Activities Aging</CardTitle>
          </div>
          <CardDescription>Days spent in the current workflow stage</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Number</TableHead>
                <TableHead>Activity Name</TableHead>
                <TableHead>Current Stage</TableHead>
                <TableHead className="text-right">Days in Stage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeActivities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No active activities to display.
                  </TableCell>
                </TableRow>
              ) : (
                activeActivities
                  .sort(
                    (a, b) =>
                      calculateAgingDays(b.stage_started_at) -
                      calculateAgingDays(a.stage_started_at),
                  )
                  .map((a) => {
                    const days = calculateAgingDays(a.stage_started_at)
                    return (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">
                          <Link to={`/tasks/${a.id}`} className="text-blue-600 hover:underline">
                            {a.task_number || 'Unnamed'}
                          </Link>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">{a.activity_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-muted">
                            {a.current_stage || 'Preparation'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`font-mono ${days > 14 ? 'text-red-600 font-bold' : days > 7 ? 'text-amber-600 font-bold' : ''}`}
                          >
                            {days} {days === 1 ? 'day' : 'days'}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
