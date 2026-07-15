import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const TRAVEL_TYPES = [
  'Event delegation / KAICIID or co-organized event',
  'Individual official mission',
  'Home Leave',
  'Other travel',
]

export default function TravelFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const isEdit = !!id
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [profiles, setProfiles] = useState<any[]>([])
  const [programmes, setProgrammes] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [taNumber, setTaNuumber] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, any>>({
    travel_type: '',
    linked_activity_id: null,
    traveler_id: '',
    requester_id: '',
    programme_id: '',
    pm_verifier_id: null,
    mission_title_or_event_name: '',
    destination: '',
    travel_start_date: '',
    travel_end_date: '',
  })
  const manual = useRef<Set<string>>(new Set())

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('id, name').order('name'),
      supabase.from('programmes').select('id, name').order('name'),
      supabase
        .from('activities')
        .select('id, activity_name, task_number')
        .order('created_at', { ascending: false })
        .limit(100),
    ]).then(([pRes, progRes, aRes]) => {
      setProfiles(pRes.data || [])
      setProgrammes(progRes.data || [])
      setActivities(aRes.data || [])
      if (!isEdit && user) setForm((f) => ({ ...f, requester_id: user.id }))
    })
    if (isEdit && id) loadExisting(id)
  }, [id, isEdit, user])

  const loadExisting = async (taId: string) => {
    const { data, error } = await (supabase as any)
      .from('travel_authorizations')
      .select('*')
      .eq('id', taId)
      .single()
    if (error) {
      toast({ title: 'Error loading record', variant: 'destructive' })
      setLoading(false)
      return
    }
    setTaNuumber(data.travel_authorization_number)
    setForm({
      travel_type: data.travel_type || '',
      linked_activity_id: data.linked_activity_id || null,
      traveler_id: data.traveler_id || '',
      requester_id: data.requester_id || '',
      programme_id: data.programme_id || '',
      pm_verifier_id: data.pm_verifier_id || null,
      mission_title_or_event_name: data.mission_title_or_event_name || '',
      destination: data.destination || '',
      travel_start_date: data.travel_start_date ? data.travel_start_date.split('T')[0] : '',
      travel_end_date: data.travel_end_date ? data.travel_end_date.split('T')[0] : '',
    })
    setLoading(false)
  }

  const set = (k: string, v: any) => {
    setForm((p) => ({ ...p, [k]: v }))
    manual.current.add(k)
  }

  const handleActivityLink = async (activityId: string) => {
    set('linked_activity_id', activityId === 'none' ? null : activityId)
    if (!activityId || activityId === 'none') return
    const { data: act } = await supabase
      .from('activities')
      .select('programme_id, activity_name, event_location, start_date, end_date')
      .eq('id', activityId)
      .single()
    if (!act) return
    const pf: Record<string, any> = {}
    if (act.programme_id && !manual.current.has('programme_id')) pf.programme_id = act.programme_id
    if (act.activity_name && !manual.current.has('mission_title_or_event_name'))
      pf.mission_title_or_event_name = act.activity_name
    if (act.event_location && !manual.current.has('destination'))
      pf.destination = act.event_location
    if (act.start_date && !manual.current.has('travel_start_date'))
      pf.travel_start_date = act.start_date.split('T')[0]
    if (act.end_date && !manual.current.has('travel_end_date'))
      pf.travel_end_date = act.end_date.split('T')[0]
    if (Object.keys(pf).length) {
      setForm((p) => ({ ...p, ...pf }))
      toast({
        title: 'Fields auto-filled from linked activity',
        description: `${Object.keys(pf).join(', ')} updated`,
      })
    }
  }

  const handleSubmit = async () => {
    if (!form.traveler_id || !form.programme_id || !form.travel_type) {
      toast({ title: 'Please fill required fields', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        travel_start_date: form.travel_start_date
          ? new Date(form.travel_start_date).toISOString()
          : null,
        travel_end_date: form.travel_end_date ? new Date(form.travel_end_date).toISOString() : null,
      }
      if (isEdit && id) {
        await (supabase as any).from('travel_authorizations').update(payload).eq('id', id)
        toast({ title: 'Travel authorization updated' })
      } else {
        const { data } = await (supabase as any)
          .from('travel_authorizations')
          .insert(payload)
          .select()
          .single()
        toast({ title: 'Travel authorization created' })
        navigate(`/travel/${data.id}`)
        return
      }
      navigate('/travel')
    } catch (e: any) {
      toast({ title: 'Error saving', description: e.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )

  const userOpts = (arr: any[]) =>
    arr.map((p) => (
      <SelectItem key={p.id} value={p.id}>
        {p.name || 'Unknown'}
      </SelectItem>
    ))

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/travel')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEdit ? 'Edit Travel Authorization' : 'New Travel Authorization'}
        </h1>
      </div>
      {taNumber && (
        <p className="text-sm text-muted-foreground">
          TA Number: <span className="font-medium">{taNumber}</span>
        </p>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Travel Type *</Label>
            <Select value={form.travel_type} onValueChange={(v) => set('travel_type', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select travel type" />
              </SelectTrigger>
              <SelectContent>
                {TRAVEL_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Linked Activity</Label>
            <Select value={form.linked_activity_id || 'none'} onValueChange={handleActivityLink}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No linked activity</SelectItem>
                {activities.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.task_number || a.id.slice(0, 8)} - {a.activity_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Traveler *</Label>
              <Select value={form.traveler_id} onValueChange={(v) => set('traveler_id', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select traveler" />
                </SelectTrigger>
                <SelectContent>{userOpts(profiles)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Requester</Label>
              <Select value={form.requester_id} onValueChange={(v) => set('requester_id', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select requester" />
                </SelectTrigger>
                <SelectContent>{userOpts(profiles)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Programme *</Label>
              <Select value={form.programme_id} onValueChange={(v) => set('programme_id', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select programme" />
                </SelectTrigger>
                <SelectContent>
                  {programmes.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>PM Verifier</Label>
              <Select
                value={form.pm_verifier_id || 'none'}
                onValueChange={(v) => set('pm_verifier_id', v === 'none' ? null : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select verifier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No verifier</SelectItem>
                  {userOpts(profiles)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Mission Title / Event Name</Label>
            <Input
              value={form.mission_title_or_event_name}
              onChange={(e) => set('mission_title_or_event_name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Destination</Label>
            <Input value={form.destination} onChange={(e) => set('destination', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Travel Start Date</Label>
              <Input
                type="date"
                value={form.travel_start_date}
                onChange={(e) => set('travel_start_date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Travel End Date</Label>
              <Input
                type="date"
                value={form.travel_end_date}
                onChange={(e) => set('travel_end_date', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate('/travel')}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  )
}
