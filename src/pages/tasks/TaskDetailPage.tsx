import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getActivity, updateActivity } from '@/services/activities'
import { ActivityPropertiesForm } from './components/TaskPropertiesForm'
import { ActivityTabs } from './components/TaskActivityTabs'
import { ArrowLeft, ArrowRight, CheckCircle2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

const STAGES = ['Preparation', 'Feedback', 'Review', 'Approval', 'Done']

export default function ActivityDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [activity, setActivity] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [workflows, setWorkflows] = useState<any[]>([])
  const [activityWorkflows, setActivityWorkflows] = useState<any[]>([])

  useEffect(() => {
    if (id) {
      getActivity(id)
        .then(setActivity)
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [id])

  useEffect(() => {
    if (!activity?.id) return

    const fetchAw = async () => {
      const [wfRes, awRes] = await Promise.all([
        supabase.from('workflows').select('*'),
        supabase.from('activity_workflows').select('*').eq('activity_id', activity.id),
      ])
      if (wfRes.data) setWorkflows(wfRes.data)
      if (awRes.data) setActivityWorkflows(awRes.data)
    }

    fetchAw()

    const subAw = supabase
      .channel(`aw_${activity.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_workflows',
          filter: `activity_id=eq.${activity.id}`,
        },
        fetchAw,
      )
      .subscribe()

    const subAct = supabase
      .channel(`act_${activity.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'activities', filter: `id=eq.${activity.id}` },
        (payload) => {
          setActivity((prev: any) => ({ ...prev, ...payload.new }))
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subAw)
      supabase.removeChannel(subAct)
    }
  }, [activity?.id])

  const currentStage = activity?.current_stage || 'Preparation'
  const currentStageIndex = STAGES.indexOf(currentStage)
  const nextStage = STAGES[currentStageIndex + 1]

  const canAdvance = useMemo(() => {
    if (currentStage === 'Done') return false
    if (currentStage === 'Preparation') return true

    if (currentStage === 'Feedback') {
      const activeFeedbackWfs = activityWorkflows.filter((aw) => {
        const wf = workflows.find((w) => w.id === aw.workflow_id)
        return wf?.category === 'Feedback'
      })
      if (activeFeedbackWfs.length === 0) return true
      return activeFeedbackWfs.every((aw) => aw.status === 'Approved' || aw.status === 'Concluído')
    }

    if (currentStage === 'Review' || currentStage === 'Approval') {
      const mandatoryWfs = workflows.filter((w) => w.category === currentStage)
      if (mandatoryWfs.length === 0) return true

      return mandatoryWfs.every((wf) => {
        const aw = activityWorkflows.find((a) => a.workflow_id === wf.id)
        return aw && (aw.status === 'Approved' || aw.status === 'Concluído')
      })
    }

    return true
  }, [currentStage, workflows, activityWorkflows])

  const handleAdvanceStage = async () => {
    if (!canAdvance || !nextStage) return
    try {
      const updated = await updateActivity(activity.id, {
        current_stage: nextStage,
        stage_started_at: new Date().toISOString(),
      } as any)
      setActivity(updated)
      toast({ title: `Advanced to ${nextStage} stage` })
    } catch (e) {
      toast({ title: 'Error advancing stage', variant: 'destructive' })
    }
  }

  if (loading) {
    return <div className="p-6 flex justify-center text-muted-foreground">Loading activity...</div>
  }

  if (!activity) {
    return (
      <div className="p-4 lg:p-6 space-y-4 max-w-[1600px] mx-auto min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold tracking-tight">Activity not found</h2>
        <p className="text-muted-foreground">
          The activity could not be found or is still loading.
        </p>
        <Button onClick={() => navigate('/')} variant="outline" className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-[1600px] mx-auto min-h-[calc(100vh-3.5rem)] flex flex-col animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight">Activity Matrix</h1>
          <Badge
            variant="outline"
            className="ml-2 font-medium bg-blue-50 text-blue-700 border-blue-200"
          >
            {currentStage} Stage
          </Badge>
        </div>

        {currentStage !== 'Done' && (
          <Button
            onClick={handleAdvanceStage}
            disabled={!canAdvance}
            className={`transition-all ${canAdvance ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-muted text-muted-foreground'}`}
          >
            {!canAdvance && <Lock className="w-4 h-4 mr-2" />}
            {canAdvance && <CheckCircle2 className="w-4 h-4 mr-2" />}
            Advance to {nextStage}
            {canAdvance && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 items-start mb-6">
        <div className="xl:col-span-4 2xl:col-span-3">
          <ActivityPropertiesForm activity={activity} onUpdate={setActivity} />
        </div>
        <div className="xl:col-span-8 2xl:col-span-9 h-[calc(100vh-10rem)] min-h-[600px]">
          <ActivityTabs activity={activity} onUpdate={setActivity} />
        </div>
      </div>
    </div>
  )
}
