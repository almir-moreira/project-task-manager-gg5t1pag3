import { useState, useEffect, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { CheckCircle2, Clock, ArrowRight, UserCircle, PlayCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { REVIEWER_ROLES, APPROVER_ROLES } from './review-roles'
import { DEPT_FIELD_MAPPINGS } from './workflow-dept-config'
import { getAllWorkflowConfigs, getActivityWorkflows } from '@/services/activity-workflows'

const ALL_ROLES = [...REVIEWER_ROLES, ...APPROVER_ROLES]

const STATUS_STYLE: Record<string, { color: string; icon: React.ReactNode }> = {
  Approved: {
    color: 'bg-[#10b981] text-white border-[#10b981]',
    icon: <CheckCircle2 className="w-4 h-4 text-[#10b981]" />,
  },
  'In Progress': {
    color: 'bg-[#3b82f6] text-white border-[#3b82f6]',
    icon: <PlayCircle className="w-4 h-4 text-[#3b82f6]" />,
  },
  Pending: {
    color: 'bg-[#d1d5db] text-gray-700 border-[#d1d5db]',
    icon: <Clock className="w-4 h-4 text-gray-400" />,
  },
}

const fmtDate = (d: string | null) => {
  if (!d) return ''
  try {
    return format(new Date(d), 'MMM d, yyyy')
  } catch {
    return d
  }
}

export function TabWorkflow({ activity }: { activity: any }) {
  const [profiles, setProfiles] = useState<Record<string, string>>({})
  const [allWorkflowConfigs, setAllWorkflowConfigs] = useState<any[]>([])
  const [activityWorkflows, setActivityWorkflows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activity?.id) {
      setLoading(false)
      return
    }
    Promise.all([
      supabase.from('profiles').select('id, name'),
      getAllWorkflowConfigs(),
      getActivityWorkflows(activity.id),
    ]).then(([pRes, wfs, awfs]) => {
      if (pRes.data)
        setProfiles(pRes.data.reduce((a: any, p: any) => ({ ...a, [p.id]: p.name }), {}))
      setAllWorkflowConfigs(wfs)
      setActivityWorkflows(awfs)
      setLoading(false)
    })
  }, [activity?.id])

  const steps = useMemo(() => {
    const result: any[] = []
    allWorkflowConfigs.forEach((wf) => {
      const role = ALL_ROLES.find((r) => r.workflowRole === wf.role)
      if (role) {
        if (!activity?.[role.requiredField]) return
        const awf = activityWorkflows.find((a) => a.workflow_id === wf.id)
        const isApproved = awf?.status === 'Approved' || !!activity[role.approvedField]
        const assigneeId = activity[role.idField]
        result.push({
          id: role.idField,
          name: `${role.label} ${wf.category}`,
          date: activity[role.dateField],
          comments: awf?.comments || activity[role.commentsField] || '',
          assigneeName: assigneeId ? profiles[assigneeId] || 'Assigned' : 'Unassigned',
          status: isApproved ? 'Approved' : 'Pending',
          stage: wf.stage,
          step: wf.step,
        })
        return
      }
      const dept = DEPT_FIELD_MAPPINGS[wf.role]
      if (dept) {
        if (!activity?.[dept.enabledField]) return
        const awf = activityWorkflows.find((a) => a.workflow_id === wf.id)
        const isApproved = awf?.status === 'Approved'
        const assigneeId = activity[dept.reviewerIdField]
        result.push({
          id: dept.reviewerIdField,
          name: dept.label,
          date: null,
          comments: awf?.comments || '',
          assigneeName: assigneeId ? profiles[assigneeId] || 'Assigned' : 'Unassigned',
          status: isApproved ? 'Approved' : 'Pending',
          stage: wf.stage,
          step: wf.step,
        })
      }
    })
    result.sort((a, b) => a.stage - b.stage || a.step - b.step)
    const firstPending = result.findIndex((s) => s.status === 'Pending')
    if (firstPending !== -1) result[firstPending].status = 'In Progress'
    return result
  }, [activity, profiles, allWorkflowConfigs, activityWorkflows])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    )
  }

  const completedCount = steps.filter((s) => s.status === 'Approved').length

  return (
    <div className="flex flex-col h-full space-y-6 p-4 sm:p-6 animate-fade-in bg-muted/5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {activity.activity_name || 'Activity Workflow'}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
            <span>ID: {activity.task_number || activity.id?.split('-')[0]}</span>
            {activity.end_date && <span>• Est. Completion: {fmtDate(activity.end_date)}</span>}
          </div>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1 bg-muted/50">
          {completedCount} of {steps.length} approvals complete
        </Badge>
      </div>

      <div className="bg-card p-6 rounded-xl border shadow-sm overflow-x-auto shrink-0">
        <h3 className="text-lg font-semibold mb-4">Workflow Status</h3>
        {steps.length === 0 ? (
          <div className="text-center p-8 bg-muted/20 rounded-lg border border-dashed border-border">
            <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No workflow steps configured.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Select required roles in Review &amp; Approval or enable departments in Feedback to
              build the workflow.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-max pb-2">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center shrink-0">
                <div
                  className={cn(
                    'relative flex flex-col p-2.5 rounded-lg border w-40 sm:w-48 bg-background shadow-sm transition-all duration-200 hover:shadow-md shrink-0',
                    step.status === 'In Progress'
                      ? 'border-[#3b82f6] ring-1 ring-blue-50'
                      : 'border-border',
                    step.status === 'Approved' ? 'border-[#10b981]/30 bg-[#10b981]/5' : '',
                  )}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-xs truncate mb-1.5">
                    {STATUS_STYLE[step.status]?.icon}
                    <span className="truncate">{step.name}</span>
                  </div>
                  <div className="space-y-1 text-[10px] text-muted-foreground leading-tight">
                    <div className="flex items-center gap-1">
                      <UserCircle className="w-3 h-3 shrink-0" />
                      <span className="truncate">{step.assigneeName}</span>
                    </div>
                    {step.date && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>{fmtDate(step.date)}</span>
                      </div>
                    )}
                    <div className="mt-1 pt-0.5">
                      <Badge
                        className={cn(
                          'pointer-events-none font-medium text-[9px] px-1 py-0 h-3.5 leading-none',
                          STATUS_STYLE[step.status]?.color,
                        )}
                      >
                        {step.status}
                      </Badge>
                    </div>
                  </div>
                  {step.status === 'In Progress' && (
                    <div className="absolute -inset-[1px] border border-[#3b82f6] rounded-lg animate-pulse opacity-20 pointer-events-none" />
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div className="flex items-center justify-center text-muted-foreground/40 w-6 sm:w-8 shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card rounded-xl border shadow-sm flex-1 flex flex-col min-h-0">
        <div className="p-4 sm:p-6 border-b shrink-0">
          <h3 className="text-lg font-semibold">Workflow Details</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {steps.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No workflow details available.</p>
          ) : (
            steps.map((step) => (
              <div
                key={step.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-muted/10 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-center w-5 shrink-0 hidden sm:flex">
                  {STATUS_STYLE[step.status]?.icon}
                </div>
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <h4
                    className="font-semibold text-sm truncate w-[200px] shrink-0"
                    title={step.name}
                  >
                    {step.name}
                  </h4>
                  <div
                    className="text-xs text-muted-foreground flex items-center gap-1.5 w-[140px] shrink-0 truncate"
                    title={step.assigneeName}
                  >
                    <UserCircle className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{step.assigneeName}</span>
                  </div>
                  {step.date && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 w-[130px] shrink-0">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{fmtDate(step.date)}</span>
                    </div>
                  )}
                  <Badge
                    className={cn(
                      'text-[10px] px-1.5 py-0 h-4 whitespace-nowrap',
                      STATUS_STYLE[step.status]?.color,
                    )}
                  >
                    {step.status}
                  </Badge>
                </div>
                {step.comments && (
                  <p
                    className="text-foreground text-xs leading-relaxed line-clamp-1 max-w-xs shrink-0"
                    title={step.comments}
                  >
                    {step.comments}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
