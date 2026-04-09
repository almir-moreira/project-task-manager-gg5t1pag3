import { Clock } from 'lucide-react'

export function TabHistory({ task }: { task: any }) {
  const history = [
    {
      id: 1,
      action: 'Created task',
      user: 'System',
      time: new Date(task.created_at || Date.now()).toLocaleString(),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <h3 className="text-lg font-medium">Audit History</h3>
      <div className="relative border-l border-muted ml-3 space-y-8 pb-4 mt-4">
        {history.map((log) => (
          <div key={log.id} className="relative pl-6">
            <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-foreground">{log.user}</span>
                <span className="text-muted-foreground">{log.action}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {log.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
