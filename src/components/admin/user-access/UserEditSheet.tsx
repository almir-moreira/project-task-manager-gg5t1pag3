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

interface ProgrammeOption {
  id: string
  name: string
}

interface UserEditSheetProps {
  user: UserProfileWithUnits | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserUpdated?: (user: UserProfileWithUnits) => void
}

export function UserEditSheet({ user, open, onOpenChange, onUserUpdated }: UserEditSheetProps) {
  const { toast } = useToast()
  const [role, setRole] = useState('')
  const [programmeId, setProgrammeId] = useState('none')
  const [programmes, setProgrammes] = useState<ProgrammeOption[]>([])
  const [units, setUnits] = useState<UnitOption[]>([])
  const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setRole(user.role || 'Collaborator')
      setProgrammeId(user.programme_id ?? 'none')
      setSelectedUnits(
        new Set((user.user_units || []).map((uu) => uu.unit_id).filter(Boolean) as string[]),
      )
    }
  }, [user])

  useEffect(() => {
    if (open) {
      Promise.all([
        supabase.from('units').select('id, name').order('name'),
        supabase.from('programmes').select('id, name').order('name'),
      ]).then(([unitRes, progRes]) => {
        setUnits(unitRes.data || [])
        setProgrammes(progRes.data || [])
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

    const updates: Record<string, any> = { role }
    if (programmeId === 'none') {
      updates.programme_id = null
    } else {
      updates.programme_id = programmeId
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
    if (profileError) {
      toast({ title: 'Failed to update user. Please try again.', variant: 'destructive' })
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
      const { error: removeError } = await supabase.from('user_units').delete().in('id', toRemove)
      if (removeError) {
        toast({ title: 'Failed to update unit memberships.', variant: 'destructive' })
        setSaving(false)
        return
      }
    }
    if (toAdd.length > 0) {
      const { error: addError } = await supabase
        .from('user_units')
        .insert(toAdd.map((unit_id) => ({ user_id: user.id, unit_id })))
      if (addError) {
        toast({ title: 'Failed to update unit memberships.', variant: 'destructive' })
        setSaving(false)
        return
      }
    }

    const updatedUser: UserProfileWithUnits = {
      ...user,
      role,
      programme_id: programmeId === 'none' ? null : programmeId,
      user_units: units
        .filter((u) => selectedUnits.has(u.id))
        .map((u) => ({
          id: u.id,
          unit_id: u.id,
          unit: { id: u.id, name: u.name },
        })),
    }
    onUserUpdated?.(updatedUser)

    toast({ title: 'User updated successfully' })
    setSaving(false)
    onOpenChange(false)
  }

  const permUser: PermissionUser | null = user
    ? {
        id: user.id,
        role: role as PermissionUser['role'],
        programme_id: programmeId === 'none' ? null : programmeId,
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
                <Label>Programme</Label>
                <Select value={programmeId} onValueChange={setProgrammeId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select programme" />
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
