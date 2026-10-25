import React, { useState } from "react";
import {
  Globe2,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  Circle,
  TrendingUp,
  Download,
  Building2,
  Sparkles,
  ArrowRight,
  CreditCard,
  Truck,
  Calculator,
  Lock,
  RefreshCw,
  Clock,
  Coins,
  Camera,
  Radio,
  Check,
  ScanLine,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { ExportDossierModal } from "./ExportDossierModal";
import {
  ExportCertificateScannerModal,
  ScannedCertificateData,
} from "./ExportCertificateScannerModal";
import { ExportShipmentTrackingDashboard } from "./ExportShipmentTrackingDashboard";

export const ExportTradeView: React.FC = () => {
  const { currentFarm } = useApp();

  // Navigation tabs within ExportTradeView
  const [activeTab, setActiveTab] = useState<"checklist" | "tracking" | "calculator" | "all">("checklist");

  // Dossier modal state
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [selectedDossierDocId, setSelectedDossierDocId] = useState<string>("phyto");

  // Camera document scanner modal state
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [scannerTargetDocId, setScannerTargetDocId] = useState<string | null>(null);
  const [scanSuccessToast, setScanSuccessToast] = useState<string | null>(null);

  const handleOpenCertificate = (docId: string) => {
    setSelectedDossierDocId(docId);
    setIsDossierModalOpen(true);
  };

  const handleOpenScanner = (docId?: string) => {
    setScannerTargetDocId(docId || null);
    setIsScannerOpen(true);
  };

  // 7 Required AfCFTA Export Documents (Blueprint Section 17)
  const [checklist, setChecklist] = useState([
    { id: "phyto", name: "Phytosanitary Certificate", authority: "NPPO / Ministry of Agriculture", status: "Verified & Digitally Sealed", completed: true },
    { id: "origin", name: "Certificate of Origin (AfCFTA)", authority: "Chamber of Commerce", status: "0% Preferential Duty Granted", completed: true },
    { id: "bol", name: "Multimodal Bill of Lading", authority: "Durban Grain Terminal / Ocean Carrier", status: "Issued #BL-ZA-2026-991", completed: true },
    { id: "invoice", name: "Commercial Invoice (PAPSS E-Invoicing)", authority: "Standard Bank Trade Desk", status: "Pre-cleared with Buyer", completed: true },
    { id: "packing", name: "Verified Packing List", authority: "Cape Farm Packing Station", status: "250 MT in 50kg Bags", completed: true },
    { id: "quality", name: "Quality Inspection Certificate (SAFEX/SGS)", authority: "SGS Agricultural Testing", status: "Moisture 12.1%, Grade 1", completed: true },
    { id: "fumigation", name: "Fumigation & Quarantine Certificate", authority: "Port Health Authority", status: "Phosphine Gas Treated", completed: true },
  ]);

  const handleScanComplete = (docId: string, data: ScannedCertificateData) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === docId
          ? {
              ...item,
              completed: true,
              status: "Digitally Verified & Sealed via Camera OCR",
            }
          : item
      )
    );
    setScanSuccessToast(`Digitized & Verified: ${data.docTitle} (${data.docNumber})`);
    setTimeout(() => setScanSuccessToast(null), 6000);
  };

  // Interactive PAPSS Escrow Lifecycle Tracker
  const [escrowStage, setEscrowStage] = useState<1 | 2 | 3 | 4>(2);
  const [isAdvancingEscrow, setIsAdvancingEscrow] = useState(false);

  // AfCFTA Tariff & Duty Calculator State
  const [calcCorridor, setCalcCorridor] = useState("za_ke");
  const [calcCommodity, setCalcCommodity] = useState("Yellow Maize (HS 1005.90)");
  const [calcTonnage, setCalcTonnage] = useState("200");

  const corridorsData: Record<
    string,
    { name: string; origin: string; dest: string; mfnRate: number; fxSavingPct: number; transitDays: number; origCurr: string; destCurr: string }
  > = {
    za_ke: {
      name: "Durban → Mombasa (Southern-East Africa Corridor)",
      origin: "South Africa",
      dest: "Kenya",
      mfnRate: 25.0,
      fxSavingPct: 4.4,
      transitDays: 8,
      origCurr: "ZAR",
      destCurr: "KES",
    },
    ci_ng: {
      name: "Abidjan → Lagos (Abidjan-Lagos Coastal Corridor)",
      origin: "Côte d'Ivoire",
      dest: "Nigeria",
      mfnRate: 20.0,
      fxSavingPct: 5.1,
      transitDays: 4,
      origCurr: "XOF",
      destCurr: "NGN",
    },
    gh_eg: {
      name: "Tema → Alexandria (West-North Trans-Sahara Route)",
      origin: "Ghana",
      dest: "Egypt",
      mfnRate: 30.0,
      fxSavingPct: 4.8,
      transitDays: 14,
      origCurr: "GHS",
      destCurr: "EGP",
    },
    et_rw: {
      name: "Addis Ababa → Kigali (Northern Corridor Extension)",
      origin: "Ethiopia",
      dest: "Rwanda",
      mfnRate: 18.0,
      fxSavingPct: 3.9,
      transitDays: 6,
      origCurr: "ETB",
      destCurr: "RWF",
    },
    lobito_ao_zm: {
      name: "Ndola / Kolwezi → Port of Lobito (Lobito Atlantic Rail Corridor)",
      origin: "Zambia & DR Congo",
      dest: "Angola (Atlantic Deepwater Port)",
      mfnRate: 22.0,
      fxSavingPct: 6.8,
      transitDays: 2,
      origCurr: "ZMW",
      destCurr: "AOA",
    },
  };

  const currentCorridorInfo = corridorsData[calcCorridor];
  const tons = Number(calcTonnage) || 100;
  const cargoValueUsd = tons * 280; // approx $280/MT
  const mfnDutyUsd = (cargoValueUsd * currentCorridorInfo.mfnRate) / 100;
  const afcftaDutyUsd = 0; // 0% under AfCFTA preferential regime
  const fxSavingsUsd = (cargoValueUsd * currentCorridorInfo.fxSavingPct) / 100;
  const netSavingsUsd = mfnDutyUsd + fxSavingsUsd;

  const completedCount = checklist.filter((d) => d.completed).length;

  const handleAdvanceEscrow = () => {
    setIsAdvancingEscrow(true);
    setTimeout(() => {
      setIsAdvancingEscrow(false);
      setEscrowStage((prev) => (prev < 4 ? ((prev + 1) as 1 | 2 | 3 | 4) : 1));
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Camera Scanner CTA and Navigation Tabs */}
      <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                AfCFTA Trade Corridors & Cross-Border Export Command
              </h2>
              <span className="text-xs font-bold text-emerald-300 bg-[#07261B] px-2.5 py-0.5 rounded-full border border-[#14533C]">
                Zero-Tariff Protocol Active
              </span>
              <span className="text-xs font-bold text-[#F5B942] bg-[#3D2C0D] px-2.5 py-0.5 rounded-full border border-[#785418]">
                Camera OCR Enabled
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Accelerating intra-African agricultural commerce under the African Continental Free Trade Area.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Camera Document Scanner Trigger */}
            <button
              onClick={() => handleOpenScanner()}
              className="px-4 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer border border-[#196349] min-h-[44px]"
              id="camera-scan-certificate-btn"
              title="Open camera to scan and digitize physical certificates"
            >
              <Camera className="w-4 h-4 text-emerald-300" />
              <span>Scan Certificate via Camera</span>
            </button>

            <div className="flex items-center gap-2 bg-[#162228] px-3.5 py-2 rounded-xl border border-[#1D2A32]">
              <div>
                <div className="text-[9px] font-bold uppercase text-slate-400">PAPSS Multi-Currency</div>
                <div className="text-xs font-bold text-white">Instant Local Settlement</div>
              </div>
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Section Navigation Switcher */}
        <div className="pt-2 border-t border-[#1D2A32] flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab("checklist")}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "checklist"
                ? "bg-[#0B3D2C] text-white shadow-xs border border-[#196349]"
                : "text-slate-400 hover:text-white hover:bg-[#162228]"
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>AfCFTA Documentation Checklist ({completedCount}/7)</span>
          </button>

          <button
            onClick={() => setActiveTab("tracking")}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "tracking"
                ? "bg-[#0B3D2C] text-white shadow-xs border border-[#196349]"
                : "text-slate-400 hover:text-white hover:bg-[#162228]"
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Real-Time Shipment Tracking (3 Active)</span>
          </button>

          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "calculator"
                ? "bg-[#0B3D2C] text-white shadow-xs border border-[#196349]"
                : "text-slate-400 hover:text-white hover:bg-[#162228]"
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tariff & Currency Advantage</span>
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "all"
                ? "bg-[#0B3D2C] text-white shadow-xs border border-[#196349]"
                : "text-slate-400 hover:text-white hover:bg-[#162228]"
            }`}
          >
            <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>All Command Views</span>
          </button>
        </div>
      </div>

      {/* Scanned Certificate Success Banner */}
      {scanSuccessToast && (
        <div className="p-4 bg-[#07261B] border border-[#14533C] rounded-2xl text-xs text-emerald-200 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white">{scanSuccessToast}</span>
              <span className="text-[11px] text-emerald-300 block">
                Single-window ECDSA digital signature verified & vaulted into farm repository.
              </span>
            </div>
          </div>
          <button
            onClick={() => handleOpenCertificate(selectedDossierDocId)}
            className="px-3 py-1.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] cursor-pointer flex items-center gap-1"
          >
            <span>Inspect in Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SECTION 1: AfCFTA Documentation Checklist & PAPSS Escrow Milestones */}
      {(activeTab === "checklist" || activeTab === "all") && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Checklist Container (7 cols) */}
            <div className="lg:col-span-7 bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-sm">
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#19262F] mb-4 gap-3">
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    AfCFTA Export Documentation Checklist (7 Core Certificates)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Click each certificate to inspect details, or scan physical paper originals using your device camera.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenScanner()}
                    className="px-3 py-1.5 rounded-xl bg-[#162228] hover:bg-[#1D2A32] text-emerald-300 border border-[#1D2A32] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Scan physical certificate using camera"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Scan via Camera</span>
                  </button>

                  <div className="text-right">
                    <span className="text-sm font-mono font-extrabold text-emerald-300">
                      {completedCount} / 7
                    </span>
                    <span className="text-[11px] text-slate-400 block">Compliant</span>
                  </div>
                </div>
              </div>

              {/* 7 Interactive Checklist Items */}
              <div className="space-y-2.5">
                {checklist.map((doc, idx) => (
                  <div
                    key={doc.id}
                    onClick={() => handleOpenCertificate(doc.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                      doc.completed
                        ? "bg-[#07261B] border-[#14533C] hover:border-emerald-400 hover:bg-[#0A3425]"
                        : "bg-[#162228] border-[#1D2A32] hover:border-emerald-400 hover:bg-[#1A2A33]"
                    }`}
                    title={`Click to inspect ${doc.name}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-[#0D1519] border border-[#1E2E38] flex items-center justify-center font-mono text-[11px] font-bold text-emerald-400 shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-white group-hover:text-emerald-300 transition-colors truncate">
                          {doc.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          Authority: {doc.authority}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border hidden sm:inline-block ${
                          doc.completed
                            ? "bg-[#0B3D2C] text-emerald-300 border-[#196349]"
                            : "bg-amber-950/40 text-amber-300 border-amber-800/60"
                        }`}
                      >
                        {doc.status}
                      </span>

                      {/* Camera Scan Trigger button on each row */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenScanner(doc.id);
                        }}
                        className="p-1.5 rounded-lg bg-[#0E171C] hover:bg-[#19262F] text-slate-400 hover:text-emerald-300 border border-[#1E2E38] transition-colors cursor-pointer"
                        title={`Scan physical ${doc.name} with camera`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-[11px] font-bold text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        <span className="hidden sm:inline">Inspect</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checklist Footer Actions */}
              <div className="mt-5 pt-4 border-t border-[#19262F] flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  Single-window customs interoperability across SACU, EAC, ECOWAS & COMESA
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleOpenScanner()}
                    className="px-4 py-2.5 rounded-xl bg-[#162228] hover:bg-[#1D2A32] text-slate-200 font-bold text-xs border border-[#1D2A32] cursor-pointer transition-all flex items-center gap-1.5 min-h-[44px]"
                  >
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>Scan Paper Certificate</span>
                  </button>

                  <button
                    onClick={() => handleOpenCertificate("phyto")}
                    className="px-4 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] cursor-pointer shadow-md transition-all flex items-center gap-1.5 min-h-[44px]"
                  >
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>Inspect 7-Document Dossier Package →</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: PAPSS Escrow Milestones (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#07261B] text-white rounded-2xl p-6 border border-[#14533C] shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-extrabold text-sm text-white">PAPSS Live Escrow Milestones</h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-[#0B3D2C] text-emerald-300 px-2 py-0.5 rounded border border-[#196349]">
                    Corridor Escrow #ZA-KE-91
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Real-time payment release tied directly to GPS telematic weighbridge and phytosanitary border clearance without foreign currency delays.
                </p>

                {/* 4 Interactive Escrow Milestones */}
                <div className="space-y-3 pt-1">
                  {/* Milestone 1 */}
                  <div
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      escrowStage >= 1
                        ? "bg-[#0B3D2C] border-[#196349] text-white"
                        : "bg-[#10171B] border-[#1D2A32] text-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>1. Buyer Escrow Locked in Local Currency</span>
                      {escrowStage >= 1 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1 font-mono">
                      KES 41,180,000 deposited in Nairobi central bank escrow account
                    </div>
                  </div>

                  {/* Milestone 2 */}
                  <div
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      escrowStage >= 2
                        ? "bg-[#0B3D2C] border-[#196349] text-white"
                        : "bg-[#10171B] border-[#1D2A32] text-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>2. Grain Dispatched & Ocean Bill Issued</span>
                      {escrowStage >= 2 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1 font-mono">
                      Durban Container Terminal RFID seals verified (50% tranche released)
                    </div>
                  </div>

                  {/* Milestone 3 */}
                  <div
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      escrowStage >= 3
                        ? "bg-[#0B3D2C] border-[#196349] text-white"
                        : "bg-[#10171B] border-[#1D2A32] text-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>3. Phytosanitary Customs Green Light</span>
                      {escrowStage >= 3 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1 font-mono">
                      Malaba Single-Window Digital Phytosanitary Stamp Issued
                    </div>
                  </div>

                  {/* Milestone 4 */}
                  <div
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      escrowStage >= 4
                        ? "bg-[#0B3D2C] border-[#196349] text-white"
                        : "bg-[#10171B] border-[#1D2A32] text-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>4. Instant Multi-Currency Disbursement</span>
                      {escrowStage >= 4 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1 font-mono">
                      R5,420,000 ZAR auto-credited to Cape Farm Reserve Bank account
                    </div>
                  </div>
                </div>

                {/* Advance Escrow Milestone Simulator Button */}
                <button
                  onClick={handleAdvanceEscrow}
                  disabled={isAdvancingEscrow}
                  className="w-full py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] cursor-pointer shadow-md transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-300 ${isAdvancingEscrow ? "animate-spin" : ""}`} />
                  <span>
                    {escrowStage === 4
                      ? "Reset Escrow Simulation"
                      : `Advance to Milestone ${escrowStage + 1} →`}
                  </span>
                </button>
              </div>

              {/* Quick Shipment Tracking Link Card */}
              <div className="p-4 bg-[#162228] rounded-2xl border border-[#1D2A32] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>Active Corridor Consignments</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">3 En Route</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Live satellite telemetry, container temperature dataloggers, and estimated arrival countdowns.
                </p>
                <button
                  onClick={() => setActiveTab("tracking")}
                  className="w-full py-2 px-3 rounded-xl bg-[#10171B] hover:bg-[#1D2A32] text-emerald-400 font-bold text-xs border border-[#1D2A32] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Open Real-Time Shipment Tracking Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Real-Time Export Shipment Tracking Dashboard */}
      {(activeTab === "tracking" || activeTab === "all") && (
        <ExportShipmentTrackingDashboard
          onInspectDossier={(docId) => handleOpenCertificate(docId)}
        />
      )}

      {/* SECTION 3: AfCFTA Preferential Duty vs Traditional MFN Tariff Calculator */}
      {(activeTab === "calculator" || activeTab === "all") && (
        <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#07261B] text-emerald-400 flex items-center justify-center font-bold border border-[#14533C]">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  AfCFTA Preferential Duty & PAPSS Currency Savings Calculator
                </h3>
                <p className="text-xs text-slate-400">
                  Simulate exact duty savings under AfCFTA vs traditional WTO Most-Favored-Nation (MFN) tariffs.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-300 bg-[#07261B] px-2.5 py-1 rounded-lg border border-[#14533C]">
              Annex 2 Rules of Origin
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Select Trade Corridor</label>
              <select
                value={calcCorridor}
                onChange={(e) => setCalcCorridor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1D2A32] font-semibold text-white bg-[#162228] focus:border-emerald-500 focus:outline-none"
              >
                {Object.entries(corridorsData).map(([key, c]) => (
                  <option key={key} value={key} className="bg-[#162228] text-white">
                    {c.origin} → {c.dest} ({c.name.split(" ")[0]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Commodity & HS Code</label>
              <select
                value={calcCommodity}
                onChange={(e) => setCalcCommodity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1D2A32] font-semibold text-white bg-[#162228] focus:border-emerald-500 focus:outline-none"
              >
                <option value="Yellow Maize (HS 1005.90)" className="bg-[#162228] text-white">Yellow Maize (HS 1005.90)</option>
                <option value="Raw Soybeans (HS 1201.90)" className="bg-[#162228] text-white">Raw Soybeans (HS 1201.90)</option>
                <option value="Sunflower Oil Cake (HS 2306.30)" className="bg-[#162228] text-white">Sunflower Oil Cake (HS 2306.30)</option>
                <option value="Sorghum Grain (HS 1007.90)" className="bg-[#162228] text-white">Sorghum Grain (HS 1007.90)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Consignment Volume (Metric Tonnes)</label>
              <input
                type="number"
                value={calcTonnage}
                onChange={(e) => setCalcTonnage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#1D2A32] font-mono font-bold text-white bg-[#162228] focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Real-time Economic Comparison Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Traditional MFN Duty</span>
              <div className="text-lg font-mono font-extrabold text-red-400">
                ${mfnDutyUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Rate: {currentCorridorInfo.mfnRate}% tariff before AfCFTA
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#07261B] border border-[#14533C] space-y-1">
              <span className="text-[11px] font-bold text-emerald-300 uppercase">AfCFTA Preferential Duty</span>
              <div className="text-lg font-mono font-extrabold text-emerald-300">
                $0.00 (100% Exempt)
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                0% Import Tariff (Wholly Produced RoO)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-1">
              <span className="text-[11px] font-bold text-emerald-300 uppercase">PAPSS Currency Savings</span>
              <div className="text-lg font-mono font-extrabold text-white">
                +${fxSavingsUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Zero USD routing ({currentCorridorInfo.origCurr} ⇄ {currentCorridorInfo.destCurr})
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B3D2C] border border-[#196349] text-white space-y-1">
              <span className="text-[11px] font-bold text-emerald-300 uppercase">Net Economic Benefit</span>
              <div className="text-lg font-mono font-extrabold text-white">
                +${netSavingsUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[10px] text-slate-300 font-mono">
                Est. Transit: {currentCorridorInfo.transitDays} Days
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optical Camera Document Scanner Modal */}
      <ExportCertificateScannerModal
        isOpen={isScannerOpen}
        targetDocId={scannerTargetDocId}
        onClose={() => setIsScannerOpen(false)}
        onScanComplete={handleScanComplete}
      />

      {/* Harmonized 7-Document Dossier Modal */}
      <ExportDossierModal
        isOpen={isDossierModalOpen}
        selectedDocId={selectedDossierDocId}
        onClose={() => setIsDossierModalOpen(false)}
      />
    </div>
  );
};
