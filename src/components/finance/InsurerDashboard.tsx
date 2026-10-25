import React, { useState } from "react";
import {
  ShieldCheck,
  CloudRain,
  Sun,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingDown,
  TrendingUp,
  Percent,
  Layers,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  DollarSign,
  Activity,
  Calculator,
  RefreshCw,
  X,
  FileCheck,
  Check,
  Compass,
  Radio,
  FileText,
  Sliders,
  Sparkles,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export interface ParametricPolicy {
  id: string;
  insuredEntity: string;
  policyType: "Parametric Drought Index" | "Excess Rainfall & Flood" | "Livestock Mortality (VCI)" | "Multi-Peril Crop Insurance (MPCI)";
  country: string;
  region: string;
  acreageHa: number;
  livestockHead?: number;
  totalSumInsuredUSD: number;
  grossPremiumUSD: number;
  premiumRatePct: number;
  collectionStatus: "100% Collected" | "Deducted via Off-Take" | "Mobile Money Scheduled";
  renewalDate: string;
  triggerIndex: string;
  satelliteSensor: string;
  reinsurer: string;
}

export interface InsuranceClaim {
  id: string;
  policyId: string;
  claimantName: string;
  farmLocation: string;
  peril: "Drought" | "Excess Rain / Flood" | "Hail Storm" | "Heat Wave Shock";
  triggerDate: string;
  satelliteDataProof: string;
  deficitMeasurement: string;
  assessedLossPct: number;
  claimAmountUSD: number;
  status: "Pending Adjudication" | "Satellite Verified" | "Settled & Disbursed" | "Claim Rejected";
  payoutMethod: string;
}

export const InsurerDashboard: React.FC = () => {
  const { currentFarm } = useApp();

  const [activeTab, setActiveTab] = useState<
    "policies" | "claims" | "accumulation" | "loss_ratios" | "reinsurance"
  >("policies");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quote Calculator State
  const [quoteAcreage, setQuoteAcreage] = useState<string>("120");
  const [quoteCrop, setQuoteCrop] = useState<string>("Maize");
  const [quoteCountry, setQuoteCountry] = useState<string>("South Africa");
  const [quoteCoverageLevel, setQuoteCoverageLevel] = useState<number>(80);
  const [quoteResult, setQuoteResult] = useState<{
    sumInsuredUSD: number;
    premiumRatePct: number;
    annualPremiumUSD: number;
    triggerMetric: string;
  } | null>(null);

  // Initial Active Policies
  const [policies, setPolicies] = useState<ParametricPolicy[]>([
    {
      id: "POL-AFR-2026-104",
      insuredEntity: "Cape Farm Holdings (James Banda)",
      policyType: "Parametric Drought Index",
      country: "South Africa",
      region: "Free State",
      acreageHa: 250,
      totalSumInsuredUSD: 95000,
      grossPremiumUSD: 5890,
      premiumRatePct: 6.2,
      collectionStatus: "100% Collected",
      renewalDate: "2026-11-30",
      triggerIndex: "CHIRPS 18-day consecutive rainfall deficit < 25mm",
      satelliteSensor: "NASA SMAP + Sentinel-2 MSI",
      reinsurer: "Swiss Re / Africa Re Pool",
    },
    {
      id: "POL-AFR-2026-105",
      insuredEntity: "Nile Delta Citrus Union",
      policyType: "Excess Rainfall & Flood",
      country: "Egypt",
      region: "Beheira Governorate",
      acreageHa: 380,
      totalSumInsuredUSD: 160000,
      grossPremiumUSD: 7680,
      premiumRatePct: 4.8,
      collectionStatus: "Deducted via Off-Take",
      renewalDate: "2026-12-15",
      triggerIndex: "Cumulative rainfall > 110mm in 72 hours",
      satelliteSensor: "GPM IMERG Global Precipitation",
      reinsurer: "Munich Re Agriculture",
    },
    {
      id: "POL-AFR-2026-106",
      insuredEntity: "Northern Pastoralist Livestock Alliance",
      policyType: "Livestock Mortality (VCI)",
      country: "Kenya",
      region: "Marsabit & Turkana",
      acreageHa: 0,
      livestockHead: 4800,
      totalSumInsuredUSD: 144000,
      grossPremiumUSD: 10800,
      premiumRatePct: 7.5,
      collectionStatus: "100% Collected",
      renewalDate: "2027-02-28",
      triggerIndex: "MODIS Vegetation Condition Index (VCI) < 35%",
      satelliteSensor: "MODIS Terra/Aqua 250m",
      reinsurer: "ZEP-RE (PTA Reinsurance)",
    },
    {
      id: "POL-AFR-2026-107",
      insuredEntity: "Volta Basin Rice Farmers Co-op",
      policyType: "Multi-Peril Crop Insurance (MPCI)",
      country: "Ghana",
      region: "Volta Region",
      acreageHa: 310,
      totalSumInsuredUSD: 112000,
      grossPremiumUSD: 7280,
      premiumRatePct: 6.5,
      collectionStatus: "Mobile Money Scheduled",
      renewalDate: "2026-10-31",
      triggerIndex: "Combined Soil Moisture Deficit + Flood Alert",
      satelliteSensor: "Copernicus Sentinel-1 SAR",
      reinsurer: "Africa Re Group",
    },
    {
      id: "POL-AFR-2026-108",
      insuredEntity: "Mkushi Commercial Soy Producers",
      policyType: "Parametric Drought Index",
      country: "Zambia",
      region: "Central Province",
      acreageHa: 420,
      totalSumInsuredUSD: 168000,
      grossPremiumUSD: 9740,
      premiumRatePct: 5.8,
      collectionStatus: "100% Collected",
      renewalDate: "2026-12-30",
      triggerIndex: "Soil moisture root zone < 18% for 14 days",
      satelliteSensor: "ESA Soil Moisture CCI",
      reinsurer: "Swiss Re",
    },
  ]);

  // Initial Claims awaiting assessment or settlement
  const [claims, setClaims] = useState<InsuranceClaim[]>([
    {
      id: "CLM-2026-081",
      policyId: "POL-AFR-2026-104",
      claimantName: "Cape Farm Holdings (Parcel 03)",
      farmLocation: "Free State, South Africa",
      peril: "Drought",
      triggerDate: "2026-10-12",
      satelliteDataProof: "CHIRPS Sentinel-2 recorded 19 days without rain (Rainfall = 4.2mm vs 35mm norm)",
      deficitMeasurement: "4.2mm actual vs 25mm threshold",
      assessedLossPct: 40,
      claimAmountUSD: 38000,
      status: "Pending Adjudication",
      payoutMethod: "Standard Bank Instant Escrow (ZAR)",
    },
    {
      id: "CLM-2026-082",
      policyId: "POL-AFR-2026-107",
      claimantName: "Volta Lower Basin Outgrowers",
      farmLocation: "Volta Region, Ghana",
      peril: "Excess Rain / Flood",
      triggerDate: "2026-10-08",
      satelliteDataProof: "Sentinel-1 SAR surface water flood extent confirmed covering 48 hectares",
      deficitMeasurement: "142mm peak 48h rainfall (Threshold: 110mm)",
      assessedLossPct: 65,
      claimAmountUSD: 72800,
      status: "Satellite Verified",
      payoutMethod: "Mobile Money (MTN MoMo Ghana)",
    },
    {
      id: "CLM-2026-083",
      policyId: "POL-AFR-2026-106",
      claimantName: "Chalbi Forage Pastoralist Cluster",
      farmLocation: "Marsabit County, Kenya",
      peril: "Drought",
      triggerDate: "2026-09-28",
      satelliteDataProof: "MODIS VCI dropped to 28% (Severe vegetative stress across grazing corridor)",
      deficitMeasurement: "VCI 28% vs 35% trigger ceiling",
      assessedLossPct: 50,
      claimAmountUSD: 72000,
      status: "Settled & Disbursed",
      payoutMethod: "M-Pesa B2C Instant Disbursement",
    },
    {
      id: "CLM-2026-084",
      policyId: "POL-AFR-2026-108",
      claimantName: "Mkushi North Block 12",
      farmLocation: "Central Province, Zambia",
      peril: "Hail Storm",
      triggerDate: "2026-10-03",
      satelliteDataProof: "Severe convective cell radar reflectivity > 55 dBZ with ground damage log",
      deficitMeasurement: "Vegetative canopy loss 35% measured via high-res multispectral",
      assessedLossPct: 35,
      claimAmountUSD: 58800,
      status: "Pending Adjudication",
      payoutMethod: "Airtel Money / ZMW Wire",
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCalculateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const ha = Number(quoteAcreage) || 50;
    const valuePerHa = quoteCrop === "Cocoa" ? 1200 : quoteCrop === "Citrus" ? 1400 : 800;
    const sumInsured = ha * valuePerHa * (quoteCoverageLevel / 100);
    const baseRate = quoteCountry === "Kenya" ? 7.2 : quoteCountry === "South Africa" ? 6.2 : 5.8;
    const premium = (sumInsured * baseRate) / 100;

    setQuoteResult({
      sumInsuredUSD: Math.round(sumInsured),
      premiumRatePct: baseRate,
      annualPremiumUSD: Math.round(premium),
      triggerMetric: "CHIRPS Rainfall Deficit + Sentinel-2 Vegetation Index (VCI)",
    });
  };

  const handleBindQuote = () => {
    if (!quoteResult) return;
    const newPolicy: ParametricPolicy = {
      id: `POL-AFR-2026-${Math.floor(110 + Math.random() * 890)}`,
      insuredEntity: `${currentFarm.name} (${currentFarm.ownerName})`,
      policyType: "Parametric Drought Index",
      country: quoteCountry,
      region: "Commercial Zone",
      acreageHa: Number(quoteAcreage) || 100,
      totalSumInsuredUSD: quoteResult.sumInsuredUSD,
      grossPremiumUSD: quoteResult.annualPremiumUSD,
      premiumRatePct: quoteResult.premiumRatePct,
      collectionStatus: "100% Collected",
      renewalDate: "2027-10-31",
      triggerIndex: quoteResult.triggerMetric,
      satelliteSensor: "NASA SMAP + Sentinel-2",
      reinsurer: "Swiss Re / Africa Re Treaty",
    };

    setPolicies((prev) => [newPolicy, ...prev]);
    setQuoteResult(null);
    showToast(`Bound new policy ${newPolicy.id} for $${newPolicy.totalSumInsuredUSD.toLocaleString()} TSI.`);
  };

  const handleSettleClaim = (claimId: string) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: "Settled & Disbursed" } : c))
    );
    showToast(`Claim ${claimId} successfully settled and funds disbursed via automated instant rail.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Insurer & Reinsurer Scope */}
      <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-2 rounded-xl bg-[#07261B] text-emerald-400 border border-[#14533C]">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Pan-African Agricultural Insurer & Underwriting Command
            </h2>
            <span className="text-xs font-mono font-bold bg-[#07261B] text-emerald-300 px-2.5 py-0.5 rounded border border-[#14533C]">
              Parametric Satellite Oracles Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Underwriting portfolio management for agricultural insurers, syndicates, and reinsurers. Satellite-indexed drought triggers, geographic accumulation controls, and instant digital loss settlement.
          </p>
        </div>

        {/* Global Solvency & Capacity Inset */}
        <div className="flex items-center gap-3 bg-[#07261B] px-4 py-2.5 rounded-2xl border border-[#14533C]">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              AIO Solvency Capital Ratio
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold font-mono text-white">218%</span>
              <span className="text-xs font-bold text-emerald-300">(&gt; 150% Statutory)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 bg-[#07261B] border border-[#14533C] rounded-xl text-xs font-bold text-emerald-200 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 6 High-Density Executive Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Sum Insured (TSI) */}
        <div className="p-3.5 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Sum Insured (TSI)
          </span>
          <div className="text-xl font-mono font-extrabold text-white">$184.5M</div>
          <span className="text-[10px] text-slate-400 block">$382 / Ha Mean Cover</span>
        </div>

        {/* Insured Acreage */}
        <div className="p-3.5 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Insured Acreage
          </span>
          <div className="text-xl font-mono font-extrabold text-emerald-400">482,000 Ha</div>
          <span className="text-[10px] text-slate-400 block">12 African Nations</span>
        </div>

        {/* Insured Livestock */}
        <div className="p-3.5 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Insured Livestock
          </span>
          <div className="text-xl font-mono font-extrabold text-white">124,500 Head</div>
          <span className="text-[10px] text-slate-400 block">Pastoralist Index Cover</span>
        </div>

        {/* Gross Written Premium (GWP) */}
        <div className="p-3.5 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Gross Written Premium
          </span>
          <div className="text-xl font-mono font-extrabold text-white">$9.24M</div>
          <span className="text-[10px] font-mono text-emerald-400 block">96.2% Collected</span>
        </div>

        {/* Loss Ratio */}
        <div className="p-3.5 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Gross Loss Ratio
          </span>
          <div className="text-xl font-mono font-extrabold text-emerald-300">41.2%</div>
          <span className="text-[10px] text-slate-400 block">Below 70% Reinsurance Trigger</span>
        </div>

        {/* Claims Awaiting Assessment */}
        <div className="p-3.5 rounded-2xl bg-[#07261B] border border-[#14533C] space-y-1">
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
            Pending Claims
          </span>
          <div className="text-xl font-mono font-extrabold text-white">
            {claims.filter((c) => c.status !== "Settled & Disbursed").length} Cases
          </div>
          <span className="text-[10px] font-mono text-emerald-400 block">
            ${claims.filter((c) => c.status !== "Settled & Disbursed").reduce((a, b) => a + b.claimAmountUSD, 0).toLocaleString()} USD
          </span>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1D2A32] pb-2 overflow-x-auto scrollbar-none text-xs">
        <button
          onClick={() => setActiveTab("policies")}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "policies"
              ? "bg-[#0B3D2C] text-white shadow-xs border border-[#196349]"
              : "text-slate-400 hover:text-white hover:bg-[#162228]"
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>Quotes, Policies & Renewals ({policies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("claims")}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "claims"
              ? "bg-[#0B3D2C] text-white shadow-xs border border-[#196349]"
              : "text-slate-400 hover:text-white hover:bg-[#162228]"
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Satellite Claims Assessment ({claims.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("accumulation")}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "accumulation"
              ? "bg-[#0B3D2C] text-white shadow-xs border border-[#196349]"
              : "text-slate-400 hover:text-white hover:bg-[#162228]"
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Geographic Exposure & Accumulation</span>
        </button>

        <button
          onClick={() => setActiveTab("loss_ratios")}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "loss_ratios"
              ? "bg-[#0B3D2C] text-white shadow-xs border border-[#196349]"
              : "text-slate-400 hover:text-white hover:bg-[#162228]"
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
          <span>Loss Ratios, Frequency & Severity</span>
        </button>

        <button
          onClick={() => setActiveTab("reinsurance")}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "reinsurance"
              ? "bg-[#0B3D2C] text-white shadow-xs border border-[#196349]"
              : "text-slate-400 hover:text-white hover:bg-[#162228]"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Reinsurance Limits, Reserves & Underwriting Performance</span>
        </button>
      </div>

      {/* TAB 1: Quotes, Policies, Premium Collection & Renewals */}
      {activeTab === "policies" && (
        <div className="space-y-6">
          {/* Interactive Parametric Quote Generator */}
          <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#1D2A32] gap-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <h4 className="font-extrabold text-sm text-white">
                  Automated Parametric Crop & Weather Underwriting Quote Engine
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                Actuarial Pricing Algorithm
              </span>
            </div>

            <form onSubmit={handleCalculateQuote} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Target Territory</label>
                <select
                  value={quoteCountry}
                  onChange={(e) => setQuoteCountry(e.target.value)}
                  className="w-full bg-[#162228] text-white border border-[#1D2A32] px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="South Africa">South Africa (Free State)</option>
                  <option value="Kenya">Kenya (Rift Valley / Nakuru)</option>
                  <option value="Ghana">Ghana (Ashanti / Volta)</option>
                  <option value="Zambia">Zambia (Mkushi Block)</option>
                  <option value="Egypt">Egypt (Nile Delta)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Crop / Enterprise</label>
                <select
                  value={quoteCrop}
                  onChange={(e) => setQuoteCrop(e.target.value)}
                  className="w-full bg-[#162228] text-white border border-[#1D2A32] px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="Maize">Maize / Corn</option>
                  <option value="Soybeans">Soybeans</option>
                  <option value="Cocoa">Cocoa / Tree Crops</option>
                  <option value="Citrus">Citrus & Horticulture</option>
                  <option value="Wheat">Wheat</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Insured Acreage (Hectares)</label>
                <input
                  type="number"
                  value={quoteAcreage}
                  onChange={(e) => setQuoteAcreage(e.target.value)}
                  className="w-full bg-[#162228] text-white font-mono font-bold border border-[#1D2A32] px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Coverage Level ({quoteCoverageLevel}%)</label>
                <select
                  value={quoteCoverageLevel}
                  onChange={(e) => setQuoteCoverageLevel(Number(e.target.value))}
                  className="w-full bg-[#162228] text-white border border-[#1D2A32] px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value={70}>70% Harvest Floor</option>
                  <option value={80}>80% Standard Cover</option>
                  <option value={90}>90% Comprehensive Parametric</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Price Quote</span>
                </button>
              </div>
            </form>

            {/* Calculated Quote Result Card */}
            {quoteResult && (
              <div className="p-4 bg-[#07261B] rounded-2xl border border-[#14533C] flex flex-wrap items-center justify-between gap-4 text-xs animate-in fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Sum Insured</span>
                    <span className="text-base font-mono font-extrabold text-white">
                      ${quoteResult.sumInsuredUSD.toLocaleString()} USD
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Actuarial Rate</span>
                    <span className="text-base font-mono font-extrabold text-emerald-300">
                      {quoteResult.premiumRatePct}% p.a.
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Annual Premium</span>
                    <span className="text-base font-mono font-extrabold text-white">
                      ${quoteResult.annualPremiumUSD.toLocaleString()} USD
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Satellite Trigger</span>
                    <span className="text-slate-200 font-semibold truncate block mt-0.5">
                      {quoteResult.triggerMetric}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleBindQuote}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#090D0F] font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Bind & Underwrite Policy</span>
                </button>
              </div>
            )}
          </div>

          {/* Premium Collection & Policy Renewal Pipeline */}
          <div className="p-4 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-3">
            <div className="flex flex-wrap items-center justify-between pb-2.5 border-b border-[#1D2A32] gap-2">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <h4 className="font-extrabold text-sm text-white">
                  Premium Collection Real-Time Inflow & Policy Renewal Pipeline
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Collection Performance: <strong className="text-emerald-400">$8.89M</strong> / $9.24M (96.2%)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold">
                  <span>30-Day Renewals</span>
                  <span className="font-mono text-emerald-400 font-bold">1 Policy</span>
                </div>
                <div className="text-base font-mono font-extrabold text-white mt-1">$112,000 TSI</div>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Volta Rice • Mobile Scheduled</span>
              </div>

              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold">
                  <span>60-Day Renewals</span>
                  <span className="font-mono text-cyan-400 font-bold">1 Policy</span>
                </div>
                <div className="text-base font-mono font-extrabold text-cyan-300 mt-1">$95,000 TSI</div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Cape Farm • Escrow Pre-Authorized</span>
              </div>

              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold">
                  <span>90-Day Renewals</span>
                  <span className="font-mono text-amber-400 font-bold">2 Policies</span>
                </div>
                <div className="text-base font-mono font-extrabold text-amber-300 mt-1">$328,000 TSI</div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Nile Citrus & Mkushi Soy</span>
              </div>

              <div className="p-3 bg-[#07261B] rounded-xl border border-[#14533C]">
                <div className="flex justify-between items-center text-[10px] text-emerald-300 uppercase font-bold">
                  <span>Automated Escrow Rate</span>
                  <span className="font-mono text-emerald-300 font-bold">84%</span>
                </div>
                <div className="text-base font-mono font-extrabold text-emerald-300 mt-1">Zero Arrears</div>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Deducted at Harvest Off-Take</span>
              </div>
            </div>
          </div>

          {/* Active Policies Table */}
          <div className="bg-[#10171B] rounded-2xl border border-[#1D2A32] overflow-hidden shadow-sm">
            <div className="p-4 bg-[#162228] border-b border-[#1D2A32] flex justify-between items-center text-xs">
              <div>
                <h4 className="font-extrabold text-sm text-white">Active Underwritten Policies Portfolio</h4>
                <p className="text-[11px] text-slate-400">All contracts bound under African Insurance Organization (AIO) guidelines.</p>
              </div>
              <span className="font-mono text-emerald-400 font-bold">{policies.length} Policies Active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#10171B] text-slate-400 border-b border-[#1D2A32] font-semibold">
                    <th className="p-3.5">Policy Ref & Insured</th>
                    <th className="p-3.5">Coverage Type</th>
                    <th className="p-3.5">Acreage / Animals</th>
                    <th className="p-3.5">Total Sum Insured</th>
                    <th className="p-3.5">Gross Premium (GWP)</th>
                    <th className="p-3.5">Premium Status</th>
                    <th className="p-3.5">Renewal Date</th>
                    <th className="p-3.5 text-right">Reinsurer Treaty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D2A32]">
                  {policies.map((p) => (
                    <tr key={p.id} className="hover:bg-[#162228]/40 transition-colors">
                      <td className="p-3.5">
                        <div className="font-mono text-emerald-400 font-bold">{p.id}</div>
                        <div className="font-bold text-white text-xs mt-0.5">{p.insuredEntity}</div>
                        <div className="text-[10px] text-slate-400">{p.country} ({p.region})</div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-slate-200">{p.policyType}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.satelliteSensor}</div>
                      </td>

                      <td className="p-3.5 font-mono text-slate-200">
                        {p.acreageHa > 0 ? `${p.acreageHa} Hectares` : `${p.livestockHead?.toLocaleString()} Head`}
                      </td>

                      <td className="p-3.5 font-mono font-extrabold text-white text-sm">
                        ${p.totalSumInsuredUSD.toLocaleString()} USD
                      </td>

                      <td className="p-3.5">
                        <div className="font-mono font-bold text-white">${p.grossPremiumUSD.toLocaleString()}</div>
                        <div className="text-[10px] font-mono text-emerald-400">{p.premiumRatePct}% rate</div>
                      </td>

                      <td className="p-3.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#07261B] text-emerald-300 border border-[#14533C]">
                          {p.collectionStatus}
                        </span>
                      </td>

                      <td className="p-3.5 font-mono text-slate-300">
                        {p.renewalDate}
                      </td>

                      <td className="p-3.5 text-right font-mono text-slate-300 text-[11px]">
                        {p.reinsurer}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Claims Awaiting Assessment & Parametric Settlement */}
      {activeTab === "claims" && (
        <div className="space-y-4">
          <div className="p-4 bg-[#10171B] rounded-2xl border border-[#1D2A32] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <h4 className="font-extrabold text-sm text-white">
                Parametric Climate Claims Queue & Adjudication
              </h4>
              <p className="text-slate-400 text-[11px]">
                Satellite and weather radar telematics trigger instant loss assessments with zero loss adjuster overhead.
              </p>
            </div>
            <span className="font-mono text-emerald-400 font-bold bg-[#07261B] px-2.5 py-1 rounded-lg border border-[#14533C]">
              48-Hour Settlement SLA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className={`p-5 rounded-2xl border transition-all ${
                  claim.status === "Settled & Disbursed"
                    ? "bg-[#07261B] border-[#14533C]"
                    : "bg-[#10171B] border-[#1D2A32]"
                } space-y-3.5`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-400">{claim.id}</span>
                    <h5 className="font-extrabold text-sm text-white mt-0.5">{claim.claimantName}</h5>
                    <span className="text-[11px] text-slate-400">{claim.farmLocation}</span>
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

                {/* Peril & Deficit Telemetry */}
                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Insured Peril:</span>
                    <span className="font-bold text-white">{claim.peril}</span>
                  </div>
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-slate-400">Trigger Date:</span>
                    <span className="text-slate-200">{claim.triggerDate}</span>
                  </div>
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-slate-400">Measured Deficit:</span>
                    <span className="text-red-300 font-bold">{claim.deficitMeasurement}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-[#1D2A32] italic">
                    Proof: {claim.satelliteDataProof}
                  </div>
                </div>

                {/* Payout & Adjudication Actions */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Assessed Payout</span>
                    <span className="text-lg font-mono font-extrabold text-white">
                      ${claim.claimAmountUSD.toLocaleString()} USD
                    </span>
                    <span className="text-[10px] text-slate-400 block">Via {claim.payoutMethod}</span>
                  </div>

                  <div>
                    {claim.status !== "Settled & Disbursed" ? (
                      <button
                        onClick={() => handleSettleClaim(claim.id)}
                        className="px-4 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Authorize Payout</span>
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-300 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Disbursed</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Geographic Exposure & Weather Accumulation */}
      {activeTab === "accumulation" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* River Basin Accumulation Limits */}
            <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D2A32]">
                <h4 className="font-extrabold text-sm text-white">River Basin Weather Risk Accumulation</h4>
                <span className="text-[10px] font-mono text-slate-400">Catastrophe PML Controls</span>
              </div>
              <p className="text-[11px] text-slate-400">
                To prevent localized catastrophic correlation, total sum insured per agro-climatic basin is strictly capped.
              </p>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between font-bold text-slate-300 mb-1">
                    <span>Zambezi Agricultural Basin (Zambia / Zimbabwe)</span>
                    <span className="font-mono text-white">$34M / $50M Cap (68%)</span>
                  </div>
                  <div className="w-full bg-[#162228] h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "68%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-300 mb-1">
                    <span>East African Great Rift Valley (Kenya / Tanzania)</span>
                    <span className="font-mono text-white">$48M / $60M Cap (80%)</span>
                  </div>
                  <div className="w-full bg-[#162228] h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: "80%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-300 mb-1">
                    <span>Niger River Basin & Delta (Nigeria / Mali)</span>
                    <span className="font-mono text-white">$28M / $40M Cap (70%)</span>
                  </div>
                  <div className="w-full bg-[#162228] h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "70%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-300 mb-1">
                    <span>Sahel Transition Zone (Senegal / Mali)</span>
                    <span className="font-mono text-white">$18M / $30M Cap (60%)</span>
                  </div>
                  <div className="w-full bg-[#162228] h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Peril Accumulation & Telemetric Climate Early Warnings */}
            <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D2A32]">
                <h4 className="font-extrabold text-sm text-white">Live Meteorological Alert Feeds</h4>
                <span className="text-[10px] font-mono text-emerald-400">ECMWF / NOAA Integration</span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-amber-300 flex items-center gap-1.5">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>El Niño Southern Oscillation (ENSO) Drought Watch</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">High Confidence</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Southern Africa summer rainfall forecast modeled at 12% below multi-year mean. Reinsurance capacity buffer raised by 15%.
                  </p>
                </div>

                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-cyan-300 flex items-center gap-1.5">
                      <CloudRain className="w-4 h-4 text-cyan-400" />
                      <span>Indian Ocean Dipole (IOD) Moisture Surge</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Active Alert</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Positive IOD index driving favorable short rains across Kenya and Tanzania highlands. Excess rainfall flood riders monitored in lowlands.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Loss Ratios, Frequency & Severity */}
      {activeTab === "loss_ratios" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* 5-Year Loss Ratio Trend */}
            <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D2A32]">
                <h4 className="font-extrabold text-sm text-white">5-Year Historical Loss Ratio</h4>
                <span className="font-mono text-emerald-400 text-[10px]">Benchmark &lt; 65%</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">2022 Season</span>
                  <span className="font-mono font-bold text-white">48.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">2023 Season (Severe Drought)</span>
                  <span className="font-mono font-bold text-amber-300">54.6%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">2024 Season (Optimal Harvest)</span>
                  <span className="font-mono font-bold text-emerald-300">38.1%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">2025 Season</span>
                  <span className="font-mono font-bold text-white">44.0%</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#1D2A32]">
                  <span className="font-bold text-white">2026 Season YTD</span>
                  <span className="font-mono font-extrabold text-emerald-400 text-sm">41.2%</span>
                </div>
              </div>
            </div>

            {/* Claims Frequency & Severity */}
            <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D2A32]">
                <h4 className="font-extrabold text-sm text-white">Claims Frequency & Severity</h4>
                <span className="font-mono text-[10px] text-slate-400">Actuarial Curve</span>
              </div>
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Minor Triggers (&lt; $2,000)</span>
                    <span className="font-mono font-bold text-white">64% Frequency</span>
                  </div>
                  <div className="w-full bg-[#162228] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "64%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Moderate Triggers ($2,000 - $10,000)</span>
                    <span className="font-mono font-bold text-white">28% Frequency</span>
                  </div>
                  <div className="w-full bg-[#162228] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: "28%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Severe / Catastrophe (&gt; $10,000)</span>
                    <span className="font-mono font-bold text-white">8% Frequency</span>
                  </div>
                  <div className="w-full bg-[#162228] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: "8%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Loss by Peril Breakdown */}
            <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D2A32]">
                <h4 className="font-extrabold text-sm text-white">Loss Distribution by Peril</h4>
                <span className="font-mono text-[10px] text-slate-400">100% Attributed</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 rounded-lg bg-[#162228]">
                  <span className="text-white">Rainfall Deficit / Drought</span>
                  <span className="font-mono font-bold text-amber-300">52%</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-[#162228]">
                  <span className="text-white">Excess Rainfall & Flash Flood</span>
                  <span className="font-mono font-bold text-cyan-300">22%</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-[#162228]">
                  <span className="text-white">Hail & Convective Storms</span>
                  <span className="font-mono font-bold text-purple-300">16%</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-[#162228]">
                  <span className="text-white">Fall Armyworm & Biosecurity</span>
                  <span className="font-mono font-bold text-emerald-300">10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Reinsurance Treaties, Limits, Reserves & Underwriting Performance */}
      {activeTab === "reinsurance" && (
        <div className="space-y-5">
          {/* Top Reinsurance Panel */}
          <div className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1D2A32]">
              <div>
                <h4 className="font-extrabold text-sm text-white">
                  Reinsurance Treaty Limits & Underwriting Capital Reserves
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Treaty structures syndicated with Swiss Re, Africa Re, and ZEP-RE for catastrophic stop-loss protection.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-[#07261B] px-2.5 py-1 rounded-lg border border-[#14533C]">
                $65M Treaty Limit Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Quota Share Treaty</span>
                <div className="text-base font-bold text-white">40% Proportional Share</div>
                <p className="text-[11px] text-slate-300">
                  Swiss Re cedes 40% of all gross written premiums and pays 40% of all parametric trigger claims.
                </p>
                <div className="font-mono text-emerald-400 text-[11px]">Ceding Commission: 18.5%</div>
              </div>

              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Excess of Loss (XOL)</span>
                <div className="text-base font-bold text-white">$20M xs $10M Layer</div>
                <p className="text-[11px] text-slate-300">
                  Africa Re syndication protects primary portfolio against regional catastrophic drought triggers exceeding $10M.
                </p>
                <div className="font-mono text-emerald-400 text-[11px]">Reinstatement: 1 Paid @ 100%</div>
              </div>

              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Technical Loss Reserves</span>
                <div className="text-base font-bold text-emerald-300">$18.4M Liquid Reserves</div>
                <p className="text-[11px] text-slate-300">
                  Ring-fenced reserves held in short-term African Development Bank green bonds and AAA sovereign paper.
                </p>
                <div className="font-mono text-emerald-400 text-[11px]">Solvency Ratio: 218%</div>
              </div>
            </div>
          </div>

          {/* Underwriting Performance & Combined Operating Ratio Matrix */}
          <div className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1D2A32]">
              <div>
                <h4 className="font-extrabold text-sm text-white">
                  Institutional Underwriting Performance & Profitability
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Combined Operating Ratio (COR), net loss metrics, operating expense ratios, and underwriting return.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-[#07261B] px-2.5 py-1 rounded-lg border border-[#14533C]">
                40.4% Underwriting Margin
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Gross Written Premium</span>
                <div className="text-lg font-mono font-extrabold text-white mt-1">$9.24M</div>
                <span className="text-[10px] text-slate-400 block mt-0.5">100% Direct Book</span>
              </div>

              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Retained Premium</span>
                <div className="text-lg font-mono font-extrabold text-cyan-300 mt-1">$5.54M</div>
                <span className="text-[10px] text-slate-400 block mt-0.5">After 40% Quota Cession</span>
              </div>

              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Combined Ratio (COR)</span>
                <div className="text-lg font-mono font-extrabold text-emerald-400 mt-1">59.6%</div>
                <span className="text-[10px] text-slate-400 block mt-0.5">41.2% Loss + 18.4% Expense</span>
              </div>

              <div className="p-3 bg-[#07261B] rounded-xl border border-[#14533C]">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">Net Underwriting Profit</span>
                <div className="text-lg font-mono font-extrabold text-emerald-300 mt-1">$2.07M</div>
                <span className="text-[10px] text-emerald-400 block mt-0.5">22.8% RORAC Yield</span>
              </div>
            </div>

            {/* Syndicated Treaty Syndicate Table */}
            <div className="p-3.5 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-400 font-bold pb-1 border-b border-[#1D2A32]">
                <span>Reinsurer Syndicate Member</span>
                <span>Share & Rating</span>
                <span>Treaty Allocation</span>
              </div>
              <div className="flex justify-between items-center text-white py-1 border-b border-[#1D2A32]/50">
                <span className="font-semibold">Swiss Re Agriculture</span>
                <span className="font-mono text-emerald-400 font-bold">40% • S&P AA-</span>
                <span className="font-mono text-slate-300">$26.0M Quota Share</span>
              </div>
              <div className="flex justify-between items-center text-white py-1 border-b border-[#1D2A32]/50">
                <span className="font-semibold">Africa Re Group</span>
                <span className="font-mono text-emerald-400 font-bold">35% • A.M. Best A</span>
                <span className="font-mono text-slate-300">$22.75M XOL Layer</span>
              </div>
              <div className="flex justify-between items-center text-white py-1 border-b border-[#1D2A32]/50">
                <span className="font-semibold">ZEP-RE (PTA Reinsurance Co.)</span>
                <span className="font-mono text-emerald-400 font-bold">15% • A.M. Best B++</span>
                <span className="font-mono text-slate-300">$9.75M Pastoralist VCI</span>
              </div>
              <div className="flex justify-between items-center text-white py-1">
                <span className="font-semibold">Munich Re Syndication</span>
                <span className="font-mono text-emerald-400 font-bold">10% • S&P AA</span>
                <span className="font-mono text-slate-300">$6.5M Stop-Loss Buffer</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
