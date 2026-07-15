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
import { BudgetCodingRow, ConfirmationBox, YesNoField } from './travel-form-helpers'

const REASON_OPTIONS = [
  'Training/Conference',
  'Representing KAICIID',
  'Assisting at KAICIID event',
  'Conducting training/lecture',
  'Home Leave',
  'Other',
]

interface Props {
  formData: Record<string, any>
  onChange: (field: string, value: any) => void
  isHomeLeave: boolean
  masterData: any
}

export function TravelPart1Fields({ formData, onChange, isHomeLeave, masterData }: Props) {
  const showOtherReason = formData.reason_for_travel_option === 'Other'
  const showPrivateStay = formData.official_purpose_full_absence === false
  const showColleagues = formData.other_kaiciid_colleagues_travelling === true
  const showAccommodationDetails =
    formData.accommodation_free === 'No' || formData.accommodation_free === 'Partial'
  const showMealsDetails = formData.meals_free === 'No' || formData.meals_free === 'Partial'

  const reasonSelect = (defaultValue?: string) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Reason for Travel</Label>
      <Select
        value={formData.reason_for_travel_option || defaultValue || ''}
        onValueChange={(v) => onChange('reason_for_travel_option', v)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select reason" />
        </SelectTrigger>
        <SelectContent>
          {REASON_OPTIONS.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  if (isHomeLeave) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Travel Request Part 1 — Traveler Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reasonSelect('Home Leave')}
          <YesNoField
            label="Tickets Provided by KAICIID"
            value={formData.tickets_provided_by_kaiciid}
            onChange={(v) => onChange('tickets_provided_by_kaiciid', v)}
          />
          <BudgetCodingRow formData={formData} onChange={onChange} masterData={masterData} />
          <ConfirmationBox formData={formData} onChange={onChange} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Travel Request Part 1 — Traveler Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{reasonSelect()}</div>
        {showOtherReason && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Other reason details</Label>
            <Input
              value={formData.reason_for_travel_other_details || ''}
              onChange={(e) => onChange('reason_for_travel_other_details', e.target.value)}
              placeholder="Specify other reason..."
            />
          </div>
        )}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Purpose / Justification</Label>
          <Textarea
            value={formData.purpose_justification || ''}
            onChange={(e) => onChange('purpose_justification', e.target.value)}
            placeholder="Explain the purpose and justification for this travel..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <YesNoField
            label="Official Purpose — Full Absence?"
            value={formData.official_purpose_full_absence}
            onChange={(v) => onChange('official_purpose_full_absence', v)}
          />
          {showPrivateStay && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Private stay dates</Label>
              <Input
                value={formData.private_stay_dates || ''}
                onChange={(e) => onChange('private_stay_dates', e.target.value)}
                placeholder="Enter private stay dates..."
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Event Organizer or Title</Label>
          <Input
            value={formData.event_organizer_or_title || ''}
            onChange={(e) => onChange('event_organizer_or_title', e.target.value)}
            placeholder="Enter event organizer or title..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <YesNoField
            label="Tickets Provided by KAICIID"
            value={formData.tickets_provided_by_kaiciid}
            onChange={(v) => onChange('tickets_provided_by_kaiciid', v)}
          />
          <YesNoField
            label="Lisbon Airport Transfer Free"
            value={formData.lisbon_airport_transfer_free}
            onChange={(v) => onChange('lisbon_airport_transfer_free', v)}
          />
          <YesNoField
            label="Destination Transfer Free"
            value={formData.destination_transfer_free}
            onChange={(v) => onChange('destination_transfer_free', v)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <YesNoField
            label="Other KAICIID Colleagues Travelling?"
            value={formData.other_kaiciid_colleagues_travelling}
            onChange={(v) => onChange('other_kaiciid_colleagues_travelling', v)}
          />
          {showColleagues && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Colleagues Names</Label>
              <Input
                value={formData.colleagues_names || ''}
                onChange={(e) => onChange('colleagues_names', e.target.value)}
                placeholder="Enter colleagues names..."
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Accommodation Free?</Label>
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
                <SelectItem value="Partial">Partial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Meals Free?</Label>
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
                <SelectItem value="Partial">Partial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {showAccommodationDetails && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Accommodation Details</Label>
            <Input
              value={formData.accommodation_free_details || ''}
              onChange={(e) => onChange('accommodation_free_details', e.target.value)}
              placeholder="Enter accommodation details..."
            />
          </div>
        )}
        {showMealsDetails && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Meals Details</Label>
            <Input
              value={formData.meals_free_details || ''}
              onChange={(e) => onChange('meals_free_details', e.target.value)}
              placeholder="Enter meals details..."
            />
          </div>
        )}

        <BudgetCodingRow formData={formData} onChange={onChange} masterData={masterData} />
        <ConfirmationBox formData={formData} onChange={onChange} />
      </CardContent>
    </Card>
  )
}
