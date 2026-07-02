import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { getStatusColor } from '@/lib/status-colors'
import { cn } from '@/lib/utils'
import { computeTracker, getStatusStyles } from '@/lib/workflow-tracker'

interface ActivityMatrixCardProps {
  activity: any
  activityWorkflows: any[]
  wfMap: Record<string, string>
}

export function ActivityMatrixCard({
  activity,
  activityWorkflows,
  wfMap,
}: ActivityMatrixCardProps) {
  const navigate = useNavigate()
  const tracker = computeTracker(activity, activityWorkflows, wfMap)
  const activityId = activity.task_number || activity.id
  const statusColor = getStatusColor(activity.status)

  const metaItems = [
    { label: 'Category', value: activity.category_obj?.name || activity.type?.name || '-' },
    { label: 'Assignee', value: activity.assignee?.name || '-' },
    { label: 'Owner', value: activity.project_owner?.name || '-' },
    { label: 'Due Date', value: activity.end_date || '-' },
    { label: 'Stage', value: activity.current_stage || 'Preparation' },
  ]

  return (
    <Card className="shadow-sm border-border overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-3 p-4 border-b border-border">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <Badge
              variant="outline"
              className={cn('text-[10px] font-semibold border-0 shrink-0', statusColor)}
            >
              {activity.status || 'To Do'}
            </Badge>
            <div className="min-w-0">
              <span className="text-xs font-mono text-muted-foreground">{activityId}</span>
              <h3 className="text-sm font-semibold truncate" title={activity.activity_name}>
                {activity.activity_name || 'Untitled Activity'}
              </h3>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 h-8 text-xs"
            onClick={() => navigate(`/tasks/${activityId}`)}
          >
            Open Activity
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 border-b border-border">
          {metaItems.map((item) => (
            <div key={item.label} className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {item.label}
              </p>
              <p className="text-xs font-medium truncate" title={item.value}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {tracker.hasWorkflow ? (
          <div className="p-4 space-y-3">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Steps completed:</span>
                <span className="text-xs font-semibold">
                  {tracker.completedCount} / {tracker.totalCount}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Progress:</span>
                <span className="text-xs font-semibold">{tracker.progressPercent}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Current step:</span>
                <span className="text-xs font-semibold text-[#1E3A8A]">
                  {tracker.currentStepName}
                </span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${tracker.progressPercent}%` }}
              />
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="flex items-start gap-2 min-w-max">
                {tracker.stages.map((stage, stageIdx) => (
                  <div key={stage.name} className="flex items-start gap-2">
                    {stageIdx > 0 && (
                      <div className="flex items-center h-[52px]">
                        <ChevronRight className="w-3 h-3 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                        {stage.name}
                      </span>
                      <div className="flex items-center gap-1">
                        {stage.steps.map((step, stepIdx) => {
                          const styles = getStatusStyles(step.status)
                          return (
                            <div key={step.id} className="flex items-center gap-1">
                              {stepIdx > 0 && <div className="w-2 h-px bg-border" />}
                              <div
                                className={cn(
                                  'flex items-center gap-1 px-2 py-1 rounded border min-w-[55px] max-w-[90px]',
                                  styles.bg,
                                  styles.border,
                                )}
                                title={`${step.label} (${step.stage})`}
                              >
                                <span
                                  className={cn('w-1.5 h-1.5 rounded-full shrink-0', styles.dot)}
                                />
                                <span
                                  className={cn('text-[9px] font-medium truncate', styles.text)}
                                >
                                  {step.label}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-lg">
              Workflow not configured for this activity.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
