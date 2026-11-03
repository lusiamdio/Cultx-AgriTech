import type {
  AIRecommendation,
  CommodityPrice,
  FarmerDocument,
  Farm,
  FinancingProduct,
  LogisticsRoute,
  MarketListing,
  NotificationItem,
  PurchaseContract,
  SensorTelemetryAlert,
  SoilSensorNode,
  Warehouse,
} from "../types";

export const INITIAL_FARMS: Farm[] = [
  {
    id: "farm-001", name: "Kakuzi Agro Smallholders", ownerName: "James Banda", country: "Kenya", region: "Nakuru County",
    totalHectares: 42, primaryCrop: "Maize", overallHealthScore: 86, soilHealth: 78, cropHealth: 84,
    waterIndex: 72, weatherRisk: 18, pestRisk: 12, expectedYieldTonnesPerHa: 5.2,
    fields: [
      { id: "field-01", name: "North Maize Block", crop: "Maize", areaHa: 18, health: "Good", ndviScore: 0.78, soilMoisture: 38, nitrogenStatus: "Optimal", coordinates: [[0, 0], [1, 0], [1, 1], [0, 1]] },
      { id: "field-02", name: "East Rotation Block", crop: "Soybeans", areaHa: 12, health: "Excellent", ndviScore: 0.84, soilMoisture: 42, nitrogenStatus: "Optimal", coordinates: [[0, 0], [1, 0], [1, 1], [0, 1]] },
      { id: "field-03", name: "River Valley Plot", crop: "Maize", areaHa: 12, health: "Moderate", ndviScore: 0.69, soilMoisture: 28, nitrogenStatus: "Deficient", coordinates: [[0, 0], [1, 0], [1, 1], [0, 1]], alerts: ["Soil moisture below target"] },
    ],
    sensorsOnline: 18, lastSatellitePass: "2026-10-30", verifiedStatus: "verified", trustScore: 4.8,
  },
  {
    id: "farm-002", name: "Amani Farms", ownerName: "Amani Wanjiku", country: "Kenya", region: "Rift Valley",
    totalHectares: 26, primaryCrop: "Avocado", overallHealthScore: 91, soilHealth: 82, cropHealth: 90,
    waterIndex: 80, weatherRisk: 14, pestRisk: 9, expectedYieldTonnesPerHa: 4.1,
    fields: [{ id: "field-04", name: "Highland Orchard", crop: "Avocado", areaHa: 26, health: "Excellent", ndviScore: 0.82, soilMoisture: 44, nitrogenStatus: "Optimal", coordinates: [[0, 0], [1, 0], [1, 1], [0, 1]] }],
    sensorsOnline: 12, lastSatellitePass: "2026-10-29", verifiedStatus: "verified", trustScore: 4.6,
  },
  {
    id: "farm-003", name: "Baraka Outgrowers", ownerName: "Baraka Mwangi", country: "Kenya", region: "Eldoret",
    totalHectares: 58, primaryCrop: "Wheat", overallHealthScore: 79, soilHealth: 74, cropHealth: 80,
    waterIndex: 68, weatherRisk: 24, pestRisk: 15, expectedYieldTonnesPerHa: 3.8,
    fields: [{ id: "field-05", name: "Western Wheat Block", crop: "Wheat", areaHa: 58, health: "Good", ndviScore: 0.73, soilMoisture: 36, nitrogenStatus: "Optimal", coordinates: [[0, 0], [1, 0], [1, 1], [0, 1]] }],
    sensorsOnline: 21, lastSatellitePass: "2026-10-28", verifiedStatus: "pending", trustScore: 4.2,
  },
];

export const INITIAL_AI_RECOMMENDATIONS: AIRecommendation[] = [
  { id: "rec-001", category: "Irrigation", title: "Prioritize Field 03 irrigation", description: "Soil moisture is below the target range in the River Valley Plot.", action: "Apply a measured irrigation cycle and recheck sensor readings.", urgency: "urgent", metricImpact: "Protect crop health" },
  { id: "rec-002", category: "Weather", title: "Review the next rainfall window", description: "Check local conditions before scheduling field operations.", action: "Review the climate dashboard.", urgency: "important" },
  { id: "rec-003", category: "Market", title: "Compare regional buyer offers", description: "Review current market information before listing produce.", action: "Open the marketplace.", urgency: "opportunity" },
];

export const PAN_AFRICAN_COMMODITY_PRICES: CommodityPrice[] = [
  { commodity: "White Maize", country: "South Africa", cityMarket: "SAFEX Johannesburg", pricePerTonne: 5420, currency: "ZAR", priceUSD: 298, dailyChangePct: 1.8, trend30Day: 6.4, volumeTradedTonnes: 14200, qualityGrade: "Grade 1 (Export)" },
  { commodity: "White Maize", country: "Kenya", cityMarket: "Nairobi / Nakuru Silo", pricePerTonne: 36400, currency: "KES", priceUSD: 280, dailyChangePct: 1.2, trend30Day: 4.8, volumeTradedTonnes: 6800, qualityGrade: "Grade 1 (Export)" },
  { commodity: "Grade 1 Arabica Coffee", country: "Ethiopia", cityMarket: "ECX Addis Ababa", pricePerTonne: 4650, currency: "USD", priceUSD: 4650, dailyChangePct: 2.4, trend30Day: 8.9, volumeTradedTonnes: 1850, qualityGrade: "Grade 1 (Export)" },
  { commodity: "Cocoa Beans", country: "Côte d'Ivoire", cityMarket: "Abidjan Exchange", pricePerTonne: 7820, currency: "USD", priceUSD: 7820, dailyChangePct: 4.2, trend30Day: 14.2, volumeTradedTonnes: 9400, qualityGrade: "Grade 1 (Export)" },
  { commodity: "Soybeans", country: "Zambia", cityMarket: "ZAMACE Lusaka", pricePerTonne: 284, currency: "USD", priceUSD: 284, dailyChangePct: 0.9, trend30Day: 3.1, volumeTradedTonnes: 4200, qualityGrade: "Standard Milling" },
];

export const INITIAL_MARKET_LISTINGS: MarketListing[] = [
  { id: "listing-001", sellerName: "James Banda", farmName: "Kakuzi Agro Smallholders", commodity: "White Maize", quantityTonnes: 45, qualityGrade: "Grade A", harvestDate: "2026-11-15", location: "Nakuru Silo Hub", country: "Kenya", minPricePerTonne: "36400 KES", verified: true, deliveryOptions: "Farm pickup or Nakuru depot" },
  { id: "listing-002", sellerName: "Amani Wanjiku", farmName: "Amani Farms", commodity: "Avocado", quantityTonnes: 12, qualityGrade: "Export Grade", harvestDate: "2026-11-20", location: "Rift Valley", country: "Kenya", minPricePerTonne: "2500 USD", verified: true, deliveryOptions: "Cold-chain collection" },
];

export const INITIAL_PURCHASE_CONTRACTS: PurchaseContract[] = [
  { id: "contract-001", contractNumber: "AGRI-CTR-2026-8812", buyerName: "Nile Milling & Grain", sellerName: "Kakuzi Agro Smallholders", commodity: "White Maize", quantityTonnes: 30, pricePerTonne: "280 USD", qualityStandard: "Grade 1, moisture below 12.5%", deliveryDate: "2026-11-30", deliveryLocation: "Nakuru Central Silo", paymentTerms: "Escrow on dispatch", status: "Under Review", aiRiskScore: 28, aiRisksIdentified: [] },
];

export const FINANCING_PRODUCTS: FinancingProduct[] = [
  { id: "finance-001", name: "Seasonal Input Facility", type: "Input Financing", provider: "Pan-African AgDev Bank", maxAmount: "$25,000", interestRateAnnual: "8.5%", tenureMonths: 9, eligibilityCriteria: ["Verified farm profile", "Seasonal production plan"], features: ["Flexible seasonal repayment", "Digital application"] },
  { id: "finance-002", name: "Warehouse Receipt Advance", type: "Inventory Finance", provider: "Continental Cooperative Finance", maxAmount: "$50,000", interestRateAnnual: "7.2%", tenureMonths: 6, eligibilityCriteria: ["Certified warehouse receipt"], features: ["Produce-backed credit"] },
];

export const LOGISTICS_ROUTES: LogisticsRoute[] = [
  { id: "route-001", trackingNumber: "CULTX-KE-1042", carrier: "Savannah Cold Transit", origin: "Nakuru, Kenya", destination: "Mombasa, Kenya", cargo: "White Maize", volumeTonnes: 30, vehiclePlate: "KDA-482M", status: "In Transit", etaHours: 9, temperatureControlled: false, riskLevel: "Low", lat: -0.3, lng: 36.1, corridorName: "Northern Corridor", transitMode: "Road Freight" },
];

export const INITIAL_WAREHOUSES: Warehouse[] = [
  { id: "warehouse-001", name: "Nakuru Central Silo", city: "Nakuru", country: "Kenya", totalCapacityTonnes: 12000, utilizedTonnes: 8450, commoditiesStored: [{ commodity: "White Maize", tonnes: 6100 }, { commodity: "Wheat", tonnes: 2350 }], predictedDaysToCapacity: 18, certifiedReceiptEnabled: true },
  { id: "warehouse-002", name: "Eldoret Cooperative Depot", city: "Eldoret", country: "Kenya", totalCapacityTonnes: 8000, utilizedTonnes: 4200, commoditiesStored: [{ commodity: "Maize", tonnes: 2800 }, { commodity: "Soybeans", tonnes: 1400 }], predictedDaysToCapacity: 30, certifiedReceiptEnabled: true },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: "notif-001", type: "important", title: "Review Field 03 soil moisture", message: "A field sensor reported moisture below the preferred range.", timestamp: "10m ago", read: false, actionLabel: "View Field", targetView: "farms" },
  { id: "notif-002", type: "opportunity", title: "New regional buyer tender", message: "A buyer request is available for review in the marketplace.", timestamp: "1h ago", read: true, actionLabel: "Open Marketplace", targetView: "marketplace" },
];

export const INITIAL_FARMER_DOCUMENTS: FarmerDocument[] = [
  { id: "doc-001", farmId: "farm-001", title: "Farm Registration Certificate", category: "Certification", fileType: "pdf", fileSize: "1.2 MB", uploadDate: "2026-10-12", issuingAuthority: "County Agriculture Office", documentNumber: "KE-NAK-2048", sha256Hash: "demo-registration-hash", verificationStatus: "Verified", securityTier: "AES-256 Encrypted Vault", sharedWith: [], notes: "Farm profile supporting document." },
];

export const INITIAL_SOIL_NODES: SoilSensorNode[] = [
  {
    id: "node-001", nodeCode: "KE-NAK-001", fieldId: "field-03", fieldName: "River Valley Plot", coordinates: { lat: -0.303, lng: 36.08 },
    batteryPct: 88, signalRssi: -61, networkType: "LoRaWAN (868MHz)", lastPingSeconds: 12, status: "warning", activeIrrigationValve: false,
    depths: [
      { depthCm: 10, moisturePct: 28, temperatureC: 21, status: "Deficit" },
      { depthCm: 30, moisturePct: 34, temperatureC: 20, status: "Optimal" },
    ],
    nutrients: { nitrogenPpm: 34, nitrogenStatus: "Deficient", nitrogenTargetPpm: 45, phosphorusPpm: 28, phosphorusStatus: "Optimal", phosphorusTargetPpm: 25, potassiumPpm: 110, potassiumStatus: "Optimal", potassiumTargetPpm: 100, ph: 6.4, phStatus: "Optimal", ecMilliSiemens: 0.7, organicMatterPct: 3.2, microbialActivityScore: 78 },
    recentHistory: [
      { timestamp: "2026-11-02T08:00:00Z", moistureAvg: 31, nitrogenPpm: 35, temperatureC: 20, soilEc: 0.7 },
      { timestamp: "2026-11-02T12:00:00Z", moistureAvg: 28, nitrogenPpm: 34, temperatureC: 21, soilEc: 0.7 },
    ],
  },
];

export const INITIAL_SOIL_ALERTS: SensorTelemetryAlert[] = [
  { id: "alert-001", nodeId: "node-001", fieldName: "River Valley Plot", type: "moisture_deficit", severity: "warning", title: "Soil moisture below target", description: "The 10 cm reading is below the configured moisture target.", suggestedAction: "Review irrigation requirements for this field.", timestamp: "10m ago" },
];
