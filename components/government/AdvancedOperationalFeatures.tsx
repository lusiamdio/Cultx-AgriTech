import React, { useState } from "react";
import {
  Brain,
  ShieldAlert,
  Satellite,
  Gauge,
  Sliders,
  Bell,
  FileCheck,
  Building,
  Activity,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
  Users,
  Compass,
  ArrowRight,
  ExternalLink,
  Info,
  DollarSign,
  CloudRain,
  Sun,
  Shield,
  FileText,
  Lock,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const AdvancedOperationalFeatures: React.FC = () => {
  const { selectedCountry } = useApp();
  const [activeFeature, setActiveFeature] = useState<
    | "ai_credit"
    | "ai_underwriting"
    | "satellite_weather"
    | "parametric_engine"
    | "fraud_detection"
    | "marketplace_matcher"
    | "stress_testing"
    | "notifications_agreements"
  >("ai_credit");

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // AI Credit Intelligence Simulator state
  const [creditFarmHectares, setCreditFarmHectares] = useState<number>(14.5);
  const [creditHistYield, setCreditHistYield] = useState<number>(6.8); // tonnes/ha
  const [creditContractValue, setCreditContractValue] = useState<number>(45000); // USD
  const [runningCreditAi, setRunningCreditAi] = useState(false);
  const [creditAiResult, setCreditAiResult] = useState({
    affordabilityScore: 82,
    recommendedLimitUSD: 28500,
    expectedDebtServiceCoverage: 1.64,
    defaultProbabilityPct: 2.1,
    fairnessAuditPassed: true,
    shapFactors: [
      { name: "Historical 5-Year Sentinel NDVI Stability", impact: "+18 pts", positive: true },
      { name: "Verified Offtake Forward Contract (Olam)", impact: "+24 pts", positive: true },
      { name: "Soil Water Retention (Loam Sandy 28%)", impact: "+8 pts", positive: true },
      { name: "Input Price Inflation (Fertilizer +12%)", impact: "-6 pts", positive: false },
    ],
  });

  // Parametric Trigger Simulator
  const [rainfallDeficitMm, setRainfallDeficitMm] = useState<number>(28);
  const [tempDegreeDays, setTempDegreeDays] = useState<number>(36);
  const [vegetationVci, setVegetationVci] = useState<number>(0.29);
  const [simulatedPayout, setSimulatedPayout] = useState<number>(65);

  // Portfolio Stress Testing Simulator
  const [stressScenario, setStressScenario] = useState<"severe_drought" | "commodity_crash" | "combined_catastrophe">("severe_drought");
  const [simulatingStress, setSimulatingStress] = useState(false);

  const handleRunCreditAI = () => {
    setRunningCreditAi(true);
    setTimeout(() => {
      const calculatedAffordability = Math.min(96, Math.max(45, Math.round((creditHistYield * 8) + (creditFarmHectares * 1.5))));
      const recommended = Math.round(creditFarmHectares * creditHistYield * 310);
      setCreditAiResult({
        affordabilityScore: calculatedAffordability,
        recommendedLimitUSD: recommended,
        expectedDebtServiceCoverage: Number(((creditHistYield * 280 * creditFarmHectares) / (recommended * 1.15)).toFixed(2)),
        defaultProbabilityPct: Number((12 - calculatedAffordability * 0.1).toFixed(1)),
        fairnessAuditPassed: true,
        shapFactors: [
          { name: "Historical 5-Year Sentinel NDVI Stability", impact: "+21 pts", positive: true },
          { name: "Verified Offtake Forward Contract", impact: "+22 pts", positive: true },
          { name: "Soil Organic Matter Index (3.4%)", impact: "+10 pts", positive: true },
          { name: "Regional Rainfall Anomaly Window", impact: "-5 pts", positive: false },
        ],
      });
      setRunningCreditAi(false);
      setToastMsg("AI Credit Capacity re-evaluated with verified production data and algorithmic bias testing.");
      setTimeout(() => setToastMsg(null), 4000);
    }, 900);
  };

  const handleUpdateParametric = (deficit: number, vci: number) => {
    setRainfallDeficitMm(deficit);
    setVegetationVci(vci);
    // Trigger calculation
    let payout = 0;
    if (deficit < 35 || vci < 0.32) payout = 70;
    if (deficit < 20 || vci < 0.22) payout = 100;
    if (deficit >= 50 && vci >= 0.45) payout = 0;
    setSimulatedPayout(payout);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#0B3D2C] border border-[#14533C] text-white shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Feature Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#10171B] p-2.5 rounded-2xl border border-[#1D2A32]">
        <button
          onClick={() => setActiveFeature("ai_credit")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFeature === "ai_credit"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Brain className="w-4 h-4 text-emerald-400" />
          <span>AI Credit Intelligence</span>
        </button>

        <button
          onClick={() => setActiveFeature("ai_underwriting")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFeature === "ai_underwriting"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Gauge className="w-4 h-4 text-cyan-400" />
          <span>AI Underwriting Assistant</span>
        </button>

        <button
          onClick={() => setActiveFeature("satellite_weather")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFeature === "satellite_weather"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Satellite className="w-4 h-4 text-amber-400" />
          <span>Satellite & Weather Intelligence</span>
        </button>

        <button
          onClick={() => setActiveFeature("parametric_engine")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFeature === "parametric_engine"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <CloudRain className="w-4 h-4 text-blue-400" />
          <span>Parametric Insurance Engine</span>
        </button>

        <button
          onClick={() => setActiveFeature("fraud_detection")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFeature === "fraud_detection"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span>Fraud & Anomaly Radar</span>
        </button>

        <button
          onClick={() => setActiveFeature("marketplace_matcher")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFeature === "marketplace_matcher"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Building className="w-4 h-4 text-emerald-300" />
          <span>Financing Marketplace Matcher</span>
        </button>

        <button
          onClick={() => setActiveFeature("stress_testing")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFeature === "stress_testing"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Sliders className="w-4 h-4 text-orange-400" />
          <span>Portfolio Stress Testing</span>
        </button>

        <button
          onClick={() => setActiveFeature("notifications_agreements")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFeature === "notifications_agreements"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <FileCheck className="w-4 h-4 text-violet-400" />
          <span>Agreements & Notifications</span>
        </button>
      </div>

      {/* Mandatory Governance Notice */}
      <div className="p-3 bg-[#0B251B] rounded-xl border border-[#14533C] text-[11px] text-emerald-200 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Regulatory Governance Principle:</strong> AI capabilities assist, not independently replace, authorised credit and insurance decision-makers. All automated models are audited for demographic fairness, explainable feature attribution (SHAP/LIME), and human override compliance.
        </div>
      </div>

      {/* FEATURE 1: AI CREDIT INTELLIGENCE */}
      {activeFeature === "ai_credit" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] space-y-4">
              <div className="pb-3 border-b border-[#19262F]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                  Repayment Capacity Estimator
                </span>
                <h3 className="font-extrabold text-base text-white mt-2">
                  Farm Economics & Production Credit Engine
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Evaluates historical verified production data, parcel satellite NDVI, and forward buyer offtake contracts.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Farm Verified Acreage:</span>
                    <span className="font-mono text-emerald-400">{creditFarmHectares} ha</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="100"
                    step="0.5"
                    value={creditFarmHectares}
                    onChange={(e) => setCreditFarmHectares(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Historical 5-Year Yield:</span>
                    <span className="font-mono text-emerald-400">{creditHistYield} t/ha</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="0.2"
                    value={creditHistYield}
                    onChange={(e) => setCreditHistYield(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Forward Offtake Contract Value:</span>
                    <span className="font-mono text-emerald-400">${creditContractValue.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="150000"
                    step="5000"
                    value={creditContractValue}
                    onChange={(e) => setCreditContractValue(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleRunCreditAI}
                  disabled={runningCreditAi}
                  className="w-full py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors border border-[#196349] mt-3"
                >
                  {runningCreditAi ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                  )}
                  <span>Recompute Affordability & Fairness Index</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#19262F]">
                  <h4 className="font-bold text-sm text-white">AI Credit Capacity Score Dossier</h4>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                    Model: AgriCredit-v3.1.4
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                  <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Credit Score</div>
                    <div className="text-xl font-mono font-extrabold text-emerald-400 mt-0.5">
                      {creditAiResult.affordabilityScore} / 100
                    </div>
                    <div className="text-[10px] text-emerald-300 mt-0.5">Tier 1 Prime</div>
                  </div>

                  <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Max Credit Limit</div>
                    <div className="text-xl font-mono font-extrabold text-white mt-0.5">
                      ${creditAiResult.recommendedLimitUSD.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Seasonal Facility</div>
                  </div>

                  <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Projected DSCR</div>
                    <div className="text-xl font-mono font-extrabold text-white mt-0.5">
                      {creditAiResult.expectedDebtServiceCoverage}x
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">Target &gt; 1.30x</div>
                  </div>

                  <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Default Risk</div>
                    <div className="text-xl font-mono font-extrabold text-cyan-400 mt-0.5">
                      {creditAiResult.defaultProbabilityPct}%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Actuarial PD</div>
                  </div>
                </div>

                {/* Explainable AI SHAP Breakdown */}
                <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Explainable AI Factor Attribution (SHAP Analysis)</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Disparate Impact: 1.02 (Passed)</span>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {creditAiResult.shapFactors.map((f, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300">{f.name}</span>
                        <span
                          className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                            f.positive
                              ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800"
                              : "bg-amber-950/60 text-amber-300 border border-amber-800"
                          }`}
                        >
                          {f.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#19262F] flex items-center justify-between text-xs">
                <span className="text-slate-400">Audited against bias across gender, parcel size, and regional ethnicity</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Fairness Compliant</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 2: AI UNDERWRITING ASSISTANT */}
      {activeFeature === "ai_underwriting" && (
        <div className="space-y-4">
          <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-[#082835] px-2 py-0.5 rounded border border-[#10485E]">
                  Underwriting Rules Engine
                </span>
                <h3 className="font-extrabold text-base text-white mt-1">
                  Automated Exposure Assessment & Risk-Based Pricing
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-300 bg-[#162228] px-3 py-1.5 rounded-xl border border-[#1D2A32]">
                Active Ruleset: AF-UNDERWRITE-2026-v2
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Soil Moisture & Aridity Rule</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-300">
                  SMAP soil moisture index &gt; 22% required for standard 4.5% premium. Below 18% triggers mandatory drought deductible rider.
                </p>
                <div className="text-[10px] font-mono text-cyan-400 bg-[#10171B] p-2 rounded border border-[#1D2A32]">
                  Status: Approved for 91.2% of applications
                </div>
              </div>

              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Catastrophe Accumulation Cap</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-300">
                  Total sum insured per 25km x 25km grid cell capped at $3.5M to comply with Africa Re and Swiss Re quota treaties.
                </p>
                <div className="text-[10px] font-mono text-cyan-400 bg-[#10171B] p-2 rounded border border-[#1D2A32]">
                  Status: Free State at 68% capacity; Rift Valley at 54%
                </div>
              </div>

              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Agronomic Practice Discount</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-300">
                  12% premium discount automatically applied for certified drought-tolerant seed + minimum tillage practices.
                </p>
                <div className="text-[10px] font-mono text-emerald-400 bg-[#10171B] p-2 rounded border border-[#1D2A32]">
                  Status: 340 cooperatives currently receiving discount
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 3: SATELLITE & WEATHER INTELLIGENCE */}
      {activeFeature === "satellite_weather" && (
        <div className="space-y-4">
          <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-[#352508] px-2 py-0.5 rounded border border-[#5E4210]">
                  Verified Earth Observation Data
                </span>
                <h3 className="font-extrabold text-base text-white mt-1">
                  Multi-Source Satellite & Agronomic Weather Surveillance
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-[#07261B] px-3 py-1.5 rounded-xl border border-[#14533C]">
                Telemetry Feed: Sentinel-2 + CHIRPS Live
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <div className="text-slate-400 font-semibold text-[11px]">Sentinel-2 NDVI Mean</div>
                <div className="text-2xl font-mono font-extrabold text-emerald-400 mt-1">0.71</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Vegetative Vigour (High)</div>
              </div>

              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <div className="text-slate-400 font-semibold text-[11px]">CHIRPS 30-Day Rainfall</div>
                <div className="text-2xl font-mono font-extrabold text-cyan-400 mt-1">94mm</div>
                <div className="text-[10px] text-slate-400 mt-0.5">+8.4% above historical norm</div>
              </div>

              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <div className="text-slate-400 font-semibold text-[11px]">SMAP Root Soil Moisture</div>
                <div className="text-2xl font-mono font-extrabold text-white mt-1">28.4%</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Optimal grain filling range</div>
              </div>

              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <div className="text-slate-400 font-semibold text-[11px]">ECMWF 14-Day Forecast</div>
                <div className="text-2xl font-mono font-extrabold text-amber-400 mt-1">24°C / Light Rain</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Zero frost / heat hazard</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 4: PARAMETRIC INSURANCE ENGINE */}
      {activeFeature === "parametric_engine" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] space-y-4">
              <div className="pb-3 border-b border-[#19262F]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-[#082035] px-2 py-0.5 rounded border border-[#10385E]">
                  Index Trigger Calibration
                </span>
                <h3 className="font-extrabold text-base text-white mt-2">
                  Parametric Weather & Vegetation Trigger Simulator
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust meteorological and vegetation parameters to simulate automated policy payout disbursements.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Cumulative Rainfall in 30-Day Critical Window:</span>
                    <span className="font-mono text-cyan-400">{rainfallDeficitMm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="2"
                    value={rainfallDeficitMm}
                    onChange={(e) => handleUpdateParametric(Number(e.target.value), vegetationVci)}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span className="text-red-400">&lt; 25mm: Catastrophic Trigger (100%)</span>
                    <span className="text-amber-400">&lt; 40mm: Moderate (70%)</span>
                    <span className="text-emerald-400">&gt; 50mm: Normal (0%)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Vegetation Condition Index (VCI):</span>
                    <span className="font-mono text-emerald-400">{vegetationVci}</span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="0.80"
                    step="0.02"
                    value={vegetationVci}
                    onChange={(e) => handleUpdateParametric(rainfallDeficitMm, Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span className="text-red-400">&lt; 0.20 Extreme Drought</span>
                    <span className="text-amber-400">0.20 - 0.35 Stressed</span>
                    <span className="text-emerald-400">&gt; 0.35 Vigorous</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#19262F]">
                  <h4 className="font-bold text-sm text-white">Automated Settlement Simulation</h4>
                  <span className="text-[10px] font-mono text-slate-400">Smart Contract Execution</span>
                </div>

                <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] my-4 text-center space-y-2">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                    Automated Parametric Payout Tier
                  </div>
                  <div
                    className={`text-4xl font-mono font-extrabold ${
                      simulatedPayout === 100
                        ? "text-red-400"
                        : simulatedPayout > 0
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {simulatedPayout}% Payout
                  </div>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    {simulatedPayout > 0
                      ? `Index trigger threshold reached (${rainfallDeficitMm}mm rainfall / VCI ${vegetationVci}). Automated mobile money payout initiated without requiring manual on-site damage assessment.`
                      : "Rainfall and vegetative conditions remain within normal actuarial parameters. No trigger initiated."}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#07261B] rounded-xl border border-[#14533C] text-xs flex items-center justify-between">
                <span className="text-slate-300">Average Parametric Settlement Time:</span>
                <span className="font-mono font-bold text-emerald-400">48 Hours vs. 60 Days Manual</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 5: FRAUD & ANOMALY RADAR */}
      {activeFeature === "fraud_detection" && (
        <div className="space-y-4">
          <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-[#350808] px-2 py-0.5 rounded border border-[#5E1010]">
                  Automated Integrity Surveillance
                </span>
                <h3 className="font-extrabold text-base text-white mt-1">
                  Fraud, Duplicate Farm & Anomaly Detection Radar
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-[#07261B] px-3 py-1.5 rounded-xl border border-[#14533C]">
                4,120 Anomalies Prevented ($2.8M Saved)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Duplicate Farm Polygon Collision</span>
                  <span className="text-[10px] text-red-400 font-mono">14 Blocked</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  GIS cadastre detects attempts to pledge the same GPS boundary parcel across multiple commercial banks.
                </p>
                <div className="p-2 bg-[#10171B] rounded border border-[#1D2A32] text-[10px] text-slate-400 font-mono">
                  Example: Parcel #ZA-FS-819 overlapped with #ZA-FS-822 by 94%.
                </div>
              </div>

              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Inflated Acreage Detection</span>
                  <span className="text-[10px] text-amber-400 font-mono">29 Flagged</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Satellite multispectral land classification verifies whether declared 50ha maize parcel contains rocky terrain or uncultivated brush.
                </p>
                <div className="p-2 bg-[#10171B] rounded border border-[#1D2A32] text-[10px] text-slate-400 font-mono">
                  Algorithm auto-adjusts loan baseline to net arable area.
                </div>
              </div>

              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Repeated Claim Velocity Check</span>
                  <span className="text-[10px] text-emerald-400 font-mono">0.02% Anomaly Rate</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Cross-checks claims history against regional micro-climate clusters to prevent phantom claim claims in un-affected wards.
                </p>
                <div className="p-2 bg-[#10171B] rounded border border-[#1D2A32] text-[10px] text-slate-400 font-mono">
                  All claims matched against NASA/CHIRPS weather feeds.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 6: FINANCING MARKETPLACE MATCHER */}
      {activeFeature === "marketplace_matcher" && (
        <div className="space-y-4">
          <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                  Automated Pre-Qualification
                </span>
                <h3 className="font-extrabold text-base text-white mt-1">
                  Multi-Lender & Insurer Marketplace Matcher
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-300 bg-[#162228] px-3 py-1.5 rounded-xl border border-[#1D2A32]">
                12 Accredited Institutional Lenders
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-white text-xs">Standard Bank Agribusiness</h5>
                    <span className="text-[10px] text-emerald-400">Commercial Banks</span>
                  </div>
                  <span className="text-xs font-mono text-slate-300 font-bold">8.5% p.a.</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Best match for mechanized grain & oilseed producers &gt; 25 hectares with verified export contracts.
                </p>
                <div className="pt-2 border-t border-[#1D2A32] flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Bundled Cover:</span>
                  <span className="text-emerald-300 font-semibold">Santam Multi-Peril</span>
                </div>
              </div>

              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-white text-xs">KCB Agricultural Fund</h5>
                    <span className="text-[10px] text-emerald-400">Commercial & Blended</span>
                  </div>
                  <span className="text-xs font-mono text-slate-300 font-bold">9.2% p.a.</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Best match for cooperative outgrowers in tea, horticulture, and irrigated vegetables.
                </p>
                <div className="pt-2 border-t border-[#1D2A32] flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Bundled Cover:</span>
                  <span className="text-emerald-300 font-semibold">APA Crop Insurance</span>
                </div>
              </div>

              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-white text-xs">Sinapi Aba Microfinance</h5>
                    <span className="text-[10px] text-emerald-400">MFI & Smallholder</span>
                  </div>
                  <span className="text-xs font-mono text-slate-300 font-bold">14.0% p.a.</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Optimized for smallholders under 5ha; disbursements via mobile money e-wallets.
                </p>
                <div className="pt-2 border-t border-[#1D2A32] flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Bundled Cover:</span>
                  <span className="text-emerald-300 font-semibold">Star Assurance Parametric</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 7: PORTFOLIO STRESS TESTING */}
      {activeFeature === "stress_testing" && (
        <div className="space-y-4">
          <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-[#351C08] px-2 py-0.5 rounded border border-[#5E3210]">
                  Macroeconomic Shock Simulator
                </span>
                <h3 className="font-extrabold text-base text-white mt-1">
                  Portfolio Climate & Commodity Stress Testing
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={stressScenario}
                  onChange={(e: any) => setStressScenario(e.target.value)}
                  className="px-3 py-1.5 bg-[#162228] text-white text-xs rounded-xl border border-[#1D2A32]"
                >
                  <option value="severe_drought">Scenario 1: Severe El Niño Drought (-40% Rain)</option>
                  <option value="commodity_crash">Scenario 2: Global Grain Price Shock (-30%)</option>
                  <option value="combined_catastrophe">Scenario 3: Combined Drought + Price Shock</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <div className="text-slate-400 font-semibold text-[11px]">Simulated PAR30 Peak</div>
                <div className="text-2xl font-mono font-extrabold text-orange-400 mt-1">
                  {stressScenario === "severe_drought" ? "4.8%" : stressScenario === "commodity_crash" ? "5.4%" : "7.2%"}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Baseline: 1.1%</div>
              </div>

              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <div className="text-slate-400 font-semibold text-[11px]">Parametric Claim Payouts</div>
                <div className="text-2xl font-mono font-extrabold text-white mt-1">
                  {stressScenario === "severe_drought" ? "$8.4M" : stressScenario === "commodity_crash" ? "$1.2M" : "$9.6M"}
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Covered by Reinsurance Panel</div>
              </div>

              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <div className="text-slate-400 font-semibold text-[11px]">Loan Recovery via Claim Offset</div>
                <div className="text-2xl font-mono font-extrabold text-emerald-400 mt-1">
                  {stressScenario === "severe_drought" ? "88.2%" : stressScenario === "commodity_crash" ? "74.0%" : "82.5%"}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Direct Lender Protection</div>
              </div>

              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <div className="text-slate-400 font-semibold text-[11px]">Net Capital Adequacy</div>
                <div className="text-2xl font-mono font-extrabold text-cyan-400 mt-1">
                  {stressScenario === "severe_drought" ? "17.4%" : stressScenario === "commodity_crash" ? "16.8%" : "15.2%"}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Well above 10% Regulatory Floor</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 8: NOTIFICATIONS & DIGITAL AGREEMENTS */}
      {activeFeature === "notifications_agreements" && (
        <div className="space-y-4">
          <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-[#240835] px-2 py-0.5 rounded border border-[#44105E]">
                  Legal Document Versioning & Dispatch
                </span>
                <h3 className="font-extrabold text-base text-white mt-1">
                  Digital Agreements & Multi-Channel Automated Notifications
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-[#07261B] px-3 py-1.5 rounded-xl border border-[#14533C]">
                eIDAS & Electronic Communications Act Compliant
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-3">
                <h5 className="font-bold text-white text-xs flex items-center gap-2">
                  <FileText className="w-4 h-4 text-violet-400" />
                  <span>Digital Agreement Signatures & Audit Registry</span>
                </h5>
                <p className="text-[11px] text-slate-300">
                  Every loan agreement, bundled insurance policy, and grain offtake contract is timestamped with biometric or SMS OTP cryptographic signature.
                </p>
                <div className="space-y-1.5 text-[10px] font-mono text-slate-300">
                  <div className="flex justify-between p-2 bg-[#10171B] rounded border border-[#1D2A32]">
                    <span>Contract #AGR-2026-9912 (Standard Bank)</span>
                    <span className="text-emerald-400 font-bold">Signed (OTP + GPS)</span>
                  </div>
                  <div className="flex justify-between p-2 bg-[#10171B] rounded border border-[#1D2A32]">
                    <span>Policy #POL-SANTAM-4412 (Santam Ag)</span>
                    <span className="text-emerald-400 font-bold">Signed (Biometric)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-3">
                <h5 className="font-bold text-white text-xs flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span>Automated Multi-Channel Notification Dispatch</span>
                </h5>
                <p className="text-[11px] text-slate-300">
                  Dispatches immediate updates via SMS, WhatsApp Business API, and push notifications for weather alarms, claim disbursements, and payment schedules.
                </p>
                <div className="space-y-1.5 text-[10px] font-mono text-slate-300">
                  <div className="flex justify-between p-2 bg-[#10171B] rounded border border-[#1D2A32]">
                    <span>Drought Warning: Free State Basin</span>
                    <span className="text-amber-400">12,480 SMS Sent</span>
                  </div>
                  <div className="flex justify-between p-2 bg-[#10171B] rounded border border-[#1D2A32]">
                    <span>Parametric Payout Credit Notice</span>
                    <span className="text-emerald-400">642 WhatsApps</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
