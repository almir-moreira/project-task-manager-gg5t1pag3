import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { format } from 'date-fns'

export function TabComments({ activity }: { activity?: any }) {
  const [users, setUsers] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [recipientId, setRecipientId] = useState<string>('none')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  const bottomRef = useRef<HTMLDivElement>(null)

  const fetchComments = async () => {
    if (!activity?.id) return
    const { data } = await supabase
      .from('activity_comments')
      .select(`
        id, content, created_at,
        author:profiles!activity_comments_author_id_fkey(id, name),
        recipient:profiles!activity_comments_recipient_id_fkey(id, name)
      `)
      .eq('activity_id', activity.id)
      .order('created_at', { ascending: true })

    if (data) {
      setComments(data)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, name')
      .order('name')
      .then(({ data }) => {
        if (data) setUsers(data)
      })

    fetchComments()

    if (!activity?.id) return

    const channel = supabase
      .channel('activity-comments')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_comments',
          filter: `activity_id=eq.${activity.id}`,
        },
        () => {
          fetchComments()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activity?.id])

  const handleSubmit = async () => {
    if (!content.trim() || !activity?.id || !user) return

    setIsSubmitting(true)

    const { error } = await supabase.from('activity_comments').insert({
      activity_id: activity.id,
      author_id: user.id,
      content: content.trim(),
      recipient_id: recipientId !== 'none' ? recipientId : null,
    })

    if (!error) {
      setContent('')
      setRecipientId('none')
    }

    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-full relative">
      <h3 className="text-lg font-medium shrink-0">Comments</h3>

      <div className="flex-1 overflow-y-auto pr-4 space-y-4 pb-4 min-h-[300px]">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-muted/30 border border-border rounded-lg p-4 text-sm w-full space-y-2"
          >
            <div className="flex justify-between items-start mb-1 gap-4">
              <div className="flex-1">
                <span className="font-semibold">{comment.author?.name || 'Unknown User'}</span>
                {comment.recipient && (
                  <span className="text-muted-foreground ml-2">
                    to <span className="font-medium text-foreground">{comment.recipient.name}</span>
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                {format(new Date(comment.created_at), 'MMM d, yyyy h:mm a')}
              </span>
            </div>
            <p className="whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No comments yet. Start the discussion!
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border pt-4 mt-auto sticky bottom-0 bg-card shrink-0">
        <div className="space-y-3 max-w-3xl">
          <div className="w-full sm:w-64">
            <Select value={recipientId} onValueChange={setRecipientId}>
              <SelectTrigger>
                <SelectValue placeholder="Send notification to..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No specific recipient</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Textarea
            placeholder="Write a comment..."
            className="resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={isSubmitting || !content.trim()}>
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
