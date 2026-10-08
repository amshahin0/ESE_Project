import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { MaterialConsumption } from '../../types';
import { Layers3, Plus, TrendingDown, TrendingUp, AlertTriangle, Layers } from 'lucide-react';

export const MaterialConsumptionPage: React.FC = () => {
  const {
    materialConsumptions,
    factories,
    workOrders,
    inventoryItems,
    t,
    isRtl
  } = useERP();

  const [consumptions, setConsumptions] = useState<MaterialConsumption[]>(materialConsumptions);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    workOrderId: workOrders[0]?.orderNumber || 'WO-2026-1049',
    rawMaterialSku: 'RM-STEEL-4140',
    rawMaterialName: 'Alloy Steel Bar Stock AISI 4140',
    factoryId: factories[0]?.id || '',
    plannedConsumption: 3000,
    actualConsumption: 3080,
    unit: 'kg',
    scrapMaterialQty: 65
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const varianceQty = formData.actualConsumption - formData.plannedConsumption;
    const variancePercent = Number(((varianceQty / (formData.plannedConsumption || 1)) * 100).toFixed(2));

    const newRecord: MaterialConsumption = {
      id: `mc-${Date.now()}`,
      ...formData,
      varianceQty,
      variancePercent
    };
    setConsumptions([newRecord, ...consumptions]);
    setIsModalOpen(false);
  };

  const columns: ColumnDef<MaterialConsumption>[] = [
    {
      key: 'date',
      header: 'Date',
      sortable: true
    },
    {
      key: 'workOrderId',
      header: 'Work Order',
      sortable: true,
      render: item => <span className="font-mono font-bold text-cyan-400">{item.workOrderId}</span>
    },
    {
      key: 'rawMaterialSku',
      header: 'Material Sku & Name',
      render: item => (
        <div>
          <div className="font-bold text-slate-200">{item.rawMaterialName}</div>
          <div className="text-[10px] text-slate-400 font-mono">{item.rawMaterialSku}</div>
        </div>
      )
    },
    {
      key: 'plannedConsumption',
      header: 'Planned Cons.',
      align: 'right',
      sortable: true,
      render: item => `${item.plannedConsumption.toLocaleString()} ${item.unit}`
    },
    {
      key: 'actualConsumption',
      header: 'Actual Cons.',
      align: 'right',
      sortable: true,
      render: item => <span className="font-bold text-white">{item.actualConsumption.toLocaleString()} {item.unit}</span>
    },
    {
      key: 'variancePercent',
      header: 'Variance %',
      align: 'right',
      sortable: true,
      render: item => {
        const isOver = item.variancePercent > 0;
        return (
          <span className={`font-mono font-bold ${isOver ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isOver ? '+' : ''}{item.variancePercent}% ({item.varianceQty} {item.unit})
          </span>
        );
      }
    },
    {
      key: 'scrapMaterialQty',
      header: 'Scrap Raw Material',
      align: 'right',
      sortable: true,
      render: item => (
        <span className="text-amber-400 font-mono">
          {item.scrapMaterialQty.toLocaleString()} {item.unit}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Layers3 className="w-5 h-5 text-cyan-400" />
            <span>{t('nav_materialConsumption')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare actual bill-of-materials raw consumption against standard recipe tolerances and scrap offcuts.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Material Draw</span>
        </button>
      </div>

      <DataTable
        title="Work Order Consumption & Scrap Logs"
        subtitle="Detailed bill of material variances per production batch"
        data={consumptions}
        columns={columns}
        keyExtractor={item => item.id}
        onAdd={() => setIsModalOpen(true)}
        addLabel="Log Draw"
        onDelete={item => setConsumptions(consumptions.filter(c => c.id !== item.id))}
        exportFilename="material_consumption_log"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Material Consumption"
        subtitle="Enter work order consumption details and calculate scrap variances."
        maxWidth="lg"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
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
              <label className="text-[11px] font-semibold uppercase text-slate-400">Work Order Ref</label>
              <input
                type="text"
                required
                value={formData.workOrderId}
                onChange={e => setFormData({ ...formData, workOrderId: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-slate-400">Raw Material</label>
            <input
              type="text"
              required
              value={formData.rawMaterialName}
              onChange={e => setFormData({ ...formData, rawMaterialName: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Planned Cons.</label>
              <input
                type="number"
                required
                value={formData.plannedConsumption}
                onChange={e => setFormData({ ...formData, plannedConsumption: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Actual Cons.</label>
              <input
                type="number"
                required
                value={formData.actualConsumption}
                onChange={e => setFormData({ ...formData, actualConsumption: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Scrap Offcuts</label>
              <input
                type="number"
                value={formData.scrapMaterialQty}
                onChange={e => setFormData({ ...formData, scrapMaterialQty: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-amber-400 font-mono"
              />
            </div>
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
