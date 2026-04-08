import { Task } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { TabHistory } from './tabs/TabHistory'
import { TabFeedback } from './tabs/TabFeedback'
import { TabComments } from './tabs/TabComments'
import { TabApprovalMatrix } from './tabs/TabApprovalMatrix'
import { TabEventDetails, TabRBM } from './tabs/TabGeneric'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const tabsConfig = [
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
    <Card className="shadow-sm border-border h-full flex flex-col">
      <Tabs defaultValue="event" className="flex-1 flex flex-col w-full overflow-hidden">
        <div className="border-b border-border bg-card px-2">
          <ScrollArea className="w-full">
            <TabsList className="h-12 w-max bg-transparent p-0 flex justify-start">
              {tabsConfig.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 text-sm font-medium transition-none hover:text-foreground/80 data-[state=active]:text-primary"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>
        <CardContent className="flex-1 p-6 overflow-y-auto bg-card">
          {tabsConfig.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="mt-0 h-full focus-visible:outline-none"
            >
              <tab.component task={task} />
            </TabsContent>
          ))}
        </CardContent>
      </Tabs>
    </Card>
  )
}
