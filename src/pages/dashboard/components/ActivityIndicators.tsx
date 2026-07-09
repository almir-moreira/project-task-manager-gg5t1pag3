import { Badge } from '@/components/ui/badge'
import { Clock, AlertTriangle, MessageSquare, FileCheck, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ActivityIndicators } from '@/lib/dashboard-indicators'

interface IndicatorChipsProps {
  indicators: ActivityIndicators
  className?: string
}

export function IndicatorChips({ indicators, className }: IndicatorChipsProps) {
  const feedbackLabel = indicators.pendingFeedback
    ? `Pending Feedback ${indicators.completedFeedbackCount}/${indicators.totalFeedbackCount}`
    : `Feedback ${indicators.completedFeedbackCount}/${indicators.totalFeedbackCount}`

  const chips: { label: string; icon: any; cls: string; show: boolean }[] = [
    {
      label: indicators.currentStage || 'Not available',
      icon: Clock,
      cls: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
      show: true,
    },
    {
      label: 'Overdue',
      icon: AlertTriangle,
      cls: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400',
      show: indicators.isOverdue,
    },
    {
      label: feedbackLabel,
      icon: MessageSquare,
      cls: indicators.pendingFeedback
        ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400'
        : 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400',
      show: indicators.totalFeedbackCount > 0,
    },
    {
      label: 'Pending Review',
      icon: FileCheck,
      cls: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
      show: indicators.pendingReview,
    },
    {
      label: 'Pending Approval',
      icon: FileCheck,
      cls: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400',
      show: indicators.pendingApproval,
    },
    {
      label: 'Final Approval Pending',
      icon: ShieldAlert,
      cls: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400',
      show: indicators.finalApprovalPending,
    },
  ]

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {chips
        .filter((c) => c.show)
        .map((chip, idx) => {
          const Icon = chip.icon
          return (
            <Badge
              key={idx}
              variant="outline"
              className={cn('text-[10px] font-medium border gap-1 py-0.5 px-2', chip.cls)}
            >
              <Icon className="w-3 h-3" />
              {chip.label}
            </Badge>
          )
        })}
    </div>
  )
}
