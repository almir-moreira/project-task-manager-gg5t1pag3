import { supabase } from '@/lib/supabase/client'

export interface TravelAuthorization {
  id: string
  travel_authorization_number: string | null
  travel_type: string | null
  linked_activity_id: string | null
  programme_id: string | null
  traveler_id: string | null
  requester_id: string | null
  pm_verifier_id: string | null
  mission_title_or_event_name: string | null
  destination: string | null
  travel_start_date: string | null
  travel_end_date: string | null
  status: string | null
  current_stage: string | null
  reason_for_travel: string | null
  reason_for_travel_option: string | null
  reason_for_travel_other_details: string | null
  purpose_justification: string | null
  cost_center_id: string | null
  work_order_id: string | null
  account_id: string | null
  account: string | null
  budget_line: string | null
  event_organizer_or_title: string | null
  official_purpose_full_absence: boolean | null
  private_stay_dates: string | null
  tickets_provided_by_kaiciid: boolean | null
  other_kaiciid_colleagues_travelling: boolean | null
  colleagues_names: string | null
  accommodation_free: string | null
  accommodation_free_details: string | null
  meals_free: string | null
  meals_free_details: string | null
  lisbon_airport_transfer_free: boolean | null
  destination_transfer_free: boolean | null
  traveler_confirmation: boolean | null
  pm_verification_status: string | null
  pm_verification_comments: string | null
  created_at: string | null
  updated_at: string | null
}

const SELECT_RELATIONS = `
  *,
  traveler:profiles!travel_authorizations_traveler_id_fkey(name),
  requester:profiles!travel_authorizations_requester_id_fkey(name),
  pm_verifier:profiles!travel_authorizations_pm_verifier_id_fkey(name),
  programme:programmes(name),
  linked_activity:activities(activity_name, task_number)
`

const table = () => (supabase as any).from('travel_authorizations')

export async function getTravelAuthorizations(): Promise<any[]> {
  const { data, error } = await table()
    .select(SELECT_RELATIONS)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getTravelAuthorization(id: string): Promise<any> {
  const { data, error } = await table().select(SELECT_RELATIONS).eq('id', id).single()
  if (error) throw error
  return data
}

export async function createTravelAuthorization(payload: Record<string, any>): Promise<any> {
  const { data, error } = await table().insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updateTravelAuthorization(
  id: string,
  updates: Record<string, any>,
): Promise<any> {
  const { data, error } = await table().update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}
