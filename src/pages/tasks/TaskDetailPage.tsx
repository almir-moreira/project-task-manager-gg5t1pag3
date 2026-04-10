import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getActivity } from '@/services/activities'
import { ActivityPropertiesForm } from './components/TaskPropertiesForm'
import { ActivityTabs } from './components/TaskActivityTabs'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ActivityDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activity, setActivity] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      getActivity(id)
        .then(setActivity)
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) {
    return <div className="p-6">Loading activity...</div>
  }

  if (!activity) {
    return (
      <div className="p-4 lg:p-6 space-y-4 max-w-[1600px] mx-auto min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold tracking-tight">Activity not found</h2>
        <p className="text-muted-foreground">
          The activity "{id}" could not be found or is still loading.
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
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight">Activity Matrix</h1>
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
