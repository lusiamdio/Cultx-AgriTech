import React, { useState } from "react";
import {
  LayoutDashboard,
  Sprout,
  ShoppingBag,
  MessageSquare,
  Menu,
  X,
  Stethoscope,
  CloudSunRain,
  Coins,
  Truck,
  Globe2,
  Landmark,
  ShieldCheck,
  Search,
  Mic,
  Smartphone,
  Bell,
  RefreshCw,
  UserCheck,
  Users2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { isViewAllowedForRole, ROLE_CONFIGS } from "../../utils/rbac";

export const MobileNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setIsCopilotOpen,
    setIsVoiceModalOpen,
    setIsUssdModalOpen,
    setIsSearchModalOpen,
    setIsNotificationDrawerOpen,
    unreadNotificationCount,
    userRole,
    currentUser,
    openAuthModal,
    setIsSyncMonitorOpen,
  } = useApp();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const activeRoleConfig = ROLE_CONFIGS[userRole] || ROLE_CONFIGS.farmer;

  const allDrawerItems = [
    { id: "crop_doctor", label: "Crop Doctor", icon: Stethoscope },
    { id: "climate", label: "Climate Intel", icon: CloudSunRain },
    { id: "finance", label: "Agri-Finance", icon: Coins },
    { id: "logistics", label: "Logistics & Silos", icon: Truck },
    { id: "trade", label: "AfCFTA Trade", icon: Globe2 },
    { id: "cooperative", label: "Cooperative Hub", icon: Users2 },
    { id: "government", label: "Gov Policy", icon: Landmark },
    { id: "agribusiness", label: "Agribusiness", icon: LayoutDashboard },
    { id: "consent", label: "Data Sovereignty & Vault", icon: ShieldCheck, fullWidth: true },
  ];

  // RBAC Filter: Only show views permitted for this role
  const allowedDrawerItems = allDrawerItems.filter((item) => isViewAllowedForRole(item.id, userRole));

  return (
    <>
      {/* More Drawer on Mobile */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end lg:hidden animate-in fade-in">
          <div className="bg-[#0B1013] rounded-t-3xl p-5 text-white max-h-[85vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1D2A32]">
              <div className="flex items-center gap-2">
                <img
                  src="/cultx_logo.png"
                  alt="CULTx"
                  className="w-7 h-7 rounded-lg object-contain shadow-xs"
                />
                <div>
                  <span className="font-extrabold text-sm text-white">CULTx Workspace</span>
                  <span className="text-[10px] text-emerald-400 block font-medium">
                    {activeRoleConfig.label}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-2 rounded-xl bg-[#10171B] text-slate-400 hover:text-white cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active User Card & Quick Role Switch */}
            <div className="p-3 rounded-2xl bg-[#10171B] border border-[#1E2E38] flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 border"
                  style={{
                    backgroundColor: `${activeRoleConfig.accentColor}25`,
                    borderColor: `${activeRoleConfig.accentColor}50`,
                    color: activeRoleConfig.accentColor,
                  }}
                >
                  {currentUser?.avatarInitials || "UX"}
                </div>
                <div className="truncate">
                  <div className="font-bold text-xs text-white truncate">
                    {currentUser?.name || "Active Operator"}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {currentUser?.organization}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setIsSyncMonitorOpen(true);
                    setIsMoreMenuOpen(false);
                  }}
                  className="p-2 rounded-xl bg-[#07261B] text-emerald-300 border border-[#14533C] min-h-[38px] flex items-center gap-1 text-[10px] font-bold"
                  title="View Sync Mesh"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync</span>
                </button>
                <button
                  onClick={() => {
                    openAuthModal("login");
                    setIsMoreMenuOpen(false);
                  }}
                  className="px-2.5 py-2 rounded-xl bg-[#14532D] text-white text-[10px] font-bold min-h-[38px] flex items-center gap-1 border border-[#1E6B3E]"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#F5B942]" />
                  <span>Switch</span>
                </button>
              </div>
            </div>

            {/* Mobile Platform Tools Strip */}
            <div className="grid grid-cols-4 gap-2 py-2 border-y border-[#1D2A32]">
              <button
                onClick={() => {
                  setIsSearchModalOpen(true);
                  setIsMoreMenuOpen(false);
                }}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#10171B] hover:bg-[#162228] text-slate-300 min-h-[44px]"
              >
                <Search className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="text-[10px]">Search</span>
              </button>
              <button
                onClick={() => {
                  setIsVoiceModalOpen(true);
                  setIsMoreMenuOpen(false);
                }}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#10171B] hover:bg-[#162228] text-slate-300 min-h-[44px]"
              >
                <Mic className="w-4 h-4 text-[#F5B942] mb-1" />
                <span className="text-[10px]">Voice</span>
              </button>
              <button
                onClick={() => {
                  setIsUssdModalOpen(true);
                  setIsMoreMenuOpen(false);
                }}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#10171B] hover:bg-[#162228] text-slate-300 min-h-[44px]"
              >
                <Smartphone className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="text-[10px]">2G USSD</span>
              </button>
              <button
                onClick={() => {
                  setIsNotificationDrawerOpen(true);
                  setIsMoreMenuOpen(false);
                }}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#10171B] hover:bg-[#162228] text-slate-300 relative min-h-[44px]"
              >
                <Bell className="w-4 h-4 text-slate-300 mb-1" />
                <span className="text-[10px]">Alerts</span>
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-[#F5B942] ring-2 ring-[#10171B] animate-pulse" />
                )}
              </button>
            </div>

            {/* Role-Filtered Workspace Features */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Permitted Features for {activeRoleConfig.label} ({allowedDrawerItems.length})
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                {allowedDrawerItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        setIsMoreMenuOpen(false);
                      }}
                      className={`p-3 rounded-2xl bg-[#10171B] hover:bg-[#162228] border border-[#1D2A32] flex items-center gap-2.5 text-left text-white cursor-pointer min-h-[48px] ${
                        item.fullWidth ? "col-span-2 bg-[#07261B] border-[#14533C] text-emerald-300" : ""
                      }`}
                    >
                      <div className="w-7 h-7 rounded-xl bg-[#08130E] border border-[#14533C] flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B1013]/95 backdrop-blur-md lg:hidden px-3 py-2 shadow-2xl border-t border-[#19262F]">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setCurrentView(activeRoleConfig.primaryView)}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 text-[10px] font-semibold transition-colors min-h-[44px] justify-center cursor-pointer ${
              currentView === activeRoleConfig.primaryView ? "text-white font-bold" : "text-slate-400"
            }`}
          >
            <LayoutDashboard
              className={`w-5 h-5 ${currentView === activeRoleConfig.primaryView ? "text-emerald-400" : "text-slate-400"}`}
            />
            <span>Workspace</span>
          </button>

          {isViewAllowedForRole("farms", userRole) && (
            <button
              onClick={() => setCurrentView("farms")}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 text-[10px] font-semibold transition-colors min-h-[44px] justify-center cursor-pointer ${
                currentView === "farms" ? "text-white font-bold" : "text-slate-400"
              }`}
            >
              <Sprout
                className={`w-5 h-5 ${currentView === "farms" ? "text-emerald-400" : "text-slate-400"}`}
              />
              <span>Farms</span>
            </button>
          )}

          {/* Prominent Center Copilot Button */}
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="flex flex-col items-center -mt-6 cursor-pointer"
            id="mobile-copilot-prominent-button"
          >
            <div className="w-13 h-13 rounded-full bg-[#0B3D2C] text-white flex items-center justify-center shadow-xl ring-4 ring-[#0B1013] active:scale-95 transition-transform">
              <MessageSquare className="w-5 h-5 text-emerald-300" />
            </div>
            <span className="text-[10px] font-bold text-white mt-1">Copilot</span>
          </button>

          {isViewAllowedForRole("marketplace", userRole) && (
            <button
              onClick={() => setCurrentView("marketplace")}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 text-[10px] font-semibold transition-colors min-h-[44px] justify-center cursor-pointer ${
                currentView === "marketplace" ? "text-white font-bold" : "text-slate-400"
              }`}
            >
              <ShoppingBag
                className={`w-5 h-5 ${currentView === "marketplace" ? "text-emerald-400" : "text-slate-400"}`}
              />
              <span>Market</span>
            </button>
          )}

          <button
            onClick={() => setIsMoreMenuOpen(true)}
            className="flex flex-col items-center gap-1 py-1.5 px-3 text-[10px] font-semibold text-slate-400 hover:text-white min-h-[44px] justify-center cursor-pointer"
          >
            <Menu className="w-5 h-5" />
            <span>More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
