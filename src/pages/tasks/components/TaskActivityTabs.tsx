import { Task } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { TabHistory } from './tabs/TabHistory'
import { TabFeedback } from './tabs/TabFeedback'
import { TabComments } from './tabs/TabComments'
import { TabApprovalMatrix } from './tabs/TabApprovalMatrix'
import { TabEventDetails, TabRBM } from './tabs/TabGeneric'
import { TabTaskDetails } from './tabs/TabTaskDetails'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const tabsConfig = [
  { id: 'task-details', label: 'Task Details', component: TabTaskDetails },
  { id: 'event', label: 'Event Details', component: TabEventDetails },
  {
    id: 'parties',
    label: 'Involved Parties',
    component: () => (
      <p className="text-sm text-muted-foreground p-4">Involved parties configuration module.</p>
    ),
  },
  {
    id: 'sg',
    label: 'SG Participation',
    component: () => (
      <p className="text-sm text-muted-foreground p-4">SG speaking notes and welcome remarks.</p>
    ),
  },
  { id: 'rbm', label: 'RBM', component: TabRBM },
  { id: 'approval', label: 'Approval Matrix', component: TabApprovalMatrix },
  { id: 'comments', label: 'Comments', component: TabComments },
  {
    id: 'attachments',
    label: 'Attachments',
    component: () => (
      <p className="text-sm text-muted-foreground p-4">File upload and attachment list.</p>
    ),
  },
  {
    id: 'eosg',
    label: 'EOSG',
    component: () => <TabFeedback units={['RELEX', 'Legal', 'Governing Bodies', 'Protocol']} />,
  },
  {
    id: 'ops',
    label: 'OPS',
    component: () => <TabFeedback units={['EMS', 'Procurement', 'IT', 'M&E']} />,
  },
  {
    id: 'comms',
    label: 'COMMS',
    component: () => <TabFeedback units={['Communications', 'Social Media']} />,
  },
  {
    id: 'history',
    label: 'History',
    component: ({ task }: { task: Task }) => <TabHistory task={task} />,
  },
]

export function TaskActivityTabs({ task }: { task: Task }) {
  return (
    <Card className="shadow-sm border-border h-full flex flex-row overflow-hidden">
      <Tabs
        defaultValue="task-details"
        orientation="vertical"
        className="flex flex-1 w-full overflow-hidden"
      >
        <div className="w-48 sm:w-56 border-r border-border bg-muted/10 flex-shrink-0 flex flex-col">
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
            <ScrollBar orientation="vertical" className="hidden" />
          </ScrollArea>
        </div>
        <CardContent className="flex-1 p-6 overflow-y-auto bg-card m-0">
          {tabsConfig.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="mt-0 h-full focus-visible:outline-none data-[state=inactive]:hidden"
            >
              <tab.component task={task} />
            </TabsContent>
          ))}
        </CardContent>
      </Tabs>
    </Card>
  )
}
