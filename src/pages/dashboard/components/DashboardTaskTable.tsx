import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { getStatusColor } from '@/lib/status-colors'
import { Search } from 'lucide-react'

interface DashboardTaskTableProps {
  title: string
  tasks: any[]
}

export function DashboardTaskTable({ title, tasks }: DashboardTaskTableProps) {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filteredTasks = tasks.filter(
    (t) =>
      (t.activity_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.task_number || t.id).toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="bg-muted/30 py-3 px-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <div className="relative w-full sm:w-[250px]">
          <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Filter tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs bg-background"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/10 hover:bg-muted/10">
              <TableHead className="w-[100px] font-medium text-xs">ID</TableHead>
              <TableHead className="font-medium text-xs">Status</TableHead>
              <TableHead className="font-medium text-xs">Description</TableHead>
              <TableHead className="font-medium text-xs">Category</TableHead>
              <TableHead className="font-medium text-xs hidden md:table-cell">Location</TableHead>
              <TableHead className="font-medium text-xs hidden sm:table-cell">Owner</TableHead>
              <TableHead className="font-medium text-xs hidden lg:table-cell">Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground text-sm">
                  No tasks found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow
                  key={task.id}
                  className="cursor-pointer hover:bg-slate-50 dark:hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/tasks/${task.task_number || task.id}`)}
                >
                  <TableCell className="font-medium text-xs">
                    {task.task_number || task.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold border-0 ${getStatusColor(task.status)}`}
                    >
                      {task.status || 'To Do'}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm" title={task.activity_name}>
                    {task.activity_name}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {task.type?.name || '-'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden md:table-cell">
                    -
                  </TableCell>
                  <TableCell className="text-xs hidden sm:table-cell">
                    {task.project_owner?.name || '-'}
                  </TableCell>
                  <TableCell className="text-xs hidden lg:table-cell whitespace-nowrap">
                    {task.end_date || '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
