import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const EVENT_TYPES = [
  'KAICIID-Organized Event',
  'Co-organized Event',
  'External Event',
  'Conference',
  'Workshop',
  'Other',
]

const BENCHMARK_CATEGORIES = [
  'Below Benchmark',
  'Within Benchmark',
  'Above Benchmark',
  'Not Applicable',
]

interface Props {
  formData: Record<string, any>
  onChange: (field: string, value: any) => void
  masterData: any
  activities: any[]
  onActivityLink: (val: string) => void
}

export function DelegationEventDetailsSection({
  formData,
  onChange,
  masterData,
  activities,
  onActivityLink,
}: Props) {
  const profiles = masterData?.profiles || []
  const programmes = masterData?.programmes || []
  const projects = masterData?.projects || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Details</CardTitle>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Event Title</Label>
            <Input
              value={formData.event_title || ''}
              onChange={(e) => onChange('event_title', e.target.value)}
              placeholder="Enter event title"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Event Type</Label>
            <Select
              value={formData.event_type || ''}
              onValueChange={(v) => onChange('event_type', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Event Dates</Label>
            <Input
              value={formData.event_dates || ''}
              onChange={(e) => onChange('event_dates', e.target.value)}
              placeholder="e.g., 15–18 March 2026"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Location</Label>
            <Input
              value={formData.location || ''}
              onChange={(e) => onChange('location', e.target.value)}
              placeholder="Enter event location"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Event Lead</Label>
            <Select
              value={formData.event_lead_id || ''}
              onValueChange={(v) => onChange('event_lead_id', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event lead" />
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
            <Label className="text-sm font-medium">Project</Label>
            <Select
              value={formData.project_id || ''}
              onValueChange={(v) => onChange('project_id', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Estimated Physical Participants</Label>
            <Input
              type="number"
              value={formData.estimated_number_of_participants ?? ''}
              onChange={(e) =>
                onChange(
                  'estimated_number_of_participants',
                  e.target.value ? parseInt(e.target.value, 10) : null,
                )
              }
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Estimated Virtual Participants</Label>
            <Input
              type="number"
              value={formData.estimated_number_of_virtual_participants ?? ''}
              onChange={(e) =>
                onChange(
                  'estimated_number_of_virtual_participants',
                  e.target.value ? parseInt(e.target.value, 10) : null,
                )
              }
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Estimated Event Budget</Label>
            <Input
              type="number"
              value={formData.estimated_event_budget ?? ''}
              onChange={(e) =>
                onChange(
                  'estimated_event_budget',
                  e.target.value ? parseFloat(e.target.value) : null,
                )
              }
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Benchmark Category</Label>
            <Select
              value={formData.benchmark_category || ''}
              onValueChange={(v) => onChange('benchmark_category', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select benchmark" />
              </SelectTrigger>
              <SelectContent>
                {BENCHMARK_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Benchmark Range</Label>
            <Input
              value={formData.benchmark_range || ''}
              onChange={(e) => onChange('benchmark_range', e.target.value)}
              placeholder="e.g., 5–8 travelers"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Justification if Above Benchmark</Label>
          <Textarea
            value={formData.justification_if_above_benchmark || ''}
            onChange={(e) => onChange('justification_if_above_benchmark', e.target.value)}
            placeholder="Provide justification if the proposed delegation exceeds benchmark..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )
}
