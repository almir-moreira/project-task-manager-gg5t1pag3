import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TabApprovalMatrix() {
  return (
    <div className="space-y-8 animate-fade-in">
      <h3 className="text-lg font-medium">Approval Matrix</h3>
      <div className="grid grid-cols-2 gap-4 mb-6 max-w-2xl">
        <div className="bg-muted/30 p-3 rounded border border-border">
          <p className="text-xs text-muted-foreground mb-1">Urgency of Approval</p>
          <p className="text-sm font-medium">Standard</p>
        </div>
        <div className="bg-muted/30 p-3 rounded border border-border">
          <p className="text-xs text-muted-foreground mb-1">Nature of Urgency</p>
          <p className="text-sm font-medium">-</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Reviewed By</h3>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[150px]">Role</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-sm">Team Leader</TableCell>
                <TableCell className="text-sm">-</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">
                    Pending
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">-</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" className="h-7 px-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Final Approval</h3>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[150px]">Role</TableHead>
                <TableHead>Approver</TableHead>
                <TableHead>Signature / Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-sm text-muted-foreground">
                  Head of Dept
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">Pending Review</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-slate-100">
                    Locked
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-sm text-muted-foreground">CPO</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  Pending Head Approval
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-slate-100">
                    Locked
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-sm text-muted-foreground">
                  Secretary General
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  Pending CPO Approval
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-slate-100">
                    Locked
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
