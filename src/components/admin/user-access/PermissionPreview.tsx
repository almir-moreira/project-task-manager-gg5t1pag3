import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle } from 'lucide-react'
import {
  isAdmin,
  isReadOnly,
  canCreateActivity,
  canViewReport,
  canViewMonitoringDashboard,
  canViewKaiciidCalendar,
  canEditActivity,
  canProvideFeedback,
  canApproveCurrentStep,
  type PermissionUser,
  type PermissionActivity,
} from '@/lib/permissions'

const SAMPLE_STEPS = ['SPM Clearance', 'Head Clearance', 'CPO Approval', 'SG Approval']
const SAMPLE_UNITS = ['Legal', 'EMS', 'Communications', 'Protocol']

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

function PermissionRow({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-mono text-muted-foreground">{label}</span>
      <BoolBadge value={value} />
    </div>
  )
}

export function PermissionPreview({ permUser }: PermissionPreviewProps) {
  const [activities, setActivities] = useState<PermissionActivity[]>([])

  useEffect(() => {
    const fetchActivities = async () => {
      const { data } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2)
      if (data) setActivities(data as unknown as PermissionActivity[])
    }
    fetchActivities()
  }, [])

  const basicChecks = [
    { label: 'isAdmin', value: isAdmin(permUser) },
    { label: 'isReadOnly', value: isReadOnly(permUser) },
    { label: 'canCreateActivity', value: canCreateActivity(permUser) },
    { label: 'canViewMonitoringDashboard', value: canViewMonitoringDashboard(permUser) },
    { label: 'canViewKaiciidCalendar', value: canViewKaiciidCalendar(permUser) },
    { label: 'canViewReport("Sample Report")', value: canViewReport(permUser, 'Sample Report') },
  ]

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
        {activities.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Activity-Specific Scenarios
            </p>
            {activities.map((activity, i) => (
              <div key={activity.id} className="rounded-lg border p-3 space-y-2">
                <p className="text-xs font-medium truncate">
                  Activity #{i + 1}: {activity.activity_name || activity.id.slice(0, 8)}
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  <PermissionRow
                    label="canEditActivity"
                    value={canEditActivity(permUser, activity)}
                  />
                  {SAMPLE_UNITS.map((unit) => (
                    <PermissionRow
                      key={unit}
                      label={`canProvideFeedback("${unit}")`}
                      value={canProvideFeedback(permUser, activity, unit)}
                    />
                  ))}
                  {SAMPLE_STEPS.map((step) => (
                    <PermissionRow
                      key={step}
                      label={`canApproveCurrentStep("${step}")`}
                      value={canApproveCurrentStep(permUser, activity, step)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {activities.length === 0 && (
          <p className="text-xs text-muted-foreground italic">
            No activities found for scenario preview.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
