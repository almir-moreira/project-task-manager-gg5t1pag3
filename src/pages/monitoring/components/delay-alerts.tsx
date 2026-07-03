import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Clock } from 'lucide-react'
import type { MonitoringActivity } from '@/services/monitoring'
import { isApprovalDelayed } from '@/services/monitoring'

export function DelayAlerts({ activities }: { activities: MonitoringActivity[] }) {
  const navigate = useNavigate()
  const delayed = activities.filter((a) => isApprovalDelayed(a))

  if (delayed.length === 0) return null

  const getDelayHours = (a: MonitoringActivity) => {
    if (!a.stage_started_at) return 0
    return Math.floor((Date.now() - new Date(a.stage_started_at).getTime()) / 3600000)
  }

  return (
    <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-800 dark:text-amber-300 text-sm font-semibold">
        Delayed Approvals ({delayed.length})
      </AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-400">
        <p className="text-xs mb-2">
          The following activities have been in an approval stage for more than 48 hours:
        </p>
        <div className="space-y-1 max-h-[200px] overflow-y-auto">
          {delayed.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-2 text-xs cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded px-2 py-1 transition-colors"
              onClick={() => navigate(`/tasks/${a.task_number || a.id}`)}
            >
              <Clock className="w-3 h-3 shrink-0" />
              <span className="font-mono text-[10px]">{a.task_number || a.id.slice(0, 8)}</span>
              <span className="flex-1 truncate">{a.activity_name}</span>
              <span className="font-semibold whitespace-nowrap">
                {getDelayHours(a)}h in {a.status}
              </span>
            </div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  )
}
