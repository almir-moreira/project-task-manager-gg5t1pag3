import { supabase } from '@/lib/supabase/client'

export interface DelegationTraveler {
  id?: string
  delegation_package_id?: string
  traveler_id: string | null
  proposed_role_or_function: string
  functional_area: string
  physical_presence_justification: string
  remote_participation_possible: boolean
  local_support_possible: boolean
  status: string
  comments: string
}

export interface DelegationPackage {
  id?: string
  delegation_package_number?: string | null
  linked_activity_id: string | null
  event_title: string
  event_type: string
  event_dates: string
  location: string
  programme_id: string | null
  project_id: string | null
  event_lead_id: string | null
  status: string
  current_stage: string
  estimated_number_of_participants: number | null
  estimated_number_of_virtual_participants: number | null
  estimated_event_budget: number | null
  benchmark_category: string
  benchmark_range: string
  total_proposed_travelers: number
  justification_if_above_benchmark: string
}

const SELECT_RELATIONS = `
  *,
  linked_activity:activities(activity_name, task_number),
  programme:programmes(name),
  project:projects(name),
  event_lead:profiles!travel_delegation_packages_event_lead_id_fkey(name)
`

const table = () => (supabase as any).from('travel_delegation_packages')
const travelersTable = () => (supabase as any).from('travel_delegation_travelers')

export async function getDelegationPackages(): Promise<any[]> {
  const { data, error } = await table()
    .select(SELECT_RELATIONS)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getDelegationPackage(id: string): Promise<any> {
  const { data, error } = await table().select(SELECT_RELATIONS).eq('id', id).single()
  if (error) throw error

  const { data: travelers } = await travelersTable()
    .select('*, traveler:profiles!travel_delegation_travelers_traveler_id_fkey(name)')
    .eq('delegation_package_id', id)
    .order('created_at', { ascending: true })

  return { ...data, travelers: travelers || [] }
}

export async function getDelegationTravelers(packageId: string): Promise<any[]> {
  const { data, error } = await travelersTable()
    .select('*, traveler:profiles!travel_delegation_travelers_traveler_id_fkey(name)')
    .eq('delegation_package_id', packageId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createDelegationPackage(payload: Record<string, any>): Promise<any> {
  const { data, error } = await table().insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updateDelegationPackage(
  id: string,
  updates: Record<string, any>,
): Promise<any> {
  const { data, error } = await table().update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function replaceDelegationTravelers(
  packageId: string,
  travelers: DelegationTraveler[],
): Promise<void> {
  const { error: delError } = await travelersTable().delete().eq('delegation_package_id', packageId)
  if (delError) throw delError

  if (travelers.length === 0) return

  const rows = travelers.map((t) => ({
    delegation_package_id: packageId,
    traveler_id: t.traveler_id || null,
    proposed_role_or_function: t.proposed_role_or_function || null,
    functional_area: t.functional_area || null,
    physical_presence_justification: t.physical_presence_justification || null,
    remote_participation_possible: t.remote_participation_possible ?? false,
    local_support_possible: t.local_support_possible ?? false,
    status: t.status || null,
    comments: t.comments || null,
  }))

  const { error: insError } = await travelersTable().insert(rows)
  if (insError) throw insError
}
