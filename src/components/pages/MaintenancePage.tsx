import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { MaintenanceTask } from '../../types';
import { Wrench, Plus, CheckCircle2, AlertTriangle, Calendar, DollarSign, Activity } from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const {
    maintenanceTasks,
    filteredMaintenanceTasks,
    addMaintenanceTask,
    updateMaintenanceTask,
    deleteMaintenanceTask,
    factories,
    machines,
    kpis,
    t,
    isRtl
  } = useERP();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const defaultFormData = {
    taskCode: `PM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    machineId: machines[0]?.id || '',
    factoryId: factories[0]?.id || '',
    type: 'Preventive (PM)' as any,
    titleEn: 'Monthly Lubrication & Bearing Temperature Inspection',
    titleAr: 'التشحيم الشهري وفحص درجة حرارة رولمان البلي',
    scheduledDate: new Date().toISOString().slice(0, 10),
    technician: 'Eng. Hazem Shawky',
    status: 'Scheduled' as any,
    durationHours: 2.5,
    sparePartsCost: 150,
    laborCost: 100,
    priority: 'Medium' as any
  };

  const [formData, setFormData] = useState(defaultFormData);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setIsModalOpen(true);
  };

  const handleEdit = (task: MaintenanceTask) => {
    setEditingId(task.id);
    setFormData({
      taskCode: task.taskCode,
      machineId: task.machineId,
      factoryId: task.factoryId,
      type: task.type,
      titleEn: task.titleEn,
      titleAr: task.titleAr,
      scheduledDate: task.scheduledDate,
      completedDate: task.completedDate,
      technician: task.technician,
      status: task.status,
      durationHours: task.durationHours,
      sparePartsCost: task.sparePartsCost,
      laborCost: task.laborCost,
      priority: task.priority
    } as any);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMaintenanceTask(editingId, formData);
    } else {
      addMaintenanceTask(formData);
    }
    setIsModalOpen(false);
  };

  const columns: ColumnDef<MaintenanceTask>[] = [
    {
      key: 'taskCode',
      header: 'Code',
      sortable: true,
      render: item => <span className="font-mono font-bold text-cyan-400">{item.taskCode}</span>
    },
    {
      key: 'titleEn',
      header: 'Task Title',
      render: item => (
        <div>
          <div className="font-medium text-slate-200">{isRtl ? item.titleAr : item.titleEn}</div>
          <div className="text-[10px] text-slate-400">{item.type}</div>
        </div>
      )
    },
    {
      key: 'machineId',
      header: 'Machine',
      render: item => {
        const m = machines.find(x => x.id === item.machineId);
        return <span className="font-mono text-slate-300">{m?.code || item.machineId}</span>;
      }
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: item => {
        const styles = {
          'Completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          'In Progress': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          'Scheduled': 'bg-slate-700/40 text-slate-300 border-slate-600',
          'Overdue': 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
        }[item.status];
        return (
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${styles}`}>
            {item.status}
          </span>
        );
      }
    },
    {
      key: 'priority',
      header: 'Priority',
      render: item => <span className="text-[11px] font-medium text-slate-300">{item.priority}</span>
    },
    {
      key: 'scheduledDate',
      header: 'Schedule',
      sortable: true,
      render: item => <span className="font-mono text-[11px] text-slate-300">{item.scheduledDate}</span>
    },
    {
      key: 'cost',
      header: 'Total Cost',
      align: 'right',
      render: item => (
        <span className="font-mono font-bold text-white">
          ${(item.sparePartsCost + item.laborCost).toLocaleString()}
        </span>
      )
    },
    {
      key: 'technician',
      header: 'Assigned Tech',
      render: item => <span className="text-[11px] text-slate-300">{item.technician}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            <span>{t('nav_maintenance')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Preventive Maintenance schedules, breakdown work orders, technician logs and spare parts costs.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Maintenance</span>
        </button>
      </div>

      {/* Top Reliability Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/90 rounded-xl border border-slate-800 p-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">MTBF</span>
          <div className="text-2xl font-black font-mono text-emerald-400">{kpis.maintenance.mtbfHours} hrs</div>
          <span className="text-[10px] text-slate-500">Mean time between failures</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">MTTR</span>
          <div className="text-2xl font-black font-mono text-amber-400">{kpis.maintenance.mttrHours} hrs</div>
          <span className="text-[10px] text-slate-500">Mean time to repair</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PM Compliance</span>
          <div className="text-2xl font-black font-mono text-cyan-400">{kpis.maintenance.pmCompliancePercent}%</div>
          <span className="text-[10px] text-slate-500">Preventive adherence</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Spent</span>
          <div className="text-2xl font-black font-mono text-white">${kpis.maintenance.totalMaintenanceCost.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">Spares + Labor cost</span>
        </div>
      </div>

      <DataTable
        title="Maintenance Work Orders & PM Schedules"
        subtitle="Manage routine servicing, lubrication, electrical diagnostics, and corrective overhauls"
        data={filteredMaintenanceTasks}
        columns={columns}
        keyExtractor={item => item.id}
        onAdd={handleOpenAdd}
        addLabel="New PM Task"
        onEdit={handleEdit}
        onDelete={item => deleteMaintenanceTask(item.id)}
        exportFilename="maintenance_tasks"
        defaultSortKey="scheduledDate"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Maintenance Task' : 'Schedule Maintenance Task'}
        subtitle="Enter machine, schedule, labor hours, and expected spare parts cost."
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Task Code</label>
              <input
                type="text"
                required
                value={formData.taskCode}
                onChange={e => setFormData({ ...formData, taskCode: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Maintenance Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="Preventive (PM)">Preventive (PM)</option>
                <option value="Corrective (Breakdown)">Corrective (Breakdown)</option>
                <option value="Predictive / CBM">Predictive / CBM</option>
                <option value="Calibration">Calibration</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Priority</label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <label className="text-[11px] font-semibold uppercase text-slate-400">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-slate-400">Task Title (English)</label>
            <input
              type="text"
              required
              value={formData.titleEn}
              onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-slate-400">Task Title (Arabic)</label>
            <input
              type="text"
              dir="rtl"
              value={formData.titleAr}
              onChange={e => setFormData({ ...formData, titleAr: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Scheduled Date</label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Hours</label>
              <input
                type="number"
                step="0.5"
                value={formData.durationHours}
                onChange={e => setFormData({ ...formData, durationHours: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Spares Cost ($)</label>
              <input
                type="number"
                value={formData.sparePartsCost}
                onChange={e => setFormData({ ...formData, sparePartsCost: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Labor Cost ($)</label>
              <input
                type="number"
                value={formData.laborCost}
                onChange={e => setFormData({ ...formData, laborCost: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-slate-400">Assigned Technician</label>
            <input
              type="text"
              value={formData.technician}
              onChange={e => setFormData({ ...formData, technician: e.target.value })}
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
