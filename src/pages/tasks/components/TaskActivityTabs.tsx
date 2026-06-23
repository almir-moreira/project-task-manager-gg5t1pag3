import * as React from 'react'
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
  leftPanel,
}: {
  activity: any
  onUpdate: (a: any) => void
  leftPanel?: React.ReactNode
}) {
  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full flex-1 h-full min-h-0">
      {leftPanel && (
        <div className="w-full xl:w-[320px] 2xl:w-[350px] flex flex-col gap-6 flex-shrink-0 xl:h-[calc(100vh-10rem)] xl:overflow-y-auto pb-4 pr-1">
          {leftPanel}
        </div>
      )}

      <div className="flex-1 w-full min-w-0 flex flex-col h-full xl:h-[calc(100vh-10rem)]">
        <Tabs
          defaultValue="activity-details"
          className="flex flex-col w-full h-full flex-1 min-h-0"
        >
          <div className="w-full overflow-hidden border-b border-border bg-background mb-4 rounded-t-md">
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="flex h-14 w-max items-center justify-start rounded-none bg-transparent p-0">
                {tabsConfig.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="relative flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-4 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 data-[state=active]:font-bold data-[state=active]:shadow-none"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{tab.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
              <ScrollBar orientation="horizontal" className="h-1.5" />
            </ScrollArea>
          </div>

          <Card className="shadow-sm border-border flex-1 flex flex-col overflow-hidden min-h-0">
            <CardContent className="flex-1 p-0 overflow-hidden bg-card m-0 relative flex flex-col min-h-0">
              {tabsConfig.map((tab) => (
                <TabsContent
                  key={tab.id}
                  value={tab.id}
                  className="m-0 h-full flex-1 overflow-y-auto focus-visible:outline-none data-[state=inactive]:hidden p-4 sm:p-6"
                >
                  <tab.component activity={activity} onUpdate={onUpdate} task={activity} />
                </TabsContent>
              ))}
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  )
}
