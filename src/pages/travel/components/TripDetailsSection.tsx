import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { TRAVEL_TYPES } from '@/services/travel'

interface TripDetailsSectionProps {
  formData: Record<string, any>
  onChange: (field: string, value: any) => void
  masterData: any
  activities: any[]
  onActivityLink: (val: string) => void
}

export function TripDetailsSection({
  formData,
  onChange,
  masterData,
  activities,
  onActivityLink,
}: TripDetailsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trip Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Traveler</Label>
            <Select
              value={formData.traveler_id || ''}
              onValueChange={(v) => onChange('traveler_id', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select traveler" />
              </SelectTrigger>
              <SelectContent>
                {masterData?.profiles?.map((u: any) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name || u.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Travel Type</Label>
            <Select
              value={formData.travel_type || ''}
              onValueChange={(v) => onChange('travel_type', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
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

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Destination</Label>
            <Input
              value={formData.destination || ''}
              onChange={(e) => onChange('destination', e.target.value)}
              placeholder="Enter destination"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Travel Start Date</Label>
            <Input
              type="date"
              value={formData.travel_start_date || ''}
              onChange={(e) => onChange('travel_start_date', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Travel End Date</Label>
            <Input
              type="date"
              value={formData.travel_end_date || ''}
              onChange={(e) => onChange('travel_end_date', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Mission Title / Event Name</Label>
            <Input
              value={formData.mission_title_or_event_name || ''}
              onChange={(e) => onChange('mission_title_or_event_name', e.target.value)}
              placeholder="Enter mission title or event name"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Programme</Label>
            <Select
              value={formData.programme_id || ''}
              onValueChange={(v) => onChange('programme_id', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select programme" />
              </SelectTrigger>
              <SelectContent>
                {masterData?.programmes?.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2 lg:col-span-2">
            <Label className="text-sm font-semibold">Linked Activity</Label>
            <Select value={formData.linked_activity_id || 'none'} onValueChange={onActivityLink}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {activities.map((a: any) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.task_number || a.id.slice(0, 8)} — {a.activity_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
