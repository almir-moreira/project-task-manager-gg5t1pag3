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
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, Trash2, Edit2, Check, X } from 'lucide-react'

export function CodeNameCrud({ table, title }: { table: string; title: string }) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newCode, setNewCode] = useState('')
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCode, setEditCode] = useState('')
  const [editName, setEditName] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [table])

  const fetchData = async () => {
    setLoading(true)
    const { data: res } = await supabase.from(table).select('*').order('created_at')
    if (res) setData(res)
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCode || !newName) return
    const { data: res, error } = await supabase
      .from(table)
      .insert({ code: newCode, name: newName })
      .select()
      .single()
    if (error) toast({ title: 'Error adding item', variant: 'destructive' })
    else {
      setData([...data, res])
      setNewCode('')
      setNewName('')
      toast({ title: 'Added successfully' })
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) toast({ title: 'Error deleting item', variant: 'destructive' })
    else {
      setData(data.filter((d) => d.id !== id))
      toast({ title: 'Deleted successfully' })
    }
  }

  const saveEdit = async (id: string) => {
    const { data: res, error } = await supabase
      .from(table)
      .update({ code: editCode, name: editName })
      .eq('id', id)
      .select()
      .single()
    if (error) toast({ title: 'Error updating item', variant: 'destructive' })
    else {
      setData(data.map((d) => (d.id === id ? res : d)))
      setEditingId(null)
      toast({ title: 'Updated successfully' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-medium">{title} Configuration</h3>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
          <Input
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="Code"
            className="w-full sm:w-32"
          />
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`New ${title} Name...`}
            className="w-full sm:w-64"
          />
          <Button type="submit" disabled={!newCode || !newName}>
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
                <TableHead className="w-32">Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  {editingId === item.id ? (
                    <>
                      <TableCell>
                        <Input value={editCode} onChange={(e) => setEditCode(e.target.value)} />
                      </TableCell>
                      <TableCell>
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
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
                      <TableCell className="font-medium">{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingId(item.id)
                            setEditCode(item.code)
                            setEditName(item.name || '')
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
                    No {title.toLowerCase()} records found.
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
