import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, Trash2, Edit2, Check, X } from 'lucide-react'

const ROLES = [
  'Collaborator',
  'Officer',
  'Project Manager',
  'Head',
  'Manager',
  'Secretary General',
  'Team Assistant',
  'Administrator',
  'Admin',
  'Programme Manager',
  'SPM',
  'PROD Head',
  'CPO',
  'PROD Team Assistant',
  'Feedback Unit User',
  'EOSG Assistant',
  'Read Only',
]

interface ProfileRow {
  id: string
  email: string | null
  name: string | null
  role: string | null
  department: string | null
  programme_id: string | null
  programme: { name: string } | null
}

export function UsersCrud() {
  const [users, setUsers] = useState<ProfileRow[]>([])
  const [programmes, setProgrammes] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [addOpen, setAddOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState('Collaborator')
  const [newDepartment, setNewDepartment] = useState('')
  const [newProgramme, setNewProgramme] = useState('none')
  const [adding, setAdding] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editRole, setEditRole] = useState('')
  const [editDepartment, setEditDepartment] = useState('')
  const [editProgramme, setEditProgramme] = useState('none')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [usersRes, progRes] = await Promise.all([
      supabase
        .from('profiles')
        .select(
          'id, email, name, role, department, programme_id, programme:programmes!profiles_programme_id_fkey(name)',
        )
        .order('name'),
      supabase.from('programmes').select('id, name').order('name'),
    ])
    if (usersRes.error) {
      toast({
        title: 'Error fetching users',
        description: usersRes.error.message,
        variant: 'destructive',
      })
    }
    if (usersRes.data) {
      setUsers(
        usersRes.data.map((row: any) => {
          let prog = row.programme
          if (Array.isArray(prog)) {
            prog = prog.length > 0 ? prog[0] : null
          }
          return {
            ...row,
            programme: prog,
          }
        }) as ProfileRow[],
      )
    }
    if (progRes.error) {
      toast({
        title: 'Error fetching programmes',
        description: progRes.error.message,
        variant: 'destructive',
      })
    }
    if (progRes.data) setProgrammes(progRes.data)
    setLoading(false)
  }

  const handleAdd = async () => {
    if (!newName || !newEmail) return
    setAdding(true)

    const { data, error } = await supabase.functions.invoke('create-user', {
      body: {
        email: newEmail,
        name: newName,
        role: newRole,
        department: newDepartment || null,
        programme_id: newProgramme === 'none' ? null : newProgramme,
      },
    })

    setAdding(false)

    if (error || data?.error) {
      toast({
        title: 'Error creating user',
        description: error?.message || data?.error || 'Unknown error',
        variant: 'destructive',
      })
      return
    }

    if (newProgramme !== 'none') {
      await supabase.from('profiles').update({ programme_id: newProgramme }).eq('email', newEmail)
    }

    toast({ title: `User ${newName} created successfully` })
    setAddOpen(false)
    setNewName('')
    setNewEmail('')
    setNewRole('Collaborator')
    setNewDepartment('')
    setNewProgramme('none')
    fetchData()
  }

  const startEdit = (user: ProfileRow) => {
    setEditingId(user.id)
    setEditName(user.name || '')
    setEditRole(user.role || '')
    setEditDepartment(user.department || '')
    setEditProgramme(user.programme_id || 'none')
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async (id: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({
        name: editName,
        role: editRole,
        department: editDepartment || null,
        programme_id: editProgramme === 'none' ? null : editProgramme,
      })
      .eq('id', id)

    if (error) {
      toast({ title: 'Error updating user', variant: 'destructive' })
    } else {
      const progObj = programmes.find((p) => p.id === editProgramme)
      setUsers(
        users.map((u) =>
          u.id === id
            ? {
                ...u,
                name: editName,
                role: editRole,
                department: editDepartment || null,
                programme_id: editProgramme === 'none' ? null : editProgramme,
                programme: progObj ? { name: progObj.name } : null,
              }
            : u,
        ),
      )
      setEditingId(null)
      toast({ title: 'User updated successfully' })
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (error) {
      toast({ title: 'Error deleting user', variant: 'destructive' })
    } else {
      setUsers(users.filter((u) => u.id !== id))
      toast({ title: 'User deleted successfully' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Users Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage user roles, departments, programmes, and basic profile information.
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="new-name">Name</Label>
                <Input
                  id="new-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-dept">Department</Label>
                <Input
                  id="new-dept"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  placeholder="e.g. Operations, Legal, Finance"
                />
              </div>
              <div className="space-y-2">
                <Label>Programme</Label>
                <Select value={newProgramme} onValueChange={setNewProgramme}>
                  <SelectTrigger className="w-full">
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
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAdd} disabled={!newName || !newEmail || adding}>
                {adding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Programme</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  {editingId === user.id ? (
                    <>
                      <TableCell>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="max-w-[200px]"
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Select value={editRole} onValueChange={setEditRole}>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.map((r) => (
                              <SelectItem key={r} value={r}>
                                {r}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editDepartment}
                          onChange={(e) => setEditDepartment(e.target.value)}
                          placeholder="Department"
                          className="max-w-[200px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Select value={editProgramme} onValueChange={setEditProgramme}>
                          <SelectTrigger className="w-[200px]">
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
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => saveEdit(user.id)}
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8 w-8"
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
                      <TableCell className="font-medium">{user.name || '-'}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>{user.role || '-'}</TableCell>
                      <TableCell>{user.department || '-'}</TableCell>
                      <TableCell>{user.programme?.name ?? 'N/A'}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEdit(user)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No users found.
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
