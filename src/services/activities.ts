import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

export type Activity = Database['public']['Tables']['activities']['Row']
export type ActivityUpdate = Database['public']['Tables']['activities']['Update']

export async function getActivities() {
  const { data, error } = await supabase
    .from('activities')
    .select(`
    *,
    project_owner:profiles!activities_project_owner_id_fkey(name),
    assignee:profiles!activities_assignee_id_fkey(name),
    programme:programmes(name),
    type:task_types(name),
    activity_budget_lines(*)
  `)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getActivity(id: string) {
  const { data, error } = await supabase
    .from('activities')
    .select(`
    *,
    project_owner:profiles!activities_project_owner_id_fkey(name),
    assignee:profiles!activities_assignee_id_fkey(name),
    programme:programmes(name),
    type:task_types(name),
    activity_budget_lines(*)
  `)
    .eq('id', id)
    .single()

  if (error) {
    const { data: numData, error: numError } = await supabase
      .from('activities')
      .select(`
      *,
      project_owner:profiles!activities_project_owner_id_fkey(name),
      assignee:profiles!activities_assignee_id_fkey(name),
      programme:programmes(name),
      type:task_types(name),
      activity_budget_lines(*)
    `)
      .eq('task_number', id)
      .single()
    if (numError) throw numError
    return numData
  }
  return data
}

export async function updateActivity(id: string, updates: ActivityUpdate) {
  const { data, error } = await supabase
    .from('activities')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function addActivityBudgetLine(activityId: string) {
  const { data, error } = await supabase
    .from('activity_budget_lines')
    .insert({ activity_id: activityId })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateActivityBudgetLine(id: string, updates: any) {
  const { data, error } = await supabase
    .from('activity_budget_lines')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function removeActivityBudgetLine(id: string) {
  const { error } = await supabase.from('activity_budget_lines').delete().eq('id', id)
  if (error) throw error
}
