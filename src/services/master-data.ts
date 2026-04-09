import { supabase } from '@/lib/supabase/client'

export async function getMasterData() {
  const [
    { data: profiles },
    { data: programmes },
    { data: taskTypes },
    { data: costCenters },
    { data: budgetLines },
    { data: workorders },
    { data: accounts },
  ] = await Promise.all([
    supabase.from('profiles').select('*').order('name'),
    supabase.from('programmes').select('*').order('name'),
    supabase.from('task_types').select('*').order('name'),
    supabase.from('cost_centers').select('*').order('name'),
    supabase.from('budget_lines').select('*').order('name'),
    supabase.from('workorders').select('*').order('name'),
    supabase.from('accounts').select('*').order('name'),
  ])

  return {
    profiles: profiles || [],
    programmes: programmes || [],
    taskTypes: taskTypes || [],
    costCenters: costCenters || [],
    budgetLines: budgetLines || [],
    workorders: workorders || [],
    accounts: accounts || [],
  }
}
