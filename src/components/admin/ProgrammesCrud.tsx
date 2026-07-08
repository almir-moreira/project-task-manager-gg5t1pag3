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

export function ProgrammesCrud() {
  const [data, setData] = useState<any[]>([])
  const [costCenters, setCostCenters] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [newItemName, setNewItemName] = useState('')
  const [newItemCC, setNewItemCC] = useState('none')
  const [newItemCO, setNewItemCO] = useState('none')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editCC, setEditCC] = useState('none')
  const [editCO, setEditCO] = useState('none')
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [progRes, ccRes, profRes] = await Promise.all([
      supabase
        .from('programmes')
        .select('*, cost_centers(id, code, name), profiles!certifying_officer_id(id, name)')
        .order('name'),
      supabase.from('cost_centers').select('*').order('name'),
      supabase.from('profiles').select('id, name').order('name'),
    ])
    if (progRes.error) {
      toast({ title: 'Error fetching programmes', variant: 'destructive' })
    } else if (progRes.data) {
      setData(progRes.data)
    }
    if (ccRes.data) setCostCenters(ccRes.data)
    if (profRes.data) setProfiles(profRes.data)
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName) return
    const payload = {
      name: newItemName,
      cost_center_id: newItemCC === 'none' ? null : newItemCC,
      certifying_officer_id: newItemCO === 'none' ? null : newItemCO,
    }
    const { data: res, error } = await supabase
      .from('programmes')
      .insert(payload)
      .select('*, cost_centers(id, code, name), profiles!certifying_officer_id(id, name)')
      .single()

    if (error) {
      toast({ title: 'Error adding programme', variant: 'destructive' })
    } else {
      setData([...data, res])
      setNewItemName('')
      setNewItemCC('none')
      setNewItemCO('none')
      toast({ title: 'Added successfully' })
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('programmes').delete().eq('id', id)
    if (error) toast({ title: 'Error deleting programme', variant: 'destructive' })
    else {
      setData(data.filter((d) => d.id !== id))
      toast({ title: 'Deleted successfully' })
    }
  }

  const saveEdit = async (id: string) => {
    const payload = {
      name: editName,
      cost_center_id: editCC === 'none' ? null : editCC,
      certifying_officer_id: editCO === 'none' ? null : editCO,
    }
    const { data: res, error } = await supabase
      .from('programmes')
      .update(payload)
      .eq('id', id)
      .select('*, cost_centers(id, code, name), profiles!certifying_officer_id(id, name)')
      .single()

    if (error) {
      toast({ title: 'Error updating programme', variant: 'destructive' })
    } else {
      setData(data.map((d) => (d.id === id ? res : d)))
      setEditingId(null)
      toast({ title: 'Updated successfully' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <h3 className="text-lg font-medium">Programmes Configuration</h3>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row w-full xl:w-auto gap-2">
          <Input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Programme Name"
            className="w-full sm:w-48"
          />
          <Select value={newItemCC} onValueChange={setNewItemCC}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Cost Center" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Cost Center</SelectItem>
              {costCenters.map((cc) => (
                <SelectItem key={cc.id} value={cc.id}>
                  {cc.code} - {cc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={newItemCO} onValueChange={setNewItemCO}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Certifying Officer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Certifying Officer</SelectItem>
              {profiles.map((p) => (
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
                <TableHead>Name</TableHead>
                <TableHead>Cost Center</TableHead>
                <TableHead>Certifying Officer</TableHead>
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
                        <Select value={editCC} onValueChange={setEditCC}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Cost Center" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {costCenters.map((cc) => (
                              <SelectItem key={cc.id} value={cc.id}>
                                {cc.code} - {cc.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select value={editCO} onValueChange={setEditCO}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Certifying Officer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {profiles.map((p) => (
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
                        {item.cost_centers
                          ? `${item.cost_centers.code} - ${item.cost_centers.name}`
                          : '-'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.profiles?.name || '-'}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingId(item.id)
                            setEditName(item.name)
                            setEditCC(item.cost_center_id || 'none')
                            setEditCO(item.certifying_officer_id || 'none')
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
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No programmes found.
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
