import { useState, useEffect, useCallback } from 'react'
import { Upload, Trash2, Download, Eye, Loader2, File as FileIcon, Paperclip } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import {
  DOCUMENT_TYPES,
  getTravelAttachments,
  createTravelAttachment,
  deleteTravelAttachment,
  updateTravelAttachment,
  uploadTravelFile,
  removeTravelFile,
  getTravelFileUrl,
  TravelAttachment,
} from '@/services/travel-attachments'

interface Props {
  travelAuthorizationId: string
  isEditable: boolean
}

function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function TravelAttachmentsSection({ travelAuthorizationId, isEditable }: Props) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [attachments, setAttachments] = useState<TravelAttachment[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [docType, setDocType] = useState('')
  const [desc, setDesc] = useState('')
  const [editTarget, setEditTarget] = useState<TravelAttachment | null>(null)
  const [editDocType, setEditDocType] = useState('')
  const [editDesc, setEditDesc] = useState('')

  const fetchAttachments = useCallback(async () => {
    if (!travelAuthorizationId) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const data = await getTravelAttachments(travelAuthorizationId)
      setAttachments(data)
    } catch (err: any) {
      toast({
        title: 'Error loading attachments',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [travelAuthorizationId, toast])

  useEffect(() => {
    fetchAttachments()
  }, [fetchAttachments])

  const resetUploadForm = () => {
    setSelectedFile(null)
    setDocType('')
    setDesc('')
    setUploadOpen(false)
  }

  const handleUpload = async () => {
    if (!selectedFile || !user) return
    if (!docType) {
      toast({ title: 'Document type is required', variant: 'destructive' })
      return
    }
    setUploading(true)
    try {
      const { path } = await uploadTravelFile(travelAuthorizationId, selectedFile)
      await createTravelAttachment({
        travel_authorization_id: travelAuthorizationId,
        file_path: path,
        file_name: selectedFile.name,
        file_type: selectedFile.type || 'application/octet-stream',
        file_size: selectedFile.size,
        document_type: docType,
        description: desc || null,
        uploaded_by: user.id,
      })
      toast({ title: 'File uploaded successfully' })
      resetUploadForm()
      fetchAttachments()
    } catch (err: any) {
      toast({ title: 'Error uploading file', description: err.message, variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (att: TravelAttachment) => {
    try {
      await removeTravelFile(att.file_path)
      await deleteTravelAttachment(att.id)
      toast({ title: 'Attachment deleted' })
      setAttachments((prev) => prev.filter((a) => a.id !== att.id))
    } catch (err: any) {
      toast({
        title: 'Error deleting attachment',
        description: err.message,
        variant: 'destructive',
      })
    }
  }

  const handleEditSave = async () => {
    if (!editTarget) return
    try {
      await updateTravelAttachment(editTarget.id, {
        document_type: editDocType,
        description: editDesc || null,
      })
      toast({ title: 'Attachment updated' })
      setEditTarget(null)
      fetchAttachments()
    } catch (err: any) {
      toast({
        title: 'Error updating attachment',
        description: err.message,
        variant: 'destructive',
      })
    }
  }

  const openEdit = (att: TravelAttachment) => {
    setEditTarget(att)
    setEditDocType(att.document_type)
    setEditDesc(att.description || '')
  }

  const handleDownload = (filePath: string, fileName: string) => {
    const url = getTravelFileUrl(filePath)
    window.open(url, '_blank')
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Paperclip className="h-4 w-4" />
          Supporting Documents
        </CardTitle>
        {isEditable && (
          <Button size="sm" onClick={() => setUploadOpen(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : attachments.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
            No supporting documents attached yet.
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead className="w-[140px]">Document Type</TableHead>
                  <TableHead className="w-[120px]">Uploaded By</TableHead>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead className="text-right w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attachments.map((att) => (
                  <TableRow key={att.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0">
                          <p
                            className="font-medium truncate max-w-[200px] sm:max-w-[280px]"
                            title={att.file_name}
                          >
                            {att.file_name}
                          </p>
                          {att.description && (
                            <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[280px]">
                              {att.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {att.document_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {att.profiles?.name || 'Unknown'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(att.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDownload(att.file_path, att.file_name)}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDownload(att.file_path, att.file_name)}
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {isEditable && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEdit(att)}
                              title="Edit"
                            >
                              <FileIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(att)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={uploadOpen} onOpenChange={(o) => !uploading && setUploadOpen(o)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Supporting Document</DialogTitle>
              <DialogDescription>
                Select a file and provide document details. Maximum file size is 50MB.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
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
                <Label>Document Type *</Label>
                <Select value={docType} onValueChange={setDocType} disabled={uploading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Textarea
                  placeholder="Add a description or comments..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  disabled={uploading}
                  rows={2}
                  className="resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={resetUploadForm} disabled={uploading}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!selectedFile || !docType || uploading}>
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

        <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Attachment</DialogTitle>
              <DialogDescription>Update document type and description.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>File Name</Label>
                <Input value={editTarget?.file_name || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>Document Type *</Label>
                <Select value={editDocType} onValueChange={setEditDocType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Textarea
                  placeholder="Add a description or comments..."
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={2}
                  className="resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setEditTarget(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
