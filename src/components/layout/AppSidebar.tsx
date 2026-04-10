import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Briefcase,
  Settings,
  LogOut,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

const navItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Activities', url: '/tasks', icon: CheckSquare },
  { title: 'Programs', url: '/admin', icon: FolderKanban },
  { title: 'Projects', url: '/admin', icon: Briefcase },
  { title: 'Administration', url: '/admin', icon: Settings },
]

export function AppSidebar() {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data }) => setProfile(data))
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
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.url ||
                  (item.url !== '/' && location.pathname.startsWith(item.url))
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
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
