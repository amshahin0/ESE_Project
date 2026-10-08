import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Factory as FactoryIcon,
  Globe,
  Bell,
  Printer,
  Download,
  Search,
  RotateCcw,
  Menu,
  Activity,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const {
    language,
    setLanguage,
    isRtl,
    t,
    factories,
    filters,
    updateFilter,
    alerts,
    setActivePage,
    drillDown,
    printCurrentView,
    resetAllToDefault
  } = useERP();

  const [searchVal, setSearchVal] = useState(filters.searchQuery);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('searchQuery', searchVal);
  };

  const activeFactory = factories.find(f => f.id === filters.factoryId);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 no-print">
      <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <FactoryIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  {t('brandName')}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  <Activity className="w-2.5 h-2.5 animate-pulse text-cyan-400" />
                  ERP v4.2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                {t('brandTagline')}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search & Quick Factory Selector */}
        <div className="hidden lg:flex items-center gap-3 flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className={`w-full py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all ${
                isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
              }`}
            />
          </form>

          {/* Quick Active Factory Pill */}
          <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={filters.factoryId}
              onChange={e => updateFilter('factoryId', e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-slate-100">
                {t('allFactories')}
              </option>
              {factories.map(f => (
                <option key={f.id} value={f.id} className="bg-slate-900 text-slate-100">
                  {isRtl ? f.nameAr : f.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Actions: Language Switch, Alerts, Print, Data Reset */}
        <div className="flex items-center gap-2">
          {/* Language Switch Button */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-cyan-400 transition-all"
            title="Toggle Arabic / English RTL"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {/* Alerts Notification Button */}
          <button
            onClick={() => drillDown('alerts')}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all"
            title={t('nav_alerts')}
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Print Button */}
          <button
            onClick={printCurrentView}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all hidden sm:flex"
            title={t('printReport')}
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Reset Mock Data to Default */}
          <button
            onClick={() => setShowConfirmReset(true)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-amber-900/40 hover:text-amber-300 border border-slate-700 text-slate-400 transition-all"
            title="Reset Mock Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Mock Data */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-sm w-full p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">
              {isRtl ? 'إعادة تعيين البيانات الافتراضية؟' : 'Reset Sample Data to Defaults?'}
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              {isRtl
                ? 'سيتم استعادة كافة بيانات المصانع، أوامر الشغل، سجلات الإنتاج والأعطال إلى حالتها النموذجية الأصلية.'
                : 'This will restore all factory work orders, production entries, inventory, and downtime records to their pristine initial sample state.'}
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-medium text-slate-200"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => {
                  resetAllToDefault();
                  setShowConfirmReset(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-lg"
              >
                {isRtl ? 'نعم، إعادة التعيين' : 'Yes, Reset Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
