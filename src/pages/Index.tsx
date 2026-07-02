import { useState, useEffect, useMemo } from 'react'
import { StatCards } from './dashboard/components/StatCards'
import { DashboardTaskTable } from './dashboard/components/DashboardTaskTable'
import { ActivityMatrixCard } from './dashboard/components/ActivityMatrixCard'
import { getActivities } from '@/services/activities'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

const Index = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [allWorkflows, setAllWorkflows] = useState<any[]>([])
  const [allActivityWorkflows, setAllActivityWorkflows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [acts, { data: prof }] = await Promise.all([
          getActivities(),
          user
            ? supabase.from('profiles').select('*').eq('id', user.id).single()
            : Promise.resolve({ data: null }),
        ])
        setTasks(acts || [])
        setProfile(prof)

        const assignedIds = (acts || []).filter((a) => a.assignee_id === user?.id).map((a) => a.id)

        if (assignedIds.length > 0) {
          const [wfRes, awRes] = await Promise.all([
            supabase.from('workflows').select('id, role, activity_id'),
            supabase.from('activity_workflows').select('*').in('activity_id', assignedIds),
          ])
          setAllWorkflows(wfRes.data || [])
          setAllActivityWorkflows(awRes.data || [])
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
  const programmeTasks = useMemo(
    () => tasks.filter((t) => t.programme_id === profile?.programme_id),
    [tasks, profile],
  )

  const filteredMyTasks = useMemo(() => {
    if (!search) return myTasks
    const q = search.toLowerCase()
    return myTasks.filter(
      (t) =>
        (t.activity_name || '').toLowerCase().includes(q) ||
        (t.task_number || t.id).toLowerCase().includes(q),
    )
  }, [myTasks, search])

  const getWfMap = (activityId: string) =>
    allWorkflows
      .filter((w) => w.activity_id === activityId || w.activity_id === null)
      .reduce((acc, w) => ({ ...acc, [w.role]: w.id }), {} as Record<string, string>)

  const getAws = (activityId: string) =>
    allActivityWorkflows.filter((aw) => aw.activity_id === activityId)

  if (loading) return <div className="p-6">Loading dashboard...</div>

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-1 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Monitor system-wide activity progress and your assigned activities.
        </p>
      </div>

      <StatCards tasks={tasks} />

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
              />
            ))}
          </div>
        )}
      </div>

      <DashboardTaskTable title="Programme Activities" tasks={programmeTasks} />
    </div>
  )
}

export default Index
