import { useState, useEffect } from 'react'
import { StatCards } from './dashboard/components/StatCards'
import { ProgressBoard } from './dashboard/components/ProgressBoard'
import { DashboardTaskTable } from './dashboard/components/DashboardTaskTable'
import { getActivities } from '@/services/activities'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'

const Index = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  if (loading) return <div className="p-6">Loading dashboard...</div>

  const myTasks = tasks.filter((t) => t.project_owner_id === user?.id)
  const programmeTasks = tasks.filter((t) => t.programme_id === profile?.programme_id)

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-1 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Monitor system-wide activity progress and your assigned activities.
        </p>
      </div>

      <StatCards tasks={tasks} />
      <ProgressBoard tasks={tasks} />

      <div className="grid gap-6">
        <DashboardTaskTable title="Assigned to Me" tasks={myTasks} />
        <DashboardTaskTable title="Programme Activities" tasks={programmeTasks} />
      </div>
    </div>
  )
}

export default Index
