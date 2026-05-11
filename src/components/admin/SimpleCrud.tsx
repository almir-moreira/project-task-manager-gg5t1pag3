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

export function SimpleCrud({ table, title }: { table: string; title: string }) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
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
    if (!newItem) return
    const { data: res, error } = await supabase
      .from(table)
      .insert({ name: newItem })
      .select()
      .single()
    if (error) toast({ title: 'Error adding item', variant: 'destructive' })
    else {
      setData([...data, res])
      setNewItem('')
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
      .update({ name: editValue })
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
        <form onSubmit={handleAdd} className="flex w-full sm:w-auto gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={`New ${title}...`}
            className="w-full sm:w-64"
          />
          <Button type="submit" disabled={!newItem}>
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
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="max-w-xs"
                        />
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
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingId(item.id)
                            setEditValue(item.name)
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
                  <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
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
