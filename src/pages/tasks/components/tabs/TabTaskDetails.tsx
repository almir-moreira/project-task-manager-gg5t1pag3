import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { getMasterData } from '@/services/master-data'
import { updateActivity } from '@/services/activities'

export function TabTaskDetails({ task, onUpdate }: { task: any; onUpdate: (t: any) => void }) {
  const [masterData, setMasterData] = useState<any>(null)

  useEffect(() => {
    getMasterData().then(setMasterData)
  }, [])

  const handleChange = async (field: string, val: any) => {
    try {
      const updated = await updateActivity(task.id, { [field]: val })
      onUpdate(updated)
    } catch (e) {
      console.error(e)
    }
  }

  if (!masterData)
    return <div className="p-4 text-sm text-muted-foreground">Loading details...</div>

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div>
        <h3 className="text-lg font-medium">Task Details</h3>
        <p className="text-sm text-muted-foreground">
          Comprehensive information and financial tracking for this activity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Purpose</Label>
            <Input
              defaultValue={task.purpose || ''}
              onBlur={(e) =>
                e.target.value !== task.purpose && handleChange('purpose', e.target.value)
              }
              placeholder="Enter purpose of the activity"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Activity Name</Label>
            <Input
              defaultValue={task.activity_name || ''}
              onBlur={(e) =>
                e.target.value !== task.activity_name &&
                handleChange('activity_name', e.target.value)
              }
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Short Description</Label>
            <Textarea
              defaultValue={task.short_description || ''}
              onBlur={(e) =>
                e.target.value !== task.short_description &&
                handleChange('short_description', e.target.value)
              }
              className="min-h-[120px] resize-none"
              placeholder="Provide a brief description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Start Date</Label>
              <Input
                type="date"
                defaultValue={task.start_date || ''}
                onBlur={(e) =>
                  e.target.value !== task.start_date && handleChange('start_date', e.target.value)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">End Date</Label>
              <Input
                type="date"
                defaultValue={task.end_date || ''}
                onBlur={(e) =>
                  e.target.value !== task.end_date && handleChange('end_date', e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Assignee</Label>
            <Select
              value={task.assignee_id || ''}
              onValueChange={(v) => handleChange('assignee_id', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {masterData.profiles.map((u: any) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Cost Center</Label>
              <Select
                value={task.cost_center_id || ''}
                onValueChange={(v) => handleChange('cost_center_id', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {masterData.costCenters.map((cc: any) => (
                    <SelectItem key={cc.id} value={cc.id}>
                      {cc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Budget Line</Label>
              <Select
                value={task.budget_line_id || ''}
                onValueChange={(v) => handleChange('budget_line_id', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {masterData.budgetLines.map((bl: any) => (
                    <SelectItem key={bl.id} value={bl.id}>
                      {bl.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Workorder</Label>
              <Select
                value={task.workorder_id || ''}
                onValueChange={(v) => handleChange('workorder_id', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {masterData.workorders.map((wo: any) => (
                    <SelectItem key={wo.id} value={wo.id}>
                      {wo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Account</Label>
              <Select
                value={task.account_id || ''}
                onValueChange={(v) => handleChange('account_id', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {masterData.accounts.map((ac: any) => (
                    <SelectItem key={ac.id} value={ac.id}>
                      {ac.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Cost Estimated</Label>
            <Input
              type="number"
              defaultValue={task.cost_estimated || ''}
              onBlur={(e) => {
                const val = e.target.value ? parseFloat(e.target.value) : null
                if (val !== task.cost_estimated) handleChange('cost_estimated', val)
              }}
              placeholder="0.00"
            />
          </div>

          <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg border border-border">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">In Budget/Workplan</Label>
              <p className="text-xs text-muted-foreground">
                Is this included in the current year's budget?
              </p>
            </div>
            <Switch
              checked={!!task.in_budget}
              onCheckedChange={(v) => handleChange('in_budget', v)}
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Comments</Label>
            <Textarea
              defaultValue={task.comments || ''}
              onBlur={(e) =>
                e.target.value !== task.comments && handleChange('comments', e.target.value)
              }
              className="min-h-[100px] resize-none"
              placeholder="Add internal notes or comments regarding this task..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
