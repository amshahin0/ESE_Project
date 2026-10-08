import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Filter,
  RotateCcw,
  Calendar,
  Building2,
  Boxes,
  Workflow,
  Cpu,
  Package,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const GlobalFilterBar: React.FC = () => {
  const {
    filters,
    updateFilter,
    resetFilters,
    activeFilterCount,
    factories,
    workshops,
    lines,
    machines,
    products,
    t,
    isRtl
  } = useERP();

  const [isExpanded, setIsExpanded] = useState(true);

  // Filter workshops by selected factory
  const availableWorkshops = workshops.filter(w =>
    filters.factoryId === 'all' ? true : w.factoryId === filters.factoryId
  );

  // Filter lines by selected factory & workshop
  const availableLines = lines.filter(l => {
    if (filters.factoryId !== 'all' && l.factoryId !== filters.factoryId) return false;
    if (filters.workshopId !== 'all' && l.workshopId !== filters.workshopId) return false;
    return true;
  });

  // Filter machines by selected factory & line
  const availableMachines = machines.filter(m => {
    if (filters.factoryId !== 'all' && m.factoryId !== filters.factoryId) return false;
    if (filters.workshopId !== 'all' && m.workshopId !== filters.workshopId) return false;
    if (filters.lineId !== 'all' && m.lineId !== filters.lineId) return false;
    return true;
  });

  return (
    <div className="filter-bar bg-slate-900/90 backdrop-blur border-b border-slate-800 text-slate-200 px-4 lg:px-6 py-2.5 transition-all no-print">
      <div className="flex items-center justify-between gap-3">
        {/* Title & Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Filter className="w-3.5 h-3.5" />
            <span>{t('filters_title')}</span>
          </div>

          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold">
              {activeFilterCount} {t('activeFilters')}
            </span>
          )}
        </div>

        {/* Right Buttons: Toggle Collapse & Reset */}
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 transition-colors px-2 py-1 rounded hover:bg-slate-800"
              title={t('resetFilters')}
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">{t('resetFilters')}</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title={isExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Filter Inputs Grid */}
      {isExpanded && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mt-2.5 pt-2.5 border-t border-slate-800/80">
          {/* 1. Date From */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[10px] font-semibold uppercase text-slate-400">
              <Calendar className="w-2.5 h-2.5 text-cyan-400" />
              <span>{t('dateFrom')}</span>
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={e => updateFilter('dateFrom', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* 2. Date To */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[10px] font-semibold uppercase text-slate-400">
              <Calendar className="w-2.5 h-2.5 text-cyan-400" />
              <span>{t('dateTo')}</span>
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={e => updateFilter('dateTo', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* 3. Factory */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[10px] font-semibold uppercase text-slate-400">
              <Building2 className="w-2.5 h-2.5 text-cyan-400" />
              <span>{t('factory')}</span>
            </label>
            <select
              value={filters.factoryId}
              onChange={e => {
                updateFilter('factoryId', e.target.value);
                updateFilter('workshopId', 'all');
                updateFilter('lineId', 'all');
                updateFilter('machineId', 'all');
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 truncate"
            >
              <option value="all">{t('allFactories')}</option>
              {factories.map(f => (
                <option key={f.id} value={f.id}>
                  {isRtl ? f.nameAr : f.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Workshop */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[10px] font-semibold uppercase text-slate-400">
              <Boxes className="w-2.5 h-2.5 text-cyan-400" />
              <span>{t('workshop')}</span>
            </label>
            <select
              value={filters.workshopId}
              onChange={e => {
                updateFilter('workshopId', e.target.value);
                updateFilter('lineId', 'all');
                updateFilter('machineId', 'all');
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 truncate"
            >
              <option value="all">{t('allWorkshops')}</option>
              {availableWorkshops.map(w => (
                <option key={w.id} value={w.id}>
                  {isRtl ? w.nameAr : w.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Production Line */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[10px] font-semibold uppercase text-slate-400">
              <Workflow className="w-2.5 h-2.5 text-cyan-400" />
              <span>{t('productionLine')}</span>
            </label>
            <select
              value={filters.lineId}
              onChange={e => {
                updateFilter('lineId', e.target.value);
                updateFilter('machineId', 'all');
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 truncate"
            >
              <option value="all">{t('allLines')}</option>
              {availableLines.map(l => (
                <option key={l.id} value={l.id}>
                  {isRtl ? l.nameAr : l.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Machine */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[10px] font-semibold uppercase text-slate-400">
              <Cpu className="w-2.5 h-2.5 text-cyan-400" />
              <span>{t('machine')}</span>
            </label>
            <select
              value={filters.machineId}
              onChange={e => updateFilter('machineId', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 truncate"
            >
              <option value="all">{t('allMachines')}</option>
              {availableMachines.map(m => (
                <option key={m.id} value={m.id}>
                  {isRtl ? m.nameAr : m.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* 7. Product */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[10px] font-semibold uppercase text-slate-400">
              <Package className="w-2.5 h-2.5 text-cyan-400" />
              <span>{t('product')}</span>
            </label>
            <select
              value={filters.productId}
              onChange={e => updateFilter('productId', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 truncate"
            >
              <option value="all">{t('allProducts')}</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {isRtl ? p.nameAr : p.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* 8. Shift */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[10px] font-semibold uppercase text-slate-400">
              <Clock className="w-2.5 h-2.5 text-cyan-400" />
              <span>{t('shift')}</span>
            </label>
            <select
              value={filters.shift}
              onChange={e => updateFilter('shift', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 truncate"
            >
              <option value="all">{t('allShifts')}</option>
              <option value="Shift 1 (Morning)">Shift 1 (Morning) / الوردية الأولى</option>
              <option value="Shift 2 (Evening)">Shift 2 (Evening) / الوردية الثانية</option>
              <option value="Shift 3 (Night)">Shift 3 (Night) / الوردية الثالثة</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
