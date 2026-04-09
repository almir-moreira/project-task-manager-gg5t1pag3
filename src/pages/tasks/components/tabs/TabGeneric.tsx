import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

export function TabEventDetails() {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h3 className="text-lg font-medium">Event Details</h3>
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
      <h3 className="text-lg font-medium">RBM</h3>
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

export function TabInvolvedParties() {
  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <h3 className="text-lg font-medium">Involved Parties</h3>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="ems" />
          <Label htmlFor="ems">EMS</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="protocol" />
          <Label htmlFor="protocol">Protocol</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="sg" />
          <Label htmlFor="sg">SG</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="cop" />
          <Label htmlFor="cop">CoP/BoD</Label>
        </div>
      </div>
      <div className="grid gap-2">
        <Label>EMS Comments</Label>
        <Textarea placeholder="Comments..." />
      </div>
      <div className="grid gap-2">
        <Label>CoP/BoD Role</Label>
        <Input placeholder="Role description" />
      </div>
    </div>
  )
}

export function TabSGParticipation() {
  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <h3 className="text-lg font-medium">SG Participation</h3>
      <div className="grid gap-2">
        <Label>SG Role</Label>
        <Input placeholder="Describe SG Role" />
      </div>
      <div className="grid gap-2">
        <Label>Speaking Notes / Welcome Remarks</Label>
        <Textarea className="min-h-[200px]" placeholder="Enter notes..." />
      </div>
    </div>
  )
}

export function TabAttachments() {
  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <h3 className="text-lg font-medium">Attachments</h3>
      <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer">
        <p className="text-sm text-muted-foreground">
          Click or drag files here to upload to SharePoint
        </p>
      </div>
    </div>
  )
}
