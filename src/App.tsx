import React, { useState } from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalFilterBar } from './components/layout/GlobalFilterBar';

// 19 Pages
import { HomePage } from './components/pages/HomePage';
import { ProductionPage } from './components/pages/ProductionPage';
import { PlanningPage } from './components/pages/PlanningPage';
import { WorkOrdersPage } from './components/pages/WorkOrdersPage';
import { DowntimePage } from './components/pages/DowntimePage';
import { MaintenancePage } from './components/pages/MaintenancePage';
import { InventoryPage } from './components/pages/InventoryPage';
import { MaterialConsumptionPage } from './components/pages/MaterialConsumptionPage';
import { FinishedGoodsPage } from './components/pages/FinishedGoodsPage';
import { RawMaterialsPage } from './components/pages/RawMaterialsPage';
import { SparePartsPage } from './components/pages/SparePartsPage';
import { BOMPage } from './components/pages/BOMPage';
import { RoutingPage } from './components/pages/RoutingPage';
import { QualityPage } from './components/pages/QualityPage';
import { PurchasingPage } from './components/pages/PurchasingPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { AlertsPage } from './components/pages/AlertsPage';
import { MasterDataPage } from './components/pages/MasterDataPage';
import { SettingsPage } from './components/pages/SettingsPage';

const AppContent: React.FC = () => {
  const { activePage } = useERP();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'production':
        return <ProductionPage />;
      case 'planning':
        return <PlanningPage />;
      case 'workOrders':
        return <WorkOrdersPage />;
      case 'downtime':
        return <DowntimePage />;
      case 'maintenance':
        return <MaintenancePage />;
      case 'inventory':
        return <InventoryPage />;
      case 'materialConsumption':
        return <MaterialConsumptionPage />;
      case 'finishedGoods':
        return <FinishedGoodsPage />;
      case 'rawMaterials':
        return <RawMaterialsPage />;
      case 'spareParts':
        return <SparePartsPage />;
      case 'bom':
        return <BOMPage />;
      case 'routing':
        return <RoutingPage />;
      case 'quality':
        return <QualityPage />;
      case 'purchasing':
        return <PurchasingPage />;
      case 'reports':
        return <ReportsPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'masterData':
        return <MasterDataPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Header */}
      <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)} />

      {/* Global Filter Bar */}
      <GlobalFilterBar />

      {/* Main Body with Sidebar + Page Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-16">
          <div className="max-w-7xl mx-auto">
            {renderActivePage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ERPProvider>
      <AppContent />
    </ERPProvider>
  );
}
