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
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, name, email')
      .order('name')
      .then(({ data }) => {
        if (data) setProfiles(data)
        setLoading(false)
      })
  }, [])

  const handleChange = useCallback(
    async (field: string, val: any) => {
      if (!activity || !onUpdate) return
      try {
        onUpdate(await updateActivity(activity.id, { [field]: val } as any))
      } catch {
        toast({ title: 'Error updating field', variant: 'destructive' })
      }
    },
    [activity, onUpdate, toast],
  )

  const handleToggle = useCallback(
    async (requiredField: string, clearFields: Record<string, any>, checked: boolean) => {
      if (!activity || !onUpdate) return
      try {
        const updates: any = { [requiredField]: checked }
        if (!checked) Object.assign(updates, clearFields)
        onUpdate(await updateActivity(activity.id, updates))
      } catch {
        toast({ title: 'Error updating workflow config', variant: 'destructive' })
      }
    },
    [activity, onUpdate, toast],
  )

  const buildClearFields = (role: RoleConfig): Record<string, any> => {
    const fields: Record<string, any> = { [role.idField]: null }
    fields[role.commentsField] = null
    fields[role.dateField] = null
    fields[role.approvedField] = false
    return fields
  }

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
            <Checkbox
              checked={isRequired}
              onCheckedChange={(v) => handleToggle(role.requiredField, buildClearFields(role), !!v)}
            />
            {role.label}
          </div>
        </TableCell>
        <TableCell className="align-top pt-4">
          <Select
            value={idVal}
            onValueChange={(v) => handleChange(role.idField, v === 'unassigned' ? null : v)}
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
              e.target.value !== commentsVal && handleChange(role.commentsField, e.target.value)
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
              e.target.value !== dateVal && handleChange(role.dateField, e.target.value || null)
            }
            disabled={!isRequired}
          />
        </TableCell>
        <TableCell className="text-center align-top pt-5">
          <div className="flex justify-center">
            <Checkbox
              checked={approvedVal}
              onCheckedChange={(v) => handleChange(role.approvedField, !!v)}
              disabled={!isRequired}
            />
          </div>
        </TableCell>
      </TableRow>
    )
  }

  if (!activity) return null

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

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Reviewers</h3>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[150px]">Role</TableHead>
                <TableHead className="w-[200px]">Reviewer</TableHead>
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
                REVIEWER_ROLES.map((r) => renderRow(r))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Approvers</h3>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[150px]">Role</TableHead>
                <TableHead className="w-[200px]">Approver</TableHead>
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
                APPROVER_ROLES.map((a) => renderRow(a))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
