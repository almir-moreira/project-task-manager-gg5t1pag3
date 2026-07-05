import { useState, useMemo } from 'react'
import { Search, Users, Loader2 } from 'lucide-react'
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
import { formatDate } from '@/lib/utils'
import type { UserProfileWithUnits } from '@/pages/admin/UserAccessPage'

interface UserAccessListProps {
  users: UserProfileWithUnits[]
  loading: boolean
  onSelectUser: (user: UserProfileWithUnits) => void
}

export function UserAccessList({ users, loading, onSelectUser }: UserAccessListProps) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return users
    return users.filter(
      (u) =>
        (u.name?.toLowerCase().includes(q) ?? false) ||
        (u.email?.toLowerCase().includes(q) ?? false) ||
        (u.role?.toLowerCase().includes(q) ?? false),
    )
  }, [users, search])

  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
          <span className="font-medium">All Users ({users.length})</span>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow
                  key={user.id}
                  onClick={() => onSelectUser(user)}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">{user.name || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">
                    {user.email || '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.role || '—'}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {user.user_units?.length > 0 ? (
                        user.user_units.map((uu) => (
                          <Badge key={uu.id} variant="outline" className="text-xs">
                            {uu.unit?.name || 'Unknown'}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">No units</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.created_at ? formatDate(user.created_at) : '—'}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
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
