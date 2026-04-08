import { Task, TaskStatus } from '@/lib/types'
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
import { Badge } from '@/components/ui/badge'
import { getStatusColor } from '@/lib/status-colors'
import { Switch } from '@/components/ui/switch'

interface TaskPropertiesFormProps {
  task: Task
}

const allStatuses: TaskStatus[] = [
  'To Do',
  'In Progress',
  'On Hold',
  'SPM Clearance',
  'Head Clearance',
  'CPO Approval',
  'SG Approval',
  'Rejected',
  'Done',
]

export function TaskPropertiesForm({ task }: TaskPropertiesFormProps) {
  const { updateTaskStatus, users } = useAppContext()

  const handleStatusChange = (val: string) => {
    updateTaskStatus(task.id, val as TaskStatus)
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm flex flex-col h-full h-[calc(100vh-10rem)] sticky top-[72px]">
      <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">Task {task.id}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Programme: {task.programme}</p>
        </div>
        <Badge className={`px-3 py-1 ${getStatusColor(task.status)} border-0`}>{task.status}</Badge>
      </div>

      <div className="p-4 overflow-y-auto space-y-6 scrollbar-thin flex-1">
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            Classification
          </h3>

          <div className="grid gap-2">
            <Label className="text-xs">Status (Workflow)</Label>
            <Select value={task.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-8 text-sm">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-xs">Type</Label>
              <Select defaultValue={task.type}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="Project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-xs">Priority</Label>
              <Select defaultValue={task.priority}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
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

        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            Details
          </h3>
          <div className="grid gap-2">
            <Label className="text-xs">Activity Name</Label>
            <Input defaultValue={task.title} className="h-8 text-sm" />
          </div>
          <div className="grid gap-2">
            <Label className="text-xs">Short Description</Label>
            <Textarea
              defaultValue={task.description}
              className="min-h-[80px] text-sm resize-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            Planning & Resources
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-xs">Start Date</Label>
              <Input type="date" defaultValue={task.startDate} className="h-8 text-sm" />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs">Due Date</Label>
              <Input type="date" defaultValue={task.dueDate} className="h-8 text-sm" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-xs">Assignee</Label>
            <Select defaultValue={task.assigneeId}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
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

        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            Financials
          </h3>
          <div className="grid gap-2">
            <Label className="text-xs">Estimated Cost (USD)</Label>
            <Input type="number" defaultValue={task.costEstimated} className="h-8 text-sm" />
          </div>
          <div className="flex items-center justify-between bg-muted/30 p-3 rounded-md border border-border">
            <Label className="text-xs cursor-pointer" htmlFor="in-budget">
              Included in Current Year Budget
            </Label>
            <Switch id="in-budget" defaultChecked={task.inBudget} />
          </div>
        </div>
      </div>
    </div>
  )
}
