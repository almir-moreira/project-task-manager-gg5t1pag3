import type { ReactNode } from 'react'
import { usePermissions } from '@/hooks/use-permissions'
import type { PermissionUser } from '@/lib/permissions'
import AccessDenied from '@/pages/AccessDenied'

interface RouteGuardProps {
  children: ReactNode
  check: (user: PermissionUser | null) => boolean
}

export function RouteGuard({ children, check }: RouteGuardProps) {
  const { permUser, loading } = usePermissions()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!check(permUser)) {
    return <AccessDenied />
  }

  return <>{children}</>
}
