import { StatCards } from './dashboard/components/StatCards'
import { ProgressBoard } from './dashboard/components/ProgressBoard'
import { DashboardTaskTable } from './dashboard/components/DashboardTaskTable'
import { useAppContext } from '@/stores/main'

const Index = () => {
  const { tasks, currentUser } = useAppContext()

  const myTasks = tasks.filter((t) => t.projectOwnerId === currentUser.id)
  const programmeTasks = tasks.filter((t) => t.programme === currentUser.programme)

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-1 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Monitor system-wide task progress and your assigned activities.
        </p>
      </div>

      <StatCards />
      <ProgressBoard />

      <div className="grid gap-6">
        <DashboardTaskTable title="My Tasks" tasks={myTasks} />
        <DashboardTaskTable title="Programme Tasks" tasks={programmeTasks} />
      </div>
    </div>
  )
}

export default Index
