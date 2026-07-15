import { useState, useEffect, useMemo, useCallback } from 'react'
import { DashboardTaskTable } from './dashboard/components/DashboardTaskTable'
import { ActivityMatrixCard } from './dashboard/components/ActivityMatrixCard'
import {
  DashboardFilterBar,
  DashboardFilters,
  DEFAULT_DASHBOARD_FILTERS,
} from './dashboard/components/DashboardFilterBar'
import { getActivities } from '@/services/activities'
import { useAuth } from '@/hooks/use-auth'
import { isGlobalViewRole } from '@/lib/permissions'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Search, AlertCircle } from 'lucide-react'
import { deriveIndicators, ActivityIndicators } from '@/lib/dashboard-indicators'
import { sortActivitiesByDoneStatus } from '@/lib/stage-aware-workflow'

const Index = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [programmeName, setProgrammeName] = useState<string | null>(null)
  const [allWorkflows, setAllWorkflows] = useState<any[]>([])
  const [allActivityWorkflows, setAllActivityWorkflows] = useState<any[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [taskTypes, setTaskTypes] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_DASHBOARD_FILTERS)

  const isGlobalView = useMemo(() => {
    if (!profile) return false
    return isGlobalViewRole({
      id: user?.id || '',
      role: profile.role,
      units: [],
      programme_id: profile.programme_id || null,
    })
  }, [profile, user])

  const hasProgramme = Boolean(profile?.programme_id)

  useEffect(() => {
    async function load() {
      try {
        const { data: prof } = user
          ? await supabase.from('profiles').select('*').eq('id', user.id).single()
          : { data: null }
        setProfile(prof)

        const [catsRes, typesRes] = await Promise.all([
          supabase.from('categories').select('id, name').order('name'),
          supabase.from('task_types').select('id, name').order('name'),
        ])
        setCategories(catsRes.data || [])
        setTaskTypes(typesRes.data || [])

        const globalView = isGlobalViewRole({
          id: user?.id || '',
          role: prof?.role || null,
          units: [],
          programme_id: prof?.programme_id || null,
        })

        if (!globalView && prof?.programme_id) {
          const { data: prog } = await supabase
            .from('programmes')
            .select('name')
            .eq('id', prof.programme_id)
            .single()
          setProgrammeName(prog?.name || null)
        }

        if (!globalView && !prof?.programme_id) {
          setTasks([])
        } else {
          const programmeId = globalView ? undefined : prof?.programme_id
          const acts = await getActivities(programmeId)
          setTasks(acts || [])

          if (acts && acts.length > 0) {
            const allIds = acts.map((a) => a.id)
            const [wfRes, awRes] = await Promise.all([
              supabase.from('workflows').select('id, role, activity_id'),
              supabase.from('activity_workflows').select('*').in('activity_id', allIds),
            ])
            setAllWorkflows(wfRes.data || [])
            setAllActivityWorkflows(awRes.data || [])
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const myTasks = useMemo(() => tasks.filter((t) => t.assignee_id === user?.id), [tasks, user])

  const programmeTasks = useMemo(() => {
    if (isGlobalView) return tasks
    return tasks.filter((t) => t.programme_id === profile?.programme_id)
  }, [tasks, profile, isGlobalView])

  const getWfMap = useCallback(
    (activityId: string) =>
      allWorkflows
        .filter((w) => w.activity_id === activityId || w.activity_id === null)
        .reduce((acc, w) => ({ ...acc, [w.role]: w.id }), {} as Record<string, string>),
    [allWorkflows],
  )

  const getAws = useCallback(
    (activityId: string) => allActivityWorkflows.filter((aw) => aw.activity_id === activityId),
    [allActivityWorkflows],
  )

  const indicatorsMap = useMemo(() => {
    const map = new Map<string, ActivityIndicators>()
    tasks.forEach((t) => {
      map.set(t.id, deriveIndicators(t, getAws(t.id), getWfMap(t.id)))
    })
    return map
  }, [tasks, getAws, getWfMap])

  const stages = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.current_stage).filter(Boolean) as string[])).sort(),
    [tasks],
  )
  const statuses = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.status || 'To Do'))).sort(),
    [tasks],
  )
  const assignees = useMemo(() => {
    const map = new Map<string, string>()
    tasks.forEach((t) => {
      if (t.assignee_id && t.assignee?.name) map.set(t.assignee_id, t.assignee.name)
    })
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [tasks])

  const filteredProgrammeTasks = useMemo(() => {
    let result = programmeTasks
    if (filters.stage) result = result.filter((t) => t.current_stage === filters.stage)
    if (filters.status) result = result.filter((t) => (t.status || 'To Do') === filters.status)
    if (filters.categoryId) result = result.filter((t) => t.category_id === filters.categoryId)
    if (filters.typeId) result = result.filter((t) => t.type_id === filters.typeId)
    if (filters.assigneeId) result = result.filter((t) => t.assignee_id === filters.assigneeId)
    if (filters.overdueOnly) result = result.filter((t) => indicatorsMap.get(t.id)?.isOverdue)
    if (filters.pendingFeedbackOnly)
      result = result.filter((t) => indicatorsMap.get(t.id)?.pendingFeedback)
    if (filters.pendingApprovalOnly)
      result = result.filter(
        (t) => indicatorsMap.get(t.id)?.pendingApproval || indicatorsMap.get(t.id)?.pendingReview,
      )
    return sortActivitiesByDoneStatus(result)
  }, [programmeTasks, filters, indicatorsMap])

  const filteredMyTasks = useMemo(() => {
    const q = search.toLowerCase()
    const result = !search
      ? myTasks
      : myTasks.filter(
          (t) =>
            (t.activity_name || '').toLowerCase().includes(q) ||
            (t.task_number || t.id).toLowerCase().includes(q),
        )
    return sortActivitiesByDoneStatus(result)
  }, [myTasks, search])

  const handleFilterChange = useCallback(
    (updater: (prev: DashboardFilters) => DashboardFilters) => setFilters((prev) => updater(prev)),
    [],
  )
  const handleReset = useCallback(() => setFilters(DEFAULT_DASHBOARD_FILTERS), [])

  const subtitle = useMemo(() => {
    if (isGlobalView) return 'Manage and track activities across all programmes.'
    if (!hasProgramme)
      return 'No programme is assigned to your profile. Please contact an administrator.'
    if (programmeName) return `Manage and track activities for ${programmeName}.`
    return 'Manage and track activities for your programme.'
  }, [isGlobalView, hasProgramme, programmeName])

  if (loading) return <div className="p-6">Loading dashboard...</div>

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-1 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">My Activity Matrix</h2>
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Filter activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs bg-background"
            />
          </div>
        </div>

        {filteredMyTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-lg">
            No assigned activities found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMyTasks.map((task) => (
              <ActivityMatrixCard
                key={task.id}
                activity={task}
                activityWorkflows={getAws(task.id)}
                wfMap={getWfMap(task.id)}
                indicators={indicatorsMap.get(task.id)}
              />
            ))}
          </div>
        )}
      </div>

      {!isGlobalView && !hasProgramme ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-lg bg-muted/20">
          <AlertCircle className="w-10 h-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">
            No programme is assigned to your profile.
          </p>
          <p className="text-sm text-muted-foreground mt-1">Please contact an administrator.</p>
        </div>
      ) : (
        <>
          <DashboardFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            stages={stages}
            statuses={statuses}
            categories={categories}
            taskTypes={taskTypes}
            assignees={assignees}
          />

          {!isGlobalView && hasProgramme && programmeTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm border border-dashed rounded-lg">
              No activities found for your programme.
            </div>
          ) : (
            <DashboardTaskTable
              title="Programme Activities"
              tasks={filteredProgrammeTasks}
              indicatorsMap={indicatorsMap}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Index
