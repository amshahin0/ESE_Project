export type Language = 'en' | 'ar';

export type FactoryId = string;
export type WorkshopId = string;
export type LineId = string;
export type MachineId = string;
export type ProductId = string;
export type ShiftId = 'Shift 1 (Morning)' | 'Shift 2 (Evening)' | 'Shift 3 (Night)';

export interface Factory {
  id: string;
  nameEn: string;
  nameAr: string;
  code: string;
  location: string;
  manager: string;
  activeLines: number;
}

export interface Workshop {
  id: string;
  factoryId: string;
  nameEn: string;
  nameAr: string;
  code: string;
}

export interface ProductionLine {
  id: string;
  workshopId: string;
  factoryId: string;
  nameEn: string;
  nameAr: string;
  code: string;
  capacityPerHour: number;
}

export interface Machine {
  id: string;
  lineId: string;
  factoryId: string;
  workshopId: string;
  nameEn: string;
  nameAr: string;
  code: string;
  model: string;
  idealCycleTimeSec: number; // in seconds
  status: 'running' | 'idle' | 'down' | 'maintenance';
}

export interface Product {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  category: string;
  unit: string;
  standardCost: number;
  salePrice: number;
  standardCycleTimeSec: number;
}

export interface GlobalFilterState {
  dateFrom: string;
  dateTo: string;
  factoryId: string;
  workshopId: string;
  lineId: string;
  machineId: string;
  productId: string;
  shift: string;
  searchQuery: string;
}

export interface ProductionEntry {
  id: string;
  date: string;
  factoryId: string;
  workshopId: string;
  lineId: string;
  machineId: string;
  productId: string;
  workOrderId: string;
  shift: ShiftId;
  operator: string;
  plannedQty: number;
  producedQty: number;
  goodQty: number;
  scrapQty: number;
  plannedHours: number;
  actualHours: number;
  downtimeHours: number;
  remarks: string;
  // Computed fields
  achievementPercent?: number;
  qualityPercent?: number;
  scrapPercent?: number;
  efficiencyPercent?: number;
}

export interface WorkOrder {
  id: string;
  orderNumber: string;
  factoryId: string;
  lineId: string;
  productId: string;
  plannedQty: number;
  completedQty: number;
  scrapQty: number;
  startDate: string;
  dueDate: string;
  status: 'Planned' | 'In Production' | 'Completed' | 'Late' | 'Critical Late';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  delayDays: number;
  assignedTeam: string;
}

export interface DowntimeRecord {
  id: string;
  date: string;
  factoryId: string;
  workshopId: string;
  lineId: string;
  machineId: string;
  workOrderId: string;
  category: 'Mechanical' | 'Electrical' | 'Tooling' | 'Operator / Setup' | 'No Material' | 'Quality Stop' | 'Planned PM';
  durationMinutes: number;
  rootCause: string;
  actionTaken: string;
  technician: string;
  isResolved: boolean;
}

export interface MaintenanceTask {
  id: string;
  taskCode: string;
  machineId: string;
  factoryId: string;
  type: 'Preventive (PM)' | 'Corrective (Breakdown)' | 'Predictive / CBM' | 'Calibration';
  titleEn: string;
  titleAr: string;
  scheduledDate: string;
  completedDate?: string;
  technician: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';
  durationHours: number;
  sparePartsCost: number;
  laborCost: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface InventoryItem {
  id: string;
  sku: string;
  nameEn: string;
  nameAr: string;
  category: 'Raw Material' | 'Finished Goods' | 'MRO / Spare Part' | 'WIP';
  factoryId: string;
  warehouseBin: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  status: 'Normal' | 'Below Min' | 'Stockout' | 'Excess';
  lastRestocked: string;
}

export interface MaterialConsumption {
  id: string;
  date: string;
  workOrderId: string;
  rawMaterialSku: string;
  rawMaterialName: string;
  factoryId: string;
  plannedConsumption: number;
  actualConsumption: number;
  varianceQty: number;
  variancePercent: number;
  unit: string;
  scrapMaterialQty: number;
}

export interface BOMItem {
  id: string;
  parentProductId: string;
  componentSku: string;
  componentName: string;
  quantityPerUnit: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  leadTimeDays: number;
  isSubAssembly?: boolean;
}

export interface RoutingStep {
  id: string;
  productId: string;
  stepNumber: number;
  operationEn: string;
  operationAr: string;
  workshopId: string;
  machineType: string;
  setupTimeMin: number;
  cycleTimeSec: number;
  laborWorkers: number;
}

export interface QualityInspection {
  id: string;
  inspectionNo: string;
  date: string;
  workOrderId: string;
  productId: string;
  factoryId: string;
  sampleSize: number;
  defectsCount: number;
  defectType: 'Dimensional' | 'Surface Scratch' | 'Weld Porosity' | 'Color Mismatch' | 'Assembly Fit' | 'Electrical Test';
  fpyPercent: number; // First Pass Yield
  status: 'Passed' | 'Quarantined' | 'Rejected' | 'Reworked';
  inspector: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  factoryId: string;
  orderDate: string;
  expectedDate: string;
  totalAmount: number;
  currency: string;
  status: 'Draft' | 'Sent' | 'Partially Received' | 'Received' | 'Cancelled';
  itemCount: number;
}

export interface AlertNotification {
  id: string;
  timestamp: string;
  titleEn: string;
  titleAr: string;
  messageEn: string;
  messageAr: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'OEE' | 'Downtime' | 'Stock' | 'Quality' | 'WorkOrder';
  factoryId: string;
  isRead: boolean;
  linkPage?: string;
}
