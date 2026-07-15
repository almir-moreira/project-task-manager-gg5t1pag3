import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
    requester_id: user?.id || '',
    destination: '',
    travel_start_date: '',
    travel_end_date: '',
    mission_title_or_event_name: '',
    programme_id: '',
    linked_activity_id: null,
    reason_for_travel: '',
    reason_for_travel_option: '',
    reason_for_travel_other_details: '',
    purpose_justification: '',
    cost_center_id: '',
    work_order_id: '',
    account_id: '',
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
  const [pendingPrefill, setPendingPrefill] = useState<Record<string, any> | null>(null)
  const [showPrefillDialog, setShowPrefillDialog] = useState(false)

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

  const isHomeLeave = formData.travel_type === 'Home Leave'

  useEffect(() => {
    if (isHomeLeave && !formData.reason_for_travel_option) {
      setFormData((prev) => ({ ...prev, reason_for_travel_option: 'Home Leave' }))
    }
  }, [isHomeLeave, formData.reason_for_travel_option])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleActivityLink = async (val: string) => {
    const activityId = val === 'none' ? null : val
    handleChange('linked_activity_id', activityId)
    if (!activityId) return
    try {
      const activity = await getActivity(activityId)
      const prefillData: Record<string, any> = {
        programme_id: activity.programme_id || '',
        mission_title_or_event_name: activity.activity_name || '',
        destination: activity.event_location || '',
        travel_start_date: activity.start_date || '',
        travel_end_date: activity.end_date || '',
      }
      const hasExistingValues = (Object.keys(prefillData) as string[]).some(
        (key) => formData[key] && formData[key] !== '' && formData[key] !== null,
      )
      if (hasExistingValues) {
        setPendingPrefill(prefillData)
        setShowPrefillDialog(true)
      } else {
        Object.entries(prefillData).forEach(([key, value]) => {
          if (value) handleChange(key, value)
        })
      }
    } catch (e) {
      console.error('Error fetching activity:', e)
    }
  }

  const confirmPrefill = () => {
    if (pendingPrefill) {
      Object.entries(pendingPrefill).forEach(([key, value]) => {
        if (value) handleChange(key, value)
      })
    }
    setShowPrefillDialog(false)
    setPendingPrefill(null)
  }

  const UUID_FIELDS = [
    'traveler_id',
    'requester_id',
    'pm_verifier_id',
    'programme_id',
    'linked_activity_id',
    'cost_center_id',
    'work_order_id',
    'account_id',
  ]

  const cleanPayload = (data: Record<string, any>): Record<string, any> => {
    const cleaned: Record<string, any> = {}
    const EXCLUDED_FIELDS = [
      'id',
      'created_at',
      'updated_at',
      'travel_authorization_number',
      'traveler',
      'requester',
      'pm_verifier',
      'programme',
      'linked_activity',
    ]

    for (const [key, value] of Object.entries(data)) {
      if (EXCLUDED_FIELDS.includes(key)) continue

      if (UUID_FIELDS.includes(key)) {
        cleaned[key] = value && value !== '' && value !== 'none' ? value : null
      } else if (value === '') {
        cleaned[key] = null
      } else {
        cleaned[key] = value
      }
    }
    return cleaned
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload: Partial<TravelAuthorization> = cleanPayload({
        ...formData,
        travel_start_date: fromDateInput(formData.travel_start_date),
        travel_end_date: fromDateInput(formData.travel_end_date),
        status: 'Draft',
        current_stage: 'Draft / Part 1',
        requester_id: formData.requester_id || user?.id,
      })
      if (isEdit && id) {
        await updateTravelAuthorization(id, payload)
      } else {
        await createTravelAuthorization(payload)
      }
      toast({ title: 'Travel authorization saved successfully', variant: 'default' })
      navigate('/travel')
    } catch (e: any) {
      console.error('Error saving TA:', e)
      toast({
        title: 'Error saving travel authorization',
        description: e?.message || 'Please check the form for invalid data',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

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
          isHomeLeave={isHomeLeave}
        />
      )}

      {formData.travel_type && (
        <TravelPart1Fields
          formData={formData}
          onChange={handleChange}
          isHomeLeave={isHomeLeave}
          masterData={masterData}
        />
      )}

      <div className="flex gap-3 justify-end pb-6">
        <Button variant="outline" onClick={() => navigate('/travel')}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Draft'}
        </Button>
      </div>

      <AlertDialog open={showPrefillDialog} onOpenChange={setShowPrefillDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Overwrite existing values?</AlertDialogTitle>
            <AlertDialogDescription>
              Linking this activity will overwrite the existing Programme, Mission Title,
              Destination, and Dates with values from the selected activity. Do you want to
              continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPrefill}>Overwrite</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
