import React from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import { InventoryItem } from '../../types';
import { Cuboid, AlertTriangle, CheckCircle, ArrowDown } from 'lucide-react';

export const RawMaterialsPage: React.FC = () => {
  const { inventoryItems, factories, t, isRtl, drillDown } = useERP();

  const rmItems = inventoryItems.filter(i => i.category === 'Raw Material');

  const columns: ColumnDef<InventoryItem>[] = [
    {
      key: 'sku',
      header: 'SKU Code',
      sortable: true,
      render: item => <span className="font-mono font-bold text-cyan-400">{item.sku}</span>
    },
    {
      key: 'nameEn',
      header: 'Material Grade / Spec',
      render: item => (
        <div>
          <div className="font-semibold text-slate-200">{isRtl ? item.nameAr : item.nameEn}</div>
          <div className="text-[10px] text-slate-400">Warehouse: {item.warehouseBin}</div>
        </div>
      )
    },
    {
      key: 'currentStock',
      header: 'Current Stock',
      align: 'right',
      sortable: true,
      render: item => {
        const isCritical = item.currentStock <= item.minStock;
        return (
          <span className={`font-mono font-bold ${isCritical ? 'text-rose-400' : 'text-white'}`}>
            {item.currentStock.toLocaleString()} {item.unit}
          </span>
        );
      }
    },
    {
      key: 'minStock',
      header: 'Safety Threshold',
      align: 'right',
      render: item => <span className="font-mono text-slate-400">{item.minStock.toLocaleString()} {item.unit}</span>
    },
    {
      key: 'unitCost',
      header: 'Unit Cost',
      align: 'right',
      sortable: true,
      render: item => <span className="font-mono text-slate-300">${item.unitCost.toFixed(2)}</span>
    },
    {
      key: 'status',
      header: 'Supply Status',
      align: 'center',
      render: item => {
        const isStockout = item.currentStock === 0 || item.status === 'Stockout';
        const isLow = item.currentStock < item.minStock;

        if (isStockout) {
          return (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
              Stockout (0 kg)
            </span>
          );
        }
        if (isLow) {
          return (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Below Safety Min
            </span>
          );
        }
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Healthy Stock
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
            <Cuboid className="w-5 h-5 text-cyan-400" />
            <span>{t('nav_rawMaterials')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Raw materials inventory, safety stock levels, supply shortages, and replenishment alerts.
          </p>
        </div>

        <button
          onClick={() => drillDown('purchasing')}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all"
        >
          Generate Replenishment PO
        </button>
      </div>

      <DataTable
        title="Raw Material Inventory Records"
        subtitle="Manage metals, polymers, castings, and chemicals feedstocks"
        data={rmItems}
        columns={columns}
        keyExtractor={item => item.id}
        exportFilename="raw_materials_inventory"
      />
    </div>
  );
};
