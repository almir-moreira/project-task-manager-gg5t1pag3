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
import { DEPT_FIELD_MAPPINGS, type DeptFieldMapping } from './workflow-dept-config'

interface DeptRow extends DeptFieldMapping {
  workflowId: string
  stage: number
  step: number
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
      const rows: DeptRow[] = (wfs || [])
        .map((wf: any) => {
          const mapping = DEPT_FIELD_MAPPINGS[wf.role]
          if (!mapping) return null
          return { ...mapping, workflowId: wf.id, stage: wf.stage, step: wf.step || 1 }
        })
        .filter((r): r is DeptRow => r !== null)
        .sort((a, b) => a.stage - b.stage || a.step - b.step)
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
        if (checked) {
          await upsertActivityWorkflow(activity.id, dept.workflowId)
        } else {
          await deleteActivityWorkflow(activity.id, dept.workflowId)
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
        await updateActivityWorkflowFields(activity.id, dept.workflowId, {
          reviewer_id: reviewerId,
        })
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
                <TableRow key={dept.workflowId} className="h-14">
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
