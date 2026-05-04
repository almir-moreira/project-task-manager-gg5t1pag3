import { useState, useEffect } from 'react'
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  ArrowLeft,
  ArrowUpDown,
  AlertTriangle,
  Clock,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Link } from 'react-router-dom'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { FunnelChart, Funnel, LabelList, Cell } from 'recharts'

const STAGES = ['Preparation', 'Feedback', 'Review', 'Approval', 'Done']

interface Workflow {
  id: string
  role: string
  stage: number
  step: number
  category: string
}

type SortKey = keyof Workflow

export default function AdminPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState('')
  const [step, setStep] = useState('')
  const [stageOrder, setStageOrder] = useState('')
  const [category, setCategory] = useState('Review')
  const { toast } = useToast()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRole, setEditRole] = useState('')
  const [editStep, setEditStep] = useState('')
  const [editStageOrder, setEditStageOrder] = useState('')
  const [editCategory, setEditCategory] = useState('')

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'stage',
    direction: 'asc',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [wfRes, actRes] = await Promise.all([
      supabase.from('workflows').select('*').order('stage').order('step'),
      supabase
        .from('activities')
        .select('id, activity_name, task_number, current_stage, stage_started_at'),
    ])

    if (wfRes.error) {
      toast({ title: 'Error fetching workflows', variant: 'destructive' })
    } else {
      setWorkflows(wfRes.data || [])
    }

    if (actRes.data) {
      setActivities(actRes.data)
    }
    setLoading(false)
  }

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const sortedWorkflows = [...workflows].sort((a, b) => {
    const dir = sortConfig.direction === 'asc' ? 1 : -1
    const aVal = a[sortConfig.key]
    const bVal = b[sortConfig.key]

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      const cmp = aVal.localeCompare(bVal)
      if (cmp !== 0) return cmp * dir
    } else if (typeof aVal === 'number' && typeof bVal === 'number') {
      if (aVal !== bVal) return (aVal - bVal) * dir
    }

    if (a.stage !== b.stage) return (a.stage || 0) - (b.stage || 0)
    return (a.step || 0) - (b.step || 0)
  })

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role || !step || !stageOrder || !category) return

    const { data, error } = await supabase
      .from('workflows')
      .insert({ role, step: parseInt(step), category, stage: parseInt(stageOrder) })
      .select()
      .single()

    if (error) {
      toast({ title: 'Error adding workflow', variant: 'destructive' })
    } else if (data) {
      setWorkflows([...workflows, data])
      setRole('')
      setStep('')
      setStageOrder('')
      toast({ title: 'Workflow added successfully' })
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('workflows').delete().eq('id', id)
    if (error) {
      toast({ title: 'Error deleting workflow', variant: 'destructive' })
    } else {
      setWorkflows(workflows.filter((w) => w.id !== id))
      toast({ title: 'Workflow deleted successfully' })
    }
  }

  const startEdit = (wf: Workflow) => {
    setEditingId(wf.id)
    setEditRole(wf.role)
    setEditStep(String(wf.step || 1))
    setEditStageOrder(String(wf.stage))
    setEditCategory(wf.category || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async (id: string) => {
    if (!editRole || !editStep || !editStageOrder || !editCategory) return

    const { data, error } = await supabase
      .from('workflows')
      .update({
        role: editRole,
        step: parseInt(editStep),
        category: editCategory,
        stage: parseInt(editStageOrder),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      toast({ title: 'Error updating workflow', variant: 'destructive' })
    } else if (data) {
      setWorkflows(workflows.map((w) => (w.id === id ? data : w)))
      setEditingId(null)
      toast({ title: 'Workflow updated successfully' })
    }
  }

  const existingCategories = Array.from(new Set(workflows.map((w) => w.category).filter(Boolean)))
  const defaultCategories = ['Feedback', 'Review', 'Approval']
  const allCategories = Array.from(new Set([...defaultCategories, ...existingCategories]))

  const calculateAgingDays = (dateString?: string) => {
    if (!dateString) return 0
    const diffTime = Math.abs(new Date().getTime() - new Date(dateString).getTime())
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  }

  const calculateAgingHours = (dateString?: string) => {
    if (!dateString) return 0
    const diffTime = Math.abs(new Date().getTime() - new Date(dateString).getTime())
    return diffTime / (1000 * 60 * 60)
  }

  const funnelData = STAGES.map((stage) => ({
    name: stage,
    value: activities.filter((a) => (a.current_stage || 'Preparation') === stage).length,
    fill: `var(--color-${stage.toLowerCase()})`,
  }))

  const activeActivities = activities.filter((a) => a.current_stage !== 'Done')

  const delayedApprovals = activities.filter((a) => {
    return (
      (a.current_stage || 'Preparation') === 'Approval' &&
      calculateAgingHours(a.stage_started_at) > 48
    )
  })

  const chartConfig = {
    preparation: { label: 'Preparation', color: 'hsl(var(--chart-1))' },
    feedback: { label: 'Feedback', color: 'hsl(var(--chart-2))' },
    review: { label: 'Review', color: 'hsl(var(--chart-3))' },
    approval: { label: 'Approval', color: 'hsl(var(--chart-4))' },
    done: { label: 'Done', color: 'hsl(var(--chart-5))' },
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-6 h-12">
          <TabsTrigger value="dashboard" className="px-6 py-2.5">
            Monitoring Dashboard
          </TabsTrigger>
          <TabsTrigger value="configuration" className="px-6 py-2.5">
            Workflow Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Funnel</CardTitle>
                <CardDescription>
                  Activities distributed by their current workflow stage
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] pt-4 flex justify-center">
                <ChartContainer config={chartConfig} className="w-full h-full max-w-[400px]">
                  <FunnelChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Funnel dataKey="value" data={funnelData} isAnimationActive>
                      <LabelList position="right" fill="#888" stroke="none" dataKey="name" />
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Funnel>
                  </FunnelChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader className="bg-red-50/50 border-b border-red-100">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  <CardTitle>Delay Alerts (Approval &gt; 48h)</CardTitle>
                </div>
                <CardDescription>
                  Activities stuck in Approval for more than 48 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto max-h-[350px]">
                {delayedApprovals.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                    <Check className="w-8 h-8 text-emerald-500 mb-2 opacity-50" />
                    No delayed approvals. Excellent!
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Time in Stage</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {delayedApprovals.map((a) => (
                        <TableRow key={a.id} className="bg-red-50/20">
                          <TableCell className="font-medium">
                            {a.task_number}
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {a.activity_name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="destructive" className="font-mono">
                              {Math.floor(calculateAgingHours(a.stage_started_at))} hours
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link to={`/tasks/${a.id}`}>
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <CardTitle>Active Activities Aging</CardTitle>
              </div>
              <CardDescription>Days spent in the current workflow stage</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task Number</TableHead>
                    <TableHead>Activity Name</TableHead>
                    <TableHead>Current Stage</TableHead>
                    <TableHead className="text-right">Days in Stage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeActivities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No active activities to display.
                      </TableCell>
                    </TableRow>
                  ) : (
                    activeActivities
                      .sort(
                        (a, b) =>
                          calculateAgingDays(b.stage_started_at) -
                          calculateAgingDays(a.stage_started_at),
                      )
                      .map((a) => {
                        const days = calculateAgingDays(a.stage_started_at)
                        return (
                          <TableRow key={a.id}>
                            <TableCell className="font-medium">
                              <Link to={`/tasks/${a.id}`} className="text-blue-600 hover:underline">
                                {a.task_number || 'Unnamed'}
                              </Link>
                            </TableCell>
                            <TableCell className="max-w-[300px] truncate">
                              {a.activity_name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-muted">
                                {a.current_stage || 'Preparation'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <span
                                className={`font-mono ${days > 14 ? 'text-red-600 font-bold' : days > 7 ? 'text-amber-600 font-bold' : ''}`}
                              >
                                {days} {days === 1 ? 'day' : 'days'}
                              </span>
                            </TableCell>
                          </TableRow>
                        )
                      })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration">
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-muted/20">
              <h2 className="text-xl font-semibold">Workflow Stages Configuration</h2>
              <p className="text-muted-foreground mt-1">
                Manage the logical flow, sequencing, and categories of your review stages.
              </p>
            </div>

            <div className="p-6">
              <form onSubmit={handleAdd} className="flex flex-col md:flex-row items-end gap-4 mb-8">
                <div className="flex-1 space-y-2 w-full">
                  <label className="text-sm font-medium">Role Name</label>
                  <Input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Legal, Finance"
                  />
                </div>
                <div className="w-full md:w-48 space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    list="category-list"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Select or type..."
                  />
                  <datalist id="category-list">
                    {allCategories.map((c) => (
                      <option key={c as string} value={c as string} />
                    ))}
                  </datalist>
                </div>
                <div className="w-full md:w-32 space-y-2">
                  <label className="text-sm font-medium">Stage Order</label>
                  <Input
                    type="number"
                    value={stageOrder}
                    onChange={(e) => setStageOrder(e.target.value)}
                    placeholder="e.g. 1"
                    min="1"
                  />
                </div>
                <div className="w-full md:w-32 space-y-2">
                  <label className="text-sm font-medium">Step Order</label>
                  <Input
                    type="number"
                    value={step}
                    onChange={(e) => setStep(e.target.value)}
                    placeholder="e.g. 1"
                    min="1"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!role || !step || !stageOrder || !category}
                  className="w-full md:w-auto h-10"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Stage
                </Button>
              </form>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="w-[140px] cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSort('stage')}
                      >
                        <div className="flex items-center gap-1">
                          Stage Order <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="w-[130px] cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSort('step')}
                      >
                        <div className="flex items-center gap-1">
                          Step Order <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSort('role')}
                      >
                        <div className="flex items-center gap-1">
                          Role Name <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleSort('category')}
                      >
                        <div className="flex items-center gap-1">
                          Category <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedWorkflows.map((wf) => (
                      <TableRow key={wf.id}>
                        {editingId === wf.id ? (
                          <>
                            <TableCell>
                              <Input
                                type="number"
                                value={editStageOrder}
                                onChange={(e) => setEditStageOrder(e.target.value)}
                                className="h-8 w-20"
                                min="1"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={editStep}
                                onChange={(e) => setEditStep(e.target.value)}
                                className="h-8 w-20"
                                min="1"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value)}
                                className="h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                list="category-list"
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value)}
                                className="h-8"
                              />
                            </TableCell>
                            <TableCell className="text-right space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => saveEdit(wf.id)}
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8 w-8"
                                disabled={
                                  !editRole || !editStep || !editStageOrder || !editCategory
                                }
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={cancelEdit}
                                className="text-muted-foreground hover:text-foreground h-8 w-8"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="font-medium text-center">{wf.stage}</TableCell>
                            <TableCell className="font-medium text-center">
                              {wf.step || 1}
                            </TableCell>
                            <TableCell>{wf.role}</TableCell>
                            <TableCell>{wf.category}</TableCell>
                            <TableCell className="text-right space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => startEdit(wf)}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(wf.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                    {workflows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No workflow stages configured yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
