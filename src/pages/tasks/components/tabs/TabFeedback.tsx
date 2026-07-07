import { useState, useEffect, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { updateActivity } from '@/services/activities'
import { useToast } from '@/hooks/use-toast'
import { canProvideFeedback, isReadOnly } from '@/lib/permissions'
import { usePermissions } from '@/hooks/use-permissions'
import {
  FEEDBACK_UNITS_CONFIG,
  computeFeedbackStatus,
  fetchFeedbackWorkflowDefs,
  fetchActivityWorkflows,
  ensureActivityWorkflow,
  ensureWorkflowDefinition,
  saveFeedbackFields,
  removeActivityWorkflow,
  type FeedbackUnitConfig,
  type FeedbackStatus,
} from '@/services/feedbackService'

const STATUS_STYLES: Record<FeedbackStatus, string> = {
  'Not Included': 'bg-gray-100 text-gray-500 border-gray-200',
  Pending: 'bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5]',
  'In Progress': 'bg-[#DBEAFE] text-[#1E3A8A] border-[#93C5FD]',
  Completed: 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC]',
}

interface DeptRow extends FeedbackUnitConfig {
  workflowId: string | null
}

export function TabFeedback({
  activity,
  onUpdate,
}: {
  activity?: any
  onUpdate?: (a: any) => void
}) {
  const [profiles, setProfiles] = useState<any[]>([])
  const [deptRows, setDeptRows] = useState<DeptRow[]>([])
  const [awMap, setAwMap] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { permUser } = usePermissions()
  const isRO = isReadOnly(permUser)

  useEffect(() => {
    if (!activity?.id) {
      setLoading(false)
      return
    }
    Promise.all([
      supabase.from('profiles').select('id, name, email').order('name'),
      fetchFeedbackWorkflowDefs(),
      fetchActivityWorkflows(activity.id),
    ]).then(([pRes, wfMap, awData]) => {
      if (pRes.data) setProfiles(pRes.data)
      setDeptRows(
        FEEDBACK_UNITS_CONFIG.map((u) => ({
          ...u,
          workflowId: wfMap.get(u.workflowRole) ?? null,
        })),
      )
      setAwMap(awData)
      setLoading(false)
    })
  }, [activity?.id])

  const resolveWorkflowId = useCallback(async (dept: DeptRow): Promise<string | null> => {
    if (dept.workflowId) return dept.workflowId
    try {
      const wfId = await ensureWorkflowDefinition(dept.workflowRole)
      if (wfId) {
        setDeptRows((prev) =>
          prev.map((d) => (d.key === dept.key ? { ...d, workflowId: wfId } : d)),
        )
      }
      return wfId
    } catch {
      return null
    }
  }, [])

  const handleToggle = useCallback(
    async (dept: DeptRow, checked: boolean) => {
      if (!activity || !onUpdate) return
      if (!canProvideFeedback(permUser, activity, dept.label)) return
      try {
        const updates: any = { [dept.enabledField]: checked }
        if (!checked) updates[dept.reviewerIdField] = null
        const updated = await updateActivity(activity.id, updates)
        const wfId = checked ? await resolveWorkflowId(dept) : dept.workflowId
        if (wfId) {
          if (checked) {
            const rev = activity[dept.reviewerIdField] || null
            const result = await ensureActivityWorkflow(activity.id, wfId, rev)
            setAwMap((prev) => ({ ...prev, [wfId]: result }))
          } else {
            await removeActivityWorkflow(activity.id, wfId)
            setAwMap((prev) => {
              const n = { ...prev }
              delete n[wfId]
              return n
            })
          }
        }
        onUpdate(updated)
      } catch {
        toast({ title: 'Error updating department', variant: 'destructive' })
      }
    },
    [activity, onUpdate, toast, permUser, resolveWorkflowId],
  )

  const handleReviewer = useCallback(
    async (dept: DeptRow, val: string) => {
      if (!activity || !onUpdate) return
      if (!canProvideFeedback(permUser, activity, dept.label)) return
      const reviewerId = val === 'unassigned' ? null : val
      try {
        const updated = await updateActivity(activity.id, {
          [dept.reviewerIdField]: reviewerId,
        } as any)
        const wfId = await resolveWorkflowId(dept)
        if (wfId) {
          const aw = awMap[wfId]
          const text = aw?.comments || ''
          const date = aw?.completed_at || ''
          const status = computeFeedbackStatus(true, reviewerId, text, date)
          const awStatus = status === 'Not Included' ? 'Pending' : status
          const result = await saveFeedbackFields(activity.id, wfId, {
            reviewer_id: reviewerId,
            status: awStatus,
          })
          setAwMap((prev) => ({
            ...prev,
            [wfId]: result,
          }))
        }
        onUpdate(updated)
      } catch {
        toast({ title: 'Error updating reviewer', variant: 'destructive' })
      }
    },
    [activity, onUpdate, awMap, toast, permUser, resolveWorkflowId],
  )

  const handleText = useCallback(
    async (dept: DeptRow, text: string) => {
      if (!activity) return
      if (!canProvideFeedback(permUser, activity, dept.label)) return
      const wfId = await resolveWorkflowId(dept)
      if (!wfId) {
        toast({ title: 'Unable to resolve workflow for this unit', variant: 'destructive' })
        return
      }
      const aw = awMap[wfId]
      const rev = activity[dept.reviewerIdField] || null
      const date = aw?.completed_at || ''
      const status = computeFeedbackStatus(true, rev, text, date)
      const awStatus = status === 'Not Included' ? 'Pending' : status
      try {
        const result = await saveFeedbackFields(activity.id, wfId, {
          comments: text,
          status: awStatus,
        })
        setAwMap((prev) => ({
          ...prev,
          [wfId]: result,
        }))
      } catch {
        toast({ title: 'Error saving feedback', variant: 'destructive' })
      }
    },
    [activity, awMap, toast, permUser, resolveWorkflowId],
  )

  const handleDate = useCallback(
    async (dept: DeptRow, dateVal: string) => {
      if (!activity) return
      if (!canProvideFeedback(permUser, activity, dept.label)) return
      const wfId = await resolveWorkflowId(dept)
      if (!wfId) {
        toast({ title: 'Unable to resolve workflow for this unit', variant: 'destructive' })
        return
      }
      const aw = awMap[wfId]
      const rev = activity[dept.reviewerIdField] || null
      const text = aw?.comments || ''
      const status = computeFeedbackStatus(true, rev, text, dateVal)
      const awStatus = status === 'Not Included' ? 'Pending' : status
      const completedAt = dateVal ? new Date(dateVal + 'T00:00:00').toISOString() : null
      try {
        const result = await saveFeedbackFields(activity.id, wfId, {
          completed_at: completedAt,
          status: awStatus,
        })
        setAwMap((prev) => ({
          ...prev,
          [wfId]: result,
        }))
      } catch {
        toast({ title: 'Error saving date', variant: 'destructive' })
      }
    },
    [activity, awMap, toast, permUser, resolveWorkflowId],
  )

  if (!activity) return null
  if (loading) {
    return <div className="p-4 text-sm text-muted-foreground">Loading feedback...</div>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[180px]">Unit / Dept</TableHead>
              <TableHead className="w-[200px]">Reviewer</TableHead>
              <TableHead className="w-[130px]">Status</TableHead>
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead className="min-w-[220px]">Feedback</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deptRows.map((dept) => {
              const isEnabled = !!activity[dept.enabledField]
              const canFb = canProvideFeedback(permUser, activity, dept.label) && !isRO
              const reviewerId = activity[dept.reviewerIdField] || 'unassigned'
              const aw = dept.workflowId ? awMap[dept.workflowId] : null
              const feedbackText = aw?.comments || ''
              const feedbackDate = aw?.completed_at
                ? new Date(aw.completed_at).toISOString().split('T')[0]
                : ''
              const status = computeFeedbackStatus(
                isEnabled,
                reviewerId === 'unassigned' ? null : reviewerId,
                feedbackText,
                feedbackDate,
              )

              return (
                <TableRow key={dept.key} className="align-top">
                  <TableCell className="font-medium text-sm py-4">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isEnabled}
                        onCheckedChange={(v) => handleToggle(dept, !!v)}
                        disabled={!canFb}
                      />
                      {dept.label}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Select
                      value={reviewerId}
                      onValueChange={(v) => handleReviewer(dept, v)}
                      disabled={!isEnabled || !canFb}
                    >
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue placeholder="Select reviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned" className="text-muted-foreground">
                          Select reviewer
                        </SelectItem>
                        {profiles.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name || p.email || 'Unknown'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant="outline"
                      className={`${STATUS_STYLES[status]} rounded-full px-2.5 py-0.5 font-medium shadow-sm whitespace-nowrap`}
                    >
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    {isEnabled ? (
                      <Input
                        type="date"
                        className="h-9"
                        defaultValue={feedbackDate}
                        disabled={!canFb}
                        onBlur={(e) => {
                          if (canFb && e.target.value !== feedbackDate) {
                            handleDate(dept, e.target.value)
                          }
                        }}
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    {isEnabled ? (
                      <div className="space-y-1">
                        <Textarea
                          className="min-h-[40px] resize-y text-sm"
                          defaultValue={feedbackText}
                          disabled={!canFb}
                          onBlur={(e) => {
                            if (canFb && e.target.value !== feedbackText) {
                              handleText(dept, e.target.value)
                            }
                          }}
                          placeholder="Enter feedback..."
                        />
                        {!canFb && (
                          <p className="text-xs text-muted-foreground italic">
                            You can view this feedback, but you do not have permission to edit it.
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">Not included</span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
