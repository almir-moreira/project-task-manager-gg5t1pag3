import { useState, useEffect, useMemo } from 'react'
import {
  fetchMonitoringData,
  applyFilters,
  DEFAULT_FILTERS,
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

export default function MonitoringPage() {
  const [activities, setActivities] = useState<MonitoringActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<MonitoringFilterState>(DEFAULT_FILTERS)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await fetchMonitoringData()
      setActivities(data)
    } catch (e) {
      console.error('Failed to fetch monitoring data:', e)
    }
    setLoading(false)
  }

  const filtered = useMemo(() => applyFilters(activities, filters), [activities, filters])

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
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Monitoring Dashboard</h1>
      </div>

      <FilterBar
        activities={activities}
        filters={filters}
        onFilterChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      <KpiCards activities={filtered} />

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground border rounded-lg bg-muted/20">
          No activities found for the selected filters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatusDistributionChart activities={filtered} />
            <StageBottleneckChart activities={filtered} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AssigneeWorkloadChart activities={filtered} />
            <PipelineFunnel activities={filtered} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AgingBuckets activities={filtered} />
            <DueDateRiskCard activities={filtered} />
          </div>

          <DelayAlerts activities={filtered} />
          <ActiveAgingTable activities={filtered} />
        </>
      )}
    </div>
  )
}
