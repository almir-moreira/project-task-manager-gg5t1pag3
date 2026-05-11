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
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

const ROLES = [
  'Collaborator',
  'Officer',
  'Project Manager',
  'Head',
  'Manager',
  'Secretary General',
  'Team Assistant',
  'Administrator',
]

export function UsersCrud() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('profiles').select('*').order('name')
    if (data) setUsers(data)
    setLoading(false)
  }

  const handleUpdate = async (id: string, field: string, value: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ [field]: value })
      .eq('id', id)
    if (error) {
      toast({ title: `Error updating user ${field}`, variant: 'destructive' })
    } else {
      setUsers(users.map((u) => (u.id === id ? { ...u, [field]: value } : u)))
      toast({ title: 'User updated successfully' })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Users Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage user roles and basic profile information.
        </p>
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
                <TableHead>Email</TableHead>
                <TableHead>Display Name</TableHead>
                <TableHead>Access Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Input
                      defaultValue={user.name || ''}
                      onBlur={(e) => {
                        if (e.target.value !== user.name)
                          handleUpdate(user.id, 'name', e.target.value)
                      }}
                      className="max-w-[250px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role || ''}
                      onValueChange={(val) => handleUpdate(user.id, 'role', val)}
                    >
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
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
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
