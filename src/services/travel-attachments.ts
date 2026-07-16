import { supabase } from '@/lib/supabase/client'

export interface TravelAttachment {
  id: string
  travel_authorization_id: string
  file_path: string
  file_name: string
  file_type: string | null
  file_size: number | null
  document_type: string
  description: string | null
  uploaded_by: string | null
  created_at: string
  profiles?: { name: string | null } | null
}

export const DOCUMENT_TYPES = [
  'Flight Quote',
  'Invitation Letter',
  'Event Agenda',
  'Travel Agency Email',
  'Supporting Memo',
  'Other',
]

const SELECT_QUERY = '*, profiles:uploaded_by(name)'

export async function getTravelAttachments(
  travelAuthorizationId: string,
): Promise<TravelAttachment[]> {
  const { data, error } = await supabase
    .from('travel_authorization_attachments')
    .select(SELECT_QUERY)
    .eq('travel_authorization_id', travelAuthorizationId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []) as TravelAttachment[]
}

export async function createTravelAttachment(
  payload: Record<string, any>,
): Promise<TravelAttachment> {
  const { data, error } = await supabase
    .from('travel_authorization_attachments')
    .insert(payload)
    .select(SELECT_QUERY)
    .single()
  if (error) throw error
  return data as TravelAttachment
}

export async function updateTravelAttachment(
  id: string,
  updates: Record<string, any>,
): Promise<TravelAttachment> {
  const { data, error } = await supabase
    .from('travel_authorization_attachments')
    .update(updates)
    .eq('id', id)
    .select(SELECT_QUERY)
    .single()
  if (error) throw error
  return data as TravelAttachment
}

export async function deleteTravelAttachment(id: string): Promise<void> {
  const { error } = await supabase.from('travel_authorization_attachments').delete().eq('id', id)
  if (error) throw error
}

export async function uploadTravelFile(
  travelAuthorizationId: string,
  file: File,
): Promise<{ path: string; publicUrl: string }> {
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const filePath = `${travelAuthorizationId}/${Date.now()}_${safeName}`

  const { error: uploadError } = await supabase.storage
    .from('travel-attachments')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data: urlData } = supabase.storage.from('travel-attachments').getPublicUrl(filePath)

  return { path: filePath, publicUrl: urlData?.publicUrl || '' }
}

export async function removeTravelFile(filePath: string): Promise<void> {
  const { error } = await supabase.storage.from('travel-attachments').remove([filePath])
  if (error) throw error
}

export function getTravelFileUrl(filePath: string): string {
  const { data } = supabase.storage.from('travel-attachments').getPublicUrl(filePath)
  return data?.publicUrl || ''
}
