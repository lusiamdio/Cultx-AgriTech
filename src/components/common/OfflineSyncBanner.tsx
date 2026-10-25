import React, { useState, useEffect } from "react";
import {
  WifiOff,
  RefreshCw,
  Activity,
  Radio,
  AlertCircle,
  Database,
  ChevronRight,
  Eye,
  Sliders,
  X,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useOfflineActivityLogs } from "../../utils/offlineActivityLogger";
import { OfflineActivityLog } from "./OfflineActivityLog";

export const OfflineSyncBanner: React.FC = () => {
  const { isOffline, toggleOfflineMode, syncQueue, triggerManualSync } = useApp();
  const { failedCount, logs } = useOfflineActivityLogs();
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isDismissedOnline, setIsDismissedOnline] = useState(false);
  const [heartbeatTick, setHeartbeatTick] = useState(0);

  // Rhythmic heartbeat ticker for background sync visualization
  useEffect(() => {
    if (isOffline) return;
    const interval = setInterval(() => {
      setHeartbeatTick((t) => (t + 1) % 60);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOffline]);

  const pendingCount = syncQueue.filter((item) => item.status !== "synced").length;
  const hasPendingOrFailed = pendingCount > 0 || failedCount > 0;

  // Render when offline OR when there are pending/failed items OR when online and not dismissed
  return (
    <>
      {isOffline ? (
        /* OFFLINE STATE BANNER */
        <aside aria-label="Offline Mode Active" className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-100 px-3.5 sm:px-4 py-2 text-xs border-b border-amber-700/60 shadow-md transition-all animate-in slide-in-from-top-2 relative z-40">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 font-bold text-amber-300">
                <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
                OFFLINE MODE ACTIVE:
              </span>
              <span className="text-amber-200 hidden md:inline">
                Telemetry, digital twins, crop calendars & agronomic advice cached locally in IndexedDB.
              </span>

              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-800/90 text-amber-200 font-mono font-bold text-[11px] border border-amber-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  {pendingCount} Pending
                </span>
              )}

              {failedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 font-mono font-bold text-[11px] border border-rose-800 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                  {failedCount} Failed
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* View Pending Syncs & Activity Log Button */}
              <button
                onClick={() => setIsLogOpen(true)}
                className="px-2.5 py-1 rounded-md bg-amber-800/80 hover:bg-amber-700 text-amber-100 font-semibold text-[11px] border border-amber-600/60 flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                title="View Pending Syncs & Offline Activity Log"
                id="view-pending-syncs-button"
              >
                <Database className="w-3.5 h-3.5 text-amber-300" />
                <span>View Pending Syncs</span>
                {hasPendingOrFailed && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-950 text-amber-200 font-mono font-bold">
                    {pendingCount + failedCount}
                  </span>
                )}
              </button>

              {pendingCount > 0 && (
                <button
                  onClick={triggerManualSync}
                  className="px-2.5 py-1 rounded-md bg-amber-900/90 hover:bg-amber-800 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer border border-amber-700/80"
                >
                  <RefreshCw className="w-3 h-3" />
                  Sync Now
                </button>
              )}

              <button
                onClick={toggleOfflineMode}
                className="px-2.5 py-1 rounded-md bg-amber-950/90 hover:bg-black text-amber-300 font-medium text-[11px] border border-amber-700/80 cursor-pointer"
              >
                Go Online
              </button>
            </div>
          </div>
        </aside>
      ) : (
        /* ONLINE STATE: Heartbeat Animation & Background Sync Indicator */
        !isDismissedOnline && (
          <aside aria-label="Cloud Mesh Synced" className="bg-gradient-to-r from-[#071F16] via-[#0B2E21] to-[#071F16] text-emerald-100 px-3.5 sm:px-4 py-1.5 text-xs border-b border-emerald-800/40 shadow-sm transition-all relative z-40">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
              {/* Subtle Pulsing Animation Heartbeat */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-2">
                  {/* Subtle Double Pulse Heartbeat Beacon */}
                  <div className="relative flex h-2.5 w-2.5 items-center justify-center" title="Live Pan-African Cloud Mesh Heartbeat">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 duration-1000"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                  </div>

                  <span className="font-bold text-emerald-300 flex items-center gap-1.5 tracking-wide text-[11px]">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    MESH HEARTBEAT ACTIVE
                  </span>
                </div>

                <span className="text-emerald-200/80 text-[11px] hidden sm:inline">
                  Connected to Continental Agronomic Cloud Mesh • Latency: ~34ms
                </span>

                {failedCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-rose-950/90 text-rose-300 font-mono font-bold text-[10px] border border-rose-800/80 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-rose-400" />
                    {failedCount} sync {failedCount === 1 ? "attempt" : "attempts"} failed
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    Cycle: {(heartbeatTick % 30) + 1}s / 30s
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* View Pending Syncs & Activity Log Button */}
                <button
                  onClick={() => setIsLogOpen(true)}
                  className={`px-2.5 py-0.8 rounded-md font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm ${
                    failedCount > 0
                      ? "bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800"
                      : "bg-[#0E3D2C] hover:bg-[#124C37] text-emerald-200 border border-emerald-700/60"
                  }`}
                  id="view-pending-syncs-button"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-300" />
                  <span>View Pending Syncs</span>
                  {hasPendingOrFailed && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                        failedCount > 0
                          ? "bg-rose-900 text-rose-100"
                          : "bg-emerald-950 text-emerald-200"
                      }`}
                    >
                      {pendingCount + failedCount}
                    </span>
                  )}
                </button>

                {pendingCount > 0 && (
                  <button
                    onClick={triggerManualSync}
                    className="px-2 py-0.8 rounded-md bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Sync
                  </button>
                )}

                <button
                  onClick={toggleOfflineMode}
                  className="px-2 py-0.8 rounded-md bg-emerald-950/60 hover:bg-emerald-950 text-emerald-300 font-medium text-[11px] border border-emerald-800/50 cursor-pointer hidden md:inline-flex"
                  title="Simulate entering offline mode"
                >
                  Simulate Offline
                </button>

                <button
                  onClick={() => setIsDismissedOnline(true)}
                  className="p-1 rounded text-emerald-400/60 hover:text-emerald-200 hover:bg-emerald-900/40 transition-colors"
                  title="Dismiss online heartbeat banner"
                  aria-label="Dismiss online heartbeat banner"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </aside>
        )
      )}

      {/* Offline Activity Log Modal / Drawer */}
      <OfflineActivityLog isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} />
    </>
  );
};
