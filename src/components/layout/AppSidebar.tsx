import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Briefcase,
  Settings,
  LogOut,
  LineChart,
  FileText,
  Plane,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  canViewMonitoringDashboard,
  canViewKaiciidCalendar,
  isAdmin,
  type PermissionUser,
} from '@/lib/permissions'

export function AppSidebar() {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [permUser, setPermUser] = useState<PermissionUser | null>(null)

  useEffect(() => {
    if (user) {
      Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('user_units').select('unit:units(name)').eq('user_id', user.id),
      ]).then(([pRes, uRes]) => {
        setProfile(pRes.data)
        const unitNames = (uRes.data || []).map((u: any) => u.unit?.name).filter(Boolean)
        setPermUser({ id: user.id, role: pRes.data?.role || null, units: unitNames })
      })
    }
  }, [user])

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4 flex flex-row items-center gap-2">
        <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
          <CheckSquare className="w-5 h-5" />
        </div>
        <span className="font-bold text-lg tracking-tight">Activity Matrix</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/'} tooltip="Dashboard">
                  <Link to="/">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {canViewMonitoringDashboard(permUser) && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname.startsWith('/monitoring')}
                    tooltip="Monitoring Dashboard"
                  >
                    <Link to="/monitoring">
                      <LineChart />
                      <span>Monitoring Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname.startsWith('/tasks')}
                  tooltip="Activities"
                >
                  <Link to="/tasks">
                    <CheckSquare />
                    <span>Activities</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname.startsWith('/travel')}
                  tooltip="Travel Authorization"
                >
                  <Link to="/travel">
                    <Plane />
                    <span>Travel Authorization</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {canViewKaiciidCalendar(permUser) && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname.startsWith('/reports')}
                    tooltip="Reports"
                  >
                    <Link to="/reports/kaiciid-calendar">
                      <FileText />
                      <span>Reports</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {isAdmin(permUser) && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname.startsWith('/admin')}
                    tooltip="Administration"
                  >
                    <Link to="/admin">
                      <Settings />
                      <span>Administration</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={location.pathname === '/admin/access-control'}
                      >
                        <Link to="/admin/access-control">
                          <span>User Access</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={`https://img.usecurling.com/ppl/thumbnail?seed=${user?.id || 'default'}`}
              />
              <AvatarFallback>{profile?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">
                {profile?.name || user?.email || 'User'}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {profile?.role || 'General User'}
              </span>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
