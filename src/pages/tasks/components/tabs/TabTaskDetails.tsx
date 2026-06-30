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
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { getMasterData } from '@/services/master-data'
import { ActivityBudgetLines } from './ActivityBudgetLines'
import {
  updateActivity,
  addActivityBudgetLine,
  updateActivityBudgetLine,
  removeActivityBudgetLine,
  getActivities,
} from '@/services/activities'
import { REVIEWER_ROLES, APPROVER_ROLES } from './review-roles'
import { Badge } from '@/components/ui/badge'
import { getStatusColor } from '@/lib/status-colors'

const allStatuses = [
  'To Do',
  'In Progress',
  'On Hold',
  'SPM Clearance',
  'Head Clearance',
  'Head Approval',
  'CPO Approval',
  'SG Approval',
  'Rejected',
  'Done',
]

function CurrencyMaskInput({
  value,
  onChange,
  placeholder,
}: {
  value: number | null | undefined
  onChange: (val: number | null) => void
  placeholder?: string
}) {
  const format = (v: number | null | undefined) => {
    if (v === null || v === undefined || isNaN(v)) return ''
    return new Intl.NumberFormat('en-IE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(v)
  }

  const [displayValue, setDisplayValue] = useState(format(value))
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(format(value))
    }
  }, [value, isFocused])

  const handleBlur = () => {
    setIsFocused(false)
    const parsed = parseFloat(displayValue.replace(/,/g, ''))
    if (!isNaN(parsed)) {
      onChange(parsed)
      setDisplayValue(format(parsed))
    } else {
      onChange(null)
      setDisplayValue('')
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    if (value !== null && value !== undefined && !isNaN(value)) {
      setDisplayValue(value.toString())
    } else {
      setDisplayValue('')
    }
  }

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
        €
      </span>
      <Input
        type="text"
        value={displayValue}
        onChange={(e) => setDisplayValue(e.target.value.replace(/[^0-9.,]/g, ''))}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className="pl-7"
        placeholder={placeholder || '0.00'}
      />
    </div>
  )
}

export function TabActivityDetails({
  activity,
  onUpdate,
}: {
  activity: any
  onUpdate: (a: any) => void
}) {
  const [masterData, setMasterData] = useState<any>(null)
  const [activitiesList, setActivitiesList] = useState<any[]>([])
  const [budgetLines, setBudgetLines] = useState<any[]>(activity?.activity_budget_lines || [])

  useEffect(() => {
    getMasterData().then(setMasterData)
    getActivities().then(setActivitiesList)
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

  const handleRoleToggle = async (requiredField: string, idField: string, checked: boolean) => {
    const updates: any = { [requiredField]: checked }
    if (!checked) updates[idField] = null
    try {
      const updated = await updateActivity(activity.id, updates)
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
    <div className="space-y-6 max-w-6xl animate-fade-in pb-10">
      {/* Project Information */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Programme</Label>
              <Select
                value={activity.programme_id || ''}
                onValueChange={(v) => handleChange('programme_id', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select programme" />
                </SelectTrigger>
                <SelectContent>
                  {masterData.programmes?.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Project</Label>
              <Select
                value={activity.project_id || ''}
                onValueChange={(v) => handleChange('project_id', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {masterData.projects?.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Project Owner</Label>
              <Select
                value={activity.project_owner_id || ''}
                onValueChange={(v) => handleChange('project_owner_id', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  {masterData.profiles?.map((u: any) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Roles */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Reviewers</Label>
              {REVIEWER_ROLES.map((role) => (
                <div key={role.idField} className="flex items-center gap-3">
                  <Checkbox
                    checked={!!activity[role.requiredField]}
                    onCheckedChange={(v) => handleRoleToggle(role.requiredField, role.idField, !!v)}
                  />
                  <Label className="text-sm w-28 shrink-0">{role.label}</Label>
                  <Select
                    value={activity[role.idField] || 'unassigned'}
                    onValueChange={(v) => handleChange(role.idField, v === 'unassigned' ? null : v)}
                    disabled={!activity[role.requiredField]}
                  >
                    <SelectTrigger className="flex-1 h-9">
                      <SelectValue placeholder="Select reviewer..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {masterData.profiles?.map((u: any) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Approvers</Label>
              {APPROVER_ROLES.map((role) => (
                <div key={role.idField} className="flex items-center gap-3">
                  <Checkbox
                    checked={!!activity[role.requiredField]}
                    onCheckedChange={(v) => handleRoleToggle(role.requiredField, role.idField, !!v)}
                  />
                  <Label className="text-sm w-28 shrink-0">{role.label}</Label>
                  <Select
                    value={activity[role.idField] || 'unassigned'}
                    onValueChange={(v) => handleChange(role.idField, v === 'unassigned' ? null : v)}
                    disabled={!activity[role.requiredField]}
                  >
                    <SelectTrigger className="flex-1 h-9">
                      <SelectValue placeholder="Select approver..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {masterData.profiles?.map((u: any) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Info */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="grid gap-2 lg:col-span-2">
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
              <Label className="text-sm font-semibold">Task Number</Label>
              <Input
                readOnly
                value={activity.task_number || activity.id.slice(0, 8)}
                className="bg-muted text-muted-foreground font-mono"
              />
            </div>

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
                  {masterData.profiles?.map((u: any) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Status</Label>
                <Badge
                  className={`px-2 py-0 text-[10px] ${getStatusColor(activity.status)} border-0 font-medium`}
                >
                  {activity.status || 'To Do'}
                </Badge>
              </div>
              <Select
                value={activity.status || 'To Do'}
                onValueChange={(v) => handleChange('status', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {allStatuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Priority</Label>
              <Select
                value={activity.priority || 'Medium'}
                onValueChange={(v) => handleChange('priority', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Type</Label>
              <Select
                value={activity.type_id || ''}
                onValueChange={(v) => handleChange('type_id', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {masterData.task_types?.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Category</Label>
              <Select
                value={activity.category_id || ''}
                onValueChange={(v) => handleChange('category_id', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {masterData.categories?.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Sub Activity ID</Label>
              <Select
                value={activity.sub_task_id || 'none'}
                onValueChange={(v) => handleChange('sub_task_id', v === 'none' ? null : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {activitiesList
                    .filter((a) => a.id !== activity.id)
                    .map((a: any) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.task_number || a.id.slice(0, 8)} - {a.activity_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 mt-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Timeline & Cost */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline & Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Start Date</Label>
              <Input
                type="date"
                defaultValue={activity.start_date || ''}
                onBlur={(e) =>
                  e.target.value !== activity.start_date &&
                  handleChange('start_date', e.target.value)
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
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Cost Estimated</Label>
              <CurrencyMaskInput
                value={activity.cost_estimated}
                onChange={(val) => handleChange('cost_estimated', val)}
                placeholder="0.00"
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
              <Label className="text-sm font-medium">In Workplan</Label>
              <Switch
                checked={!!activity.in_workplan}
                onCheckedChange={(v) => handleChange('in_workplan', v)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Details */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Details</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Budget Lines */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Lines</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityBudgetLines
            budgetLines={budgetLines}
            masterData={masterData}
            onAdd={handleAddBudgetLine}
            onUpdate={handleUpdateBudgetLine}
            onRemove={handleRemoveBudgetLine}
          />
        </CardContent>
      </Card>
    </div>
  )
}
