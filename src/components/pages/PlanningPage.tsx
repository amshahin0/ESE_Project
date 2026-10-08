import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { CalendarDays, Clock, TrendingUp, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

export const PlanningPage: React.FC = () => {
  const {
    lines,
    workOrders,
    products,
    factories,
    t,
    isRtl,
    drillDown
  } = useERP();

  const [selectedHorizon, setSelectedHorizon] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Days of current planning horizon
  const days = [
    { date: '2026-10-07', label: 'Wed 07' },
    { date: '2026-10-08', label: 'Thu 08' },
    { date: '2026-10-09', label: 'Fri 09' },
    { date: '2026-10-10', label: 'Sat 10' },
    { date: '2026-10-11', label: 'Sun 11' },
    { date: '2026-10-12', label: 'Mon 12' },
    { date: '2026-10-13', label: 'Tue 13' }
  ];

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-cyan-400" />
            <span>{t('nav_planning')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Master Production Schedule (MPS), capacity bottlenecks, and line loading Gantt timeline.
          </p>
        </div>

        {/* Time horizon pill switch */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          {(['daily', 'weekly', 'monthly'] as const).map(horizon => (
            <button
              key={horizon}
              onClick={() => setSelectedHorizon(horizon)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                selectedHorizon === horizon
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {horizon}
            </button>
          ))}
        </div>
      </div>

      {/* Capacity Utilization Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Overall Plant Line Load</span>
            <span className="font-mono text-emerald-400 font-bold">87.4% Cap.</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '87.4%' }} />
          </div>
          <p className="text-[11px] text-slate-400">Within optimal 85-90% buffer threshold</p>
        </div>

        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Critical Line Bottleneck</span>
            <span className="font-mono text-rose-400 font-bold">96.8% Load</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: '96.8%' }} />
          </div>
          <p className="text-[11px] text-slate-400">Line 4 (Heavy Welding) operating near max capacity</p>
        </div>

        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Available Flex Capacity</span>
            <span className="font-mono text-cyan-400 font-bold">380 hrs/wk</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: '35%' }} />
          </div>
          <p className="text-[11px] text-slate-400">Unallocated shifts on Stamping and Molding Lines</p>
        </div>
      </div>

      {/* Production Line Schedule Gantt Matrix */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 overflow-hidden">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
          <span>Weekly Line Allocation & Work Order Dispatch</span>
          <span className="text-xs text-slate-400 font-normal">October 2026 Schedule</span>
        </h3>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Calendar Header Row */}
            <div className="grid grid-cols-12 gap-2 pb-3 border-b border-slate-800 text-xs font-semibold text-slate-400">
              <div className="col-span-3">Production Line / Work Center</div>
              <div className="col-span-9 grid grid-cols-7 gap-2 text-center">
                {days.map(d => (
                  <div key={d.date} className="p-1 rounded bg-slate-800/40">
                    <div className="text-[11px] text-slate-300 font-medium">{d.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lines rows */}
            <div className="divide-y divide-slate-800/50">
              {lines.map(line => {
                const assignedWOs = workOrders.filter(w => w.lineId === line.id);
                const fac = factories.find(f => f.id === line.factoryId);

                return (
                  <div key={line.id} className="grid grid-cols-12 gap-2 py-3 items-center text-xs">
                    <div className="col-span-3">
                      <div className="font-bold text-slate-200">{line.code}</div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {isRtl ? line.nameAr : line.nameEn}
                      </div>
                      <div className="text-[10px] text-cyan-400 font-mono">
                        Cap: {line.capacityPerHour} pcs/h
                      </div>
                    </div>

                    <div className="col-span-9 grid grid-cols-7 gap-2">
                      {days.map((day, idx) => {
                        const wo = assignedWOs[idx % (assignedWOs.length || 1)];

                        if (!wo) {
                          return (
                            <div
                              key={day.date}
                              className="h-14 rounded-lg border border-dashed border-slate-800 bg-slate-900/40 flex items-center justify-center text-[10px] text-slate-600 font-medium"
                            >
                              Idle / Clean
                            </div>
                          );
                        }

                        const prod = products.find(p => p.id === wo.productId);
                        const isLate = wo.status === 'Late' || wo.status === 'Critical Late';

                        return (
                          <div
                            key={day.date}
                            onClick={() => drillDown('workOrders')}
                            className={`h-14 p-1.5 rounded-lg border flex flex-col justify-between cursor-pointer transition-transform hover:scale-[1.02] ${
                              isLate
                                ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                                : wo.status === 'Completed'
                                ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                                : 'bg-cyan-950/40 border-cyan-800/80 text-cyan-200'
                            }`}
                            title={`${wo.orderNumber} - ${wo.status}`}
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                              <span>{wo.orderNumber}</span>
                              <span>{Math.round((wo.completedQty / (wo.plannedQty || 1)) * 100)}%</span>
                            </div>
                            <div className="text-[10px] truncate opacity-90">
                              {isRtl ? prod?.nameAr : prod?.nameEn}
                            </div>
                            <div className="text-[9px] opacity-75">
                              {wo.plannedQty.toLocaleString()} pcs
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
