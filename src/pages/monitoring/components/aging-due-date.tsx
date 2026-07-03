import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { MonitoringActivity } from '@/services/monitoring'
import { getAgingDays, getAgingBucket, getDueDateRisk } from '@/services/monitoring'

const AGING_BUCKETS = ['0–2 days', '3–7 days', '8–14 days', '15–30 days', '30+ days']
const DUE_DATE_RISKS = [
  'Overdue',
  'Due in next 7 days',
  'Due in next 30 days',
  'Future',
  'No due date',
]

const AGING_COLORS: Record<string, string> = {
  '0–2 days': 'bg-emerald-500',
  '3–7 days': 'bg-lime-500',
  '8–14 days': 'bg-amber-500',
  '15–30 days': 'bg-orange-500',
  '30+ days': 'bg-red-500',
}

const RISK_COLORS: Record<string, string> = {
  Overdue: 'bg-red-500',
  'Due in next 7 days': 'bg-orange-500',
  'Due in next 30 days': 'bg-amber-500',
  Future: 'bg-emerald-500',
  'No due date': 'bg-slate-400',
}

export function AgingBuckets({ activities }: { activities: MonitoringActivity[] }) {
  const active = activities.filter((a) => (a.current_stage || 'Preparation') !== 'Done')
  const counts = AGING_BUCKETS.map((bucket) => ({
    bucket,
    count: active.filter(
      (a) => getAgingBucket(getAgingDays(a.stage_started_at, a.updated_at)) === bucket,
    ).length,
  }))
  const maxCount = Math.max(...counts.map((c) => c.count), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aging by Current Stage</CardTitle>
        <CardDescription>
          How long active activities have been in their current stage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        {counts.map(({ bucket, count }) => (
          <div key={bucket} className="flex items-center gap-3">
            <span className="text-xs font-medium w-24 text-right">{bucket}</span>
            <div className="flex-1 h-7 bg-muted rounded-md overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-md transition-all duration-500',
                  AGING_COLORS[bucket],
                )}
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono w-8 text-right">{count}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function DueDateRiskCard({ activities }: { activities: MonitoringActivity[] }) {
  const counts = DUE_DATE_RISKS.map((risk) => ({
    risk,
    count: activities.filter((a) => getDueDateRisk(a) === risk).length,
  }))
  const maxCount = Math.max(...counts.map((c) => c.count), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Due Date Risk Assessment</CardTitle>
        <CardDescription>Activities categorized by proximity to end date</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        {counts.map(({ risk, count }) => (
          <div key={risk} className="flex items-center gap-3">
            <span className="text-xs font-medium w-36 text-right">{risk}</span>
            <div className="flex-1 h-7 bg-muted rounded-md overflow-hidden">
              <div
                className={cn('h-full rounded-md transition-all duration-500', RISK_COLORS[risk])}
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono w-8 text-right">{count}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
