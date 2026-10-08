import React from 'react';
import { useERP } from '../../context/ERPContext';
import {
  LayoutDashboard,
  ClipboardPenLine,
  CalendarDays,
  FileCheck2,
  ClockAlert,
  Wrench,
  Boxes,
  Layers3,
  PackageCheck,
  Cuboid,
  Cpu,
  GitFork,
  Route,
  ShieldCheck,
  ShoppingCart,
  BarChart3,
  BellRing,
  Database,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { activePage, setActivePage, isRtl, t, alerts, workOrders, inventoryItems } = useERP();

  const unreadAlerts = alerts.filter(a => !a.isRead).length;
  const lateWOCount = workOrders.filter(w => w.status === 'Late' || w.status === 'Critical Late').length;
  const stockoutCount = inventoryItems.filter(i => i.status === 'Stockout' || i.status === 'Below Min').length;

  const navSections = [
    {
      titleKey: 'group_dashboards',
      items: [
        { id: 'home', labelKey: 'nav_home', icon: LayoutDashboard }
      ]
    },
    {
      titleKey: 'group_production',
      items: [
        { id: 'production', labelKey: 'nav_production', icon: ClipboardPenLine },
        { id: 'planning', labelKey: 'nav_planning', icon: CalendarDays },
        { id: 'workOrders', labelKey: 'nav_workOrders', icon: FileCheck2, badge: lateWOCount > 0 ? lateWOCount : undefined, badgeColor: 'bg-rose-500' }
      ]
    },
    {
      titleKey: 'group_maintenance',
      items: [
        { id: 'downtime', labelKey: 'nav_downtime', icon: ClockAlert },
        { id: 'maintenance', labelKey: 'nav_maintenance', icon: Wrench }
      ]
    },
    {
      titleKey: 'group_materials',
      items: [
        { id: 'inventory', labelKey: 'nav_inventory', icon: Boxes },
        { id: 'materialConsumption', labelKey: 'nav_materialConsumption', icon: Layers3 },
        { id: 'finishedGoods', labelKey: 'nav_finishedGoods', icon: PackageCheck },
        { id: 'rawMaterials', labelKey: 'nav_rawMaterials', icon: Cuboid, badge: stockoutCount > 0 ? stockoutCount : undefined, badgeColor: 'bg-amber-500' },
        { id: 'spareParts', labelKey: 'nav_spareParts', icon: Cpu }
      ]
    },
    {
      titleKey: 'group_engineering',
      items: [
        { id: 'bom', labelKey: 'nav_bom', icon: GitFork },
        { id: 'routing', labelKey: 'nav_routing', icon: Route },
        { id: 'quality', labelKey: 'nav_quality', icon: ShieldCheck },
        { id: 'purchasing', labelKey: 'nav_purchasing', icon: ShoppingCart }
      ]
    },
    {
      titleKey: 'group_system',
      items: [
        { id: 'reports', labelKey: 'nav_reports', icon: BarChart3 },
        { id: 'alerts', labelKey: 'nav_alerts', icon: BellRing, badge: unreadAlerts > 0 ? unreadAlerts : undefined, badgeColor: 'bg-rose-500' },
        { id: 'masterData', labelKey: 'nav_masterData', icon: Database },
        { id: 'settings', labelKey: 'nav_settings', icon: SlidersHorizontal }
      ]
    }
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    onCloseMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden modal-backdrop"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 z-40 w-64 bg-slate-950 border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-53px)] lg:border-r no-print ${
          isRtl ? 'lg:border-l lg:border-r-0 right-0' : 'lg:border-r left-0'
        } ${
          isMobileOpen
            ? 'translate-x-0'
            : isRtl
            ? 'translate-x-full lg:translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header in drawer */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 lg:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">{t('brandName')}</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map(section => (
            <div key={section.titleKey} className="space-y-1">
              <h4 className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t(section.titleKey as any)}
              </h4>

              <div className="space-y-0.5 mt-1.5">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        <span className="truncate">{t(item.labelKey as any)}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          className={`shrink-0 ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white ${item.badgeColor || 'bg-slate-700'}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info box */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/50">
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <div className="text-[11px] min-w-0 flex-1">
              <p className="font-semibold text-slate-200 truncate">{t('healthStatus')}</p>
              <p className="text-slate-400 text-[10px] truncate">{t('lastSync')}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
