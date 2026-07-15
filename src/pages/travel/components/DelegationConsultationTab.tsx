import { CheckCircle2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const CONSULTATION_STATUSES = ['Pending', 'In Progress', 'Completed', 'Not Required'] as const
const RECOMMENDATIONS = ['No Objection', 'Recommend Adjustment', 'Concern', 'Not Applicable'] as const

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-muted text-muted-foreground',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  Completed: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  'Not Required': 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
}

interface Props {
  isDraft: boolean
  consultations: any[]
  selectedUnits: string[]
  onSelectedUnitsChange: (units: string[]) => void
  onConsultationChange: (id: string, field: string, value: any) => void
  onConsultationUpdate: (id: string, field: string, value: any) => void
  profiles: any[]
  canEdit: boolean
  currentUserId: string | null
  units: string[]
}

export function DelegationConsultationTab({
  isDraft,
  consultations,
  selectedUnits,
  onSelectedUnitsChange,
  onConsultationChange,
  onConsultationUpdate,
  profiles,
  canEdit,
  currentUserId,
  units,
}: Props) {
  const allCompleted =
    consultations.length > 0 &&
    consultations.every((c) => c.status === 'Completed' || c.status === 'Not Required')

  const toggleUnit = (unit: string, checked: boolean) => {
    if (checked) {
      onSelectedUnitsChange([...selectedUnits, unit])
    } else {
      onSelectedUnitsChange(selectedUnits.filter((u) => u !== unit))
    }
  }

  if (isDraft) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Select the units required for consultation. Records will be created upon submission.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {units.map((unit) => (
            <div key={unit} className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm font-medium">{unit}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">No</span>
                <Switch
                  checked={selectedUnits.includes(unit)}
                  onCheckedChange={(v) => toggleUnit(unit, v)}
                />
                <span className="text-xs text-muted-foreground">Yes</span>
              </div>
            </div>
          ))}
        </div>
        {selectedUnits.length === 0 && (
          <p className="text-xs text-muted-foreground italic">
            Select at least one unit before submitting for consultation.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {allCompleted && (
        <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800 p-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <p className="text-sm text-green-700 dark:text-green-300">
            All required consultations are completed. Ready for Certifying Officer review.
          </p>
        </div>
      )}
      {consultations.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          No consultation records found. This may indicate no units were selected during submission.
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left font-medium py-2 pr-4">Unit Name</th>
              <th className="text-left font-medium py-2 px-2 min-w-[160px]">Reviewer</th>
              <th className="text-left font-medium py-2 px-2 min-w-[140px]">Status</th>
              <th className="text-left font-medium py-2 px-2 min-w-[160px]">Recommendation</th>
              <th className="text-left font-medium py-2 px-2 min-w-[200px]">Comments</th>
              <th className="text-left font-medium py-2 px-2 min-w-[120px]">Reviewed At</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map((c) => {
              const canEditRow = canEdit || (!!currentUserId && c.reviewer_id === currentUserId)
              return (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-medium">{c.unit_name}</td>
                  <td className="py-2 px-2">
                    {canEditRow ? (
                      <Select
                        value={c.reviewer_id || ''}
                        onValueChange={(v) => onConsultationUpdate(c.id, 'reviewer_id', v)}
                      >
                        <SelectTrigger className="w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent>
                          {profiles.map((p) => (
                            <SelectItem key={p.id} value={p.id}>{p.name || p.email}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-muted-foreground">{c.reviewer?.name || '—'}</span>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {canEditRow ? (
                      <Select
                        value={c.status || 'Pending'}
                        onValueChange={(v) => onConsultationUpdate(c.id, 'status', v)}
                      >
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {CONSULTATION_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline" className={cn(STATUS_COLORS[c.status])}>
                        {c.status || 'Pending'}
                      </Badge>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {canEditRow ? (
                      <Select
                        value={c.recommendation || ''}
                        onValueChange={(v) => onConsultationUpdate(c.id, 'recommendation', v)}
                      >
                        <SelectTrigger className="w-full"><SelectValue placeholder="—" /></SelectTrigger>
                        <SelectContent>
                          {RECOMMENDATIONS.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-muted-foreground">{c.recommendation || '—'}</span>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {canEditRow ? (
                      <Textarea
                        className="min-h-[60px]"
                        placeholder="Comments..."
                        value={c.comments || ''}
                        onChange={(e) => onConsultationChange(c.id, 'comments', e.target.value)}
                        onBlur={(e) => onConsultationUpdate(c.id, 'comments', e.target.value)}
                      />
                    ) : (
                      <span className="text-muted-foreground">{c.comments || '—'}</span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-muted-foreground text-xs">
                    {c.reviewed_at ? new Date(c.reviewed_at).toLocaleString() : '—'}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
