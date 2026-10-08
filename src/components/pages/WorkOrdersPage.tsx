import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { WorkOrder } from '../../types';
import { FileCheck2, Plus, AlertCircle, Clock, CheckCircle2, TrendingDown } from 'lucide-react';

export const WorkOrdersPage: React.FC = () => {
  const {
    workOrders,
    filteredWorkOrders,
    addWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    factories,
    lines,
    products,
    t,
    isRtl
  } = useERP();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const defaultFormData = {
    orderNumber: `WO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    factoryId: factories[0]?.id || '',
    lineId: lines[0]?.id || '',
    productId: products[0]?.id || '',
    plannedQty: 5000,
    completedQty: 0,
    scrapQty: 0,
    startDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    status: 'Planned' as any,
    priority: 'Medium' as any,
    delayDays: 0,
    assignedTeam: 'Assembly Operations Alpha'
  };

  const [formData, setFormData] = useState(defaultFormData);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setIsModalOpen(true);
  };

  const handleEdit = (wo: WorkOrder) => {
    setEditingId(wo.id);
    setFormData({
      orderNumber: wo.orderNumber,
      factoryId: wo.factoryId,
      lineId: wo.lineId,
      productId: wo.productId,
      plannedQty: wo.plannedQty,
      completedQty: wo.completedQty,
      scrapQty: wo.scrapQty,
      startDate: wo.startDate,
      dueDate: wo.dueDate,
      status: wo.status,
      priority: wo.priority,
      delayDays: wo.delayDays,
      assignedTeam: wo.assignedTeam
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateWorkOrder(editingId, formData);
    } else {
      addWorkOrder(formData);
    }
    setIsModalOpen(false);
  };

  const columns: ColumnDef<WorkOrder>[] = [
    {
      key: 'orderNumber',
      header: 'Order #',
      sortable: true,
      render: item => <span className="font-mono font-bold text-cyan-400">{item.orderNumber}</span>
    },
    {
      key: 'productId',
      header: 'Product',
      render: item => {
        const prod = products.find(p => p.id === item.productId);
        return (
          <div>
            <div className="font-medium text-slate-200">{isRtl ? prod?.nameAr : prod?.nameEn}</div>
            <div className="text-[10px] text-slate-400 font-mono">{prod?.code}</div>
          </div>
        );
      }
    },
    {
      key: 'lineId',
      header: 'Line & Factory',
      render: item => {
        const line = lines.find(l => l.id === item.lineId);
        const fac = factories.find(f => f.id === item.factoryId);
        return (
          <div>
            <div className="text-slate-200 font-medium">{line?.code}</div>
            <div className="text-[10px] text-slate-400">{isRtl ? fac?.nameAr : fac?.nameEn}</div>
          </div>
        );
      }
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: item => {
        const styles = {
          'Completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          'In Production': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          'Planned': 'bg-slate-700/40 text-slate-300 border-slate-600',
          'Late': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          'Critical Late': 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
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
      sortable: true,
      render: item => {
        const colors = {
          'Critical': 'text-rose-400 font-bold',
          'High': 'text-amber-400 font-semibold',
          'Medium': 'text-cyan-400',
          'Low': 'text-slate-400'
        }[item.priority];
        return <span className={`text-[11px] ${colors}`}>{item.priority}</span>;
      }
    },
    {
      key: 'progress',
      header: 'Progress',
      align: 'center',
      render: item => {
        const pct = item.plannedQty > 0 ? Math.min(100, (item.completedQty / item.plannedQty) * 100) : 0;
        return (
          <div className="w-32">
            <div className="flex items-center justify-between text-[10px] font-mono mb-1">
              <span>{item.completedQty.toLocaleString()} / {item.plannedQty.toLocaleString()}</span>
              <span className="font-bold text-white">{pct.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  pct >= 100 ? 'bg-emerald-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      render: item => (
        <div>
          <div className="font-mono text-slate-200">{item.dueDate}</div>
          {item.delayDays > 0 && (
            <span className="text-[10px] text-rose-400 font-bold flex items-center gap-0.5">
              +{item.delayDays} {t('days')} delay
            </span>
          )}
        </div>
      )
    },
    {
      key: 'assignedTeam',
      header: 'Assigned Crew',
      render: item => <span className="text-[11px] text-slate-300">{item.assignedTeam}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-cyan-400" />
            <span>{t('nav_workOrders')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Production work orders management, priority queue, completion progress and bottleneck delays.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Work Order</span>
        </button>
      </div>

      <DataTable
        title="Active Factory Work Orders"
        subtitle="Manage dispatching, real-time batch completion, and delay tracking"
        data={filteredWorkOrders}
        columns={columns}
        keyExtractor={item => item.id}
        onAdd={handleOpenAdd}
        addLabel="Create Work Order"
        onEdit={handleEdit}
        onDelete={item => deleteWorkOrder(item.id)}
        exportFilename="factory_work_orders"
        defaultSortKey="orderNumber"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Work Order' : 'Create Work Order'}
        subtitle="Define production quantity, priority level, due date and assigned production line."
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Order Number</label>
              <input
                type="text"
                required
                value={formData.orderNumber}
                onChange={e => setFormData({ ...formData, orderNumber: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
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

          <div className="grid grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Planned Qty</label>
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
              <label className="text-[11px] font-semibold uppercase text-slate-400">Completed Qty</label>
              <input
                type="number"
                min="0"
                value={formData.completedQty}
                onChange={e => setFormData({ ...formData, completedQty: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Scrap Qty</label>
              <input
                type="number"
                min="0"
                value={formData.scrapQty}
                onChange={e => setFormData({ ...formData, scrapQty: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-rose-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="Planned">Planned</option>
                <option value="In Production">In Production</option>
                <option value="Completed">Completed</option>
                <option value="Late">Late</option>
                <option value="Critical Late">Critical Late</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Delay Days</label>
              <input
                type="number"
                min="0"
                value={formData.delayDays}
                onChange={e => setFormData({ ...formData, delayDays: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-rose-400 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Assigned Team</label>
              <input
                type="text"
                value={formData.assignedTeam}
                onChange={e => setFormData({ ...formData, assignedTeam: e.target.value })}
                placeholder="Team or supervisor"
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
