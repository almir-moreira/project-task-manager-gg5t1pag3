import { Task } from '@/lib/types'
import { useAppContext } from '@/stores/main'
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

export function TabTaskDetails({ task }: { task: Task }) {
  const { users } = useAppContext()

  return (
    <div className="space-y-6 max-w-4xl">
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
            <Input defaultValue={task.purpose} placeholder="Enter purpose of the activity" />
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Activity Name</Label>
            <Input defaultValue={task.activityName || task.title} />
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Short Description</Label>
            <Textarea
              defaultValue={task.description}
              className="min-h-[120px] resize-none"
              placeholder="Provide a brief description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Start Date</Label>
              <Input type="date" defaultValue={task.startDate} />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">End Date</Label>
              <Input type="date" defaultValue={task.endDate || task.dueDate} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Assignee</Label>
            <Select defaultValue={task.assigneeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
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
              <Select defaultValue={task.costCenterId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CC-100">CC-100 (HQ)</SelectItem>
                  <SelectItem value="CC-200">CC-200 (Field Office)</SelectItem>
                  <SelectItem value="CC-300">CC-300 (Projects)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Budget Line</Label>
              <Select defaultValue={task.budgetLineId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BL-100">BL-100 (Personnel)</SelectItem>
                  <SelectItem value="BL-200">BL-200 (Travel)</SelectItem>
                  <SelectItem value="BL-201">BL-201 (Services)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Workorder</Label>
              <Select defaultValue={task.workorderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WO-300">WO-300</SelectItem>
                  <SelectItem value="WO-301">WO-301</SelectItem>
                  <SelectItem value="WO-302">WO-302</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Account</Label>
              <Select defaultValue={task.accountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACC-400">ACC-400 (Main Operating)</SelectItem>
                  <SelectItem value="ACC-401">ACC-401 (Reserve)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Cost Estimated (USD)</Label>
            <Input type="number" defaultValue={task.costEstimated} placeholder="0.00" />
          </div>

          <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg border border-border">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">In Budget/Workplan</Label>
              <p className="text-xs text-muted-foreground">
                Is this included in the current year's budget?
              </p>
            </div>
            <Switch defaultChecked={task.inBudget} />
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Comments</Label>
            <Textarea
              defaultValue={task.comments}
              className="min-h-[100px] resize-none"
              placeholder="Add internal notes or comments regarding this task..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
