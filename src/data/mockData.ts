import {
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

export const mockFactories: Factory[] = [
  {
    id: 'fac-1',
    code: 'FAC-CAI-01',
    nameEn: 'Cairo Mega Manufacturing Plant',
    nameAr: 'مصنع القاهرة الكبرى للتصنيع المتطور',
    location: '10th of Ramadan Industrial Zone, Cairo',
    manager: 'Eng. Tarek Mansour',
    activeLines: 8
  },
  {
    id: 'fac-2',
    code: 'FAC-ALX-02',
    nameEn: 'Alexandria Heavy Industries Complex',
    nameAr: 'مجمع الإسكندرية للصناعات الثقيلة',
    location: 'Borg El Arab Free Zone, Alexandria',
    manager: 'Eng. Sarah El-Kady',
    activeLines: 6
  },
  {
    id: 'fac-3',
    code: 'FAC-OCT-03',
    nameEn: '6th of October Automotive & Tech Facility',
    nameAr: 'منشأة السادس من أكتوبر لتصنيع السيارات والتقنية',
    location: '6th of October City, Giza',
    manager: 'Eng. Khaled Hassan',
    activeLines: 5
  }
];

export const mockWorkshops: Workshop[] = [
  { id: 'ws-1', factoryId: 'fac-1', code: 'WS-STAMP', nameEn: 'Press & Stamping Shop', nameAr: 'قسم المكابس والتشكيل' },
  { id: 'ws-2', factoryId: 'fac-1', code: 'WS-CNC', nameEn: 'CNC Precision Machining', nameAr: 'قسم الخراطة والتشغيل الدقيق CNC' },
  { id: 'ws-3', factoryId: 'fac-1', code: 'WS-ASSY', nameEn: 'Main Assembly & Testing', nameAr: 'قسم التجميع والاختبار النهائي' },
  { id: 'ws-4', factoryId: 'fac-2', code: 'WS-WELD', nameEn: 'Robotic Welding Shop', nameAr: 'قسم اللحام الآلي والروبوتات' },
  { id: 'ws-5', factoryId: 'fac-2', code: 'WS-MOLD', nameEn: 'Injection Molding Shop', nameAr: 'قسم حقن البلاستيك والقوالب' },
  { id: 'ws-6', factoryId: 'fac-3', code: 'WS-FINISH', nameEn: 'Surface Coating & Paint', nameAr: 'قسم الدهان والمعالجة السطحية' }
];

export const mockLines: ProductionLine[] = [
  { id: 'line-1', factoryId: 'fac-1', workshopId: 'ws-1', code: 'L-ST-01', nameEn: 'High-Tonnage Press Line 1', nameAr: 'خط المكابس عالي الحمولة 1', capacityPerHour: 450 },
  { id: 'line-2', factoryId: 'fac-1', workshopId: 'ws-2', code: 'L-CNC-01', nameEn: '5-Axis Machining Cell A', nameAr: 'خلية الخراطة خماسية المحاور A', capacityPerHour: 180 },
  { id: 'line-3', factoryId: 'fac-1', workshopId: 'ws-3', code: 'L-ASSY-01', nameEn: 'Automated Final Assembly Line', nameAr: 'خط التجميع الآلي النهائي', capacityPerHour: 320 },
  { id: 'line-4', factoryId: 'fac-2', workshopId: 'ws-4', code: 'L-WLD-01', nameEn: 'Heavy Chassis Welding Line', nameAr: 'خط لحام هياكل الشاسيهات الثقيلة', capacityPerHour: 120 },
  { id: 'line-5', factoryId: 'fac-2', workshopId: 'ws-5', code: 'L-MLD-01', nameEn: 'Precision Polymer Injection Line', nameAr: 'خط حقن البوليمرات الدقيقة', capacityPerHour: 600 },
  { id: 'line-6', factoryId: 'fac-3', workshopId: 'ws-6', code: 'L-COAT-01', nameEn: 'Electrostatic Powder Coating Line', nameAr: 'خط الدهان الإلكتروستاتيكي', capacityPerHour: 280 }
];

export const mockMachines: Machine[] = [
  { id: 'm-1', factoryId: 'fac-1', workshopId: 'ws-1', lineId: 'line-1', code: 'M-PRS-800T', nameEn: 'Hydraulic Press 800 Ton', nameAr: 'مكبس هيدروليكي 800 طن', model: 'Schuler H-800', idealCycleTimeSec: 8, status: 'running' },
  { id: 'm-2', factoryId: 'fac-1', workshopId: 'ws-2', lineId: 'line-2', code: 'M-CNC-5AX', nameEn: 'DMG Mori 5-Axis Center', nameAr: 'مركز تشغيل خماسي المحاور DMG Mori', model: 'DMU 75 monoBLOCK', idealCycleTimeSec: 20, status: 'running' },
  { id: 'm-3', factoryId: 'fac-1', workshopId: 'ws-3', lineId: 'line-3', code: 'M-ROB-ASSY', nameEn: 'Kuka Assembly Robot K1', nameAr: 'روبوت تجميع كوكا K1', model: 'KR CYBERTECH', idealCycleTimeSec: 11, status: 'running' },
  { id: 'm-4', factoryId: 'fac-2', workshopId: 'ws-4', lineId: 'line-4', code: 'M-WLD-ROB', nameEn: 'Fanuc Arc Welding Station', nameAr: 'محطة لحام فانووك بالقوس الكهربائي', model: 'ARC Mate 120iD', idealCycleTimeSec: 30, status: 'down' },
  { id: 'm-5', factoryId: 'fac-2', workshopId: 'ws-5', lineId: 'line-5', code: 'M-INJ-500', nameEn: 'Engel Victory Injection Unit', nameAr: 'ماكينة حقن إنجل فيكتوري 500', model: 'V-500/120', idealCycleTimeSec: 6, status: 'running' },
  { id: 'm-6', factoryId: 'fac-3', workshopId: 'ws-6', lineId: 'line-6', code: 'M-PNT-BOOTH', nameEn: 'Robotic Spray Booth System', nameAr: 'كابينة الرش والدهان الروبوتية', model: 'Nordson ColorMax3', idealCycleTimeSec: 13, status: 'maintenance' }
];

export const mockProducts: Product[] = [
  { id: 'prod-1', code: 'PRD-VLV-401', nameEn: 'High Pressure Control Valve 4"', nameAr: 'صمام تحكم عالي الضغط 4 بوصة', category: 'Flow Controls', unit: 'pcs', standardCost: 145, salePrice: 280, standardCycleTimeSec: 24 },
  { id: 'prod-2', code: 'PRD-ACT-102', nameEn: 'Dual-Stage Hydraulic Actuator', nameAr: 'مشغل هيدروليكي ثنائي المراحل', category: 'Hydraulics', unit: 'pcs', standardCost: 220, salePrice: 450, standardCycleTimeSec: 35 },
  { id: 'prod-3', code: 'PRD-ENC-88', nameEn: 'IP67 Sealed Telematics Enclosure', nameAr: 'غلاف إلكتروني محكم بمعيار IP67', category: 'Electronics Enclosures', unit: 'pcs', standardCost: 45, salePrice: 95, standardCycleTimeSec: 12 },
  { id: 'prod-4', code: 'PRD-CHS-90', nameEn: 'Reinforced Subframe Assembly', nameAr: 'شاسيه فرعي مقوى للسيارات', category: 'Automotive Structural', unit: 'pcs', standardCost: 310, salePrice: 620, standardCycleTimeSec: 55 },
  { id: 'prod-5', code: 'PRD-PMP-55', nameEn: 'Heavy Duty Slurry Pump Casing', nameAr: 'غطاء مضخة مياه وطمي صناعية', category: 'Heavy Industrial', unit: 'pcs', standardCost: 510, salePrice: 990, standardCycleTimeSec: 75 }
];

export const mockProductionEntries: ProductionEntry[] = [
  {
    id: 'pe-101',
    date: '2026-10-07',
    factoryId: 'fac-1',
    workshopId: 'ws-1',
    lineId: 'line-1',
    machineId: 'm-1',
    productId: 'prod-1',
    workOrderId: 'wo-101',
    shift: 'Shift 1 (Morning)',
    operator: 'Mahmoud Saber',
    plannedQty: 1800,
    producedQty: 1720,
    goodQty: 1685,
    scrapQty: 35,
    plannedHours: 8,
    actualHours: 7.5,
    downtimeHours: 0.5,
    remarks: 'Minor coil feeder adjustment at start; good overall throughput.',
    achievementPercent: 95.56,
    qualityPercent: 97.97,
    scrapPercent: 2.03,
    efficiencyPercent: 96.7
  },
  {
    id: 'pe-102',
    date: '2026-10-07',
    factoryId: 'fac-1',
    workshopId: 'ws-2',
    lineId: 'line-2',
    machineId: 'm-2',
    productId: 'prod-2',
    workOrderId: 'wo-102',
    shift: 'Shift 1 (Morning)',
    operator: 'Ahmed Radwan',
    plannedQty: 720,
    producedQty: 700,
    goodQty: 686,
    scrapQty: 14,
    plannedHours: 8,
    actualHours: 7.8,
    downtimeHours: 0.2,
    remarks: 'Tool wear detected on finisher tool T4; replaced smoothly.',
    achievementPercent: 97.22,
    qualityPercent: 98.0,
    scrapPercent: 2.0,
    efficiencyPercent: 98.1
  },
  {
    id: 'pe-103',
    date: '2026-10-06',
    factoryId: 'fac-2',
    workshopId: 'ws-4',
    lineId: 'line-4',
    machineId: 'm-4',
    productId: 'prod-4',
    workOrderId: 'wo-103',
    shift: 'Shift 2 (Evening)',
    operator: 'Ibrahim Farag',
    plannedQty: 480,
    producedQty: 360,
    goodQty: 338,
    scrapQty: 22,
    plannedHours: 8,
    actualHours: 5.6,
    downtimeHours: 2.4,
    remarks: 'Wire feed motor stalled due to spool tangle; maintenance assisted.',
    achievementPercent: 75.0,
    qualityPercent: 93.89,
    scrapPercent: 6.11,
    efficiencyPercent: 71.2
  },
  {
    id: 'pe-104',
    date: '2026-10-06',
    factoryId: 'fac-2',
    workshopId: 'ws-5',
    lineId: 'line-5',
    machineId: 'm-5',
    productId: 'prod-3',
    workOrderId: 'wo-104',
    shift: 'Shift 1 (Morning)',
    operator: 'Mostafa Kamel',
    plannedQty: 2400,
    producedQty: 2420,
    goodQty: 2390,
    scrapQty: 30,
    plannedHours: 8,
    actualHours: 8.0,
    downtimeHours: 0.0,
    remarks: 'Exceeded target slightly. Mold cooling parameters well balanced.',
    achievementPercent: 100.83,
    qualityPercent: 98.76,
    scrapPercent: 1.24,
    efficiencyPercent: 99.4
  },
  {
    id: 'pe-105',
    date: '2026-10-05',
    factoryId: 'fac-3',
    workshopId: 'ws-6',
    lineId: 'line-6',
    machineId: 'm-6',
    productId: 'prod-1',
    workOrderId: 'wo-105',
    shift: 'Shift 3 (Night)',
    operator: 'Hassan Nabil',
    plannedQty: 1100,
    producedQty: 990,
    goodQty: 955,
    scrapQty: 35,
    plannedHours: 8,
    actualHours: 7.2,
    downtimeHours: 0.8,
    remarks: 'Paint booth filter pressure drop alarm required quick cartridge cleaning.',
    achievementPercent: 90.0,
    qualityPercent: 96.46,
    scrapPercent: 3.54,
    efficiencyPercent: 91.5
  },
  {
    id: 'pe-106',
    date: '2026-10-05',
    factoryId: 'fac-1',
    workshopId: 'ws-3',
    lineId: 'line-3',
    machineId: 'm-3',
    productId: 'prod-2',
    workOrderId: 'wo-106',
    shift: 'Shift 1 (Morning)',
    operator: 'Youssef Adel',
    plannedQty: 1250,
    producedQty: 1240,
    goodQty: 1222,
    scrapQty: 18,
    plannedHours: 8,
    actualHours: 7.9,
    downtimeHours: 0.1,
    remarks: 'Smooth run across line 3. High yield.',
    achievementPercent: 99.2,
    qualityPercent: 98.55,
    scrapPercent: 1.45,
    efficiencyPercent: 98.9
  }
];

export const mockWorkOrders: WorkOrder[] = [
  {
    id: 'wo-101',
    orderNumber: 'WO-2026-1049',
    factoryId: 'fac-1',
    lineId: 'line-1',
    productId: 'prod-1',
    plannedQty: 10000,
    completedQty: 8400,
    scrapQty: 190,
    startDate: '2026-10-01',
    dueDate: '2026-10-10',
    status: 'In Production',
    priority: 'High',
    delayDays: 0,
    assignedTeam: 'Alpha Line Crew'
  },
  {
    id: 'wo-102',
    orderNumber: 'WO-2026-1052',
    factoryId: 'fac-1',
    lineId: 'line-2',
    productId: 'prod-2',
    plannedQty: 4500,
    completedQty: 4100,
    scrapQty: 75,
    startDate: '2026-10-02',
    dueDate: '2026-10-09',
    status: 'In Production',
    priority: 'Medium',
    delayDays: 0,
    assignedTeam: 'CNC Precision Team 2'
  },
  {
    id: 'wo-103',
    orderNumber: 'WO-2026-1038',
    factoryId: 'fac-2',
    lineId: 'line-4',
    productId: 'prod-4',
    plannedQty: 2500,
    completedQty: 1100,
    scrapQty: 95,
    startDate: '2026-09-28',
    dueDate: '2026-10-05',
    status: 'Critical Late',
    priority: 'Critical',
    delayDays: 4,
    assignedTeam: 'Alexandria Heavy Welder Unit'
  },
  {
    id: 'wo-104',
    orderNumber: 'WO-2026-1058',
    factoryId: 'fac-2',
    lineId: 'line-5',
    productId: 'prod-3',
    plannedQty: 15000,
    completedQty: 15200,
    scrapQty: 180,
    startDate: '2026-10-03',
    dueDate: '2026-10-07',
    status: 'Completed',
    priority: 'High',
    delayDays: 0,
    assignedTeam: 'Polymer Operations Team'
  },
  {
    id: 'wo-105',
    orderNumber: 'WO-2026-1061',
    factoryId: 'fac-3',
    lineId: 'line-6',
    productId: 'prod-1',
    plannedQty: 3200,
    completedQty: 990,
    scrapQty: 35,
    startDate: '2026-10-05',
    dueDate: '2026-10-08',
    status: 'Late',
    priority: 'Medium',
    delayDays: 2,
    assignedTeam: 'Finishing Operations 6th Oct'
  },
  {
    id: 'wo-106',
    orderNumber: 'WO-2026-1070',
    factoryId: 'fac-1',
    lineId: 'line-3',
    productId: 'prod-2',
    plannedQty: 5000,
    completedQty: 0,
    scrapQty: 0,
    startDate: '2026-10-09',
    dueDate: '2026-10-18',
    status: 'Planned',
    priority: 'High',
    delayDays: 0,
    assignedTeam: 'Assembly Group 1'
  }
];

export const mockDowntimeRecords: DowntimeRecord[] = [
  {
    id: 'dt-201',
    date: '2026-10-07',
    factoryId: 'fac-2',
    workshopId: 'ws-4',
    lineId: 'line-4',
    machineId: 'm-4',
    workOrderId: 'wo-103',
    category: 'Electrical',
    durationMinutes: 144,
    rootCause: 'Short circuit in welding wire feed servo drive cable',
    actionTaken: 'Replaced cable harness and recalibrated servo drive parameter',
    technician: 'Eng. Amr Zaki',
    isResolved: true
  },
  {
    id: 'dt-202',
    date: '2026-10-07',
    factoryId: 'fac-1',
    workshopId: 'ws-1',
    lineId: 'line-1',
    machineId: 'm-1',
    workOrderId: 'wo-101',
    category: 'Mechanical',
    durationMinutes: 30,
    rootCause: 'Hydraulic pressure drop in upper ram safety clamp',
    actionTaken: 'Tightened hydraulic seal valve and bled air pocket',
    technician: 'Sameh Fawzy',
    isResolved: true
  },
  {
    id: 'dt-203',
    date: '2026-10-06',
    factoryId: 'fac-1',
    workshopId: 'ws-2',
    lineId: 'line-2',
    machineId: 'm-2',
    workOrderId: 'wo-102',
    category: 'Tooling',
    durationMinutes: 45,
    rootCause: 'Carbide insert micro-fracture during high-feed milling',
    actionTaken: 'Installed new Sandvik indexable milling insert and reset zero datum',
    technician: 'Ahmed Radwan',
    isResolved: true
  },
  {
    id: 'dt-204',
    date: '2026-10-05',
    factoryId: 'fac-3',
    workshopId: 'ws-6',
    lineId: 'line-6',
    machineId: 'm-6',
    workOrderId: 'wo-105',
    category: 'Planned PM',
    durationMinutes: 60,
    rootCause: 'Scheduled weekly filter purge and nozzle fluid ultrasonic rinse',
    actionTaken: 'Replaced inline filter media and flushed fluid lines',
    technician: 'Karim Ezzat',
    isResolved: true
  },
  {
    id: 'dt-205',
    date: '2026-10-04',
    factoryId: 'fac-2',
    workshopId: 'ws-4',
    lineId: 'line-4',
    machineId: 'm-4',
    workOrderId: 'wo-103',
    category: 'No Material',
    durationMinutes: 90,
    rootCause: 'Delay in delivery of heavy steel plate raw material from warehouse',
    actionTaken: 'Expedited internal forklift transport and notified logistics lead',
    technician: 'Logistics Liaison',
    isResolved: true
  }
];

export const mockMaintenanceTasks: MaintenanceTask[] = [
  {
    id: 'mt-301',
    taskCode: 'PM-2026-041',
    machineId: 'm-1',
    factoryId: 'fac-1',
    type: 'Preventive (PM)',
    titleEn: 'Monthly 500-hour Hydraulic Fluid & Filter Analysis',
    titleAr: 'فحص وتحليل الزيت والفلاتر الهيدروليكية الدوري لـ 500 ساعة',
    scheduledDate: '2026-10-12',
    technician: 'Sameh Fawzy',
    status: 'Scheduled',
    durationHours: 3.5,
    sparePartsCost: 380,
    laborCost: 150,
    priority: 'High'
  },
  {
    id: 'mt-302',
    taskCode: 'CORR-2026-088',
    machineId: 'm-4',
    factoryId: 'fac-2',
    type: 'Corrective (Breakdown)',
    titleEn: 'Arc Welding Gun Wire Feeder Overhaul',
    titleAr: 'صيانة وإصلاح منظومة تغذية السلك لروبوت اللحام',
    scheduledDate: '2026-10-07',
    completedDate: '2026-10-07',
    technician: 'Eng. Amr Zaki',
    status: 'Completed',
    durationHours: 2.4,
    sparePartsCost: 520,
    laborCost: 200,
    priority: 'Critical'
  },
  {
    id: 'mt-303',
    taskCode: 'PM-2026-039',
    machineId: 'm-2',
    factoryId: 'fac-1',
    type: 'Preventive (PM)',
    titleEn: '5-Axis Spindle Vibration Spectrum & Thermal Run-in',
    titleAr: 'فحص اهتزازات المغزل واختبار الاتزان الحراري لمحور الدوران',
    scheduledDate: '2026-10-05',
    completedDate: '2026-10-05',
    technician: 'Eng. Hazem Shawky',
    status: 'Completed',
    durationHours: 4.0,
    sparePartsCost: 120,
    laborCost: 280,
    priority: 'Medium'
  },
  {
    id: 'mt-304',
    taskCode: 'PM-2026-035',
    machineId: 'm-6',
    factoryId: 'fac-3',
    type: 'Preventive (PM)',
    titleEn: 'Electrostatic Paint Booth High-Voltage Cascade Calibration',
    titleAr: 'معايرة مولدات الجهد العالي لكابينة الدهان الكهروستاتيكي',
    scheduledDate: '2026-10-04',
    technician: 'Karim Ezzat',
    status: 'Overdue',
    durationHours: 2.0,
    sparePartsCost: 0,
    laborCost: 120,
    priority: 'High'
  }
];

export const mockInventoryItems: InventoryItem[] = [
  // Raw materials
  {
    id: 'inv-1',
    sku: 'RM-STEEL-4140',
    nameEn: 'Alloy Steel Bar Stock AISI 4140 (Dia 80mm)',
    nameAr: 'قضبان صلب سبائكي عالي الصلادة 4140 قطر 80 مم',
    category: 'Raw Material',
    factoryId: 'fac-1',
    warehouseBin: 'BAY-A-04-12',
    unit: 'kg',
    currentStock: 14200,
    minStock: 5000,
    maxStock: 25000,
    unitCost: 3.45,
    status: 'Normal',
    lastRestocked: '2026-10-01'
  },
  {
    id: 'inv-2',
    sku: 'RM-POLY-PA66',
    nameEn: 'Polyamide Resin Pellets PA66-GF30 (Glass Filled)',
    nameAr: 'حبيبات بولي أميد مقواة بالألياف الزجاجية PA66-GF30',
    category: 'Raw Material',
    factoryId: 'fac-2',
    warehouseBin: 'BAY-C-01-08',
    unit: 'kg',
    currentStock: 1850,
    minStock: 2500,
    maxStock: 12000,
    unitCost: 4.80,
    status: 'Below Min',
    lastRestocked: '2026-09-22'
  },
  {
    id: 'inv-3',
    sku: 'RM-ALUM-6061',
    nameEn: 'Aluminum Billet 6061-T6 Extrusion Grade',
    nameAr: 'سبائك ألومنيوم فئة 6061-T6 للسحب والتشغيل',
    category: 'Raw Material',
    factoryId: 'fac-1',
    warehouseBin: 'BAY-A-02-15',
    unit: 'kg',
    currentStock: 0,
    minStock: 3000,
    maxStock: 15000,
    unitCost: 5.10,
    status: 'Stockout',
    lastRestocked: '2026-09-15'
  },
  // MRO / Spares
  {
    id: 'inv-4',
    sku: 'MRO-BRG-7210',
    nameEn: 'SKF Angular Contact Ball Bearing 7210 BECBM',
    nameAr: 'رولمان بلي تلامس زاوي ماركة SKF طراز 7210',
    category: 'MRO / Spare Part',
    factoryId: 'fac-1',
    warehouseBin: 'MRO-RACK-03-B',
    unit: 'pcs',
    currentStock: 6,
    minStock: 4,
    maxStock: 20,
    unitCost: 185.0,
    status: 'Normal',
    lastRestocked: '2026-09-29'
  },
  {
    id: 'inv-5',
    sku: 'MRO-SEAL-HYD-80',
    nameEn: 'High Pressure Polyurethane Piston Seal Kit 80mm',
    nameAr: 'طقم جوان وحشوات بيستم هيدروليكي بولي يوريثان 80 مم',
    category: 'MRO / Spare Part',
    factoryId: 'fac-2',
    warehouseBin: 'MRO-RACK-01-E',
    unit: 'sets',
    currentStock: 1,
    minStock: 5,
    maxStock: 15,
    unitCost: 65.0,
    status: 'Below Min',
    lastRestocked: '2026-08-30'
  },
  {
    id: 'inv-6',
    sku: 'MRO-PLC-MOD-16DI',
    nameEn: 'Siemens SIMATIC S7-1500 16-ch Digital Input Module',
    nameAr: 'وحدة دخل رقمي 16 قناة سيمنز سيماتيك S7-1500',
    category: 'MRO / Spare Part',
    factoryId: 'fac-3',
    warehouseBin: 'MRO-ELEC-02-A',
    unit: 'pcs',
    currentStock: 12,
    minStock: 3,
    maxStock: 6,
    unitCost: 410.0,
    status: 'Excess',
    lastRestocked: '2026-09-10'
  },
  // Finished Goods
  {
    id: 'inv-7',
    sku: 'FG-VLV-401-A',
    nameEn: 'Finished High Pressure Valve 4" (Tested & Packaged)',
    nameAr: 'صمام تحكم هيدروليكي 4 بوصة منتج تام ومختبر',
    category: 'Finished Goods',
    factoryId: 'fac-1',
    warehouseBin: 'FG-WH-01-A1',
    unit: 'pcs',
    currentStock: 2840,
    minStock: 1000,
    maxStock: 5000,
    unitCost: 145.0,
    status: 'Normal',
    lastRestocked: '2026-10-07'
  },
  {
    id: 'inv-8',
    sku: 'FG-ACT-102-STD',
    nameEn: 'Dual-Stage Hydraulic Actuator - Stock Lot',
    nameAr: 'مشغل هيدروليكي ثنائي المراحل - جاهز للشحن',
    category: 'Finished Goods',
    factoryId: 'fac-1',
    warehouseBin: 'FG-WH-02-B4',
    unit: 'pcs',
    currentStock: 1120,
    minStock: 400,
    maxStock: 2500,
    unitCost: 220.0,
    status: 'Normal',
    lastRestocked: '2026-10-06'
  },
  {
    id: 'inv-9',
    sku: 'FG-ENC-88-IP67',
    nameEn: 'Telematics Enclosure IP67 Assembled Units',
    nameAr: 'أغلفة إلكترونية مجمعة مقاومة للماء معتمدة',
    category: 'Finished Goods',
    factoryId: 'fac-2',
    warehouseBin: 'FG-WH-03-C2',
    unit: 'pcs',
    currentStock: 6450,
    minStock: 2000,
    maxStock: 10000,
    unitCost: 45.0,
    status: 'Normal',
    lastRestocked: '2026-10-07'
  }
];

export const mockMaterialConsumptions: MaterialConsumption[] = [
  {
    id: 'mc-1',
    date: '2026-10-07',
    workOrderId: 'wo-101',
    rawMaterialSku: 'RM-STEEL-4140',
    rawMaterialName: 'Alloy Steel Bar Stock AISI 4140',
    factoryId: 'fac-1',
    plannedConsumption: 5400,
    actualConsumption: 5520,
    varianceQty: 120,
    variancePercent: 2.22,
    unit: 'kg',
    scrapMaterialQty: 115
  },
  {
    id: 'mc-2',
    date: '2026-10-07',
    workOrderId: 'wo-102',
    rawMaterialSku: 'RM-ALUM-6061',
    rawMaterialName: 'Aluminum Billet 6061-T6 Extrusion',
    factoryId: 'fac-1',
    plannedConsumption: 2160,
    actualConsumption: 2145,
    varianceQty: -15,
    variancePercent: -0.69,
    unit: 'kg',
    scrapMaterialQty: 42
  },
  {
    id: 'mc-3',
    date: '2026-10-06',
    workOrderId: 'wo-104',
    rawMaterialSku: 'RM-POLY-PA66',
    rawMaterialName: 'Polyamide Resin Pellets PA66-GF30',
    factoryId: 'fac-2',
    plannedConsumption: 3600,
    actualConsumption: 3740,
    varianceQty: 140,
    variancePercent: 3.88,
    unit: 'kg',
    scrapMaterialQty: 48
  }
];

export const mockBOMItems: BOMItem[] = [
  // Valve 4" BOM
  { id: 'bom-1', parentProductId: 'prod-1', componentSku: 'RM-STEEL-4140', componentName: 'Forged Valve Body Casting', quantityPerUnit: 1, unit: 'pcs', unitCost: 65, totalCost: 65, leadTimeDays: 7 },
  { id: 'bom-2', parentProductId: 'prod-1', componentSku: 'COMP-ST-STEM', componentName: 'Stainless Steel 316 Stem', quantityPerUnit: 1, unit: 'pcs', unitCost: 28, totalCost: 28, leadTimeDays: 4 },
  { id: 'bom-3', parentProductId: 'prod-1', componentSku: 'MRO-SEAL-HYD-80', componentName: 'Fluoropolymer Dual Seal Ring', quantityPerUnit: 2, unit: 'pcs', unitCost: 12, totalCost: 24, leadTimeDays: 3 },
  { id: 'bom-4', parentProductId: 'prod-1', componentSku: 'HDW-BOLT-M12', componentName: 'Grade 10.9 Zinc Plated Flange Bolts', quantityPerUnit: 8, unit: 'pcs', unitCost: 1.5, totalCost: 12, leadTimeDays: 1 },
  { id: 'bom-5', parentProductId: 'prod-1', componentSku: 'SUB-ACTUATOR', componentName: 'Pneumatic Positioner Assembly', quantityPerUnit: 1, unit: 'pcs', unitCost: 16, totalCost: 16, leadTimeDays: 5, isSubAssembly: true },
  
  // Actuator BOM
  { id: 'bom-6', parentProductId: 'prod-2', componentSku: 'RM-ALUM-6061', componentName: 'Precision Cylinder Barrel Extrusion', quantityPerUnit: 1, unit: 'pcs', unitCost: 95, totalCost: 95, leadTimeDays: 6 },
  { id: 'bom-7', parentProductId: 'prod-2', componentSku: 'COMP-CHROME-ROD', componentName: 'Hard Chrome Plated Piston Rod', quantityPerUnit: 1, unit: 'pcs', unitCost: 68, totalCost: 68, leadTimeDays: 8 },
  { id: 'bom-8', parentProductId: 'prod-2', componentSku: 'COMP-HEAD-CAP', componentName: 'Ductile Iron End Cap', quantityPerUnit: 2, unit: 'pcs', unitCost: 24, totalCost: 48, leadTimeDays: 5 },
  { id: 'bom-9', parentProductId: 'prod-2', componentSku: 'HDW-O-RING-SET', componentName: 'Viton High Temp O-Ring Kit', quantityPerUnit: 1, unit: 'kit', unitCost: 9, totalCost: 9, leadTimeDays: 2 }
];

export const mockRoutingSteps: RoutingStep[] = [
  // Valve 4" Routing
  { id: 'rt-1', productId: 'prod-1', stepNumber: 10, operationEn: 'Rough Turning & Bore Face', operationAr: 'خراطة وتفريغ أولي للسطح الداخلي', workshopId: 'ws-2', machineType: 'CNC Lathe', setupTimeMin: 30, cycleTimeSec: 180, laborWorkers: 1 },
  { id: 'rt-2', productId: 'prod-1', stepNumber: 20, operationEn: '5-Axis Flange Hole Drilling & Threading', operationAr: 'تخريم وقلوظة ثقوب الفلانشات خماسي المحاور', workshopId: 'ws-2', machineType: '5-Axis Machining Center', setupTimeMin: 45, cycleTimeSec: 240, laborWorkers: 1 },
  { id: 'rt-3', productId: 'prod-1', stepNumber: 30, operationEn: 'Stem & Seat Lapping / Grinding', operationAr: 'تجليخ ومطابقة مقعد وساق الصمام', workshopId: 'ws-2', machineType: 'Lapping Machine', setupTimeMin: 20, cycleTimeSec: 120, laborWorkers: 1 },
  { id: 'rt-4', productId: 'prod-1', stepNumber: 40, operationEn: 'Subassembly & Torque Fastening', operationAr: 'تجميع المكونات والربط بعزم محدد', workshopId: 'ws-3', machineType: 'Assembly Station', setupTimeMin: 15, cycleTimeSec: 90, laborWorkers: 2 },
  { id: 'rt-5', productId: 'prod-1', stepNumber: 50, operationEn: 'Hydrostatic Pressure & Leak Test (600 PSI)', operationAr: 'اختبار الضغط الهيدروستاتيكي والتسريب', workshopId: 'ws-3', machineType: 'Test Rig', setupTimeMin: 10, cycleTimeSec: 150, laborWorkers: 1 },
  { id: 'rt-6', productId: 'prod-1', stepNumber: 60, operationEn: 'Surface Powder Paint & Laser Marking', operationAr: 'طلاء بودرة الفرن والتعليم بالليزر', workshopId: 'ws-6', machineType: 'Paint & Marking Line', setupTimeMin: 25, cycleTimeSec: 60, laborWorkers: 1 }
];

export const mockQualityInspections: QualityInspection[] = [
  { id: 'qi-1', inspectionNo: 'QC-2026-0912', date: '2026-10-07', workOrderId: 'wo-101', productId: 'prod-1', factoryId: 'fac-1', sampleSize: 120, defectsCount: 2, defectType: 'Dimensional', fpyPercent: 98.33, status: 'Passed', inspector: 'Eng. Mona Samir' },
  { id: 'qi-2', inspectionNo: 'QC-2026-0913', date: '2026-10-07', workOrderId: 'wo-102', productId: 'prod-2', factoryId: 'fac-1', sampleSize: 80, defectsCount: 1, defectType: 'Surface Scratch', fpyPercent: 98.75, status: 'Passed', inspector: 'Eng. Mona Samir' },
  { id: 'qi-3', inspectionNo: 'QC-2026-0908', date: '2026-10-06', workOrderId: 'wo-103', productId: 'prod-4', factoryId: 'fac-2', sampleSize: 50, defectsCount: 8, defectType: 'Weld Porosity', fpyPercent: 84.00, status: 'Quarantined', inspector: 'Hossam El-Din' },
  { id: 'qi-4', inspectionNo: 'QC-2026-0905', date: '2026-10-05', workOrderId: 'wo-104', productId: 'prod-3', factoryId: 'fac-2', sampleSize: 200, defectsCount: 3, defectType: 'Assembly Fit', fpyPercent: 98.50, status: 'Passed', inspector: 'Hossam El-Din' },
  { id: 'qi-5', inspectionNo: 'QC-2026-0901', date: '2026-10-04', workOrderId: 'wo-105', productId: 'prod-1', factoryId: 'fac-3', sampleSize: 90, defectsCount: 4, defectType: 'Color Mismatch', fpyPercent: 95.55, status: 'Reworked', inspector: 'Dalia Fekry' }
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  { id: 'po-1', poNumber: 'PO-2026-801', supplierName: 'Suez Steel Industries Co.', factoryId: 'fac-1', orderDate: '2026-10-01', expectedDate: '2026-10-12', totalAmount: 48300, currency: 'USD', status: 'Partially Received', itemCount: 4 },
  { id: 'po-2', poNumber: 'PO-2026-802', supplierName: 'SABIC Polymers Middle East', factoryId: 'fac-2', orderDate: '2026-10-03', expectedDate: '2026-10-15', totalAmount: 32600, currency: 'USD', status: 'Sent', itemCount: 2 },
  { id: 'po-3', poNumber: 'PO-2026-799', supplierName: 'SKF Bearings Middle East Distribution', factoryId: 'fac-1', orderDate: '2026-09-25', expectedDate: '2026-10-04', totalAmount: 14200, currency: 'USD', status: 'Received', itemCount: 6 },
  { id: 'po-4', poNumber: 'PO-2026-805', supplierName: 'Egypt Aluminum (EgyptAlum)', factoryId: 'fac-1', orderDate: '2026-10-05', expectedDate: '2026-10-18', totalAmount: 61200, currency: 'USD', status: 'Sent', itemCount: 3 }
];

export const mockAlerts: AlertNotification[] = [
  {
    id: 'alt-1',
    timestamp: '2026-10-07 14:20',
    titleEn: 'Critical Work Order Delay: Subframe Chassis Assembly',
    titleAr: 'تأخير حرج في أمر الشغل: شاسيه فرعي مقوى',
    messageEn: 'Order WO-2026-1038 in Alexandria Complex is 4 days delayed. Robotic welder M-WLD-ROB downtime impacted output.',
    messageAr: 'أمر الشغل WO-2026-1038 بمجمع الإسكندرية متأخر 4 أيام نتيجة تعطل روبوت اللحام M-WLD-ROB.',
    severity: 'critical',
    category: 'WorkOrder',
    factoryId: 'fac-2',
    isRead: false,
    linkPage: 'workOrders'
  },
  {
    id: 'alt-2',
    timestamp: '2026-10-07 11:05',
    titleEn: 'Stockout Alert: Aluminum Billet 6061-T6 Extrusion',
    titleAr: 'تنبيه نفاد مخزون: سبائك ألومنيوم 6061-T6',
    messageEn: 'Current inventory is 0 kg. Minimum threshold is 3,000 kg. PO-2026-805 expected in 11 days.',
    messageAr: 'الرصيد الفعلي للمادة 0 كجم بينما الحد الأدنى 3,000 كجم. أمر الشراء PO-2026-805 متوقع بعد 11 يوماً.',
    severity: 'critical',
    category: 'Stock',
    factoryId: 'fac-1',
    isRead: false,
    linkPage: 'rawMaterials'
  },
  {
    id: 'alt-3',
    timestamp: '2026-10-07 09:30',
    titleEn: 'High Scrap Variance in Robotic Welding Cell',
    titleAr: 'ارتفاع معدل الهالك في خلية اللحام الآلي',
    messageEn: 'Scrap rate reached 6.11% on Line 4 (Target max: 2.0%). Quality quarantine initiated for batch QC-2026-0908.',
    messageAr: 'ارتفعت نسبة الهالك إلى 6.11% على الخط 4 (الهدف ألا تزيد عن 2.0%). تم حجز التشغيلة QC-2026-0908.',
    severity: 'warning',
    category: 'Quality',
    factoryId: 'fac-2',
    isRead: false,
    linkPage: 'quality'
  },
  {
    id: 'alt-4',
    timestamp: '2026-10-06 17:15',
    titleEn: 'Preventive Maintenance Overdue: Paint High-Voltage Cascade',
    titleAr: 'تجاوز موعد الصيانة الوقائية: كابينة الدهان الكهروستاتيكي',
    messageEn: 'PM-2026-035 for machine M-PNT-BOOTH in 6th Oct Facility is 3 days past scheduled date.',
    messageAr: 'مهمة الصيانة PM-2026-035 للماكينة M-PNT-BOOTH بمنشأة 6 أكتوبر متأخرة 3 أيام عن الموعد.',
    severity: 'warning',
    category: 'Downtime',
    factoryId: 'fac-3',
    isRead: true,
    linkPage: 'maintenance'
  }
];
