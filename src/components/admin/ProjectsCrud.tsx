import { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, Trash2, Edit2, Check, X } from 'lucide-react'

export function ProjectsCrud() {
  const [data, setData] = useState<any[]>([])
  const [programmes, setProgrammes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [newItemName, setNewItemName] = useState('')
  const [newItemProg, setNewItemProg] = useState('none')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editProg, setEditProg] = useState('none')
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [projRes, progRes] = await Promise.all([
      supabase.from('projects').select('*, programmes(name)').order('created_at'),
      supabase.from('programmes').select('*').order('name'),
    ])
    if (projRes.data) setData(projRes.data)
    if (progRes.data) setProgrammes(progRes.data)
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName) return
    const payload = { name: newItemName, programme_id: newItemProg === 'none' ? null : newItemProg }
    const { data: res, error } = await supabase
      .from('projects')
      .insert(payload)
      .select('*, programmes(name)')
      .single()

    if (error) toast({ title: 'Error adding project', variant: 'destructive' })
    else {
      setData([...data, res])
      setNewItemName('')
      setNewItemProg('none')
      toast({ title: 'Added successfully' })
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) toast({ title: 'Error deleting project', variant: 'destructive' })
    else {
      setData(data.filter((d) => d.id !== id))
      toast({ title: 'Deleted successfully' })
    }
  }

  const saveEdit = async (id: string) => {
    const payload = { name: editName, programme_id: editProg === 'none' ? null : editProg }
    const { data: res, error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', id)
      .select('*, programmes(name)')
      .single()

    if (error) toast({ title: 'Error updating project', variant: 'destructive' })
    else {
      setData(data.map((d) => (d.id === id ? res : d)))
      setEditingId(null)
      toast({ title: 'Updated successfully' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-medium">Projects Configuration</h3>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
          <Input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Project Name"
            className="w-full sm:w-48"
          />
          <Select value={newItemProg} onValueChange={setNewItemProg}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Programme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Programme</SelectItem>
              {programmes.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={!newItemName}>
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Associated Programme</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  {editingId === item.id ? (
                    <>
                      <TableCell>
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                      </TableCell>
                      <TableCell>
                        <Select value={editProg} onValueChange={setEditProg}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Programme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {programmes.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => saveEdit(item.id)}>
                          <Check className="w-4 h-4 text-emerald-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.programmes?.name || '-'}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingId(item.id)
                            setEditName(item.name)
                            setEditProg(item.programme_id || 'none')
                          }}
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    No projects found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
