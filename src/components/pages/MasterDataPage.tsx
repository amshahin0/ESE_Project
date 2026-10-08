import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { Factory, Machine, Product } from '../../types';
import { Database, Plus, Building2, Cpu, Package, CheckCircle2 } from 'lucide-react';

export const MasterDataPage: React.FC = () => {
  const {
    factories,
    workshops,
    lines,
    machines,
    products,
    addMasterFactory,
    addMasterMachine,
    addMasterProduct,
    t,
    isRtl
  } = useERP();

  const [activeTab, setActiveTab] = useState<'factories' | 'machines' | 'products'>('factories');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Forms state
  const [factoryForm, setFactoryForm] = useState({
    code: `FAC-${Math.floor(10 + Math.random() * 90)}`,
    nameEn: '',
    nameAr: '',
    location: '',
    manager: '',
    activeLines: 4
  });

  const [machineForm, setMachineForm] = useState({
    code: `M-CNC-${Math.floor(100 + Math.random() * 900)}`,
    nameEn: '',
    nameAr: '',
    factoryId: factories[0]?.id || '',
    workshopId: workshops[0]?.id || '',
    lineId: lines[0]?.id || '',
    model: 'Standard 2026',
    idealCycleTimeSec: 15,
    status: 'running' as const
  });

  const [productForm, setProductForm] = useState({
    code: `PRD-${Math.floor(100 + Math.random() * 900)}`,
    nameEn: '',
    nameAr: '',
    category: 'Industrial',
    unit: 'pcs',
    standardCost: 120,
    salePrice: 240,
    standardCycleTimeSec: 30
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'factories') {
      addMasterFactory(factoryForm);
    } else if (activeTab === 'machines') {
      addMasterMachine(machineForm);
    } else {
      addMasterProduct(productForm);
    }
    setIsModalOpen(false);
  };

  const factoryColumns: ColumnDef<Factory>[] = [
    {
      key: 'code',
      header: 'Plant Code',
      sortable: true,
      render: item => <span className="font-mono font-bold text-cyan-400">{item.code}</span>
    },
    {
      key: 'nameEn',
      header: 'Factory Name',
      render: item => (
        <div>
          <div className="font-semibold text-slate-200">{isRtl ? item.nameAr : item.nameEn}</div>
          <div className="text-[10px] text-slate-400">{item.location}</div>
        </div>
      )
    },
    {
      key: 'manager',
      header: 'Plant Manager',
      render: item => <span className="text-slate-300 font-medium">{item.manager}</span>
    },
    {
      key: 'activeLines',
      header: 'Production Lines',
      align: 'center',
      render: item => <span className="font-mono text-cyan-400 font-bold">{item.activeLines} lines</span>
    }
  ];

  const machineColumns: ColumnDef<Machine>[] = [
    {
      key: 'code',
      header: 'Machine Asset #',
      sortable: true,
      render: item => <span className="font-mono font-bold text-cyan-400">{item.code}</span>
    },
    {
      key: 'nameEn',
      header: 'Equipment Name',
      render: item => (
        <div>
          <div className="font-semibold text-slate-200">{isRtl ? item.nameAr : item.nameEn}</div>
          <div className="text-[10px] text-slate-400 font-mono">Model: {item.model}</div>
        </div>
      )
    },
    {
      key: 'idealCycleTimeSec',
      header: 'Ideal Cycle Time',
      align: 'right',
      render: item => <span className="font-mono text-white font-bold">{item.idealCycleTimeSec}s</span>
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: item => {
        const styles = {
          'running': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          'idle': 'bg-slate-700/40 text-slate-300 border-slate-600',
          'down': 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse',
          'maintenance': 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        }[item.status];
        return (
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border capitalize ${styles}`}>
            {item.status}
          </span>
        );
      }
    }
  ];

  const productColumns: ColumnDef<Product>[] = [
    {
      key: 'code',
      header: 'Part / SKU',
      sortable: true,
      render: item => <span className="font-mono font-bold text-cyan-400">{item.code}</span>
    },
    {
      key: 'nameEn',
      header: 'Product Name',
      render: item => (
        <div>
          <div className="font-semibold text-slate-200">{isRtl ? item.nameAr : item.nameEn}</div>
          <div className="text-[10px] text-slate-400">{item.category}</div>
        </div>
      )
    },
    {
      key: 'standardCost',
      header: 'Cost',
      align: 'right',
      render: item => <span className="font-mono text-slate-300">${item.standardCost}</span>
    },
    {
      key: 'salePrice',
      header: 'Sale Price',
      align: 'right',
      render: item => <span className="font-mono font-bold text-emerald-400">${item.salePrice}</span>
    },
    {
      key: 'standardCycleTimeSec',
      header: 'Std Takt Time',
      align: 'right',
      render: item => <span className="font-mono text-white">{item.standardCycleTimeSec}s</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <span>{t('nav_masterData')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure multi-site manufacturing facilities, production lines, machinery work centers, and product catalogs.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New {activeTab === 'factories' ? 'Factory' : activeTab === 'machines' ? 'Machine' : 'Product'}</span>
        </button>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('factories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'factories'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Factories ({factories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('machines')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'machines'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Machines & Work Centers ({machines.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'products'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products Catalog ({products.length})</span>
        </button>
      </div>

      {activeTab === 'factories' && (
        <DataTable
          title="Manufacturing Plants & Facilities"
          data={factories}
          columns={factoryColumns}
          keyExtractor={item => item.id}
          exportFilename="factories_master"
        />
      )}

      {activeTab === 'machines' && (
        <DataTable
          title="Machinery & Work Centers"
          data={machines}
          columns={machineColumns}
          keyExtractor={item => item.id}
          exportFilename="machines_master"
        />
      )}

      {activeTab === 'products' && (
        <DataTable
          title="Products Catalog"
          data={products}
          columns={productColumns}
          keyExtractor={item => item.id}
          exportFilename="products_master"
        />
      )}

      {/* Modal dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Add Master ${activeTab === 'factories' ? 'Factory' : activeTab === 'machines' ? 'Machine' : 'Product'}`}
        subtitle="Ensure unique codes and standard operating parameters."
        maxWidth="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {activeTab === 'factories' && (
            <>
              <div>
                <label className="text-[11px] font-semibold uppercase text-slate-400">Factory Code</label>
                <input
                  type="text"
                  required
                  value={factoryForm.code}
                  onChange={e => setFactoryForm({ ...factoryForm, code: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase text-slate-400">Factory Name (English)</label>
                <input
                  type="text"
                  required
                  value={factoryForm.nameEn}
                  onChange={e => setFactoryForm({ ...factoryForm, nameEn: e.target.value })}
                  placeholder="e.g. Suez Specialized Foundry"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase text-slate-400">Factory Name (Arabic)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={factoryForm.nameAr}
                  onChange={e => setFactoryForm({ ...factoryForm, nameAr: e.target.value })}
                  placeholder="مثال: مسبك السويس للصناعات التخصصية"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-sans"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase text-slate-400">Location</label>
                <input
                  type="text"
                  value={factoryForm.location}
                  onChange={e => setFactoryForm({ ...factoryForm, location: e.target.value })}
                  placeholder="City, Industrial Zone"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>
            </>
          )}

          {activeTab === 'machines' && (
            <>
              <div>
                <label className="text-[11px] font-semibold uppercase text-slate-400">Machine Code</label>
                <input
                  type="text"
                  required
                  value={machineForm.code}
                  onChange={e => setMachineForm({ ...machineForm, code: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase text-slate-400">Machine Name (English)</label>
                <input
                  type="text"
                  required
                  value={machineForm.nameEn}
                  onChange={e => setMachineForm({ ...machineForm, nameEn: e.target.value })}
                  placeholder="e.g. Mazak Laser Cutting Center"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase text-slate-400">Machine Name (Arabic)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={machineForm.nameAr}
                  onChange={e => setMachineForm({ ...machineForm, nameAr: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-sans"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase text-slate-400">Ideal Cycle Time (Seconds)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={machineForm.idealCycleTimeSec}
                  onChange={e => setMachineForm({ ...machineForm, idealCycleTimeSec: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>
            </>
          )}

          {activeTab === 'products' && (
            <>
              <div>
                <label className="text-[11px] font-semibold uppercase text-slate-400">Part SKU Code</label>
                <input
                  type="text"
                  required
                  value={productForm.code}
                  onChange={e => setProductForm({ ...productForm, code: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase text-slate-400">Product Name (English)</label>
                <input
                  type="text"
                  required
                  value={productForm.nameEn}
                  onChange={e => setProductForm({ ...productForm, nameEn: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase text-slate-400">Product Name (Arabic)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={productForm.nameAr}
                  onChange={e => setProductForm({ ...productForm, nameAr: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-sans"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase text-slate-400">Std Cost ($)</label>
                  <input
                    type="number"
                    value={productForm.standardCost}
                    onChange={e => setProductForm({ ...productForm, standardCost: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase text-slate-400">Sale Price ($)</label>
                  <input
                    type="number"
                    value={productForm.salePrice}
                    onChange={e => setProductForm({ ...productForm, salePrice: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </>
          )}

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
