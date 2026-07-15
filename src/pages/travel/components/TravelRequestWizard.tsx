import { useNavigate } from 'react-router-dom'
import { Users, Plane, ArrowRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TravelRequestWizard({ open, onOpenChange }: Props) {
  const navigate = useNavigate()

  const handleSelect = (path: string) => {
    onOpenChange(false)
    navigate(path)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">New Travel Request</DialogTitle>
          <DialogDescription>
            Choose the type of travel request you want to create.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <button
            onClick={() => handleSelect('/travel/delegations/new')}
            className="group flex flex-col items-start gap-3 p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
          >
            <div className="bg-primary/10 text-primary p-3 rounded-lg group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-base">New Delegation Proposal</h3>
              <p className="text-sm text-muted-foreground">
                For KAICIID/co-organized event delegations with multiple travelers.
              </p>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-primary mt-auto">
              Start Proposal <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            onClick={() => handleSelect('/travel/new')}
            className="group flex flex-col items-start gap-3 p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
          >
            <div className="bg-primary/10 text-primary p-3 rounded-lg group-hover:scale-110 transition-transform">
              <Plane className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-base">New Individual Travel Authorization</h3>
              <p className="text-sm text-muted-foreground">
                For individual missions, Home Leave, and other personal travel.
              </p>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-primary mt-auto">
              Create TA <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
