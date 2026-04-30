import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ArrowDown,
  UserCircle,
  PlayCircle,
  SkipForward,
  FileText,
  Share2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export function TabWorkflow({ activity }: { activity: any }) {
  const [currentActivity, setCurrentActivity] = useState(activity)
  const [profiles, setProfiles] = useState<Record<string, string>>({})
  const [workflows, setWorkflows] = useState<any[]>([])
  const [activeWorkflows, setActiveWorkflows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setCurrentActivity(activity)
  }, [activity])

  useEffect(() => {
    if (!activity?.id) return

    const fetchAll = async () => {
      const [profilesRes, workflowsRes, activeRes] = await Promise.all([
        supabase.from('profiles').select('id, name'),
        supabase.from('workflows').select('*').order('stage').order('step'),
        supabase.from('activity_workflows').select('*').eq('activity_id', activity.id),
      ])

      if (profilesRes.data) {
        setProfiles(profilesRes.data.reduce((acc: any, p: any) => ({ ...acc, [p.id]: p.name }), {}))
      }
      if (workflowsRes.data) setWorkflows(workflowsRes.data)
      if (activeRes.data) setActiveWorkflows(activeRes.data)
      setLoading(false)
    }

    fetchAll()

    const channel = supabase
      .channel(`activity_workflows_${activity.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_workflows',
          filter: `activity_id=eq.${activity.id}`,
        },
        () => fetchAll(),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activity?.id])

  if (!currentActivity) {
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

  // Steps in Final Review (Review) and Approval are mandatory. Feedback is selectable.
  const selectedWorkflows = workflows.filter((wf) => {
    if (wf.category === 'Review' || wf.category === 'Approval') return true
    return activeWorkflows.some((aw) => aw.workflow_id === wf.id)
  })

  let steps = selectedWorkflows
    .sort((a, b) => {
      if (a.stage !== b.stage) return (a.stage || 0) - (b.stage || 0)
      return (a.step || 0) - (b.step || 0)
    })
    .map((wf) => {
      const active = activeWorkflows.find((aw) => aw.workflow_id === wf.id)
      const assigneeId = active?.reviewer_id
      const categoryName =
        wf.category === 'Approval'
          ? 'Approval'
          : wf.category === 'Review'
            ? 'Review'
            : wf.category || 'Review'

      return {
        id: wf.id,
        name: `${wf.role} ${categoryName}`,
        date: active?.completed_at,
        comments: active?.comments || '',
        assigneeId,
        assigneeName: assigneeId ? profiles[assigneeId] || 'Assigned Reviewer' : 'Unassigned',
        status: active?.status || 'Pending',
      }
    })

  if (steps.length > 0) {
    const firstPendingIndex = steps.findIndex((s) => s.status === 'Pending')
    if (firstPendingIndex !== -1) steps[firstPendingIndex].status = 'In Progress'
  }

  const completedCount = steps.filter((s) => s.status === 'Approved').length
  const totalCount = steps.length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-[#10b981] text-white border-[#10b981]'
      case 'In Progress':
        return 'bg-[#3b82f6] text-white border-[#3b82f6]'
      case 'Pending':
        return 'bg-[#d1d5db] text-gray-700 border-[#d1d5db]'
      case 'Rejected':
        return 'bg-[#ef4444] text-white border-[#ef4444]'
      case 'Skipped':
        return 'bg-[#c4b5fd] text-purple-900 border-[#c4b5fd]'
      default:
        return 'bg-gray-200 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
      case 'In Progress':
        return <PlayCircle className="w-4 h-4 text-[#3b82f6]" />
      case 'Pending':
        return <Clock className="w-4 h-4 text-gray-400" />
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-[#ef4444]" />
      case 'Skipped':
        return <SkipForward className="w-4 h-4 text-[#c4b5fd]" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateStr: string | null, pattern = 'MMM d, yyyy HH:mm') => {
    if (!dateStr) return ''
    try {
      return format(new Date(dateStr), pattern)
    } catch {
      return dateStr
    }
  }

  return (
    <div className="flex flex-col h-full space-y-6 p-4 sm:p-6 animate-fade-in bg-muted/5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {currentActivity.activity_name || currentActivity.title || 'Activity Workflow'}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
            <span>ID: {currentActivity.task_number || currentActivity.id?.split('-')[0]}</span>
            {currentActivity.end_date && (
              <span>• Est. Completion: {formatDate(currentActivity.end_date, 'MMM d, yyyy')}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
          <Badge
            variant="outline"
            className="text-sm px-3 py-1 bg-muted/50 w-full sm:w-auto justify-center"
          >
            {completedCount} of {totalCount} approvals complete
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
              Please configure workflow stages to track progress.
            </p>
          </div>
        ) : (
          <div
            className={cn(
              'flex items-start gap-2 min-w-max',
              steps.length > 6 ? 'flex-col min-w-0' : 'flex-col xl:flex-row xl:min-w-max',
            )}
          >
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  'flex',
                  steps.length > 6 ? 'flex-col' : 'flex-col xl:flex-row flex-1',
                  'items-center xl:items-start w-full xl:w-auto',
                )}
              >
                <div
                  className={cn(
                    'relative flex flex-col p-2.5 rounded-lg border w-full xl:w-40 bg-background shadow-sm transition-all duration-200 hover:shadow-md',
                    step.status === 'In Progress'
                      ? 'border-[#3b82f6] shadow-blue-100 ring-1 ring-blue-50'
                      : 'border-border',
                    step.status === 'Approved' ? 'border-[#10b981]/30 bg-[#10b981]/5' : '',
                    step.status === 'Rejected' ? 'border-[#ef4444]/30 bg-[#ef4444]/5' : '',
                    step.status === 'Skipped'
                      ? 'border-[#c4b5fd]/30 bg-[#c4b5fd]/5 opacity-70'
                      : '',
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
                      <span className="truncate">{step.assigneeName}</span>
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
                          'pointer-events-none font-medium text-[9px] px-1 py-0 h-3.5 leading-none',
                          getStatusColor(step.status),
                        )}
                      >
                        {step.status}
                      </Badge>
                    </div>
                  </div>
                  {step.status === 'In Progress' && (
                    <div className="absolute -inset-[1px] border border-[#3b82f6] rounded-lg animate-pulse opacity-20 pointer-events-none"></div>
                  )}
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'flex items-center justify-center text-muted-foreground/40',
                      steps.length > 6 ? 'h-4 py-0.5 w-full' : 'xl:w-6 xl:h-auto h-4 py-0.5 w-full',
                    )}
                  >
                    {steps.length > 6 ? (
                      <ArrowDown className="w-4 h-4" />
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4 hidden xl:block" />
                        <ArrowDown className="w-4 h-4 block xl:hidden" />
                      </>
                    )}
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
                  className="flex flex-col sm:flex-row gap-3 p-3 sm:p-4 rounded-xl border bg-muted/10 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-center pt-1 hidden sm:flex">
                    {getStatusIcon(step.status)}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex items-center gap-2">
                        <div className="sm:hidden">{getStatusIcon(step.status)}</div>
                        <h4 className="font-semibold text-sm">{step.name}</h4>
                      </div>
                      <Badge
                        className={cn('text-[10px] px-1.5 py-0 h-4', getStatusColor(step.status))}
                      >
                        {step.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground flex flex-col sm:flex-row sm:gap-4 gap-1">
                      <span className="flex items-center gap-1">
                        <UserCircle className="w-3.5 h-3.5" /> {step.assigneeName}
                      </span>
                      {step.date && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {formatDate(step.date)}
                        </span>
                      )}
                    </div>
                    {step.comments && (
                      <div className="mt-2 p-2 sm:p-3 bg-background rounded-lg border text-xs flex gap-2 items-start shadow-sm">
                        <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-foreground leading-relaxed">{step.comments}</p>
                      </div>
                    )}
                  </div>
                  <div className="sm:ml-auto flex items-start mt-2 sm:mt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full sm:w-auto h-8 text-xs bg-background sm:bg-transparent border sm:border-transparent"
                    >
                      View Details
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
