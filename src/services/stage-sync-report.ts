import { supabase } from '@/lib/supabase/client'

export interface MismatchReportItem {
  id: string
  task_number: string | null
  activity_name: string
  status: string | null
  current_stage: string | null
  proposed_stage: string
}

export async function fetchMismatchedActivities(): Promise<MismatchReportItem[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('id, task_number, activity_name, status, current_stage')
    .eq('status', 'Done')
    .neq('current_stage', 'Done')
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []).map((a) => ({
    id: a.id,
    task_number: a.task_number,
    activity_name: a.activity_name || 'Untitled',
    status: a.status,
    current_stage: a.current_stage,
    proposed_stage: 'Done',
  }))
}
