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

export interface FunctionalStaffingRow {
  id?: string
  delegation_package_id?: string
  functional_area: string
  is_required: boolean
  proposed_staff_count: number
  justification: string
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
const staffingTable = () => (supabase as any).from('travel_delegation_functional_staffing')

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

  const { data: staffing } = await staffingTable()
    .select('*')
    .eq('delegation_package_id', id)
    .order('created_at', { ascending: true })

  return { ...data, travelers: travelers || [], functional_staffing: staffing || [] }
}

export async function getDelegationTravelers(packageId: string): Promise<any[]> {
  const { data, error } = await travelersTable()
    .select('*, traveler:profiles!travel_delegation_travelers_traveler_id_fkey(name)')
    .eq('delegation_package_id', packageId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

export async function getFunctionalStaffing(packageId: string): Promise<FunctionalStaffingRow[]> {
  const { data, error } = await staffingTable()
    .select('*')
    .eq('delegation_package_id', packageId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data || []).map((r: any) => ({
    id: r.id,
    delegation_package_id: r.delegation_package_id,
    functional_area: r.functional_area || '',
    is_required: r.is_required ?? false,
    proposed_staff_count: r.proposed_staff_count ?? 0,
    justification: r.justification || '',
  }))
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

export async function replaceFunctionalStaffing(
  packageId: string,
  rows: FunctionalStaffingRow[],
): Promise<void> {
  const { error: delError } = await staffingTable().delete().eq('delegation_package_id', packageId)
  if (delError) throw delError

  if (rows.length === 0) return

  const insertRows = rows.map((r) => ({
    delegation_package_id: packageId,
    functional_area: r.functional_area || null,
    is_required: r.is_required ?? false,
    proposed_staff_count: r.proposed_staff_count ?? 0,
    justification: r.justification || null,
  }))

  const { error: insError } = await staffingTable().insert(insertRows)
  if (insError) throw insError
}
