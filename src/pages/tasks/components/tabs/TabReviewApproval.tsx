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

export function TabReviewApproval({
  activity,
  onUpdate,
}: {
  activity?: any
  onUpdate?: (a: any) => void
}) {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  const handleActivityChange = async (field: string, val: any) => {
    if (!activity || !onUpdate) return
    try {
      const updated = await updateActivity(activity.id, { [field]: val } as any)
      onUpdate(updated)
    } catch (e) {
      console.error(e)
    }
  }

  const renderRow = (roleLabel: string, prefix: string, requiredField: string) => {
    const idField = `${prefix}_id`
    const commentsField = `${prefix}_comments`
    const dateField = `${prefix}_date`
    const approvedField = `${prefix}_approved`

    const idVal = activity[idField] || 'unassigned'
    const commentsVal = activity[commentsField] || ''
    const dateVal = activity[dateField] ? activity[dateField].split('T')[0] : ''
    const approvedVal = !!activity[approvedField]
    const requiredVal = !!activity[requiredField]

    return (
      <TableRow key={prefix}>
        <TableCell className="text-center align-top pt-5">
          <div className="flex justify-center">
            <Checkbox
              checked={requiredVal}
              onCheckedChange={(v) => handleActivityChange(requiredField, !!v)}
            />
          </div>
        </TableCell>
        <TableCell className="font-medium text-sm">{roleLabel}</TableCell>
        <TableCell className="align-top pt-4">
          <Select
            value={idVal}
            onValueChange={(val) =>
              handleActivityChange(idField, val === 'unassigned' ? null : val)
            }
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
              e.target.value !== commentsVal && handleActivityChange(commentsField, e.target.value)
            }
            placeholder="Add comments..."
          />
        </TableCell>
        <TableCell className="align-top pt-4">
          <Input
            type="date"
            className="h-9"
            defaultValue={dateVal}
            onBlur={(e) => {
              const val = e.target.value
              if (val !== dateVal) {
                handleActivityChange(dateField, val || null)
              }
            }}
          />
        </TableCell>
        <TableCell className="text-center align-top pt-5">
          <div className="flex justify-center">
            <Checkbox
              checked={approvedVal}
              onCheckedChange={(v) => handleActivityChange(approvedField, !!v)}
            />
          </div>
        </TableCell>
      </TableRow>
    )
  }

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
            onValueChange={(val) => handleActivityChange('urgency_of_approval', val)}
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
              handleActivityChange('nature_of_urgency', e.target.value)
            }
            placeholder="Describe nature of urgency..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Reviewers</h3>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="text-center w-[80px]">Required</TableHead>
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
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {renderRow('Team Leader', 'reviewer_team_leader', 'wf_team_leader_required')}
                  {renderRow('Head of Unit', 'reviewer_head', 'wf_head_reviewer_required')}
                  {renderRow('CPO', 'reviewer_cpo', 'wf_cpo_reviewer_required')}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Approvers</h3>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="text-center w-[80px]">Required</TableHead>
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
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {renderRow('Head of Unit', 'approver_head', 'wf_head_approver_required')}
                  {renderRow('CPO', 'approver_cpo', 'wf_cpo_approver_required')}
                  {renderRow('SG', 'approver_sg', 'wf_sg_approver_required')}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
