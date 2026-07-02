import { useEffect, useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  XCircle,
  Clock,
  ArrowRight,
  UserCircle,
  AlertCircle,
  FileText,
  Share2,
  RefreshCw,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import {
  WORKFLOW_STEPS,
  getStatusColor,
  getStatusIcon,
  formatDate,
  getWorkflowStepStatusStyles,
} from './workflow-steps-config'

interface WorkflowStep {
  id: string
  name: string
  order: number
  reviewerName: string
  status: string
  comments: string
  date: string | null
}

export function TabWorkflow({ activity }: { activity: any }) {
  const [profiles, setProfiles] = useState<Record<string, string>>({})
  const [awList, setAwList] = useState<any[]>([])
  const [wfMap, setWfMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activity?.id) {
      setLoading(false)
      return
    }
    const fetchAll = async () => {
      const [pRes, wRes, aRes] = await Promise.all([
        supabase.from('profiles').select('id, name'),
        supabase
          .from('workflows')
          .select('id, role')
          .or(`activity_id.eq.${activity.id},activity_id.is.null`),
        supabase.from('activity_workflows').select('*').eq('activity_id', activity.id),
      ])
      if (pRes.data)
        setProfiles(pRes.data.reduce((a: any, p: any) => ({ ...a, [p.id]: p.name }), {}))
      if (wRes.data) setWfMap(wRes.data.reduce((a: any, w: any) => ({ ...a, [w.role]: w.id }), {}))
      if (aRes.data) setAwList(aRes.data)
      setLoading(false)
    }
    fetchAll()
    const ch = supabase
      .channel(`aw_${activity.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_workflows',
          filter: `activity_id=eq.${activity.id}`,
        },
        fetchAll,
      )
      .subscribe()
    return () => {
      supabase.removeChannel(ch)
    }
  }, [activity?.id])

  const steps = useMemo<WorkflowStep[]>(() => {
    if (!activity) return []
    const built = WORKFLOW_STEPS.filter((s) => !!activity[s.enabledField]).map((s) => {
      const wfId = wfMap[s.workflowRole] ?? null
      const aw = wfId ? awList.find((a) => a.workflow_id === wfId) : null
      const revId = activity[s.reviewerIdField] || aw?.reviewer_id || null
      let status = 'Pending'
      let comments = ''
      let date: string | null = null
      if (s.commentsField) comments = activity[s.commentsField] || ''
      if (s.dateField && activity[s.dateField]) date = activity[s.dateField]
      if (aw) {
        if (aw.status) status = aw.status
        if (aw.comments) comments = aw.comments
        if (aw.completed_at) date = aw.completed_at
      }
      if (s.approvedField && activity[s.approvedField]) status = 'Completed'
      return {
        id: s.id,
        name: s.displayName,
        order: s.order,
        reviewerName: revId ? profiles[revId] || 'Assigned' : 'Unassigned',
        status,
        comments,
        date,
      }
    })
    const fp = built.findIndex((s) => s.status === 'Pending')
    if (fp !== -1) built[fp].status = 'In Progress'
    return built
  }, [activity, wfMap, awList, profiles])

  if (!activity) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <XCircle className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="text-lg font-medium">Activity not found</h3>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6 h-full flex flex-col">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="flex-1 w-full rounded-xl" />
      </div>
    )
  }

  const completedCount = steps.filter((s) => s.status === 'Completed').length

  return (
    <div className="flex flex-col h-full space-y-6 p-4 sm:p-6 animate-fade-in bg-muted/5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {activity.activity_name || activity.title || 'Activity Workflow'}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
            <span>ID: {activity.task_number || activity.id?.split('-')[0]}</span>
            {activity.end_date && (
              <span>• Est. Completion: {formatDate(activity.end_date, 'MMM d, yyyy')}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
          <Badge
            variant="outline"
            className="text-sm px-3 py-1 bg-muted/50 w-full sm:w-auto justify-center"
          >
            {completedCount} of {steps.length} approvals complete
          </Badge>
          <div className="flex items-center gap-2 mt-3 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Share2 className="w-4 h-4 mr-2" /> Share Status
            </Button>
            <Button variant="default" size="sm" className="flex-1 sm:flex-none">
              <RefreshCw className="w-4 h-4 mr-2" /> Resubmit
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-xl border shadow-sm overflow-x-auto shrink-0">
        <h3 className="text-lg font-semibold mb-4">Workflow Status</h3>
        {steps.length === 0 ? (
          <div className="text-center p-8 bg-muted/20 rounded-lg border border-dashed border-border">
            <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No workflow steps configured.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Enable departments in the Feedback tab or roles in the Review & Approval tab.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-max pb-2">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center shrink-0">
                <div
                  className={cn(
                    'relative flex flex-col p-2.5 rounded-lg border w-40 sm:w-48 shadow-sm transition-all duration-200 hover:shadow-md shrink-0',
                    getWorkflowStepStatusStyles(step.status).card,
                    step.status === 'In Progress' && 'ring-1 ring-blue-200',
                  )}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-xs truncate">
                      {getStatusIcon(step.status)}
                      <span className="truncate">{step.name}</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-[10px] text-muted-foreground leading-tight">
                    <div className="flex items-center gap-1">
                      <UserCircle className="w-3 h-3 shrink-0" />
                      <span className="truncate">{step.reviewerName}</span>
                    </div>
                    {step.date && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>{formatDate(step.date, 'MMM d, HH:mm')}</span>
                      </div>
                    )}
                    <div className="mt-1 pt-0.5">
                      <Badge
                        className={cn(
                          'pointer-events-none font-medium text-[9px] px-1 py-0 h-3.5 leading-none border',
                          getWorkflowStepStatusStyles(step.status).badge,
                        )}
                      >
                        {step.status}
                      </Badge>
                    </div>
                  </div>
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
        <ScrollArea className="flex-1">
          <div className="p-4 sm:p-6 space-y-3">
            {steps.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No workflow details available.
              </p>
            ) : (
              steps.map((step) => (
                <div
                  key={step.id}
                  className="flex flex-col xl:flex-row items-start xl:items-center gap-3 p-3 rounded-lg border bg-muted/10 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 w-full">
                    <div className="flex items-center justify-center w-5 shrink-0 hidden sm:flex">
                      {getStatusIcon(step.status)}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
                      <div className="flex items-center gap-2 w-full sm:w-[200px] shrink-0">
                        <div className="sm:hidden shrink-0">{getStatusIcon(step.status)}</div>
                        <h4 className="font-semibold text-sm truncate" title={step.name}>
                          {step.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div
                          className="text-xs text-muted-foreground flex items-center gap-1.5 w-[140px] shrink-0 truncate"
                          title={step.reviewerName}
                        >
                          <UserCircle className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{step.reviewerName}</span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 w-[130px] shrink-0">
                          {step.date && (
                            <>
                              <Clock className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{formatDate(step.date)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          'text-[10px] px-1.5 py-0 h-4 whitespace-nowrap border',
                          getWorkflowStepStatusStyles(step.status).badge,
                        )}
                      >
                        {step.status}
                      </Badge>
                    </div>
                  </div>
                  {step.comments && (
                    <div className="w-full xl:w-auto xl:max-w-xs mt-2 xl:mt-0 p-2 xl:p-0 bg-background xl:bg-transparent rounded-lg border xl:border-none text-xs flex gap-2 items-start shrink-0">
                      <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5 xl:hidden" />
                      <p
                        className="text-foreground text-xs leading-relaxed line-clamp-2 xl:line-clamp-1"
                        title={step.comments}
                      >
                        {step.comments}
                      </p>
                    </div>
                  )}
                  <div className="w-full xl:w-auto mt-2 xl:mt-0 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full xl:w-auto h-8 text-xs bg-background xl:bg-transparent border xl:border-transparent"
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
