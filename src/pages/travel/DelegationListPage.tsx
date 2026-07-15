import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { TravelRequestWizard } from './components/TravelRequestWizard'
import { getDelegationPackages } from '@/services/delegations'

export default function DelegationListPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [wizardOpen, setWizardOpen] = useState(false)

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const data = await getDelegationPackages()
      setRecords(data)
    } catch {
      toast({ title: 'Error fetching delegation packages', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const filtered = records.filter(
    (r) =>
      (r.delegation_package_number || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.event_title || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.location || '').toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delegation Proposals</h1>
          <p className="text-muted-foreground">Manage event-based travel delegation proposals.</p>
        </div>
        <Button onClick={() => navigate('/travel/delegations/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Delegation Proposal
        </Button>
      </div>

      <div className="bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:w-96 mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by package number, event title, location..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Package Number</TableHead>
                <TableHead>Event Title</TableHead>
                <TableHead>Linked Activity</TableHead>
                <TableHead>Programme</TableHead>
                <TableHead>Event Dates</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="text-center">Travelers</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p>Loading delegation proposals...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                    {search
                      ? 'No results found.'
                      : 'No delegation proposals yet. Create one to get started.'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r) => (
                  <TableRow
                    key={r.id}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/travel/delegations/${r.id}`)}
                  >
                    <TableCell className="font-medium text-xs">
                      {r.delegation_package_number || r.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="text-sm">{r.event_title || '-'}</TableCell>
                    <TableCell className="text-sm">
                      {r.linked_activity
                        ? `${r.linked_activity.task_number || ''} ${
                            r.linked_activity.activity_name || ''
                          }`.trim() || '-'
                        : '-'}
                    </TableCell>
                    <TableCell className="text-sm">{r.programme?.name || '-'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.event_dates || '-'}
                    </TableCell>
                    <TableCell className="text-sm">{r.location || '-'}</TableCell>
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
                    <TableCell className="text-sm text-center">
                      {r.total_proposed_travelers ?? 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/travel/delegations/${r.id}`)
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <TravelRequestWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </div>
  )
}
