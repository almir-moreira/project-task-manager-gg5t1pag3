import { Check, X, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { canActOnApprovalStep, ROLE_TO_STEP_NAME } from '@/lib/approval-guards'
import { isAdmin, type PermissionActivity, type PermissionUser } from '@/lib/permissions'
import type { RoleConfig } from './review-roles'

interface ApprovalActionsProps {
  activity: any
  role: RoleConfig
  permUser: PermissionUser | null
  onApprove: (role: RoleConfig) => void
  onReject: (role: RoleConfig) => void
  onClear: (role: RoleConfig) => void
}

export function ApprovalActions({
  activity,
  role,
  permUser,
  onApprove,
  onReject,
  onClear,
}: ApprovalActionsProps) {
  const stepName = ROLE_TO_STEP_NAME[role.workflowRole] || ''
  const { allowed, stepState } = canActOnApprovalStep(
    permUser as PermissionUser | null,
    activity as PermissionActivity,
    role.approvedField,
    stepName,
  )
  const admin = isAdmin(permUser)

  if (stepState === 'not-required') {
    return <span className="text-muted-foreground text-sm">—</span>
  }

  if (stepState === 'completed') {
    return (
      <div className="flex flex-col items-center gap-2">
        <Badge className="bg-[#DCFCE7] text-[#166534] border-[#86EFAC] hover:bg-[#DCFCE7]">
          Approved
        </Badge>
        {admin && (
          <Button size="sm" variant="outline" onClick={() => onClear(role)} className="h-7 text-xs">
            <RotateCcw className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
    )
  }

  if (stepState === 'future') {
    return (
      <Badge variant="outline" className="bg-muted text-muted-foreground">
        Pending
      </Badge>
    )
  }

  if (allowed) {
    const label = role.workflowRole.includes('Approval') ? 'Approve' : 'Complete'
    return (
      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          onClick={() => onApprove(role)}
          className="h-7 text-xs bg-[#166534] hover:bg-[#15803d]"
        >
          <Check className="w-3 h-3 mr-1" />
          {label}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onReject(role)}
          className="h-7 text-xs text-[#991B1B] border-[#FCA5A5] hover:bg-[#FEE2E2]"
        >
          <X className="w-3 h-3" />
          Reject
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1 max-w-[180px]">
      <Badge variant="outline" className="bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5]">
        Locked
      </Badge>
      <p className="text-xs text-muted-foreground italic text-center leading-tight">
        You can view this approval step, but you do not have permission to act on it.
      </p>
    </div>
  )
}
