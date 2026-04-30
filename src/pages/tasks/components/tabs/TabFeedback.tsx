import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface Profile {
  id: string
  name: string | null
}

interface TabFeedbackProps {
  activity?: any
  onUpdate?: (updates: any) => void
  units?: string[]
}

export function TabFeedback({
  activity,
  onUpdate,
  units = ['EOSG', 'OPS', 'COMMS'],
}: TabFeedbackProps) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const { toast } = useToast()

  // Ensure Partnerships is in the list
  const displayUnits = Array.from(new Set([...units, 'Partnerships']))

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase.from('profiles').select('id, name').order('name')

      if (!error && data) {
        setProfiles(data)
      }
    }

    fetchProfiles()
  }, [])

  const handleUnitToggle = async (unit: string, checked: boolean) => {
    if (!activity?.id) return
    const field = `wf_${unit.toLowerCase()}`
    try {
      const { error } = await supabase
        .from('activities')
        .update({ [field]: checked })
        .eq('id', activity.id)
      if (error) throw error
      if (onUpdate) onUpdate({ [field]: checked })
    } catch (e) {
      toast({ title: 'Error saving workflow inclusion', variant: 'destructive' })
    }
  }

  const handleReviewerChange = async (unit: string, reviewerId: string) => {
    if (!activity?.id) return
    const field = `wf_${unit.toLowerCase()}_reviewer_id`
    try {
      const { error } = await supabase
        .from('activities')
        .update({ [field]: reviewerId })
        .eq('id', activity.id)
      if (error) throw error
      if (onUpdate) onUpdate({ [field]: reviewerId })
    } catch (e) {
      toast({ title: 'Error saving reviewer', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[50px] text-center"></TableHead>
              <TableHead className="w-[150px]">Unit / Dept</TableHead>
              <TableHead className="w-[250px]">Reviewer</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead className="min-w-[300px]">Feedback</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayUnits.map((unit, i) => {
              const isChecked = !!activity?.[`wf_${unit.toLowerCase()}`]
              const reviewerId = activity?.[`wf_${unit.toLowerCase()}_reviewer_id`] || ''

              return (
                <TableRow key={unit}>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => handleUnitToggle(unit, checked as boolean)}
                      aria-label={`Include ${unit} in workflow`}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-sm">{unit}</TableCell>
                  <TableCell className="text-sm">
                    <Select
                      value={reviewerId}
                      onValueChange={(val) => handleReviewerChange(unit, val)}
                    >
                      <SelectTrigger className="h-8 w-full bg-background">
                        <SelectValue placeholder="Select reviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.name || profile.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {i % 2 === 0 ? (
                      <Badge
                        variant="outline"
                        className="text-amber-600 border-amber-200 bg-amber-50"
                      >
                        Pending
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-emerald-600 border-emerald-200 bg-emerald-50"
                      >
                        Cleared
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {i % 2 === 0 ? '-' : '2026-06-15'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {i % 2 === 0 ? 'Awaiting response.' : 'Approved without conditions.'}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
