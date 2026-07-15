import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const TRAVEL_CATEGORIES = [
  'Official Travel',
  'Home Leave',
  'Rest & Recreation',
  'Medical Evacuation',
  'Other',
]

interface Props {
  formData: Record<string, any>
  onChange: (field: string, value: any) => void
  masterData: any
  activities: any[]
  onActivityLink: (val: string) => void
  isHomeLeave: boolean
}

export function TripDetailsSection({
  formData,
  onChange,
  masterData,
  activities,
  onActivityLink,
  isHomeLeave,
}: Props) {
  const profiles = masterData?.profiles || []
  const programmes = masterData?.programmes || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trip Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Linked Activity</Label>
          <Select value={formData.linked_activity_id || 'none'} onValueChange={onActivityLink}>
            <SelectTrigger>
              <SelectValue placeholder="Select an activity (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {activities.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.task_number ? `${a.task_number} — ${a.activity_name}` : a.activity_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Travel Category</Label>
            <Select
              value={formData.travel_type || ''}
              onValueChange={(v) => onChange('travel_type', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {TRAVEL_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {formData.travel_type === 'Event Delegation' && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4 space-y-2">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
              Event Delegation requires a Delegation Proposal
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Event-based delegation travel must be initiated through a Delegation Proposal. Please
              create one from the Travel page by clicking "New Request" → "New Delegation Proposal".
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Traveler</Label>
            <Select
              value={formData.traveler_id || ''}
              onValueChange={(v) => onChange('traveler_id', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select traveler" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Requester</Label>
            <Select
              value={formData.requester_id || ''}
              onValueChange={(v) => onChange('requester_id', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select requester" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Programme</Label>
            <Select
              value={formData.programme_id || ''}
              onValueChange={(v) => onChange('programme_id', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select programme" />
              </SelectTrigger>
              <SelectContent>
                {programmes.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Destination</Label>
            <Input
              value={formData.destination || ''}
              onChange={(e) => onChange('destination', e.target.value)}
              placeholder="Enter destination"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Start Date</Label>
            <Input
              type="date"
              value={formData.travel_start_date || ''}
              onChange={(e) => onChange('travel_start_date', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">End Date</Label>
            <Input
              type="date"
              value={formData.travel_end_date || ''}
              onChange={(e) => onChange('travel_end_date', e.target.value)}
            />
          </div>
        </div>

        {!isHomeLeave && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Mission Title / Event Name</Label>
            <Input
              value={formData.mission_title_or_event_name || ''}
              onChange={(e) => onChange('mission_title_or_event_name', e.target.value)}
              placeholder="Enter mission title or event name"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
