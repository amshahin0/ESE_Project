import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import { RoutingStep } from '../../types';
import { Route, Clock, Users, Cpu, ArrowRight } from 'lucide-react';

export const RoutingPage: React.FC = () => {
  const { routingSteps, products, workshops, t, isRtl } = useERP();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');

  const filteredSteps = routingSteps.filter(s => s.productId === selectedProductId);
  const totalCycleTimeSec = filteredSteps.reduce((acc, c) => acc + c.cycleTimeSec, 0);
  const totalSetupTimeMin = filteredSteps.reduce((acc, c) => acc + c.setupTimeMin, 0);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const columns: ColumnDef<RoutingStep>[] = [
    {
      key: 'stepNumber',
      header: 'Step #',
      align: 'center',
      sortable: true,
      render: item => (
        <span className="w-7 h-7 rounded-full bg-slate-800 text-cyan-400 font-mono font-bold text-xs inline-flex items-center justify-center border border-slate-700">
          {item.stepNumber}
        </span>
      )
    },
    {
      key: 'operationEn',
      header: 'Operation Name',
      render: item => (
        <div>
          <div className="font-semibold text-slate-200">{isRtl ? item.operationAr : item.operationEn}</div>
          <div className="text-[10px] text-slate-400 font-mono">Assigned Asset: {item.machineType}</div>
        </div>
      )
    },
    {
      key: 'setupTimeMin',
      header: 'Setup Time',
      align: 'right',
      render: item => <span className="font-mono text-slate-300">{item.setupTimeMin} mins</span>
    },
    {
      key: 'cycleTimeSec',
      header: 'Cycle Time',
      align: 'right',
      sortable: true,
      render: item => (
        <span className="font-mono font-bold text-cyan-400">
          {item.cycleTimeSec}s ({(item.cycleTimeSec / 60).toFixed(1)}m)
        </span>
      )
    },
    {
      key: 'laborWorkers',
      header: 'Labor Req.',
      align: 'center',
      render: item => <span className="font-mono text-slate-300">{item.laborWorkers} operator(s)</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Route className="w-5 h-5 text-indigo-400" />
            <span>{t('nav_routing')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manufacturing operation routes, standard takt times, setup durations, and station staffing.
          </p>
        </div>

        {/* Product selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase">Product:</span>
          <select
            value={selectedProductId}
            onChange={e => setSelectedProductId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.code} - {isRtl ? p.nameAr : p.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Routing summary banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/90 rounded-xl border border-slate-800 p-4">
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-bold">Total Routing Steps</div>
          <div className="text-2xl font-black font-mono text-white mt-0.5">
            {filteredSteps.length} Operations
          </div>
          <div className="text-xs text-slate-400">Sequential shop-floor flow</div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 uppercase font-bold">Total Unit Cycle Time</div>
          <div className="text-2xl font-black font-mono text-cyan-400 mt-0.5">
            {totalCycleTimeSec}s ({(totalCycleTimeSec / 60).toFixed(1)} mins)
          </div>
          <div className="text-xs text-slate-400">Sum of all work centers</div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 uppercase font-bold">Total Batch Setup</div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-0.5">
            {totalSetupTimeMin} mins
          </div>
          <div className="text-xs text-slate-400">Changeover & calibration</div>
        </div>
      </div>

      <DataTable
        title={`Operation Route Sequence: ${selectedProduct?.code}`}
        subtitle="Step-by-step manufacturing operations from raw feedstock to tested product"
        data={filteredSteps}
        columns={columns}
        keyExtractor={item => item.id}
        exportFilename={`routing_${selectedProduct?.code}`}
        defaultSortKey="stepNumber"
        defaultSortDir="asc"
      />
    </div>
  );
};
