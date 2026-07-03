import { useEffect, useState, useMemo, useCallback } from 'react'
import type { CSSProperties } from 'react'
import { CalendarDays, AlertCircle, FilterX, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  getCalendarReport,
  type MonthGroup,
  type CalendarReportRow,
} from '@/services/calendar-report'
import { formatDate } from '@/lib/utils'

const DATE_FORMAT = 'd MMM yyyy'

const MONTH_HEADER_STYLE: CSSProperties = {
  backgroundColor: '#00576B',
}

const PROJECT_OWNER_STYLE: CSSProperties = {
  backgroundColor: '#DCFCE7',
  color: '#166534',
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function getDisplayValue(value: string | null | undefined, fallback = '—'): string {
  if (value === null || value === undefined || value === '') return fallback
  return value
}

function getCategoryCellStyle(category: string | null | undefined): CSSProperties {
  const normalized = (category ?? '').toLowerCase().trim()
  if (normalized === 'participation') {
    return { backgroundColor: '#E5E7EB', color: '#374151' }
  }
  if (normalized === 'kaiciid event' || normalized === 'kaiciid co-organized event') {
    return { backgroundColor: '#DBEAFE', color: '#1E3A8A' }
  }
  return {}
}

function getApprovalCellStyle(status: string | null | undefined): CSSProperties {
  const normalized = (status ?? '').toLowerCase().trim()
  if (normalized === 'in process') {
    return { backgroundColor: '#FCA5A5', color: '#7F1D1D' }
  }
  if (normalized === 'approved') {
    return { backgroundColor: '#FFFFFF', color: '#111827' }
  }
  return {}
}

function normalizeCategory(value: string | null | undefined): string {
  if (!value) return ''
  const lower = value.toLowerCase().trim()
  if (lower === 'kaiciid event') return 'KAICIID Event'
  if (lower === 'kaiciid co-organized event') return 'KAICIID Co-organized Event'
  if (lower === 'participation') return 'Participation'
  return value
}

function getEmsProtocolLabel(row: CalendarReportRow): string {
  if (row.ems_protocol_involvement) return row.ems_protocol_involvement
  if (row.inv_ems && row.inv_protocol) return 'EMS & Protocol'
  if (row.inv_ems) return 'EMS'
  if (row.inv_protocol) return 'Protocol'
  return 'None'
}

function getYearFromDate(row: CalendarReportRow): number | null {
  const dateStr = row.month_start ?? row.start_date ?? row.sort_date
  if (!dateStr) return null
  const year = new Date(dateStr).getFullYear()
  return isNaN(year) ? null : year
}

interface FilterState {
  year: string
  month: string
  category: string
  approval: string
  projectOwner: string
  location: string
  costCenter: string
}

const DEFAULT_FILTERS: FilterState = {
  year: '',
  month: 'all',
  category: 'all',
  approval: 'all',
  projectOwner: 'all',
  location: 'all',
  costCenter: 'all',
}

function MonthSection({ group }: { group: MonthGroup }) {
  return (
    <Card className="mb-6 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3" style={MONTH_HEADER_STYLE}>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-white" />
          <span className="text-base font-semibold text-white">{group.monthLabel}</span>
        </div>
        <span className="text-sm font-normal text-white/80">
          {group.rows.length} event{group.rows.length !== 1 ? 's' : ''}
        </span>
      </div>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[1400px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b-2">
                <TableHead className="w-[100px] min-w-[100px] whitespace-nowrap">
                  Start Date
                </TableHead>
                <TableHead className="w-[100px] min-w-[100px] whitespace-nowrap">
                  End Date
                </TableHead>
                <TableHead className="min-w-[200px] max-w-[320px]">Name of Event</TableHead>
                <TableHead className="w-[140px] min-w-[120px]">Category</TableHead>
                <TableHead className="w-[130px] min-w-[120px]">Location</TableHead>
                <TableHead className="w-[60px] min-w-[60px] text-center whitespace-nowrap">
                  PAX
                </TableHead>
                <TableHead className="w-[110px] min-w-[110px] whitespace-nowrap">
                  Approval
                </TableHead>
                <TableHead className="w-[130px] min-w-[120px]">
                  Date &amp; Location Status
                </TableHead>
                <TableHead className="w-[130px] min-w-[120px]">Project Owner</TableHead>
                <TableHead className="min-w-[200px] max-w-[360px]">Short Description</TableHead>
                <TableHead className="w-[100px] min-w-[100px] whitespace-nowrap">
                  Cost Centre
                </TableHead>
                <TableHead className="w-[110px] min-w-[110px]">EMS / Protocol</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.rows.map((row) => {
                const rowId = row.id ?? row.activity_id
                const link = rowId ? `/tasks/${rowId}` : null
                const eventName = getDisplayValue(row.event_name || row.activity_name, '—')
                const approvalStatus = row.approval_status || row.event_approval_status
                const categoryStyle = getCategoryCellStyle(row.event_category)
                const approvalStyle = getApprovalCellStyle(approvalStatus)

                return (
                  <TableRow
                    key={rowId ?? `${row.start_date}-${row.event_name}`}
                    className={link ? 'cursor-pointer hover:bg-muted/50' : ''}
                  >
                    <TableCell className="whitespace-nowrap text-sm">
                      {row.start_date ? formatDate(row.start_date, DATE_FORMAT) : '—'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {row.end_date ? formatDate(row.end_date, DATE_FORMAT) : '—'}
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className="font-medium leading-snug break-words">{eventName}</span>
                    </TableCell>
                    <TableCell className="text-sm" style={categoryStyle}>
                      {getDisplayValue(row.event_category, 'Not specified')}
                    </TableCell>
                    <TableCell className="text-sm">
                      {getDisplayValue(row.location || row.event_location, 'Not specified')}
                    </TableCell>
                    <TableCell className="text-center text-sm whitespace-nowrap">
                      {row.pax !== null && row.pax !== undefined ? row.pax : '—'}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap" style={approvalStyle}>
                      {getDisplayValue(approvalStatus, '—')}
                    </TableCell>
                    <TableCell className="text-sm">
                      {getDisplayValue(row.date_location_status, 'Not specified')}
                    </TableCell>
                    <TableCell className="text-sm" style={PROJECT_OWNER_STYLE}>
                      {getDisplayValue(row.project_owner_name, 'Not specified')}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <span className="leading-snug break-words">
                        {getDisplayValue(row.short_description, '—')}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {getDisplayValue(row.cost_center_code, '—')}
                    </TableCell>
                    <TableCell className="text-sm">{getEmsProtocolLabel(row)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default function KaiciidCalendarReport() {
  const [allGroups, setAllGroups] = useState<MonthGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getCalendarReport()
      .then((data) => {
        if (!cancelled) {
          setAllGroups(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Calendar report error:', err)
          setError('Unable to load the KAICIID Events Calendar report.')
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const allRows = useMemo(() => {
    return allGroups.flatMap((g) => g.rows)
  }, [allGroups])

  const availableYears = useMemo(() => {
    const yearSet = new Set<number>()
    for (const row of allRows) {
      const year = getYearFromDate(row)
      if (year !== null) yearSet.add(year)
    }
    return Array.from(yearSet).sort((a, b) => a - b)
  }, [allRows])

  const defaultYear = useMemo(() => {
    const currentYear = new Date().getFullYear()
    if (availableYears.includes(currentYear)) return String(currentYear)
    if (availableYears.length === 0) return ''
    let nearest = availableYears[0]
    let minDiff = Math.abs(nearest - currentYear)
    for (const y of availableYears) {
      const diff = Math.abs(y - currentYear)
      if (diff < minDiff) {
        minDiff = diff
        nearest = y
      }
    }
    return String(nearest)
  }, [availableYears])

  useEffect(() => {
    if (defaultYear && !filters.year) {
      setFilters((prev) => ({ ...prev, year: defaultYear }))
    }
  }, [defaultYear, filters.year])

  const categoryOptions = useMemo(() => {
    const set = new Set<string>()
    for (const row of allRows) {
      const normalized = normalizeCategory(row.event_category)
      if (normalized) set.add(normalized)
    }
    return Array.from(set).sort()
  }, [allRows])

  const approvalOptions = useMemo(() => {
    const set = new Set<string>()
    for (const row of allRows) {
      const status = row.approval_status || row.event_approval_status
      if (status) set.add(status)
    }
    return Array.from(set).sort()
  }, [allRows])

  const projectOwnerOptions = useMemo(() => {
    const set = new Set<string>()
    for (const row of allRows) {
      const name = row.project_owner_name
      if (name && name.trim()) {
        set.add(name.trim())
      }
    }
    return Array.from(set).sort()
  }, [allRows])

  const locationOptions = useMemo(() => {
    const set = new Set<string>()
    for (const row of allRows) {
      const loc = row.location || row.event_location
      if (loc && loc.trim()) {
        set.add(loc.trim())
      }
    }
    return Array.from(set).sort()
  }, [allRows])

  const costCenterOptions = useMemo(() => {
    const set = new Set<string>()
    for (const row of allRows) {
      const code = row.cost_center_code
      if (code && code.trim()) {
        set.add(code.trim())
      }
    }
    return Array.from(set).sort()
  }, [allRows])

  const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleReset = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS, year: defaultYear })
  }, [defaultYear])

  const filteredGroups = useMemo(() => {
    const selectedYear = filters.year ? parseInt(filters.year, 10) : null
    const selectedMonthIndex = filters.month !== 'all' ? MONTH_NAMES.indexOf(filters.month) : null

    const filteredRows = allRows.filter((row) => {
      if (selectedYear !== null) {
        const rowYear = getYearFromDate(row)
        if (rowYear !== selectedYear) return false
      }

      if (selectedMonthIndex !== null) {
        const dateStr = row.start_date ?? row.sort_date ?? row.month_start
        if (dateStr) {
          const month = new Date(dateStr).getMonth()
          if (month !== selectedMonthIndex) return false
        } else {
          return false
        }
      }

      if (filters.category !== 'all') {
        const normalized = normalizeCategory(row.event_category)
        if (normalized !== filters.category) return false
      }

      if (filters.approval !== 'all') {
        const status = row.approval_status || row.event_approval_status
        if (status !== filters.approval) return false
      }

      if (filters.projectOwner !== 'all') {
        const name = row.project_owner_name?.trim() || 'Not specified'
        if (name !== filters.projectOwner) return false
      }

      if (filters.location !== 'all') {
        const loc = (row.location || row.event_location)?.trim() || 'Not specified'
        if (loc !== filters.location) return false
      }

      if (filters.costCenter !== 'all') {
        const code = row.cost_center_code?.trim() || 'Not specified'
        if (code !== filters.costCenter) return false
      }

      return true
    })

    const map = new Map<string, MonthGroup>()
    for (const row of filteredRows) {
      const key = row.month_start ?? 'unknown'
      if (!map.has(key)) {
        map.set(key, {
          monthStart: row.month_start ?? '',
          monthLabel: row.month_label ?? 'Unknown',
          rows: [],
        })
      }
      map.get(key)!.rows.push(row)
    }

    const groups = Array.from(map.values())
    groups.sort((a, b) => {
      if (!a.monthStart) return 1
      if (!b.monthStart) return -1
      return a.monthStart.localeCompare(b.monthStart)
    })

    for (const group of groups) {
      group.rows.sort((a, b) => {
        const aSort = a.sort_date ?? a.start_date ?? ''
        const bSort = b.sort_date ?? b.start_date ?? ''
        if (aSort !== bSort) return aSort.localeCompare(bSort)
        const aEnd = a.end_date ?? ''
        const bEnd = b.end_date ?? ''
        if (aEnd !== bEnd) return aEnd.localeCompare(bEnd)
        const aName = a.event_name ?? a.activity_name ?? ''
        const bName = b.event_name ?? b.activity_name ?? ''
        return aName.localeCompare(bName)
      })
    }

    return groups
  }, [allRows, filters])

  const totalFilteredEvents = useMemo(() => {
    return filteredGroups.reduce((sum, g) => sum + g.rows.length, 0)
  }, [filteredGroups])

  const hasActiveFilters = useMemo(() => {
    return (
      filters.month !== 'all' ||
      filters.category !== 'all' ||
      filters.approval !== 'all' ||
      filters.projectOwner !== 'all' ||
      filters.location !== 'all' ||
      filters.costCenter !== 'all'
    )
  }, [filters])

  const summaryText = useMemo(() => {
    if (filters.year) {
      return `Showing ${totalFilteredEvents} event${totalFilteredEvents !== 1 ? 's' : ''} for ${filters.year}`
    }
    return `Showing ${totalFilteredEvents} event${totalFilteredEvents !== 1 ? 's' : ''}`
  }, [totalFilteredEvents, filters.year])

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">KAICIID Events Calendar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Chronological monthly overview of organization events and activities.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/">Back to Dashboard</Link>
        </Button>
      </div>

      {!loading && !error && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FilterX className="h-4 w-4" />
                <span>Filters</span>
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RotateCcw className="mr-1 h-3.5 w-3.5" />
                  Reset Filters
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Year</label>
                <Select value={filters.year} onValueChange={(v) => handleFilterChange('year', v)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Month</label>
                <Select value={filters.month} onValueChange={(v) => handleFilterChange('month', v)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All months</SelectItem>
                    {MONTH_NAMES.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <Select
                  value={filters.category}
                  onValueChange={(v) => handleFilterChange('category', v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categoryOptions.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Approval</label>
                <Select
                  value={filters.approval}
                  onValueChange={(v) => handleFilterChange('approval', v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All approval statuses</SelectItem>
                    {approvalOptions.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Project Owner</label>
                <Select
                  value={filters.projectOwner}
                  onValueChange={(v) => handleFilterChange('projectOwner', v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All owners</SelectItem>
                    {projectOwnerOptions.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                    <SelectItem value="Not specified">Not specified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Location</label>
                <Select
                  value={filters.location}
                  onValueChange={(v) => handleFilterChange('location', v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All locations</SelectItem>
                    {locationOptions.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                    <SelectItem value="Not specified">Not specified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Cost Centre</label>
                <Select
                  value={filters.costCenter}
                  onValueChange={(v) => handleFilterChange('costCenter', v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select cost centre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All cost centres</SelectItem>
                    {costCenterOptions.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                    <SelectItem value="Not specified">Not specified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">{summaryText}</div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Skeleton className="h-4 w-4 rounded-full" />
            <span className="text-sm">Loading KAICIID Events Calendar...</span>
          </div>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="h-12 w-full rounded-none" />
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && !loading && (
        <Card className="border-destructive/50">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && filteredGroups.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 pt-12 pb-12">
            <CalendarDays className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No calendar activities found for the selected filters.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && filteredGroups.length > 0 && (
        <div>
          {filteredGroups.map((group) => (
            <MonthSection key={group.monthStart || group.monthLabel} group={group} />
          ))}
        </div>
      )}
    </div>
  )
}
