import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { getStatusColor } from '@/lib/status-colors'
import { useState, useEffect } from 'react'
import { getMasterData } from '@/services/master-data'
import { updateActivity, getActivities } from '@/services/activities'

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

export function ActivityPropertiesForm({
  activity,
  onUpdate,
}: {
  activity: any
  onUpdate: (a: any) => void
}) {
  const [masterData, setMasterData] = useState<any>(null)
  const [activitiesList, setActivitiesList] = useState<any[]>([])

  useEffect(() => {
    getMasterData().then(setMasterData)
    getActivities().then(setActivitiesList)
  }, [])

  const handleChange = async (field: string, val: any) => {
    try {
      const updated = await updateActivity(activity.id, { [field]: val })
      onUpdate(updated)
    } catch (e) {
      console.error(e)
    }
  }

  if (!masterData)
    return <div className="p-4 text-sm text-muted-foreground">Loading properties...</div>

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm flex flex-col h-full h-[calc(100vh-10rem)] sticky top-[72px]">
      <div className="p-4 border-b border-border bg-muted/20 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground/90">
              {activity.task_number || activity.id.slice(0, 8)}
            </h2>
          </div>
          <Badge className={`px-3 py-1 ${getStatusColor(activity.status)} border-0 font-semibold`}>
            {activity.status || 'To Do'}
          </Badge>
        </div>
      </div>

      <div className="p-5 overflow-y-auto space-y-6 scrollbar-thin flex-1">
        <div className="grid gap-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Status (Workflow)
          </Label>
          <Select
            value={activity.status || 'To Do'}
            onValueChange={(v) => handleChange('status', v)}
          >
            <SelectTrigger className="h-9">
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
          <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Programme
          </Label>
          <Select
            value={activity.programme_id || ''}
            onValueChange={(v) => handleChange('programme_id', v)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select programme" />
            </SelectTrigger>
            <SelectContent>
              {masterData.programmes.map((p: any) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Project
          </Label>
          <Input
            defaultValue={activity.project || ''}
            onBlur={(e) =>
              e.target.value !== activity.project && handleChange('project', e.target.value)
            }
            className="h-9"
            placeholder="Project name"
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Project Owner
          </Label>
          <Select
            value={activity.project_owner_id || ''}
            onValueChange={(v) => handleChange('project_owner_id', v)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select owner" />
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
          <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Sub Activity ID
          </Label>
          <Select
            value={activity.sub_task_id || 'none'}
            onValueChange={(v) => handleChange('sub_task_id', v === 'none' ? null : v)}
          >
            <SelectTrigger className="h-9">
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

        <div className="grid gap-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Category
          </Label>
          <Select value={activity.type_id || ''} onValueChange={(v) => handleChange('type_id', v)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {masterData.taskTypes.map((t: any) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Priority
          </Label>
          <Select
            value={activity.priority || 'Medium'}
            onValueChange={(v) => handleChange('priority', v)}
          >
            <SelectTrigger className="h-9">
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
      </div>
    </div>
  )
}
