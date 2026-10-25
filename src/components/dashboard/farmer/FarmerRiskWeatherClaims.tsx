import React, { useState } from "react";
import {
  CloudRain,
  Sun,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Radio,
  FileCheck,
  Plus,
  X,
  Check,
  Activity,
  Droplets,
  Wind,
  Thermometer,
  Zap,
} from "lucide-react";
import { useApp } from "../../../context/AppContext";

export interface WeatherAlertItem {
  id: string;
  type: "storm" | "drought" | "heat" | "pest";
  severity: "critical" | "warning" | "advisory";
  title: string;
  timeframe: string;
  description: string;
  impactParcels: string;
  recommendedAction: string;
  telemetrySource: string;
}

export interface FarmerClaimItem {
  id: string;
  policyId: string;
  peril: "Drought (Rainfall Deficit)" | "Excess Rain & Flood" | "Hail & Windstorm" | "Extreme Heat Shock";
  triggerDate: string;
  satelliteProof: string;
  measuredDeficit: string;
  claimAmountUSD: number;
  status: "Pending Adjudication" | "Satellite Verified" | "Settled & Disbursed";
  payoutAccount: string;
  disbursedDate?: string;
}

export const FarmerRiskWeatherClaims: React.FC = () => {
  const { currentFarm } = useApp();

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isFileClaimModalOpen, setIsFileClaimModalOpen] = useState(false);

  // Weather & Agronomic Risk Alerts
  const [riskAlerts] = useState<WeatherAlertItem[]>([
    {
      id: "ALT-MET-01",
      type: "heat",
      severity: "warning",
      title: "Elevated Evapotranspiration (ET0) Heat Wave Warning",
      timeframe: "Next 48 Hours (Peak 34°C)",
      description: "Atmospheric vapor pressure deficit projected to exceed 2.4 kPa. Crop transpiration demand will surge to 8.2 mm/day.",
      impactParcels: "Parcel 01 & Parcel 02 (Maize Canopy)",
      recommendedAction: "Advance center pivot irrigation schedule by 3 hours; apply 15mm pre-emptive water buffer.",
      telemetrySource: "ECMWF High-Resolution Weather Model + Local Ground Station #ZA-04",
    },
    {
      id: "ALT-MET-02",
      type: "storm",
      severity: "critical",
      title: "Severe Convective Cell & Thunderstorm Advisory",
      timeframe: "Friday 16:00 – 21:00 SAST",
      description: "Severe convective cell radar reflectivity > 52 dBZ with localized 35mm downpour and potential hail squalls.",
      impactParcels: "Whole Commercial Holding (All 4 Parcels)",
      recommendedAction: "Suspend foliar chemical spraying; anchor irrigation pivots to designated park position.",
      telemetrySource: "South African Weather Service (SAWS) Radar Network",
    },
    {
      id: "ALT-PEST-03",
      type: "pest",
      severity: "warning",
      title: "Regional Biosecurity Alert: Fall Armyworm (Spodoptera frugiperda)",
      timeframe: "Active Infestation 18km East",
      description: "High moth flight density trapped in neighboring district grain fields. Pheromone trap thresholds approaching trigger stage.",
      impactParcels: "Field Parcel 03 (River Margin Zone)",
      recommendedAction: "Scout 20 plants across 5 spots for whorl feeding; prepare targeted bio-larvicide spray.",
      telemetrySource: "Pan-African Pest Surveillance Network & Local Extension Office",
    },
    {
      id: "ALT-SOIL-04",
      type: "drought",
      severity: "advisory",
      title: "Subsoil Moisture Deficit in Non-Irrigated Corner",
      timeframe: "Continuous Sensor Monitor",
      description: "Capacitance probe at 40cm depth recorded 26% volumetric water content (near permanent wilting point).",
      impactParcels: "Parcel 04 (Dryland Buffer 15 Ha)",
      recommendedAction: "Apply organic mulch or furrow water diversion if dry spell extends beyond 5 days.",
      telemetrySource: "Soil Tensiometer IoT Node #B-12",
    },
  ]);

  // Farmer Insurance Claims State
  const [claims, setClaims] = useState<FarmerClaimItem[]>([
    {
      id: "CLM-2026-081",
      policyId: "POL-AFR-2026-104",
      peril: "Drought (Rainfall Deficit)",
      triggerDate: "2026-10-12",
      satelliteProof: "CHIRPS Sentinel-2 recorded 19 consecutive days without rain (4.2mm recorded vs 25mm threshold).",
      measuredDeficit: "4.2mm actual vs 25mm contract floor (83% deficit)",
      claimAmountUSD: 38000,
      status: "Satellite Verified",
      payoutAccount: "Standard Bank Instant Escrow (ZAR 699,200)",
      disbursedDate: "Scheduled for Disbursal within 24h",
    },
    {
      id: "CLM-2025-042",
      policyId: "POL-AFR-2025-089",
      peril: "Excess Rain & Flood",
      triggerDate: "2025-11-20",
      satelliteProof: "Copernicus Sentinel-1 SAR radar flood extent confirmed 32 hectares submerged for 72+ hours.",
      measuredDeficit: "142mm peak 48h rainfall vs 100mm policy threshold",
      claimAmountUSD: 24500,
      status: "Settled & Disbursed",
      payoutAccount: "Direct Bank Wire #ZA-STD-9902",
      disbursedDate: "Settled Nov 24, 2025 (48h SLA)",
    },
  ]);

  // Form State for new claim filing
  const [claimPeril, setClaimPeril] = useState<FarmerClaimItem["peril"]>("Drought (Rainfall Deficit)");
  const [claimSensor, setClaimSensor] = useState("Copernicus Sentinel-2 MSI + CHIRPS");
  const [claimEstimatedLoss, setClaimEstimatedLoss] = useState("35000");
  const [claimNotes, setClaimNotes] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleFileNewClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const newClaim: FarmerClaimItem = {
      id: `CLM-${Date.now().toString().slice(-6)}`,
      policyId: "POL-AFR-2026-104",
      peril: claimPeril,
      triggerDate: new Date().toISOString().slice(0, 10),
      satelliteProof: `Automated ${claimSensor} query initiated. Telemetric baseline matching threshold parameters.`,
      measuredDeficit: "Satellite oracle calculating index deviation against multi-year raster.",
      claimAmountUSD: Number(claimEstimatedLoss) || 25000,
      status: "Pending Adjudication",
      payoutAccount: "Standard Bank Instant Escrow (ZAR Account)",
    };

    setClaims((prev) => [newClaim, ...prev]);
    setIsFileClaimModalOpen(false);
    showToast(`Claim ${newClaim.id} submitted. Satellite telemetric adjudication underway.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3 bg-[#07261B] border border-[#14533C] rounded-xl text-xs font-bold text-emerald-200 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Banner: Climate Surveillance Status */}
      <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-2 rounded-xl bg-[#07261B] text-emerald-400 border border-[#14533C]">
              <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            </span>
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              Weather Risk Intelligence & Parametric Claims Center
            </h3>
            <span className="text-xs font-mono font-bold bg-[#07261B] text-emerald-300 px-2.5 py-0.5 rounded border border-[#14533C]">
              NOAA / ECMWF Satellite Oracles Armed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time agro-meteorological risk alerts, biosecurity early warnings, and automated satellite claim verification with 48-hour digital payouts.
          </p>
        </div>

        <button
          onClick={() => setIsFileClaimModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] transition-all flex items-center gap-2 cursor-pointer shadow-md self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-300" />
          <span>File Parametric Claim</span>
        </button>
      </div>

      {/* SECTION 1: Real-Time Weather Alerts & Farm Risk Notifications */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Active Meteorological & Agronomic Risk Alerts ({riskAlerts.length})</span>
          </h4>
          <span className="text-xs text-slate-400 font-mono">Updated 14 mins ago</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          {riskAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                alert.severity === "critical"
                  ? "bg-red-950/30 border-red-800/80"
                  : alert.severity === "warning"
                  ? "bg-amber-950/30 border-amber-800/80"
                  : "bg-[#10171B] border-[#1D2A32]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      alert.severity === "critical"
                        ? "bg-red-500 animate-ping"
                        : alert.severity === "warning"
                        ? "bg-amber-400"
                        : "bg-cyan-400"
                    }`}
                  />
                  <h5 className="font-extrabold text-white text-xs sm:text-sm">{alert.title}</h5>
                </div>

                <span
                  className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded font-mono ${
                    alert.severity === "critical"
                      ? "bg-red-600 text-white"
                      : alert.severity === "warning"
                      ? "bg-amber-500 text-slate-950"
                      : "bg-[#162228] text-slate-300"
                  }`}
                >
                  {alert.timeframe}
                </span>
              </div>

              <p className="text-slate-300 text-[11px] leading-relaxed">{alert.description}</p>

              <div className="p-2.5 rounded-xl bg-[#0B1013] border border-[#1D2A32] space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[11px]">
                  <span>Direct Farm Action:</span>
                  <span className="text-white font-normal">{alert.recommendedAction}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between pt-1 border-t border-[#1D2A32]">
                  <span>Target: {alert.impactParcels}</span>
                  <span className="font-mono">{alert.telemetrySource}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Parametric Claims Tracker & Settlement Status */}
      <div className="bg-[#10171B] rounded-2xl border border-[#1D2A32] overflow-hidden shadow-sm space-y-0">
        <div className="p-4 sm:p-5 bg-[#162228] border-b border-[#1D2A32] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-white">
                Parametric Climate Claims Tracker & Settlement Ledger
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Zero loss adjusters required. Payouts are triggered instantly once satellite radar indices record verified drought or flood deficits.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-400 bg-[#07261B] px-2.5 py-1 rounded-lg border border-[#14533C]">
            Total Claims Paid: $62,500 USD
          </span>
        </div>

        <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className={`p-4 sm:p-5 rounded-2xl border space-y-3 transition-all ${
                claim.status === "Settled & Disbursed"
                  ? "bg-[#07261B] border-[#14533C]"
                  : "bg-[#162228] border-[#1D2A32]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-emerald-400 font-bold text-xs">{claim.id}</span>
                  <h4 className="font-extrabold text-white text-sm mt-0.5">{claim.peril}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">Policy: {claim.policyId}</span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    claim.status === "Settled & Disbursed"
                      ? "bg-[#0B3D2C] text-emerald-300 border-[#196349]"
                      : claim.status === "Satellite Verified"
                      ? "bg-cyan-950 text-cyan-300 border-cyan-800"
                      : "bg-amber-950 text-amber-300 border-amber-800"
                  }`}
                >
                  {claim.status}
                </span>
              </div>

              {/* Measured Deficit Box */}
              <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32] space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Trigger Date:</span>
                  <span className="text-white font-bold">{claim.triggerDate}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Deficit Level:</span>
                  <span className="text-red-300 font-bold">{claim.measuredDeficit}</span>
                </div>
                <p className="text-[10px] text-slate-400 pt-1 border-t border-[#1D2A32] italic">
                  Proof: {claim.satelliteProof}
                </p>
              </div>

              {/* Payout & Settlement Info */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Compensation Amount</span>
                  <div className="text-xl font-mono font-extrabold text-white">
                    ${claim.claimAmountUSD.toLocaleString()} USD
                  </div>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">{claim.payoutAccount}</span>
                </div>

                {claim.disbursedDate && (
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-emerald-300 font-bold bg-[#0B3D2C] px-2.5 py-1 rounded-lg border border-[#196349] inline-block">
                      {claim.disbursedDate}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* File Claim Modal */}
      {isFileClaimModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B1013]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#10171B] rounded-3xl max-w-lg w-full border border-[#1D2A32] shadow-2xl overflow-hidden my-auto">
            <div className="px-5 py-4 bg-[#07261B] text-white flex items-center justify-between border-b border-[#14533C]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  File Parametric Climate Claim for Adjudication
                </h3>
              </div>
              <button
                onClick={() => setIsFileClaimModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFileNewClaim} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Insured Peril Category</label>
                <select
                  value={claimPeril}
                  onChange={(e) => setClaimPeril(e.target.value as FarmerClaimItem["peril"])}
                  className="w-full bg-[#162228] text-white px-3.5 py-2.5 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="Drought (Rainfall Deficit)">Drought (Rainfall Deficit &lt; 25mm in 18d)</option>
                  <option value="Excess Rain & Flood">Excess Rain &amp; Flood (&gt; 110mm in 48h)</option>
                  <option value="Hail & Windstorm">Hail &amp; Convective Windstorm Damage</option>
                  <option value="Extreme Heat Shock">Extreme Heat Shock (Canopy ET0 &gt; 8.0mm/day)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Satellite Verification Sensor / Oracle</label>
                <select
                  value={claimSensor}
                  onChange={(e) => setClaimSensor(e.target.value)}
                  className="w-full bg-[#162228] text-white px-3.5 py-2.5 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="Copernicus Sentinel-2 MSI + CHIRPS">Copernicus Sentinel-2 MSI + CHIRPS (Precipitation Index)</option>
                  <option value="Sentinel-1 SAR Radar Surface Water">Sentinel-1 SAR Radar (Flood Inundation Extent)</option>
                  <option value="NASA SMAP Soil Moisture Active Passive">NASA SMAP (Root-Zone Soil Moisture Probe)</option>
                  <option value="MODIS Terra/Aqua VCI">MODIS Terra/Aqua (Vegetation Condition Index)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Estimated Direct Crop Loss (USD)</label>
                <input
                  type="number"
                  value={claimEstimatedLoss}
                  onChange={(e) => setClaimEstimatedLoss(e.target.value)}
                  className="w-full bg-[#162228] text-white font-mono font-bold text-sm px-3.5 py-2.5 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Incident Field Notes</label>
                <textarea
                  value={claimNotes}
                  onChange={(e) => setClaimNotes(e.target.value)}
                  placeholder="Describe observed field crop stress, parcel numbers affected, and dates of drought or storm."
                  rows={2}
                  className="w-full bg-[#162228] text-white px-3.5 py-2.5 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] text-[11px] text-slate-300 space-y-1">
                <div className="font-bold text-white">Automated Smart Settlement:</div>
                <p>
                  Upon submission, the satellite oracle automatically queries pixel data coordinates (-29.133°, 26.214°). Verified claims are credited within 48 hours.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFileClaimModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#162228] text-slate-300 font-bold hover:bg-[#1D2A32] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold transition-all border border-[#196349] shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Submit Claim</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
