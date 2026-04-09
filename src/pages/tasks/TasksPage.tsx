import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Filter } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { getActivities } from '@/services/activities'
import { getStatusColor } from '@/lib/status-colors'

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const data = await getActivities()
      setTasks(data || [])
    } catch (error: any) {
      toast({
        title: 'Error fetching activities',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          activity_name: 'New Activity',
          status: 'To Do',
          priority: 'Medium',
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: 'Activity created',
        description: 'You can now edit its details.',
      })
      navigate(`/tasks/${data.task_number || data.id}`)
    } catch (error: any) {
      toast({
        title: 'Error creating activity',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const filteredTasks = tasks.filter(
    (task) =>
      (task.activity_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.task_number || task.id).toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Matrix</h1>
          <p className="text-muted-foreground">
            Manage and track your activities across all programmes.
          </p>
        </div>
        <Button onClick={handleCreateTask}>
          <Plus className="w-4 h-4 mr-2" />
          New Activity
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search activities by ID or name..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="border rounded-md bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Activity Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p>Loading activities...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  {searchQuery
                    ? 'No activities found matching your search.'
                    : 'No activities found. Create one to get started.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow
                  key={task.id}
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/tasks/${task.task_number || task.id}`)}
                >
                  <TableCell className="font-medium text-xs">
                    {task.task_number || task.id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="font-medium text-sm">{task.activity_name}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                    >
                      {task.status || 'To Do'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        task.priority === 'High' || task.priority === 'Urgent'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {task.priority || 'Medium'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                      <Link to={`/tasks/${task.task_number || task.id}`}>Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
