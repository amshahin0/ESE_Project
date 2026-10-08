import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { ProductionEntry } from '../../types';
import {
  ClipboardPenLine,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  PieChart
} from 'lucide-react';

export const ProductionPage: React.FC = () => {
  const {
    productionEntries,
    filteredProductionEntries,
    addProductionEntry,
    updateProductionEntry,
    deleteProductionEntry,
    factories,
    workshops,
    lines,
    machines,
    products,
    workOrders,
    t,
    isRtl
  } = useERP();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const defaultFormData = {
    date: new Date().toISOString().slice(0, 10),
    factoryId: factories[0]?.id || '',
    workshopId: workshops[0]?.id || '',
    lineId: lines[0]?.id || '',
    machineId: machines[0]?.id || '',
    productId: products[0]?.id || '',
    workOrderId: workOrders[0]?.orderNumber || 'WO-2026-1049',
    shift: 'Shift 1 (Morning)' as any,
    operator: '',
    plannedQty: 1000,
    producedQty: 950,
    goodQty: 935,
    scrapQty: 15,
    plannedHours: 8,
    actualHours: 7.6,
    downtimeHours: 0.4,
    remarks: ''
  };

  const [formData, setFormData] = useState(defaultFormData);

  // Live Auto-Calculations
  const calcAchievement =
    formData.plannedQty > 0
      ? ((formData.producedQty / formData.plannedQty) * 100).toFixed(1)
      : '0.0';
  const calcQuality =
    formData.producedQty > 0
      ? ((formData.goodQty / formData.producedQty) * 100).toFixed(1)
      : '0.0';
  const calcScrap =
    formData.producedQty > 0
      ? ((formData.scrapQty / formData.producedQty) * 100).toFixed(1)
      : '0.0';
  const calcEfficiency =
    formData.plannedQty > 0
      ? ((formData.goodQty / formData.plannedQty) * 100).toFixed(1)
      : '0.0';

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setIsModalOpen(true);
  };

  const handleEdit = (entry: ProductionEntry) => {
    setEditingId(entry.id);
    setFormData({
      date: entry.date,
      factoryId: entry.factoryId,
      workshopId: entry.workshopId,
      lineId: entry.lineId,
      machineId: entry.machineId,
      productId: entry.productId,
      workOrderId: entry.workOrderId,
      shift: entry.shift,
      operator: entry.operator,
      plannedQty: entry.plannedQty,
      producedQty: entry.producedQty,
      goodQty: entry.goodQty,
      scrapQty: entry.scrapQty,
      plannedHours: entry.plannedHours,
      actualHours: entry.actualHours,
      downtimeHours: entry.downtimeHours,
      remarks: entry.remarks
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProductionEntry(editingId, formData);
    } else {
      addProductionEntry(formData);
    }
    setIsModalOpen(false);
  };

  // Aggregated Chart Metrics
  const byFactory = factories.map(f => {
    const records = filteredProductionEntries.filter(e => e.factoryId === f.id);
    const produced = records.reduce((acc, c) => acc + c.producedQty, 0);
    const planned = records.reduce((acc, c) => acc + c.plannedQty, 0);
    return {
      name: isRtl ? f.nameAr : f.nameEn,
      produced,
      planned,
      rate: planned > 0 ? (produced / planned) * 100 : 0
    };
  });

  const byLine = lines.map(l => {
    const records = filteredProductionEntries.filter(e => e.lineId === l.id);
    const produced = records.reduce((acc, c) => acc + c.producedQty, 0);
    return {
      code: l.code,
      name: isRtl ? l.nameAr : l.nameEn,
      produced
    };
  }).filter(l => l.produced > 0);

  const byProduct = products.map(p => {
    const records = filteredProductionEntries.filter(e => e.productId === p.id);
    const produced = records.reduce((acc, c) => acc + c.producedQty, 0);
    const scrap = records.reduce((acc, c) => acc + c.scrapQty, 0);
    return {
      name: isRtl ? p.nameAr : p.nameEn,
      produced,
      scrap
    };
  }).filter(p => p.produced > 0);

  // Table Columns
  const columns: ColumnDef<ProductionEntry>[] = [
    {
      key: 'date',
      header: 'Date',
      sortable: true
    },
    {
      key: 'workOrderId',
      header: 'Work Order',
      sortable: true,
      render: item => <span className="font-mono text-cyan-400 font-bold">{item.workOrderId}</span>
    },
    {
      key: 'factoryId',
      header: 'Factory & Line',
      render: item => {
        const fac = factories.find(f => f.id === item.factoryId);
        const l = lines.find(x => x.id === item.lineId);
        return (
          <div>
            <div className="font-medium text-slate-200">{isRtl ? fac?.nameAr : fac?.nameEn}</div>
            <div className="text-[10px] text-slate-400">{l?.code} - {isRtl ? l?.nameAr : l?.nameEn}</div>
          </div>
        );
      }
    },
    {
      key: 'machineId',
      header: 'Machine',
      render: item => {
        const m = machines.find(x => x.id === item.machineId);
        return <span className="text-slate-300 font-mono text-[11px]">{m?.code || item.machineId}</span>;
      }
    },
    {
      key: 'productId',
      header: 'Product',
      render: item => {
        const p = products.find(x => x.id === item.productId);
        return <span className="font-medium text-slate-200">{isRtl ? p?.nameAr : p?.nameEn}</span>;
      }
    },
    {
      key: 'shift',
      header: 'Shift',
      render: item => <span className="text-[11px] text-slate-300">{item.shift}</span>
    },
    {
      key: 'plannedQty',
      header: 'Plan',
      align: 'right',
      sortable: true,
      render: item => item.plannedQty.toLocaleString()
    },
    {
      key: 'producedQty',
      header: 'Produced',
      align: 'right',
      sortable: true,
      render: item => <span className="font-bold text-white">{item.producedQty.toLocaleString()}</span>
    },
    {
      key: 'goodQty',
      header: 'Good',
      align: 'right',
      sortable: true,
      render: item => <span className="text-emerald-400 font-medium">{item.goodQty.toLocaleString()}</span>
    },
    {
      key: 'scrapQty',
      header: 'Scrap',
      align: 'right',
      sortable: true,
      render: item => (
        <span className={item.scrapQty > 25 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
          {item.scrapQty.toLocaleString()} ({item.scrapPercent}%)
        </span>
      )
    },
    {
      key: 'achievementPercent',
      header: 'Achievement',
      align: 'right',
      sortable: true,
      render: item => {
        const val = item.achievementPercent || 0;
        const color = val >= 95 ? 'text-emerald-400' : val >= 85 ? 'text-amber-400' : 'text-rose-400';
        return <span className={`font-mono font-bold ${color}`}>{val}%</span>;
      }
    },
    {
      key: 'operator',
      header: 'Operator',
      render: item => <span className="text-slate-300 text-[11px]">{item.operator || '-'}</span>
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header bar with Action button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <ClipboardPenLine className="w-5 h-5 text-cyan-400" />
            <span>{t('productionEntryTitle')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time shift log entry with automatic Achievement, Scrap %, Quality, and Production Efficiency calculations.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all self-start sm:self-auto"
        >
          <ClipboardPenLine className="w-4 h-4" />
          <span>{t('enterNewLog')}</span>
        </button>
      </div>

      {/* Analytics & Charts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chart 1: Production by Factory */}
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Production by Factory</span>
          </h4>
          <div className="space-y-3">
            {byFactory.map((f, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 truncate">{f.name}</span>
                  <span className="font-mono text-cyan-400 font-bold">{f.produced.toLocaleString()} pcs</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, f.rate)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Output by Production Line */}
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span>Output by Production Line</span>
          </h4>
          <div className="space-y-3">
            {byLine.map((l, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{l.code}</span>
                  <span className="font-mono text-indigo-400 font-bold">{l.produced.toLocaleString()} pcs</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (l.produced / 3000) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Scrap Trend & Yield */}
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <PieChart className="w-3.5 h-3.5 text-rose-400" />
            <span>Product Scrap Analysis</span>
          </h4>
          <div className="space-y-3">
            {byProduct.map((p, i) => {
              const scrapPct = p.produced > 0 ? (p.scrap / p.produced) * 100 : 0;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 truncate">{p.name}</span>
                    <span className="font-mono text-rose-400 font-bold">{scrapPct.toFixed(2)}% Scrap</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, scrapPct * 15)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Production Entries DataTable */}
      <DataTable
        title="Shift Production Records & Quality Logs"
        subtitle="All recorded production runs with automated performance calculations"
        data={filteredProductionEntries}
        columns={columns}
        keyExtractor={item => item.id}
        onAdd={handleOpenAdd}
        addLabel={t('enterNewLog')}
        onEdit={handleEdit}
        onDelete={item => deleteProductionEntry(item.id)}
        exportFilename="production_shift_logs"
        defaultSortKey="date"
      />

      {/* Production Entry Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Production Log' : t('enterNewLog')}
        subtitle="Fill shop-floor parameters. Key efficiency KPIs are calculated automatically."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Shift</label>
              <select
                value={formData.shift}
                onChange={e => setFormData({ ...formData, shift: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="Shift 1 (Morning)">Shift 1 (Morning) / الوردية الأولى</option>
                <option value="Shift 2 (Evening)">Shift 2 (Evening) / الوردية الثانية</option>
                <option value="Shift 3 (Night)">Shift 3 (Night) / الوردية الثالثة</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Work Order</label>
              <input
                type="text"
                required
                value={formData.workOrderId}
                onChange={e => setFormData({ ...formData, workOrderId: e.target.value })}
                placeholder="e.g. WO-2026-1049"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Factory</label>
              <select
                value={formData.factoryId}
                onChange={e => setFormData({ ...formData, factoryId: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                {factories.map(f => (
                  <option key={f.id} value={f.id}>{isRtl ? f.nameAr : f.nameEn}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Production Line</label>
              <select
                value={formData.lineId}
                onChange={e => setFormData({ ...formData, lineId: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                {lines.map(l => (
                  <option key={l.id} value={l.id}>{l.code} - {isRtl ? l.nameAr : l.nameEn}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Machine</label>
              <select
                value={formData.machineId}
                onChange={e => setFormData({ ...formData, machineId: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                {machines.map(m => (
                  <option key={m.id} value={m.id}>{m.code} - {isRtl ? m.nameAr : m.nameEn}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Product</label>
              <select
                value={formData.productId}
                onChange={e => setFormData({ ...formData, productId: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{isRtl ? p.nameAr : p.nameEn}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantities */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">{t('plannedQty')}</label>
              <input
                type="number"
                min="1"
                required
                value={formData.plannedQty}
                onChange={e => setFormData({ ...formData, plannedQty: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">{t('producedQty')}</label>
              <input
                type="number"
                min="0"
                required
                value={formData.producedQty}
                onChange={e => {
                  const val = Number(e.target.value);
                  setFormData({
                    ...formData,
                    producedQty: val,
                    goodQty: Math.max(0, val - formData.scrapQty)
                  });
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">{t('goodQty')}</label>
              <input
                type="number"
                min="0"
                required
                value={formData.goodQty}
                onChange={e => {
                  const val = Number(e.target.value);
                  setFormData({
                    ...formData,
                    goodQty: val,
                    scrapQty: Math.max(0, formData.producedQty - val)
                  });
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-emerald-400 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">{t('scrapQty')}</label>
              <input
                type="number"
                min="0"
                required
                value={formData.scrapQty}
                onChange={e => {
                  const val = Number(e.target.value);
                  setFormData({
                    ...formData,
                    scrapQty: val,
                    goodQty: Math.max(0, formData.producedQty - val)
                  });
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-rose-400 font-mono"
              />
            </div>
          </div>

          {/* Automatic Calculations Live Display */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40">
            <div>
              <span className="text-[10px] text-cyan-300 uppercase font-semibold">{t('calc_achievement')}</span>
              <div className="font-mono font-bold text-white text-sm">{calcAchievement}%</div>
            </div>
            <div>
              <span className="text-[10px] text-emerald-300 uppercase font-semibold">{t('calc_quality')}</span>
              <div className="font-mono font-bold text-white text-sm">{calcQuality}%</div>
            </div>
            <div>
              <span className="text-[10px] text-rose-300 uppercase font-semibold">{t('calc_scrap')}</span>
              <div className="font-mono font-bold text-white text-sm">{calcScrap}%</div>
            </div>
            <div>
              <span className="text-[10px] text-indigo-300 uppercase font-semibold">{t('calc_efficiency')}</span>
              <div className="font-mono font-bold text-white text-sm">{calcEfficiency}%</div>
            </div>
          </div>

          {/* Hours and Operator */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">{t('plannedHours')}</label>
              <input
                type="number"
                step="0.1"
                value={formData.plannedHours}
                onChange={e => setFormData({ ...formData, plannedHours: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">{t('actualHours')}</label>
              <input
                type="number"
                step="0.1"
                value={formData.actualHours}
                onChange={e => setFormData({ ...formData, actualHours: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">{t('downtimeHours')}</label>
              <input
                type="number"
                step="0.1"
                value={formData.downtimeHours}
                onChange={e => setFormData({ ...formData, downtimeHours: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-amber-400 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">{t('operator')}</label>
              <input
                type="text"
                value={formData.operator}
                onChange={e => setFormData({ ...formData, operator: e.target.value })}
                placeholder="Operator name"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-slate-400">{t('remarks')}</label>
            <textarea
              rows={2}
              value={formData.remarks}
              onChange={e => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Operational notes, machine parameter alerts..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-lg"
            >
              {t('save')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
