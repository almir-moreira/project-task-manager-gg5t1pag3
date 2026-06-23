import {
  Info,
  Calendar,
  Users,
  Star,
  Target,
  MessageSquare,
  CheckSquare,
  ThumbsUp,
  MessageCircle,
  Paperclip,
  GitCommit,
  Clock,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { TabHistory } from './tabs/TabHistory'
import { TabFeedback } from './tabs/TabFeedback'
import { TabComments } from './tabs/TabComments'
import { TabApproval } from './tabs/TabApproval'
import { TabFinalReview } from './tabs/TabFinalReview'
import { TabEventDetails, TabRBM, TabInvolvedParties, TabSGParticipation } from './tabs/TabGeneric'
import { TabAttachments } from './tabs/TabAttachments'
import { TabActivityDetails } from './tabs/TabTaskDetails'
import { TabWorkflow } from './tabs/TabWorkflow'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const tabsConfig = [
  { id: 'activity-details', label: 'Activity Details', icon: Info, component: TabActivityDetails },
  { id: 'event', label: 'Event Details', icon: Calendar, component: TabEventDetails },
  { id: 'parties', label: 'Involved Parties', icon: Users, component: TabInvolvedParties },
  { id: 'sg', label: 'SG Participation', icon: Star, component: TabSGParticipation },
  { id: 'rbm', label: 'RBM', icon: Target, component: TabRBM },
  {
    id: 'feedback',
    label: 'Feedback',
    icon: MessageSquare,
    component: ({ activity, onUpdate, task }: any) => (
      <TabFeedback activity={activity} onUpdate={onUpdate} task={task} />
    ),
  },
  { id: 'final-review', label: 'Final Review', icon: CheckSquare, component: TabFinalReview },
  { id: 'approval', label: 'Approval', icon: ThumbsUp, component: TabApproval },
  { id: 'comments', label: 'Comments', icon: MessageCircle, component: TabComments },
  { id: 'attachments', label: 'Attachments', icon: Paperclip, component: TabAttachments },
  { id: 'workflow', label: 'Review Workflow', icon: GitCommit, component: TabWorkflow },
  { id: 'history', label: 'History', icon: Clock, component: TabHistory },
]

export function ActivityTabs({
  activity,
  onUpdate,
}: {
  activity: any
  onUpdate: (a: any) => void
}) {
  return (
    <Card className="shadow-sm border-border h-full flex flex-col overflow-hidden">
      <Tabs defaultValue="activity-details" className="flex flex-1 w-full overflow-hidden flex-col">
        <div className="w-full border-b border-border bg-muted/10 flex-shrink-0">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="flex h-14 w-max min-w-full justify-start rounded-none bg-transparent p-0">
              {tabsConfig.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="relative flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-4 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:font-bold data-[state=active]:shadow-none"
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </TabsTrigger>
                )
              })}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <CardContent className="flex-1 p-4 sm:p-6 overflow-y-auto bg-card m-0 relative">
          {tabsConfig.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="m-0 h-full focus-visible:outline-none data-[state=inactive]:hidden"
            >
              <tab.component activity={activity} onUpdate={onUpdate} task={activity} />
            </TabsContent>
          ))}
        </CardContent>
      </Tabs>
    </Card>
  )
}
