import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAppContext } from '@/stores/main'

export function TabComments() {
  const { currentUser } = useAppContext()

  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-full">
      <div className="space-y-4 flex-1">
        {/* Mock Comments */}
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?seed=u2" />
            <AvatarFallback>U2</AvatarFallback>
          </Avatar>
          <div className="bg-muted/50 rounded-lg p-4 text-sm w-full space-y-2">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold">John Smith</span>
              <span className="text-xs text-muted-foreground">2 days ago</span>
            </div>
            <p>
              I've reviewed the initial document. Looks good, but we need to address the budget
              concerns in section 3 before proceeding to Head Clearance.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-border pt-4">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={`https://img.usecurling.com/ppl/thumbnail?seed=${currentUser.id}`} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea placeholder="Write a comment..." className="resize-none" />
            <div className="flex justify-end">
              <Button size="sm">Post Comment</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
