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
import {
  getDepartmentalWorkflowConfigs,
  upsertActivityWorkflow,
  deleteActivityWorkflow,
  updateActivityWorkflowFields,
} from '@/services/activity-workflows'
import { useToast } from '@/hooks/use-toast'
import type { DeptFieldMapping } from './workflow-dept-config'
import { canProvideFeedback } from '@/lib/permissions'
import { usePermissions } from '@/hooks/use-permissions'

const FEEDBACK_DEPTS: (DeptFieldMapping & { order: number })[] = [
  {
    order: 1,
    workflowRole: 'Partnerships',
    label: 'Partnerships',
    enabledField: 'wf_partnerships',
    reviewerIdField: 'wf_partnerships_reviewer_id',
  },
  {
    order: 2,
    workflowRole: 'Relex',
    label: 'RELEX',
    enabledField: 'wf_relex',
    reviewerIdField: 'wf_relex_reviewer_id',
  },
  {
    order: 3,
    workflowRole: 'Legal',
    label: 'Legal',
    enabledField: 'wf_legal',
    reviewerIdField: 'wf_legal_reviewer_id',
  },
  {
    order: 4,
    workflowRole: 'GoB',
    label: 'Governing Bodies',
    enabledField: 'wf_gob',
    reviewerIdField: 'wf_gob_reviewer_id',
  },
  {
    order: 5,
    workflowRole: 'Protocol',
    label: 'Protocol',
    enabledField: 'wf_protocol',
    reviewerIdField: 'wf_protocol_reviewer_id',
  },
  {
    order: 6,
    workflowRole: 'EMS',
    label: 'EMS',
    enabledField: 'wf_ems',
    reviewerIdField: 'wf_ems_reviewer_id',
  },
  {
    order: 7,
    workflowRole: 'Procurement',
    label: 'Procurement',
    enabledField: 'wf_procurement',
    reviewerIdField: 'wf_procurement_reviewer_id',
  },
  {
    order: 8,
    workflowRole: 'Technology',
    label: 'Technology',
    enabledField: 'wf_technology',
    reviewerIdField: 'wf_technology_reviewer_id',
  },
  {
    order: 9,
    workflowRole: 'M&E',
    label: 'M&E',
    enabledField: 'wf_mne',
    reviewerIdField: 'wf_mne_reviewer_id',
  },
  {
    order: 10,
    workflowRole: 'COMMS',
    label: 'Communications',
    enabledField: 'wf_comms',
    reviewerIdField: 'wf_comms_reviewer_id',
  },
  {
    order: 11,
    workflowRole: 'Social Media',
    label: 'Social Media',
    enabledField: 'wf_social_media',
    reviewerIdField: 'wf_social_media_reviewer_id',
  },
]

type FeedbackStatus = 'Not Included' | 'Pending' | 'In Progress' | 'Completed'

const STATUS_STYLES: Record<FeedbackStatus, string> = {
  'Not Included': 'bg-gray-100 text-gray-500 border-gray-200',
  Pending: 'bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5]',
  'In Progress': 'bg-[#DBEAFE] text-[#1E3A8A] border-[#93C5FD]',
  Completed: 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC]',
}

function computeStatus(
  enabled: boolean,
  reviewerId: string | null,
  text: string,
  date: string,
): FeedbackStatus {
  if (!enabled) return 'Not Included'
  const hasText = !!text?.trim()
  const hasDate = !!date
  if (hasText && hasDate) return 'Completed'
  if (reviewerId || hasText || hasDate) return 'In Progress'
  return 'Pending'
}

interface DeptRow extends DeptFieldMapping {
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

  useEffect(() => {
    if (!activity?.id) {
      setLoading(false)
      return
    }
    Promise.all([
      supabase.from('profiles').select('id, name, email').order('name'),
      getDepartmentalWorkflowConfigs(),
      supabase.from('activity_workflows').select('*').eq('activity_id', activity.id),
    ]).then(([pRes, wfs, awRes]) => {
      if (pRes.data) setProfiles(pRes.data)
      const wfMap = new Map<string, string>()
      ;(wfs || []).forEach((wf: any) => {
        if (wf.role) wfMap.set(wf.role, wf.id)
      })
      setDeptRows(
        FEEDBACK_DEPTS.map((d) => ({ ...d, workflowId: wfMap.get(d.workflowRole) ?? null })),
      )
      const map: Record<string, any> = {}
      ;(awRes.data || []).forEach((aw: any) => {
        map[aw.workflow_id] = aw
      })
      setAwMap(map)
      setLoading(false)
    })
  }, [activity?.id])

  const handleToggle = useCallback(
    async (dept: DeptRow, checked: boolean) => {
      if (!activity || !onUpdate) return
      try {
        const updates: any = { [dept.enabledField]: checked }
        if (!checked) updates[dept.reviewerIdField] = null
        const updated = await updateActivity(activity.id, updates)
        if (dept.workflowId) {
          if (checked) {
            const rev = activity[dept.reviewerIdField] || null
            const result = await upsertActivityWorkflow(activity.id, dept.workflowId, rev)
            setAwMap((prev) => ({ ...prev, [dept.workflowId!]: result }))
          } else {
            await deleteActivityWorkflow(activity.id, dept.workflowId)
            setAwMap((prev) => {
              const n = { ...prev }
              delete n[dept.workflowId!]
              return n
            })
          }
        }
        onUpdate(updated)
      } catch {
        toast({ title: 'Error updating department', variant: 'destructive' })
      }
    },
    [activity, onUpdate, toast],
  )

  const handleReviewer = useCallback(
    async (dept: DeptRow, val: string) => {
      if (!activity || !onUpdate) return
      const reviewerId = val === 'unassigned' ? null : val
      try {
        const updated = await updateActivity(activity.id, {
          [dept.reviewerIdField]: reviewerId,
        } as any)
        if (dept.workflowId) {
          const aw = awMap[dept.workflowId]
          const text = aw?.comments || ''
          const date = aw?.completed_at || ''
          const status = computeStatus(true, reviewerId, text, date)
          const awStatus = status === 'Not Included' ? 'Pending' : status
          await updateActivityWorkflowFields(activity.id, dept.workflowId, {
            reviewer_id: reviewerId,
            status: awStatus,
          })
          setAwMap((prev) => ({
            ...prev,
            [dept.workflowId!]: {
              ...prev[dept.workflowId!],
              reviewer_id: reviewerId,
              status: awStatus,
            },
          }))
        }
        onUpdate(updated)
      } catch {
        toast({ title: 'Error updating reviewer', variant: 'destructive' })
      }
    },
    [activity, onUpdate, awMap, toast],
  )

  const handleText = useCallback(
    async (dept: DeptRow, text: string) => {
      if (!activity || !dept.workflowId) return
      const aw = awMap[dept.workflowId]
      const rev = activity[dept.reviewerIdField] || null
      const date = aw?.completed_at || ''
      const status = computeStatus(true, rev, text, date)
      const awStatus = status === 'Not Included' ? 'Pending' : status
      try {
        await updateActivityWorkflowFields(activity.id, dept.workflowId, {
          comments: text,
          status: awStatus,
        })
        setAwMap((prev) => ({
          ...prev,
          [dept.workflowId!]: { ...prev[dept.workflowId!], comments: text, status: awStatus },
        }))
      } catch {
        toast({ title: 'Error saving feedback', variant: 'destructive' })
      }
    },
    [activity, awMap, toast],
  )

  const handleDate = useCallback(
    async (dept: DeptRow, dateVal: string) => {
      if (!activity || !dept.workflowId) return
      const aw = awMap[dept.workflowId]
      const rev = activity[dept.reviewerIdField] || null
      const text = aw?.comments || ''
      const status = computeStatus(true, rev, text, dateVal)
      const awStatus = status === 'Not Included' ? 'Pending' : status
      const completedAt = dateVal ? new Date(dateVal + 'T00:00:00').toISOString() : null
      try {
        await updateActivityWorkflowFields(activity.id, dept.workflowId, {
          completed_at: completedAt,
          status: awStatus,
        })
        setAwMap((prev) => ({
          ...prev,
          [dept.workflowId!]: {
            ...prev[dept.workflowId!],
            completed_at: completedAt,
            status: awStatus,
          },
        }))
      } catch {
        toast({ title: 'Error saving date', variant: 'destructive' })
      }
    },
    [activity, awMap, toast],
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
              const canFeedback = canProvideFeedback(permUser, activity, dept.label)
              const reviewerId = activity[dept.reviewerIdField] || 'unassigned'
              const aw = dept.workflowId ? awMap[dept.workflowId] : null
              const feedbackText = aw?.comments || ''
              const feedbackDate = aw?.completed_at
                ? new Date(aw.completed_at).toISOString().split('T')[0]
                : ''
              const status = computeStatus(
                isEnabled,
                reviewerId === 'unassigned' ? null : reviewerId,
                feedbackText,
                feedbackDate,
              )

              return (
                <TableRow key={dept.enabledField} className="align-top">
                  <TableCell className="font-medium text-sm py-4">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isEnabled}
                        onCheckedChange={(v) => handleToggle(dept, !!v)}
                        disabled={!canFeedback}
                      />
                      {dept.label}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Select
                      value={reviewerId}
                      onValueChange={(v) => handleReviewer(dept, v)}
                      disabled={!isEnabled || !canFeedback}
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
                        disabled={!canFeedback}
                        onBlur={(e) => {
                          if (canFeedback && e.target.value !== feedbackDate) {
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
                      <Textarea
                        className="min-h-[40px] resize-y text-sm"
                        defaultValue={feedbackText}
                        disabled={!canFeedback}
                        onBlur={(e) => {
                          if (canFeedback && e.target.value !== feedbackText) {
                            handleText(dept, e.target.value)
                          }
                        }}
                        placeholder="Enter feedback..."
                      />
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
