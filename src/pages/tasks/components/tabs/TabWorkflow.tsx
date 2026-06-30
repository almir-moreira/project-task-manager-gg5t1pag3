import { useState, useEffect, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  UserCircle,
  PlayCircle,
  FileText,
  Share2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { REVIEWER_ROLES, APPROVER_ROLES } from './review-roles'

const STATUS_STYLES = {
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
  Rejected: {
    color: 'bg-[#ef4444] text-white border-[#ef4444]',
    icon: <XCircle className="w-4 h-4 text-[#ef4444]" />,
  },
}

const fmtDate = (d: string | null, p = 'MMM d, yyyy') => {
  if (!d) return ''
  try {
    return format(new Date(d), p)
  } catch {
    return d
  }
}

export function TabWorkflow({ activity }: { activity: any }) {
  const [profiles, setProfiles] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, name')
      .then(({ data }) => {
        if (data) setProfiles(data.reduce((acc: any, p: any) => ({ ...acc, [p.id]: p.name }), {}))
        setLoading(false)
      })
  }, [])

  const steps = useMemo(() => {
    const all: any[] = []
    const allRoles = [
      ...REVIEWER_ROLES.map((r) => ({ ...r, type: 'Review' })),
      ...APPROVER_ROLES.map((a) => ({ ...a, type: 'Approval' })),
    ]
    allRoles.forEach((role) => {
      if (!activity?.[role.requiredField]) return
      const assigneeId = activity?.[role.idField]
      all.push({
        id: role.idField,
        name: `${role.label} ${role.type}`,
        date: activity?.[role.dateField],
        comments: activity?.[role.commentsField] || '',
        assigneeName: assigneeId ? profiles[assigneeId] || 'Assigned' : 'Unassigned',
        status: activity?.[role.approvedField] ? 'Approved' : 'Pending',
      })
    })
    const firstPending = all.findIndex((s) => s.status === 'Pending')
    if (firstPending !== -1) all[firstPending].status = 'In Progress'
    return all
  }, [activity, profiles])

  const completedCount = steps.filter((s) => s.status === 'Approved').length

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="flex-1 w-full rounded-xl" />
      </div>
    )
  }

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
        <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
          <Badge
            variant="outline"
            className="text-sm px-3 py-1 bg-muted/50 w-full sm:w-auto justify-center"
          >
            {completedCount} of {steps.length} approvals complete
          </Badge>
          <div className="flex items-center gap-2 mt-3 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Share2 className="w-4 h-4 mr-2" /> Share
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
              Select required roles in Activity Details to build the workflow.
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
                    step.status === 'Rejected' ? 'border-[#ef4444]/30 bg-[#ef4444]/5' : '',
                  )}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-xs truncate mb-1.5">
                    {STATUS_STYLES[step.status as keyof typeof STATUS_STYLES]?.icon}
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
                          STATUS_STYLES[step.status as keyof typeof STATUS_STYLES]?.color,
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
                      {STATUS_STYLES[step.status as keyof typeof STATUS_STYLES]?.icon}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
                      <div className="flex items-center gap-2 w-full sm:w-[200px] shrink-0">
                        <h4 className="font-semibold text-sm truncate" title={step.name}>
                          {step.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div
                          className="text-xs text-muted-foreground flex items-center gap-1.5 w-[140px] shrink-0 truncate"
                          title={step.assigneeName}
                        >
                          <UserCircle className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{step.assigneeName}</span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 w-[130px] shrink-0">
                          {step.date && (
                            <>
                              <Clock className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{fmtDate(step.date)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge
                          className={cn(
                            'text-[10px] px-1.5 py-0 h-4 whitespace-nowrap',
                            STATUS_STYLES[step.status as keyof typeof STATUS_STYLES]?.color,
                          )}
                        >
                          {step.status}
                        </Badge>
                      </div>
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
