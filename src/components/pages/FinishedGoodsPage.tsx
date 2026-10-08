import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import { InventoryItem } from '../../types';
import { PackageCheck, Truck, ShieldCheck, Warehouse, DollarSign } from 'lucide-react';

export const FinishedGoodsPage: React.FC = () => {
  const { inventoryItems, factories, t, isRtl } = useERP();

  const fgItems = inventoryItems.filter(i => i.category === 'Finished Goods');
  const totalValuation = fgItems.reduce((acc, c) => acc + c.currentStock * c.unitCost, 0);

  const columns: ColumnDef<InventoryItem>[] = [
    {
      key: 'sku',
      header: 'SKU / Batch Code',
      sortable: true,
      render: item => <span className="font-mono font-bold text-cyan-400">{item.sku}</span>
    },
    {
      key: 'nameEn',
      header: 'Product Name',
      render: item => (
        <div>
          <div className="font-semibold text-slate-200">{isRtl ? item.nameAr : item.nameEn}</div>
          <div className="text-[10px] text-slate-400">Warehouse Location: {item.warehouseBin}</div>
        </div>
      )
    },
    {
      key: 'currentStock',
      header: 'Finished Inventory',
      align: 'right',
      sortable: true,
      render: item => <span className="font-bold text-white font-mono">{item.currentStock.toLocaleString()} {item.unit}</span>
    },
    {
      key: 'unitCost',
      header: 'Standard Cost',
      align: 'right',
      sortable: true,
      render: item => <span className="font-mono text-slate-300">${item.unitCost.toFixed(2)}</span>
    },
    {
      key: 'totalValue',
      header: 'FG Inventory Valuation',
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
      header: 'QA & Dispatch Status',
      align: 'center',
      render: item => (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Inspected & Ready
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-400" />
            <span>{t('nav_finishedGoods')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Finished Goods warehouse stock, QA batch certifications, and customer dispatch staging.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-400">Total FG Stock Value: </span>
          <span className="font-mono font-bold text-emerald-400">${totalValuation.toLocaleString()}</span>
        </div>
      </div>

      <DataTable
        title="Finished Goods Master Storage"
        subtitle="Packaged and quality-tested stock ready for shipment"
        data={fgItems}
        columns={columns}
        keyExtractor={item => item.id}
        exportFilename="finished_goods_inventory"
      />
    </div>
  );
};
