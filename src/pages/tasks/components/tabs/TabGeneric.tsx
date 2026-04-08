import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function TabEventDetails() {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Event Location</Label>
          <Input placeholder="E.g. Conference Room A" />
        </div>
        <div className="grid gap-2">
          <Label>Participant Count</Label>
          <Input type="number" placeholder="0" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Meeting Link</Label>
        <Input type="url" placeholder="https://zoom.us/j/123" />
      </div>
      <div className="grid gap-2">
        <Label>Logistics Notes</Label>
        <Textarea placeholder="Catering, A/V requirements, etc." className="min-h-[100px]" />
      </div>
    </div>
  )
}

export function TabRBM() {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="grid gap-2">
        <Label>Expected Outcomes</Label>
        <Textarea placeholder="Define the measurable outcomes..." className="min-h-[120px]" />
      </div>
      <div className="grid gap-2">
        <Label>Key Outputs</Label>
        <Textarea placeholder="List the tangible deliverables..." className="min-h-[120px]" />
      </div>
    </div>
  )
}
