import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateActivity } from '@/services/activities'

export function TabEventDetails({
  activity,
  onUpdate,
  canEdit = true,
}: {
  activity?: any
  onUpdate?: (a: any) => void
  canEdit?: boolean
}) {
  const handleChange = async (field: string, val: any) => {
    if (!canEdit || !activity || !onUpdate) return
    try {
      const updated = await updateActivity(activity.id, { [field]: val })
      onUpdate(updated)
    } catch (e) {
      console.error(e)
    }
  }

  if (!activity) return null

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl pb-10">
      <h3 className="text-lg font-medium">Event Information</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label>Location</Label>
          <Input
            defaultValue={activity.event_location || ''}
            disabled={!canEdit}
            onBlur={(e) =>
              e.target.value !== activity.event_location &&
              handleChange('event_location', e.target.value)
            }
            placeholder="E.g. Conference Room A"
          />
        </div>
        <div className="grid gap-2">
          <Label>Number of Participants</Label>
          <Input
            type="number"
            defaultValue={activity.event_participants_count ?? ''}
            disabled={!canEdit}
            onBlur={(e) => {
              const val = e.target.value
              const num = parseInt(val)
              if (val === '' || isNaN(num)) {
                if (activity.event_participants_count !== null) {
                  handleChange('event_participants_count', null)
                }
              } else if (num !== activity.event_participants_count) {
                handleChange('event_participants_count', num)
              }
            }}
            placeholder="0"
          />
        </div>
        <div className="grid gap-2">
          <Label>Event Category</Label>
          <Select
            value={activity.event_category || ''}
            onValueChange={(v) => handleChange('event_category', v)}
            disabled={!canEdit}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="KAICIID Event">KAICIID Event</SelectItem>
              <SelectItem value="KAICIID Co-organized Event">KAICIID Co-organized Event</SelectItem>
              <SelectItem value="Participation">Participation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Approval</Label>
          <Select
            value={activity.event_approval_status || ''}
            onValueChange={(v) => handleChange('event_approval_status', v)}
            disabled={!canEdit}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select approval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="In Process">In Process</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Date Status</Label>
          <Select
            value={activity.event_date_status || ''}
            onValueChange={(v) => handleChange('event_date_status', v)}
            disabled={!canEdit}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select date status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Tentative">Tentative</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Location Status</Label>
          <Select
            value={activity.event_location_status || ''}
            onValueChange={(v) => handleChange('event_location_status', v)}
            disabled={!canEdit}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Tentative">Tentative</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between border border-border p-4 rounded-md">
          <Label>Include in Calendar</Label>
          <Switch
            checked={!!activity.event_include_calendar}
            disabled={!canEdit}
            onCheckedChange={(v) => handleChange('event_include_calendar', v)}
          />
        </div>
        <div className="flex items-center justify-between border border-border p-4 rounded-md">
          <Label>Can the Event Change Time?</Label>
          <Switch
            checked={!!activity.event_can_change_time}
            disabled={!canEdit}
            onCheckedChange={(v) => handleChange('event_can_change_time', v)}
          />
        </div>
      </div>
      {activity.event_can_change_time && (
        <div className="grid gap-2 animate-fade-in duration-200">
          <Label>If yes, describe</Label>
          <Textarea
            defaultValue={activity.event_change_time_desc || ''}
            disabled={!canEdit}
            onBlur={(e) =>
              e.target.value !== activity.event_change_time_desc &&
              handleChange('event_change_time_desc', e.target.value)
            }
            placeholder="Describe possible time changes..."
          />
        </div>
      )}
      <div className="grid gap-2">
        <Label>Links</Label>
        <Input
          type="url"
          defaultValue={activity.event_links || ''}
          disabled={!canEdit}
          onBlur={(e) =>
            e.target.value !== activity.event_links && handleChange('event_links', e.target.value)
          }
          placeholder="https://..."
        />
      </div>
      <div className="grid gap-2">
        <Label>Comments</Label>
        <Textarea
          defaultValue={activity.event_comments || ''}
          disabled={!canEdit}
          onBlur={(e) =>
            e.target.value !== activity.event_comments &&
            handleChange('event_comments', e.target.value)
          }
          placeholder="Additional notes..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  )
}

export function TabInvolvedParties({
  activity,
  onUpdate,
  canEdit = true,
}: {
  activity?: any
  onUpdate?: (a: any) => void
  canEdit?: boolean
}) {
  const handleChange = async (field: string, val: any) => {
    if (!canEdit || !activity || !onUpdate) return
    try {
      const updated = await updateActivity(activity.id, { [field]: val })
      onUpdate(updated)
    } catch (e) {
      console.error(e)
    }
  }

  if (!activity) return null

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in pb-10">
      <h3 className="text-lg font-medium">Involved Parties & SG Participation</h3>

      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="ems"
            checked={!!activity.inv_ems}
            disabled={!canEdit}
            onCheckedChange={(v) => handleChange('inv_ems', v)}
          />
          <Label htmlFor="ems" className="font-semibold">
            EMS
          </Label>
        </div>
        {activity.inv_ems && (
          <div className="grid gap-4 pl-6">
            <div className="grid gap-2">
              <Label>Comments to EMS</Label>
              <Textarea
                defaultValue={activity.inv_comments_to_ems || ''}
                disabled={!canEdit}
                onBlur={(e) =>
                  e.target.value !== activity.inv_comments_to_ems &&
                  handleChange('inv_comments_to_ems', e.target.value)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>EMS Comments</Label>
              <Textarea
                defaultValue={activity.inv_ems_comments || ''}
                disabled={!canEdit}
                onBlur={(e) =>
                  e.target.value !== activity.inv_ems_comments &&
                  handleChange('inv_ems_comments', e.target.value)
                }
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="protocol"
            checked={!!activity.inv_protocol}
            disabled={!canEdit}
            onCheckedChange={(v) => handleChange('inv_protocol', v)}
          />
          <Label htmlFor="protocol" className="font-semibold">
            Protocol
          </Label>
        </div>
      </div>

      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sg"
            checked={!!activity.inv_sg}
            disabled={!canEdit}
            onCheckedChange={(v) => handleChange('inv_sg', v)}
          />
          <Label htmlFor="sg" className="font-semibold">
            SG Participation
          </Label>
        </div>
        {activity.inv_sg && (
          <div className="grid gap-4 pl-6 pt-2 animate-fade-in duration-200">
            <div className="grid gap-2">
              <Label>SG Role</Label>
              <Input
                defaultValue={activity?.sg_role || ''}
                disabled={!canEdit}
                onBlur={(e) =>
                  e.target.value !== activity?.sg_role && handleChange('sg_role', e.target.value)
                }
                placeholder="Describe SG Role"
              />
            </div>
            <div className="grid gap-2">
              <Label>Speaking Notes / Welcome Remarks</Label>
              <Textarea
                defaultValue={activity?.sg_speaking_notes || ''}
                disabled={!canEdit}
                onBlur={(e) =>
                  e.target.value !== activity?.sg_speaking_notes &&
                  handleChange('sg_speaking_notes', e.target.value)
                }
                className="min-h-[150px]"
                placeholder="Enter notes..."
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="cop_bod"
            checked={!!activity.inv_cop_bod}
            disabled={!canEdit}
            onCheckedChange={(v) => handleChange('inv_cop_bod', v)}
          />
          <Label htmlFor="cop_bod" className="font-semibold">
            CoP/BoD
          </Label>
        </div>
        {activity.inv_cop_bod && (
          <div className="grid gap-2 pl-6">
            <Label>CoP/BoD Role</Label>
            <Textarea
              defaultValue={activity.inv_cop_bod_role || ''}
              disabled={!canEdit}
              onBlur={(e) =>
                e.target.value !== activity.inv_cop_bod_role &&
                handleChange('inv_cop_bod_role', e.target.value)
              }
            />
          </div>
        )}
      </div>

      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="heads"
            checked={!!activity.inv_heads}
            disabled={!canEdit}
            onCheckedChange={(v) => handleChange('inv_heads', v)}
          />
          <Label htmlFor="heads" className="font-semibold">
            Heads Involvement
          </Label>
        </div>
        {activity.inv_heads && (
          <div className="grid gap-2 pl-6">
            <Label>Heads Role</Label>
            <Textarea
              defaultValue={activity.inv_heads_role || ''}
              disabled={!canEdit}
              onBlur={(e) =>
                e.target.value !== activity.inv_heads_role &&
                handleChange('inv_heads_role', e.target.value)
              }
            />
          </div>
        )}
      </div>

      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="commd"
            checked={!!activity.inv_commd}
            disabled={!canEdit}
            onCheckedChange={(v) => handleChange('inv_commd', v)}
          />
          <Label htmlFor="commd" className="font-semibold">
            COMMD
          </Label>
        </div>
        {activity.inv_commd && (
          <div className="grid gap-2 pl-6">
            <Label>COMMD Role</Label>
            <Textarea
              defaultValue={activity.inv_commd_role || ''}
              disabled={!canEdit}
              onBlur={(e) =>
                e.target.value !== activity.inv_commd_role &&
                handleChange('inv_commd_role', e.target.value)
              }
            />
          </div>
        )}
      </div>

      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="staff"
            checked={!!activity.inv_staff}
            disabled={!canEdit}
            onCheckedChange={(v) => handleChange('inv_staff', v)}
          />
          <Label htmlFor="staff" className="font-semibold">
            Staff Involved
          </Label>
        </div>
        {activity.inv_staff && (
          <div className="grid gap-2 pl-6">
            <Label>Staff Involvement</Label>
            <Textarea
              defaultValue={activity.inv_staff_involvement || ''}
              disabled={!canEdit}
              onBlur={(e) =>
                e.target.value !== activity.inv_staff_involvement &&
                handleChange('inv_staff_involvement', e.target.value)
              }
            />
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>KAICIID Delegation</Label>
          <Textarea
            defaultValue={activity.inv_kaiciid_delegation || ''}
            disabled={!canEdit}
            onBlur={(e) =>
              e.target.value !== activity.inv_kaiciid_delegation &&
              handleChange('inv_kaiciid_delegation', e.target.value)
            }
          />
        </div>
        <div className="grid gap-2">
          <Label>Travel Days</Label>
          <Input
            defaultValue={activity.inv_travel_days || ''}
            disabled={!canEdit}
            onBlur={(e) =>
              e.target.value !== activity.inv_travel_days &&
              handleChange('inv_travel_days', e.target.value)
            }
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Organizations Involved</Label>
          <Textarea
            defaultValue={activity.inv_orgs_involved || ''}
            disabled={!canEdit}
            onBlur={(e) =>
              e.target.value !== activity.inv_orgs_involved &&
              handleChange('inv_orgs_involved', e.target.value)
            }
          />
        </div>
        <div className="grid gap-2">
          <Label>Description of Organizations Involved</Label>
          <Textarea
            defaultValue={activity.inv_orgs_desc || ''}
            disabled={!canEdit}
            onBlur={(e) =>
              e.target.value !== activity.inv_orgs_desc &&
              handleChange('inv_orgs_desc', e.target.value)
            }
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Type of Participants</Label>
          <Textarea
            defaultValue={activity.inv_participants_type || ''}
            disabled={!canEdit}
            onBlur={(e) =>
              e.target.value !== activity.inv_participants_type &&
              handleChange('inv_participants_type', e.target.value)
            }
          />
        </div>
        <div className="grid gap-2">
          <Label>Individuals to Meet</Label>
          <Textarea
            defaultValue={activity.inv_individuals_meet || ''}
            disabled={!canEdit}
            onBlur={(e) =>
              e.target.value !== activity.inv_individuals_meet &&
              handleChange('inv_individuals_meet', e.target.value)
            }
          />
        </div>
      </div>
    </div>
  )
}

export function TabRBM({
  activity,
  onUpdate,
  canEdit = true,
}: {
  activity?: any
  onUpdate?: (a: any) => void
  canEdit?: boolean
}) {
  const handleChange = async (field: string, val: any) => {
    if (!canEdit || !activity || !onUpdate) return
    try {
      const updated = await updateActivity(activity.id, { [field]: val })
      onUpdate(updated)
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <h3 className="text-lg font-medium">RBM</h3>
      <div className="grid gap-2">
        <Label>Expected Outcomes</Label>
        <Textarea
          defaultValue={activity?.rbm_outcomes || ''}
          disabled={!canEdit}
          onBlur={(e) =>
            e.target.value !== activity?.rbm_outcomes &&
            handleChange('rbm_outcomes', e.target.value)
          }
          placeholder="Define the measurable outcomes..."
          className="min-h-[120px]"
        />
      </div>
      <div className="grid gap-2">
        <Label>Key Outputs</Label>
        <Textarea
          defaultValue={activity?.rbm_outputs || ''}
          disabled={!canEdit}
          onBlur={(e) =>
            e.target.value !== activity?.rbm_outputs && handleChange('rbm_outputs', e.target.value)
          }
          placeholder="List the tangible deliverables..."
          className="min-h-[120px]"
        />
      </div>
    </div>
  )
}

export function TabAttachments() {
  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <h3 className="text-lg font-medium">Attachments</h3>
      <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer">
        <p className="text-sm text-muted-foreground">
          Click or drag files here to upload to SharePoint
        </p>
      </div>
    </div>
  )
}
