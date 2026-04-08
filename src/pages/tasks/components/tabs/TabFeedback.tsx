import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface TabFeedbackProps {
  units: string[]
}

export function TabFeedback({ units }: TabFeedbackProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[150px]">Unit / Dept</TableHead>
              <TableHead>Reviewer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Feedback</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit, i) => (
              <TableRow key={unit}>
                <TableCell className="font-medium text-sm">{unit}</TableCell>
                <TableCell className="text-sm">
                  {i % 2 === 0 ? 'Pending Assignment' : 'John Doe'}
                </TableCell>
                <TableCell>
                  {i % 2 === 0 ? (
                    <Badge
                      variant="outline"
                      className="text-amber-600 border-amber-200 bg-amber-50"
                    >
                      Pending
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-emerald-600 border-emerald-200 bg-emerald-50"
                    >
                      Cleared
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {i % 2 === 0 ? '-' : '2026-06-15'}
                </TableCell>
                <TableCell className="text-sm">
                  {i % 2 === 0 ? 'Awaiting response.' : 'Approved without conditions.'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
