import { Task } from '@/lib/types'
import { useAppContext } from '@/stores/main'
import { Clock } from 'lucide-react'

export function TabHistory({ task }: { task: Task }) {
  const { users } = useAppContext()

  const getUserName = (id: string) => users.find((u) => u.id === id)?.name || 'System'

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="relative border-l border-muted ml-3 space-y-8 pb-4">
        {task.history.map((log) => (
          <div key={log.id} className="relative pl-6">
            <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-foreground">{getUserName(log.userId)}</span>
                <span className="text-muted-foreground">{log.action}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        {task.history.length === 0 && (
          <div className="pl-6 text-sm text-muted-foreground italic">
            No history available for this task.
          </div>
        )}
      </div>
    </div>
  )
}
