import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export const ynToBool = (v: string): boolean | null =>
  v === 'yes' ? true : v === 'no' ? false : null

export const boolToYn = (v: boolean | null): string =>
  v === true ? 'yes' : v === false ? 'no' : ''

export function YesNoField({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean | null
  onChange: (v: boolean | null) => void
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Select value={boolToYn(value)} onValueChange={(v) => onChange(ynToBool(v))}>
        <SelectTrigger>
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="yes">Yes</SelectItem>
          <SelectItem value="no">No</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export function BudgetCodingRow({
  formData,
  onChange,
  masterData,
}: {
  formData: Record<string, any>
  onChange: (field: string, value: any) => void
  masterData: any
}) {
  const renderItems = (items: any[]) =>
    items.map((item) => (
      <SelectItem key={item.id} value={item.id}>
        {item.code ? `${item.code} — ${item.name || ''}`.trim() : item.name}
      </SelectItem>
    ))

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Cost Centre</Label>
        <Select
          value={formData.cost_center_id || ''}
          onValueChange={(v) => onChange('cost_center_id', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>{renderItems(masterData?.costCenters || [])}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Work Order</Label>
        <Select
          value={formData.work_order_id || ''}
          onValueChange={(v) => onChange('work_order_id', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>{renderItems(masterData?.workorders || [])}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Account</Label>
        <Select value={formData.account_id || ''} onValueChange={(v) => onChange('account_id', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>{renderItems(masterData?.accounts || [])}</SelectContent>
        </Select>
      </div>
    </div>
  )
}

export function ConfirmationBox({
  formData,
  onChange,
}: {
  formData: Record<string, any>
  onChange: (field: string, value: any) => void
}) {
  return (
    <div className={cn('flex items-center space-x-3 rounded-lg border p-4 bg-muted/30')}>
      <Checkbox
        checked={formData.traveler_confirmation || false}
        onCheckedChange={(v) => onChange('traveler_confirmation', v === true)}
      />
      <Label className="text-sm cursor-pointer">
        I confirm that the information provided above is accurate and complete.
      </Label>
    </div>
  )
}
