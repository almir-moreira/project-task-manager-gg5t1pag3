import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, Calendar, User, Tag, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStatusColor } from '@/lib/status-colors'
import {
  getWorkflowStepStatusStyles,
  getStatusIcon,
} from '@/pages/tasks/components/tabs/workflow-steps-config'
import { computeWorkflowSteps, getProgressPercentage } from '@/lib/workflow-utils'

interface ActivityMatrixCardProps {
  activity: any
  activityWorkflows: any[]
  wfMap: Record<string, string>
}

const CATEGORY_GROUPS = ['Planning', 'Review', 'Approval'] as const

export function ActivityMatrixCard({
  activity,
  activityWorkflows,
  wfMap,
}: ActivityMatrixCardProps) {
  const navigate = useNavigate()
  const steps = computeWorkflowSteps(activity, activityWorkflows, wfMap)
  const progress = getProgressPercentage(steps)
  const completedCount = steps.filter((s) => s.status === 'Completed').length

  return (
    <Card className="shadow-sm border-border overflow-hidden transition-shadow hover:shadow-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 border-b border-border bg-muted/20">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs font-bold text-muted-foreground">
            {activity.task_number || activity.id.slice(0, 8)}
          </span>
          <h3
            className="text-sm font-semibold truncate max-w-[280px]"
            title={activity.activity_name}
          >
            {activity.activity_name}
          </h3>
          <Badge
            variant="outline"
            className={cn('text-[10px] font-semibold border-0', getStatusColor(activity.status))}
          >
            {activity.status || 'To Do'}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {activity.type?.name && (
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {activity.type.name}
            </span>
          )}
          {activity.project_owner?.name && (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {activity.project_owner.name}
            </span>
          )}
          {activity.end_date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {activity.end_date}
            </span>
          )}
          {activity.current_stage && (
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" />
              {activity.current_stage}
            </span>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        {steps.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-4">
            No workflow steps configured.
          </p>
        ) : (
          <>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {CATEGORY_GROUPS.map((cat, catIdx) => {
                const catSteps = steps.filter((s) => s.category === cat)
                if (catSteps.length === 0) return null
                return (
                  <div key={cat} className="flex items-center gap-2 shrink-0">
                    {catIdx > 0 && <div className="h-8 w-px bg-border mx-1" />}
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">
                      {cat}
                    </span>
                    {catSteps.map((step, i) => (
                      <div key={step.id} className="flex items-center gap-2 shrink-0">
                        {i > 0 && <div className="h-px w-3 bg-border" />}
                        <div
                          className={cn(
                            'flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-medium whitespace-nowrap transition-all',
                            getWorkflowStepStatusStyles(step.status).card,
                          )}
                          title={step.name}
                        >
                          {getStatusIcon(step.status)}
                          <span className="truncate max-w-[100px]">{step.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>

            <div className="mt-3 mb-3">
              <Progress value={progress} className="h-1.5" />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-border">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground">
                  Steps completed:{' '}
                  <span className="text-foreground font-bold">
                    {completedCount} / {steps.length}
                  </span>
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Progress: <span className="text-foreground font-bold">{progress}%</span>
                </span>
              </div>
              <Button
                size="sm"
                variant="default"
                className="h-8 text-xs"
                onClick={() => navigate(`/tasks/${activity.task_number || activity.id}`)}
              >
                Open Activity <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
