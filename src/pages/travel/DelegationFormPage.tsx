import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
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
import { usePermissions } from '@/hooks/use-permissions'
import { isAdmin } from '@/lib/permissions'
import { useToast } from '@/hooks/use-toast'
import { getMasterData } from '@/services/master-data'
import { getActivities, getActivity } from '@/services/activities'
import {
  getDelegationPackage,
  createDelegationPackage,
  updateDelegationPackage,
  replaceDelegationTravelers,
  replaceFunctionalStaffing,
  getConsultations,
  submitDelegationForConsultation,
  updateConsultation,
  type DelegationPackage,
  type DelegationTraveler,
  type FunctionalStaffingRow,
} from '@/services/delegations'
import { DelegationEventDetailsSection } from './components/DelegationEventDetailsSection'
import { DelegationTravelersSection } from './components/DelegationTravelersSection'
import { DelegationSopEvaluationSection } from './components/DelegationSopEvaluationSection'

const SOP_FIELDS = [
  'complexity_parallel_sessions',
  'complexity_parallel_sessions_comments',
  'complexity_venues',
  'complexity_venues_comments',
  'complexity_site_visits',
  'complexity_site_visits_comments',
  'complexity_vip_participation',
  'complexity_vip_participation_comments',
  'complexity_donor_engagement',
  'complexity_donor_engagement_comments',
  'complexity_media_presence',
  'complexity_media_presence_comments',
  'complexity_hybrid_streaming',
  'complexity_hybrid_streaming_comments',
  'complexity_interpretation',
  'complexity_interpretation_comments',
  'complexity_security_sensitive',
  'complexity_security_sensitive_comments',
  'complexity_participant_logistics',
  'complexity_participant_logistics_comments',
  'complexity_branding_visibility',
  'complexity_branding_visibility_comments',
  'indicative_staffing_range',
  'total_proposed_staff',
  'is_within_benchmark',
  'benchmark_justification',
  'traffic_light_status',
  'assessment_comments',
]

const DEFAULT_STAFFING_AREAS = [
  'Programme Delivery & Facilitation',
  'Events Management & Logistics',
  'Participant & Guest Management',
  'Protocol & Security',
  'Communications & Visibility',
  'Executive / Senior Management Support',
  'Technical / Hybrid Support',
]

export default function DelegationFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { permUser } = usePermissions()
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
  const [staffingRows, setStaffingRows] = useState<FunctionalStaffingRow[]>(
    DEFAULT_STAFFING_AREAS.map((area) => ({
      functional_area: area,
      is_required: false,
      proposed_staff_count: 0,
      justification: '',
    })),
  )
  const [masterData, setMasterData] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pendingPrefill, setPendingPrefill] = useState<Record<string, any> | null>(null)
  const [showPrefillDialog, setShowPrefillDialog] = useState(false)
  const [consultations, setConsultations] = useState<any[]>([])
  const [selectedUnits, setSelectedUnits] = useState<string[]>([])
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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
          SOP_FIELDS.forEach((field) => {
            if (pkg[field] !== undefined && pkg[field] !== null) {
              setFormData((prev) => ({ ...prev, [field]: pkg[field] }))
            }
          })
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

          if (pkg.functional_staffing && pkg.functional_staffing.length > 0) {
            setStaffingRows(
              pkg.functional_staffing.map((s: any) => ({
                id: s.id,
                delegation_package_id: s.delegation_package_id,
                functional_area: s.functional_area || '',
                is_required: s.is_required ?? false,
                proposed_staff_count: s.proposed_staff_count ?? 0,
                justification: s.justification || '',
              })),
            )
          }
          setSelectedUnits(pkg.consultation_required_units || [])
          getConsultations(id).then(setConsultations).catch(console.error)
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

  const handleConsultationChange = (cId: string, field: string, value: any) => {
    setConsultations((prev) => prev.map((c) => (c.id === cId ? { ...c, [field]: value } : c)))
  }

  const handleConsultationUpdate = async (cId: string, field: string, value: any) => {
    setConsultations((prev) => prev.map((c) => (c.id === cId ? { ...c, [field]: value } : c)))
    try {
      await updateConsultation(cId, { [field]: value })
    } catch (e: any) {
      toast({
        title: 'Error saving consultation',
        description: e?.message,
        variant: 'destructive',
      })
    }
  }

  const savePackage = async (): Promise<string> => {
    const payload = {
      ...cleanPayload({
        ...formData,
        consultation_required_units: selectedUnits,
        total_proposed_travelers: travelers.length,
        total_proposed_staff:
          formData.total_proposed_staff ??
          staffingRows.reduce((sum, r) => sum + (r.proposed_staff_count || 0), 0),
        created_by: user?.id,
      }),
      status: 'Draft',
      current_stage: 'Delegation Proposal',
    }
    let pkgId: string
    if (isEdit && id) {
      const updated = await updateDelegationPackage(id, payload)
      pkgId = updated.id
    } else {
      const created = await createDelegationPackage(payload)
      pkgId = created.id
    }
    await replaceDelegationTravelers(pkgId, travelers)
    await replaceFunctionalStaffing(pkgId, staffingRows)
    return pkgId
  }

  const confirmSubmitForConsultation = async () => {
    if (!user) return
    setSubmitting(true)
    try {
      const pkgId = await savePackage()
      await submitDelegationForConsultation(pkgId, user.id, selectedUnits)
      const updatedConsultations = await getConsultations(pkgId)
      setConsultations(updatedConsultations)
      handleChange('status', 'Consultation')
      handleChange('current_stage', 'Involved Unit Consultation')
      if (!id) {
        navigate(`/travel/delegations/${pkgId}`, { replace: true })
      }
      toast({ title: 'Submitted for consultation successfully' })
      setShowSubmitDialog(false)
    } catch (e: any) {
      toast({
        title: 'Error submitting for consultation',
        description: e?.message,
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
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
      'functional_staffing',
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
      await savePackage()
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

  const isConsultationDraft =
    formData.status === 'Draft' ||
    formData.current_stage === 'Delegation Proposal' ||
    formData.current_stage === 'Draft'

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

      <DelegationSopEvaluationSection
        formData={formData}
        onChange={handleChange}
        staffingRows={staffingRows}
        onStaffingChange={setStaffingRows}
        consultations={consultations}
        selectedUnits={selectedUnits}
        onSelectedUnitsChange={setSelectedUnits}
        onConsultationChange={handleConsultationChange}
        onConsultationUpdate={handleConsultationUpdate}
        profiles={masterData?.profiles || []}
        canEditConsultations={isAdmin(permUser)}
        currentUserId={user?.id || null}
      />

      <div className="flex gap-3 justify-end pb-6">
        <Button variant="outline" onClick={() => navigate('/travel/delegations')}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving || submitting}>
          {saving ? 'Saving...' : 'Save Draft'}
        </Button>
        {isConsultationDraft && (
          <Button onClick={() => setShowSubmitDialog(true)} disabled={submitting || saving}>
            <Send className="h-4 w-4 mr-2" />
            {submitting ? 'Submitting...' : 'Submit for Consultation'}
          </Button>
        )}
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

      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit for Consultation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will transition the proposal from Draft to the Consultation stage. Consultation
              records will be created for all selected units. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmitForConsultation} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
