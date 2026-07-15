import { Minus, Circle, AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface FunctionalStaffingRow {
  id?: string
  delegation_package_id?: string
  functional_area: string
  is_required: boolean
  proposed_staff_count: number
  justification: string
}

interface Props {
  formData: Record<string, any>
  onChange: (field: string, value: any) => void
  staffingRows: FunctionalStaffingRow[]
  onStaffingChange: (rows: FunctionalStaffingRow[]) => void
}

const COMPLEXITY_DRIVERS = [
  { key: 'complexity_parallel_sessions', label: 'Multiple parallel sessions' },
  { key: 'complexity_venues', label: 'Multiple venues' },
  { key: 'complexity_site_visits', label: 'Site visits / external activities' },
  { key: 'complexity_vip_participation', label: 'High-level / VIP participation' },
  { key: 'complexity_donor_engagement', label: 'Donor / stakeholder engagement' },
  { key: 'complexity_media_presence', label: 'Media presence expected' },
  { key: 'complexity_hybrid_streaming', label: 'Hybrid / streaming requirements' },
  { key: 'complexity_interpretation', label: 'Interpretation required' },
  { key: 'complexity_security_sensitive', label: 'Security-sensitive environment' },
  { key: 'complexity_participant_logistics', label: 'Complex participant logistics' },
  {
    key: 'complexity_branding_visibility',
    label: 'Significant branding / visibility requirements',
  },
] as const

const DEFAULT_STAFFING_AREAS = [
  'Programme Delivery & Facilitation',
  'Events Management & Logistics',
  'Participant & Guest Management',
  'Protocol & Security',
  'Communications & Visibility',
  'Executive / Senior Management Support',
  'Technical / Hybrid Support',
]

const BENCHMARK_CATEGORIES = ['Small Event', 'Medium Event', 'Large / High-Complexity Event']

const CONSULTATION_UNITS = [
  'EMS',
  'Communications',
  'Protocol',
  'Executive Office / EOSG',
  'Security',
  'Other',
]

const TRAFFIC_LIGHTS = [
  {
    value: 'Green',
    label: 'Green',
    description: 'Delegation is proportionate and justified.',
    color: 'bg-green-500',
    ring: 'ring-green-500',
    text: 'text-green-600',
    icon: Circle,
  },
  {
    value: 'Yellow',
    label: 'Yellow',
    description: 'Minor issues or potential inefficiencies.',
    color: 'bg-yellow-500',
    ring: 'ring-yellow-500',
    text: 'text-yellow-600',
    icon: AlertTriangle,
  },
  {
    value: 'Red',
    label: 'Red',
    description: 'Excessive staffing or unclear roles.',
    color: 'bg-red-500',
    ring: 'ring-red-500',
    text: 'text-red-600',
    icon: Minus,
  },
]

export function DelegationSopEvaluationSection({
  formData,
  onChange,
  staffingRows,
  onStaffingChange,
}: Props) {
  const ensureStaffingRows = (): FunctionalStaffingRow[] => {
    const existingAreas = staffingRows.map((r) => r.functional_area)
    const missing = DEFAULT_STAFFING_AREAS.filter((a) => !existingAreas.includes(a))
    if (missing.length === 0) return staffingRows
    const newRows: FunctionalStaffingRow[] = missing.map((area) => ({
      functional_area: area,
      is_required: false,
      proposed_staff_count: 0,
      justification: '',
    }))
    return [...staffingRows, ...newRows]
  }

  const rows = ensureStaffingRows()

  const updateStaffingRow = (index: number, field: string, value: any) => {
    const updated = rows.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    onStaffingChange(updated)
  }

  const totalStaff = rows.reduce((sum, r) => sum + (r.proposed_staff_count || 0), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delegation SOP Evaluation</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="complexity">
          <TabsList className="mb-4 flex-wrap h-auto">
            <TabsTrigger value="complexity">Event Complexity</TabsTrigger>
            <TabsTrigger value="staffing">Functional Staffing</TabsTrigger>
            <TabsTrigger value="benchmark">Staffing Benchmark</TabsTrigger>
            <TabsTrigger value="assessment">SOP Assessment</TabsTrigger>
            <TabsTrigger value="consultation">Involved Unit Consultation</TabsTrigger>
          </TabsList>

          <TabsContent value="complexity" className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              Evaluate each complexity driver below. Toggle "Yes" if applicable and provide
              comments.
            </p>
            <div className="space-y-3">
              {COMPLEXITY_DRIVERS.map((driver) => {
                const isChecked = !!formData[driver.key]
                const commentKey = `${driver.key}_comments`
                return (
                  <div
                    key={driver.key}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex items-center justify-between flex-1 gap-3">
                      <span className="text-sm font-medium">{driver.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">No</span>
                        <Switch
                          checked={isChecked}
                          onCheckedChange={(v) => onChange(driver.key, v)}
                        />
                        <span className="text-xs text-muted-foreground">Yes</span>
                      </div>
                    </div>
                    {isChecked && (
                      <Input
                        className="sm:max-w-xs"
                        placeholder="Comments..."
                        value={formData[commentKey] || ''}
                        onChange={(e) => onChange(commentKey, e.target.value)}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="staffing" className="space-y-4">
            <p className="text-sm text-muted-foreground mb-2">
              Propose staff counts across functional areas. Total proposed:{' '}
              <Badge variant="secondary">{totalStaff}</Badge>
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium py-2 pr-4">Functional Area</th>
                    <th className="text-center font-medium py-2 px-2">Required?</th>
                    <th className="text-center font-medium py-2 px-2">Proposed Staff</th>
                    <th className="text-left font-medium py-2 px-4 min-w-[200px]">
                      Initial Operational Justification
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{row.functional_area}</td>
                      <td className="py-2 px-2 text-center">
                        <Switch
                          checked={row.is_required}
                          onCheckedChange={(v) => updateStaffingRow(index, 'is_required', v)}
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <Input
                          type="number"
                          min={0}
                          className="w-20 text-center"
                          value={row.proposed_staff_count ?? 0}
                          onChange={(e) =>
                            updateStaffingRow(
                              index,
                              'proposed_staff_count',
                              e.target.value ? parseInt(e.target.value, 10) : 0,
                            )
                          }
                        />
                      </td>
                      <td className="py-2 px-4">
                        <Input
                          placeholder="Justification..."
                          value={row.justification || ''}
                          onChange={(e) =>
                            updateStaffingRow(index, 'justification', e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="benchmark" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Applicable Benchmark Category</Label>
                <Select
                  value={formData.benchmark_category || ''}
                  onValueChange={(v) => onChange('benchmark_category', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select benchmark category" />
                  </SelectTrigger>
                  <SelectContent>
                    {BENCHMARK_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Indicative Staffing Range</Label>
                <Input
                  placeholder="e.g., 3-5 staff"
                  value={formData.indicative_staffing_range || ''}
                  onChange={(e) => onChange('indicative_staffing_range', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Total Proposed KAICIID Staff</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.total_proposed_staff ?? totalStaff}
                  onChange={(e) =>
                    onChange(
                      'total_proposed_staff',
                      e.target.value ? parseInt(e.target.value, 10) : 0,
                    )
                  }
                  placeholder="0"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label className="text-sm font-medium block">
                    Proposed Delegation Within Benchmark Range?
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">No</span>
                  <Switch
                    checked={!!formData.is_within_benchmark}
                    onCheckedChange={(v) => onChange('is_within_benchmark', v)}
                  />
                  <span className="text-xs text-muted-foreground">Yes</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Justification
                {!formData.is_within_benchmark && (
                  <span className="text-destructive ml-1">
                    (recommended when outside benchmark)
                  </span>
                )}
              </Label>
              <Textarea
                placeholder="Provide justification if proposed delegation is outside the benchmark range..."
                rows={3}
                value={formData.benchmark_justification || ''}
                onChange={(e) => onChange('benchmark_justification', e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Traffic Light Assessment</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TRAFFIC_LIGHTS.map((light) => {
                  const isSelected = formData.traffic_light_status === light.value
                  const Icon = light.icon
                  return (
                    <button
                      key={light.value}
                      type="button"
                      onClick={() => onChange('traffic_light_status', light.value)}
                      className={cn(
                        'flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-all duration-200 hover:shadow-md',
                        isSelected ? cn('border-transparent ring-2', light.ring) : 'border-border',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn('h-4 w-4 rounded-full', light.color)} />
                        <span className="font-semibold">{light.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{light.description}</p>
                      {isSelected && <Icon className={cn('h-4 w-4', light.text)} />}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Assessment Comments</Label>
              <Textarea
                placeholder="Provide overall assessment comments for this delegation proposal..."
                rows={4}
                value={formData.assessment_comments || ''}
                onChange={(e) => onChange('assessment_comments', e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="consultation" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The following units will be involved in the consultation workflow for this delegation
              proposal. This section is a draft placeholder — no actions are available at this
              stage.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CONSULTATION_UNITS.map((unit) => (
                <div
                  key={unit}
                  className="flex items-center gap-2 rounded-lg border border-dashed p-3 bg-muted/20"
                >
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                  <span className="text-sm font-medium text-muted-foreground">{unit}</span>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 p-3">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Consultation workflow actions (request feedback, submit, approve) will be available
                in a future phase. The delegation proposal status remains <strong>Draft</strong>.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
