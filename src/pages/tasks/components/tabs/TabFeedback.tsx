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

interface Profile {
  id: string
  name: string | null
}

interface TabFeedbackProps {
  units?: string[]
}

export function TabFeedback({ units = ['EOSG', 'OPS', 'COMMS'] }: TabFeedbackProps) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selectedUnits, setSelectedUnits] = useState<Record<string, boolean>>({})
  const [reviewers, setReviewers] = useState<Record<string, string>>({})

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

  const handleUnitToggle = (unit: string, checked: boolean) => {
    setSelectedUnits((prev) => ({ ...prev, [unit]: checked }))
  }

  const handleReviewerChange = (unit: string, reviewerId: string) => {
    setReviewers((prev) => ({ ...prev, [unit]: reviewerId }))
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
            {displayUnits.map((unit, i) => (
              <TableRow key={unit}>
                <TableCell className="text-center">
                  <Checkbox
                    checked={!!selectedUnits[unit]}
                    onCheckedChange={(checked) => handleUnitToggle(unit, checked as boolean)}
                    aria-label={`Include ${unit} in workflow`}
                  />
                </TableCell>
                <TableCell className="font-medium text-sm">{unit}</TableCell>
                <TableCell className="text-sm">
                  <Select
                    value={reviewers[unit] || ''}
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
