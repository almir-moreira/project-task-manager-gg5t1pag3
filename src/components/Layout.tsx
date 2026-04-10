import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './layout/AppSidebar'
import { AppHeader } from './layout/AppHeader'

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-background/95 flex flex-col">
            <div className="animate-fade-in flex-1">
              <Outlet />
            </div>
            <div className="text-center text-xs text-muted-foreground py-4 mt-auto border-t border-border">
              Version 1.0.1
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
