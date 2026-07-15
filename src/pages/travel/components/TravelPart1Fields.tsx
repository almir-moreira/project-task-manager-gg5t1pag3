import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TravelPart1FieldsProps {
  formData: Record<string, any>
  onChange: (field: string, value: any) => void
  isHomeLeave: boolean
}

function boolToSelect(val: boolean | null | undefined): string {
  if (val === true) return 'Yes'
  if (val === false) return 'No'
  return ''
}

function selectToBool(val: string): boolean | null {
  if (val === 'Yes') return true
  if (val === 'No') return false
  return null
}

function SwitchRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean | null
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between bg-muted/30 px-3 py-2.5 rounded-md border border-input h-10">
      <Label className="text-sm font-medium">{label}</Label>
      <Switch checked={!!checked} onCheckedChange={onChange} />
    </div>
  )
}

export function TravelPart1Fields({ formData, onChange, isHomeLeave }: TravelPart1FieldsProps) {
  if (isHomeLeave) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Travel Request Part 1 — Traveler Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SwitchRow
              label="Tickets Provided by KAICIID"
              checked={formData.tickets_provided_by_kaiciid}
              onChange={(v) => onChange('tickets_provided_by_kaiciid', v)}
            />
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Budget Line</Label>
              <Input
                value={formData.budget_line || ''}
                onChange={(e) => onChange('budget_line', e.target.value)}
                placeholder="Enter budget line"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Account</Label>
              <Input
                value={formData.account || ''}
                onChange={(e) => onChange('account', e.target.value)}
                placeholder="Enter account"
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label className="text-sm font-semibold">Comments</Label>
              <Textarea
                value={formData.reason_for_travel || ''}
                onChange={(e) => onChange('reason_for_travel', e.target.value)}
                placeholder="Add any comments..."
                className="min-h-[80px] resize-y"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const showPrivateStay = formData.official_purpose_full_absence === false
  const showColleagues = formData.other_kaiciid_colleagues_travelling === true
  const showAccommodationDetails =
    formData.accommodation_free === 'No' || formData.accommodation_free === 'Partially'
  const showMealsDetails = formData.meals_free === 'No' || formData.meals_free === 'Partially'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Travel Request Part 1 — Traveler Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="grid gap-2 lg:col-span-3">
            <Label className="text-sm font-semibold">Reason for Travel</Label>
            <Textarea
              value={formData.reason_for_travel || ''}
              onChange={(e) => onChange('reason_for_travel', e.target.value)}
              placeholder="Explain the purpose and justification for this travel..."
              className="min-h-[80px] resize-y"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Event Organizer or Title</Label>
            <Input
              value={formData.event_organizer_or_title || ''}
              onChange={(e) => onChange('event_organizer_or_title', e.target.value)}
              placeholder="Enter event organizer or title"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Official Purpose — Full Absence?</Label>
            <Select
              value={boolToSelect(formData.official_purpose_full_absence)}
              onValueChange={(v) => onChange('official_purpose_full_absence', selectToBool(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showPrivateStay && (
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Private Stay Dates</Label>
              <Input
                value={formData.private_stay_dates || ''}
                onChange={(e) => onChange('private_stay_dates', e.target.value)}
                placeholder="e.g., 15–17 July 2026"
              />
            </div>
          )}

          <SwitchRow
            label="Tickets Provided by KAICIID"
            checked={formData.tickets_provided_by_kaiciid}
            onChange={(v) => onChange('tickets_provided_by_kaiciid', v)}
          />

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Other KAICIID Colleagues Travelling?</Label>
            <Select
              value={boolToSelect(formData.other_kaiciid_colleagues_travelling)}
              onValueChange={(v) =>
                onChange('other_kaiciid_colleagues_travelling', selectToBool(v))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showColleagues && (
            <div className="grid gap-2 lg:col-span-3">
              <Label className="text-sm font-semibold">Colleagues Names</Label>
              <Input
                value={formData.colleagues_names || ''}
                onChange={(e) => onChange('colleagues_names', e.target.value)}
                placeholder="Enter names of travelling colleagues"
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Accommodation Free?</Label>
            <Select
              value={formData.accommodation_free || ''}
              onValueChange={(v) => onChange('accommodation_free', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Partially">Partially</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Meals Free?</Label>
            <Select
              value={formData.meals_free || ''}
              onValueChange={(v) => onChange('meals_free', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Partially">Partially</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showAccommodationDetails && (
            <div className="grid gap-2 lg:col-span-3">
              <Label className="text-sm font-semibold">Accommodation Details</Label>
              <Textarea
                value={formData.accommodation_free_details || ''}
                onChange={(e) => onChange('accommodation_free_details', e.target.value)}
                placeholder="Explain accommodation arrangement details..."
                className="min-h-[60px] resize-y"
              />
            </div>
          )}

          {showMealsDetails && (
            <div className="grid gap-2 lg:col-span-3">
              <Label className="text-sm font-semibold">Meals Details</Label>
              <Textarea
                value={formData.meals_free_details || ''}
                onChange={(e) => onChange('meals_free_details', e.target.value)}
                placeholder="Explain meals arrangement details..."
                className="min-h-[60px] resize-y"
              />
            </div>
          )}

          <SwitchRow
            label="Lisbon Airport Transfer Free"
            checked={formData.lisbon_airport_transfer_free}
            onChange={(v) => onChange('lisbon_airport_transfer_free', v)}
          />

          <SwitchRow
            label="Destination Transfer Free"
            checked={formData.destination_transfer_free}
            onChange={(v) => onChange('destination_transfer_free', v)}
          />

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Budget Line</Label>
            <Input
              value={formData.budget_line || ''}
              onChange={(e) => onChange('budget_line', e.target.value)}
              placeholder="Enter budget line"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Account</Label>
            <Input
              value={formData.account || ''}
              onChange={(e) => onChange('account', e.target.value)}
              placeholder="Enter account"
            />
          </div>

          <div className="lg:col-span-3 mt-2">
            <SwitchRow
              label="I confirm that the information provided above is accurate"
              checked={formData.traveler_confirmation}
              onChange={(v) => onChange('traveler_confirmation', v)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
