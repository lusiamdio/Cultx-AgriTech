import React, { Suspense, lazy } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/common/Sidebar";
import { MobileNav } from "./components/common/MobileNav";
import { PanelLeftOpen } from "lucide-react";
import { GlobalSearchModal } from "./components/common/GlobalSearchModal";
import { VoiceModal } from "./components/common/VoiceModal";
import { UssdSimulatorModal } from "./components/common/UssdSimulatorModal";
import { NotificationDrawer } from "./components/common/NotificationDrawer";
import { OfflineSyncBanner } from "./components/common/OfflineSyncBanner";
import { ProgressiveOnboarding } from "./components/onboarding/ProgressiveOnboarding";
import { EfficiencyHUD } from "./components/common/EfficiencyHUD";
import { ViewLoadingSkeleton } from "./components/common/ViewLoadingSkeleton";

// Core View
import { LandingPage } from "./components/landing/LandingPage";

// Production Lazy-Loaded Views for High Performance & Micro-Bundle Splitting
const HomeCommandCenter = lazy(() =>
  import("./components/dashboard/HomeCommandCenter").then((m) => ({ default: m.HomeCommandCenter }))
);
const FarmerDashboard = lazy(() =>
  import("./components/dashboard/FarmerDashboard").then((m) => ({ default: m.FarmerDashboard }))
);
const FarmTwinView = lazy(() =>
  import("./components/farms/FarmTwinView").then((m) => ({ default: m.FarmTwinView }))
);
const PrecisionAgriView = lazy(() =>
  import("./components/farms/PrecisionAgriView").then((m) => ({ default: m.PrecisionAgriView }))
);
const ClimateDashboard = lazy(() =>
  import("./components/climate/ClimateDashboard").then((m) => ({ default: m.ClimateDashboard }))
);
const MarketplaceView = lazy(() =>
  import("./components/marketplace/MarketplaceView").then((m) => ({ default: m.MarketplaceView }))
);
const FinanceView = lazy(() =>
  import("./components/finance/FinanceView").then((m) => ({ default: m.FinanceView }))
);
const LogisticsView = lazy(() =>
  import("./components/logistics/LogisticsView").then((m) => ({ default: m.LogisticsView }))
);
const ExportTradeView = lazy(() =>
  import("./components/trade/ExportTradeView").then((m) => ({ default: m.ExportTradeView }))
);
const GovernmentView = lazy(() =>
  import("./components/government/GovernmentView").then((m) => ({ default: m.GovernmentView }))
);
const CooperativeView = lazy(() =>
  import("./components/cooperative/CooperativeView").then((m) => ({ default: m.CooperativeView }))
);
const AgribusinessView = lazy(() =>
  import("./components/agribusiness/AgribusinessView").then((m) => ({ default: m.AgribusinessView }))
);
const DataConsentView = lazy(() =>
  import("./components/consent/DataConsentView").then((m) => ({ default: m.DataConsentView }))
);
const SuperAdminView = lazy(() =>
  import("./components/admin/SuperAdminView").then((m) => ({ default: m.SuperAdminView }))
);
const CropDoctorView = lazy(() =>
  import("./components/copilot/CropDoctorView").then((m) => ({ default: m.CropDoctorView }))
);

// Auxiliary Modals & Assistants
import { FloatingAICopilot } from "./components/copilot/FloatingAICopilot";
import { BiometricAuthModal } from "./components/common/BiometricAuthModal";
import { AuthModal } from "./components/auth/AuthModal";
import { AuthPage } from "./components/auth/AuthPage";
import { CrossRoleSyncMonitor } from "./components/common/CrossRoleSyncMonitor";
import { RoleAccessGuard } from "./components/common/RoleAccessGuard";

const AppContent: React.FC = () => {
  const {
    currentView,
    isUssdModalOpen,
    setIsUssdModalOpen,
    isMenuHidden,
    toggleMenu,
    isBiometricModalOpen,
    setIsBiometricModalOpen,
    setIsSensitiveDataLocked,
    isSyncMonitorOpen,
    setIsSyncMonitorOpen,
  } = useApp();

  const renderActiveView = () => {
    return (
      <RoleAccessGuard viewId={currentView}>
        <Suspense fallback={<ViewLoadingSkeleton viewId={currentView} />}>
          {(() => {
            switch (currentView) {
              case "landing":
                return <LandingPage />;
              case "dashboard":
              case "home":
                return <HomeCommandCenter />;
              case "farms":
              case "farmer":
              case "farmers":
                return <FarmerDashboard />;
              case "farm_twin":
              case "farm-twin":
                return <FarmTwinView />;
              case "precision_ag":
              case "precision":
                return <PrecisionAgriView />;
              case "crop_doctor":
              case "crop-doctor":
                return <CropDoctorView />;
              case "marketplace":
                return <MarketplaceView />;
              case "finance":
                return <FinanceView />;
              case "logistics":
                return <LogisticsView />;
              case "climate":
                return <ClimateDashboard />;
              case "trade":
                return <ExportTradeView />;
              case "government":
                return <GovernmentView />;
              case "cooperative":
                return <CooperativeView />;
              case "agribusiness":
                return <AgribusinessView />;
              case "consent":
                return <DataConsentView />;
              case "admin":
                return <SuperAdminView />;
              case "auth":
              case "login":
              case "signup":
                return <AuthPage />;
              default:
                return <HomeCommandCenter />;
            }
          })()}
        </Suspense>
      </RoleAccessGuard>
    );
  };

  // When on Auth view, render fully branded webpage experience without standard app shell
  if (currentView === "auth" || currentView === "login" || currentView === "signup") {
    return (
      <div className="min-h-screen bg-[#070B0E] text-slate-100 font-sans selection:bg-emerald-600 selection:text-white relative">
        <OfflineSyncBanner />
        <AuthPage />
        <EfficiencyHUD />
        <GlobalSearchModal />
        <VoiceModal />
        <UssdSimulatorModal isOpen={isUssdModalOpen} onClose={() => setIsUssdModalOpen(false)} />
      </div>
    );
  }

  // When on Landing view, render full landing experience without standard app shell
  if (currentView === "landing") {
    return (
      <div className="min-h-screen bg-[#090D0F] text-slate-100 font-sans selection:bg-emerald-600 selection:text-white relative">
        <OfflineSyncBanner />
        <LandingPage />
        <EfficiencyHUD />
        <GlobalSearchModal />
        <VoiceModal />
        <UssdSimulatorModal isOpen={isUssdModalOpen} onClose={() => setIsUssdModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#090D0F] text-slate-100 font-sans flex flex-col selection:bg-emerald-600 selection:text-white overflow-hidden relative">
      {/* Offline Connectivity Banner */}
      <OfflineSyncBanner />

      {/* Floating Re-Open Menu Button when sidebar is hidden */}
      {isMenuHidden && (
        <button
          onClick={toggleMenu}
          className="fixed top-3 left-3 z-50 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold shadow-2xl border border-[#14533C] transition-all cursor-pointer"
          id="floating-show-menu-button"
          title="Show Navigation & Tools Menu"
        >
          <PanelLeftOpen className="w-4 h-4 text-emerald-300" />
          <span className="hidden sm:inline">Show Menu & Tools</span>
        </button>
      )}

      {/* Desktop and Mobile Operational Workspace */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Desktop Sidebar Navigation with Integrated Platform Tools & Copilot */}
        {!isMenuHidden && <Sidebar />}

        {/* Primary Operational Viewport with Fluid Motion Transitions - Single Scroll Container */}
        <main className="flex-1 overflow-y-auto main-scroll-container p-3 sm:p-5 lg:p-7 max-w-7xl mx-auto w-full flex flex-col justify-start pb-20 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* System Efficiency & Edge Mesh Telemetry HUD */}
      <EfficiencyHUD />

      {/* Global Modals & Advisory Assistants */}
      <GlobalSearchModal />
      <VoiceModal />
      <UssdSimulatorModal isOpen={isUssdModalOpen} onClose={() => setIsUssdModalOpen(false)} />
      <FloatingAICopilot />
      <NotificationDrawer />
      <ProgressiveOnboarding />
      <BiometricAuthModal
        isOpen={isBiometricModalOpen}
        onClose={() => setIsBiometricModalOpen(false)}
        onSuccess={() => setIsSensitiveDataLocked(false)}
      />
      <CrossRoleSyncMonitor
        isOpen={isSyncMonitorOpen}
        onClose={() => setIsSyncMonitorOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
