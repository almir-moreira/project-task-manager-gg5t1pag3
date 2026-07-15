import { supabase } from '@/lib/supabase/client'

export const TRAVEL_TYPES = [
  'Event delegation',
  'Individual official mission',
  'Home Leave',
  'Other travel',
] as const

export interface TravelAuthorization {
  id?: string
  travel_authorization_number?: string | null
  travel_type?: string | null
  linked_activity_id?: string | null
  programme_id?: string | null
  traveler_id?: string | null
  requester_id?: string | null
  pm_verifier_id?: string | null
  mission_title_or_event_name?: string | null
  destination?: string | null
  travel_start_date?: string | null
  travel_end_date?: string | null
  status?: string | null
  current_stage?: string | null
  reason_for_travel?: string | null
  event_organizer_or_title?: string | null
  official_purpose_full_absence?: boolean | null
  private_stay_dates?: string | null
  tickets_provided_by_kaiciid?: boolean | null
  other_kaiciid_colleagues_travelling?: boolean | null
  colleagues_names?: string | null
  accommodation_free?: string | null
  accommodation_free_details?: string | null
  meals_free?: string | null
  meals_free_details?: string | null
  lisbon_airport_transfer_free?: boolean | null
  destination_transfer_free?: boolean | null
  budget_line?: string | null
  account?: string | null
  traveler_confirmation?: boolean | null
  pm_verification_status?: string | null
  pm_verification_comments?: string | null
}

export function toDateInput(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function fromDateInput(dateStr: string): string | null {
  if (!dateStr) return null
  return new Date(dateStr + 'T00:00:00').toISOString()
}

export async function getTravelAuthorization(id: string): Promise<TravelAuthorization> {
  const { data, error } = await supabase
    .from('travel_authorizations')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as TravelAuthorization
}

export async function createTravelAuthorization(
  data: Partial<TravelAuthorization>,
): Promise<TravelAuthorization> {
  const { data: result, error } = await supabase
    .from('travel_authorizations')
    .insert({
      ...data,
      status: 'Draft',
      current_stage: 'Draft / Part 1',
    })
    .select()
    .single()
  if (error) throw error
  return result as TravelAuthorization
}

export async function updateTravelAuthorization(
  id: string,
  data: Partial<TravelAuthorization>,
): Promise<TravelAuthorization> {
  const { data: result, error } = await supabase
    .from('travel_authorizations')
    .update({
      ...data,
      status: 'Draft',
      current_stage: 'Draft / Part 1',
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return result as TravelAuthorization
}
