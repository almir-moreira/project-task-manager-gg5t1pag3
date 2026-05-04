import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { updateActivity } from '@/services/activities'
import { Lock } from 'lucide-react'

export function TabApproval({
  activity,
  onUpdate,
}: {
  activity?: any
  onUpdate?: (a: any) => void
}) {
  const [profiles, setProfiles] = useState<any[]>([])
  const [workflows, setWorkflows] = useState<any[]>([])
  const [activityWorkflows, setActivityWorkflows] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activity?.id) return

    const fetchData = async () => {
      const [profilesRes, workflowsRes, awRes] = await Promise.all([
        supabase.from('profiles').select('id, name, email').order('name'),
        supabase
          .from('workflows')
          .select('*')
          .eq('category', 'Approval')
          .order('stage')
          .order('step'),
        supabase.from('activity_workflows').select('*').eq('activity_id', activity.id),
      ])

      if (profilesRes.data) setProfiles(profilesRes.data)
      if (workflowsRes.data) {
        const sorted = [...workflowsRes.data].sort((a, b) => {
          if (a.stage !== b.stage) return a.stage - b.stage
          return (a.step || 0) - (b.step || 0)
        })
        setWorkflows(sorted)
      }

      const awMap: Record<string, any> = {}
      if (awRes.data) {
        awRes.data.forEach((aw) => {
          awMap[aw.workflow_id] = aw
        })
      }
      setActivityWorkflows(awMap)
      setLoading(false)
    }

    fetchData()
  }, [activity?.id])

  const handleActivityChange = async (field: string, val: any) => {
    if (!activity || !onUpdate) return
    try {
      const updated = await updateActivity(activity.id, { [field]: val } as any)
      onUpdate(updated)
    } catch (e) {
      console.error(e)
    }
  }

  const handleWorkflowChange = async (workflowId: string, field: string, val: any) => {
    if (!activity) return

    const current = activityWorkflows[workflowId] || {
      activity_id: activity.id,
      workflow_id: workflowId,
      status: 'Pending',
    }

    const updated = { ...current, [field]: val }
    setActivityWorkflows((prev) => ({ ...prev, [workflowId]: updated }))

    try {
      const { data } = await supabase
        .from('activity_workflows')
        .upsert(
          {
            activity_id: activity.id,
            workflow_id: workflowId,
            reviewer_id: updated.reviewer_id,
            status: updated.status,
            comments: updated.comments,
            completed_at: updated.completed_at,
          },
          { onConflict: 'activity_id, workflow_id' },
        )
        .select()
        .single()

      if (data) {
        setActivityWorkflows((prev) => ({ ...prev, [workflowId]: data }))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const isStepEnabled = (index: number) => {
    if (index === 0) return true
    const prevWf = workflows[index - 1]
    const prevAw = activityWorkflows[prevWf.id]
    return prevAw && (prevAw.status === 'Approved' || prevAw.status === 'Concluído')
  }

  if (!activity) return null

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Approval Stage</h3>
        <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
          Sequential workflow enforced
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 max-w-2xl">
        <div className="grid gap-2">
          <Label>Urgency of Approval</Label>
          <Select
            value={activity.urgency_of_approval || 'Standard'}
            onValueChange={(val) => handleActivityChange('urgency_of_approval', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select urgency..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Nature of Urgency</Label>
          <Input
            defaultValue={activity.nature_of_urgency || ''}
            onBlur={(e) =>
              e.target.value !== activity.nature_of_urgency &&
              handleActivityChange('nature_of_urgency', e.target.value)
            }
            placeholder="Describe nature of urgency..."
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Final Approval Steps</h3>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[150px]">Role</TableHead>
                <TableHead className="w-[200px]">Approver</TableHead>
                <TableHead className="min-w-[200px]">Comments</TableHead>
                <TableHead className="w-[150px]">Date</TableHead>
                <TableHead className="text-center w-[100px]">Approved</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : workflows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No approval workflows configured. Please add them in Administration.
                  </TableCell>
                </TableRow>
              ) : (
                workflows.map((wf, index) => {
                  const aw = activityWorkflows[wf.id] || {}
                  const enabled = isStepEnabled(index)

                  return (
                    <TableRow key={wf.id} className={!enabled ? 'bg-muted/30 opacity-60' : ''}>
                      <TableCell className="font-medium text-sm">
                        <div className="flex items-center gap-2">
                          {!enabled && <Lock className="w-3 h-3 text-muted-foreground" />}
                          {wf.role}
                        </div>
                      </TableCell>
                      <TableCell className="align-top pt-4">
                        <Select
                          disabled={!enabled}
                          value={aw.reviewer_id || 'unassigned'}
                          onValueChange={(val) =>
                            handleWorkflowChange(
                              wf.id,
                              'reviewer_id',
                              val === 'unassigned' ? null : val,
                            )
                          }
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select user..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            {profiles.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name || p.email || 'Unknown'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="align-top py-3">
                        <Textarea
                          disabled={!enabled}
                          className="min-h-[60px] resize-y"
                          defaultValue={aw.comments || ''}
                          onBlur={(e) =>
                            e.target.value !== aw.comments &&
                            handleWorkflowChange(wf.id, 'comments', e.target.value)
                          }
                          placeholder="Add comments..."
                        />
                      </TableCell>
                      <TableCell className="align-top pt-4">
                        <Input
                          disabled={!enabled}
                          type="date"
                          className="h-9"
                          defaultValue={aw.completed_at ? aw.completed_at.split('T')[0] : ''}
                          onBlur={(e) => {
                            const val = e.target.value
                            if (val !== (aw.completed_at?.split('T')[0] || '')) {
                              handleWorkflowChange(
                                wf.id,
                                'completed_at',
                                val ? new Date(val).toISOString() : null,
                              )
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="text-center align-top pt-5">
                        <div className="flex justify-center">
                          <Checkbox
                            disabled={!enabled}
                            checked={aw.status === 'Approved' || aw.status === 'Concluído'}
                            onCheckedChange={(v) =>
                              handleWorkflowChange(wf.id, 'status', v ? 'Approved' : 'Pending')
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
