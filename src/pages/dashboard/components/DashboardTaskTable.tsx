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

  const filteredActivities = tasks.filter(
    (a) =>
      (a.activity_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.task_number || a.id).toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="bg-muted/30 py-3 px-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <div className="relative w-full sm:w-[250px]">
          <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Filter activities..."
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
            {filteredActivities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground text-sm">
                  No activities found.
                </TableCell>
              </TableRow>
            ) : (
              filteredActivities.map((activity) => (
                <TableRow
                  key={activity.id}
                  className="cursor-pointer hover:bg-slate-50 dark:hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/tasks/${activity.task_number || activity.id}`)}
                >
                  <TableCell className="font-medium text-xs">
                    {activity.task_number || activity.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold border-0 ${getStatusColor(activity.status)}`}
                    >
                      {activity.status || 'To Do'}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="max-w-[200px] truncate text-sm"
                    title={activity.activity_name}
                  >
                    {activity.activity_name}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {activity.type?.name || '-'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden md:table-cell">
                    -
                  </TableCell>
                  <TableCell className="text-xs hidden sm:table-cell">
                    {activity.project_owner?.name || '-'}
                  </TableCell>
                  <TableCell className="text-xs hidden lg:table-cell whitespace-nowrap">
                    {activity.end_date || '-'}
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
