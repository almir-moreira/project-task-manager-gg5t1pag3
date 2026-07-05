import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Constants } from '@/lib/supabase/types'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Save } from 'lucide-react'
import type { PermissionUser } from '@/lib/permissions'
import { PermissionPreview } from './PermissionPreview'
import type { UserProfileWithUnits } from '@/pages/admin/UserAccessPage'

const ALL_ROLES = Constants.public.Enums.user_role

interface UnitOption {
  id: string
  name: string | null
}

interface UserEditSheetProps {
  user: UserProfileWithUnits | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserEditSheet({ user, open, onOpenChange }: UserEditSheetProps) {
  const { toast } = useToast()
  const [role, setRole] = useState('')
  const [units, setUnits] = useState<UnitOption[]>([])
  const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setRole(user.role || 'Collaborator')
      setSelectedUnits(
        new Set((user.user_units || []).map((uu) => uu.unit_id).filter(Boolean) as string[]),
      )
    }
  }, [user])

  useEffect(() => {
    if (open) {
      supabase
        .from('units')
        .select('id, name')
        .order('name')
        .then(({ data }) => {
          setUnits(data || [])
        })
    }
  }, [open])

  const toggleUnit = (unitId: string) => {
    setSelectedUnits((prev) => {
      const next = new Set(prev)
      if (next.has(unitId)) next.delete(unitId)
      else next.add(unitId)
      return next
    })
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)

    const { error: roleError } = await supabase.from('profiles').update({ role }).eq('id', user.id)
    if (roleError) {
      toast({ title: 'Error updating role', variant: 'destructive' })
      setSaving(false)
      return
    }

    const currentUnitIds = new Set(
      (user.user_units || []).map((uu) => uu.unit_id).filter(Boolean) as string[],
    )
    const toAdd = [...selectedUnits].filter((id) => !currentUnitIds.has(id))
    const toRemove = (user.user_units || [])
      .filter((uu) => uu.unit_id && !selectedUnits.has(uu.unit_id))
      .map((uu) => uu.id)

    if (toRemove.length > 0) {
      await supabase.from('user_units').delete().in('id', toRemove)
    }
    if (toAdd.length > 0) {
      await supabase
        .from('user_units')
        .insert(toAdd.map((unit_id) => ({ user_id: user.id, unit_id })))
    }

    toast({ title: 'User access updated successfully' })
    setSaving(false)
    onOpenChange(false)
  }

  const permUser: PermissionUser | null = user
    ? {
        id: user.id,
        role: role as PermissionUser['role'],
        units: units
          .filter((u) => selectedUnits.has(u.id))
          .map((u) => u.name || '')
          .filter(Boolean),
      }
    : null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg md:max-w-xl overflow-y-auto">
        {user && permUser && (
          <>
            <SheetHeader>
              <SheetTitle>Edit User Access</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <p className="text-sm font-medium">{user.name || '—'}</p>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <p className="text-sm text-muted-foreground font-mono">{user.email || '—'}</p>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Unit Memberships</Label>
                <div className="space-y-2 rounded-lg border p-3 max-h-48 overflow-y-auto">
                  {units.map((unit) => (
                    <div key={unit.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={unit.id}
                        checked={selectedUnits.has(unit.id)}
                        onCheckedChange={() => toggleUnit(unit.id)}
                      />
                      <Label htmlFor={unit.id} className="cursor-pointer text-sm font-normal">
                        {unit.name || 'Unknown'}
                      </Label>
                    </div>
                  ))}
                  {units.length === 0 && (
                    <p className="text-sm text-muted-foreground">No units available.</p>
                  )}
                </div>
              </div>
              <PermissionPreview permUser={permUser} />
            </div>
            <SheetFooter>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
