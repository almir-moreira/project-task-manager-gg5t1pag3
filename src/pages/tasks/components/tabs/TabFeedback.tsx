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
import { AlertCircle, Loader2 } from 'lucide-react'

interface Profile {
  id: string
  name: string | null
}

interface Workflow {
  id: string
  role: string
  stage: number
}

interface ActivityWorkflow {
  id: string
  workflow_id: string
  reviewer_id: string | null
  status: string
  completed_at: string | null
}

export function TabFeedback({ activity }: { activity?: any }) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [activeWorkflows, setActiveWorkflows] = useState<ActivityWorkflow[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (!activity?.id) return

      const [profilesRes, workflowsRes, activeRes] = await Promise.all([
        supabase.from('profiles').select('id, name').order('name'),
        supabase.from('workflows').select('*').order('stage'),
        supabase.from('activity_workflows').select('*').eq('activity_id', activity.id),
      ])

      if (profilesRes.data) setProfiles(profilesRes.data)
      if (workflowsRes.data) setWorkflows(workflowsRes.data)
      if (activeRes.data) setActiveWorkflows(activeRes.data)
      setLoading(false)
    }

    fetchData()
  }, [activity?.id])

  const handleUnitToggle = async (workflow: Workflow, checked: boolean) => {
    if (!activity?.id) return

    try {
      if (checked) {
        const { data, error } = await supabase
          .from('activity_workflows')
          .insert({
            activity_id: activity.id,
            workflow_id: workflow.id,
            status: 'Pending',
          })
          .select()
          .single()

        if (error) throw error
        if (data) setActiveWorkflows((prev) => [...prev, data])
      } else {
        const existing = activeWorkflows.find((aw) => aw.workflow_id === workflow.id)
        if (existing) {
          const { error } = await supabase.from('activity_workflows').delete().eq('id', existing.id)

          if (error) throw error
          setActiveWorkflows((prev) => prev.filter((aw) => aw.id !== existing.id))
        }
      }
    } catch (e) {
      console.error(e)
      toast({ title: 'Error saving workflow inclusion', variant: 'destructive' })
    }
  }

  const handleReviewerChange = async (workflowId: string, reviewerId: string) => {
    const active = activeWorkflows.find((aw) => aw.workflow_id === workflowId)
    if (!active) return

    try {
      const { error } = await supabase
        .from('activity_workflows')
        .update({ reviewer_id: reviewerId })
        .eq('id', active.id)

      if (error) throw error
      setActiveWorkflows((prev) =>
        prev.map((aw) => (aw.id === active.id ? { ...aw, reviewer_id: reviewerId } : aw)),
      )
    } catch (e) {
      toast({ title: 'Error saving reviewer', variant: 'destructive' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (workflows.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/20 rounded-lg border border-dashed border-border">
        <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">No workflow stages configured.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Please add workflow stages in Administration to manage them here.
        </p>
      </div>
    )
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
            {workflows.map((workflow) => {
              const active = activeWorkflows.find((aw) => aw.workflow_id === workflow.id)
              const isChecked = !!active
              const reviewerId = active?.reviewer_id || ''

              return (
                <TableRow key={workflow.id}>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => handleUnitToggle(workflow, checked as boolean)}
                      aria-label={`Include ${workflow.role} in workflow`}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-sm">{workflow.role}</TableCell>
                  <TableCell className="text-sm">
                    <Select
                      disabled={!isChecked}
                      value={reviewerId}
                      onValueChange={(val) => handleReviewerChange(workflow.id, val)}
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
                    {active ? (
                      <Badge
                        variant="outline"
                        className={
                          active.status === 'Approved'
                            ? 'text-emerald-600 border-emerald-200 bg-emerald-50'
                            : active.status === 'Rejected'
                              ? 'text-red-600 border-red-200 bg-red-50'
                              : 'text-amber-600 border-amber-200 bg-amber-50'
                        }
                      >
                        {active.status}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">Not included</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {active?.completed_at ? active.completed_at.substring(0, 10) : '-'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {active ? 'Awaiting response.' : ''}
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
