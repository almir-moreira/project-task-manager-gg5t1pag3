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
import { REVIEWER_ROLES, APPROVER_ROLES, RoleConfig } from './review-roles'
import { canEditActivity, isAdmin } from '@/lib/permissions'
import { usePermissions } from '@/hooks/use-permissions'
import { ApprovalActions } from './ApprovalActions'
import { canActOnApprovalStep, ROLE_TO_STEP_NAME } from '@/lib/approval-guards'

export function TabReviewApproval({
  activity,
  onUpdate,
}: {
  activity?: any
  onUpdate?: (a: any) => void
}) {
  const [profiles, setProfiles] = useState<any[]>([])
  const [workflowMap, setWorkflowMap] = useState<Map<string, string>>(new Map())
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { permUser } = usePermissions()

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('id, name, email').order('name'),
      getWorkflowConfigs(),
    ]).then(([pRes, wfs]) => {
      if (pRes.data) setProfiles(pRes.data)
      const wfMap = new Map<string, string>()
      ;(wfs || []).forEach((wf: any) => {
        if (wf.role) wfMap.set(wf.role, wf.id)
      })
      setWorkflowMap(wfMap)
      setLoading(false)
    })
  }, [])

  const canEdit = canEditActivity(permUser, activity)

  const handleRequiredToggle = useCallback(
    async (role: RoleConfig, checked: boolean) => {
      if (!activity || !onUpdate) return
      if (!canEditActivity(permUser, activity)) return
      try {
        const updated = await updateActivity(activity.id, { [role.requiredField]: checked } as any)
        const wfId = workflowMap.get(role.workflowRole)
        if (wfId) {
          if (checked) {
            await upsertActivityWorkflow(activity.id, wfId, activity[role.idField] || null)
          } else {
            await deleteActivityWorkflow(activity.id, wfId)
          }
        }
        onUpdate(updated)
      } catch {
        toast({ title: 'Error updating requirement', variant: 'destructive' })
      }
    },
    [activity, onUpdate, workflowMap, toast],
  )

  const handleUserChange = useCallback(
    async (role: RoleConfig, val: string) => {
      if (!activity || !onUpdate) return
      if (!canEditActivity(permUser, activity)) return
      const userId = val === 'unassigned' ? null : val
      try {
        const updated = await updateActivity(activity.id, { [role.idField]: userId } as any)
        const wfId = workflowMap.get(role.workflowRole)
        if (wfId) await updateActivityWorkflowFields(activity.id, wfId, { reviewer_id: userId })
        onUpdate(updated)
      } catch {
        toast({ title: 'Error updating reviewer', variant: 'destructive' })
      }
    },
    [activity, onUpdate, workflowMap, toast],
  )

  const handleFieldChange = useCallback(
    async (field: string, val: any) => {
      if (!activity || !onUpdate) return
      if (!canEditActivity(permUser, activity)) return
      try {
        const updated = await updateActivity(activity.id, { [field]: val } as any)
        onUpdate(updated)
      } catch {
        toast({ title: 'Error updating field', variant: 'destructive' })
      }
    },
    [activity, onUpdate, toast],
  )

  const handleApprove = useCallback(
    async (role: RoleConfig) => {
      if (!activity || !onUpdate) return
      const stepName = ROLE_TO_STEP_NAME[role.workflowRole] || ''
      const { allowed } = canActOnApprovalStep(permUser, activity, role.approvedField, stepName)
      if (!allowed) return
      const today = new Date().toISOString().split('T')[0]
      try {
        const updated = await updateActivity(activity.id, {
          [role.approvedField]: true,
          [role.dateField]: today,
        } as any)
        onUpdate(updated)
        toast({ title: 'Step approved successfully' })
      } catch {
        toast({ title: 'Error approving step', variant: 'destructive' })
      }
    },
    [activity, onUpdate, toast, permUser],
  )

  const handleReject = useCallback(
    async (role: RoleConfig) => {
      if (!activity || !onUpdate) return
      const stepName = ROLE_TO_STEP_NAME[role.workflowRole] || ''
      const { allowed } = canActOnApprovalStep(permUser, activity, role.approvedField, stepName)
      if (!allowed) return
      const today = new Date().toISOString().split('T')[0]
      try {
        const updated = await updateActivity(activity.id, {
          [role.approvedField]: false,
          [role.dateField]: today,
          status: 'Rejected',
        } as any)
        onUpdate(updated)
        toast({ title: 'Step rejected', variant: 'destructive' })
      } catch {
        toast({ title: 'Error rejecting step', variant: 'destructive' })
      }
    },
    [activity, onUpdate, toast, permUser],
  )

  const handleClear = useCallback(
    async (role: RoleConfig) => {
      if (!activity || !onUpdate) return
      if (!isAdmin(permUser)) return
      try {
        const updated = await updateActivity(activity.id, {
          [role.approvedField]: false,
          [role.dateField]: null,
          [role.commentsField]: null,
        } as any)
        onUpdate(updated)
        toast({ title: 'Step cleared' })
      } catch {
        toast({ title: 'Error clearing step', variant: 'destructive' })
      }
    },
    [activity, onUpdate, toast],
  )

  const renderRow = (role: RoleConfig) => {
    const idVal = activity[role.idField] || 'unassigned'
    const commentsVal = activity[role.commentsField] || ''
    const dateVal = activity[role.dateField] ? String(activity[role.dateField]).split('T')[0] : ''
    return (
      <TableRow key={role.idField}>
        <TableCell className="text-center align-top pt-5">
          <div className="flex justify-center">
            <Checkbox
              checked={!!activity[role.requiredField]}
              onCheckedChange={(v) => handleRequiredToggle(role, !!v)}
              disabled={!canEdit}
            />
          </div>
        </TableCell>
        <TableCell className="font-medium text-sm">{role.label}</TableCell>
        <TableCell className="align-top pt-4">
          <Select
            value={idVal}
            onValueChange={(val) => handleUserChange(role, val)}
            disabled={!canEdit}
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
            disabled={!canEdit}
            onBlur={(e) =>
              e.target.value !== commentsVal &&
              handleFieldChange(role.commentsField, e.target.value)
            }
            placeholder="Add comments..."
          />
        </TableCell>
        <TableCell className="align-top pt-4">
          <Input
            type="date"
            className="h-9"
            defaultValue={dateVal}
            disabled={!canEdit}
            onBlur={(e) => {
              const v = e.target.value
              if (v !== dateVal) handleFieldChange(role.dateField, v || null)
            }}
          />
        </TableCell>
        <TableCell className="text-center align-top pt-4">
          <ApprovalActions
            activity={activity}
            role={role}
            permUser={permUser}
            onApprove={handleApprove}
            onReject={handleReject}
            onClear={handleClear}
          />
        </TableCell>
      </TableRow>
    )
  }

  const renderTable = (roles: RoleConfig[], title: string) => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-center w-[80px]">Required</TableHead>
              <TableHead className="w-[150px]">Role</TableHead>
              <TableHead className="w-[200px]">Reviewer</TableHead>
              <TableHead className="min-w-[200px]">Comments</TableHead>
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead className="text-center w-[160px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => renderRow(role))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )

  if (!activity) return null

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Review & Approval</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 max-w-2xl">
        <div className="grid gap-2">
          <Label>Urgency of Approval</Label>
          <Select
            value={activity.urgency_of_approval || 'Standard'}
            onValueChange={(val) => handleFieldChange('urgency_of_approval', val)}
            disabled={!canEdit}
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
            disabled={!canEdit}
            onBlur={(e) =>
              e.target.value !== activity.nature_of_urgency &&
              handleFieldChange('nature_of_urgency', e.target.value)
            }
            placeholder="Describe nature of urgency..."
          />
        </div>
      </div>

      {renderTable(REVIEWER_ROLES, 'Reviewers')}
      {renderTable(APPROVER_ROLES, 'Approvers')}
    </div>
  )
}
