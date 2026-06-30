import { useEffect, useState, useCallback } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
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
  getWorkflowConfigs,
  upsertActivityWorkflow,
  deleteActivityWorkflow,
  updateActivityWorkflowFields,
} from '@/services/activity-workflows'
import { useToast } from '@/hooks/use-toast'
import { REVIEWER_ROLES, APPROVER_ROLES, type RoleConfig } from './review-roles'

export function TabReviewApproval({
  activity,
  onUpdate,
}: {
  activity?: any
  onUpdate?: (a: any) => void
}) {
  const [profiles, setProfiles] = useState<any[]>([])
  const [workflowConfigs, setWorkflowConfigs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('id, name, email').order('name'),
      getWorkflowConfigs(),
    ]).then(([pRes, wfs]) => {
      if (pRes.data) setProfiles(pRes.data)
      setWorkflowConfigs(wfs)
      setLoading(false)
    })
  }, [])

  const getWfId = (role: RoleConfig) =>
    workflowConfigs.find((wf) => wf.role === role.workflowRole)?.id

  const handleChange = useCallback(
    async (field: string, val: any, role?: RoleConfig) => {
      if (!activity || !onUpdate) return
      try {
        const updated = await updateActivity(activity.id, { [field]: val })
        if (role) {
          const wfId = getWfId(role)
          if (wfId) {
            if (field === role.idField) {
              await updateActivityWorkflowFields(activity.id, wfId, { reviewer_id: val })
            } else if (field === role.approvedField) {
              await updateActivityWorkflowFields(activity.id, wfId, {
                status: val ? 'Approved' : 'Pending',
                completed_at: val ? new Date().toISOString() : null,
              })
            } else if (field === role.commentsField) {
              await updateActivityWorkflowFields(activity.id, wfId, { comments: val })
            }
          }
        }
        onUpdate(updated)
      } catch {
        toast({ title: 'Error updating field', variant: 'destructive' })
      }
    },
    [activity, onUpdate, toast, workflowConfigs],
  )

  const handleToggle = useCallback(
    async (role: RoleConfig, checked: boolean) => {
      if (!activity || !onUpdate) return
      try {
        const updates: any = { [role.requiredField]: checked }
        if (!checked) {
          updates[role.idField] = null
          updates[role.commentsField] = null
          updates[role.dateField] = null
          updates[role.approvedField] = false
        }
        const updated = await updateActivity(activity.id, updates)
        const wfId = getWfId(role)
        if (wfId) {
          if (checked) {
            await upsertActivityWorkflow(activity.id, wfId)
          } else {
            await deleteActivityWorkflow(activity.id, wfId)
          }
        }
        onUpdate(updated)
      } catch {
        toast({ title: 'Error updating workflow config', variant: 'destructive' })
      }
    },
    [activity, onUpdate, toast, workflowConfigs],
  )

  const renderRow = (role: RoleConfig) => {
    const isRequired = !!activity?.[role.requiredField]
    const idVal = activity?.[role.idField] || 'unassigned'
    const commentsVal = activity?.[role.commentsField] || ''
    const dateVal = activity?.[role.dateField] ? String(activity[role.dateField]).split('T')[0] : ''
    const approvedVal = !!activity?.[role.approvedField]

    return (
      <TableRow key={role.idField}>
        <TableCell className="font-medium text-sm">
          <div className="flex items-center gap-2">
            <Checkbox checked={isRequired} onCheckedChange={(v) => handleToggle(role, !!v)} />
            {role.label}
          </div>
        </TableCell>
        <TableCell className="align-top pt-4">
          <Select
            value={idVal}
            onValueChange={(v) => handleChange(role.idField, v === 'unassigned' ? null : v, role)}
            disabled={!isRequired}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select user..." />
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
        <TableCell className="align-top py-3">
          <Textarea
            className="min-h-[60px] resize-y"
            defaultValue={commentsVal}
            onBlur={(e) =>
              e.target.value !== commentsVal &&
              handleChange(role.commentsField, e.target.value, role)
            }
            placeholder="Add comments..."
            disabled={!isRequired}
          />
        </TableCell>
        <TableCell className="align-top pt-4">
          <Input
            type="date"
            className="h-9"
            defaultValue={dateVal}
            onBlur={(e) =>
              e.target.value !== dateVal &&
              handleChange(role.dateField, e.target.value || null, role)
            }
            disabled={!isRequired}
          />
        </TableCell>
        <TableCell className="text-center align-top pt-5">
          <div className="flex justify-center">
            <Checkbox
              checked={approvedVal}
              onCheckedChange={(v) => handleChange(role.approvedField, !!v, role)}
              disabled={!isRequired}
            />
          </div>
        </TableCell>
      </TableRow>
    )
  }

  if (!activity) return null

  const renderTable = (title: string, roles: RoleConfig[]) => (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[150px]">Role</TableHead>
              <TableHead className="w-[200px]">Assignee</TableHead>
              <TableHead className="min-w-[200px]">Comments</TableHead>
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead className="text-center w-[100px]">Approved</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              roles.map((r) => renderRow(r))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        <div className="grid gap-2">
          <Label>Urgency of Approval</Label>
          <Select
            value={activity.urgency_of_approval || 'Standard'}
            onValueChange={(v) => handleChange('urgency_of_approval', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select urgency..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Nature of Urgency</Label>
          <Input
            defaultValue={activity.nature_of_urgency || ''}
            onBlur={(e) =>
              e.target.value !== activity.nature_of_urgency &&
              handleChange('nature_of_urgency', e.target.value)
            }
            placeholder="Describe..."
          />
        </div>
      </div>
      {renderTable('Reviewers', REVIEWER_ROLES)}
      {renderTable('Approvers', APPROVER_ROLES)}
    </div>
  )
}
