import { useState, useEffect, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
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
  getActivityWorkflows,
  upsertActivityWorkflow,
  deleteActivityWorkflow,
  updateActivityWorkflowFields,
  getDepartmentalWorkflowConfigs,
} from '@/services/activity-workflows'
import { useToast } from '@/hooks/use-toast'

interface DeptConfig {
  label: string
  enabledField: string
  reviewerIdField: string
  workflowRole: string
}

const DEPARTMENTS: DeptConfig[] = [
  {
    label: 'Communications',
    enabledField: 'wf_comms',
    reviewerIdField: 'wf_comms_reviewer_id',
    workflowRole: 'COMMS',
  },
  {
    label: 'EOSG',
    enabledField: 'wf_eosg',
    reviewerIdField: 'wf_eosg_reviewer_id',
    workflowRole: 'EOSG',
  },
  {
    label: 'Operations',
    enabledField: 'wf_ops',
    reviewerIdField: 'wf_ops_reviewer_id',
    workflowRole: 'OPS',
  },
  {
    label: 'Partnerships',
    enabledField: 'wf_partnerships',
    reviewerIdField: 'wf_partnerships_reviewer_id',
    workflowRole: 'Partnerships',
  },
]

const fmtDate = (d: string | null) => {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString()
  } catch {
    return '—'
  }
}

export function TabFeedback({
  activity,
  onUpdate,
}: {
  activity?: any
  onUpdate?: (a: any) => void
}) {
  const [profiles, setProfiles] = useState<any[]>([])
  const [wfConfigs, setWfConfigs] = useState<any[]>([])
  const [awfs, setAwfs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!activity?.id) {
      setLoading(false)
      return
    }
    Promise.all([
      supabase.from('profiles').select('id, name, email').order('name'),
      getDepartmentalWorkflowConfigs(),
      getActivityWorkflows(activity.id),
    ]).then(([pRes, wfs, aws]) => {
      if (pRes.data) setProfiles(pRes.data)
      setWfConfigs(wfs)
      setAwfs(aws)
      setLoading(false)
    })
  }, [activity?.id])

  const getWfId = (dept: DeptConfig) => wfConfigs.find((w) => w.role === dept.workflowRole)?.id
  const getAwf = (dept: DeptConfig) => awfs.find((a) => a.workflow_id === getWfId(dept))
  const refreshAwfs = async () => {
    if (activity?.id) setAwfs(await getActivityWorkflows(activity.id))
  }

  const handleToggle = useCallback(
    async (dept: DeptConfig, checked: boolean) => {
      if (!activity || !onUpdate) return
      try {
        const updates: any = { [dept.enabledField]: checked }
        if (!checked) updates[dept.reviewerIdField] = null
        const updated = await updateActivity(activity.id, updates)
        const wfId = getWfId(dept)
        if (wfId) {
          if (checked) await upsertActivityWorkflow(activity.id, wfId)
          else await deleteActivityWorkflow(activity.id, wfId)
        }
        await refreshAwfs()
        onUpdate(updated)
      } catch {
        toast({ title: 'Error updating department', variant: 'destructive' })
      }
    },
    [activity, onUpdate, toast, wfConfigs],
  )

  const handleReviewer = useCallback(
    async (dept: DeptConfig, val: string) => {
      if (!activity || !onUpdate) return
      const reviewerId = val === 'unassigned' ? null : val
      try {
        const updated = await updateActivity(activity.id, {
          [dept.reviewerIdField]: reviewerId,
        })
        const wfId = getWfId(dept)
        if (wfId)
          await updateActivityWorkflowFields(activity.id, wfId, {
            reviewer_id: reviewerId,
          })
        await refreshAwfs()
        onUpdate(updated)
      } catch {
        toast({ title: 'Error updating reviewer', variant: 'destructive' })
      }
    },
    [activity, onUpdate, toast, wfConfigs],
  )

  const handleFeedback = useCallback(
    async (dept: DeptConfig, comments: string) => {
      if (!activity) return
      try {
        const wfId = getWfId(dept)
        if (wfId) await updateActivityWorkflowFields(activity.id, wfId, { comments })
        await refreshAwfs()
      } catch {
        toast({ title: 'Error updating feedback', variant: 'destructive' })
      }
    },
    [activity, toast, wfConfigs],
  )

  if (!activity) return null
  if (loading) {
    return <div className="p-4 text-sm text-muted-foreground">Loading feedback...</div>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Departmental Feedback &amp; Workflow</h3>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[160px]">Unit / Dept</TableHead>
                <TableHead className="w-[200px]">Reviewer</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead className="min-w-[200px]">Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEPARTMENTS.map((dept) => {
                const isEnabled = !!activity[dept.enabledField]
                const reviewerId = activity[dept.reviewerIdField] || 'unassigned'
                const awf = getAwf(dept)
                const status = awf?.status || 'Pending'
                const date = awf?.completed_at || null
                const feedback = awf?.comments || ''
                return (
                  <TableRow key={dept.workflowRole}>
                    <TableCell className="font-medium text-sm">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={isEnabled}
                          onCheckedChange={(v) => handleToggle(dept, !!v)}
                        />
                        {dept.label}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={reviewerId}
                        onValueChange={(v) => handleReviewer(dept, v)}
                        disabled={!isEnabled}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select reviewer..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {profiles.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name || p.email || 'Unknown'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          status === 'Approved'
                            ? 'text-emerald-600 border-emerald-200 bg-emerald-50'
                            : status === 'In Progress'
                              ? 'text-blue-600 border-blue-200 bg-blue-50'
                              : 'text-amber-600 border-amber-200 bg-amber-50'
                        }
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fmtDate(date)}</TableCell>
                    <TableCell>
                      <Textarea
                        className="min-h-[40px] resize-y text-sm"
                        defaultValue={feedback}
                        onBlur={(e) =>
                          e.target.value !== feedback && handleFeedback(dept, e.target.value)
                        }
                        placeholder="Add feedback..."
                        disabled={!isEnabled}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
