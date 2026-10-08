import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { BarChart3, Printer, Download, Calendar, FileText, CheckCircle2 } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const {
    t,
    isRtl,
    kpis,
    filteredProductionEntries,
    filteredWorkOrders,
    filteredDowntimeRecords,
    filteredMaintenanceTasks,
    exportToCsv,
    printCurrentView,
    factories,
    filters
  } = useERP();

  const [reportType, setReportType] = useState<'executive' | 'production' | 'oee_maintenance' | 'inventory'>('executive');

  const handleExportFull = () => {
    const headers = [
      'Report Type',
      'Date Range',
      'Planned Qty',
      'Produced Qty',
      'Scrap Qty',
      'OEE %',
      'Availability %',
      'Total Downtime (hrs)',
      'Total Stock Value ($)'
    ];
    const rows = [
      [
        reportType.toUpperCase(),
        `${filters.dateFrom} to ${filters.dateTo}`,
        kpis.production.plannedQty,
        kpis.production.producedQty,
        kpis.production.scrapQty,
        `${kpis.oee.oeePercent}%`,
        `${kpis.oee.availabilityPercent}%`,
        kpis.maintenance.totalDowntimeHours,
        `$${kpis.inventory.totalValue}`
      ]
    ];
    exportToCsv(`manufacturing_report_${reportType}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>{t('nav_reports')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational audits, shift summary sheets, and print-ready executive KPI briefings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={printCurrentView}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>{t('printReport')}</span>
          </button>
          <button
            onClick={handleExportFull}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{t('exportCsv')}</span>
          </button>
        </div>
      </div>

      {/* Report Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 w-fit no-print">
        <button
          onClick={() => setReportType('executive')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            reportType === 'executive' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Executive Summary
        </button>
        <button
          onClick={() => setReportType('production')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            reportType === 'production' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Daily Shift Production
        </button>
        <button
          onClick={() => setReportType('oee_maintenance')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            reportType === 'oee_maintenance' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          OEE & Downtime Breakdown
        </button>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl print-card">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-5">
          <div>
            <div className="text-xl font-black text-white tracking-tight">{t('brandName')}</div>
            <div className="text-xs text-slate-400 mt-1">
              {reportType === 'executive'
                ? 'EXECUTIVE OPERATIONS BRIEFING REPORT'
                : reportType === 'production'
                ? 'PLANT PRODUCTION & WORK ORDER FULFILLMENT'
                : 'EQUIPMENT OEE & RELIABILITY AUDIT'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Active Date Filter: {filters.dateFrom} &rarr; {filters.dateTo} | Generated: {new Date().toLocaleString()}
            </div>
          </div>

          <div className="text-right">
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
              OFFICIAL ERP AUDIT
            </span>
            <div className="text-xs font-mono text-slate-400 mt-2">
              Status: Operational
            </div>
          </div>
        </div>

        {/* Report Section 1: Top Line KPIs */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            1. Core Operational Metrics
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Production Achievement</div>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                {kpis.production.achievementPercent}%
              </div>
              <div className="text-[10px] text-slate-500">
                {kpis.production.producedQty.toLocaleString()} / {kpis.production.plannedQty.toLocaleString()} pcs
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Composite Plant OEE</div>
              <div className="text-2xl font-black font-mono text-cyan-400 mt-1">
                {kpis.oee.oeePercent}%
              </div>
              <div className="text-[10px] text-slate-500">
                Avail: {kpis.oee.availabilityPercent}% | Qual: {kpis.oee.qualityPercent}%
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Total Downtime</div>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                {kpis.maintenance.totalDowntimeHours} hrs
              </div>
              <div className="text-[10px] text-slate-500">
                MTBF: {kpis.maintenance.mtbfHours}h | MTTR: {kpis.maintenance.mttrHours}h
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Active Inventory Value</div>
              <div className="text-2xl font-black font-mono text-white mt-1">
                ${kpis.inventory.totalValue.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500">
                FG: ${kpis.inventory.finishedGoodsValue.toLocaleString()} | RM: ${kpis.inventory.rawMaterialValue.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Report Section 2: Shift Breakdown Table */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            2. Shift Production Records In Scope
          </h4>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/70 text-slate-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Order #</th>
                  <th className="p-2.5">Shift</th>
                  <th className="p-2.5 text-right">Plan</th>
                  <th className="p-2.5 text-right">Actual</th>
                  <th className="p-2.5 text-right">Good</th>
                  <th className="p-2.5 text-right">Scrap</th>
                  <th className="p-2.5 text-right">Achieve %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                {filteredProductionEntries.map(e => (
                  <tr key={e.id}>
                    <td className="p-2.5 text-slate-200">{e.date}</td>
                    <td className="p-2.5 text-cyan-400 font-bold">{e.workOrderId}</td>
                    <td className="p-2.5 text-slate-400 font-sans">{e.shift}</td>
                    <td className="p-2.5 text-right">{e.plannedQty.toLocaleString()}</td>
                    <td className="p-2.5 text-right font-bold text-white">{e.producedQty.toLocaleString()}</td>
                    <td className="p-2.5 text-right text-emerald-400">{e.goodQty.toLocaleString()}</td>
                    <td className="p-2.5 text-right text-rose-400">{e.scrapQty.toLocaleString()}</td>
                    <td className="p-2.5 text-right font-bold text-cyan-400">{e.achievementPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sign-off section */}
        <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-8 text-xs text-slate-400">
          <div>
            <div className="font-semibold text-slate-300">Plant Operations Director</div>
            <div className="mt-8 border-b border-slate-700 w-48" />
            <div className="mt-1 text-[11px]">Signature & Date</div>
          </div>
          <div>
            <div className="font-semibold text-slate-300">Quality Assurance Lead</div>
            <div className="mt-8 border-b border-slate-700 w-48" />
            <div className="mt-1 text-[11px]">Signature & Date</div>
          </div>
        </div>
      </div>
    </div>
  );
};
