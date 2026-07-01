import { useState, useEffect, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
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

const FEEDBACK_DEPTS: (DeptFieldMapping & { order: number })[] = [
  {
    order: 1,
    workflowRole: 'Relex',
    label: 'RELEX',
    enabledField: 'wf_relex',
    reviewerIdField: 'wf_relex_reviewer_id',
  },
  {
    order: 2,
    workflowRole: 'Legal',
    label: 'Legal',
    enabledField: 'wf_legal',
    reviewerIdField: 'wf_legal_reviewer_id',
  },
  {
    order: 3,
    workflowRole: 'GoB',
    label: 'Governing Bodies',
    enabledField: 'wf_gob',
    reviewerIdField: 'wf_gob_reviewer_id',
  },
  {
    order: 4,
    workflowRole: 'Protocol',
    label: 'Protocol',
    enabledField: 'wf_protocol',
    reviewerIdField: 'wf_protocol_reviewer_id',
  },
  {
    order: 5,
    workflowRole: 'EMS',
    label: 'EMS',
    enabledField: 'wf_ems',
    reviewerIdField: 'wf_ems_reviewer_id',
  },
  {
    order: 6,
    workflowRole: 'Procurement',
    label: 'Procurement',
    enabledField: 'wf_procurement',
    reviewerIdField: 'wf_procurement_reviewer_id',
  },
  {
    order: 7,
    workflowRole: 'Technology',
    label: 'Technology',
    enabledField: 'wf_technology',
    reviewerIdField: 'wf_technology_reviewer_id',
  },
  {
    order: 8,
    workflowRole: 'M&E',
    label: 'M&E',
    enabledField: 'wf_mne',
    reviewerIdField: 'wf_mne_reviewer_id',
  },
  {
    order: 9,
    workflowRole: 'COMMS',
    label: 'Communications',
    enabledField: 'wf_comms',
    reviewerIdField: 'wf_comms_reviewer_id',
  },
  {
    order: 10,
    workflowRole: 'Social Media',
    label: 'Social Media',
    enabledField: 'wf_social_media',
    reviewerIdField: 'wf_social_media_reviewer_id',
  },
]

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
    ]).then(([pRes, wfs]) => {
      if (pRes.data) setProfiles(pRes.data)
      const wfMap = new Map<string, string>()
      ;(wfs || []).forEach((wf: any) => {
        if (wf.role) wfMap.set(wf.role, wf.id)
      })
      const rows: DeptRow[] = FEEDBACK_DEPTS.map((dept) => ({
        workflowRole: dept.workflowRole,
        label: dept.label,
        enabledField: dept.enabledField,
        reviewerIdField: dept.reviewerIdField,
        workflowId: wfMap.get(dept.workflowRole) ?? null,
      }))
      setDeptRows(rows)
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
            await upsertActivityWorkflow(activity.id, dept.workflowId)
          } else {
            await deleteActivityWorkflow(activity.id, dept.workflowId)
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
          await updateActivityWorkflowFields(activity.id, dept.workflowId, {
            reviewer_id: reviewerId,
          })
        }
        onUpdate(updated)
      } catch {
        toast({ title: 'Error updating reviewer', variant: 'destructive' })
      }
    },
    [activity, onUpdate, toast],
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
              <TableHead className="w-[200px]">Unit / Dept</TableHead>
              <TableHead className="w-[240px]">Reviewer</TableHead>
              <TableHead className="w-[140px]">Status</TableHead>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead className="min-w-[200px]">Feedback</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deptRows.map((dept) => {
              const isEnabled = !!activity[dept.enabledField]
              const reviewerId = activity[dept.reviewerIdField] || 'unassigned'

              return (
                <TableRow key={dept.enabledField} className="h-14">
                  <TableCell className="font-medium text-sm">
                    <div className="flex items-center gap-3">
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
                  <TableCell>
                    {isEnabled ? (
                      <Badge
                        variant="outline"
                        className="text-amber-600 border-amber-200 bg-amber-50 rounded-full px-2.5 py-0.5 font-medium shadow-sm"
                      >
                        Pending
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">Not included</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">-</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {isEnabled ? 'Awaiting response.' : ''}
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
