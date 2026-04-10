import { Bell, Search, Menu } from 'lucide-react'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useLocation } from 'react-router-dom'

export function AppHeader() {
  const location = useLocation()
  const pathParts = location.pathname.split('/').filter(Boolean)

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger />

        <div className="hidden md:block">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              {pathParts.map((part, index) => (
                <div key={part} className="flex items-center">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {index === pathParts.length - 1 ? (
                      <BreadcrumbPage className="capitalize">{part}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={`/${pathParts.slice(0, index + 1).join('/')}`}
                        className="capitalize"
                      >
                        {part}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-[200px] sm:max-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search activities or IDs..."
            className="w-full pl-9 bg-muted/50 border-transparent focus-visible:bg-background"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-red-600 border border-card" />
        </Button>
      </div>
    </header>
  )
}
