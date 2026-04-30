import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Check, X, Loader2, ArrowLeft } from 'lucide-react'
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
  step: number
  category: string
}

export default function AdminPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState('')
  const [step, setStep] = useState('')
  const [category, setCategory] = useState('Review')
  const { toast } = useToast()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRole, setEditRole] = useState('')
  const [editStep, setEditStep] = useState('')
  const [editCategory, setEditCategory] = useState('')

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('workflows').select('*').order('step')

    if (error) {
      toast({ title: 'Error fetching workflows', variant: 'destructive' })
    } else {
      setWorkflows(data || [])
    }
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role || !step || !category) return

    const { data, error } = await supabase
      .from('workflows')
      .insert({ role, step: parseInt(step), category, stage: parseInt(step) })
      .select()
      .single()

    if (error) {
      toast({ title: 'Error adding workflow', variant: 'destructive' })
    } else if (data) {
      setWorkflows([...workflows, data].sort((a, b) => a.step - b.step))
      setRole('')
      setStep('')
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

  const startEdit = (wf: Workflow) => {
    setEditingId(wf.id)
    setEditRole(wf.role)
    setEditStep(String(wf.step ?? wf.stage))
    setEditCategory(wf.category || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async (id: string) => {
    if (!editRole || !editStep || !editCategory) return

    const { data, error } = await supabase
      .from('workflows')
      .update({
        role: editRole,
        step: parseInt(editStep),
        category: editCategory,
        stage: parseInt(editStep),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      toast({ title: 'Error updating workflow', variant: 'destructive' })
    } else if (data) {
      setWorkflows(workflows.map((w) => (w.id === id ? data : w)).sort((a, b) => a.step - b.step))
      setEditingId(null)
      toast({ title: 'Workflow updated successfully' })
    }
  }

  const existingCategories = Array.from(new Set(workflows.map((w) => w.category).filter(Boolean)))
  const defaultCategories = ['Review', 'Approval', 'Feedback']
  const allCategories = Array.from(new Set([...defaultCategories, ...existingCategories]))

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
            Manage the logical flow, sequencing, and categories of your review stages.
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
              <label className="text-sm font-medium">Step Order</label>
              <Input
                type="number"
                value={step}
                onChange={(e) => setStep(e.target.value)}
                placeholder="e.g. 1"
                min="1"
              />
            </div>
            <div className="sm:w-48 space-y-2 w-full">
              <label className="text-sm font-medium">Category</label>
              <Input
                list="category-list"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Select or type..."
              />
              <datalist id="category-list">
                {allCategories.map((c) => (
                  <option key={c as string} value={c as string} />
                ))}
              </datalist>
            </div>
            <Button
              type="submit"
              disabled={!role || !step || !category}
              className="w-full sm:w-auto h-10"
            >
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
                  <TableHead className="w-[100px]">Step</TableHead>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflows.map((wf) => (
                  <TableRow key={wf.id}>
                    {editingId === wf.id ? (
                      <>
                        <TableCell>
                          <Input
                            type="number"
                            value={editStep}
                            onChange={(e) => setEditStep(e.target.value)}
                            className="w-20 h-8"
                            min="1"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            list="category-list"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => saveEdit(wf.id)}
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8 w-8"
                            disabled={!editRole || !editStep || !editCategory}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={cancelEdit}
                            className="text-muted-foreground hover:text-foreground h-8 w-8"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-medium">{wf.step ?? wf.stage}</TableCell>
                        <TableCell>{wf.role}</TableCell>
                        <TableCell>{wf.category || 'Review'}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEdit(wf)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(wf.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
                {workflows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
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
