import React from 'react';
import { useERP } from '../../context/ERPContext';
import { MetricCard } from '../common/MetricCard';
import {
  OEEGauge,
  ProductionVsPlanChart,
  DowntimeParetoChart,
  MachineOEERankChart
} from '../common/Charts';
import {
  Factory,
  Boxes,
  ClockAlert,
  Wrench,
  FileCheck2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    t,
    isRtl,
    kpis,
    drillDown,
    filteredProductionEntries,
    filteredDowntimeRecords,
    machines,
    workOrders,
    products,
    factories
  } = useERP();

  // Prepare Prod vs Plan data
  const prodChartData = filteredProductionEntries.slice(0, 5).map(e => {
    const prod = products.find(p => p.id === e.productId);
    return {
      label: `${e.workOrderId} - ${isRtl ? prod?.nameAr || prod?.nameEn : prod?.nameEn || e.productId}`,
      planned: e.plannedQty,
      produced: e.producedQty,
      good: e.goodQty,
      scrap: e.scrapQty
    };
  });

  // Prepare Downtime Pareto categories
  const downtimeMap: Record<string, { minutes: number; count: number }> = {};
  filteredDowntimeRecords.forEach(d => {
    if (!downtimeMap[d.category]) {
      downtimeMap[d.category] = { minutes: 0, count: 0 };
    }
    downtimeMap[d.category].minutes += d.durationMinutes;
    downtimeMap[d.category].count += 1;
  });
  const downtimeCategories = Object.entries(downtimeMap).map(([category, val]) => ({
    category,
    minutes: val.minutes,
    count: val.count
  }));

  // Prepare Machine OEE list
  const machineOEEList = machines.map(m => {
    // calculate dummy or actual OEE based on machine
    const prodLogs = filteredProductionEntries.filter(e => e.machineId === m.id);
    const dts = filteredDowntimeRecords.filter(d => d.machineId === m.id);
    const dtMinutes = dts.reduce((acc, c) => acc + c.durationMinutes, 0);

    const baseOee = m.status === 'down' ? 52.4 : m.status === 'maintenance' ? 64.2 : 86.8;
    const computed = dtMinutes > 60 ? Math.max(48, baseOee - 15) : baseOee;

    return {
      id: m.id,
      code: m.code,
      name: isRtl ? m.nameAr : m.nameEn,
      oee: Number(computed.toFixed(1)),
      status: m.status
    };
  });

  return (
    <div className="space-y-6">
      {/* 1. SECTION: Production KPIs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Factory className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              {t('kpi_production_title')}
            </h2>
          </div>
          <button
            onClick={() => drillDown('production')}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            <span>{t('viewDetails')}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard
            title={t('plannedQty')}
            value={kpis.production.plannedQty}
            unit={t('units')}
            subtitle="Scheduled Output"
            targetPage="planning"
          />
          <MetricCard
            title={t('producedQty')}
            value={kpis.production.producedQty}
            unit={t('units')}
            subtitle="Shift Cumulative"
            trend={kpis.production.producedQty >= kpis.production.plannedQty ? 'up' : 'down'}
            trendValue={`${kpis.production.achievementPercent}%`}
            status={kpis.production.achievementPercent >= 95 ? 'good' : kpis.production.achievementPercent >= 85 ? 'warning' : 'critical'}
            targetPage="production"
          />
          <MetricCard
            title={t('goodQty')}
            value={kpis.production.goodQty}
            unit={t('units')}
            subtitle="Conforming Pieces"
            status="good"
            targetPage="quality"
          />
          <MetricCard
            title={t('scrapQty')}
            value={kpis.production.scrapQty}
            unit={t('units')}
            subtitle={`Scrap: ${((kpis.production.scrapQty / (kpis.production.producedQty || 1)) * 100).toFixed(1)}%`}
            status={kpis.production.scrapQty > 50 ? 'warning' : 'good'}
            trend={kpis.production.scrapQty > 50 ? 'down' : 'up'}
            trendValue="QA Scrap Log"
            targetPage="quality"
          />
          <MetricCard
            title={t('achievementPercent')}
            value={`${kpis.production.achievementPercent}%`}
            subtitle="Plan Realization"
            status={kpis.production.achievementPercent >= 95 ? 'good' : 'warning'}
            targetPage="production"
          />
          <MetricCard
            title={t('productionEfficiency')}
            value={`${kpis.production.efficiencyPercent}%`}
            subtitle="Good / Planned"
            status={kpis.production.efficiencyPercent >= 90 ? 'good' : 'warning'}
            targetPage="production"
          />
        </div>
      </div>

      {/* 2. SECTION: OEE & Equipment Intelligence (Speedometer & Comparisons) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: OEE Gauge & Pillars */}
        <div className="lg:col-span-5 bg-slate-900/90 backdrop-blur rounded-xl border border-slate-800 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white tracking-tight">
              {t('kpi_oee_title')}
            </h3>
            <span
              onClick={() => drillDown('production')}
              className="text-xs text-cyan-400 hover:underline cursor-pointer"
            >
              Live Formula
            </span>
          </div>

          <OEEGauge
            score={kpis.oee.oeePercent}
            label="Plant OEE"
            availability={kpis.oee.availabilityPercent}
            performance={kpis.oee.performancePercent}
            quality={kpis.oee.qualityPercent}
          />

          <div className="mt-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/40 text-xs text-slate-300 flex items-center justify-between">
            <span>World Class Standard: &ge; 85%</span>
            <span className="font-mono font-bold text-emerald-400">
              {kpis.oee.oeePercent >= 85 ? 'World Class Target Met' : 'Opportunity to Optimize'}
            </span>
          </div>
        </div>

        {/* Center/Right: Production vs Plan Bars & Lowest OEE Machines */}
        <div className="lg:col-span-7 bg-slate-900/90 backdrop-blur rounded-xl border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Production Plan vs Actual Output
            </h3>
            <button
              onClick={() => drillDown('production')}
              className="text-xs text-cyan-400 hover:underline"
            >
              {t('enterNewLog')}
            </button>
          </div>

          <ProductionVsPlanChart data={prodChartData} />
        </div>
      </div>

      {/* 3. SECTION: Maintenance & Reliability KPIs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              {t('kpi_maintenance_title')}
            </h2>
          </div>
          <button
            onClick={() => drillDown('maintenance')}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
          >
            <span>{t('viewDetails')}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard
            title={t('totalDowntime')}
            value={kpis.maintenance.totalDowntimeHours}
            unit={t('hours')}
            subtitle="Cumulative Lost Time"
            status={kpis.maintenance.totalDowntimeHours > 5 ? 'critical' : 'warning'}
            targetPage="downtime"
          />
          <MetricCard
            title={t('breakdownCount')}
            value={kpis.maintenance.breakdownCount}
            subtitle="Unscheduled Stops"
            status={kpis.maintenance.breakdownCount > 3 ? 'critical' : 'good'}
            targetPage="downtime"
          />
          <MetricCard
            title={t('mtbf')}
            value={kpis.maintenance.mtbfHours}
            unit={t('hours')}
            subtitle="Between Incidents"
            status={kpis.maintenance.mtbfHours >= 30 ? 'good' : 'warning'}
            targetPage="maintenance"
          />
          <MetricCard
            title={t('mttr')}
            value={kpis.maintenance.mttrHours}
            unit={t('hours')}
            subtitle="Mean Repair Time"
            status={kpis.maintenance.mttrHours <= 1.5 ? 'good' : 'warning'}
            targetPage="maintenance"
          />
          <MetricCard
            title={t('pmCompliance')}
            value={`${kpis.maintenance.pmCompliancePercent}%`}
            subtitle="Preventive Adherence"
            status={kpis.maintenance.pmCompliancePercent >= 90 ? 'good' : 'warning'}
            targetPage="maintenance"
          />
          <MetricCard
            title={t('maintenanceCost')}
            value={`$${kpis.maintenance.totalMaintenanceCost.toLocaleString()}`}
            subtitle="Spares + Labor"
            targetPage="maintenance"
          />
        </div>
      </div>

      {/* Downtime Pareto & Machine Rankings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Downtime Pareto */}
        <div className="bg-slate-900/90 backdrop-blur rounded-xl border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <ClockAlert className="w-4 h-4 text-amber-400" />
              <span>Downtime Root Cause Pareto Analysis</span>
            </h3>
            <button
              onClick={() => drillDown('downtime')}
              className="text-xs text-amber-400 hover:underline"
            >
              Record Stop
            </button>
          </div>
          <DowntimeParetoChart categories={downtimeCategories} />
        </div>

        {/* Machine OEE Ranking */}
        <div className="bg-slate-900/90 backdrop-blur rounded-xl border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Factory className="w-4 h-4 text-cyan-400" />
              <span>Machine OEE Performance Ranking</span>
            </h3>
            <button
              onClick={() => drillDown('masterData')}
              className="text-xs text-cyan-400 hover:underline"
            >
              All Assets
            </button>
          </div>
          <MachineOEERankChart machines={machineOEEList} />
        </div>
      </div>

      {/* 4. SECTION: Work Order KPIs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              {t('kpi_workOrder_title')}
            </h2>
          </div>
          <button
            onClick={() => drillDown('workOrders')}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            <span>{t('viewDetails')}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <MetricCard
            title={t('totalWorkOrders')}
            value={kpis.workOrders.total}
            subtitle="Active Scope"
            targetPage="workOrders"
          />
          <MetricCard
            title={t('openWorkOrders')}
            value={kpis.workOrders.open}
            subtitle="Not Closed"
            targetPage="workOrders"
          />
          <MetricCard
            title={t('inProduction')}
            value={kpis.workOrders.inProduction}
            subtitle="Active on Line"
            status="good"
            targetPage="workOrders"
          />
          <MetricCard
            title={t('completedWorkOrders')}
            value={kpis.workOrders.completed}
            subtitle="Passed to FG"
            status="good"
            targetPage="workOrders"
          />
          <MetricCard
            title={t('lateWorkOrders')}
            value={kpis.workOrders.late}
            subtitle="Behind Schedule"
            status={kpis.workOrders.late > 0 ? 'warning' : 'good'}
            targetPage="workOrders"
          />
          <MetricCard
            title={t('criticalLateOrders')}
            value={kpis.workOrders.criticalLate}
            subtitle="Severe Delays"
            status={kpis.workOrders.criticalLate > 0 ? 'critical' : 'good'}
            targetPage="workOrders"
          />
          <MetricCard
            title={t('avgDelayDays')}
            value={kpis.workOrders.avgDelayDays}
            unit={t('days')}
            subtitle="Mean Variance"
            status={kpis.workOrders.avgDelayDays > 1 ? 'warning' : 'good'}
            targetPage="workOrders"
          />
        </div>
      </div>

      {/* 5. SECTION: Inventory & Materials Health KPIs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              {t('kpi_inventory_title')}
            </h2>
          </div>
          <button
            onClick={() => drillDown('inventory')}
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
          >
            <span>{t('viewDetails')}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <MetricCard
            title={t('totalStockValue')}
            value={`$${kpis.inventory.totalValue.toLocaleString()}`}
            subtitle="Total Valuation"
            status="good"
            targetPage="inventory"
          />
          <MetricCard
            title={t('rawMaterialStock')}
            value={`$${kpis.inventory.rawMaterialValue.toLocaleString()}`}
            subtitle="Feedstocks"
            targetPage="rawMaterials"
          />
          <MetricCard
            title={t('mroStock')}
            value={`$${kpis.inventory.mroValue.toLocaleString()}`}
            subtitle="Spares & Maintenance"
            targetPage="spareParts"
          />
          <MetricCard
            title={t('finishedGoodsStock')}
            value={`$${kpis.inventory.finishedGoodsValue.toLocaleString()}`}
            subtitle="Ready to Dispatch"
            status="good"
            targetPage="finishedGoods"
          />
          <MetricCard
            title={t('stockoutItems')}
            value={kpis.inventory.stockoutCount}
            subtitle="Zero Stock Alerts"
            status={kpis.inventory.stockoutCount > 0 ? 'critical' : 'good'}
            targetPage="rawMaterials"
          />
          <MetricCard
            title={t('belowMinItems')}
            value={kpis.inventory.belowMinCount}
            subtitle="Below Safety Level"
            status={kpis.inventory.belowMinCount > 0 ? 'warning' : 'good'}
            targetPage="inventory"
          />
          <MetricCard
            title={t('excessStock')}
            value={kpis.inventory.excessCount}
            subtitle="Over Maximum Limit"
            targetPage="inventory"
          />
        </div>
      </div>
    </div>
  );
};
