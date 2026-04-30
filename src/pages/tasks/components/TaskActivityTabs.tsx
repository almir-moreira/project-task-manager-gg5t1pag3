import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { TabHistory } from './tabs/TabHistory'
import { TabFeedback } from './tabs/TabFeedback'
import { TabComments } from './tabs/TabComments'
import { TabApprovalMatrix } from './tabs/TabApprovalMatrix'
import { TabEventDetails, TabRBM, TabInvolvedParties, TabSGParticipation } from './tabs/TabGeneric'
import { TabAttachments } from './tabs/TabAttachments'
import { TabActivityDetails } from './tabs/TabTaskDetails'
import { TabWorkflow } from './tabs/TabWorkflow'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const tabsConfig = [
  { id: 'activity-details', label: 'Activity Details', component: TabActivityDetails },
  { id: 'workflow', label: 'Review Workflow', component: TabWorkflow },
  { id: 'event', label: 'Event Details', component: TabEventDetails },
  { id: 'parties', label: 'Involved Parties', component: TabInvolvedParties },
  { id: 'sg', label: 'SG Participation', component: TabSGParticipation },
  { id: 'rbm', label: 'RBM', component: TabRBM },
  { id: 'approval', label: 'Approval Matrix', component: TabApprovalMatrix },
  { id: 'comments', label: 'Comments', component: TabComments },
  { id: 'attachments', label: 'Attachments', component: TabAttachments },
  {
    id: 'eosg',
    label: 'EOSG',
    component: ({ activity, onUpdate }: any) => (
      <TabFeedback
        units={['RELEX', 'Legal', 'Governing Bodies', 'Protocol']}
        task={activity}
        onUpdate={onUpdate}
      />
    ),
  },
  {
    id: 'ops',
    label: 'OPS',
    component: ({ activity, onUpdate }: any) => (
      <TabFeedback
        units={['EMS', 'Procurement', 'IT', 'M&E']}
        task={activity}
        onUpdate={onUpdate}
      />
    ),
  },
  {
    id: 'comms',
    label: 'COMMS',
    component: ({ activity, onUpdate }: any) => (
      <TabFeedback units={['Communications', 'Social Media']} task={activity} onUpdate={onUpdate} />
    ),
  },
  { id: 'history', label: 'History', component: TabHistory },
]

export function ActivityTabs({
  activity,
  onUpdate,
}: {
  activity: any
  onUpdate: (a: any) => void
}) {
  return (
    <Card className="shadow-sm border-border h-full flex flex-col sm:flex-row overflow-hidden">
      <Tabs
        defaultValue="activity-details"
        orientation="vertical"
        className="flex flex-1 w-full overflow-hidden flex-col sm:flex-row"
      >
        <div className="w-full sm:w-56 border-b sm:border-b-0 sm:border-r border-border bg-muted/10 flex-shrink-0 flex flex-col h-48 sm:h-full">
          <ScrollArea className="flex-1 w-full">
            <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 items-stretch justify-start">
              {tabsConfig.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-r-2 data-[state=active]:border-primary rounded-none px-4 py-3 text-sm font-medium transition-all hover:bg-muted/50 data-[state=active]:text-primary justify-start border-r-2 border-transparent text-left"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
        <CardContent className="flex-1 p-0 sm:p-6 overflow-y-auto bg-card m-0 relative">
          {tabsConfig.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="m-0 p-4 sm:p-0 h-full focus-visible:outline-none data-[state=inactive]:hidden"
            >
              <tab.component activity={activity} onUpdate={onUpdate} task={activity} />
            </TabsContent>
          ))}
        </CardContent>
      </Tabs>
    </Card>
  )
}
