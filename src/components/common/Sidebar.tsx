import React, { useState, useMemo } from "react";
import {
  LayoutDashboard,
  Sprout,
  Satellite,
  Stethoscope,
  CloudSunRain,
  ShoppingBag,
  Coins,
  Truck,
  Globe2,
  Users2,
  Landmark,
  ShieldCheck,
  Settings,
  MessageSquare,
  Compass,
  PanelLeftClose,
  Search,
  Mic,
  Bell,
  Wifi,
  WifiOff,
  Zap,
  Smartphone,
  Fingerprint,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  ArrowRight,
  RefreshCw,
  LogOut,
  UserCheck,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AFRICAN_COUNTRIES } from "../../data/countries";
import { UserRole } from "../../types";
import { ROLE_CONFIGS, isViewAllowedForRole, PRIMARY_ROLES } from "../../utils/rbac";

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    userRole,
    setUserRole,
    experienceLevel,
    isOffline,
    toggleOfflineMode,
    syncQueue,
    unreadNotificationCount,
    selectedCountry,
    setSelectedCountry,
    setIsVoiceModalOpen,
    setIsUssdModalOpen,
    setIsSearchModalOpen,
    setIsCopilotOpen,
    setIsNotificationDrawerOpen,
    toggleMenu,
    triggerEventSimulation,
    setIsBiometricModalOpen,
    isSensitiveDataLocked,
    toggleSensitiveDataLock,
    currentUser,
    openAuthModal,
    switchRole,
    logoutUser,
    setIsSyncMonitorOpen,
  } = useApp();

  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isSimulationMenuOpen, setIsSimulationMenuOpen] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");

  const activeRoleConfig = ROLE_CONFIGS[userRole] || ROLE_CONFIGS.farmer;

  const filteredCountries = useMemo(() => {
    if (!countryFilter.trim()) return AFRICAN_COUNTRIES;
    const q = countryFilter.toLowerCase();
    return AFRICAN_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.currency.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [countryFilter]);

  const allNavItems = [
    { id: "dashboard", label: "Home (Command)", icon: LayoutDashboard },
    { id: "farms", label: "Farmers & Farm Hub", icon: Sprout, count: 3 },
    { id: "precision", label: "Precision Agriculture", icon: Satellite },
    { id: "crop_doctor", label: "Crop Doctor", icon: Stethoscope, isSpecial: true },
    { id: "climate", label: "Climate Intelligence", icon: CloudSunRain, alert: "Rain 72h" },
    { id: "marketplace", label: "Marketplace & Prices", icon: ShoppingBag, count: "54 Mkts" },
    { id: "finance", label: "Agri-Finance & Credit", icon: Coins },
    { id: "logistics", label: "Logistics & Silos", icon: Truck },
    { id: "trade", label: "Trade & AfCFTA Export", icon: Globe2 },
    { id: "cooperative", label: "Cooperative Hub", icon: Users2, badge: "-11% Bulk" },
    { id: "government", label: "National Food Security", icon: Landmark, isGov: true },
    { id: "agribusiness", label: "Agribusiness & Outgrowers", icon: LayoutDashboard },
  ];

  const allAdminItems = [
    { id: "admin", label: "Super Admin Control", icon: Settings },
    { id: "consent", label: "Data Sovereignty & Trust", icon: ShieldCheck },
    { id: "landing", label: "Platform Architecture", icon: Compass },
  ];

  // RBAC Filter: Only show views permitted for this specific role
  const visibleNavItems = useMemo(() => {
    return allNavItems.filter((item) => isViewAllowedForRole(item.id, userRole));
  }, [allNavItems, userRole]);

  const visibleAdminItems = useMemo(() => {
    return allAdminItems.filter((item) => isViewAllowedForRole(item.id, userRole));
  }, [allAdminItems, userRole]);

  return (
    <aside className="w-72 bg-[#0B1013] text-slate-300 shrink-0 flex flex-col justify-between hidden lg:flex selection:bg-emerald-600 selection:text-white border-r border-[#19262F] h-full overflow-hidden">
      {/* Top Section: Brand, Search, Role Badge, and Role-Filtered Navigation */}
      <div className="p-3.5 space-y-4 overflow-y-auto flex-1 min-h-0">
        {/* Brand Anchor Header with Logo & Hide Menu action */}
        <div className="flex items-center justify-between pb-1">
          <button
            onClick={() => setCurrentView("landing")}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
            id="sidebar-brand-button"
            title="Return to CULTx Overview"
          >
            <img
              src="/cultx_logo.png"
              alt="CULTx"
              className="w-8 h-8 rounded-lg object-contain shadow-xs group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight leading-none block">
                CULTx
              </span>
              <span className="text-[10px] font-medium text-slate-400 leading-tight block">
                AgriIntel Africa
              </span>
            </div>
          </button>
          <button
            onClick={toggleMenu}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-[#10171B] hover:bg-[#162228] transition-colors cursor-pointer"
            title="Hide Menu (Expand Workspace)"
            id="sidebar-hide-menu-button"
          >
            <PanelLeftClose className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hide</span>
          </button>
        </div>

        {/* Global Agriculture Search Launcher */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#10171B] hover:bg-[#162228] border border-[#1D2A32] hover:border-[#14533C] text-xs text-slate-400 hover:text-white transition-colors cursor-pointer min-h-[38px]"
          id="sidebar-search-button"
          title="Search agriculture (farms, crops, buyers, prices)"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">Search agriculture...</span>
          </span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-300 bg-[#162228] rounded border border-[#1D2A32]">
            ⌘K
          </kbd>
        </button>

        {/* Active Role & Operating Level Card */}
        <div className="bg-[#10171B] rounded-2xl p-3 shadow-xs border border-[#17232B] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Workspace
            </span>
            <span
              className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border"
              style={{
                backgroundColor: `${activeRoleConfig.accentColor}15`,
                color: activeRoleConfig.accentColor,
                borderColor: `${activeRoleConfig.accentColor}40`,
              }}
            >
              {activeRoleConfig.badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: activeRoleConfig.accentColor }}
            />
            <span className="text-xs font-bold text-white truncate">{activeRoleConfig.label}</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#19262F] text-[10px]">
            <span className="text-slate-400 truncate">
              {currentUser?.organization || "Pan-African Grid"}
            </span>
            <button
              onClick={() => openAuthModal("login")}
              className="text-emerald-400 font-semibold hover:underline cursor-pointer shrink-0 ml-1"
            >
              Switch Role →
            </button>
          </div>
        </div>

        {/* Role-Filtered Navigation Items */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Relevant Role Features ({visibleNavItems.length})
            </span>
            <span className="text-[9px] font-mono text-emerald-400">RBAC Filtered</span>
          </div>

          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer min-h-[36px] ${
                  isActive
                    ? "bg-[#14532D] text-[#FDFBF7] font-bold shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-[#162228]"
                }`}
                id={`sidebar-nav-${item.id}`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-300" : "text-slate-400"}`} />
                  <span className={`truncate ${isActive ? "text-white" : "text-slate-200"}`}>
                    {item.label}
                  </span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#07261B] text-emerald-300 border border-[#0F4A34] shrink-0">
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#162228] text-slate-300 shrink-0">
                    {item.count}
                  </span>
                )}
                {item.alert && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-600/40 shrink-0">
                    {item.alert}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Administration & Architecture (Role Filtered) */}
        {visibleAdminItems.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-[#19262F]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-1">
              Governance & Architecture
            </div>
            {visibleAdminItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer min-h-[36px] ${
                    isActive
                      ? "bg-[#07261B] text-emerald-300 font-bold border border-[#14533C]"
                      : "text-slate-400 hover:text-white hover:bg-[#162228]"
                  }`}
                  id={`sidebar-nav-${item.id}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className={isActive ? "text-white font-bold" : ""}>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          PLATFORM TOOLS & COPILOT SUITE (With Real-Time Sync & Role Auth)
          ========================================================================= */}
      <div className="p-3 bg-[#080D0F] border-t border-[#19262F] shrink-0 space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Platform Tools & Copilot
          </span>
          <button
            onClick={() => setIsSyncMonitorOpen(true)}
            className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            title="Open Real-Time Ecosystem Synchronization Mesh"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>7 Roles Synced</span>
          </button>
        </div>

        {/* 1. Primary Copilot Assistant Launcher */}
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#0B3D2C] to-[#14532D] hover:from-[#0E4B37] hover:to-[#196349] text-white text-xs font-bold shadow-md transition-all border border-[#1E6B3E]/60 cursor-pointer min-h-[44px]"
          id="sidebar-copilot-trigger"
          title="Open Grounded Agricultural Copilot"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-400/20 flex items-center justify-center text-emerald-300">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block leading-tight font-extrabold">Copilot Assistant</span>
              <span className="text-[10px] text-emerald-300/80 font-normal block leading-tight">
                {activeRoleConfig.label}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#051E14] text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            <span>Active</span>
          </span>
        </button>

        {/* 2. Interactive Tool Icons Dock */}
        <div className="grid grid-cols-6 gap-1.5 bg-[#10171B] p-1.5 rounded-xl border border-[#1D2A32]">
          {/* Voice Assistant */}
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="flex items-center justify-center p-2 rounded-lg bg-[#14532D]/70 hover:bg-[#14532D] text-[#FDFBF7] transition-all cursor-pointer min-h-[36px]"
            title="Voice Assistant (9+ African Languages)"
            id="sidebar-voice-button"
          >
            <Mic className="w-4 h-4 text-[#F5B942]" />
          </button>

          {/* 2G USSD / SMS */}
          <button
            onClick={() => setIsUssdModalOpen(true)}
            className="flex items-center justify-center p-2 rounded-lg hover:bg-[#162228] text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[36px]"
            title="Low-literacy 2G feature phone USSD & SMS (*384*2858#)"
            id="sidebar-ussd-button"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Real-Time Cross-Role Sync Monitor */}
          <button
            onClick={() => setIsSyncMonitorOpen(true)}
            className="flex items-center justify-center p-2 rounded-lg hover:bg-[#162228] text-[#22C55E] transition-colors cursor-pointer min-h-[36px]"
            title="Cross-Role Real-Time Sync Monitor"
            id="sidebar-sync-mesh-button"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Biometric Security Sovereign Vault */}
          <button
            onClick={() => {
              if (isSensitiveDataLocked) {
                setIsBiometricModalOpen(true);
              } else {
                toggleSensitiveDataLock();
              }
            }}
            className={`flex items-center justify-center p-2 rounded-lg transition-colors cursor-pointer min-h-[36px] ${
              isSensitiveDataLocked
                ? "bg-[#2A1515] text-red-400 ring-1 ring-red-500/50"
                : "hover:bg-[#162228] text-emerald-400"
            }`}
            title={
              isSensitiveDataLocked
                ? "Vault Locked (TouchID/FaceID). Click to authenticate."
                : "Biometrics Active. Click to lock sensitive financial data."
            }
            id="sidebar-biometric-button"
          >
            <Fingerprint className="w-4 h-4" />
          </button>

          {/* Offline Mode Switcher */}
          <button
            onClick={toggleOfflineMode}
            className={`flex items-center justify-center p-2 rounded-lg transition-colors cursor-pointer relative min-h-[36px] ${
              isOffline
                ? "bg-[#2A180E] text-[#F5B942] ring-1 ring-amber-600/50"
                : "hover:bg-[#162228] text-slate-300"
            }`}
            title={isOffline ? "Currently Offline. Click to go online." : "Online. Click to test offline sync."}
            id="sidebar-offline-button"
          >
            {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
            {syncQueue.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#F5B942] text-slate-900 font-mono text-[9px] font-bold flex items-center justify-center">
                {syncQueue.length}
              </span>
            )}
          </button>

          {/* Notifications Drawer */}
          <button
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="flex items-center justify-center p-2 rounded-lg hover:bg-[#162228] text-slate-300 hover:text-white transition-colors cursor-pointer relative min-h-[36px]"
            title="Notification Center"
            id="sidebar-notification-button"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F5B942] ring-2 ring-[#10171B] animate-pulse" />
            )}
          </button>
        </div>

        {/* 3. 54-Country & Currency Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setIsCountryMenuOpen(!isCountryMenuOpen);
              setIsSimulationMenuOpen(false);
              setIsRoleMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl bg-[#10171B] hover:bg-[#162228] border border-[#1D2A32] text-xs text-slate-200 transition-colors cursor-pointer min-h-[38px]"
            id="sidebar-country-selector-button"
            title="Switch Operating Territory (54 African Nations)"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#162228] text-emerald-400 border border-[#22392E] shrink-0">
                {selectedCountry.code}
              </span>
              <span className="text-white font-medium truncate">{selectedCountry.name}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-emerald-400 font-mono text-[11px]">({selectedCountry.currency})</span>
              {isCountryMenuOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </div>
          </button>

          {/* Expandable Country Selector List */}
          {isCountryMenuOpen && (
            <div className="mt-1.5 bg-[#10171B] rounded-xl border border-[#1D2A32] p-2 max-h-56 overflow-y-auto space-y-1 shadow-2xl animate-in fade-in">
              <div className="flex items-center justify-between pb-1 border-b border-[#19262F] mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Country (54 Nations)
                </span>
                <button
                  onClick={() => setIsCountryMenuOpen(false)}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                placeholder="Filter nations..."
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#070B0E] border border-[#1D2A32] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 mb-1"
              />
              <div className="space-y-0.5 max-h-40 overflow-y-auto">
                {filteredCountries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setSelectedCountry(c);
                      setIsCountryMenuOpen(false);
                      setCountryFilter("");
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                      selectedCountry.code === c.code
                        ? "bg-[#07261B] text-emerald-300 font-bold border-l-2 border-emerald-400"
                        : "text-slate-300 hover:bg-[#162228] hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#162228] text-emerald-400 border border-[#22392E] shrink-0">{c.code}</span>
                      <span className="truncate">{c.name}</span>
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400/80 shrink-0">
                      {c.currency}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Logged-In User Profile & Persona Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setIsRoleMenuOpen(!isRoleMenuOpen);
              setIsCountryMenuOpen(false);
              setIsSimulationMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl bg-[#10171B] hover:bg-[#162228] border border-[#1D2A32] text-xs text-slate-200 transition-colors cursor-pointer min-h-[44px]"
            id="sidebar-user-role-button"
            title="User Profile & Ecosystem Role"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 shadow-xs border"
                style={{
                  backgroundColor: `${activeRoleConfig.accentColor}25`,
                  borderColor: `${activeRoleConfig.accentColor}50`,
                  color: activeRoleConfig.accentColor,
                }}
              >
                {currentUser?.avatarInitials || "UX"}
              </div>
              <div className="text-left truncate">
                <div className="font-bold text-white leading-tight capitalize truncate">
                  {currentUser?.name || "Active Operator"}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold capitalize leading-none truncate mt-0.5">
                  {activeRoleConfig.label}
                </div>
              </div>
            </div>
            {isRoleMenuOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
          </button>

          {/* Expandable Role Selection & Auth Panel */}
          {isRoleMenuOpen && (
            <div className="mt-1.5 bg-[#10171B] rounded-xl border border-[#1D2A32] p-2.5 space-y-2 shadow-2xl animate-in fade-in">
              <div className="flex items-center justify-between pb-1 border-b border-[#19262F]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Ecosystem Role Switchboard
                </span>
                <button
                  onClick={() => setIsRoleMenuOpen(false)}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Login / Register Modal trigger */}
              <button
                onClick={() => {
                  openAuthModal("login");
                  setIsRoleMenuOpen(false);
                }}
                className="w-full py-2 px-2.5 rounded-lg bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#1E6B3E]"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#F5B942]" />
                <span>Sign In & Choose Role Webpage</span>
              </button>

              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold pt-1">
                Direct Switch (7 Roles)
              </div>

              <div className="space-y-1 max-h-44 overflow-y-auto">
                {PRIMARY_ROLES.map((r) => {
                  const cfg = ROLE_CONFIGS[r];
                  const isCurrent = userRole === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full px-2 py-1.5 rounded-lg text-xs text-left transition-colors cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? "bg-[#07261B] text-emerald-300 font-bold border-l-2 border-emerald-400"
                          : "text-slate-300 hover:bg-[#162228] hover:text-white"
                      }`}
                    >
                      <span className="truncate">{cfg.label}</span>
                      <span className="text-[9px] font-mono text-slate-400 shrink-0 ml-1">
                        {cfg.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-[#19262F] pt-2 flex items-center justify-between text-[11px]">
                <button
                  onClick={() => {
                    setCurrentView("consent");
                    setIsRoleMenuOpen(false);
                  }}
                  className="text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Data Vault</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  onClick={() => {
                    logoutUser();
                    setIsRoleMenuOpen(false);
                  }}
                  className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
