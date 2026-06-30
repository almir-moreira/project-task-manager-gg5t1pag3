import { useState, useEffect, useMemo } from 'react'
import { AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { REVIEWER_ROLES, APPROVER_ROLES } from './review-roles'
import { getWorkflowConfigs, getActivityWorkflows } from '@/services/activity-workflows'

const ALL_ROLES = [...REVIEWER_ROLES, ...APPROVER_ROLES]

export function TabFeedback({ activity }: { activity?: any }) {
  const [workflowConfigs, setWorkflowConfigs] = useState<any[]>([])
  const [activityWorkflows, setActivityWorkflows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activity?.id) {
      setLoading(false)
      return
    }
    Promise.all([getWorkflowConfigs(), getActivityWorkflows(activity.id)])
      .then(([wfs, awfs]) => {
        setWorkflowConfigs(wfs)
        setActivityWorkflows(awfs)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activity?.id])

  const steps = useMemo(() => {
    return workflowConfigs
      .filter((wf) => {
        const role = ALL_ROLES.find((r) => r.workflowRole === wf.role)
        return role ? !!activity?.[role.requiredField] : false
      })
      .map((wf) => {
        const role = ALL_ROLES.find((r) => r.workflowRole === wf.role)!
        const awf = activityWorkflows.find((aw) => aw.workflow_id === wf.id)
        const isApproved = awf?.status === 'Approved' || !!activity?.[role.approvedField]
        return {
          ...wf,
          roleConfig: role,
          status: isApproved ? 'Approved' : awf?.status || 'Pending',
          reviewerName: awf?.reviewer?.name || 'Unassigned',
          comments: awf?.comments || activity?.[role.commentsField] || '',
        }
      })
  }, [workflowConfigs, activityWorkflows, activity])

  if (!activity) return null

  if (loading) {
    return <div className="p-4 text-sm text-muted-foreground">Loading feedback...</div>
  }

  const hasRequiredRoles = ALL_ROLES.some((r) => !!activity?.[r.requiredField])

  if (!hasRequiredRoles) {
    return (
      <div className="text-center p-8 bg-muted/20 rounded-lg border border-dashed border-border">
        <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">No review or approval roles configured.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Please select required roles in Review &amp; Approval to see feedback status here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Review &amp; Approval Status</h3>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[150px]">Role</TableHead>
                <TableHead className="w-[120px]">Type</TableHead>
                <TableHead className="w-[100px]">Stage</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="min-w-[200px]">Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {steps.map((step) => (
                <TableRow key={step.id}>
                  <TableCell className="font-medium text-sm">{step.roleConfig.label}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{step.category}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{step.stage}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        step.status === 'Approved'
                          ? 'text-emerald-600 border-emerald-200 bg-emerald-50'
                          : 'text-amber-600 border-amber-200 bg-amber-50'
                      }
                    >
                      {step.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {step.comments || '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
