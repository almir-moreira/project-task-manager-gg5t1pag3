import { Task, TaskStatus } from '@/lib/types'
import { useAppContext } from '@/stores/main'
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

  const programmes = ['Alpha', 'Beta', 'Gamma', 'Delta']

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm flex flex-col h-full h-[calc(100vh-10rem)] sticky top-[72px]">
      <div className="p-4 border-b border-border bg-muted/20 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground/90">{task.id}</h2>
          </div>
          <Badge className={`px-3 py-1 ${getStatusColor(task.status)} border-0 font-semibold`}>
            {task.status}
          </Badge>
        </div>
      </div>

      <div className="p-5 overflow-y-auto space-y-6 scrollbar-thin flex-1">
        <div className="grid gap-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Status (Workflow)
          </Label>
          <Select value={task.status} onValueChange={handleStatusChange}>
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
          <Select defaultValue={task.programme}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select programme" />
            </SelectTrigger>
            <SelectContent>
              {programmes.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Project
          </Label>
          <Input defaultValue={task.project} className="h-9" placeholder="Project name or ID" />
        </div>

        <div className="grid gap-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Project Owner
          </Label>
          <Select defaultValue={task.projectOwnerId}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select owner" />
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

        <div className="grid gap-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Sub Task ID
          </Label>
          <Input defaultValue={task.subTaskId} placeholder="e.g. A-00002" className="h-9" />
        </div>

        <div className="grid gap-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Type
          </Label>
          <Select defaultValue={task.type}>
            <SelectTrigger className="h-9">
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
          <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Priority
          </Label>
          <Select defaultValue={task.priority}>
            <SelectTrigger className="h-9">
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
  )
}
