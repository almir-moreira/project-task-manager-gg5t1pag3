import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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
                <TableHead>Comments</TableHead>
                <TableHead className="w-[150px]">Date</TableHead>
                <TableHead className="text-center w-[100px]">Approved</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Team Leader/CO */}
              <TableRow>
                <TableCell className="font-medium text-sm">Team Leader/CO</TableCell>
                <TableCell>
                  <Select
                    value={activity.reviewer_team_leader_id || 'unassigned'}
                    onValueChange={(val) =>
                      handleChange('reviewer_team_leader_id', val === 'unassigned' ? null : val)
                    }
                  >
                    <SelectTrigger className="h-8">
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
                <TableCell>
                  <Input
                    className="h-8"
                    defaultValue={activity.reviewer_team_leader_comments || ''}
                    onBlur={(e) =>
                      e.target.value !== activity.reviewer_team_leader_comments &&
                      handleChange('reviewer_team_leader_comments', e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="date"
                    className="h-8"
                    defaultValue={activity.reviewer_team_leader_date || ''}
                    onBlur={(e) =>
                      e.target.value !== activity.reviewer_team_leader_date &&
                      handleChange('reviewer_team_leader_date', e.target.value || null)
                    }
                  />
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={!!activity.reviewer_team_leader_approved}
                      onCheckedChange={(v) => handleChange('reviewer_team_leader_approved', v)}
                    />
                  </div>
                </TableCell>
              </TableRow>

              {/* Head */}
              <TableRow>
                <TableCell className="font-medium text-sm">Head</TableCell>
                <TableCell>
                  <Select
                    value={activity.reviewer_head_id || 'unassigned'}
                    onValueChange={(val) =>
                      handleChange('reviewer_head_id', val === 'unassigned' ? null : val)
                    }
                  >
                    <SelectTrigger className="h-8">
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
                <TableCell>
                  <Input
                    className="h-8"
                    defaultValue={activity.reviewer_head_comments || ''}
                    onBlur={(e) =>
                      e.target.value !== activity.reviewer_head_comments &&
                      handleChange('reviewer_head_comments', e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="date"
                    className="h-8"
                    defaultValue={activity.reviewer_head_date || ''}
                    onBlur={(e) =>
                      e.target.value !== activity.reviewer_head_date &&
                      handleChange('reviewer_head_date', e.target.value || null)
                    }
                  />
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={!!activity.reviewer_head_approved}
                      onCheckedChange={(v) => handleChange('reviewer_head_approved', v)}
                    />
                  </div>
                </TableCell>
              </TableRow>

              {/* CPO */}
              <TableRow>
                <TableCell className="font-medium text-sm">CPO</TableCell>
                <TableCell>
                  <Select
                    value={activity.reviewer_cpo_id || 'unassigned'}
                    onValueChange={(val) =>
                      handleChange('reviewer_cpo_id', val === 'unassigned' ? null : val)
                    }
                  >
                    <SelectTrigger className="h-8">
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
                <TableCell>
                  <Input
                    className="h-8"
                    defaultValue={activity.reviewer_cpo_comments || ''}
                    onBlur={(e) =>
                      e.target.value !== activity.reviewer_cpo_comments &&
                      handleChange('reviewer_cpo_comments', e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="date"
                    className="h-8"
                    defaultValue={activity.reviewer_cpo_date || ''}
                    onBlur={(e) =>
                      e.target.value !== activity.reviewer_cpo_date &&
                      handleChange('reviewer_cpo_date', e.target.value || null)
                    }
                  />
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={!!activity.reviewer_cpo_approved}
                      onCheckedChange={(v) => handleChange('reviewer_cpo_approved', v)}
                    />
                  </div>
                </TableCell>
              </TableRow>
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
                <TableHead>Approver</TableHead>
                <TableHead>Signature / Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-sm text-muted-foreground">
                  Head of Dept
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">Pending Review</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-slate-100">
                    Locked
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-sm text-muted-foreground">CPO</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  Pending Head Approval
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-slate-100">
                    Locked
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-sm text-muted-foreground">
                  Secretary General
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  Pending CPO Approval
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-slate-100">
                    Locked
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
