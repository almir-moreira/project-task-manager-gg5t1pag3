import type { ReactNode } from 'react'
import { CheckCircle2, XCircle, Clock, PlayCircle, SkipForward } from 'lucide-react'
import { format } from 'date-fns'

export interface WorkflowStepConfig {
  id: string
  displayName: string
  category: 'Feedback' | 'Review' | 'Approval'
  order: number
  enabledField: string
  reviewerIdField: string
  approvedField?: string
  commentsField?: string
  dateField?: string
  workflowRole: string
}

export const WORKFLOW_STEPS: WorkflowStepConfig[] = [
  {
    id: 'wf-partnerships',
    displayName: 'Partnerships Feedback',
    category: 'Feedback',
    order: 1,
    enabledField: 'wf_partnerships',
    reviewerIdField: 'wf_partnerships_reviewer_id',
    workflowRole: 'Partnerships',
  },
  {
    id: 'wf-relex',
    displayName: 'RELEX Feedback',
    category: 'Feedback',
    order: 2,
    enabledField: 'wf_relex',
    reviewerIdField: 'wf_relex_reviewer_id',
    workflowRole: 'Relex',
  },
  {
    id: 'wf-legal',
    displayName: 'Legal Feedback',
    category: 'Feedback',
    order: 3,
    enabledField: 'wf_legal',
    reviewerIdField: 'wf_legal_reviewer_id',
    workflowRole: 'Legal',
  },
  {
    id: 'wf-gob',
    displayName: 'Governing Bodies Feedback',
    category: 'Feedback',
    order: 4,
    enabledField: 'wf_gob',
    reviewerIdField: 'wf_gob_reviewer_id',
    workflowRole: 'Governing Bodies',
  },
  {
    id: 'wf-protocol',
    displayName: 'Protocol Feedback',
    category: 'Feedback',
    order: 5,
    enabledField: 'wf_protocol',
    reviewerIdField: 'wf_protocol_reviewer_id',
    workflowRole: 'Protocol',
  },
  {
    id: 'wf-ems',
    displayName: 'EMS Feedback',
    category: 'Feedback',
    order: 6,
    enabledField: 'wf_ems',
    reviewerIdField: 'wf_ems_reviewer_id',
    workflowRole: 'EMS',
  },
  {
    id: 'wf-procurement',
    displayName: 'Procurement Feedback',
    category: 'Feedback',
    order: 7,
    enabledField: 'wf_procurement',
    reviewerIdField: 'wf_procurement_reviewer_id',
    workflowRole: 'Procurement',
  },
  {
    id: 'wf-technology',
    displayName: 'Technology Feedback',
    category: 'Feedback',
    order: 8,
    enabledField: 'wf_technology',
    reviewerIdField: 'wf_technology_reviewer_id',
    workflowRole: 'Technology',
  },
  {
    id: 'wf-mne',
    displayName: 'M&E Feedback',
    category: 'Feedback',
    order: 9,
    enabledField: 'wf_mne',
    reviewerIdField: 'wf_mne_reviewer_id',
    workflowRole: 'M&E',
  },
  {
    id: 'wf-comms',
    displayName: 'Communications Feedback',
    category: 'Feedback',
    order: 10,
    enabledField: 'wf_comms',
    reviewerIdField: 'wf_comms_reviewer_id',
    workflowRole: 'COMMS',
  },
  {
    id: 'wf-social-media',
    displayName: 'Social Media Feedback',
    category: 'Feedback',
    order: 11,
    enabledField: 'wf_social_media',
    reviewerIdField: 'wf_social_media_reviewer_id',
    workflowRole: 'Social Media',
  },
  {
    id: 'rev-team-leader',
    displayName: 'Team Leader Review',
    category: 'Review',
    order: 12,
    enabledField: 'wf_team_leader_required',
    reviewerIdField: 'reviewer_team_leader_id',
    approvedField: 'reviewer_team_leader_approved',
    commentsField: 'reviewer_team_leader_comments',
    dateField: 'reviewer_team_leader_date',
    workflowRole: 'Team Leader Review',
  },
  {
    id: 'rev-head',
    displayName: 'Head Review',
    category: 'Review',
    order: 13,
    enabledField: 'wf_head_reviewer_required',
    reviewerIdField: 'reviewer_head_id',
    approvedField: 'reviewer_head_approved',
    commentsField: 'reviewer_head_comments',
    dateField: 'reviewer_head_date',
    workflowRole: 'Head Review',
  },
  {
    id: 'rev-cpo',
    displayName: 'CPO Review',
    category: 'Review',
    order: 14,
    enabledField: 'wf_cpo_reviewer_required',
    reviewerIdField: 'reviewer_cpo_id',
    approvedField: 'reviewer_cpo_approved',
    commentsField: 'reviewer_cpo_comments',
    dateField: 'reviewer_cpo_date',
    workflowRole: 'CPO Review',
  },
  {
    id: 'app-head',
    displayName: 'Head Approval',
    category: 'Approval',
    order: 15,
    enabledField: 'wf_head_approver_required',
    reviewerIdField: 'approver_head_id',
    approvedField: 'approver_head_approved',
    commentsField: 'approver_head_comments',
    dateField: 'approver_head_date',
    workflowRole: 'Head Approval',
  },
  {
    id: 'app-cpo',
    displayName: 'CPO Approval',
    category: 'Approval',
    order: 16,
    enabledField: 'wf_cpo_approver_required',
    reviewerIdField: 'approver_cpo_id',
    approvedField: 'approver_cpo_approved',
    commentsField: 'approver_cpo_comments',
    dateField: 'approver_cpo_date',
    workflowRole: 'CPO Approval',
  },
  {
    id: 'app-sg',
    displayName: 'SG Approval',
    category: 'Approval',
    order: 17,
    enabledField: 'wf_sg_approver_required',
    reviewerIdField: 'approver_sg_id',
    approvedField: 'approver_sg_approved',
    commentsField: 'approver_sg_comments',
    dateField: 'approver_sg_date',
    workflowRole: 'SG Approval',
  },
]

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Completed':
      return 'bg-[#166534] text-white border-[#166534]'
    case 'Approved':
      return 'bg-[#10b981] text-white border-[#10b981]'
    case 'In Progress':
      return 'bg-[#3b82f6] text-white border-[#3b82f6]'
    case 'Pending':
      return 'bg-[#991B1B] text-white border-[#991B1B]'
    case 'Rejected':
      return 'bg-[#991B1B] text-white border-[#991B1B]'
    case 'Skipped':
      return 'bg-[#c4b5fd] text-purple-900 border-[#c4b5fd]'
    default:
      return 'bg-[#991B1B] text-white border-[#991B1B]'
  }
}

export interface WorkflowStepStatusStyle {
  card: string
  badge: string
}

export function getWorkflowStepStatusStyles(
  status: string | null | undefined,
): WorkflowStepStatusStyle {
  const normalized = status?.toLowerCase().trim() ?? ''

  if (['completed', 'complete', 'approved', 'done'].includes(normalized)) {
    return {
      card: 'bg-[#DCFCE7] border-[#86EFAC] text-[#166534]',
      badge: 'bg-[#86EFAC]/60 text-[#166534] border-[#86EFAC]',
    }
  }

  if (['in progress', 'in-progress', 'inprogress'].includes(normalized)) {
    return {
      card: 'bg-[#DBEAFE] border-[#93C5FD] text-[#1E3A8A]',
      badge: 'bg-[#93C5FD]/60 text-[#1E3A8A] border-[#93C5FD]',
    }
  }

  return {
    card: 'bg-[#FEE2E2] border-[#FCA5A5] text-[#991B1B]',
    badge: 'bg-[#FCA5A5]/60 text-[#991B1B] border-[#FCA5A5]',
  }
}

export function getStatusIcon(status: string): ReactNode {
  switch (status) {
    case 'Completed':
      return <CheckCircle2 className="w-4 h-4 text-[#166534]" />
    case 'Approved':
      return <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
    case 'In Progress':
      return <PlayCircle className="w-4 h-4 text-[#1E3A8A]" />
    case 'Pending':
      return <Clock className="w-4 h-4 text-[#991B1B]" />
    case 'Rejected':
      return <XCircle className="w-4 h-4 text-[#991B1B]" />
    case 'Skipped':
      return <SkipForward className="w-4 h-4 text-[#c4b5fd]" />
    default:
      return <Clock className="w-4 h-4 text-[#991B1B]" />
  }
}

export function formatDate(dateStr: string | null, pattern = 'MMM d, yyyy HH:mm'): string {
  if (!dateStr) return ''
  try {
    return format(new Date(dateStr), pattern)
  } catch {
    return dateStr
  }
}
