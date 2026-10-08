import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Language,
  GlobalFilterState,
  Factory,
  Workshop,
  ProductionLine,
  Machine,
  Product,
  ProductionEntry,
  WorkOrder,
  DowntimeRecord,
  MaintenanceTask,
  InventoryItem,
  MaterialConsumption,
  BOMItem,
  RoutingStep,
  QualityInspection,
  PurchaseOrder,
  AlertNotification
} from '../types';
import {
  mockFactories,
  mockWorkshops,
  mockLines,
  mockMachines,
  mockProducts,
  mockProductionEntries,
  mockWorkOrders,
  mockDowntimeRecords,
  mockMaintenanceTasks,
  mockInventoryItems,
  mockMaterialConsumptions,
  mockBOMItems,
  mockRoutingSteps,
  mockQualityInspections,
  mockPurchaseOrders,
  mockAlerts
} from '../data/mockData';
import { translations } from '../i18n/translations';

interface ERPContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRtl: boolean;
  t: (key: keyof typeof translations['en']) => string;

  activePage: string;
  setActivePage: (page: string) => void;

  filters: GlobalFilterState;
  setFilters: React.Dispatch<React.SetStateAction<GlobalFilterState>>;
  updateFilter: (key: keyof GlobalFilterState, value: string) => void;
  resetFilters: () => void;
  activeFilterCount: number;

  // Master Data
  factories: Factory[];
  workshops: Workshop[];
  lines: ProductionLine[];
  machines: Machine[];
  products: Product[];

  // Operational Data
  productionEntries: ProductionEntry[];
  workOrders: WorkOrder[];
  downtimeRecords: DowntimeRecord[];
  maintenanceTasks: MaintenanceTask[];
  inventoryItems: InventoryItem[];
  materialConsumptions: MaterialConsumption[];
  bomItems: BOMItem[];
  routingSteps: RoutingStep[];
  qualityInspections: QualityInspection[];
  purchaseOrders: PurchaseOrder[];
  alerts: AlertNotification[];

  // CRUD handlers
  addProductionEntry: (entry: Omit<ProductionEntry, 'id'>) => void;
  updateProductionEntry: (id: string, entry: Partial<ProductionEntry>) => void;
  deleteProductionEntry: (id: string) => void;

  addWorkOrder: (order: Omit<WorkOrder, 'id'>) => void;
  updateWorkOrder: (id: string, order: Partial<WorkOrder>) => void;
  deleteWorkOrder: (id: string) => void;

  addDowntimeRecord: (record: Omit<DowntimeRecord, 'id'>) => void;
  updateDowntimeRecord: (id: string, record: Partial<DowntimeRecord>) => void;
  deleteDowntimeRecord: (id: string) => void;

  addMaintenanceTask: (task: Omit<MaintenanceTask, 'id'>) => void;
  updateMaintenanceTask: (id: string, task: Partial<MaintenanceTask>) => void;
  deleteMaintenanceTask: (id: string) => void;

  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  addMasterFactory: (factory: Omit<Factory, 'id'>) => void;
  addMasterMachine: (machine: Omit<Machine, 'id'>) => void;
  addMasterProduct: (product: Omit<Product, 'id'>) => void;

  markAlertRead: (id: string) => void;
  resetAllToDefault: () => void;

  // Drilldown & Utilities
  drillDown: (page: string, filterOverrides?: Partial<GlobalFilterState>) => void;
  exportToCsv: (filename: string, headers: string[], rows: (string | number)[][]) => void;
  printCurrentView: () => void;

  // Filtered Computed KPIs
  filteredProductionEntries: ProductionEntry[];
  filteredWorkOrders: WorkOrder[];
  filteredDowntimeRecords: DowntimeRecord[];
  filteredMaintenanceTasks: MaintenanceTask[];
  filteredInventoryItems: InventoryItem[];

  kpis: {
    production: {
      plannedQty: number;
      producedQty: number;
      goodQty: number;
      scrapQty: number;
      achievementPercent: number;
      efficiencyPercent: number;
    };
    oee: {
      availabilityPercent: number;
      performancePercent: number;
      qualityPercent: number;
      oeePercent: number;
    };
    maintenance: {
      totalDowntimeHours: number;
      breakdownCount: number;
      mtbfHours: number;
      mttrHours: number;
      pmCompliancePercent: number;
      totalMaintenanceCost: number;
    };
    inventory: {
      totalValue: number;
      rawMaterialValue: number;
      mroValue: number;
      finishedGoodsValue: number;
      stockoutCount: number;
      belowMinCount: number;
      excessCount: number;
    };
    workOrders: {
      total: number;
      open: number;
      inProduction: number;
      completed: number;
      late: number;
      criticalLate: number;
      avgDelayDays: number;
    };
  };
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

const initialFilters: GlobalFilterState = {
  dateFrom: '2026-10-01',
  dateTo: '2026-10-08',
  factoryId: 'all',
  workshopId: 'all',
  lineId: 'all',
  machineId: 'all',
  productId: 'all',
  shift: 'all',
  searchQuery: ''
};

export const ERPProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('optifactory_lang') as Language) || 'en';
  });

  const [activePage, setActivePage] = useState<string>('home');
  const [filters, setFilters] = useState<GlobalFilterState>(initialFilters);

  // Load state from localStorage or mock data
  const [factories, setFactories] = useState<Factory[]>(() => {
    const saved = localStorage.getItem('erp_factories');
    return saved ? JSON.parse(saved) : mockFactories;
  });

  const [workshops, setWorkshops] = useState<Workshop[]>(() => {
    const saved = localStorage.getItem('erp_workshops');
    return saved ? JSON.parse(saved) : mockWorkshops;
  });

  const [lines, setLines] = useState<ProductionLine[]>(() => {
    const saved = localStorage.getItem('erp_lines');
    return saved ? JSON.parse(saved) : mockLines;
  });

  const [machines, setMachines] = useState<Machine[]>(() => {
    const saved = localStorage.getItem('erp_machines');
    return saved ? JSON.parse(saved) : mockMachines;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('erp_products');
    return saved ? JSON.parse(saved) : mockProducts;
  });

  const [productionEntries, setProductionEntries] = useState<ProductionEntry[]>(() => {
    const saved = localStorage.getItem('erp_prod_entries');
    return saved ? JSON.parse(saved) : mockProductionEntries;
  });

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => {
    const saved = localStorage.getItem('erp_work_orders');
    return saved ? JSON.parse(saved) : mockWorkOrders;
  });

  const [downtimeRecords, setDowntimeRecords] = useState<DowntimeRecord[]>(() => {
    const saved = localStorage.getItem('erp_downtime');
    return saved ? JSON.parse(saved) : mockDowntimeRecords;
  });

  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(() => {
    const saved = localStorage.getItem('erp_maintenance');
    return saved ? JSON.parse(saved) : mockMaintenanceTasks;
  });

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('erp_inventory');
    return saved ? JSON.parse(saved) : mockInventoryItems;
  });

  const [materialConsumptions, setMaterialConsumptions] = useState<MaterialConsumption[]>(() => {
    const saved = localStorage.getItem('erp_mat_consump');
    return saved ? JSON.parse(saved) : mockMaterialConsumptions;
  });

  const [bomItems, setBomItems] = useState<BOMItem[]>(() => {
    const saved = localStorage.getItem('erp_bom');
    return saved ? JSON.parse(saved) : mockBOMItems;
  });

  const [routingSteps, setRoutingSteps] = useState<RoutingStep[]>(() => {
    const saved = localStorage.getItem('erp_routing');
    return saved ? JSON.parse(saved) : mockRoutingSteps;
  });

  const [qualityInspections, setQualityInspections] = useState<QualityInspection[]>(() => {
    const saved = localStorage.getItem('erp_quality');
    return saved ? JSON.parse(saved) : mockQualityInspections;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('erp_po');
    return saved ? JSON.parse(saved) : mockPurchaseOrders;
  });

  const [alerts, setAlerts] = useState<AlertNotification[]>(() => {
    const saved = localStorage.getItem('erp_alerts');
    return saved ? JSON.parse(saved) : mockAlerts;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('optifactory_lang', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.body.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  useEffect(() => {
    localStorage.setItem('erp_prod_entries', JSON.stringify(productionEntries));
  }, [productionEntries]);

  useEffect(() => {
    localStorage.setItem('erp_work_orders', JSON.stringify(workOrders));
  }, [workOrders]);

  useEffect(() => {
    localStorage.setItem('erp_downtime', JSON.stringify(downtimeRecords));
  }, [downtimeRecords]);

  useEffect(() => {
    localStorage.setItem('erp_maintenance', JSON.stringify(maintenanceTasks));
  }, [maintenanceTasks]);

  useEffect(() => {
    localStorage.setItem('erp_inventory', JSON.stringify(inventoryItems));
  }, [inventoryItems]);

  useEffect(() => {
    localStorage.setItem('erp_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const isRtl = language === 'ar';
  const t = (key: keyof typeof translations['en']): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  const updateFilter = (key: keyof GlobalFilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.factoryId !== 'all') count++;
    if (filters.workshopId !== 'all') count++;
    if (filters.lineId !== 'all') count++;
    if (filters.machineId !== 'all') count++;
    if (filters.productId !== 'all') count++;
    if (filters.shift !== 'all') count++;
    if (filters.searchQuery.trim() !== '') count++;
    return count;
  }, [filters]);

  // Filtered Production Entries
  const filteredProductionEntries = useMemo(() => {
    return productionEntries.filter(e => {
      if (filters.factoryId !== 'all' && e.factoryId !== filters.factoryId) return false;
      if (filters.workshopId !== 'all' && e.workshopId !== filters.workshopId) return false;
      if (filters.lineId !== 'all' && e.lineId !== filters.lineId) return false;
      if (filters.machineId !== 'all' && e.machineId !== filters.machineId) return false;
      if (filters.productId !== 'all' && e.productId !== filters.productId) return false;
      if (filters.shift !== 'all' && e.shift !== filters.shift) return false;
      if (filters.dateFrom && e.date < filters.dateFrom) return false;
      if (filters.dateTo && e.date > filters.dateTo) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          e.workOrderId.toLowerCase().includes(q) ||
          e.operator.toLowerCase().includes(q) ||
          e.remarks.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [productionEntries, filters]);

  // Filtered Work Orders
  const filteredWorkOrders = useMemo(() => {
    return workOrders.filter(w => {
      if (filters.factoryId !== 'all' && w.factoryId !== filters.factoryId) return false;
      if (filters.lineId !== 'all' && w.lineId !== filters.lineId) return false;
      if (filters.productId !== 'all' && w.productId !== filters.productId) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          w.orderNumber.toLowerCase().includes(q) ||
          w.assignedTeam.toLowerCase().includes(q) ||
          w.status.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [workOrders, filters]);

  // Filtered Downtimes
  const filteredDowntimeRecords = useMemo(() => {
    return downtimeRecords.filter(d => {
      if (filters.factoryId !== 'all' && d.factoryId !== filters.factoryId) return false;
      if (filters.workshopId !== 'all' && d.workshopId !== filters.workshopId) return false;
      if (filters.lineId !== 'all' && d.lineId !== filters.lineId) return false;
      if (filters.machineId !== 'all' && d.machineId !== filters.machineId) return false;
      if (filters.dateFrom && d.date < filters.dateFrom) return false;
      if (filters.dateTo && d.date > filters.dateTo) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          d.category.toLowerCase().includes(q) ||
          d.rootCause.toLowerCase().includes(q) ||
          d.technician.toLowerCase().includes(q) ||
          d.workOrderId.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [downtimeRecords, filters]);

  // Filtered Maintenance
  const filteredMaintenanceTasks = useMemo(() => {
    return maintenanceTasks.filter(m => {
      if (filters.factoryId !== 'all' && m.factoryId !== filters.factoryId) return false;
      if (filters.machineId !== 'all' && m.machineId !== filters.machineId) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          m.taskCode.toLowerCase().includes(q) ||
          m.titleEn.toLowerCase().includes(q) ||
          m.titleAr.toLowerCase().includes(q) ||
          m.technician.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [maintenanceTasks, filters]);

  // Filtered Inventory
  const filteredInventoryItems = useMemo(() => {
    return inventoryItems.filter(i => {
      if (filters.factoryId !== 'all' && i.factoryId !== filters.factoryId) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          i.sku.toLowerCase().includes(q) ||
          i.nameEn.toLowerCase().includes(q) ||
          i.nameAr.toLowerCase().includes(q) ||
          i.warehouseBin.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [inventoryItems, filters]);

  // Computed KPIs based on active filters
  const kpis = useMemo(() => {
    // 1. Production KPIs
    const plannedQty = filteredProductionEntries.reduce((acc, curr) => acc + (curr.plannedQty || 0), 0);
    const producedQty = filteredProductionEntries.reduce((acc, curr) => acc + (curr.producedQty || 0), 0);
    const goodQty = filteredProductionEntries.reduce((acc, curr) => acc + (curr.goodQty || 0), 0);
    const scrapQty = filteredProductionEntries.reduce((acc, curr) => acc + (curr.scrapQty || 0), 0);
    const achievementPercent = plannedQty > 0 ? (producedQty / plannedQty) * 100 : 0;
    const prodEfficiency = plannedQty > 0 ? (goodQty / plannedQty) * 100 : 0;

    // 2. OEE KPIs
    // Planned hours vs run hours
    const totalPlannedHours = filteredProductionEntries.reduce((acc, curr) => acc + (curr.plannedHours || 0), 0);
    const totalActualHours = filteredProductionEntries.reduce((acc, curr) => acc + (curr.actualHours || 0), 0);
    const availability = totalPlannedHours > 0 ? Math.min(100, (totalActualHours / totalPlannedHours) * 100) : 92.5;

    // Quality = Good / Produced
    const quality = producedQty > 0 ? (goodQty / producedQty) * 100 : 98.2;

    // Performance = (Actual Output) / (Ideal Output in Operating Time)
    // Approximate weighted performance:
    const avgPerf = filteredProductionEntries.length > 0
      ? filteredProductionEntries.reduce((acc, curr) => acc + (curr.efficiencyPercent || 95), 0) / filteredProductionEntries.length
      : 94.6;
    const performance = Math.min(100, Math.max(50, avgPerf));

    // OEE = A * P * Q
    const oeePercent = ((availability / 100) * (performance / 100) * (quality / 100)) * 100;

    // 3. Maintenance KPIs
    const totalDowntimeMin = filteredDowntimeRecords.reduce((acc, curr) => acc + curr.durationMinutes, 0);
    const totalDowntimeHours = totalDowntimeMin / 60;
    const breakdownCount = filteredDowntimeRecords.filter(d => d.category !== 'Planned PM').length;
    // MTTR = Total downtime in hours / number of breakdowns
    const mttrHours = breakdownCount > 0 ? totalDowntimeHours / breakdownCount : 0.8;
    // MTBF = (Total Operating Hours - Total Downtime) / Breakdown Count
    const totalOpHours = totalActualHours > 0 ? totalActualHours : 48;
    const mtbfHours = breakdownCount > 0 ? (Math.max(0, totalOpHours - totalDowntimeHours) / breakdownCount) : 38.5;

    const pmTasks = filteredMaintenanceTasks.filter(m => m.type.startsWith('Preventive'));
    const pmCompleted = pmTasks.filter(m => m.status === 'Completed').length;
    const pmCompliancePercent = pmTasks.length > 0 ? (pmCompleted / pmTasks.length) * 100 : 85.0;

    const totalMaintenanceCost = filteredMaintenanceTasks.reduce((acc, m) => acc + m.sparePartsCost + m.laborCost, 0);

    // 4. Inventory KPIs
    const totalValue = filteredInventoryItems.reduce((acc, i) => acc + (i.currentStock * i.unitCost), 0);
    const rawMaterialValue = filteredInventoryItems
      .filter(i => i.category === 'Raw Material')
      .reduce((acc, i) => acc + (i.currentStock * i.unitCost), 0);
    const mroValue = filteredInventoryItems
      .filter(i => i.category === 'MRO / Spare Part')
      .reduce((acc, i) => acc + (i.currentStock * i.unitCost), 0);
    const finishedGoodsValue = filteredInventoryItems
      .filter(i => i.category === 'Finished Goods')
      .reduce((acc, i) => acc + (i.currentStock * i.unitCost), 0);

    const stockoutCount = filteredInventoryItems.filter(i => i.status === 'Stockout' || i.currentStock <= 0).length;
    const belowMinCount = filteredInventoryItems.filter(i => i.status === 'Below Min' || (i.currentStock > 0 && i.currentStock < i.minStock)).length;
    const excessCount = filteredInventoryItems.filter(i => i.status === 'Excess' || i.currentStock > i.maxStock).length;

    // 5. Work Order KPIs
    const totalWOs = filteredWorkOrders.length;
    const openWOs = filteredWorkOrders.filter(w => w.status === 'Planned' || w.status === 'In Production').length;
    const inProdWOs = filteredWorkOrders.filter(w => w.status === 'In Production').length;
    const completedWOs = filteredWorkOrders.filter(w => w.status === 'Completed').length;
    const lateWOs = filteredWorkOrders.filter(w => w.status === 'Late' || w.status === 'Critical Late').length;
    const criticalLateWOs = filteredWorkOrders.filter(w => w.status === 'Critical Late').length;
    const totalDelay = filteredWorkOrders.reduce((acc, w) => acc + (w.delayDays || 0), 0);
    const avgDelayDays = totalWOs > 0 ? Number((totalDelay / totalWOs).toFixed(1)) : 0;

    return {
      production: {
        plannedQty,
        producedQty,
        goodQty,
        scrapQty,
        achievementPercent: Number(achievementPercent.toFixed(1)),
        efficiencyPercent: Number(prodEfficiency.toFixed(1))
      },
      oee: {
        availabilityPercent: Number(availability.toFixed(1)),
        performancePercent: Number(performance.toFixed(1)),
        qualityPercent: Number(quality.toFixed(1)),
        oeePercent: Number(oeePercent.toFixed(1))
      },
      maintenance: {
        totalDowntimeHours: Number(totalDowntimeHours.toFixed(1)),
        breakdownCount,
        mtbfHours: Number(mtbfHours.toFixed(1)),
        mttrHours: Number(mttrHours.toFixed(1)),
        pmCompliancePercent: Number(pmCompliancePercent.toFixed(1)),
        totalMaintenanceCost
      },
      inventory: {
        totalValue,
        rawMaterialValue,
        mroValue,
        finishedGoodsValue,
        stockoutCount,
        belowMinCount,
        excessCount
      },
      workOrders: {
        total: totalWOs,
        open: openWOs,
        inProduction: inProdWOs,
        completed: completedWOs,
        late: lateWOs,
        criticalLate: criticalLateWOs,
        avgDelayDays
      }
    };
  }, [filteredProductionEntries, filteredDowntimeRecords, filteredMaintenanceTasks, filteredInventoryItems, filteredWorkOrders]);

  // Production CRUD with auto calculations
  const calculateEntryMetrics = (entry: Partial<ProductionEntry>) => {
    const planned = entry.plannedQty || 1;
    const produced = entry.producedQty || 0;
    const good = entry.goodQty || 0;
    const scrap = entry.scrapQty || 0;
    const achievementPercent = Number(((produced / planned) * 100).toFixed(2));
    const qualityPercent = produced > 0 ? Number(((good / produced) * 100).toFixed(2)) : 0;
    const scrapPercent = produced > 0 ? Number(((scrap / produced) * 100).toFixed(2)) : 0;
    const efficiencyPercent = Number(((good / planned) * 100).toFixed(2));

    return {
      achievementPercent,
      qualityPercent,
      scrapPercent,
      efficiencyPercent
    };
  };

  const addProductionEntry = (entry: Omit<ProductionEntry, 'id'>) => {
    const calcs = calculateEntryMetrics(entry);
    const newEntry: ProductionEntry = {
      ...entry,
      id: `pe-${Date.now()}`,
      ...calcs
    };
    setProductionEntries(prev => [newEntry, ...prev]);
  };

  const updateProductionEntry = (id: string, entry: Partial<ProductionEntry>) => {
    setProductionEntries(prev =>
      prev.map(p => {
        if (p.id === id) {
          const merged = { ...p, ...entry };
          const calcs = calculateEntryMetrics(merged);
          return { ...merged, ...calcs };
        }
        return p;
      })
    );
  };

  const deleteProductionEntry = (id: string) => {
    setProductionEntries(prev => prev.filter(p => p.id !== id));
  };

  // Work Order CRUD
  const addWorkOrder = (order: Omit<WorkOrder, 'id'>) => {
    const newOrder: WorkOrder = {
      ...order,
      id: `wo-${Date.now()}`
    };
    setWorkOrders(prev => [newOrder, ...prev]);
  };

  const updateWorkOrder = (id: string, order: Partial<WorkOrder>) => {
    setWorkOrders(prev => prev.map(w => (w.id === id ? { ...w, ...order } : w)));
  };

  const deleteWorkOrder = (id: string) => {
    setWorkOrders(prev => prev.filter(w => w.id !== id));
  };

  // Downtime CRUD
  const addDowntimeRecord = (record: Omit<DowntimeRecord, 'id'>) => {
    const newRecord: DowntimeRecord = {
      ...record,
      id: `dt-${Date.now()}`
    };
    setDowntimeRecords(prev => [newRecord, ...prev]);
  };

  const updateDowntimeRecord = (id: string, record: Partial<DowntimeRecord>) => {
    setDowntimeRecords(prev => prev.map(d => (d.id === id ? { ...d, ...record } : d)));
  };

  const deleteDowntimeRecord = (id: string) => {
    setDowntimeRecords(prev => prev.filter(d => d.id !== id));
  };

  // Maintenance CRUD
  const addMaintenanceTask = (task: Omit<MaintenanceTask, 'id'>) => {
    const newTask: MaintenanceTask = {
      ...task,
      id: `mt-${Date.now()}`
    };
    setMaintenanceTasks(prev => [newTask, ...prev]);
  };

  const updateMaintenanceTask = (id: string, task: Partial<MaintenanceTask>) => {
    setMaintenanceTasks(prev => prev.map(m => (m.id === id ? { ...m, ...task } : m)));
  };

  const deleteMaintenanceTask = (id: string) => {
    setMaintenanceTasks(prev => prev.filter(m => m.id !== id));
  };

  // Inventory CRUD
  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`
    };
    setInventoryItems(prev => [newItem, ...prev]);
  };

  const updateInventoryItem = (id: string, item: Partial<InventoryItem>) => {
    setInventoryItems(prev => prev.map(i => (i.id === id ? { ...i, ...item } : i)));
  };

  const deleteInventoryItem = (id: string) => {
    setInventoryItems(prev => prev.filter(i => i.id !== id));
  };

  // Master data
  const addMasterFactory = (f: Omit<Factory, 'id'>) => {
    const newFac: Factory = { ...f, id: `fac-${Date.now()}` };
    setFactories(prev => [...prev, newFac]);
  };

  const addMasterMachine = (m: Omit<Machine, 'id'>) => {
    const newM: Machine = { ...m, id: `m-${Date.now()}` };
    setMachines(prev => [...prev, newM]);
  };

  const addMasterProduct = (p: Omit<Product, 'id'>) => {
    const newP: Product = { ...p, id: `prod-${Date.now()}` };
    setProducts(prev => [...prev, newP]);
  };

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const resetAllToDefault = () => {
    localStorage.clear();
    setFactories(mockFactories);
    setWorkshops(mockWorkshops);
    setLines(mockLines);
    setMachines(mockMachines);
    setProducts(mockProducts);
    setProductionEntries(mockProductionEntries);
    setWorkOrders(mockWorkOrders);
    setDowntimeRecords(mockDowntimeRecords);
    setMaintenanceTasks(mockMaintenanceTasks);
    setInventoryItems(mockInventoryItems);
    setMaterialConsumptions(mockMaterialConsumptions);
    setBomItems(mockBOMItems);
    setRoutingSteps(mockRoutingSteps);
    setQualityInspections(mockQualityInspections);
    setPurchaseOrders(mockPurchaseOrders);
    setAlerts(mockAlerts);
    setFilters(initialFilters);
  };

  // Drilldown function: switch page and preset relevant filter
  const drillDown = (page: string, filterOverrides?: Partial<GlobalFilterState>) => {
    if (filterOverrides) {
      setFilters(prev => ({ ...prev, ...filterOverrides }));
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CSV export utility
  const exportToCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [
        headers.join(','),
        ...rows.map(row =>
          row
            .map(val => {
              const str = String(val ?? '').replace(/"/g, '""');
              return `"${str}"`;
            })
            .join(',')
        )
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printCurrentView = () => {
    window.print();
  };

  return (
    <ERPContext.Provider
      value={{
        language,
        setLanguage,
        isRtl,
        t,
        activePage,
        setActivePage,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        activeFilterCount,
        factories,
        workshops,
        lines,
        machines,
        products,
        productionEntries,
        workOrders,
        downtimeRecords,
        maintenanceTasks,
        inventoryItems,
        materialConsumptions,
        bomItems,
        routingSteps,
        qualityInspections,
        purchaseOrders,
        alerts,
        addProductionEntry,
        updateProductionEntry,
        deleteProductionEntry,
        addWorkOrder,
        updateWorkOrder,
        deleteWorkOrder,
        addDowntimeRecord,
        updateDowntimeRecord,
        deleteDowntimeRecord,
        addMaintenanceTask,
        updateMaintenanceTask,
        deleteMaintenanceTask,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        addMasterFactory,
        addMasterMachine,
        addMasterProduct,
        markAlertRead,
        resetAllToDefault,
        drillDown,
        exportToCsv,
        printCurrentView,
        filteredProductionEntries,
        filteredWorkOrders,
        filteredDowntimeRecords,
        filteredMaintenanceTasks,
        filteredInventoryItems,
        kpis
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
