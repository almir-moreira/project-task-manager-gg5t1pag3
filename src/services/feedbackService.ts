import { supabase } from '@/lib/supabase/client'

export type FeedbackUnitKey =
  | 'partnerships'
  | 'relex'
  | 'legal'
  | 'governing_bodies'
  | 'protocol'
  | 'ems'
  | 'procurement'
  | 'technology'
  | 'm_and_e'
  | 'communications'
  | 'social_media'

export interface FeedbackUnitConfig {
  key: FeedbackUnitKey
  label: string
  workflowRole: string
  enabledField: string
  reviewerIdField: string
  order: number
}

export type FeedbackStatus = 'Not Included' | 'Pending' | 'In Progress' | 'Completed'

export const FEEDBACK_UNITS_CONFIG: FeedbackUnitConfig[] = [
  {
    key: 'partnerships',
    label: 'Partnerships',
    workflowRole: 'Partnerships',
    enabledField: 'wf_partnerships',
    reviewerIdField: 'wf_partnerships_reviewer_id',
    order: 1,
  },
  {
    key: 'relex',
    label: 'RELEX',
    workflowRole: 'Relex',
    enabledField: 'wf_relex',
    reviewerIdField: 'wf_relex_reviewer_id',
    order: 2,
  },
  {
    key: 'legal',
    label: 'Legal',
    workflowRole: 'Legal',
    enabledField: 'wf_legal',
    reviewerIdField: 'wf_legal_reviewer_id',
    order: 3,
  },
  {
    key: 'governing_bodies',
    label: 'Governing Bodies',
    workflowRole: 'Governing Bodies',
    enabledField: 'wf_gob',
    reviewerIdField: 'wf_gob_reviewer_id',
    order: 4,
  },
  {
    key: 'protocol',
    label: 'Protocol',
    workflowRole: 'Protocol',
    enabledField: 'wf_protocol',
    reviewerIdField: 'wf_protocol_reviewer_id',
    order: 5,
  },
  {
    key: 'ems',
    label: 'EMS',
    workflowRole: 'EMS',
    enabledField: 'wf_ems',
    reviewerIdField: 'wf_ems_reviewer_id',
    order: 6,
  },
  {
    key: 'procurement',
    label: 'Procurement',
    workflowRole: 'Procurement',
    enabledField: 'wf_procurement',
    reviewerIdField: 'wf_procurement_reviewer_id',
    order: 7,
  },
  {
    key: 'technology',
    label: 'Technology',
    workflowRole: 'Technology',
    enabledField: 'wf_technology',
    reviewerIdField: 'wf_technology_reviewer_id',
    order: 8,
  },
  {
    key: 'm_and_e',
    label: 'M&E',
    workflowRole: 'M&E',
    enabledField: 'wf_mne',
    reviewerIdField: 'wf_mne_reviewer_id',
    order: 9,
  },
  {
    key: 'communications',
    label: 'Communications',
    workflowRole: 'COMMS',
    enabledField: 'wf_comms',
    reviewerIdField: 'wf_comms_reviewer_id',
    order: 10,
  },
  {
    key: 'social_media',
    label: 'Social Media',
    workflowRole: 'Social Media',
    enabledField: 'wf_social_media',
    reviewerIdField: 'wf_social_media_reviewer_id',
    order: 11,
  },
]

export const FEEDBACK_DB_FIELD_MAP: Record<
  FeedbackUnitKey,
  {
    enabledField: string
    reviewerIdField: string
    workflowRole: string
  }
> = FEEDBACK_UNITS_CONFIG.reduce(
  (acc, u) => {
    acc[u.key] = {
      enabledField: u.enabledField,
      reviewerIdField: u.reviewerIdField,
      workflowRole: u.workflowRole,
    }
    return acc
  },
  {} as Record<
    FeedbackUnitKey,
    { enabledField: string; reviewerIdField: string; workflowRole: string }
  >,
)

export function computeFeedbackStatus(
  enabled: boolean,
  reviewerId: string | null,
  text: string,
  date: string,
): FeedbackStatus {
  if (!enabled) return 'Not Included'
  const hasText = !!text?.trim()
  const hasDate = !!date
  if (hasText && hasDate) return 'Completed'
  if (reviewerId || hasText || hasDate) return 'In Progress'
  return 'Pending'
}

export async function fetchFeedbackWorkflowDefs(): Promise<Map<string, string>> {
  const roles = FEEDBACK_UNITS_CONFIG.map((u) => u.workflowRole)
  const { data, error } = await supabase
    .from('workflows')
    .select('id, role')
    .is('activity_id', null)
    .in('role', roles)
  if (error || !data) return new Map()
  const map = new Map<string, string>()
  for (const wf of data) {
    if (wf.role) map.set(wf.role, wf.id)
  }
  return map
}

export async function fetchActivityWorkflows(activityId: string): Promise<Record<string, any>> {
  const { data, error } = await supabase
    .from('activity_workflows')
    .select('*')
    .eq('activity_id', activityId)
  if (error || !data) return {}
  const map: Record<string, any> = {}
  for (const aw of data) {
    map[aw.workflow_id] = aw
  }
  return map
}

export async function ensureActivityWorkflow(
  activityId: string,
  workflowId: string,
  reviewerId?: string | null,
): Promise<any> {
  const { data: existing } = await supabase
    .from('activity_workflows')
    .select('*')
    .eq('activity_id', activityId)
    .eq('workflow_id', workflowId)
    .maybeSingle()
  if (existing) return existing

  const { data, error } = await supabase
    .from('activity_workflows')
    .insert({
      activity_id: activityId,
      workflow_id: workflowId,
      reviewer_id: reviewerId || null,
      status: 'Pending',
    })
    .select()
    .single()
  if (error) {
    const { data: retry } = await supabase
      .from('activity_workflows')
      .select('*')
      .eq('activity_id', activityId)
      .eq('workflow_id', workflowId)
      .maybeSingle()
    if (retry) return retry
    throw error
  }
  return data
}

export async function saveFeedbackFields(
  activityId: string,
  workflowId: string,
  fields: {
    comments?: string
    completed_at?: string | null
    reviewer_id?: string | null
    status?: string
  },
): Promise<any> {
  await ensureActivityWorkflow(activityId, workflowId, fields.reviewer_id)
  const { data, error } = await supabase
    .from('activity_workflows')
    .update(fields)
    .eq('activity_id', activityId)
    .eq('workflow_id', workflowId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function removeActivityWorkflow(
  activityId: string,
  workflowId: string,
): Promise<void> {
  const { error } = await supabase
    .from('activity_workflows')
    .delete()
    .eq('activity_id', activityId)
    .eq('workflow_id', workflowId)
  if (error) throw error
}

export async function ensureWorkflowDefinition(role: string): Promise<string | null> {
  const { data: existing } = await supabase
    .from('workflows')
    .select('id')
    .eq('role', role)
    .is('activity_id', null)
    .maybeSingle()
  if (existing) return existing.id

  const { data, error } = await supabase
    .from('workflows')
    .insert({ role, stage: 1, step: 1, category: 'Feedback', activity_id: null })
    .select('id')
    .single()
  if (error) {
    const { data: retry } = await supabase
      .from('workflows')
      .select('id')
      .eq('role', role)
      .is('activity_id', null)
      .maybeSingle()
    return retry?.id ?? null
  }
  return data.id
}
