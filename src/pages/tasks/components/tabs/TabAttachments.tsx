import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Eye, Upload, File as FileIcon, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface Attachment {
  id: string
  description: string
  file_name: string
  file_path: string
  file_url: string | null
  isNew?: boolean
}

export function TabAttachments({
  activity,
  onUpdate,
}: {
  activity: any
  onUpdate: (a: any) => void
}) {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchAttachments = async () => {
    if (!activity?.id) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('activity_attachments' as any)
        .select('*')
        .eq('activity_id', activity.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formatted = data.map((d: any) => ({
        id: d.id,
        description: d.description || '',
        file_name: d.file_name,
        file_path: d.file_path,
        file_url: supabase.storage.from('activity-attachments').getPublicUrl(d.file_path).data
          .publicUrl,
        isNew: false,
      }))

      setAttachments(formatted)
    } catch (err: any) {
      toast({
        title: 'Error loading attachments',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttachments()
  }, [activity?.id])

  const addRow = () => {
    setAttachments([
      {
        id: Math.random().toString(),
        description: '',
        file_name: '',
        file_path: '',
        file_url: null,
        isNew: true,
      },
      ...attachments,
    ])
  }

  const updateDescriptionLocal = (id: string, description: string) => {
    setAttachments((prev) => prev.map((a) => (a.id === id ? { ...a, description } : a)))
  }

  const saveDescription = async (id: string, description: string) => {
    const att = attachments.find((a) => a.id === id)
    if (!att || att.isNew) return

    const { error } = await supabase
      .from('activity_attachments' as any)
      .update({ description })
      .eq('id', id)

    if (error) {
      toast({
        title: 'Error saving description',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const handleFileChange = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(id)

      const fileExt = file.name.includes('.') ? file.name.split('.').pop() : ''
      const filePath = `${activity.id}/${Math.random().toString(36).substring(2)}_${Date.now()}${fileExt ? `.${fileExt}` : ''}`

      const { error: uploadError } = await supabase.storage
        .from('activity-attachments')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('activity-attachments')
        .getPublicUrl(filePath)

      const attToSave = attachments.find((a) => a.id === id)

      const { data: dbData, error: dbError } = await supabase
        .from('activity_attachments' as any)
        .insert({
          activity_id: activity.id,
          file_name: file.name,
          file_path: filePath,
          description: attToSave?.description || '',
          content_type: file.type,
          file_size: file.size,
        })
        .select()
        .single()

      if (dbError) {
        await supabase.storage.from('activity-attachments').remove([filePath])
        throw dbError
      }

      setAttachments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                id: dbData.id,
                description: dbData.description || '',
                file_name: dbData.file_name,
                file_path: dbData.file_path,
                file_url: publicUrlData.publicUrl,
                isNew: false,
              }
            : a,
        ),
      )

      toast({ title: 'File uploaded successfully' })
    } catch (err: any) {
      toast({ title: 'Error uploading file', description: err.message, variant: 'destructive' })
    } finally {
      setUploading(null)
    }
  }

  const removeRow = async (id: string) => {
    const att = attachments.find((a) => a.id === id)
    if (!att) return

    const previous = [...attachments]
    setAttachments((prev) => prev.filter((a) => a.id !== id))

    if (att.isNew) return

    try {
      if (att.file_path) {
        await supabase.storage.from('activity-attachments').remove([att.file_path])
      }

      const { error } = await supabase
        .from('activity_attachments' as any)
        .delete()
        .eq('id', id)
      if (error) throw error

      toast({ title: 'Attachment deleted' })
    } catch (err: any) {
      toast({ title: 'Error deleting', description: err.message, variant: 'destructive' })
      setAttachments(previous)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Attachments</h3>
          <p className="text-sm text-muted-foreground">
            Manage files and documents related to this activity.
          </p>
        </div>
        <Button onClick={addRow} size="sm" className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Add Attachment
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : attachments.length === 0 ? (
          <div className="text-center py-10 text-sm text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">
            No attachments yet. Click "Add Attachment" to upload files.
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden bg-card">
            <div className="grid grid-cols-12 gap-4 bg-muted/50 p-3 text-xs font-semibold border-b text-muted-foreground uppercase tracking-wider hidden sm:grid">
              <div className="col-span-12 sm:col-span-5">Description</div>
              <div className="col-span-12 sm:col-span-4">File</div>
              <div className="col-span-12 sm:col-span-3 text-right">Actions</div>
            </div>
            <div className="divide-y">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 p-4 sm:p-3 items-center hover:bg-slate-50 dark:hover:bg-muted/20 transition-colors"
                >
                  <div className="col-span-1 sm:col-span-5">
                    <Label className="sm:hidden text-xs text-muted-foreground mb-1 block">
                      Description
                    </Label>
                    <Input
                      placeholder="Enter description..."
                      value={att.description}
                      onChange={(e) => updateDescriptionLocal(att.id, e.target.value)}
                      onBlur={(e) => saveDescription(att.id, e.target.value)}
                      className="h-9 sm:h-8 text-sm bg-background"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-4 flex items-center gap-2">
                    <Label className="sm:hidden text-xs text-muted-foreground mb-1 block w-full">
                      File
                    </Label>
                    {att.isNew ? (
                      <div className="relative w-full mt-auto sm:mt-0">
                        <Input
                          type="file"
                          id={`file-${att.id}`}
                          className="sr-only"
                          disabled={uploading === att.id}
                          onChange={(e) => handleFileChange(att.id, e)}
                        />
                        <Label
                          htmlFor={`file-${att.id}`}
                          className="flex items-center justify-center gap-2 h-9 sm:h-8 w-full border border-dashed border-muted-foreground/40 rounded-md cursor-pointer hover:bg-muted/50 text-xs font-medium text-foreground transition-colors"
                        >
                          {uploading === att.id ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-3.5 w-3.5" />
                              Choose File to Upload
                            </>
                          )}
                        </Label>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-md truncate w-full border border-primary/20">
                        <FileIcon className="h-4 w-4 shrink-0" />
                        <span className="truncate font-medium">{att.file_name}</span>
                      </div>
                    )}
                  </div>
                  <div className="col-span-1 sm:col-span-3 flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-0 mt-2 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1.5"
                      disabled={att.isNew || !att.file_url}
                      onClick={() => att.file_url && window.open(att.file_url, '_blank')}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={uploading === att.id}
                      onClick={() => removeRow(att.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
