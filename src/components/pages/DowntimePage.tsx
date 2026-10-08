import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { DowntimeParetoChart } from '../common/Charts';
import { DowntimeRecord } from '../../types';
import { ClockAlert, Plus, AlertTriangle, CheckCircle, Wrench, BarChart2 } from 'lucide-react';

export const DowntimePage: React.FC = () => {
  const {
    downtimeRecords,
    filteredDowntimeRecords,
    addDowntimeRecord,
    updateDowntimeRecord,
    deleteDowntimeRecord,
    factories,
    workshops,
    lines,
    machines,
    workOrders,
    t,
    isRtl
  } = useERP();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const defaultFormData = {
    date: new Date().toISOString().slice(0, 10),
    factoryId: factories[0]?.id || '',
    workshopId: workshops[0]?.id || '',
    lineId: lines[0]?.id || '',
    machineId: machines[0]?.id || '',
    workOrderId: workOrders[0]?.orderNumber || 'WO-2026-1049',
    category: 'Mechanical' as any,
    durationMinutes: 45,
    rootCause: '',
    actionTaken: '',
    technician: '',
    isResolved: true
  };

  const [formData, setFormData] = useState(defaultFormData);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setIsModalOpen(true);
  };

  const handleEdit = (rec: DowntimeRecord) => {
    setEditingId(rec.id);
    setFormData({
      date: rec.date,
      factoryId: rec.factoryId,
      workshopId: rec.workshopId,
      lineId: rec.lineId,
      machineId: rec.machineId,
      workOrderId: rec.workOrderId,
      category: rec.category,
      durationMinutes: rec.durationMinutes,
      rootCause: rec.rootCause,
      actionTaken: rec.actionTaken,
      technician: rec.technician,
      isResolved: rec.isResolved
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateDowntimeRecord(editingId, formData);
    } else {
      addDowntimeRecord(formData);
    }
    setIsModalOpen(false);
  };

  // Pareto chart calculation
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

  const totalLostMin = filteredDowntimeRecords.reduce((acc, c) => acc + c.durationMinutes, 0);

  const columns: ColumnDef<DowntimeRecord>[] = [
    {
      key: 'id',
      header: 'Stop ID',
      sortable: true,
      render: item => <span className="font-mono text-cyan-400 font-bold">{item.id}</span>
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true
    },
    {
      key: 'machineId',
      header: 'Machine',
      render: item => {
        const m = machines.find(x => x.id === item.machineId);
        return (
          <div>
            <div className="font-mono font-bold text-slate-200">{m?.code || item.machineId}</div>
            <div className="text-[10px] text-slate-400">{isRtl ? m?.nameAr : m?.nameEn}</div>
          </div>
        );
      }
    },
    {
      key: 'workOrderId',
      header: 'Work Order',
      render: item => <span className="font-mono text-slate-300">{item.workOrderId}</span>
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: item => {
        const colors = {
          'Mechanical': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          'Electrical': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          'Tooling': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
          'Operator / Setup': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          'No Material': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          'Quality Stop': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          'Planned PM': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        }[item.category] || 'bg-slate-700 text-slate-300 border-slate-600';

        return (
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${colors}`}>
            {item.category}
          </span>
        );
      }
    },
    {
      key: 'durationMinutes',
      header: 'Duration',
      align: 'right',
      sortable: true,
      render: item => (
        <span className="font-mono font-bold text-amber-400">
          {(item.durationMinutes / 60).toFixed(1)}h ({item.durationMinutes}m)
        </span>
      )
    },
    {
      key: 'rootCause',
      header: 'Root Cause & Action Taken',
      render: item => (
        <div className="max-w-xs">
          <p className="text-slate-200 font-medium truncate">{item.rootCause}</p>
          <p className="text-[10px] text-slate-400 truncate">{item.actionTaken}</p>
        </div>
      )
    },
    {
      key: 'technician',
      header: 'Technician',
      render: item => <span className="text-[11px] text-slate-300">{item.technician}</span>
    },
    {
      key: 'isResolved',
      header: 'Status',
      align: 'center',
      render: item => (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
            item.isResolved ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {item.isResolved ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          <span>{item.isResolved ? 'Resolved' : 'Active'}</span>
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <ClockAlert className="w-5 h-5 text-amber-400" />
            <span>{t('nav_downtime')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Log machine stoppages, root cause classifications, Pareto analysis, and technician resolution actions.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Machine Downtime</span>
        </button>
      </div>

      {/* Top Pareto & Summary split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-slate-900/90 rounded-xl border border-slate-800 p-4">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-amber-400" />
            <span>Downtime Pareto Chart (Causes by Total Hours)</span>
          </h3>
          <DowntimeParetoChart categories={downtimeCategories} />
        </div>

        <div className="lg:col-span-4 bg-slate-900/90 rounded-xl border border-slate-800 p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Downtime Impact Summary
            </h4>
            <div className="space-y-4">
              <div>
                <div className="text-[11px] text-slate-400">Total Lost Machine Hours</div>
                <div className="text-3xl font-black font-mono text-amber-400">
                  {(totalLostMin / 60).toFixed(1)} hrs
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{totalLostMin} minutes logged</div>
              </div>

              <div>
                <div className="text-[11px] text-slate-400">Total Breakdown Incidents</div>
                <div className="text-2xl font-black font-mono text-white">
                  {filteredDowntimeRecords.length} stops
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/40 text-xs text-amber-300">
                Top contributor: <span className="font-bold">{downtimeCategories[0]?.category || 'N/A'}</span> accounts for {downtimeCategories[0] ? ((downtimeCategories[0].minutes / (totalLostMin || 1)) * 100).toFixed(0) : 0}% of all plant stop hours.
              </div>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        title="Downtime Log Records"
        subtitle="Individual stoppage incidents, equipment IDs, and corrective actions"
        data={filteredDowntimeRecords}
        columns={columns}
        keyExtractor={item => item.id}
        onAdd={handleOpenAdd}
        addLabel="Record Stop"
        onEdit={handleEdit}
        onDelete={item => deleteDowntimeRecord(item.id)}
        exportFilename="downtime_incident_logs"
        defaultSortKey="date"
      />

      {/* Downtime Entry Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Downtime Log' : 'Record Machine Downtime'}
        subtitle="Input root cause, duration, and technician actions taken."
        maxWidth="xl"
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
              <label className="text-[11px] font-semibold uppercase text-slate-400">Duration (Minutes)</label>
              <input
                type="number"
                min="1"
                required
                value={formData.durationMinutes}
                onChange={e => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-amber-400 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
                <option value="Tooling">Tooling</option>
                <option value="Operator / Setup">Operator / Setup</option>
                <option value="No Material">No Material</option>
                <option value="Quality Stop">Quality Stop</option>
                <option value="Planned PM">Planned PM</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Work Order Ref</label>
              <input
                type="text"
                value={formData.workOrderId}
                onChange={e => setFormData({ ...formData, workOrderId: e.target.value })}
                placeholder="e.g. WO-2026-1038"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Technician</label>
              <input
                type="text"
                value={formData.technician}
                onChange={e => setFormData({ ...formData, technician: e.target.value })}
                placeholder="Technician name"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-slate-400">Root Cause Description</label>
            <textarea
              rows={2}
              required
              value={formData.rootCause}
              onChange={e => setFormData({ ...formData, rootCause: e.target.value })}
              placeholder="What triggered the stoppage? (e.g., servo motor thermal overload)"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-slate-400">Corrective Action Taken</label>
            <textarea
              rows={2}
              required
              value={formData.actionTaken}
              onChange={e => setFormData({ ...formData, actionTaken: e.target.value })}
              placeholder="What was fixed, replaced, or calibrated to resume production?"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isResolved"
              checked={formData.isResolved}
              onChange={e => setFormData({ ...formData, isResolved: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-cyan-600 focus:ring-0"
            />
            <label htmlFor="isResolved" className="text-xs text-slate-300">
              Stoppage is resolved and machine is handed back to production
            </label>
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
              className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white shadow-lg"
            >
              {t('save')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
