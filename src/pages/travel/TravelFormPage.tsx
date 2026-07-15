import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { getMasterData } from '@/services/master-data'
import { getActivities, getActivity } from '@/services/activities'
import {
  getTravelAuthorization,
  createTravelAuthorization,
  updateTravelAuthorization,
  fromDateInput,
  toDateInput,
  TravelAuthorization,
} from '@/services/travel'
import { TripDetailsSection } from './components/TripDetailsSection'
import { TravelPart1Fields } from './components/TravelPart1Fields'

export default function TravelFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const isEdit = !!id

  const [formData, setFormData] = useState<Record<string, any>>({
    travel_type: '',
    traveler_id: user?.id || '',
    destination: '',
    travel_start_date: '',
    travel_end_date: '',
    mission_title_or_event_name: '',
    programme_id: '',
    linked_activity_id: null,
    reason_for_travel: '',
    event_organizer_or_title: '',
    official_purpose_full_absence: null,
    private_stay_dates: '',
    tickets_provided_by_kaiciid: null,
    other_kaiciid_colleagues_travelling: null,
    colleagues_names: '',
    accommodation_free: '',
    accommodation_free_details: '',
    meals_free: '',
    meals_free_details: '',
    lisbon_airport_transfer_free: null,
    destination_transfer_free: null,
    budget_line: '',
    account: '',
    traveler_confirmation: false,
  })
  const [masterData, setMasterData] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([getMasterData(), getActivities()])
      .then(([md, acts]) => {
        setMasterData(md)
        setActivities(acts)
      })
      .catch(console.error)

    if (id) {
      getTravelAuthorization(id)
        .then((ta: TravelAuthorization) => {
          setFormData((prev) => ({
            ...prev,
            ...ta,
            travel_start_date: toDateInput(ta.travel_start_date),
            travel_end_date: toDateInput(ta.travel_end_date),
          }))
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [id])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleActivityLink = async (val: string) => {
    const activityId = val === 'none' ? null : val
    handleChange('linked_activity_id', activityId)
    if (!activityId) return
    try {
      const activity = await getActivity(activityId)
      if (activity.programme_id) handleChange('programme_id', activity.programme_id)
      if (activity.activity_name)
        handleChange('mission_title_or_event_name', activity.activity_name)
      if (activity.event_location) handleChange('destination', activity.event_location)
      if (activity.start_date) handleChange('travel_start_date', activity.start_date)
      if (activity.end_date) handleChange('travel_end_date', activity.end_date)
    } catch (e) {
      console.error('Error fetching activity:', e)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload: Partial<TravelAuthorization> = {
        ...formData,
        travel_start_date: fromDateInput(formData.travel_start_date),
        travel_end_date: fromDateInput(formData.travel_end_date),
        status: 'Draft',
        current_stage: 'Draft / Part 1',
        requester_id: user?.id,
      }
      if (isEdit && id) {
        await updateTravelAuthorization(id, payload)
      } else {
        await createTravelAuthorization(payload)
      }
      toast({ title: 'Travel authorization saved as draft' })
      navigate('/travel')
    } catch (e) {
      console.error(e)
      toast({ title: 'Error saving travel authorization', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const isHomeLeave = formData.travel_type === 'Home Leave'

  if (loading) {
    return (
      <div className="p-6 flex justify-center text-muted-foreground">
        Loading travel authorization...
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/travel')} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight">
          {isEdit ? 'Edit Travel Authorization' : 'New Travel Authorization'}
        </h1>
        {formData.travel_authorization_number && (
          <Badge variant="outline" className="ml-2 font-mono">
            {formData.travel_authorization_number}
          </Badge>
        )}
      </div>

      {masterData && (
        <TripDetailsSection
          formData={formData}
          onChange={handleChange}
          masterData={masterData}
          activities={activities}
          onActivityLink={handleActivityLink}
        />
      )}

      {formData.travel_type && (
        <TravelPart1Fields formData={formData} onChange={handleChange} isHomeLeave={isHomeLeave} />
      )}

      <div className="flex gap-3 justify-end pb-6">
        <Button variant="outline" onClick={() => navigate('/travel')}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Draft'}
        </Button>
      </div>
    </div>
  )
}
