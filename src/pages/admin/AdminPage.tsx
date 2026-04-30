import { useState, useEffect } from 'react'
import { Plus, Trash2, Loader2, ArrowLeft } from 'lucide-react'
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
import { useToast } from '@/hooks/use-toast'
import { Link } from 'react-router-dom'

interface Workflow {
  id: string
  role: string
  stage: number
}

export default function AdminPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState('')
  const [stage, setStage] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('workflows').select('*').order('stage')

    if (error) {
      toast({ title: 'Error fetching workflows', variant: 'destructive' })
    } else {
      setWorkflows(data || [])
    }
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role || !stage) return

    const { data, error } = await supabase
      .from('workflows')
      .insert({ role, stage: parseInt(stage) })
      .select()
      .single()

    if (error) {
      toast({ title: 'Error adding workflow', variant: 'destructive' })
    } else if (data) {
      setWorkflows([...workflows, data].sort((a, b) => a.stage - b.stage))
      setRole('')
      setStage('')
      toast({ title: 'Workflow added successfully' })
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('workflows').delete().eq('id', id)
    if (error) {
      toast({ title: 'Error deleting workflow', variant: 'destructive' })
    } else {
      setWorkflows(workflows.filter((w) => w.id !== id))
      toast({ title: 'Workflow deleted successfully' })
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-muted/20">
          <h2 className="text-xl font-semibold">Workflow Stages Configuration</h2>
          <p className="text-muted-foreground mt-1">
            Manage the logical flow and sequencing of your review stages.
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row items-end gap-4 mb-8">
            <div className="flex-1 space-y-2 w-full">
              <label className="text-sm font-medium">Role Name</label>
              <Input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Legal, Finance"
              />
            </div>
            <div className="sm:w-32 space-y-2 w-full">
              <label className="text-sm font-medium">Stage Order</label>
              <Input
                type="number"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                placeholder="e.g. 1"
                min="1"
              />
            </div>
            <Button type="submit" disabled={!role || !stage} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Add Stage
            </Button>
          </form>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Stage</TableHead>
                  <TableHead>Role Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflows.map((wf) => (
                  <TableRow key={wf.id}>
                    <TableCell className="font-medium">{wf.stage}</TableCell>
                    <TableCell>{wf.role}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(wf.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {workflows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      No workflow stages configured yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}
