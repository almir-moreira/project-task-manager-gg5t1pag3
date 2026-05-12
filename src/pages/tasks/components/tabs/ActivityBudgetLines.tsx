import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

function CurrencyMaskInput({
  value,
  onChange,
  placeholder,
}: {
  value: number | null | undefined
  onChange: (val: number | null) => void
  placeholder?: string
}) {
  const format = (v: number | null | undefined) => {
    if (v === null || v === undefined || isNaN(v)) return ''
    return new Intl.NumberFormat('en-IE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(v)
  }

  const [displayValue, setDisplayValue] = useState(format(value))
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(format(value))
    }
  }, [value, isFocused])

  const handleBlur = () => {
    setIsFocused(false)
    const parsed = parseFloat(displayValue.replace(/,/g, ''))
    if (!isNaN(parsed)) {
      onChange(parsed)
      setDisplayValue(format(parsed))
    } else {
      onChange(null)
      setDisplayValue('')
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    if (value !== null && value !== undefined && !isNaN(value)) {
      setDisplayValue(value.toString())
    } else {
      setDisplayValue('')
    }
  }

  return (
    <div className="relative">
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-medium">
        €
      </span>
      <Input
        type="text"
        value={displayValue}
        onChange={(e) => setDisplayValue(e.target.value.replace(/[^0-9.,]/g, ''))}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className="h-9 pl-6 text-xs"
        placeholder={placeholder || '0.00'}
      />
    </div>
  )
}

export function ActivityBudgetLines({
  budgetLines,
  masterData,
  onAdd,
  onUpdate,
  onRemove,
}: {
  budgetLines: any[]
  masterData: any
  onAdd: () => void
  onUpdate: (id: string, field: string, value: any) => void
  onRemove: (id: string) => void
}) {
  return (
    <div className="pt-6 mt-6 border-t border-border space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Budget Lines</Label>
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-2" /> Add Budget Line
        </Button>
      </div>

      {budgetLines.length === 0 ? (
        <div className="text-sm text-muted-foreground text-center py-6 border rounded-md border-dashed">
          No budget lines added. Click the button above to add one.
        </div>
      ) : (
        <div className="space-y-3">
          {budgetLines.map((line, index) => (
            <div
              key={line.id}
              className="flex items-end gap-3 p-3 border rounded-md bg-muted/10 relative group animate-fade-in"
            >
              <div className="absolute -left-2 -top-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center z-10 shadow-sm border border-background">
                {index + 1}
              </div>
              <div className="grid grid-cols-4 gap-3 flex-1">
                <div className="grid gap-1.5">
                  <Label className="text-xs text-muted-foreground">Cost Center</Label>
                  <Select
                    value={line.cost_center_id || ''}
                    onValueChange={(v) => onUpdate(line.id, 'cost_center_id', v)}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select code" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.costCenters?.map((cc: any) => (
                        <SelectItem key={cc.id} value={cc.id}>
                          {cc.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs text-muted-foreground">Workorder</Label>
                  <Select
                    value={line.workorder_id || ''}
                    onValueChange={(v) => onUpdate(line.id, 'workorder_id', v)}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select code" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.workorders?.map((wo: any) => (
                        <SelectItem key={wo.id} value={wo.id}>
                          {wo.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs text-muted-foreground">Account</Label>
                  <Select
                    value={line.account_id || ''}
                    onValueChange={(v) => onUpdate(line.id, 'account_id', v)}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select code" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.accounts?.map((ac: any) => (
                        <SelectItem key={ac.id} value={ac.id}>
                          {ac.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs text-muted-foreground">Amount</Label>
                  <CurrencyMaskInput
                    value={line.amount}
                    onChange={(val) => onUpdate(line.id, 'amount', val)}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                onClick={() => onRemove(line.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
