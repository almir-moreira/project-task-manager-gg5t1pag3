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
import { ActivityBudgetLines } from './ActivityBudgetLines'
import {
  updateActivity,
  addActivityBudgetLine,
  updateActivityBudgetLine,
  removeActivityBudgetLine,
} from '@/services/activities'

export function TabActivityDetails({
  activity,
  onUpdate,
}: {
  activity: any
  onUpdate: (a: any) => void
}) {
  const [masterData, setMasterData] = useState<any>(null)
  const [budgetLines, setBudgetLines] = useState<any[]>(activity?.activity_budget_lines || [])

  useEffect(() => {
    getMasterData().then(setMasterData)
  }, [])

  useEffect(() => {
    if (activity?.activity_budget_lines) {
      setBudgetLines(activity.activity_budget_lines)
    }
  }, [activity])

  const handleChange = async (field: string, val: any) => {
    try {
      const updated = await updateActivity(activity.id, { [field]: val })
      onUpdate({ ...activity, ...updated })
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddBudgetLine = async () => {
    try {
      const newLine = await addActivityBudgetLine(activity.id)
      const newLines = [...budgetLines, newLine]
      setBudgetLines(newLines)
      onUpdate({ ...activity, activity_budget_lines: newLines })
    } catch (e) {
      console.error(e)
    }
  }

  const handleUpdateBudgetLine = async (lineId: string, field: string, value: any) => {
    try {
      const updatedLine = await updateActivityBudgetLine(lineId, { [field]: value })
      const newLines = budgetLines.map((l) => (l.id === lineId ? updatedLine : l))
      setBudgetLines(newLines)
      onUpdate({ ...activity, activity_budget_lines: newLines })
    } catch (e) {
      console.error(e)
    }
  }

  const handleRemoveBudgetLine = async (lineId: string) => {
    try {
      await removeActivityBudgetLine(lineId)
      const newLines = budgetLines.filter((l) => l.id !== lineId)
      setBudgetLines(newLines)
      onUpdate({ ...activity, activity_budget_lines: newLines })
    } catch (e) {
      console.error(e)
    }
  }

  if (!masterData)
    return <div className="p-4 text-sm text-muted-foreground">Loading details...</div>

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in pb-10">
      <div>
        <h3 className="text-lg font-medium">Activity Details</h3>
      </div>

      <div className="space-y-5">
        <div className="grid gap-2">
          <Label className="text-sm font-semibold">Purpose</Label>
          <Input
            defaultValue={activity.purpose || ''}
            onBlur={(e) =>
              e.target.value !== activity.purpose && handleChange('purpose', e.target.value)
            }
            placeholder="Enter purpose of the activity"
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-semibold">Activity Name</Label>
          <Input
            defaultValue={activity.activity_name || ''}
            onBlur={(e) =>
              e.target.value !== activity.activity_name &&
              handleChange('activity_name', e.target.value)
            }
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-semibold">Description</Label>
          <Textarea
            defaultValue={activity.short_description || ''}
            onBlur={(e) =>
              e.target.value !== activity.short_description &&
              handleChange('short_description', e.target.value)
            }
            placeholder="Provide a detailed description..."
            className="min-h-[100px] resize-y"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Start Date</Label>
            <Input
              type="date"
              defaultValue={activity.start_date || ''}
              onBlur={(e) =>
                e.target.value !== activity.start_date && handleChange('start_date', e.target.value)
              }
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-sm font-semibold">End Date</Label>
            <Input
              type="date"
              defaultValue={activity.end_date || ''}
              onBlur={(e) =>
                e.target.value !== activity.end_date && handleChange('end_date', e.target.value)
              }
            />
          </div>
          <div className="flex items-center justify-between bg-muted/30 px-3 py-2 rounded-md border border-input h-10">
            <Label className="text-sm font-medium">In Budget</Label>
            <Switch
              checked={!!activity.in_budget}
              onCheckedChange={(v) => handleChange('in_budget', v)}
            />
          </div>
          <div className="flex items-center justify-between bg-muted/30 px-3 py-2 rounded-md border border-input h-10">
            <Label className="text-sm font-medium">In the Workplan</Label>
            <Switch
              checked={!!activity.in_workplan}
              onCheckedChange={(v) => handleChange('in_workplan', v)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Assignee</Label>
            <Select
              value={activity.assignee_id || ''}
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
          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Cost Estimated</Label>
            <Input
              type="number"
              defaultValue={activity.cost_estimated || ''}
              onBlur={(e) => {
                const val = e.target.value ? parseFloat(e.target.value) : null
                if (val !== activity.cost_estimated) handleChange('cost_estimated', val)
              }}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-semibold">Comments</Label>
          <Textarea
            defaultValue={activity.comments || ''}
            onBlur={(e) =>
              e.target.value !== activity.comments && handleChange('comments', e.target.value)
            }
            className="min-h-[80px] resize-none"
            placeholder="Add internal notes or comments regarding this activity..."
          />
        </div>

        <ActivityBudgetLines
          budgetLines={budgetLines}
          masterData={masterData}
          onAdd={handleAddBudgetLine}
          onUpdate={handleUpdateBudgetLine}
          onRemove={handleRemoveBudgetLine}
        />
      </div>
    </div>
  )
}
