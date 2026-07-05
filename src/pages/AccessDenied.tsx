import { ShieldX, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function AccessDenied() {
  const location = useLocation()

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-6 animate-fade-in">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center text-center pt-8 pb-8">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <ShieldX className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-1">
            You do not have permission to view this page.
          </p>
          <p className="text-xs text-muted-foreground/70 mb-6 break-all">{location.pathname}</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
