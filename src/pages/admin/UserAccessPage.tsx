import { useState, useEffect, useCallback } from 'react'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { usePermissions } from '@/hooks/use-permissions'
import { isAdmin } from '@/lib/permissions'
import { UserAccessList } from '@/components/admin/user-access/UserAccessList'
import { UserEditSheet } from '@/components/admin/user-access/UserEditSheet'
import { supabase } from '@/lib/supabase/client'

export interface UserProfileWithUnits {
  id: string
  name: string | null
  email: string | null
  role: string | null
  department: string | null
  created_at: string | null
  user_units: Array<{
    id: string
    unit_id: string | null
    unit: { id: string; name: string | null } | null
  }>
}

export default function UserAccessPage() {
  const { permUser, loading } = usePermissions()
  const [users, setUsers] = useState<UserProfileWithUnits[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserProfileWithUnits | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const fetchUsers = useCallback(async () => {
    setDataLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, name, email, role, department, created_at,
        user_units(id, unit_id, unit:units(id, name))
      `)
      .order('name')
    if (!error && data) {
      setUsers(data as UserProfileWithUnits[])
    }
    setDataLoading(false)
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSelectUser = (user: UserProfileWithUnits) => {
    setSelectedUser(user)
    setSheetOpen(true)
  }

  const handleSheetClose = () => {
    setSheetOpen(false)
    fetchUsers()
  }

  const handleUserUpdated = (updatedUser: UserProfileWithUnits) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
    setSelectedUser(updatedUser)
  }

  if (loading) return null

  if (!isAdmin(permUser)) {
    return (
      <div className="p-6 max-w-7xl mx-auto animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">User Access</h1>
        </div>
        <Card className="border-destructive/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-destructive" />
              <div>
                <CardTitle className="text-destructive">Access Denied</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  You do not have permission to view this page. This area is restricted to Admin
                  users only.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If you believe this is an error, please contact your system administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Access Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage user roles, unit memberships, and preview permission logic.
          </p>
        </div>
      </div>
      <UserAccessList users={users} loading={dataLoading} onSelectUser={handleSelectUser} />
      <UserEditSheet
        user={selectedUser}
        open={sheetOpen}
        onOpenChange={(open) => {
          if (!open) handleSheetClose()
        }}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  )
}
