import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { getMasterData } from '@/services/master-data'

export function TabComments() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    getMasterData().then((d) => setUsers(d.profiles))
  }, [])

  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-full">
      <h3 className="text-lg font-medium">Comments</h3>
      <div className="space-y-4 flex-1">
        <div className="bg-muted/50 rounded-lg p-4 text-sm w-full space-y-2">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">System Notification</span>
            <span className="text-xs text-muted-foreground">Just now</span>
          </div>
          <p>Task initialized. Ready for collaboration.</p>
        </div>
      </div>

      <div className="mt-auto border-t border-border pt-4">
        <div className="space-y-3 max-w-2xl">
          <div className="w-full sm:w-64">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Send notification to..." />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Textarea placeholder="Write a comment..." className="resize-none" />
          <div className="flex justify-end">
            <Button>Post Comment</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
