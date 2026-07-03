import { useState, useEffect, useMemo } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import {
  fetchMonitoringData,
  applyFilters,
  DEFAULT_FILTERS,
  getAgingMetricLabel,
  type MonitoringActivity,
  type MonitoringFilterState,
} from '@/services/monitoring'
import { KpiCards } from '@/pages/monitoring/components/kpi-cards'
import { FilterBar } from '@/pages/monitoring/components/filter-bar'
import { StatusDistributionChart } from '@/pages/monitoring/components/status-chart'
import { AssigneeWorkloadChart } from '@/pages/monitoring/components/assignee-chart'
import { StageBottleneckChart, PipelineFunnel } from '@/pages/monitoring/components/stage-sections'
import { AgingBuckets, DueDateRiskCard } from '@/pages/monitoring/components/aging-due-date'
import { DelayAlerts } from '@/pages/monitoring/components/delay-alerts'
import { ActiveAgingTable } from '@/pages/monitoring/components/active-aging-table'
import { FilteredActivitiesTable } from '@/pages/monitoring/components/filtered-activities-table'
import { UnassignedAlert } from '@/pages/monitoring/components/unassigned-alert'

type FilterUpdater = (prev: MonitoringFilterState) => MonitoringFilterState

export default function MonitoringPage() {
  const [activities, setActivities] = useState<MonitoringActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<MonitoringFilterState>(DEFAULT_FILTERS)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await fetchMonitoringData()
      setActivities(data)
      setLastUpdated(new Date())
    } catch (e) {
      console.error('Failed to fetch monitoring data:', e)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filtered = useMemo(() => applyFilters(activities, filters), [activities, filters])
  const unassignedCount = useMemo(
    () => activities.filter((a) => !a.assignee_id).length,
    [activities],
  )
  const agingMetricLabel = useMemo(() => getAgingMetricLabel(activities), [activities])

  const handleFilterChange = (updater: FilterUpdater) => setFilters(updater)

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Monitoring Dashboard</h1>
        <p className="text-muted-foreground animate-pulse">Loading monitoring data...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monitoring Dashboard</h1>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {formatDate(lastUpdated.toISOString(), 'MMM d, yyyy HH:mm')} · Aging
              metric: {agingMetricLabel}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </Button>
      </div>

      <FilterBar
        activities={activities}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      <KpiCards activities={activities} filters={filters} onFilterChange={handleFilterChange} />

      <UnassignedAlert
        count={unassignedCount}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground border rounded-lg bg-muted/20">
          No activities found for the selected filters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatusDistributionChart
              activities={filtered}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
            <StageBottleneckChart
              activities={filtered}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AssigneeWorkloadChart
              activities={filtered}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
            <PipelineFunnel activities={filtered} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AgingBuckets activities={filtered} />
            <DueDateRiskCard
              activities={filtered}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          <DelayAlerts activities={filtered} />
          <ActiveAgingTable activities={filtered} />
          <FilteredActivitiesTable activities={filtered} />
        </>
      )}
    </div>
  )
}
