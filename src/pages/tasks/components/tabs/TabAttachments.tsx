import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Trash2,
  Eye,
  Download,
  Edit,
  Upload,
  File as FileIcon,
  Loader2,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  MessageSquare,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { format } from 'date-fns'

interface AttachmentRow {
  id: string
  task_id: string
  original_file_name: string
  file_type: string
  file_size: number
  server_file_path: string
  public_or_signed_url: string | null
  uploaded_by: string | null
  uploaded_at: string
  description: string | null
  profiles?: {
    name: string | null
  }
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function TabAttachments({
  activity,
  onUpdate,
}: {
  activity: any
  onUpdate: (a: any) => void
}) {
  const [attachments, setAttachments] = useState<AttachmentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [editingDoc, setEditingDoc] = useState<AttachmentRow | null>(null)

  const [editingDescDoc, setEditingDescDoc] = useState<AttachmentRow | null>(null)
  const [editDescValue, setEditDescValue] = useState('')

  const { toast } = useToast()
  const { user } = useAuth()

  const fetchAttachments = async () => {
    if (!activity?.id) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('attachments')
        .select(`
          *,
          profiles (name)
        `)
        .eq('task_id', activity.id)
        .order('uploaded_at', { ascending: false })

      if (error) throw error

      const formattedData = (data || []).map((att: any) => {
        let url = att.public_or_signed_url
        if (!url && att.server_file_path) {
          url = supabase.storage.from('activity-attachments').getPublicUrl(att.server_file_path)
            .data.publicUrl
        }
        return {
          ...att,
          public_or_signed_url: url,
        }
      })

      setAttachments(formattedData)
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

  const handleUpload = async () => {
    if (!selectedFile || !activity?.id || !user) return

    const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB limit
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 50MB',
        variant: 'destructive',
      })
      return
    }

    setUploading(true)
    try {
      const safeName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filePath = `${activity.id}/${Date.now()}_${safeName}`

      const { error: uploadError } = await supabase.storage
        .from('activity-attachments')
        .upload(filePath, selectedFile)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('activity-attachments')
        .getPublicUrl(filePath)

      const { error: dbError } = await supabase.from('attachments').insert({
        task_id: activity.id,
        original_file_name: selectedFile.name,
        file_type: selectedFile.type || 'application/octet-stream',
        file_size: selectedFile.size,
        server_file_path: filePath,
        public_or_signed_url: publicUrlData.publicUrl,
        uploaded_by: user.id,
        description: description,
      })

      if (dbError) {
        await supabase.storage.from('activity-attachments').remove([filePath])
        throw dbError
      }

      toast({ title: 'File uploaded successfully' })
      setUploadDialogOpen(false)
      setSelectedFile(null)
      setDescription('')
      fetchAttachments()
    } catch (err: any) {
      toast({ title: 'Error uploading file', description: err.message, variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  const deleteAttachment = async (id: string, filePath: string) => {
    try {
      if (filePath) {
        await supabase.storage.from('activity-attachments').remove([filePath])
      }

      const { error } = await supabase.from('attachments').delete().eq('id', id)

      if (error) throw error

      toast({ title: 'Attachment deleted' })
      setAttachments((prev) => prev.filter((a) => a.id !== id))
    } catch (err: any) {
      toast({ title: 'Error deleting', description: err.message, variant: 'destructive' })
    }
  }

  const handleDownload = async (url: string, filename: string) => {
    if (!url) return
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(blobUrl)
      document.body.removeChild(a)
    } catch (e) {
      window.open(url, '_blank')
    }
  }

  const updateDescription = async (id: string, newDesc: string) => {
    try {
      const { error } = await supabase
        .from('attachments')
        .update({ description: newDesc })
        .eq('id', id)

      if (error) throw error
      toast({ title: 'Description updated' })
      setAttachments((prev) => prev.map((a) => (a.id === id ? { ...a, description: newDesc } : a)))
    } catch (err: any) {
      toast({ title: 'Error updating', description: err.message, variant: 'destructive' })
    }
  }

  const handleEditDescriptionSave = async () => {
    if (!editingDescDoc) return
    await updateDescription(editingDescDoc.id, editDescValue)
    setEditingDescDoc(null)
  }

  const getFileIcon = (filename: string, type: string) => {
    if (type.includes('image')) return <ImageIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
    if (filename.endsWith('.pdf'))
      return <FileText className="h-4 w-4 text-red-500 flex-shrink-0" />
    if (filename.endsWith('.doc') || filename.endsWith('.docx'))
      return <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
    if (filename.endsWith('.xls') || filename.endsWith('.xlsx'))
      return <FileSpreadsheet className="h-4 w-4 text-green-600 flex-shrink-0" />
    return <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Attachments</h3>
          <p className="text-sm text-muted-foreground">
            Manage files and documents related to this activity.
          </p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)} size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload File
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : attachments.length === 0 ? (
        <div className="text-center py-10 text-sm text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">
          No attachments yet. Click "Upload File" to add documents.
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[45%]">File Name</TableHead>
                <TableHead className="w-[100px]">Size</TableHead>
                <TableHead className="w-[150px]">Uploaded By</TableHead>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead className="text-right w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attachments.map((att) => (
                <TableRow key={att.id}>
                  <TableCell className="font-medium">
                    {att.description ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 cursor-help w-fit">
                            {getFileIcon(att.original_file_name, att.file_type || '')}
                            <span className="truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                              {att.original_file_name}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-[300px] whitespace-normal break-words">
                            {att.description}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <div className="flex items-center gap-2 w-fit">
                        {getFileIcon(att.original_file_name, att.file_type || '')}
                        <span
                          className="truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]"
                          title={att.original_file_name}
                        >
                          {att.original_file_name}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatBytes(att.file_size || 0)}
                  </TableCell>
                  <TableCell
                    className="text-muted-foreground text-sm truncate max-w-[150px]"
                    title={att.profiles?.name || 'Unknown'}
                  >
                    {att.profiles?.name || 'Unknown'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(att.uploaded_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {att.public_or_signed_url && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() =>
                              window.open(att.public_or_signed_url as string, '_blank')
                            }
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() =>
                              handleDownload(
                                att.public_or_signed_url as string,
                                att.original_file_name,
                              )
                            }
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditingDescDoc(att)
                          setEditDescValue(att.description || '')
                        }}
                        title="Edit Description"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>

                      {(att.original_file_name.toLowerCase().endsWith('.doc') ||
                        att.original_file_name.toLowerCase().endsWith('.docx')) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                          onClick={() => setEditingDoc(att)}
                          title="Edit Document"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteAttachment(att.id, att.server_file_path)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onOpenChange={(open) => {
          if (!uploading) setUploadDialogOpen(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Attachment</DialogTitle>
            <DialogDescription>
              Select a file from your device to attach to this activity. Maximum file size is 50MB.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>File</Label>
              <Input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                disabled={uploading}
                className="cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                placeholder="Enter a brief description of this file..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploading}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Description Dialog */}
      <Dialog open={!!editingDescDoc} onOpenChange={(open) => !open && setEditingDescDoc(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Description</DialogTitle>
            <DialogDescription>
              Update the description for {editingDescDoc?.original_file_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Enter a brief description of this file..."
                value={editDescValue}
                onChange={(e) => setEditDescValue(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingDescDoc(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditDescriptionSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Editor Dialog Scaffold */}
      <Dialog open={!!editingDoc} onOpenChange={(open) => !open && setEditingDoc(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Word Document</DialogTitle>
            <DialogDescription>In-app document editing integration</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md p-4 text-sm text-amber-800 dark:text-amber-200">
              <p className="font-semibold mb-1 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Document Editor Service Pending
              </p>
              <p className="opacity-90">
                True in-app Word document editing requires integration with a dedicated Document
                Editor Service (e.g., Microsoft Office 365 API, Google Docs API, or a self-hosted
                solution like ONLYOFFICE).
              </p>
            </div>

            <div className="space-y-3 border rounded-md p-4 bg-muted/30">
              <h4 className="font-medium text-sm border-b pb-2">Scaffolded Backend Flow:</h4>
              <ul className="text-sm space-y-3 list-none text-muted-foreground">
                <li className="flex flex-col gap-1">
                  <strong className="text-foreground">Selected File:</strong>
                  <span className="font-mono text-xs bg-muted p-1 rounded inline-block truncate">
                    {editingDoc?.original_file_name}
                  </span>
                </li>
                <li className="flex flex-col gap-1">
                  <strong className="text-foreground">Retrieve Endpoint:</strong>
                  <code className="bg-muted p-1 rounded">
                    /api/docs/retrieve?id={editingDoc?.id}
                  </code>
                </li>
                <li className="flex flex-col gap-1">
                  <strong className="text-foreground">Secure Access URL:</strong>
                  <code className="bg-muted p-1 rounded truncate">
                    {editingDoc?.public_or_signed_url?.substring(0, 60)}...
                  </code>
                </li>
                <li className="flex flex-col gap-1">
                  <strong className="text-foreground">Save/Update Endpoint:</strong>
                  <code className="bg-muted p-1 rounded">/api/docs/save?id={editingDoc?.id}</code>
                </li>
              </ul>

              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground flex gap-2">
                  <span className="font-bold text-foreground">TODO:</span>
                  <span>
                    Implement real-time collaborative editing iframe or component here once the
                    third-party provider is configured and authenticated.
                  </span>
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDoc(null)}>
              Close Preview
            </Button>
            <Button disabled className="gap-2">
              <Upload className="h-4 w-4" />
              Save Changes to Server
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
