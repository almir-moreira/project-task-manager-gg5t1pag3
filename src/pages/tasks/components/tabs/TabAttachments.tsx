import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Eye, Upload, File as FileIcon } from 'lucide-react'

interface Attachment {
  id: string
  description: string
  fileName: string
  fileUrl: string | null
}

export function TabAttachments({ activity }: { activity: any; onUpdate: (a: any) => void }) {
  const [attachments, setAttachments] = useState<Attachment[]>([
    { id: '1', description: 'Initial Draft', fileName: 'draft_v1.pdf', fileUrl: '#' },
  ])

  const addRow = () => {
    setAttachments([
      ...attachments,
      { id: Math.random().toString(), description: '', fileName: '', fileUrl: null },
    ])
  }

  const updateRow = (id: string, field: keyof Attachment, value: any) => {
    setAttachments(attachments.map((a) => (a.id === id ? { ...a, [field]: value } : a)))
  }

  const removeRow = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id))
  }

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateRow(id, 'fileName', file.name)
      updateRow(id, 'fileUrl', URL.createObjectURL(file))
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
        {attachments.length === 0 ? (
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
                      onChange={(e) => updateRow(att.id, 'description', e.target.value)}
                      className="h-9 sm:h-8 text-sm bg-background"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-4 flex items-center gap-2">
                    <Label className="sm:hidden text-xs text-muted-foreground mb-1 block w-full">
                      File
                    </Label>
                    {att.fileName ? (
                      <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-md truncate w-full border border-primary/20">
                        <FileIcon className="h-4 w-4 shrink-0" />
                        <span className="truncate font-medium">{att.fileName}</span>
                      </div>
                    ) : (
                      <div className="relative w-full mt-auto sm:mt-0">
                        <Input
                          type="file"
                          id={`file-${att.id}`}
                          className="sr-only"
                          onChange={(e) => handleFileChange(att.id, e)}
                        />
                        <Label
                          htmlFor={`file-${att.id}`}
                          className="flex items-center justify-center gap-2 h-9 sm:h-8 w-full border border-dashed border-muted-foreground/40 rounded-md cursor-pointer hover:bg-muted/50 text-xs font-medium text-foreground transition-colors"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          Choose File
                        </Label>
                      </div>
                    )}
                  </div>
                  <div className="col-span-1 sm:col-span-3 flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-0 mt-2 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1.5"
                      disabled={!att.fileUrl}
                      onClick={() => att.fileUrl && window.open(att.fileUrl, '_blank')}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
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
