import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRole,
  ExperienceLevel,
  CountryConfig,
  Farm,
  AIRecommendation,
  CommodityPrice,
  MarketListing,
  PurchaseContract,
  FinancingProduct,
  LogisticsRoute,
  Warehouse,
  NotificationItem,
  SyncQueueItem,
  FarmerDocument,
  SoilSensorNode,
  SensorTelemetryAlert,
  AuthUser,
  CrossRoleSyncEvent,
} from "../types";
import { AFRICAN_COUNTRIES } from "../data/countries";
import { ROLE_CONFIGS, PRIMARY_ROLES, isViewAllowedForRole, getPrimaryViewForRole } from "../utils/rbac";
import { offlineStorage } from "../utils/indexedDbStorage";
import { performanceTelemetry } from "../utils/performanceMetrics";
import { offlineActivityLogger } from "../utils/offlineActivityLogger";
import {
  INITIAL_FARMS,
  INITIAL_AI_RECOMMENDATIONS,
  PAN_AFRICAN_COMMODITY_PRICES,
  INITIAL_MARKET_LISTINGS,
  INITIAL_PURCHASE_CONTRACTS,
  FINANCING_PRODUCTS,
  LOGISTICS_ROUTES,
  INITIAL_WAREHOUSES,
  INITIAL_NOTIFICATIONS,
  INITIAL_FARMER_DOCUMENTS,
  INITIAL_SOIL_NODES,
  INITIAL_SOIL_ALERTS,
} from "../data/mockData";

export interface DataConsentSettings {
  shareWithFinancialInstitutions: boolean;
  shareWithGovernmentPolicy: boolean;
  shareWithMarketplaceBuyers: boolean;
  allowSatelliteNdviAnalysis: boolean;
  shareWithLenders?: boolean;
  shareWithBuyers?: boolean;
  shareWithGovernment?: boolean;
  shareSatelliteNDVI?: boolean;
  retentionMonths: number;
}

interface AppContextType {
  // Navigation & Personas
  currentView: string;
  setCurrentView: (view: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  experienceLevel: ExperienceLevel;
  setExperienceLevel: (level: ExperienceLevel) => void;
  selectedCountry: CountryConfig;
  setSelectedCountry: (country: CountryConfig) => void;

  // Farm Data
  farms: Farm[];
  currentFarm: Farm;
  setCurrentFarm: (farm: Farm) => void;
  updateFarmFieldHealth: (farmId: string, fieldId: string, status: string) => void;

  // Agronomic Recommendations
  recommendations: AIRecommendation[];
  applyRecommendation: (id: string) => void;

  // Markets & Contracts
  commodityPrices: CommodityPrice[];
  marketPricesLastSync: string;
  isSyncingMarketPrices: boolean;
  refreshMarketPrices: (force?: boolean) => Promise<void>;
  marketListings: MarketListing[];
  addMarketListing: (listing: Omit<MarketListing, "id" | "verified">) => void;
  purchaseContracts: PurchaseContract[];
  addPurchaseContract: (contract: Omit<PurchaseContract, "id" | "status" | "contractNumber">) => void;

  // Finance & Logistics
  financingProducts: FinancingProduct[];
  logisticsRoutes: LogisticsRoute[];
  warehouses: Warehouse[];

  // Offline & Sync
  isOffline: boolean;
  toggleOfflineMode: () => void;
  syncQueue: SyncQueueItem[];
  triggerManualSync: () => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  unreadNotificationCount: number;
  addNotification: (notif: Omit<NotificationItem, "id"> | NotificationItem) => void;

  // Modals & Drawers
  isCropDoctorOpen: boolean;
  setIsCropDoctorOpen: (open: boolean) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  isUssdModalOpen: boolean;
  setIsUssdModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isMenuHidden: boolean;
  setIsMenuHidden: (hidden: boolean) => void;
  toggleMenu: () => void;

  // Data Consent
  dataConsent: DataConsentSettings;
  updateDataConsent: (settings: Partial<DataConsentSettings>) => void;
  consentSettings: DataConsentSettings;
  toggleConsent: (key: keyof DataConsentSettings) => void;

  // Trigger Simulation
  triggerEventSimulation: (eventName: "soil_drought" | "rain_incoming" | "buyer_surge" | "price_rally") => void;

  // Digital Document Repository
  farmerDocuments: FarmerDocument[];
  addFarmerDocument: (doc: Omit<FarmerDocument, "id" | "uploadDate" | "sha256Hash">) => void;
  deleteFarmerDocument: (id: string) => void;
  shareFarmerDocument: (id: string, entityName: string) => void;

  // Soil Moisture & Nutrient Telemetry Sensors
  soilSensorNodes: SoilSensorNode[];
  updateSoilNodeMoisture: (nodeId: string, depthIndex: number, newMoisture: number) => void;
  triggerIrrigationValve: (nodeId: string) => void;
  soilAlerts: SensorTelemetryAlert[];
  dismissSoilAlert: (id: string) => void;

  // Biometric Sovereign Security
  isBiometricModalOpen: boolean;
  setIsBiometricModalOpen: (open: boolean) => void;
  isSensitiveDataLocked: boolean;
  setIsSensitiveDataLocked: (locked: boolean) => void;
  toggleSensitiveDataLock: () => void;

  // Simple Login, Signup & RBAC
  currentUser: AuthUser;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: "login" | "signup";
  setAuthModalTab: (tab: "login" | "signup") => void;
  openAuthModal: (tab?: "login" | "signup") => void;
  loginUser: (email: string, password?: string, role?: UserRole) => Promise<boolean>;
  signupUser: (payload: { name: string; email: string; role: UserRole; countryCode: string; organization?: string }) => Promise<boolean>;
  logoutUser: () => void;
  switchRole: (role: UserRole) => void;

  // Cross-Role Real-Time Data Synchronization Mesh
  syncEvents: CrossRoleSyncEvent[];
  broadcastSyncEvent: (event: Omit<CrossRoleSyncEvent, "id" | "timestamp" | "synced">) => void;
  isSyncMonitorOpen: boolean;
  setIsSyncMonitorOpen: (open: boolean) => void;
}

const INITIAL_SYNC_EVENTS: CrossRoleSyncEvent[] = [
  {
    id: "sync_01",
    sourceRole: "farmer",
    sourceEntity: "Kakuzi Agro Smallholders (Kenya)",
    targetRoles: ["buyer", "agribusiness", "cooperative"],
    actionType: "listing_created",
    title: "Harvest Verified: 45 MT Grade-A White Maize",
    details: "Listed at Nakuru Silo Hub ($280/MT). Moisture 12.8% Sentinel-verified.",
    timestamp: "10m ago",
    synced: true,
  },
  {
    id: "sync_02",
    sourceRole: "buyer",
    sourceEntity: "Nile Milling & Grain (Egypt)",
    targetRoles: ["farmer", "logistics", "finance"],
    actionType: "contract_issued",
    title: "Forward Contract #CT-2026-88 Confirmed",
    details: "Offtake of 2,500 MT booked. Escrow funds funded at Pan-African AgDev Bank.",
    timestamp: "24m ago",
    synced: true,
  },
  {
    id: "sync_03",
    sourceRole: "logistics",
    sourceEntity: "Savannah Cold Transit (Ghana)",
    targetRoles: ["buyer", "farmer", "logistics"],
    actionType: "logistics_dispatched",
    title: "Cold Chain Fleet Dispatched: Mombasa to Cairo",
    details: "8 Reefer trucks on AfCFTA Green Lane. Telemetry temp 18.2°C nominal.",
    timestamp: "1h ago",
    synced: true,
  },
  {
    id: "sync_04",
    sourceRole: "finance",
    sourceEntity: "Pan-African AgDev Bank",
    targetRoles: ["farmer", "cooperative"],
    actionType: "finance_approved",
    title: "Pre-Harvest Credit Facility Approved ($42,000)",
    details: "Automated underwriting backed by 3-year satellite NDVI yield index.",
    timestamp: "2h ago",
    synced: true,
  },
  {
    id: "sync_05",
    sourceRole: "government",
    sourceEntity: "Federal Ministry of Agriculture",
    targetRoles: ["government", "cooperative", "farmer"],
    actionType: "policy_decree",
    title: "National Strategic Grain Reserve Policy Directive",
    details: "Minimum farmgate support price indexed at $260/MT; subsidized fertilizer allocation open.",
    timestamp: "3h ago",
    synced: true,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<string>("landing");

  // User Authentication & Session
  const [currentUser, setCurrentUser] = useState<AuthUser>(() => {
    try {
      const saved = localStorage.getItem("cultx_user_session");
      if (saved) return JSON.parse(saved);
    } catch {}
    return ROLE_CONFIGS.farmer.demoUser;
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem("cultx_user_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.role) return parsed.role;
      }
    } catch {}
    return "farmer";
  });

  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("simple");
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(() => {
    const defaultCountry = AFRICAN_COUNTRIES.find((c) => c.code === "KE") || AFRICAN_COUNTRIES[0];
    return defaultCountry;
  });

  // Cross-Role Real-Time Synchronization State
  const [syncEvents, setSyncEvents] = useState<CrossRoleSyncEvent[]>(INITIAL_SYNC_EVENTS);
  const [isSyncMonitorOpen, setIsSyncMonitorOpen] = useState<boolean>(false);

  // Auth Webpage & Session State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");
  const openAuthModal = (tab: "login" | "signup" = "login") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(false);
    setCurrentView("auth");
  };

  const [farms, setFarms] = useState<Farm[]>(INITIAL_FARMS);
  const [currentFarm, setCurrentFarm] = useState<Farm>(INITIAL_FARMS[0]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(INITIAL_AI_RECOMMENDATIONS);

  const [commodityPrices, setCommodityPrices] = useState<CommodityPrice[]>(PAN_AFRICAN_COMMODITY_PRICES);
  const [marketPricesLastSync, setMarketPricesLastSync] = useState<string>("Synced 05:25 AM (12h Gemini Cycle)");
  const [isSyncingMarketPrices, setIsSyncingMarketPrices] = useState<boolean>(false);

  const refreshMarketPrices = async (force: boolean = false) => {
    setIsSyncingMarketPrices(true);
    try {
      const res = await fetch(`/api/gemini/market-prices?force=${force ? "true" : "false"}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.prices) && data.prices.length > 0) {
          setCommodityPrices(data.prices);
          const now = new Date();
          const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
          setMarketPricesLastSync(`Synced ${timeStr} (${data.source || "Gemini 12h Cycle"})`);

          // Broadcast real-time sync event across mesh
          broadcastSyncEvent({
            sourceRole: "agribusiness",
            sourceEntity: "Pan-African Commodity Exchanges (SAFEX / ECX / AFEX)",
            targetRoles: ["farmer", "buyer", "finance", "logistics", "cooperative"],
            actionType: "telemetry_updated",
            title: `Market Prices Synced (12h Gemini Cycle)`,
            details: `Updated spot prices across ${data.prices.length} commodities. SAFEX White Maize at R${data.prices[0]?.pricePerTonne || 5420}/MT.`,
          });
        }
      }
    } catch (e) {
      console.warn("Could not sync live market prices:", e);
    } finally {
      setIsSyncingMarketPrices(false);
    }
  };

  // Initial and 12-hour automated background sync
  useEffect(() => {
    refreshMarketPrices(false);

    // 12-hour interval (12 * 60 * 60 * 1000 ms)
    const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
    const interval = setInterval(() => {
      refreshMarketPrices(true);
    }, TWELVE_HOURS_MS);

    return () => clearInterval(interval);
  }, []);
  const [marketListings, setMarketListings] = useState<MarketListing[]>(INITIAL_MARKET_LISTINGS);
  const [purchaseContracts, setPurchaseContracts] = useState<PurchaseContract[]>(INITIAL_PURCHASE_CONTRACTS);

  // Digital Document Repository State
  const [farmerDocuments, setFarmerDocuments] = useState<FarmerDocument[]>(INITIAL_FARMER_DOCUMENTS);

  // Soil Sensor Telemetry State
  const [soilSensorNodes, setSoilSensorNodes] = useState<SoilSensorNode[]>(INITIAL_SOIL_NODES);
  const [soilAlerts, setSoilAlerts] = useState<SensorTelemetryAlert[]>(INITIAL_SOIL_ALERTS);

  const [financingProducts] = useState<FinancingProduct[]>(FINANCING_PRODUCTS);
  const [logisticsRoutes] = useState<LogisticsRoute[]>(LOGISTICS_ROUTES);
  const [warehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);

  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modals
  const [isCropDoctorOpen, setIsCropDoctorOpenState] = useState<boolean>(false);
  const setIsCropDoctorOpen = (open: boolean) => {
    setIsCropDoctorOpenState(open);
    if (open) {
      setCurrentView("crop_doctor");
    }
  };
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isUssdModalOpen, setIsUssdModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);
  const [isMenuHidden, setIsMenuHidden] = useState<boolean>(false);
  const toggleMenu = () => setIsMenuHidden((prev) => !prev);

  // Biometric Sovereign Security
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState<boolean>(false);
  const [isSensitiveDataLocked, setIsSensitiveDataLocked] = useState<boolean>(false);
  const toggleSensitiveDataLock = () => setIsSensitiveDataLocked((prev) => !prev);

  // Consent
  const [dataConsent, setDataConsent] = useState<DataConsentSettings>({
    shareWithFinancialInstitutions: true,
    shareWithGovernmentPolicy: false,
    shareWithMarketplaceBuyers: true,
    allowSatelliteNdviAnalysis: true,
    shareWithLenders: true,
    shareWithBuyers: true,
    shareWithGovernment: false,
    shareSatelliteNDVI: true,
    retentionMonths: 24,
  });

  // Sync role to experience level automatically
  useEffect(() => {
    if (userRole === "farmer") {
      setExperienceLevel("simple");
    } else if (userRole === "agribusiness" || userRole === "buyer" || userRole === "logistics" || userRole === "cooperative") {
      setExperienceLevel("professional");
    } else if (userRole === "government" || userRole === "researcher" || userRole === "superadmin") {
      setExperienceLevel("intelligence");
    }
  }, [userRole]);

  // Production IndexedDB Hydration & Offline Engine
  useEffect(() => {
    const hydrateStorage = async () => {
      try {
        const cachedListings = await offlineStorage.getEntity<MarketListing[]>("market_listings");
        if (cachedListings && Array.isArray(cachedListings) && cachedListings.length > 0) {
          setMarketListings(cachedListings);
        }

        const cachedContracts = await offlineStorage.getEntity<PurchaseContract[]>("purchase_contracts");
        if (cachedContracts && Array.isArray(cachedContracts) && cachedContracts.length > 0) {
          setPurchaseContracts(cachedContracts);
        }

        const pendingActions = await offlineStorage.getPendingActions();
        if (pendingActions && pendingActions.length > 0) {
          setSyncQueue(
            pendingActions.map((a) => ({
              id: a.id,
              action: a.type,
              entity: a.entity,
              timestamp: new Date(a.timestamp).toLocaleTimeString(),
              status: "pending",
            }))
          );
        }
      } catch (err) {
        console.warn("[IndexedDB] Hydration warning:", err);
      }
    };

    hydrateStorage();

    // Subscribe to edge performance & connection telemetry
    const unsubscribe = performanceTelemetry.subscribe((metrics) => {
      if (!metrics.isOnline) {
        setIsOffline(true);
      } else {
        setIsOffline((prev) => {
          if (prev) {
            // Recovered from offline - trigger automated background sync
            setTimeout(() => {
              triggerManualSync();
            }, 500);
          }
          return false;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const broadcastSyncEvent = (evt: Omit<CrossRoleSyncEvent, "id" | "timestamp" | "synced">) => {
    const newEvt: CrossRoleSyncEvent = {
      ...evt,
      id: `sync_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: "Just now",
      synced: true,
    };
    setSyncEvents((prev) => [newEvt, ...prev.slice(0, 24)]);

    // Generate in-app alert notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: "system",
        title: `Mesh Sync: ${evt.title}`,
        message: `${evt.sourceEntity}: ${evt.details}`,
        timestamp: "Just now",
        read: false,
        priority: "normal",
      },
      ...prev,
    ]);
  };

  const loginUser = async (email: string, _password?: string, forcedRole?: UserRole): Promise<boolean> => {
    let targetRole: UserRole = forcedRole || "farmer";
    if (!forcedRole) {
      const match = Object.values(ROLE_CONFIGS).find(
        (c) => c.demoUser.email.toLowerCase() === email.toLowerCase()
      );
      if (match) targetRole = match.id;
    }

    const roleConfig = ROLE_CONFIGS[targetRole] || ROLE_CONFIGS.farmer;
    const userObj: AuthUser = {
      ...roleConfig.demoUser,
      email: email || roleConfig.demoUser.email,
    };

    setCurrentUser(userObj);
    setUserRole(targetRole);

    try {
      localStorage.setItem("cultx_user_session", JSON.stringify(userObj));
    } catch {}

    const country = AFRICAN_COUNTRIES.find((c) => c.code === userObj.countryCode);
    if (country) setSelectedCountry(country);

    // Enforce view authorization
    if (currentView === "landing" || currentView === "auth" || !isViewAllowedForRole(currentView, targetRole)) {
      setCurrentView(roleConfig.primaryView);
    }

    broadcastSyncEvent({
      sourceRole: targetRole,
      sourceEntity: userObj.name,
      targetRoles: PRIMARY_ROLES.filter((r) => r !== targetRole),
      actionType: "user_registered",
      title: `${userObj.name} Connected as ${roleConfig.label}`,
      details: `Session authenticated for ${userObj.organization} (${userObj.countryName}). Mesh synchronized.`,
    });

    return true;
  };

  const signupUser = async (payload: {
    name: string;
    email: string;
    role: UserRole;
    countryCode: string;
    organization?: string;
  }): Promise<boolean> => {
    const roleConfig = ROLE_CONFIGS[payload.role] || ROLE_CONFIGS.farmer;
    const countryObj = AFRICAN_COUNTRIES.find((c) => c.code === payload.countryCode) || selectedCountry;

    const initials =
      payload.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "UX";

    const newUser: AuthUser = {
      id: `usr_${Date.now()}`,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      roleLabel: roleConfig.label,
      organization: payload.organization || `${payload.name}'s Farm & Enterprise`,
      countryCode: countryObj.code,
      countryName: countryObj.name,
      avatarInitials: initials,
      joinedDate: "Today",
    };

    setCurrentUser(newUser);
    setUserRole(payload.role);
    setSelectedCountry(countryObj);

    try {
      localStorage.setItem("cultx_user_session", JSON.stringify(newUser));
    } catch {}

    setCurrentView(roleConfig.primaryView);

    broadcastSyncEvent({
      sourceRole: payload.role,
      sourceEntity: newUser.name,
      targetRoles: PRIMARY_ROLES.filter((r) => r !== payload.role),
      actionType: "user_registered",
      title: `New Account: ${newUser.name} (${roleConfig.label})`,
      details: `Provisioned for ${newUser.organization} in ${countryObj.name}. Workspace permissions mapped.`,
    });

    return true;
  };

  const logoutUser = () => {
    try {
      localStorage.removeItem("cultx_user_session");
    } catch {}
    setCurrentUser(ROLE_CONFIGS.farmer.demoUser);
    setUserRole("farmer");
    setCurrentView("landing");
  };

  const switchRole = (newRole: UserRole) => {
    setUserRole(newRole);
    const roleConfig = ROLE_CONFIGS[newRole];
    if (roleConfig) {
      const updatedUser: AuthUser = {
        ...currentUser,
        role: newRole,
        roleLabel: roleConfig.label,
        avatarInitials: roleConfig.demoUser.avatarInitials,
        name: roleConfig.demoUser.name,
        organization: roleConfig.demoUser.organization,
      };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem("cultx_user_session", JSON.stringify(updatedUser));
      } catch {}

      if (!isViewAllowedForRole(currentView, newRole)) {
        setCurrentView(roleConfig.primaryView);
      }

      broadcastSyncEvent({
        sourceRole: newRole,
        sourceEntity: updatedUser.name,
        targetRoles: PRIMARY_ROLES.filter((r) => r !== newRole),
        actionType: "user_registered",
        title: `Persona Switched: ${roleConfig.label}`,
        details: `Active operating view mapped to ${roleConfig.primaryView}.`,
      });
    }
  };

  const toggleOfflineMode = () => {
    setIsOffline((prev) => {
      const next = !prev;
      if (!next && syncQueue.length > 0) {
        // Auto-synced
        triggerManualSync();
      }
      return next;
    });
  };

  const triggerManualSync = async () => {
    setSyncQueue((queue) =>
      queue.map((item) => ({ ...item, status: "syncing" as const }))
    );

    try {
      const pending = await offlineStorage.getPendingActions();
      const payloadActions = pending.length > 0 ? pending : syncQueue.map((q) => ({
        id: q.id,
        type: "GENERAL_SYNC" as const,
        entity: q.entity,
        payload: { action: q.action },
        timestamp: Date.now(),
        retryCount: 0,
        status: "pending" as const,
      }));

      if (isOffline) {
        // When triggering sync while offline, register failed attempt in offline activity log
        payloadActions.forEach((item) => {
          offlineActivityLogger.logFailure({
            actionType: item.type || "OFFLINE_SYNC",
            entity: item.entity || "Agronomic Transaction",
            errorMessage: "Connection offline: Unable to reach Continental Cloud Mesh gateway",
            errorCode: "ERR_OFFLINE_LOCAL_QUEUE",
            payloadSummary: `Action queued while device is offline. Stored in IndexedDB.`,
            details: item.payload,
          });
        });

        setSyncQueue((queue) =>
          queue.map((item) => ({ ...item, status: "pending" as const }))
        );
        return;
      }

      const res = await fetch("/api/sync/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actions: payloadActions,
          clientTimestamp: new Date().toISOString(),
          userRole,
        }),
      });

      if (res.ok) {
        await offlineStorage.clearAllActions();
        try {
          localStorage.setItem("cultx_last_sync_time", Date.now().toString());
        } catch {}

        setSyncQueue((queue) =>
          queue.map((item) => ({ ...item, status: "synced" as const }))
        );

        setNotifications((prev) => [
          {
            id: `sync-success-${Date.now()}`,
            type: "system",
            title: "Mesh Synchronized",
            message: `Successfully synchronized ${payloadActions.length} offline transactions with Pan-African cloud mesh.`,
            timestamp: "Just now",
            read: false,
            priority: "normal",
          },
          ...prev,
        ]);

        setTimeout(() => {
          setSyncQueue([]);
        }, 1800);
        return;
      } else {
        // Log failures from non-200 response
        payloadActions.forEach((item) => {
          offlineActivityLogger.logFailure({
            actionType: item.type || "MESH_SYNC",
            entity: item.entity || "Pan-African Sync Packet",
            errorMessage: `Server responded with HTTP ${res.status}: Cloud mesh synchronization failed`,
            errorCode: `HTTP_${res.status}_ERR`,
            payloadSummary: `Failed to reconcile with AfCFTA registry`,
            details: item.payload,
          });
        });
      }
    } catch (e: any) {
      console.warn("Batch sync offline fallback:", e);
      // Record failure in offline activity log
      syncQueue.forEach((item) => {
        offlineActivityLogger.logFailure({
          actionType: item.action || "NETWORK_SYNC",
          entity: item.entity || "Telemetry Mutation",
          errorMessage: e?.message || "Network timeout: Remote cloud mesh gateway unreachable",
          errorCode: "ERR_MESH_TIMEOUT_504",
          payloadSummary: `Queue item: ${item.action}`,
        });
      });
    }

    // Set queue items back to pending status
    setSyncQueue((queue) =>
      queue.map((item) => ({ ...item, status: "pending" as const }))
    );
  };

  const applyRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, applied: true } : rec))
    );
    if (isOffline) {
      const syncItem: SyncQueueItem = {
        id: `sync-${Date.now()}`,
        action: "Applied Recommendation",
        entity: id,
        timestamp: new Date().toLocaleTimeString(),
        status: "pending",
      };
      setSyncQueue((q) => [...q, syncItem]);
      offlineStorage.enqueueAction({
        type: "APPLY_RECOMMENDATION",
        entity: id,
        payload: { recommendationId: id },
      });
    }
  };

  const updateFarmFieldHealth = (farmId: string, fieldId: string, status: string) => {
    setFarms((prev) =>
      prev.map((f) => {
        if (f.id === farmId) {
          return {
            ...f,
            fields: f.fields.map((fld) =>
              fld.id === fieldId ? { ...fld, health: status as any } : fld
            ),
          };
        }
        return f;
      })
    );
  };

  const addMarketListing = (listing: Omit<MarketListing, "id" | "verified">) => {
    const newListing: MarketListing = {
      ...listing,
      id: `list-${Date.now()}`,
      verified: true,
    };
    const updatedListings = [newListing, ...marketListings];
    setMarketListings(updatedListings);
    offlineStorage.saveEntity("market_listings", updatedListings);

    // Broadcast real-time cross-role sync event
    broadcastSyncEvent({
      sourceRole: userRole,
      sourceEntity: currentUser?.organization || currentUser?.name || "Farmer Member",
      targetRoles: ["buyer", "agribusiness", "cooperative"],
      actionType: "listing_created",
      title: `Produce Listed: ${listing.quantityTonnes} MT ${listing.commodity}`,
      details: `Origin: ${listing.location} (${listing.country}) at ${listing.minPricePerTonne}/MT. Moisture verified.`,
    });

    if (isOffline) {
      const syncItem: SyncQueueItem = {
        id: `sync-${Date.now()}`,
        action: "New Produce Market Listing",
        entity: listing.commodity,
        timestamp: new Date().toLocaleTimeString(),
        status: "pending",
      };
      setSyncQueue((q) => [...q, syncItem]);
      offlineStorage.enqueueAction({
        type: "CREATE_LISTING",
        entity: listing.commodity,
        payload: newListing,
      });
    }
  };

  const addPurchaseContract = (contract: Omit<PurchaseContract, "id" | "status" | "contractNumber">) => {
    const newContract: PurchaseContract = {
      ...contract,
      id: `contract-${Date.now()}`,
      contractNumber: `AGRI-CTR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Under Review",
    };
    const updatedContracts = [newContract, ...purchaseContracts];
    setPurchaseContracts(updatedContracts);
    offlineStorage.saveEntity("purchase_contracts", updatedContracts);

    // Broadcast real-time cross-role sync event
    broadcastSyncEvent({
      sourceRole: userRole,
      sourceEntity: currentUser?.organization || currentUser?.name || "Commodity Buyer Desk",
      targetRoles: ["farmer", "logistics", "finance", "cooperative"],
      actionType: "contract_issued",
      title: `Forward Contract ${newContract.contractNumber} Issued`,
      details: `Offtake for ${contract.quantityTonnes} MT ${contract.commodity} from ${contract.sellerName}. Delivery: ${contract.deliveryDate} at ${contract.deliveryLocation}.`,
    });

    if (isOffline) {
      const syncItem: SyncQueueItem = {
        id: `sync-${Date.now()}`,
        action: "New Purchase Contract",
        entity: newContract.contractNumber,
        timestamp: new Date().toLocaleTimeString(),
        status: "pending",
      };
      setSyncQueue((q) => [...q, syncItem]);
      offlineStorage.enqueueAction({
        type: "SUBMIT_CONTRACT",
        entity: newContract.contractNumber,
        payload: newContract,
      });
    }
  };

  // Farmer Document Repository Actions
  const addFarmerDocument = (doc: Omit<FarmerDocument, "id" | "uploadDate" | "sha256Hash">) => {
    const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const newDoc: FarmerDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().slice(0, 10),
      sha256Hash: randomHex,
    };
    setFarmerDocuments((prev) => [newDoc, ...prev]);
    if (isOffline) {
      setSyncQueue((q) => [
        ...q,
        {
          id: `sync-${Date.now()}`,
          action: "Vaulted Digital Document",
          entity: newDoc.title,
          timestamp: new Date().toLocaleTimeString(),
          status: "pending",
        },
      ]);
    }
  };

  const deleteFarmerDocument = (id: string) => {
    setFarmerDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const shareFarmerDocument = (id: string, entityName: string) => {
    setFarmerDocuments((prev) =>
      prev.map((d) => {
        if (d.id === id && !d.sharedWith.includes(entityName)) {
          return { ...d, sharedWith: [...d.sharedWith, entityName] };
        }
        return d;
      })
    );
  };

  // Soil Telemetry Actions
  const updateSoilNodeMoisture = (nodeId: string, depthIndex: number, newMoisture: number) => {
    setSoilSensorNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === nodeId) {
          const newDepths = [...node.depths];
          if (newDepths[depthIndex]) {
            newDepths[depthIndex] = {
              ...newDepths[depthIndex],
              moisturePct: newMoisture,
              status: newMoisture < 30 ? "Deficit" : newMoisture > 52 ? "Waterlogged" : "Optimal",
            };
          }
          return { ...node, depths: newDepths, lastPingSeconds: 2 };
        }
        return node;
      })
    );
  };

  const triggerIrrigationValve = (nodeId: string) => {
    setSoilSensorNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === nodeId) {
          const isActive = !node.activeIrrigationValve;
          const updatedDepths = node.depths.map((d) => {
            const nextVal = isActive ? Math.min(52, d.moisturePct + 14) : d.moisturePct;
            return {
              ...d,
              moisturePct: nextVal,
              status: (nextVal < 30 ? "Deficit" : "Optimal") as any,
            };
          });
          return {
            ...node,
            activeIrrigationValve: isActive,
            depths: updatedDepths,
            status: "online" as const,
            lastPingSeconds: 1,
          };
        }
        return node;
      })
    );
  };

  const dismissSoilAlert = (id: string) => {
    setSoilAlerts((alerts) => alerts.filter((a) => a.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const addNotification = (notif: Omit<NotificationItem, "id"> | NotificationItem) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: "id" in notif ? notif.id : `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const updateDataConsent = (settings: Partial<DataConsentSettings>) => {
    setDataConsent((prev) => ({ ...prev, ...settings }));
  };

  const toggleConsent = (key: keyof DataConsentSettings) => {
    setDataConsent((prev) => {
      const currentVal = prev[key];
      if (typeof currentVal === "boolean") {
        return { ...prev, [key]: !currentVal };
      }
      return prev;
    });
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const triggerEventSimulation = (eventName: "soil_drought" | "rain_incoming" | "buyer_surge" | "price_rally") => {
    if (eventName === "soil_drought") {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: "urgent",
        title: "Soil Moisture Critical Alert",
        message: "Center-pivot telemetry in Field 03 fell below 25%. Vegetative stress warning triggered.",
        timestamp: "Just now",
        read: false,
        actionLabel: "View Field 03",
        targetView: "farms",
      };
      setNotifications((n) => [newNotif, ...n]);
      // Update field 3
      updateFarmFieldHealth(currentFarm.id, "field-03", "Critical");
    } else if (eventName === "rain_incoming") {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: "important",
        title: "Weather Alert: Free State Convective Storm",
        message: "High-resolution Doppler radar detects front with 45mm precipitation in 18 hours.",
        timestamp: "Just now",
        read: false,
        actionLabel: "View Radar",
        targetView: "climate",
      };
      setNotifications((n) => [newNotif, ...n]);
    } else if (eventName === "buyer_surge") {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: "opportunity",
        title: "Market Opportunity: 2,500 MT Grain Tender",
        message: "East African Grain Council published verified spot tender at +9.2% premium.",
        timestamp: "Just now",
        read: false,
        actionLabel: "Bid on Tender",
        targetView: "marketplace",
      };
      setNotifications((n) => [newNotif, ...n]);
    } else if (eventName === "price_rally") {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        type: "financial",
        title: "Commodity Alert: Regional Maize Price +7.4%",
        message: "SAFEX spot rates breached R5,550/MT due to low harvest inventory carryover.",
        timestamp: "Just now",
        read: false,
        actionLabel: "Lock Forward Price",
        targetView: "marketplace",
      };
      setNotifications((n) => [newNotif, ...n]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        userRole,
        setUserRole,
        experienceLevel,
        setExperienceLevel,
        selectedCountry,
        setSelectedCountry,
        farms,
        currentFarm,
        setCurrentFarm,
        updateFarmFieldHealth,
        recommendations,
        applyRecommendation,
        commodityPrices,
        marketPricesLastSync,
        isSyncingMarketPrices,
        refreshMarketPrices,
        marketListings,
        addMarketListing,
        purchaseContracts,
        addPurchaseContract,
        financingProducts,
        logisticsRoutes,
        warehouses,
        isOffline,
        toggleOfflineMode,
        syncQueue,
        triggerManualSync,
        notifications,
        markNotificationAsRead,
        unreadNotificationCount,
        addNotification,
        isCropDoctorOpen,
        setIsCropDoctorOpen,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        isUssdModalOpen,
        setIsUssdModalOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isCopilotOpen,
        setIsCopilotOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isMenuHidden,
        setIsMenuHidden,
        toggleMenu,
        dataConsent,
        updateDataConsent,
        consentSettings: dataConsent,
        toggleConsent,
        triggerEventSimulation,
        farmerDocuments,
        addFarmerDocument,
        deleteFarmerDocument,
        shareFarmerDocument,
        soilSensorNodes,
        updateSoilNodeMoisture,
        triggerIrrigationValve,
        soilAlerts,
        dismissSoilAlert,
        isBiometricModalOpen,
        setIsBiometricModalOpen,
        isSensitiveDataLocked,
        setIsSensitiveDataLocked,
        toggleSensitiveDataLock,
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        loginUser,
        signupUser,
        logoutUser,
        switchRole,
        syncEvents,
        broadcastSyncEvent,
        isSyncMonitorOpen,
        setIsSyncMonitorOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
