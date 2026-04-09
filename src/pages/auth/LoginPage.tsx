import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { CheckSquare } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('almir.moreira@gmail.com')
  const [password, setPassword] = useState('Skip@Pass')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const { toast } = useToast()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      toast({
        title: 'Error signing in',
        description: error.message,
        variant: 'destructive',
      })
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-xl shadow-sm">
              <CheckSquare className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome to Activity Matrix
          </CardTitle>
          <CardDescription>Enter your credentials to access your workspace.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignIn}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
