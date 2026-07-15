import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
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
import { formatDate } from '@/lib/utils'

export default function TravelPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    setLoading(true)
    const { data, error } = await (supabase as any)
      .from('travel_authorizations')
      .select(
        `*, traveler:profiles!travel_authorizations_traveler_id_fkey(name), programme:programmes(name), linked_activity:activities(activity_name, task_number)`,
      )
      .order('created_at', { ascending: false })
    if (error) toast({ title: 'Error fetching travel authorizations', variant: 'destructive' })
    setRecords(data || [])
    setLoading(false)
  }

  const filtered = records.filter(
    (r) =>
      (r.travel_authorization_number || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.traveler?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.destination || '').toLowerCase().includes(search.toLowerCase()),
  )

  const fmtDate = (d: string | null) => (d ? formatDate(d) : '-')

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel Authorization</h1>
          <p className="text-muted-foreground">Create and manage travel requests digitally.</p>
        </div>
        <Button onClick={() => navigate('/travel/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Travel Authorization
        </Button>
      </div>

      <div className="bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:w-96 mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by TA number, traveler, destination..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">TA Number</TableHead>
                <TableHead>Traveler</TableHead>
                <TableHead>Travel Type</TableHead>
                <TableHead>Linked Activity</TableHead>
                <TableHead>Programme</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Travel Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p>Loading travel authorizations...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                    {search
                      ? 'No results found.'
                      : 'No travel authorizations yet. Create one to get started.'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r) => (
                  <TableRow
                    key={r.id}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/travel/${r.id}`)}
                  >
                    <TableCell className="font-medium text-xs">
                      {r.travel_authorization_number || r.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="text-sm">{r.traveler?.name || '-'}</TableCell>
                    <TableCell className="text-sm">{r.travel_type || '-'}</TableCell>
                    <TableCell className="text-sm">
                      {r.linked_activity
                        ? `${r.linked_activity.task_number || ''} ${r.linked_activity.activity_name || ''}`.trim() ||
                          '-'
                        : '-'}
                    </TableCell>
                    <TableCell className="text-sm">{r.programme?.name || '-'}</TableCell>
                    <TableCell className="text-sm">{r.destination || '-'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {fmtDate(r.travel_start_date)} → {fmtDate(r.travel_end_date)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={r.status === 'Draft' ? 'secondary' : 'default'}
                        className="text-xs"
                      >
                        {r.status || 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.current_stage || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/travel/${r.id}`)
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
