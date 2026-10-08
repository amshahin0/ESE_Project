import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable, ColumnDef } from '../common/DataTable';
import { BOMItem } from '../../types';
import { GitFork, Layers, DollarSign, Package } from 'lucide-react';

export const BOMPage: React.FC = () => {
  const { bomItems, products, t, isRtl } = useERP();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');

  const filteredBOM = bomItems.filter(b => b.parentProductId === selectedProductId);
  const totalBOMCost = filteredBOM.reduce((acc, c) => acc + c.totalCost, 0);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const columns: ColumnDef<BOMItem>[] = [
    {
      key: 'componentSku',
      header: 'Component SKU',
      sortable: true,
      render: item => <span className="font-mono font-bold text-cyan-400">{item.componentSku}</span>
    },
    {
      key: 'componentName',
      header: 'Component Description',
      render: item => (
        <div className="flex items-center gap-2">
          {item.isSubAssembly && (
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-bold uppercase">
              Sub-Assy
            </span>
          )}
          <span className="font-medium text-slate-200">{item.componentName}</span>
        </div>
      )
    },
    {
      key: 'quantityPerUnit',
      header: 'Qty / Unit',
      align: 'right',
      render: item => (
        <span className="font-mono text-white font-bold">
          {item.quantityPerUnit} {item.unit}
        </span>
      )
    },
    {
      key: 'unitCost',
      header: 'Unit Cost',
      align: 'right',
      render: item => <span className="font-mono text-slate-300">${item.unitCost.toFixed(2)}</span>
    },
    {
      key: 'totalCost',
      header: 'Cost Rollup',
      align: 'right',
      sortable: true,
      render: item => <span className="font-mono font-bold text-emerald-400">${item.totalCost.toFixed(2)}</span>
    },
    {
      key: 'leadTimeDays',
      header: 'Lead Time',
      align: 'center',
      render: item => <span className="font-mono text-slate-400">{item.leadTimeDays} days</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <GitFork className="w-5 h-5 text-cyan-400" />
            <span>{t('nav_bom')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Engineering Bill of Materials hierarchy, multi-level components, cost rollup and supply lead times.
          </p>
        </div>

        {/* Product Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase">Product:</span>
          <select
            value={selectedProductId}
            onChange={e => setSelectedProductId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-medium"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.code} - {isRtl ? p.nameAr : p.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product BOM Header Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/90 rounded-xl border border-slate-800 p-4">
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-bold">Selected Assembly</div>
          <div className="text-base font-bold text-white mt-0.5">
            {isRtl ? selectedProduct?.nameAr : selectedProduct?.nameEn}
          </div>
          <div className="text-xs text-cyan-400 font-mono">{selectedProduct?.code}</div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 uppercase font-bold">Total Material BOM Cost</div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
            ${totalBOMCost.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500">Excludes direct shop floor labor</div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 uppercase font-bold">Finished Sale Price</div>
          <div className="text-2xl font-black font-mono text-white mt-0.5">
            ${selectedProduct?.salePrice || 0}
          </div>
          <div className="text-xs text-emerald-400 font-medium">
            Margin: {selectedProduct ? (((selectedProduct.salePrice - totalBOMCost) / selectedProduct.salePrice) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>

      <DataTable
        title={`BOM Components: ${selectedProduct?.code}`}
        subtitle="Individual child parts, materials and hardware specs required per finished unit"
        data={filteredBOM}
        columns={columns}
        keyExtractor={item => item.id}
        exportFilename={`bom_${selectedProduct?.code}`}
      />
    </div>
  );
};
