import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DelegationTraveler } from '@/services/delegations'

interface Props {
  travelers: DelegationTraveler[]
  profiles: any[]
  onChange: (travelers: DelegationTraveler[]) => void
}

const FUNCTIONAL_AREAS = [
  'Programme',
  'Communications',
  'Protocol',
  'Administration',
  'Finance',
  'Legal',
  'Technology',
  'Other',
]

export function DelegationTravelersSection({ travelers, profiles, onChange }: Props) {
  const addTraveler = () => {
    onChange([
      ...travelers,
      {
        traveler_id: null,
        proposed_role_or_function: '',
        functional_area: '',
        physical_presence_justification: '',
        remote_participation_possible: false,
        local_support_possible: false,
        status: 'Proposed',
        comments: '',
      },
    ])
  }

  const removeTraveler = (index: number) => {
    onChange(travelers.filter((_, i) => i !== index))
  }

  const updateTraveler = (index: number, field: string, value: any) => {
    onChange(travelers.map((t, i) => (i === index ? { ...t, [field]: value } : t)))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Proposed Travelers ({travelers.length})</CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={addTraveler}>
          <Plus className="w-4 h-4 mr-1" />
          Add Traveler
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {travelers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No proposed travelers yet. Click "Add Traveler" to begin.
          </p>
        ) : (
          travelers.map((traveler, index) => (
            <div key={index} className="rounded-lg border p-4 space-y-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Traveler #{index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => removeTraveler(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Traveler</Label>
                  <Select
                    value={traveler.traveler_id || 'none'}
                    onValueChange={(v) =>
                      updateTraveler(index, 'traveler_id', v === 'none' ? null : v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select traveler" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">— None —</SelectItem>
                      {profiles.map((p: any) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Functional Area</Label>
                  <Select
                    value={traveler.functional_area || ''}
                    onValueChange={(v) => updateTraveler(index, 'functional_area', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      {FUNCTIONAL_AREAS.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Proposed Role / Function</Label>
                <Input
                  value={traveler.proposed_role_or_function}
                  onChange={(e) =>
                    updateTraveler(index, 'proposed_role_or_function', e.target.value)
                  }
                  placeholder="e.g., Moderator, Speaker, Observer..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Physical Presence Justification</Label>
                <Textarea
                  value={traveler.physical_presence_justification}
                  onChange={(e) =>
                    updateTraveler(index, 'physical_presence_justification', e.target.value)
                  }
                  placeholder="Why is physical presence required for this traveler?"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <Label className="text-sm cursor-pointer">Remote Participation Possible?</Label>
                  <Switch
                    checked={traveler.remote_participation_possible}
                    onCheckedChange={(v) =>
                      updateTraveler(index, 'remote_participation_possible', v)
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <Label className="text-sm cursor-pointer">Local Support Possible?</Label>
                  <Switch
                    checked={traveler.local_support_possible}
                    onCheckedChange={(v) => updateTraveler(index, 'local_support_possible', v)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Comments</Label>
                <Input
                  value={traveler.comments}
                  onChange={(e) => updateTraveler(index, 'comments', e.target.value)}
                  placeholder="Additional comments..."
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
