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
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export function TabWorkflow({ activity }: { activity: any }) {
  const [currentActivity, setCurrentActivity] = useState(activity)
  const [profiles, setProfiles] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setCurrentActivity(activity)
  }, [activity])

  useEffect(() => {
    if (!activity?.id) return
    const channel = supabase
      .channel(`activity_workflow_${activity.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'activities', filter: `id=eq.${activity.id}` },
        (payload) => setCurrentActivity((prev: any) => ({ ...prev, ...payload.new })),
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [activity?.id])

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const { data } = await supabase.from('profiles').select('id, name')
        if (data) setProfiles(data.reduce((acc: any, p: any) => ({ ...acc, [p.id]: p.name }), {}))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfiles()
  }, [])

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
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="flex-1 w-full rounded-xl" />
      </div>
    )
  }

  const rawSteps = [
    {
      id: 'ems',
      name: 'EMS Review',
      condition: currentActivity.inv_ems,
      date: null,
      approved: currentActivity.inv_ems_comments ? true : null,
      comments: currentActivity.inv_ems_comments,
      assigneeId: null,
      assigneeName: 'EMS Team',
    },
    {
      id: 'tl_review',
      name: 'Team Leader Review',
      condition: currentActivity.reviewer_team_leader_id,
      date: currentActivity.reviewer_team_leader_date,
      approved: currentActivity.reviewer_team_leader_approved,
      comments: currentActivity.reviewer_team_leader_comments,
      assigneeId: currentActivity.reviewer_team_leader_id,
    },
    {
      id: 'head_review',
      name: 'Head Review',
      condition: currentActivity.reviewer_head_id,
      date: currentActivity.reviewer_head_date,
      approved: currentActivity.reviewer_head_approved,
      comments: currentActivity.reviewer_head_comments,
      assigneeId: currentActivity.reviewer_head_id,
    },
    {
      id: 'cpo_review',
      name: 'CPO Review',
      condition: currentActivity.reviewer_cpo_id,
      date: currentActivity.reviewer_cpo_date,
      approved: currentActivity.reviewer_cpo_approved,
      comments: currentActivity.reviewer_cpo_comments,
      assigneeId: currentActivity.reviewer_cpo_id,
    },
    {
      id: 'head_approval',
      name: 'Head Approval',
      condition: currentActivity.approver_head_id,
      date: currentActivity.approver_head_date,
      approved: currentActivity.approver_head_approved,
      comments: currentActivity.approver_head_comments,
      assigneeId: currentActivity.approver_head_id,
    },
    {
      id: 'cpo_approval',
      name: 'CPO Approval',
      condition: currentActivity.approver_cpo_id,
      date: currentActivity.approver_cpo_date,
      approved: currentActivity.approver_cpo_approved,
      comments: currentActivity.approver_cpo_comments,
      assigneeId: currentActivity.approver_cpo_id,
    },
    {
      id: 'sg_approval',
      name: 'SG Approval',
      condition: currentActivity.approver_sg_id,
      date: currentActivity.approver_sg_date,
      approved: currentActivity.approver_sg_approved,
      comments: currentActivity.approver_sg_comments,
      assigneeId: currentActivity.approver_sg_id,
    },
  ]

  let steps = rawSteps
    .filter((s) => s.condition)
    .map((s) => {
      let status = 'Pending'
      if (s.date || s.approved !== null) status = s.approved ? 'Approved' : 'Rejected'
      return {
        ...s,
        status,
        assigneeName:
          s.assigneeName ||
          (s.assigneeId ? profiles[s.assigneeId] || 'Assigned Reviewer' : 'Unassigned'),
      }
    })

  if (steps.length === 0) {
    steps = [
      {
        id: 'mock1',
        name: 'EMS Review',
        condition: true,
        date: '2026-01-10T10:30:00Z',
        approved: true,
        comments: 'Looks good',
        assigneeId: null,
        assigneeName: 'EMS Team',
        status: 'Approved',
      },
      {
        id: 'mock2',
        name: 'IT Clearance',
        condition: true,
        date: '2026-01-11T14:00:00Z',
        approved: true,
        comments: 'Cleared',
        assigneeId: null,
        assigneeName: 'IT Dept',
        status: 'Approved',
      },
      {
        id: 'mock3',
        name: 'Legal Approval',
        condition: true,
        date: null,
        approved: null,
        comments: '',
        assigneeId: null,
        assigneeName: 'Jane Doe',
        status: 'In Progress',
      },
      {
        id: 'mock4',
        name: 'Head Approval',
        condition: true,
        date: null,
        approved: null,
        comments: '',
        assigneeId: null,
        assigneeName: 'Mike Smith',
        status: 'Pending',
      },
    ]
  } else {
    const firstPendingIndex = steps.findIndex((s) => s.status === 'Pending')
    if (firstPendingIndex !== -1) steps[firstPendingIndex].status = 'In Progress'

    let hasRejection = false
    steps = steps.map((s) => {
      if (hasRejection) return { ...s, status: 'Skipped' }
      if (s.status === 'Rejected') hasRejection = true
      return s
    })
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
        return <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
      case 'In Progress':
        return <PlayCircle className="w-5 h-5 text-[#3b82f6]" />
      case 'Pending':
        return <Clock className="w-5 h-5 text-gray-400" />
      case 'Rejected':
        return <XCircle className="w-5 h-5 text-[#ef4444]" />
      case 'Skipped':
        return <SkipForward className="w-5 h-5 text-[#c4b5fd]" />
      default:
        return <Clock className="w-5 h-5" />
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
        <h3 className="text-lg font-semibold mb-6">Workflow Status</h3>
        <div
          className={cn(
            'flex items-start gap-4 min-w-max',
            steps.length > 4 ? 'flex-col min-w-0' : 'flex-col xl:flex-row xl:min-w-max',
          )}
        >
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'flex',
                steps.length > 4 ? 'flex-col' : 'flex-col xl:flex-row flex-1',
                'items-center xl:items-start w-full xl:w-auto',
              )}
            >
              <div
                className={cn(
                  'relative flex flex-col p-4 rounded-xl border-2 w-full xl:w-64 bg-background shadow-sm transition-all duration-200 hover:shadow-md',
                  step.status === 'In Progress'
                    ? 'border-[#3b82f6] shadow-blue-100 ring-2 ring-blue-50'
                    : 'border-transparent',
                  step.status === 'Approved' ? 'border-[#10b981]/20 bg-[#10b981]/5' : '',
                  step.status === 'Rejected' ? 'border-[#ef4444]/20 bg-[#ef4444]/5' : '',
                  step.status === 'Skipped' ? 'border-[#c4b5fd]/20 bg-[#c4b5fd]/5 opacity-70' : '',
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    {getStatusIcon(step.status)}
                    <span>{step.name}</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <UserCircle className="w-4 h-4 shrink-0" />
                    <span className="truncate">{step.assigneeName}</span>
                  </div>
                  {step.date && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>{formatDate(step.date, 'MMM d, HH:mm')}</span>
                    </div>
                  )}
                  <div className="mt-2 pt-1">
                    <Badge
                      className={cn('pointer-events-none font-medium', getStatusColor(step.status))}
                    >
                      {step.status}
                    </Badge>
                  </div>
                </div>
                {step.status === 'In Progress' && (
                  <div className="absolute -inset-1 border-2 border-[#3b82f6] rounded-xl animate-pulse opacity-20 pointer-events-none"></div>
                )}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex items-center justify-center text-muted-foreground/40',
                    steps.length > 4 ? 'h-8 py-2 w-full' : 'xl:w-12 xl:h-auto h-8 py-2 w-full',
                  )}
                >
                  {steps.length > 4 ? (
                    <ArrowDown className="w-6 h-6" />
                  ) : (
                    <>
                      <ArrowRight className="w-6 h-6 hidden xl:block" />
                      <ArrowDown className="w-6 h-6 block xl:hidden" />
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm flex-1 flex flex-col min-h-0">
        <div className="p-4 sm:p-6 border-b shrink-0">
          <h3 className="text-lg font-semibold">Approval Details</h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 sm:p-6 space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border bg-muted/10 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-center pt-1 hidden sm:flex">
                  {getStatusIcon(step.status)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div className="flex items-center gap-2">
                      <div className="sm:hidden">{getStatusIcon(step.status)}</div>
                      <h4 className="font-semibold text-base">{step.name}</h4>
                    </div>
                    <Badge className={getStatusColor(step.status)}>{step.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:gap-6 gap-1">
                    <span className="flex items-center gap-1.5">
                      <UserCircle className="w-4 h-4" /> {step.assigneeName}
                    </span>
                    {step.date && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {formatDate(step.date)}
                      </span>
                    )}
                  </div>
                  {step.comments && (
                    <div className="mt-3 p-3 sm:p-4 bg-background rounded-lg border text-sm flex gap-3 items-start shadow-sm">
                      <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-foreground leading-relaxed">{step.comments}</p>
                    </div>
                  )}
                  {step.status === 'Rejected' && !step.comments && (
                    <div className="mt-3 p-3 sm:p-4 bg-red-50 text-red-800 rounded-lg border border-red-100 text-sm shadow-sm">
                      <strong>Rejection Reason:</strong> No specific reason provided by the
                      reviewer.
                    </div>
                  )}
                </div>
                <div className="sm:ml-auto flex items-start mt-2 sm:mt-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full sm:w-auto bg-background sm:bg-transparent border sm:border-transparent"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
