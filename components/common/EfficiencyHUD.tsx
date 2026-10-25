import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  Wifi,
  WifiOff,
  Database,
  RefreshCw,
  Phone,
  ShieldCheck,
  Scale,
  Sparkles,
  ChevronUp,
  ChevronDown,
  X,
  CheckCircle2,
  Cpu,
  Layers,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { performanceTelemetry, SystemEfficiencyMetrics } from "../../utils/performanceMetrics";
import { offlineStorage, StorageDiagnostics } from "../../utils/indexedDbStorage";

export const EfficiencyHUD: React.FC = () => {
  const { isOffline, toggleOfflineMode, syncQueue, triggerManualSync, setIsUssdModalOpen } = useApp();
  const [metrics, setMetrics] = useState<SystemEfficiencyMetrics>(performanceTelemetry.getMetrics());
  const [diagnostics, setDiagnostics] = useState<StorageDiagnostics | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSimulatingOracle, setIsSimulatingOracle] = useState(false);
  const [oracleResult, setOracleResult] = useState<any>(null);
  const [isSimulatingAggr, setIsSimulatingAggr] = useState(false);
  const [aggrResult, setAggrResult] = useState<any>(null);

  useEffect(() => {
    const unsub = performanceTelemetry.subscribe((newMetrics) => {
      setMetrics(newMetrics);
    });

    const updateDiag = async () => {
      const diag = await offlineStorage.getDiagnostics();
      setDiagnostics(diag);
    };
    updateDiag();
    const interval = setInterval(updateDiag, 10000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [syncQueue]);

  const handleRunWeighbridgeOracle = async () => {
    setIsSimulatingOracle(true);
    setOracleResult(null);
    try {
      const res = await fetch("/api/oracles/weighbridge-escrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractNumber: "AGRI-CTR-2026-8812",
          commodity: "Grade-A White Maize",
          contractTonnage: 30.0,
          grossWeightKg: 42800,
          tareWeightKg: 12600,
          moisturePct: 12.1,
          foreignMatterPct: 0.8,
          warehouseGeofenceId: "HUB-ELDORET-SILO-04",
          transporterPlate: "KDA-482M",
        }),
      });
      const data = await res.json();
      setOracleResult(data);
    } catch (e) {
      console.warn("Oracle error", e);
    } finally {
      setIsSimulatingOracle(false);
    }
  };

  const handleRunAggregationOptimizer = async () => {
    setIsSimulatingAggr(true);
    setAggrResult(null);
    try {
      const res = await fetch("/api/aggregations/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetConsignmentTonnage: 30.0,
          commodity: "White Maize",
        }),
      });
      const data = await res.json();
      setAggrResult(data);
    } catch (e) {
      console.warn("Aggregation error", e);
    } finally {
      setIsSimulatingAggr(false);
    }
  };

  return (
    <>
      {/* Floating Compact Dock Pill */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <motion.div
          layout
          className="flex items-center gap-2 bg-[#0C1317]/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/30 text-xs shadow-xl text-slate-200"
        >
          {/* Edge Latency */}
          <div className="flex items-center gap-1.5 pr-2 border-r border-slate-700/60">
            <span
              className={`w-2 h-2 rounded-full ${
                isOffline ? "bg-amber-400 animate-pulse" : metrics.edgeLatencyMs < 100 ? "bg-emerald-400 animate-ping" : "bg-sky-400"
              }`}
            />
            <span className="font-mono text-[11px] text-slate-300">
              {isOffline ? "OFFLINE" : `${metrics.edgeLatencyMs}ms`}
            </span>
          </div>

          {/* Connection Type */}
          <div className="flex items-center gap-1 text-[11px] text-slate-400 hidden sm:flex">
            {isOffline ? (
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="uppercase font-mono text-[10px]">{metrics.connectionType}</span>
          </div>

          {/* Sync Queue Badge */}
          {syncQueue.length > 0 && (
            <button
              onClick={triggerManualSync}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold cursor-pointer hover:bg-amber-500/30 transition-colors"
            >
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>{syncQueue.length} queued</span>
            </button>
          )}

          {/* Toggle Expand */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold pl-1 cursor-pointer transition-colors"
            title="Open Efficiency & Operations HUD"
          >
            <span>Ops HUD</span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </motion.div>
      </div>

      {/* Expanded Modal / Flyout */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-16 right-4 z-40 w-96 max-w-[calc(100vw-2rem)] bg-[#0A1014]/98 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl p-4 text-slate-200 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  System Efficiency & Edge Mesh
                </h3>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 my-3">
              <div className="bg-[#121A20] p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  Edge Round-Trip
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    {metrics.edgeLatencyMs}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">ms (Fast)</span>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block">Sub-100ms Pan-Africa target</span>
              </div>

              <div className="bg-[#121A20] p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  Offline Engine
                </span>
                <div className="flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-white">IndexedDB Active</span>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block">
                  {diagnostics?.queuedActionsCount || syncQueue.length} uncommitted mutations
                </span>
              </div>
            </div>

            {/* Protocols Active */}
            <div className="bg-[#0E161C] p-2.5 rounded-xl border border-slate-800/60 mb-3 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  PWA Service Worker:
                </span>
                <span className="text-emerald-400 font-mono font-medium">CacheFirst / Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-sky-400" />
                  API Semantic Caching:
                </span>
                <span className="text-sky-400 font-mono font-medium">In-Memory TTL 1h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-amber-400" />
                  Connection Mode:
                </span>
                <span className="text-white font-mono font-medium uppercase">
                  {isOffline ? "Simulated Offline" : metrics.connectionType}
                </span>
              </div>
            </div>

            {/* Operational Actions */}
            <div className="space-y-2">
              {/* Force Manual Sync */}
              <button
                onClick={triggerManualSync}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Flush & Batch Reconcile Mesh
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {syncQueue.length} items
                </span>
              </button>

              {/* Toggle Simulated Offline */}
              <button
                onClick={toggleOfflineMode}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60 text-xs font-medium cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2">
                  {isOffline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
                  {isOffline ? "Reconnect Online Mesh" : "Test Offline Resilience (2G/Cutoff)"}
                </span>
              </button>

              {/* Trigger Smart Oracle Weighbridge Settlement */}
              <button
                onClick={handleRunWeighbridgeOracle}
                disabled={isSimulatingOracle}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium cursor-pointer transition-colors disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  <Scale className="w-3.5 h-3.5" />
                  {isSimulatingOracle ? "Evaluating Weighbridge..." : "Test Instant Weighbridge Escrow Oracle"}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </button>

              {/* Trigger Smallholder Grain Pooling Optimizer */}
              <button
                onClick={handleRunAggregationOptimizer}
                disabled={isSimulatingAggr}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 text-xs font-medium cursor-pointer transition-colors disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" />
                  {isSimulatingAggr ? "Optimizing Consignments..." : "Run Micro-Lot Pooling Optimizer"}
                </span>
                <span className="text-[10px] font-mono text-teal-400">30 MT Truckload</span>
              </button>

              {/* Launch USSD Feature Phone Simulator */}
              <button
                onClick={() => {
                  setIsExpanded(false);
                  setIsUssdModalOpen(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-medium cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  Launch Feature-Phone USSD Simulator
                </span>
                <span className="text-[10px] font-mono text-amber-400">*384*2858#</span>
              </button>
            </div>

            {/* Oracle Simulation Result Popup */}
            {oracleResult && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] space-y-1 animate-in fade-in">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Oracle Verified & Escrow Released
                  </span>
                  <span className="font-mono text-xs">${oracleResult.escrowPayout?.amountUSD}</span>
                </div>
                <p className="text-slate-300 text-[10px]">
                  Delivered: {oracleResult.telemetryValidation?.weighbridgeNetTonnage} MT (Moisture {oracleResult.telemetryValidation?.moisturePct}%)
                </p>
                <p className="text-[9px] font-mono text-slate-400 truncate">
                  Tx: {oracleResult.escrowPayout?.settlementTxId}
                </p>
              </div>
            )}

            {/* Aggregation Result Popup */}
            {aggrResult && (
              <div className="mt-3 p-2.5 rounded-xl bg-teal-950/60 border border-teal-500/40 text-[11px] space-y-1 animate-in fade-in">
                <div className="flex items-center justify-between text-teal-300 font-bold">
                  <span>Batch Consignment #{aggrResult.consignmentId?.slice(-6)}</span>
                  <span className="font-mono text-xs">{aggrResult.aggregatedTonnes} MT</span>
                </div>
                <p className="text-slate-300 text-[10px]">
                  Pooled {aggrResult.totalFarmersPooled} farmers • {aggrResult.efficiencyGains?.deadheadReductionKm} km saved • {aggrResult.efficiencyGains?.co2AbatedKg} kg CO2 abated
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
