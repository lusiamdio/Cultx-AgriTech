import React, { useState } from "react";
import {
  X,
  Zap,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Layers,
  Sprout,
  Building2,
  ShoppingBag,
  Users2,
  Truck,
  Coins,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PRIMARY_ROLES, ROLE_CONFIGS } from "../../utils/rbac";

export const CrossRoleSyncMonitor: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { syncEvents, broadcastSyncEvent, userRole, setCurrentView } = useApp();
  const [isSimulatingMesh, setIsSimulatingMesh] = useState(false);

  if (!isOpen) return null;

  const handleSimulateFullMeshFlow = () => {
    setIsSimulatingMesh(true);

    // 1. Farmer initiates crop harvest listing
    broadcastSyncEvent({
      sourceRole: "farmer",
      sourceEntity: "Kakuzi Agro Smallholders (Kenya)",
      targetRoles: ["agribusiness", "buyer", "cooperative"],
      actionType: "listing_created",
      title: "Harvest Listed: 40 MT Premium White Maize",
      details: "Moisture 12.5%, Codex Grade A, verified in Nakuru Hub Silos ($275/MT).",
    });

    setTimeout(() => {
      // 2. Buyer issues forward contract
      broadcastSyncEvent({
        sourceRole: "buyer",
        sourceEntity: "Nile Milling & Grain (Egypt)",
        targetRoles: ["farmer", "logistics", "finance"],
        actionType: "contract_issued",
        title: "Purchase Contract #CT-2026-94 Issued",
        details: "40 MT grain offtake locked. Escrow funds deposited at AfDev Bank ($11,000 USD).",
      });
    }, 900);

    setTimeout(() => {
      // 3. Logistics dispatches cold chain truck
      broadcastSyncEvent({
        sourceRole: "logistics",
        sourceEntity: "Savannah Cold Transit (Ghana)",
        targetRoles: ["buyer", "farmer", "logistics"],
        actionType: "logistics_dispatched",
        title: "Fleet Dispatched: Reefer Truck #GH-8422",
        details: "Mombasa Corridor to Cairo transit booked. Cold chain IoT active at 18.4°C.",
      });
    }, 1800);

    setTimeout(() => {
      // 4. Finance approves receivable factoring
      broadcastSyncEvent({
        sourceRole: "finance",
        sourceEntity: "Pan-African AgDev Bank",
        targetRoles: ["farmer", "cooperative"],
        actionType: "finance_approved",
        title: "Immediate 80% Invoice Factoring Disbursed",
        details: "$8,800 USD released to Kakuzi Smallholder cooperative bank wallet.",
      });
    }, 2700);

    setTimeout(() => {
      // 5. Ministry registers national food balance index
      broadcastSyncEvent({
        sourceRole: "government",
        sourceEntity: "Federal Ministry of Agriculture",
        targetRoles: ["government", "agribusiness", "buyer"],
        actionType: "policy_decree",
        title: "National Grain Reserve Balanced",
        details: "AfCFTA Duty-Free Certificate #AC-8291 recorded in national export ledger.",
      });
      setIsSimulatingMesh(false);
    }, 3600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
      <div className="bg-[#0B1013] border border-[#1E2E38] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto relative">
        <div className="h-1.5 bg-gradient-to-r from-[#22C55E] via-[#06B6D4] to-[#F5B942]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#1A2832] flex items-center justify-between bg-[#080D0F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base sm:text-lg">
                  Ecosystem Real-Time Synchronization Mesh
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40">
                  7 Roles Synced
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Shared transactional bus linking production, procurement, freight, finance & policy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#10171B] text-slate-400 hover:text-white hover:bg-[#162228] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7 Connected Roles Grid */}
        <div className="p-5 sm:p-6 border-b border-[#1A2832] bg-[#0E151A]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Synchronized Ecosystem Nodes (7 Primary Roles)
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              All Nodes Online
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRIMARY_ROLES.map((r) => {
              const cfg = ROLE_CONFIGS[r];
              const isCurrent = userRole === r;
              return (
                <div
                  key={r}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    isCurrent
                      ? "bg-[#07261B] border-[#22C55E] ring-1 ring-[#22C55E]/50"
                      : "bg-[#10171B] border-[#1C2A34]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white truncate">{cfg.badge}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[9px] text-slate-400 truncate mt-0.5">{cfg.label}</div>
                  {isCurrent && (
                    <span className="text-[8px] font-mono text-emerald-400 font-bold block mt-1">
                      ● Active Session
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Synchronized Event Stream */}
        <div className="p-5 sm:p-6 max-h-[40vh] overflow-y-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">
              Live Inter-Role Transactions & Synchronized Broadcasts
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {syncEvents.length} Recent Cross-Role Events
            </span>
          </div>

          {syncEvents.map((evt) => {
            const sourceCfg = ROLE_CONFIGS[evt.sourceRole] || ROLE_CONFIGS.farmer;
            return (
              <div
                key={evt.id}
                className="p-3 rounded-2xl bg-[#10171B] border border-[#1C2A34] text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold"
                      style={{
                        backgroundColor: `${sourceCfg.accentColor}20`,
                        color: sourceCfg.accentColor,
                      }}
                    >
                      {sourceCfg.badge}: {evt.sourceEntity}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <div className="flex items-center gap-1">
                      {evt.targetRoles.map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#18232B] text-slate-300"
                        >
                          {ROLE_CONFIGS[t]?.badge || t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{evt.timestamp}</span>
                </div>

                <div className="font-bold text-white text-xs">{evt.title}</div>
                <div className="text-[11px] text-slate-300">{evt.details}</div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 sm:p-5 border-t border-[#1A2832] bg-[#080D0F] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleSimulateFullMeshFlow}
            disabled={isSimulatingMesh}
            className="px-4 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer border border-[#1E6B3E] min-h-[40px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#F5B942] ${isSimulatingMesh ? "animate-spin" : ""}`} />
            <span>{isSimulatingMesh ? "Propagating 5-Stage Mesh..." : "Trigger Full 7-Role Sync Flow"}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#162228] hover:bg-[#1D2A32] text-slate-200 text-xs font-semibold transition-colors cursor-pointer min-h-[40px]"
          >
            Close Monitor
          </button>
        </div>
      </div>
    </div>
  );
};
