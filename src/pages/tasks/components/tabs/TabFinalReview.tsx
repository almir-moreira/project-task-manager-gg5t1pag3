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

export function TabFinalReview({ activity }: { activity?: any }) {
  const [profiles, setProfiles] = useState<any[]>([])
  const [workflows, setWorkflows] = useState<any[]>([])
  const [activityWorkflows, setActivityWorkflows] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activity?.id) return

    const fetchData = async () => {
      const [profilesRes, workflowsRes, awRes] = await Promise.all([
        supabase.from('profiles').select('id, name, email').order('name'),
        supabase.from('workflows').select('*').eq('category', 'Review').order('step'),
        supabase.from('activity_workflows').select('*').eq('activity_id', activity.id),
      ])

      if (profilesRes.data) setProfiles(profilesRes.data)
      if (workflowsRes.data) setWorkflows(workflowsRes.data)

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

  const handleChange = async (workflowId: string, field: string, val: any) => {
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

  if (!activity) return null

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Final Review</h3>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[150px]">Role</TableHead>
              <TableHead className="w-[200px]">Reviewer</TableHead>
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
                  No review workflows configured. Please add them in Administration.
                </TableCell>
              </TableRow>
            ) : (
              workflows.map((wf) => {
                const aw = activityWorkflows[wf.id] || {}
                return (
                  <TableRow key={wf.id}>
                    <TableCell className="font-medium text-sm">{wf.role}</TableCell>
                    <TableCell className="align-top pt-4">
                      <Select
                        value={aw.reviewer_id || 'unassigned'}
                        onValueChange={(val) =>
                          handleChange(wf.id, 'reviewer_id', val === 'unassigned' ? null : val)
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
                        className="min-h-[60px] resize-y"
                        defaultValue={aw.comments || ''}
                        onBlur={(e) =>
                          e.target.value !== aw.comments &&
                          handleChange(wf.id, 'comments', e.target.value)
                        }
                        placeholder="Add comments..."
                      />
                    </TableCell>
                    <TableCell className="align-top pt-4">
                      <Input
                        type="date"
                        className="h-9"
                        defaultValue={aw.completed_at ? aw.completed_at.split('T')[0] : ''}
                        onBlur={(e) => {
                          const val = e.target.value
                          if (val !== (aw.completed_at?.split('T')[0] || '')) {
                            handleChange(
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
                          checked={aw.status === 'Approved'}
                          onCheckedChange={(v) =>
                            handleChange(wf.id, 'status', v ? 'Approved' : 'Pending')
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
  )
}
