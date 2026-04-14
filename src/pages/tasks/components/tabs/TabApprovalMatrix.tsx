import { useEffect, useState } from 'react'
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

export function TabApprovalMatrix({
  activity,
  onUpdate,
}: {
  activity?: any
  onUpdate?: (a: any) => void
}) {
  const [profiles, setProfiles] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, name, email')
      .order('name')
      .then(({ data }) => {
        if (data) setProfiles(data)
      })
  }, [])

  const handleChange = async (field: string, val: any) => {
    if (!activity || !onUpdate) return
    try {
      const updated = await updateActivity(activity.id, { [field]: val } as any)
      onUpdate(updated)
    } catch (e) {
      console.error(e)
    }
  }

  if (!activity) return null

  const renderRow = (
    roleName: string,
    idField: string,
    commentsField: string,
    dateField: string,
    approvedField: string,
  ) => {
    return (
      <TableRow key={roleName}>
        <TableCell className="font-medium text-sm">{roleName}</TableCell>
        <TableCell className="align-top pt-4">
          <Select
            value={activity[idField] || 'unassigned'}
            onValueChange={(val) => handleChange(idField, val === 'unassigned' ? null : val)}
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
            defaultValue={activity[commentsField] || ''}
            onBlur={(e) =>
              e.target.value !== activity[commentsField] &&
              handleChange(commentsField, e.target.value)
            }
            placeholder="Add comments..."
          />
        </TableCell>
        <TableCell className="align-top pt-4">
          <Input
            type="date"
            className="h-9"
            defaultValue={activity[dateField] || ''}
            onBlur={(e) =>
              e.target.value !== activity[dateField] &&
              handleChange(dateField, e.target.value || null)
            }
          />
        </TableCell>
        <TableCell className="text-center align-top pt-5">
          <div className="flex justify-center">
            <Checkbox
              checked={!!activity[approvedField]}
              onCheckedChange={(v) => handleChange(approvedField, v)}
            />
          </div>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <h3 className="text-lg font-medium">Approval Matrix</h3>
      <div className="grid grid-cols-2 gap-4 mb-6 max-w-2xl">
        <div className="grid gap-2">
          <Label>Urgency of Approval</Label>
          <Select
            value={activity.urgency_of_approval || 'Standard'}
            onValueChange={(val) => handleChange('urgency_of_approval', val)}
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
            placeholder="Describe nature of urgency..."
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Reviewed By</h3>
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
              {renderRow(
                'Team Leader/CO',
                'reviewer_team_leader_id',
                'reviewer_team_leader_comments',
                'reviewer_team_leader_date',
                'reviewer_team_leader_approved',
              )}
              {renderRow(
                'Head',
                'reviewer_head_id',
                'reviewer_head_comments',
                'reviewer_head_date',
                'reviewer_head_approved',
              )}
              {renderRow(
                'CPO',
                'reviewer_cpo_id',
                'reviewer_cpo_comments',
                'reviewer_cpo_date',
                'reviewer_cpo_approved',
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Final Approval</h3>
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
              {renderRow(
                'Head',
                'approver_head_id',
                'approver_head_comments',
                'approver_head_date',
                'approver_head_approved',
              )}
              {renderRow(
                'CPO',
                'approver_cpo_id',
                'approver_cpo_comments',
                'approver_cpo_date',
                'approver_cpo_approved',
              )}
              {renderRow(
                'Secretary General',
                'approver_sg_id',
                'approver_sg_comments',
                'approver_sg_date',
                'approver_sg_approved',
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
