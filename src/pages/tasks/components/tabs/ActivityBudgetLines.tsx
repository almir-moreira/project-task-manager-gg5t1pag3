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
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.costCenters?.map((cc: any) => (
                        <SelectItem key={cc.id} value={cc.id}>
                          {cc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs text-muted-foreground">Budget Line</Label>
                  <Select
                    value={line.budget_line_id || ''}
                    onValueChange={(v) => onUpdate(line.id, 'budget_line_id', v)}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.budgetLines?.map((bl: any) => (
                        <SelectItem key={bl.id} value={bl.id}>
                          {bl.name}
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
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.workorders?.map((wo: any) => (
                        <SelectItem key={wo.id} value={wo.id}>
                          {wo.name}
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
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.accounts?.map((ac: any) => (
                        <SelectItem key={ac.id} value={ac.id}>
                          {ac.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
