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
    type:task_types(name)
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
    type:task_types(name)
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
      type:task_types(name)
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
