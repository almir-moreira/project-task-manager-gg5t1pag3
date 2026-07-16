import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { YesNoField } from './travel-form-helpers'
import { cn } from '@/lib/utils'

const TRAVELER_ROLES = [
  'Speaker / Panelist',
  'Facilitator / Trainer',
  'Institutional Representation',
  'Partnership / Donor Engagement',
  'Operational Support',
  'Training Participant',
  'Protocol / Communications Support',
  'Other',
]

const EXPECTED_BENEFITS = [
  'Visibility and institutional representation',
  'Partnership development',
  'Donor engagement',
  'Programme delivery',
  'Knowledge exchange / learning',
  'Stakeholder engagement',
  'Operational coordination',
  'Other',
]

const TRAFFIC_LIGHTS = [
  { value: 'Green', label: 'Green', color: 'bg-green-500', ring: 'ring-green-500' },
  { value: 'Yellow', label: 'Yellow', color: 'bg-yellow-500', ring: 'ring-yellow-500' },
  { value: 'Red', label: 'Red', color: 'bg-red-500', ring: 'ring-red-500' },
]

const ASSESSMENT_AREAS = [
  { key: 'mission_tl_strategic_relevance', label: 'Strategic Relevance' },
  { key: 'mission_tl_clarity_of_role', label: 'Clarity of Role' },
  { key: 'mission_tl_expected_value', label: 'Expected Institutional Value' },
  { key: 'mission_tl_cost_proportionality', label: 'Cost Proportionality' },
  { key: 'mission_tl_necessity', label: 'Necessity of Physical Attendance' },
]

interface Props {
  formData: Record<string, any>
  onChange: (field: string, value: any) => void
}

export function MissionSopEvaluationSection({ formData, onChange }: Props) {
  const toggleArrayValue = (field: string, value: string) => {
    const current: string[] = Array.isArray(formData[field]) ? formData[field] : []
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onChange(field, updated)
  }

  const showOtherRole = (formData.traveler_role || []).includes('Other')
  const showOtherBenefit = (formData.expected_institutional_benefits || []).includes('Other')
  const showPhysicalJustification = formData.remote_participation_considered === true
  const showCombinationDetails = formData.mission_combination_possible === true
  const staffCount = formData.number_of_kaiciid_staff_traveling ?? 1
  const showAdditionalStaffJustification = staffCount > 1

  const renderMultiSelect = (field: string, options: string[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt) => {
        const checked = (formData[field] || []).includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggleArrayValue(field, opt)}
            className="flex items-center gap-2 rounded-lg border p-2 cursor-pointer hover:bg-muted/50 text-left w-full"
          >
            <Checkbox
              checked={checked}
              onCheckedChange={() => {}}
              className="pointer-events-none"
            />
            <span className="text-sm">{opt}</span>
          </button>
        )
      })}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mission SOP Evaluation / Justification</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="purpose">
          <TabsList className="mb-4 flex-wrap h-auto">
            <TabsTrigger value="purpose">Purpose &amp; Relevance</TabsTrigger>
            <TabsTrigger value="role">Traveler Role</TabsTrigger>
            <TabsTrigger value="outcomes">Expected Outcomes</TabsTrigger>
            <TabsTrigger value="necessity">Physical Attendance</TabsTrigger>
            <TabsTrigger value="cost">Cost Efficiency</TabsTrigger>
            <TabsTrigger value="assessment">Self-Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="purpose" className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Purpose of Mission</Label>
              <Textarea
                placeholder="Describe the purpose of this mission..."
                rows={3}
                value={formData.mission_purpose || ''}
                onChange={(e) => onChange('mission_purpose', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Strategic Relevance</Label>
              <p className="text-xs text-muted-foreground">
                Explain how this mission supports KAICIID's mandate, approved priorities,
                institutional partnerships, donor engagement, visibility objectives, operational
                delivery, or institutional representation.
              </p>
              <Textarea
                placeholder="Explain the strategic relevance..."
                rows={4}
                value={formData.strategic_relevance || ''}
                onChange={(e) => onChange('strategic_relevance', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Relevance of Organizing Institution / Event
              </Label>
              <Textarea
                placeholder="Describe the relevance of the organizing institution or event..."
                rows={3}
                value={formData.organizing_institution_relevance || ''}
                onChange={(e) => onChange('organizing_institution_relevance', e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="role" className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Role of Staff Member</Label>
              <p className="text-xs text-muted-foreground">Select all that apply.</p>
              {renderMultiSelect('traveler_role', TRAVELER_ROLES)}
            </div>
            {showOtherRole && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Other Role Details</Label>
                <Input
                  placeholder="Specify other role..."
                  value={formData.traveler_role_other_details || ''}
                  onChange={(e) => onChange('traveler_role_other_details', e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Description of Role</Label>
              <Textarea
                placeholder="Describe your role in this mission..."
                rows={3}
                value={formData.traveler_role_description || ''}
                onChange={(e) => onChange('traveler_role_description', e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="outcomes" className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Expected Institutional Benefits</Label>
              <p className="text-xs text-muted-foreground">Select all that apply.</p>
              {renderMultiSelect('expected_institutional_benefits', EXPECTED_BENEFITS)}
            </div>
            {showOtherBenefit && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Other Benefits Details</Label>
                <Input
                  placeholder="Specify other benefits..."
                  value={formData.expected_benefit_other_details || ''}
                  onChange={(e) => onChange('expected_benefit_other_details', e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Expected Follow-Up Actions</Label>
              <Textarea
                placeholder="Describe expected follow-up actions..."
                rows={3}
                value={formData.expected_follow_up_actions || ''}
                onChange={(e) => onChange('expected_follow_up_actions', e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="necessity" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <YesNoField
                label="Remote Participation Considered?"
                value={formData.remote_participation_considered}
                onChange={(v) => onChange('remote_participation_considered', v)}
              />
              <YesNoField
                label="Mission Combination Possible?"
                value={formData.mission_combination_possible}
                onChange={(v) => onChange('mission_combination_possible', v)}
              />
            </div>
            {showPhysicalJustification && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Physical Attendance Justification</Label>
                <Textarea
                  placeholder="Justify why physical attendance is necessary despite remote participation being considered..."
                  rows={3}
                  value={formData.physical_attendance_justification || ''}
                  onChange={(e) => onChange('physical_attendance_justification', e.target.value)}
                />
              </div>
            )}
            {showCombinationDetails && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Combination Details</Label>
                <Textarea
                  placeholder="Describe how this mission is combined with other activities..."
                  rows={3}
                  value={formData.mission_combination_details || ''}
                  onChange={(e) => onChange('mission_combination_details', e.target.value)}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="cost" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Number of KAICIID Staff Traveling</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.number_of_kaiciid_staff_traveling ?? 1}
                  onChange={(e) =>
                    onChange(
                      'number_of_kaiciid_staff_traveling',
                      e.target.value ? parseInt(e.target.value, 10) : 1,
                    )
                  }
                />
              </div>
            </div>
            {showAdditionalStaffJustification && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Additional Staff Justification</Label>
                <p className="text-xs text-muted-foreground">
                  Explain why additional staff participation is operationally required.
                </p>
                <Textarea
                  placeholder="Justify the need for additional staff..."
                  rows={3}
                  value={formData.additional_staff_justification || ''}
                  onChange={(e) => onChange('additional_staff_justification', e.target.value)}
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <YesNoField
                label="Mission planned sufficiently in advance?"
                value={formData.mission_planned_in_advance}
                onChange={(v) => onChange('mission_planned_in_advance', v)}
              />
              <YesNoField
                label="Economical travel options considered?"
                value={formData.economical_travel_options}
                onChange={(v) => onChange('economical_travel_options', v)}
              />
              <YesNoField
                label="Mission dates limited to operational necessity?"
                value={formData.mission_dates_limited}
                onChange={(v) => onChange('mission_dates_limited', v)}
              />
              <YesNoField
                label="Remote alternatives assessed?"
                value={formData.remote_alternatives_assessed}
                onChange={(v) => onChange('remote_alternatives_assessed', v)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Cost Efficiency Comments</Label>
              <Textarea
                placeholder="Additional comments on cost efficiency..."
                rows={3}
                value={formData.cost_efficiency_comments || ''}
                onChange={(e) => onChange('cost_efficiency_comments', e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-4">
            <div className="space-y-3">
              {ASSESSMENT_AREAS.map((area) => (
                <div
                  key={area.key}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg border p-3"
                >
                  <span className="text-sm font-medium flex-1">{area.label}</span>
                  <div className="flex gap-2">
                    {TRAFFIC_LIGHTS.map((light) => {
                      const isSelected = formData[area.key] === light.value
                      return (
                        <button
                          key={light.value}
                          type="button"
                          onClick={() => onChange(area.key, isSelected ? '' : light.value)}
                          className={cn(
                            'flex items-center gap-1.5 rounded-md border-2 px-3 py-1.5 text-xs font-medium transition-all duration-200',
                            isSelected
                              ? cn('border-transparent ring-2', light.ring)
                              : 'border-border',
                          )}
                        >
                          <div className={cn('h-3 w-3 rounded-full', light.color)} />
                          {light.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Assessment Comments</Label>
              <Textarea
                placeholder="Provide overall assessment comments..."
                rows={3}
                value={formData.mission_traffic_light_comments || ''}
                onChange={(e) => onChange('mission_traffic_light_comments', e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
