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
  getDelegationPackage,
  createDelegationPackage,
  updateDelegationPackage,
  replaceDelegationTravelers,
  type DelegationPackage,
  type DelegationTraveler,
} from '@/services/delegations'
import { DelegationEventDetailsSection } from './components/DelegationEventDetailsSection'
import { DelegationTravelersSection } from './components/DelegationTravelersSection'

export default function DelegationFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const isEdit = !!id

  const [formData, setFormData] = useState<Record<string, any>>({
    linked_activity_id: null,
    event_title: '',
    event_type: '',
    event_dates: '',
    location: '',
    programme_id: '',
    project_id: '',
    event_lead_id: '',
    status: 'Draft',
    current_stage: 'Delegation Proposal',
    estimated_number_of_participants: null,
    estimated_number_of_virtual_participants: null,
    estimated_event_budget: null,
    benchmark_category: '',
    benchmark_range: '',
    total_proposed_travelers: 0,
    justification_if_above_benchmark: '',
  })
  const [travelers, setTravelers] = useState<DelegationTraveler[]>([])
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
      getDelegationPackage(id)
        .then((pkg: any) => {
          setFormData((prev) => ({
            ...prev,
            linked_activity_id: pkg.linked_activity_id,
            event_title: pkg.event_title || '',
            event_type: pkg.event_type || '',
            event_dates: pkg.event_dates || '',
            location: pkg.location || '',
            programme_id: pkg.programme_id || '',
            project_id: pkg.project_id || '',
            event_lead_id: pkg.event_lead_id || '',
            status: pkg.status || 'Draft',
            current_stage: pkg.current_stage || 'Delegation Proposal',
            estimated_number_of_participants: pkg.estimated_number_of_participants,
            estimated_number_of_virtual_participants: pkg.estimated_number_of_virtual_participants,
            estimated_event_budget: pkg.estimated_event_budget,
            benchmark_category: pkg.benchmark_category || '',
            benchmark_range: pkg.benchmark_range || '',
            total_proposed_travelers: pkg.total_proposed_travelers || 0,
            justification_if_above_benchmark: pkg.justification_if_above_benchmark || '',
            delegation_package_number: pkg.delegation_package_number,
          }))
          const loadedTravelers: DelegationTraveler[] = (pkg.travelers || []).map((t: any) => ({
            id: t.id,
            delegation_package_id: t.delegation_package_id,
            traveler_id: t.traveler_id,
            proposed_role_or_function: t.proposed_role_or_function || '',
            functional_area: t.functional_area || '',
            physical_presence_justification: t.physical_presence_justification || '',
            remote_participation_possible: t.remote_participation_possible ?? false,
            local_support_possible: t.local_support_possible ?? false,
            status: t.status || 'Proposed',
            comments: t.comments || '',
          }))
          setTravelers(loadedTravelers)
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
      const prefillData: Record<string, any> = {
        event_title: activity.activity_name || '',
        programme_id: activity.programme_id || '',
        project_id: activity.project_id || '',
        location: activity.event_location || '',
        event_lead_id: activity.project_owner_id || '',
        estimated_number_of_participants: activity.event_participants_count || null,
      }
      if (activity.start_date && activity.end_date) {
        prefillData.event_dates = `${activity.start_date} – ${activity.end_date}`
      }
      const hasExistingValues = (Object.keys(prefillData) as string[]).some(
        (key) =>
          formData[key] &&
          formData[key] !== '' &&
          formData[key] !== null &&
          key !== 'linked_activity_id',
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

  const UUID_FIELDS = ['linked_activity_id', 'programme_id', 'project_id', 'event_lead_id']

  const cleanPayload = (data: Record<string, any>): Record<string, any> => {
    const cleaned: Record<string, any> = {}
    const EXCLUDED_FIELDS = [
      'id',
      'created_at',
      'updated_at',
      'delegation_package_number',
      'linked_activity',
      'programme',
      'project',
      'event_lead',
      'travelers',
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
      const payload = {
        ...cleanPayload({
          ...formData,
          total_proposed_travelers: travelers.length,
          created_by: user?.id,
        }),
        status: 'Draft',
        current_stage: 'Delegation Proposal',
      }

      let packageId: string
      if (isEdit && id) {
        const updated = await updateDelegationPackage(id, payload)
        packageId = updated.id
      } else {
        const created = await createDelegationPackage(payload)
        packageId = created.id
      }

      await replaceDelegationTravelers(packageId, travelers)

      toast({ title: 'Delegation proposal saved successfully' })
      navigate('/travel/delegations')
    } catch (e: any) {
      console.error('Error saving delegation:', e)
      toast({
        title: 'Error saving delegation proposal',
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
        Loading delegation proposal...
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/travel/delegations')}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight">
          {isEdit ? 'Edit Delegation Proposal' : 'New Delegation Proposal'}
        </h1>
        {formData.delegation_package_number && (
          <Badge variant="outline" className="ml-2 font-mono">
            {formData.delegation_package_number}
          </Badge>
        )}
      </div>

      {masterData && (
        <DelegationEventDetailsSection
          formData={formData}
          onChange={handleChange}
          masterData={masterData}
          activities={activities}
          onActivityLink={handleActivityLink}
        />
      )}

      {masterData && (
        <DelegationTravelersSection
          travelers={travelers}
          profiles={masterData.profiles || []}
          onChange={setTravelers}
        />
      )}

      <div className="flex gap-3 justify-end pb-6">
        <Button variant="outline" onClick={() => navigate('/travel/delegations')}>
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
              Linking this activity will overwrite the existing Event Title, Programme, Project,
              Location, Event Lead, and Estimated Participants with values from the selected
              activity. Do you want to continue?
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
