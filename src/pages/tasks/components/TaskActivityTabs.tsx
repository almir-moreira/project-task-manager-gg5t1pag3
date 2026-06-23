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
    <Tabs
      defaultValue="activity-details"
      orientation="vertical"
      className="flex flex-col xl:flex-row gap-6 w-full flex-1 h-full"
    >
      <div className="w-full xl:w-[320px] 2xl:w-[350px] flex flex-col gap-6 flex-shrink-0 xl:h-[calc(100vh-10rem)] xl:overflow-y-auto pb-4 pr-1">
        {leftPanel}
        <Card className="shadow-sm border-border flex flex-col overflow-hidden flex-shrink-0">
          <ScrollArea className="w-full">
            <TabsList className="flex flex-row xl:flex-col h-auto w-max xl:w-full min-w-full xl:min-w-0 justify-start items-stretch rounded-none bg-transparent p-0">
              {tabsConfig.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="relative flex items-center gap-3 rounded-none border-b-2 xl:border-b-0 xl:border-l-2 border-transparent px-4 py-3 xl:py-4 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-bold data-[state=active]:shadow-none justify-start"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
            <ScrollBar orientation="horizontal" className="xl:hidden" />
          </ScrollArea>
        </Card>
      </div>
      <div className="flex-1 w-full xl:h-[calc(100vh-10rem)] min-h-[600px]">
        <Card className="shadow-sm border-border h-full flex flex-col overflow-hidden">
          <CardContent className="flex-1 p-0 overflow-hidden bg-card m-0 relative flex flex-col">
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
      </div>
    </Tabs>
  )
}
