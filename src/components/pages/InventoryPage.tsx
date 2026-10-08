import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { InventoryItem } from '../../types';
import { Boxes, Plus, AlertTriangle, CheckCircle, Package, ArrowDown, ArrowUp } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const {
    inventoryItems,
    filteredInventoryItems,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    factories,
    kpis,
    t,
    isRtl
  } = useERP();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const defaultFormData = {
    sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    nameEn: 'Precision Ground Pin (Dia 12mm x 80mm)',
    nameAr: 'مسمار دقيق مقسى قطر 12 مم وطول 80 مم',
    category: 'Raw Material' as any,
    factoryId: factories[0]?.id || '',
    warehouseBin: 'BAY-B-03-01',
    unit: 'pcs',
    currentStock: 1500,
    minStock: 500,
    maxStock: 5000,
    unitCost: 12.5,
    status: 'Normal' as any,
    lastRestocked: new Date().toISOString().slice(0, 10)
  };

  const [formData, setFormData] = useState(defaultFormData);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setIsModalOpen(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setFormData({
      sku: item.sku,
      nameEn: item.nameEn,
      nameAr: item.nameAr,
      category: item.category,
      factoryId: item.factoryId,
      warehouseBin: item.warehouseBin,
      unit: item.unit,
      currentStock: item.currentStock,
      minStock: item.minStock,
      maxStock: item.maxStock,
      unitCost: item.unitCost,
      status: item.status,
      lastRestocked: item.lastRestocked
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateInventoryItem(editingId, formData);
    } else {
      addInventoryItem(formData);
    }
    setIsModalOpen(false);
  };

  const columns: ColumnDef<InventoryItem>[] = [
    {
      key: 'sku',
      header: 'SKU / Code',
      sortable: true,
      render: item => <span className="font-mono font-bold text-cyan-400">{item.sku}</span>
    },
    {
      key: 'nameEn',
      header: 'Item Description',
      render: item => (
        <div>
          <div className="font-medium text-slate-200">{isRtl ? item.nameAr : item.nameEn}</div>
          <div className="text-[10px] text-slate-400 font-mono">Bin: {item.warehouseBin}</div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: item => <span className="text-slate-300 text-[11px] font-medium">{item.category}</span>
    },
    {
      key: 'currentStock',
      header: 'Stock Level',
      align: 'right',
      sortable: true,
      render: item => {
        const isLow = item.currentStock < item.minStock;
        return (
          <span className={`font-mono font-bold ${isLow ? 'text-rose-400' : 'text-white'}`}>
            {item.currentStock.toLocaleString()} {item.unit}
          </span>
        );
      }
    },
    {
      key: 'minStock',
      header: 'Min / Max',
      align: 'center',
      render: item => (
        <span className="font-mono text-[11px] text-slate-400">
          {item.minStock.toLocaleString()} / {item.maxStock.toLocaleString()}
        </span>
      )
    },
    {
      key: 'unitCost',
      header: 'Unit Cost',
      align: 'right',
      sortable: true,
      render: item => <span className="font-mono text-slate-300">${item.unitCost.toFixed(2)}</span>
    },
    {
      key: 'totalValue',
      header: 'Valuation',
      align: 'right',
      sortable: true,
      render: item => (
        <span className="font-mono font-bold text-emerald-400">
          ${(item.currentStock * item.unitCost).toLocaleString()}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Health',
      align: 'center',
      render: item => {
        const styles = {
          'Normal': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          'Below Min': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          'Stockout': 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse',
          'Excess': 'bg-purple-500/10 text-purple-400 border-purple-500/30'
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
            <Boxes className="w-5 h-5 text-emerald-400" />
            <span>{t('nav_inventory')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Enterprise stock control, valuation rollups, buffer safety thresholds and warehouse storage bins.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Stock Item</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/90 rounded-xl border border-slate-800 p-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('totalStockValue')}</span>
          <div className="text-2xl font-black font-mono text-emerald-400">${kpis.inventory.totalValue.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">{filteredInventoryItems.length} active SKUs</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('rawMaterialStock')}</span>
          <div className="text-2xl font-black font-mono text-cyan-400">${kpis.inventory.rawMaterialValue.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">Feedstock & billets</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('mroStock')}</span>
          <div className="text-2xl font-black font-mono text-amber-400">${kpis.inventory.mroValue.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500">MRO maintenance parts</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Critical Stockouts</span>
          <div className="text-2xl font-black font-mono text-rose-400">{kpis.inventory.stockoutCount} items</div>
          <span className="text-[10px] text-rose-400/80">Require immediate PO</span>
        </div>
      </div>

      <DataTable
        title="Comprehensive Inventory Master List"
        subtitle="Current warehouse stock, safety reorder limits, and unit valuation"
        data={filteredInventoryItems}
        columns={columns}
        keyExtractor={item => item.id}
        onAdd={handleOpenAdd}
        addLabel="Add SKU"
        onEdit={handleEdit}
        onDelete={item => deleteInventoryItem(item.id)}
        exportFilename="inventory_master_report"
        defaultSortKey="currentStock"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Inventory Item' : 'Add Inventory Item'}
        subtitle="Manage warehouse bin, safety thresholds, and valuation cost."
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">SKU Code</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="Raw Material">Raw Material</option>
                <option value="Finished Goods">Finished Goods</option>
                <option value="MRO / Spare Part">MRO / Spare Part</option>
                <option value="WIP">WIP</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Unit</label>
              <input
                type="text"
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                placeholder="pcs, kg, sets"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-slate-400">Description (English)</label>
            <input
              type="text"
              required
              value={formData.nameEn}
              onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-slate-400">Description (Arabic)</label>
            <input
              type="text"
              dir="rtl"
              value={formData.nameAr}
              onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-sans"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Current Qty</label>
              <input
                type="number"
                min="0"
                required
                value={formData.currentStock}
                onChange={e => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Min Safety</label>
              <input
                type="number"
                min="0"
                value={formData.minStock}
                onChange={e => setFormData({ ...formData, minStock: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Max Limit</label>
              <input
                type="number"
                min="0"
                value={formData.maxStock}
                onChange={e => setFormData({ ...formData, maxStock: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Unit Cost ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.unitCost}
                onChange={e => setFormData({ ...formData, unitCost: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-emerald-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Warehouse Bin</label>
              <input
                type="text"
                value={formData.warehouseBin}
                onChange={e => setFormData({ ...formData, warehouseBin: e.target.value })}
                placeholder="e.g. BAY-A-04-12"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="Normal">Normal</option>
                <option value="Below Min">Below Min</option>
                <option value="Stockout">Stockout</option>
                <option value="Excess">Excess</option>
              </select>
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
