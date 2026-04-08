import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useAppContext } from '@/stores/main'

export default function AdminPage() {
  const { users } = useAppContext()

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
      <div className="space-y-1 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Administration</h1>
        <p className="text-sm text-muted-foreground">
          Manage reference data, users, and system configuration.
        </p>
      </div>

      <Card className="shadow-sm border-border">
        <Tabs defaultValue="users">
          <CardHeader className="pb-0 pt-4 px-4 bg-muted/20 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-lg">System Tables</CardTitle>
                <CardDescription>
                  Editable source of truth for application dropdowns.
                </CardDescription>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Add Record
              </Button>
            </div>
            <TabsList className="bg-transparent p-0 w-full justify-start h-auto rounded-none">
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-background data-[state=active]:border-t data-[state=active]:border-l data-[state=active]:border-r data-[state=active]:border-border border-b-transparent rounded-t-lg rounded-b-none px-6 py-2.5"
              >
                Users
              </TabsTrigger>
              <TabsTrigger
                value="programmes"
                className="data-[state=active]:bg-background data-[state=active]:border-t data-[state=active]:border-l data-[state=active]:border-r data-[state=active]:border-border border-b-transparent rounded-t-lg rounded-b-none px-6 py-2.5"
              >
                Programmes
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="data-[state=active]:bg-background data-[state=active]:border-t data-[state=active]:border-l data-[state=active]:border-r data-[state=active]:border-border border-b-transparent rounded-t-lg rounded-b-none px-6 py-2.5"
              >
                Projects
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="p-0">
            <TabsContent value="users" className="m-0">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Programme</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell>{u.programme}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="programmes" className="m-0 p-8 text-center text-muted-foreground">
              Programmes configuration table will appear here.
            </TabsContent>
            <TabsContent value="projects" className="m-0 p-8 text-center text-muted-foreground">
              Projects configuration table will appear here.
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}
