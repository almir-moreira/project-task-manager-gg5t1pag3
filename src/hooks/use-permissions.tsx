import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import type { PermissionUser } from '@/lib/permissions'

export function usePermissions() {
  const { user } = useAuth()
  const [permUser, setPermUser] = useState<PermissionUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setPermUser(null)
      setLoading(false)
      return
    }
    let cancelled = false
    Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('user_units').select('unit:units(name)').eq('user_id', user.id),
    ])
      .then(([pRes, uRes]) => {
        if (cancelled) return
        const unitNames = (uRes.data || []).map((u: any) => u.unit?.name).filter(Boolean)
        setPermUser({
          id: user.id,
          role: pRes.data?.role || null,
          units: unitNames,
          programme_id: pRes.data?.programme_id || null,
        })
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setPermUser({ id: user.id, role: null, units: [], programme_id: null })
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  return { permUser, loading }
}
