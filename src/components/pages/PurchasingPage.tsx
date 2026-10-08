import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { PurchaseOrder } from '../../types';
import { ShoppingCart, Plus, CheckCircle, Clock, Truck, DollarSign } from 'lucide-react';

export const PurchasingPage: React.FC = () => {
  const { purchaseOrders, factories, t, isRtl } = useERP();

  const [orders, setOrders] = useState<PurchaseOrder[]>(purchaseOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    poNumber: `PO-${new Date().getFullYear()}-${Math.floor(800 + Math.random() * 200)}`,
    supplierName: 'Egyptian Industrial Gases & Chemicals Co.',
    factoryId: factories[0]?.id || '',
    orderDate: new Date().toISOString().slice(0, 10),
    expectedDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    totalAmount: 24500,
    currency: 'USD',
    status: 'Sent' as any,
    itemCount: 3
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: PurchaseOrder = {
      id: `po-${Date.now()}`,
      ...formData
    };
    setOrders([newRecord, ...orders]);
    setIsModalOpen(false);
  };

  const columns: ColumnDef<PurchaseOrder>[] = [
    {
      key: 'poNumber',
      header: 'PO Number',
      sortable: true,
      render: item => <span className="font-mono font-bold text-cyan-400">{item.poNumber}</span>
    },
    {
      key: 'supplierName',
      header: 'Vendor / Supplier',
      sortable: true,
      render: item => <span className="font-semibold text-slate-200">{item.supplierName}</span>
    },
    {
      key: 'factoryId',
      header: 'Receiving Plant',
      render: item => {
        const fac = factories.find(f => f.id === item.factoryId);
        return <span className="text-slate-300">{isRtl ? fac?.nameAr : fac?.nameEn}</span>;
      }
    },
    {
      key: 'itemCount',
      header: 'Lines',
      align: 'center',
      render: item => `${item.itemCount} items`
    },
    {
      key: 'totalAmount',
      header: 'Total Value',
      align: 'right',
      sortable: true,
      render: item => (
        <span className="font-mono font-bold text-emerald-400">
          ${item.totalAmount.toLocaleString()} {item.currency}
        </span>
      )
    },
    {
      key: 'expectedDate',
      header: 'ETA Date',
      sortable: true,
      render: item => <span className="font-mono text-slate-300">{item.expectedDate}</span>
    },
    {
      key: 'status',
      header: 'PO Status',
      align: 'center',
      sortable: true,
      render: item => {
        const styles = {
          'Received': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          'Partially Received': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          'Sent': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          'Draft': 'bg-slate-700/40 text-slate-300 border-slate-600',
          'Cancelled': 'bg-rose-500/10 text-rose-400 border-rose-500/30'
        }[item.status];

        return (
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${styles}`}>
            {item.status}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-cyan-400" />
            <span>{t('nav_purchasing')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Procurement management, raw material purchase orders, vendor delivery tracking and supplier logistics.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Purchase Order</span>
        </button>
      </div>

      <DataTable
        title="Purchase Orders Register"
        subtitle="Active orders placed for billets, tooling, spare components and chemical supplies"
        data={orders}
        columns={columns}
        keyExtractor={item => item.id}
        onAdd={() => setIsModalOpen(true)}
        addLabel="New PO"
        onDelete={item => setOrders(orders.filter(o => o.id !== item.id))}
        exportFilename="purchase_orders_register"
        defaultSortKey="orderDate"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Purchase Order"
        subtitle="Place raw material or spare part order with approved vendor."
        maxWidth="lg"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">PO Number</label>
              <input
                type="text"
                required
                value={formData.poNumber}
                onChange={e => setFormData({ ...formData, poNumber: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Supplier Name</label>
              <input
                type="text"
                required
                value={formData.supplierName}
                onChange={e => setFormData({ ...formData, supplierName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Receiving Plant</label>
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
              <label className="text-[11px] font-semibold uppercase text-slate-400">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Partially Received">Partially Received</option>
                <option value="Received">Received</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Total Value ($)</label>
              <input
                type="number"
                required
                value={formData.totalAmount}
                onChange={e => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-emerald-400 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Item Lines Count</label>
              <input
                type="number"
                min="1"
                required
                value={formData.itemCount}
                onChange={e => setFormData({ ...formData, itemCount: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Order Date</label>
              <input
                type="date"
                value={formData.orderDate}
                onChange={e => setFormData({ ...formData, orderDate: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Expected Delivery</label>
              <input
                type="date"
                value={formData.expectedDate}
                onChange={e => setFormData({ ...formData, expectedDate: e.target.value })}
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
