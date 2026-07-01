import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getActivity, updateActivity } from '@/services/activities'
import { getMasterData } from '@/services/master-data'
import { ActivityTabs } from './components/TaskActivityTabs'
import { ArrowLeft, ArrowRight, CheckCircle2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const STAGES = ['Preparation', 'Feedback', 'Review', 'Approval', 'Done']

export default function ActivityDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [activity, setActivity] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [masterData, setMasterData] = useState<any>(null)

  useEffect(() => {
    getMasterData().then(setMasterData)
  }, [])

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
      supabase.removeChannel(subAct)
    }
  }, [activity?.id])

  const currentStage = activity?.current_stage || 'Preparation'
  const currentStageIndex = STAGES.indexOf(currentStage)
  const nextStage = STAGES[currentStageIndex + 1]

  const canAdvance = useMemo(() => {
    if (currentStage === 'Done') return false
    if (currentStage === 'Preparation') return true
    if (currentStage === 'Feedback') return true

    if (currentStage === 'Review') {
      const checks: boolean[] = []
      if (activity?.wf_team_leader_required) checks.push(!!activity.reviewer_team_leader_approved)
      if (activity?.wf_head_reviewer_required) checks.push(!!activity.reviewer_head_approved)
      if (activity?.wf_cpo_reviewer_required) checks.push(!!activity.reviewer_cpo_approved)
      if (checks.length === 0) return true
      return checks.every(Boolean)
    }

    if (currentStage === 'Approval') {
      const checks: boolean[] = []
      if (activity?.wf_head_approver_required) checks.push(!!activity.approver_head_approved)
      if (activity?.wf_cpo_approver_required) checks.push(!!activity.approver_cpo_approved)
      if (activity?.wf_sg_approver_required) checks.push(!!activity.approver_sg_approved)
      if (checks.length === 0) return true
      return checks.every(Boolean)
    }

    return true
  }, [currentStage, activity])

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

  const projectName = useMemo(() => {
    if (!activity?.project_id || !masterData?.projects) return 'Project'
    return masterData.projects.find((p: any) => p.id === activity.project_id)?.name || 'Project'
  }, [activity?.project_id, masterData])

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
    <div className="p-4 lg:p-6 space-y-4 max-w-[1600px] w-full mx-auto min-h-[calc(100vh-3.5rem)] flex flex-col animate-fade-in">
      <div className="mb-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/tasks">Projects</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/tasks?project=${activity.project_id}`}>{projectName}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {activity.activity_name || activity.task_number || 'Activity Details'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight">
            {activity.activity_name || 'Activity Matrix'}
          </h1>
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

      <div className="flex-1 w-full mb-6 flex flex-col">
        <ActivityTabs activity={activity} onUpdate={setActivity} />
      </div>
    </div>
  )
}
