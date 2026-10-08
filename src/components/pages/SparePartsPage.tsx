import React from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import { InventoryItem } from '../../types';
import { Cpu, AlertCircle, Wrench } from 'lucide-react';

export const SparePartsPage: React.FC = () => {
  const { inventoryItems, t, isRtl, drillDown } = useERP();

  const mroItems = inventoryItems.filter(i => i.category === 'MRO / Spare Part');

  const columns: ColumnDef<InventoryItem>[] = [
    {
      key: 'sku',
      header: 'Part Number',
      sortable: true,
      render: item => <span className="font-mono font-bold text-cyan-400">{item.sku}</span>
    },
    {
      key: 'nameEn',
      header: 'Spare Part Description',
      render: item => (
        <div>
          <div className="font-semibold text-slate-200">{isRtl ? item.nameAr : item.nameEn}</div>
          <div className="text-[10px] text-slate-400">Bin: {item.warehouseBin}</div>
        </div>
      )
    },
    {
      key: 'currentStock',
      header: 'On-Hand',
      align: 'right',
      sortable: true,
      render: item => (
        <span className="font-mono font-bold text-white">
          {item.currentStock} {item.unit}
        </span>
      )
    },
    {
      key: 'minStock',
      header: 'Min Threshold',
      align: 'right',
      render: item => <span className="font-mono text-slate-400">{item.minStock} {item.unit}</span>
    },
    {
      key: 'unitCost',
      header: 'Cost / Unit',
      align: 'right',
      sortable: true,
      render: item => <span className="font-mono text-slate-300">${item.unitCost.toFixed(2)}</span>
    },
    {
      key: 'totalValue',
      header: 'Value',
      align: 'right',
      sortable: true,
      render: item => (
        <span className="font-mono font-bold text-amber-400">
          ${(item.currentStock * item.unitCost).toLocaleString()}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Availability',
      align: 'center',
      render: item => {
        const isLow = item.currentStock < item.minStock;
        return (
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
              isLow
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {isLow ? 'Critical Low' : 'In Stock'}
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
            <Cpu className="w-5 h-5 text-amber-400" />
            <span>{t('nav_spareParts')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Maintenance, Repair, and Operations (MRO) spare parts inventory, bearings, seals, PLCs and critical machine consumables.
          </p>
        </div>

        <button
          onClick={() => drillDown('maintenance')}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all"
        >
          View Maintenance Demand
        </button>
      </div>

      <DataTable
        title="MRO Spare Parts Catalog"
        subtitle="Critical component inventory for minimizing machine MTTR down times"
        data={mroItems}
        columns={columns}
        keyExtractor={item => item.id}
        exportFilename="mro_spare_parts_catalog"
      />
    </div>
  );
};
