import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { QualityInspection } from '../../types';
import { ShieldCheck, Plus, AlertTriangle, CheckCircle, PieChart, ShieldAlert } from 'lucide-react';

export const QualityPage: React.FC = () => {
  const { qualityInspections, workOrders, products, factories, t, isRtl } = useERP();

  const [inspections, setInspections] = useState<QualityInspection[]>(qualityInspections);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    inspectionNo: `QC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().slice(0, 10),
    workOrderId: workOrders[0]?.orderNumber || 'WO-2026-1049',
    productId: products[0]?.id || '',
    factoryId: factories[0]?.id || '',
    sampleSize: 100,
    defectsCount: 2,
    defectType: 'Dimensional' as any,
    status: 'Passed' as any,
    inspector: 'Eng. Mona Samir'
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const fpyPercent = Number((((formData.sampleSize - formData.defectsCount) / (formData.sampleSize || 1)) * 100).toFixed(2));
    const newRecord: QualityInspection = {
      id: `qi-${Date.now()}`,
      ...formData,
      fpyPercent
    };
    setInspections([newRecord, ...inspections]);
    setIsModalOpen(false);
  };

  // Average FPY
  const avgFPY = inspections.length > 0
    ? (inspections.reduce((acc, c) => acc + c.fpyPercent, 0) / inspections.length).toFixed(1)
    : '98.0';

  const quarantinedCount = inspections.filter(i => i.status === 'Quarantined').length;

  const columns: ColumnDef<QualityInspection>[] = [
    {
      key: 'inspectionNo',
      header: 'QC Batch #',
      sortable: true,
      render: item => <span className="font-mono font-bold text-cyan-400">{item.inspectionNo}</span>
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true
    },
    {
      key: 'workOrderId',
      header: 'Work Order',
      render: item => <span className="font-mono text-slate-300">{item.workOrderId}</span>
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
      key: 'sampleSize',
      header: 'Sample Size',
      align: 'right',
      render: item => `${item.sampleSize} pcs`
    },
    {
      key: 'defectsCount',
      header: 'Defects',
      align: 'right',
      render: item => (
        <span className={item.defectsCount > 5 ? 'text-rose-400 font-bold font-mono' : 'text-slate-300 font-mono'}>
          {item.defectsCount} pcs ({item.defectType})
        </span>
      )
    },
    {
      key: 'fpyPercent',
      header: 'First Pass Yield (FPY)',
      align: 'right',
      sortable: true,
      render: item => {
        const isGood = item.fpyPercent >= 95;
        return (
          <span className={`font-mono font-bold ${isGood ? 'text-emerald-400' : 'text-rose-400'}`}>
            {item.fpyPercent}%
          </span>
        );
      }
    },
    {
      key: 'status',
      header: 'QA Verdict',
      align: 'center',
      render: item => {
        const styles = {
          'Passed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          'Quarantined': 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse',
          'Reworked': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          'Rejected': 'bg-rose-900/40 text-rose-300 border-rose-800'
        }[item.status];

        return (
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${styles}`}>
            {item.status}
          </span>
        );
      }
    },
    {
      key: 'inspector',
      header: 'QA Inspector',
      render: item => <span className="text-[11px] text-slate-300">{item.inspector}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>{t('nav_quality')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical Quality Control (SQC), First Pass Yield (FPY), batch quarantine holding, and defect pareto tracking.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Inspection Log</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4">
          <div className="text-xs text-slate-400 font-bold uppercase">First Pass Yield (FPY)</div>
          <div className="text-3xl font-black font-mono text-emerald-400 mt-1">{avgFPY}%</div>
          <p className="text-[11px] text-slate-400 mt-1">Conforming output on first production run</p>
        </div>

        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4">
          <div className="text-xs text-slate-400 font-bold uppercase">Quarantine Batches</div>
          <div className="text-3xl font-black font-mono text-rose-400 mt-1">{quarantinedCount} lots</div>
          <p className="text-[11px] text-slate-400 mt-1">Held for MRB (Material Review Board)</p>
        </div>

        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4">
          <div className="text-xs text-slate-400 font-bold uppercase">Inspected Batches</div>
          <div className="text-3xl font-black font-mono text-white mt-1">{inspections.length} lots</div>
          <p className="text-[11px] text-slate-400 mt-1">100% compliant with ISO 9001 sampling plans</p>
        </div>
      </div>

      <DataTable
        title="Quality Control Inspection Logs"
        subtitle="Individual sample batches, defect categorization, and release authorization"
        data={inspections}
        columns={columns}
        keyExtractor={item => item.id}
        onAdd={() => setIsModalOpen(true)}
        addLabel="Log Inspection"
        onDelete={item => setInspections(inspections.filter(i => i.id !== item.id))}
        exportFilename="quality_inspections"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Quality Inspection"
        subtitle="Input inspection sample, defect count, and QA verdict."
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

          <div className="grid grid-cols-2 gap-3">
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
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Defect Type</label>
              <select
                value={formData.defectType}
                onChange={e => setFormData({ ...formData, defectType: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="Dimensional">Dimensional</option>
                <option value="Surface Scratch">Surface Scratch</option>
                <option value="Weld Porosity">Weld Porosity</option>
                <option value="Color Mismatch">Color Mismatch</option>
                <option value="Assembly Fit">Assembly Fit</option>
                <option value="Electrical Test">Electrical Test</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Sample Size</label>
              <input
                type="number"
                min="1"
                required
                value={formData.sampleSize}
                onChange={e => setFormData({ ...formData, sampleSize: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Defects Found</label>
              <input
                type="number"
                min="0"
                required
                value={formData.defectsCount}
                onChange={e => setFormData({ ...formData, defectsCount: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-rose-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">QA Verdict</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="Passed">Passed</option>
                <option value="Quarantined">Quarantined</option>
                <option value="Reworked">Reworked</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Inspector</label>
              <input
                type="text"
                value={formData.inspector}
                onChange={e => setFormData({ ...formData, inspector: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
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
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg"
            >
              {t('save')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
