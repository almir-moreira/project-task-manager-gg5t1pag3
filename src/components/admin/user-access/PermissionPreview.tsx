import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle2, XCircle, Info } from 'lucide-react'
import {
  isAdmin,
  isReadOnly,
  canCreateActivity,
  canViewReport,
  canViewMonitoringDashboard,
  canViewKaiciidCalendar,
  explainCanEditActivity,
  explainCanProvideFeedback,
  explainCanApproveCurrentStep,
  getWfFieldForUnit,
  type PermissionUser,
  type PermissionActivity,
} from '@/lib/permissions'

const SAMPLE_STEPS = ['SPM Clearance', 'Head Clearance', 'CPO Approval', 'SG Approval']

interface PermissionPreviewProps {
  permUser: PermissionUser
}

function BoolBadge({ value }: { value: boolean }) {
  return value ? (
    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
      <CheckCircle2 className="w-3 h-3 mr-1" /> Yes
    </Badge>
  ) : (
    <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">
      <XCircle className="w-3 h-3 mr-1" /> No
    </Badge>
  )
}

function ReasonRow({
  label,
  reason,
  allowed,
}: {
  label: string
  reason: string
  allowed: boolean
}) {
  return (
    <div className="rounded-md border px-3 py-2 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground">{label}</span>
        <BoolBadge value={allowed} />
      </div>
      <p className="text-xs text-muted-foreground">{reason}</p>
    </div>
  )
}

export function PermissionPreview({ permUser }: PermissionPreviewProps) {
  const [activities, setActivities] = useState<PermissionActivity[]>([])
  const [selectedActivityId, setSelectedActivityId] = useState('')

  useEffect(() => {
    supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setActivities(data as unknown as PermissionActivity[])
      })
  }, [])

  const selectedActivity = activities.find((a) => a.id === selectedActivityId) || null
  const userUnits = permUser.units || []

  const basicChecks = [
    { label: 'isAdmin', value: isAdmin(permUser) },
    { label: 'isReadOnly', value: isReadOnly(permUser) },
    { label: 'canCreateActivity', value: canCreateActivity(permUser) },
    { label: 'canViewMonitoringDashboard', value: canViewMonitoringDashboard(permUser) },
    { label: 'canViewKaiciidCalendar', value: canViewKaiciidCalendar(permUser) },
    { label: 'canViewReport("Sample Report")', value: canViewReport(permUser, 'Sample Report') },
  ]

  const editResult = selectedActivity ? explainCanEditActivity(permUser, selectedActivity) : null
  const approvalResults = selectedActivity
    ? SAMPLE_STEPS.map((step) => ({
        step,
        ...explainCanApproveCurrentStep(permUser, selectedActivity, step),
      }))
    : []

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Permission Preview (Read-Only Diagnostic)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {basicChecks.map((check) => (
            <div
              key={check.label}
              className="flex items-center justify-between rounded-md border px-3 py-2"
            >
              <span className="text-xs font-mono">{check.label}</span>
              <BoolBadge value={check.value} />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Select Activity for Diagnostic Preview
          </label>
          <Select value={selectedActivityId} onValueChange={setSelectedActivityId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose an activity..." />
            </SelectTrigger>
            <SelectContent>
              {activities.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.activity_name || a.id.slice(0, 8)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedActivity && editResult && (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Diagnostic Preview for Selected Activity
            </p>
            <div className="flex items-start gap-2 rounded-md bg-blue-50 border border-blue-200 p-2">
              <Info className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700">
                This section is read-only. It shows how the permission helper functions evaluate the
                selected user against a sample activity. It does not configure permissions for that
                activity.
              </p>
            </div>
            <div className="space-y-1.5">
              <ReasonRow
                label="canEditActivity"
                allowed={editResult.allowed}
                reason={editResult.reason}
              />
              {userUnits.length > 0 ? (
                userUnits.map((unit) => {
                  const r = explainCanProvideFeedback(permUser, selectedActivity, unit)
                  const wf = getWfFieldForUnit(unit)
                  return (
                    <ReasonRow
                      key={unit}
                      label={`canProvideFeedback("${unit}"${wf ? ` → ${wf}` : ''})`}
                      allowed={r.allowed}
                      reason={r.reason}
                    />
                  )
                })
              ) : (
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground italic">
                    User has no unit memberships — feedback checks not applicable.
                  </p>
                </div>
              )}
              {approvalResults.map(({ step, allowed, reason }) => (
                <ReasonRow
                  key={step}
                  label={`canApproveCurrentStep("${step}")`}
                  allowed={allowed}
                  reason={reason}
                />
              ))}
            </div>
          </div>
        )}

        {!selectedActivity && (
          <p className="text-xs text-muted-foreground italic">
            Select an activity above to see the diagnostic permission preview.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
