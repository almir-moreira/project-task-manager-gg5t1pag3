import { supabase } from '@/lib/supabase/client'

const WORKFLOW_ROLES = [
  'Team Leader Review',
  'Head Review',
  'CPO Review',
  'Head Approval',
  'CPO Approval',
  'SG Approval',
]

export async function getWorkflowConfigs() {
  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .in('role', WORKFLOW_ROLES)
    .order('stage', { ascending: true })
    .order('step', { ascending: true })
  if (error) throw error
  return data
}

export async function getActivityWorkflows(activityId: string) {
  const { data, error } = await supabase
    .from('activity_workflows')
    .select(`
      *,
      workflow:workflows(*),
      reviewer:profiles!activity_workflows_reviewer_id_fkey(name)
    `)
    .eq('activity_id', activityId)
  if (error) throw error
  return data || []
}

export async function upsertActivityWorkflow(
  activityId: string,
  workflowId: string,
  reviewerId?: string | null,
) {
  const { data, error } = await supabase
    .from('activity_workflows')
    .upsert(
      { activity_id: activityId, workflow_id: workflowId, reviewer_id: reviewerId || null },
      { onConflict: 'activity_id,workflow_id' },
    )
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteActivityWorkflow(activityId: string, workflowId: string) {
  const { error } = await supabase
    .from('activity_workflows')
    .delete()
    .eq('activity_id', activityId)
    .eq('workflow_id', workflowId)
  if (error) throw error
}

export async function updateActivityWorkflowFields(
  activityId: string,
  workflowId: string,
  updates: {
    status?: string
    comments?: string
    completed_at?: string | null
    reviewer_id?: string | null
  },
) {
  const { data, error } = await supabase
    .from('activity_workflows')
    .upsert(
      { activity_id: activityId, workflow_id: workflowId, ...updates },
      { onConflict: 'activity_id,workflow_id' },
    )
    .select()
    .single()
  if (error) throw error
  return data
}
