import { useParams, Navigate } from 'react-router-dom'
import { useAppContext } from '@/stores/main'
import { TaskPropertiesForm } from './components/TaskPropertiesForm'
import { TaskActivityTabs } from './components/TaskActivityTabs'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function TaskDetailPage() {
  const { id } = useParams()
  const { tasks } = useAppContext()
  const navigate = useNavigate()

  const task = tasks?.find((t) => t.id === id || t.task_number === id)

  if (!task) {
    return (
      <div className="p-4 lg:p-6 space-y-4 max-w-[1600px] mx-auto min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold tracking-tight">Task not found</h2>
        <p className="text-muted-foreground">
          The task "{id}" could not be found or is still loading.
        </p>
        <Button onClick={() => navigate('/')} variant="outline" className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-[1600px] mx-auto min-h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight">Activity Matrix</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 items-start mb-6">
        <div className="xl:col-span-4 2xl:col-span-3">
          <TaskPropertiesForm task={task} />
        </div>
        <div className="xl:col-span-8 2xl:col-span-9 h-[calc(100vh-10rem)] min-h-[600px]">
          <TaskActivityTabs task={task} />
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground mt-auto pt-4">Version 1.0.0</div>
    </div>
  )
}
