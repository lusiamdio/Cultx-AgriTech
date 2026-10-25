import React, { useState } from "react";
import {
  Building2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileCheck,
  ShieldAlert,
  Percent,
  Layers,
  Users,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  PieChart,
  BarChart3,
  Calendar,
  Sparkles,
  Download,
  X,
  FileSpreadsheet,
  Check,
  Lock,
  Compass,
  Sprout,
  Activity,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export interface LoanApplication {
  id: string;
  applicantName: string;
  farmName: string;
  country: string;
  region: string;
  commodity: string;
  hectares: number;
  requestedAmountUSD: number;
  facilityType: "Input Credit" | "Working Capital" | "Equipment Leasing" | "Infrastructure / Silo";
  tenureMonths: number;
  interestRateAnnual: number;
  ndviScore: number;
  agriTrustRating: "A+" | "A" | "B+" | "B" | "C";
  collateralType: "e-WRS Grain Lien" | "Off-Take Escrow" | "Parametric Insurance + Crop Lien" | "Land Title Deed";
  collateralValueUSD: number;
  status: "Under Review" | "Committee Approved" | "Additional Info Required" | "Disbursed" | "Rejected";
  dscr: number; // Debt Service Coverage Ratio
  covenants: {
    name: string;
    target: string;
    actual: string;
    compliant: boolean;
  }[];
  appliedDate: string;
  riskHighlights: string[];
}

export const FinancierDashboard: React.FC = () => {
  const { currentFarm, setCurrentView } = useApp();

  const [activeTab, setActiveTab] = useState<
    "applications" | "portfolio" | "concentration" | "covenants"
  >("applications");

  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [filterCommodity, setFilterCommodity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial Loan Applications awaiting review and approval
  const [applications, setApplications] = useState<LoanApplication[]>([
    {
      id: "LN-2026-9041",
      applicantName: "James Banda",
      farmName: "Cape Farm Holdings",
      country: "South Africa",
      region: "Free State",
      commodity: "Yellow Maize",
      hectares: 250,
      requestedAmountUSD: 85000,
      facilityType: "Input Credit",
      tenureMonths: 8,
      interestRateAnnual: 9.2,
      ndviScore: 0.88,
      agriTrustRating: "A+",
      collateralType: "e-WRS Grain Lien",
      collateralValueUSD: 142000,
      status: "Under Review",
      dscr: 1.62,
      appliedDate: "2026-10-14",
      riskHighlights: [
        "Optimal NDVI chlorophyll across all 4 production zones",
        "SAFEX licensed silo receipt with 150 MT Grade 1 maize deposited",
        "100% off-take contract with Pan-African Milling locked in escrow",
      ],
      covenants: [
        { name: "Minimum Vegetative NDVI", target: ">= 0.65", actual: "0.88", compliant: true },
        { name: "Forward Off-Take Hedging Ratio", target: ">= 60%", actual: "82%", compliant: true },
        { name: "Debt Service Coverage Ratio (DSCR)", target: ">= 1.25x", actual: "1.62x", compliant: true },
        { name: "Active Parametric Weather Policy", target: "Required", actual: "Active (Africa Re)", compliant: true },
      ],
    },
    {
      id: "LN-2026-9042",
      applicantName: "Fatima Al-Mansoor",
      farmName: "Nile Delta Citrus & Grain",
      country: "Egypt",
      region: "Beheira Governorate",
      commodity: "Valencia Oranges & Wheat",
      hectares: 380,
      requestedAmountUSD: 160000,
      facilityType: "Working Capital",
      tenureMonths: 12,
      interestRateAnnual: 8.8,
      ndviScore: 0.91,
      agriTrustRating: "A+",
      collateralType: "Off-Take Escrow",
      collateralValueUSD: 280000,
      status: "Committee Approved",
      dscr: 1.84,
      appliedDate: "2026-10-12",
      riskHighlights: [
        "GlobalGAP Certified for European and GCC export clearance",
        "Direct canal drip irrigation with zero seasonal water stress",
        "Off-take advance secured via Alexandria logistics terminal",
      ],
      covenants: [
        { name: "Export Phytosanitary Compliance", target: "100%", actual: "100%", compliant: true },
        { name: "Water Allocation Permit", target: "Valid", actual: "Renewed 2028", compliant: true },
        { name: "Debt Service Coverage Ratio (DSCR)", target: ">= 1.30x", actual: "1.84x", compliant: true },
        { name: "Foreign Exchange Risk Buffer", target: ">= 15%", actual: "22%", compliant: true },
      ],
    },
    {
      id: "LN-2026-9043",
      applicantName: "Ephraim Tembo",
      farmName: "Copperbelt Outgrower Scheme",
      country: "Zambia",
      region: "Mkushi Farming Block",
      commodity: "Soybeans",
      hectares: 180,
      requestedAmountUSD: 62000,
      facilityType: "Input Credit",
      tenureMonths: 7,
      interestRateAnnual: 10.4,
      ndviScore: 0.74,
      agriTrustRating: "A",
      collateralType: "Parametric Insurance + Crop Lien",
      collateralValueUSD: 98000,
      status: "Under Review",
      dscr: 1.38,
      appliedDate: "2026-10-15",
      riskHighlights: [
        "Verified soil laboratory pH buffering 6.2 with lime application",
        "Parametric drought insurance policy bound through ZEP-RE",
        "Lobito Atlantic rail corridor freight allocation confirmed",
      ],
      covenants: [
        { name: "Soil Moisture Index", target: ">= 32%", actual: "38%", compliant: true },
        { name: "Mandatory Fungicide Application", target: "Day 45", actual: "Scheduled", compliant: true },
        { name: "Debt Service Coverage Ratio (DSCR)", target: ">= 1.25x", actual: "1.38x", compliant: true },
        { name: "Single Buyer Concentration", target: "< 70%", actual: "64%", compliant: true },
      ],
    },
    {
      id: "LN-2026-9044",
      applicantName: "Kofi Mensah",
      farmName: "Ashanti Cocoa Producer Cooperative",
      country: "Ghana",
      region: "Kumasi Hinterland",
      commodity: "Cocoa",
      hectares: 420,
      requestedAmountUSD: 140000,
      facilityType: "Infrastructure / Silo",
      tenureMonths: 24,
      interestRateAnnual: 9.8,
      ndviScore: 0.83,
      agriTrustRating: "A",
      collateralType: "Off-Take Escrow",
      collateralValueUSD: 245000,
      status: "Additional Info Required",
      dscr: 1.45,
      appliedDate: "2026-10-09",
      riskHighlights: [
        "Solar drying warehouse construction 60% completed",
        "COCOBOD traceability audit compliant with EU Deforestation Regulation (EUDR)",
        "Awaiting contractor final stage inspection sign-off",
      ],
      covenants: [
        { name: "EUDR Deforestation Cadastre Geolocation", target: "100%", actual: "100%", compliant: true },
        { name: "Fairtrade Premium Ringfencing", target: "Audited", actual: "Verified", compliant: true },
        { name: "Debt Service Coverage Ratio (DSCR)", target: ">= 1.20x", actual: "1.45x", compliant: true },
        { name: "Warehouse Construction Milestone", target: "Phase 3", actual: "Phase 2 (Pending)", compliant: false },
      ],
    },
    {
      id: "LN-2026-9045",
      applicantName: "Grace Wanjiku",
      farmName: "Rift Valley Highland Estate",
      country: "Kenya",
      region: "Nakuru County",
      commodity: "Specialty Tea & Macadamia",
      hectares: 120,
      requestedAmountUSD: 54000,
      facilityType: "Equipment Leasing",
      tenureMonths: 18,
      interestRateAnnual: 9.0,
      ndviScore: 0.89,
      agriTrustRating: "A+",
      collateralType: "Land Title Deed",
      collateralValueUSD: 180000,
      status: "Committee Approved",
      dscr: 1.92,
      appliedDate: "2026-10-11",
      riskHighlights: [
        "Solar cold-storage installation financing with 40% operating cost cut",
        "Deed registry freehold anchor validated on national cadastre",
        "Rainfall baseline 1,100mm annually with gravity-fed furrow system",
      ],
      covenants: [
        { name: "Equipment Asset Register Tagging", target: "GPS Telematics", actual: "Active", compliant: true },
        { name: "Debt Service Coverage Ratio (DSCR)", target: ">= 1.30x", actual: "1.92x", compliant: true },
        { name: "Comprehensive Mechanical Breakdown Insurance", target: "Required", actual: "Bound", compliant: true },
        { name: "Working Capital Ratio", target: ">= 1.5x", actual: "1.82x", compliant: true },
      ],
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDecision = (id: string, newStatus: LoanApplication["status"]) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
    if (selectedApplication && selectedApplication.id === id) {
      setSelectedApplication((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Application ${id} status updated to "${newStatus}" by Credit Committee.`);
  };

  const filteredApps = applications.filter((app) => {
    const matchComm = filterCommodity === "all" || app.commodity.toLowerCase().includes(filterCommodity.toLowerCase());
    const matchStatus = filterStatus === "all" || app.status === filterStatus;
    return matchComm && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Financier Operational Scope */}
      <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-2 rounded-xl bg-[#07261B] text-emerald-400 border border-[#14533C]">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Institutional Agri-Financier & DFI Command Center
            </h2>
            <span className="text-xs font-mono font-bold bg-[#07261B] text-emerald-300 px-2.5 py-0.5 rounded border border-[#14533C]">
              Basel III / DFI Compliant
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Underwriting, covenant monitoring, risk-adjusted returns (RAROC), and portfolio-at-risk (PAR) intelligence for agricultural banks and microfinance institutions.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              const csvContent =
                "Loan ID,Applicant,Country,Commodity,Amount USD,Status,NDVI,Collateral\n" +
                applications
                  .map(
                    (a) =>
                      `${a.id},"${a.applicantName}","${a.country}","${a.commodity}",${a.requestedAmountUSD},"${a.status}",${a.ndviScore},"${a.collateralType}"`
                  )
                  .join("\n");
              const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `Agri_Loan_Book_${new Date().toISOString().slice(0, 10)}.csv`;
              link.click();
              URL.revokeObjectURL(url);
              showToast("Exported loan portfolio dataset (.CSV).");
            }}
            className="px-3.5 py-2 rounded-xl bg-[#162228] hover:bg-[#1D2A32] text-slate-200 border border-[#1D2A32] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Loan Book (.CSV)</span>
          </button>
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
        {/* Disbursed Capital */}
        <div className="p-3.5 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Disbursed Capital
          </span>
          <div className="text-xl font-mono font-extrabold text-white">$42.8M</div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold block">
            +18.4% YoY Growth
          </span>
        </div>

        {/* Outstanding Loan Book */}
        <div className="p-3.5 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Loan Book
          </span>
          <div className="text-xl font-mono font-extrabold text-white">$31.2M</div>
          <span className="text-[10px] font-mono text-slate-400 block">
            1,622 Active Facilities
          </span>
        </div>

        {/* Repayment Performance */}
        <div className="p-3.5 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Repayment Rate
          </span>
          <div className="text-xl font-mono font-extrabold text-emerald-400">97.6%</div>
          <span className="text-[10px] text-slate-400 block">
            $748K Arrears Restructured
          </span>
        </div>

        {/* Portfolio-at-Risk (PAR 30) */}
        <div className="p-3.5 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Portfolio at Risk (PAR 30)
          </span>
          <div className="text-xl font-mono font-extrabold text-amber-300">2.4%</div>
          <span className="text-[10px] text-slate-400 block">
            Below 5.0% DFI Ceiling
          </span>
        </div>

        {/* Risk-Adjusted Return (RAROC) */}
        <div className="p-3.5 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            RAROC Net Yield
          </span>
          <div className="text-xl font-mono font-extrabold text-emerald-300">14.8%</div>
          <span className="text-[10px] text-slate-400 block">
            Post-ECL Provisioning
          </span>
        </div>

        {/* Awaiting Review */}
        <div className="p-3.5 rounded-2xl bg-[#07261B] border border-[#14533C] space-y-1">
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
            Awaiting Committee
          </span>
          <div className="text-xl font-mono font-extrabold text-white">
            {applications.filter((a) => a.status === "Under Review").length} Files
          </div>
          <span className="text-[10px] text-emerald-400 font-mono block">
            $147,000 Pipeline
          </span>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1D2A32] pb-2 overflow-x-auto scrollbar-none text-xs">
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "applications"
              ? "bg-[#0B3D2C] text-white shadow-xs border border-[#196349]"
              : "text-slate-400 hover:text-white hover:bg-[#162228]"
          }`}
        >
          <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Applications & Credit Committee ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("portfolio")}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "portfolio"
              ? "bg-[#0B3D2C] text-white shadow-xs border border-[#196349]"
              : "text-slate-400 hover:text-white hover:bg-[#162228]"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Loan Book Performance & PAR Aging</span>
        </button>

        <button
          onClick={() => setActiveTab("concentration")}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "concentration"
              ? "bg-[#0B3D2C] text-white shadow-xs border border-[#196349]"
              : "text-slate-400 hover:text-white hover:bg-[#162228]"
          }`}
        >
          <PieChart className="w-3.5 h-3.5 text-emerald-400" />
          <span>Borrower Concentration & Sector Exposure</span>
        </button>

        <button
          onClick={() => setActiveTab("covenants")}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "covenants"
              ? "bg-[#0B3D2C] text-white shadow-xs border border-[#196349]"
              : "text-slate-400 hover:text-white hover:bg-[#162228]"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
          <span>Automated Covenant Monitoring</span>
        </button>
      </div>

      {/* TAB 1: Applications Awaiting Review & Credit Committee */}
      {activeTab === "applications" && (
        <div className="space-y-4">
          {/* Institutional Loan Pipeline Funnel */}
          <div className="p-4 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#1D2A32]">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <h4 className="font-extrabold text-sm text-white">
                  Multi-Stage Agricultural Credit Pipeline & Underwriting Funnel
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Total Pipeline Velocity: <strong className="text-emerald-400">$68.8M</strong> across 1,778 files
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
              <div
                onClick={() => setFilterStatus("all")}
                className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] hover:border-emerald-500/50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold">
                  <span>1. Lead / Origination</span>
                  <span className="font-mono text-emerald-400 font-bold">84</span>
                </div>
                <div className="text-base font-mono font-extrabold text-white mt-1">$18.5M</div>
                <span className="text-[10px] text-slate-400 block mt-0.5">KYC & Agronomic Intake</span>
              </div>

              <div
                onClick={() => setFilterStatus("Under Review")}
                className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] hover:border-emerald-500/50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold">
                  <span>2. Satellite & NDVI</span>
                  <span className="font-mono text-cyan-400 font-bold">45</span>
                </div>
                <div className="text-base font-mono font-extrabold text-cyan-300 mt-1">$12.1M</div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Automated Risk Scoring</span>
              </div>

              <div
                onClick={() => setFilterStatus("Under Review")}
                className="p-3 bg-[#07261B] rounded-xl border border-[#14533C] hover:border-emerald-400 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-center text-[10px] text-emerald-300 uppercase font-bold">
                  <span>3. Committee Review</span>
                  <span className="font-mono text-emerald-300 font-bold">18</span>
                </div>
                <div className="text-base font-mono font-extrabold text-emerald-300 mt-1">$4.2M</div>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Deliberation & Terms</span>
              </div>

              <div
                onClick={() => setFilterStatus("Committee Approved")}
                className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] hover:border-emerald-500/50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold">
                  <span>4. Sanction & Offer</span>
                  <span className="font-mono text-purple-400 font-bold">9</span>
                </div>
                <div className="text-base font-mono font-extrabold text-purple-300 mt-1">$2.8M</div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Covenant Execution</span>
              </div>

              <div
                onClick={() => setFilterStatus("Disbursed")}
                className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] hover:border-emerald-500/50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold">
                  <span>5. Disbursed Book</span>
                  <span className="font-mono text-white font-bold">1,622</span>
                </div>
                <div className="text-base font-mono font-extrabold text-white mt-1">$31.2M</div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Active Surveillance</span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-3.5 bg-[#10171B] rounded-2xl border border-[#1D2A32] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </span>

              <select
                value={filterCommodity}
                onChange={(e) => setFilterCommodity(e.target.value)}
                className="bg-[#162228] text-white border border-[#1D2A32] px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="all">All Crops & Value Chains</option>
                <option value="maize">Maize / Grains</option>
                <option value="soy">Soybeans</option>
                <option value="cocoa">Cocoa</option>
                <option value="citrus">Citrus & Fruits</option>
                <option value="tea">Tea & Macadamia</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#162228] text-white border border-[#1D2A32] px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="all">All Review Statuses</option>
                <option value="Under Review">Under Review</option>
                <option value="Committee Approved">Committee Approved</option>
                <option value="Additional Info Required">Additional Info Required</option>
                <option value="Disbursed">Disbursed</option>
              </select>
            </div>

            <div className="text-slate-400 font-mono text-[11px]">
              Showing {filteredApps.length} of {applications.length} loan files
            </div>
          </div>

          {/* Applications Table / Cards */}
          <div className="bg-[#10171B] rounded-2xl border border-[#1D2A32] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#162228] text-slate-400 border-b border-[#1D2A32] font-semibold">
                    <th className="p-3.5">Loan Ref & Applicant</th>
                    <th className="p-3.5">Territory & Crop</th>
                    <th className="p-3.5">Facility / Amount</th>
                    <th className="p-3.5">NDVI & Trust Tier</th>
                    <th className="p-3.5">Collateral & DSCR</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Committee Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D2A32]">
                  {filteredApps.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-[#162228]/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedApplication(app)}
                    >
                      <td className="p-3.5">
                        <div className="font-mono text-emerald-400 font-bold">{app.id}</div>
                        <div className="font-extrabold text-white text-sm mt-0.5">{app.applicantName}</div>
                        <div className="text-[11px] text-slate-400">{app.farmName}</div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-white">{app.country}</div>
                        <div className="text-[11px] text-slate-400">{app.region}</div>
                        <div className="text-[11px] font-mono text-emerald-300 font-medium mt-0.5">
                          {app.commodity} ({app.hectares} Ha)
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-mono font-extrabold text-white text-sm">
                          ${app.requestedAmountUSD.toLocaleString()} USD
                        </div>
                        <div className="text-[11px] text-slate-400">{app.facilityType}</div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {app.tenureMonths}m @ {app.interestRateAnnual}% p.a.
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-white">NDVI {app.ndviScore}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded font-mono font-bold text-[10px] ${
                              app.agriTrustRating === "A+"
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                : "bg-cyan-950 text-cyan-300 border border-cyan-800"
                            }`}
                          >
                            Tier {app.agriTrustRating}
                          </span>
                        </div>
                        <div className="w-20 bg-[#0E161C] h-1.5 rounded-full overflow-hidden mt-1.5 border border-[#1D2A32]">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${app.ndviScore * 100}%` }}
                          />
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-slate-200">{app.collateralType}</div>
                        <div className="text-[11px] font-mono text-slate-400">
                          ${app.collateralValueUSD.toLocaleString()} USD ({Math.round((app.collateralValueUSD / app.requestedAmountUSD) * 100)}% cover)
                        </div>
                        <div className="text-[10px] font-mono text-emerald-400 font-bold mt-0.5">
                          DSCR: {app.dscr}x (Safe)
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${
                            app.status === "Committee Approved"
                              ? "bg-[#07261B] text-emerald-300 border-[#14533C]"
                              : app.status === "Under Review"
                              ? "bg-amber-950/60 text-amber-300 border-amber-800"
                              : app.status === "Disbursed"
                              ? "bg-blue-950 text-blue-300 border-blue-800"
                              : "bg-red-950/60 text-red-300 border-red-800"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                        {app.status === "Under Review" && (
                          <>
                            <button
                              onClick={() => handleDecision(app.id, "Committee Approved")}
                              className="px-2.5 py-1 rounded-lg bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-[11px] border border-[#196349] cursor-pointer transition-colors"
                              title="Approve loan facility"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDecision(app.id, "Additional Info Required")}
                              className="px-2.5 py-1 rounded-lg bg-[#162228] hover:bg-[#1D2A32] text-amber-300 font-bold text-[11px] border border-[#1D2A32] cursor-pointer transition-colors"
                              title="Request additional covenants or collateral"
                            >
                              Inquire
                            </button>
                          </>
                        )}
                        {app.status === "Committee Approved" && (
                          <button
                            onClick={() => handleDecision(app.id, "Disbursed")}
                            className="px-2.5 py-1 rounded-lg bg-[#07261B] hover:bg-[#0B3D2C] text-emerald-300 font-bold text-[11px] border border-[#14533C] cursor-pointer transition-colors"
                          >
                            Disburse Funds
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="px-2.5 py-1 rounded-lg bg-[#162228] hover:bg-[#1D2A32] text-slate-300 text-[11px] border border-[#1D2A32] cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Portfolio Health, Repayment & PAR Aging Schedule */}
      {activeTab === "portfolio" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Aging Schedule Table (7 cols) */}
            <div className="lg:col-span-7 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#1D2A32]">
                <div>
                  <h4 className="font-extrabold text-sm text-white">
                    Loan Portfolio Aging Schedule & Arrears Analysis
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    PAR tracking compliant with Central Bank prudential norms and AfDB covenants.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                  Zero Write-offs Q3
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Current / Performing */}
                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span>Current & Performing (&lt; 30 Days)</span>
                    </span>
                    <span className="font-mono text-white">$29.8M (95.5%)</span>
                  </div>
                  <div className="w-full bg-[#10171B] h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "95.5%" }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>1,548 Borrowers in clean standing</span>
                    <span>Loss Provision: 1.0% ($298K)</span>
                  </div>
                </div>

                {/* 31-60 Days Watchlist */}
                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      <span>Special Mention / Watchlist (31 - 60 Days)</span>
                    </span>
                    <span className="font-mono text-cyan-300">$840K (2.7%)</span>
                  </div>
                  <div className="w-full bg-[#10171B] h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: "2.7%" }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>42 Borrowers delayed by port container congestion</span>
                    <span>Loss Provision: 5.0% ($42K)</span>
                  </div>
                </div>

                {/* 61-90 Days Substandard */}
                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span>Substandard / Early Arrears (61 - 90 Days)</span>
                    </span>
                    <span className="font-mono text-amber-300">$380K (1.2%)</span>
                  </div>
                  <div className="w-full bg-[#10171B] h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: "1.2%" }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>19 Borrowers undergoing satellite yield verification</span>
                    <span>Loss Provision: 20.0% ($76K)</span>
                  </div>
                </div>

                {/* 90+ Days PAR */}
                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <span>Non-Performing / PAR 90+ (&gt; 90 Days)</span>
                    </span>
                    <span className="font-mono text-red-300">$180K (0.6%)</span>
                  </div>
                  <div className="w-full bg-[#10171B] h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: "0.6%" }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>13 Facilities undergoing e-WRS grain liquidation or parametric claim payout</span>
                    <span>Loss Provision: 50.0% ($90K)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Repayment Velocity & Restructuring Workout Queue (5 cols) */}
            <div className="lg:col-span-5 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#1D2A32]">
                <h4 className="font-extrabold text-sm text-white">
                  Active Restructuring & Recovery Queue
                </h4>
                <span className="text-xs font-mono text-emerald-400">5 Cases</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">Limpopo Citrus Outgrowers</span>
                    <span className="font-mono font-bold text-amber-400">$48,000</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Late winter frost damage. Restructured 90-day grace period; parametric insurance payout of $31,500 applied directly to interest.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-400">Lien intact • Status: Workout Active</div>
                </div>

                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">Rift Valley Cereals Co-op</span>
                    <span className="font-mono font-bold text-amber-400">$34,000</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Harvest delayed by 18 days due to late rains. Forward off-take contract delivery date extended with buyer agreement.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-400">Silo receipt re-inspected • Status: Cured on delivery</div>
                </div>

                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">Volta Basin Rice Farmers</span>
                    <span className="font-mono font-bold text-cyan-300">$26,500</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Paddy milling line upgraded; repayment linked to monthly retail distributor settlement.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-400">DSCR 1.40x • Status: Normalizing</div>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Lender Distribution & Portfolio Performance */}
          <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#1D2A32] gap-2">
              <div>
                <h4 className="font-extrabold text-sm text-white">
                  Institutional Capital Deployment & Loan Book Distribution
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Capital allocation, outstanding books, repayment rates, and portfolio-at-risk segmented by lender archetype.
                </p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-[#07261B] px-2.5 py-1 rounded-lg border border-[#14533C]">
                4 Active Lender Classes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Commercial Ag Banks</span>
                  <span className="text-[10px] font-mono text-emerald-300 bg-[#07261B] px-1.5 py-0.5 rounded border border-[#14533C]">Tier 1</span>
                </div>
                <div className="text-lg font-mono font-extrabold text-white">$19.4M Disbursed</div>
                <div className="space-y-1 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Active Loan Book:</span>
                    <span className="font-mono text-slate-200 font-bold">$14.1M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Repayment Rate:</span>
                    <span className="font-mono text-emerald-400 font-bold">98.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PAR 30:</span>
                    <span className="font-mono text-emerald-300">1.8%</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Microfinance & SACCOs</span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">MFIs</span>
                </div>
                <div className="text-lg font-mono font-extrabold text-white">$8.6M Disbursed</div>
                <div className="space-y-1 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Active Loan Book:</span>
                    <span className="font-mono text-slate-200 font-bold">$6.2M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Repayment Rate:</span>
                    <span className="font-mono text-emerald-400 font-bold">96.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PAR 30:</span>
                    <span className="font-mono text-amber-300">3.4%</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Development Finance (DFIs)</span>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-1.5 py-0.5 rounded border border-purple-800">AfDB / IFC</span>
                </div>
                <div className="text-lg font-mono font-extrabold text-white">$11.8M Disbursed</div>
                <div className="space-y-1 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Active Loan Book:</span>
                    <span className="font-mono text-slate-200 font-bold">$8.9M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Repayment Rate:</span>
                    <span className="font-mono text-emerald-400 font-bold">99.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PAR 30:</span>
                    <span className="font-mono text-emerald-400">0.9%</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Ag Lenders & Climate Funds</span>
                  <span className="text-[10px] font-mono text-emerald-300 bg-[#07261B] px-1.5 py-0.5 rounded border border-[#14533C]">Blended</span>
                </div>
                <div className="text-lg font-mono font-extrabold text-white">$3.0M Disbursed</div>
                <div className="space-y-1 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Active Loan Book:</span>
                    <span className="font-mono text-slate-200 font-bold">$2.0M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Repayment Rate:</span>
                    <span className="font-mono text-emerald-400 font-bold">97.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PAR 30:</span>
                    <span className="font-mono text-emerald-300">2.1%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Borrower Concentration & Sector Exposure (By Crop, Region, Season & RAROC) */}
      {activeTab === "concentration" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 1. By Value Chain / Crop */}
            <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D2A32]">
                <h4 className="font-extrabold text-sm text-white">Concentration by Crop</h4>
                <span className="font-mono text-[10px] text-slate-400">Cap 40%</span>
              </div>
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Yellow & White Maize</span>
                    <span className="font-mono font-bold text-white">36% ($11.2M)</span>
                  </div>
                  <div className="w-full bg-[#162228] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "36%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Soybeans & Oilseeds</span>
                    <span className="font-mono font-bold text-white">24% ($7.5M)</span>
                  </div>
                  <div className="w-full bg-[#162228] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: "24%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Cocoa & Coffee Tree Crops</span>
                    <span className="font-mono font-bold text-white">18% ($5.6M)</span>
                  </div>
                  <div className="w-full bg-[#162228] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: "18%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Wheat & Sorghum</span>
                    <span className="font-mono font-bold text-white">12% ($3.7M)</span>
                  </div>
                  <div className="w-full bg-[#162228] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: "12%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Horticulture & Macadamia</span>
                    <span className="font-mono font-bold text-white">10% ($3.2M)</span>
                  </div>
                  <div className="w-full bg-[#162228] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: "10%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. By Regional Economic Community */}
            <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D2A32]">
                <h4 className="font-extrabold text-sm text-white">Regional Exposure</h4>
                <span className="font-mono text-[10px] text-slate-400">Pan-African</span>
              </div>
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>SADC (Southern Africa)</span>
                    <span className="font-mono font-bold text-white">42% ($13.1M)</span>
                  </div>
                  <div className="w-full bg-[#162228] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "42%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>EAC (East African Community)</span>
                    <span className="font-mono font-bold text-white">35% ($10.9M)</span>
                  </div>
                  <div className="w-full bg-[#162228] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: "35%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>ECOWAS (West Africa)</span>
                    <span className="font-mono font-bold text-white">23% ($7.2M)</span>
                  </div>
                  <div className="w-full bg-[#162228] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: "23%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. By Production Season */}
            <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D2A32]">
                <h4 className="font-extrabold text-sm text-white">Seasonal Exposure</h4>
                <span className="font-mono text-[10px] text-emerald-400">Staggered Cycles</span>
              </div>
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Main Wet Crop (Summer / Meher)</span>
                    <span className="font-mono font-bold text-white">52% ($16.2M)</span>
                  </div>
                  <div className="w-full bg-[#162228] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "52%" }} />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Harvest: April – July</span>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Short Rains / Bimodal (Belg)</span>
                    <span className="font-mono font-bold text-white">28% ($8.7M)</span>
                  </div>
                  <div className="w-full bg-[#162228] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: "28%" }} />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Harvest: Oct – Dec</span>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Irrigated Dry Season / Winter</span>
                    <span className="font-mono font-bold text-white">20% ($6.3M)</span>
                  </div>
                  <div className="w-full bg-[#162228] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: "20%" }} />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">High-Value Horticulture / Nile</span>
                </div>
              </div>
            </div>

            {/* 4. Risk-Adjusted Return (RAROC) by Sector */}
            <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1D2A32]">
                <h4 className="font-extrabold text-sm text-white">Risk-Adjusted Yield (RAROC)</h4>
                <span className="font-mono text-[10px] text-emerald-400">Benchmark &gt; 12%</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-[#162228] rounded-xl flex justify-between items-center">
                  <span className="text-white">Export Horticulture (Avocado/Citrus)</span>
                  <span className="font-mono font-bold text-emerald-300">16.8%</span>
                </div>
                <div className="p-2.5 bg-[#162228] rounded-xl flex justify-between items-center">
                  <span className="text-white">Tree Crops (Cocoa & Specialty Coffee)</span>
                  <span className="font-mono font-bold text-emerald-300">15.1%</span>
                </div>
                <div className="p-2.5 bg-[#162228] rounded-xl flex justify-between items-center">
                  <span className="text-white">Commercial Grain & Silo e-WRS</span>
                  <span className="font-mono font-bold text-emerald-300">14.2%</span>
                </div>
                <div className="p-2.5 bg-[#162228] rounded-xl flex justify-between items-center">
                  <span className="text-white">Dryland Smallholder Aggregations</span>
                  <span className="font-mono font-bold text-cyan-300">12.6%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Automated Covenant Monitoring */}
      {activeTab === "covenants" && (
        <div className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1D2A32]">
            <div>
              <h4 className="font-extrabold text-sm text-white">
                Live Telementry-Based Financial & Operational Covenants
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated continuous covenant surveillance using satellite NDVI, e-WRS silo telematics, and PAPSS escrow settlement.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-[#07261B] px-2.5 py-1 rounded-lg border border-[#14533C]">
              98.2% Portfolio Compliance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {applications.map((app) => (
              <div key={app.id} className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-white text-sm">{app.applicantName}</span>
                    <span className="text-slate-400 block text-[11px] font-mono">
                      {app.farmName} ({app.id})
                    </span>
                  </div>
                  <span className="font-mono font-extrabold text-white text-xs bg-[#10171B] px-2 py-1 rounded border border-[#1D2A32]">
                    ${app.requestedAmountUSD.toLocaleString()} USD
                  </span>
                </div>

                <div className="space-y-1.5">
                  {app.covenants.map((cov, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-[#10171B] flex items-center justify-between border border-[#1D2A32]"
                    >
                      <div className="flex items-center gap-2">
                        {cov.compliant ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                        <span className="text-slate-300 font-medium">{cov.name}</span>
                      </div>
                      <div className="text-right font-mono text-[11px]">
                        <span className="text-slate-400 mr-2">Target: {cov.target}</span>
                        <span className={cov.compliant ? "text-emerald-300 font-bold" : "text-amber-300 font-bold"}>
                          {cov.actual}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Application Review & Underwriting Drawer / Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 bg-[#0B1013]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#10171B] rounded-3xl max-w-2xl w-full border border-[#1D2A32] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-[#07261B] text-white flex items-center justify-between border-b border-[#14533C]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0B3D2C] border border-[#196349] flex items-center justify-center font-mono font-bold text-emerald-300 text-xs">
                  {selectedApplication.agriTrustRating}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    Credit Committee Dossier: {selectedApplication.applicantName}
                  </h3>
                  <div className="text-xs text-slate-300 font-mono">
                    Facility Ref: {selectedApplication.id} • {selectedApplication.farmName}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-1.5 rounded-lg hover:bg-[#0B3D2C] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Requested</span>
                  <span className="font-mono text-base font-extrabold text-white mt-0.5 block">
                    ${selectedApplication.requestedAmountUSD.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Tenure / Rate</span>
                  <span className="font-mono text-sm font-bold text-emerald-300 mt-0.5 block">
                    {selectedApplication.tenureMonths}m @ {selectedApplication.interestRateAnnual}%
                  </span>
                </div>
                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">NDVI Rating</span>
                  <span className="font-mono text-sm font-bold text-white mt-0.5 block">
                    {selectedApplication.ndviScore} (Optimal)
                  </span>
                </div>
                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">DSCR Ratio</span>
                  <span className="font-mono text-sm font-bold text-emerald-400 mt-0.5 block">
                    {selectedApplication.dscr}x (Safe)
                  </span>
                </div>
              </div>

              {/* Collateral & Risk Highlights */}
              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Collateral Security & Liens</span>
                  <span className="font-mono font-bold text-emerald-300">
                    ${selectedApplication.collateralValueUSD.toLocaleString()} USD ({selectedApplication.collateralType})
                  </span>
                </div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  {selectedApplication.riskHighlights.map((r, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Covenant Compliance Checklist */}
              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2.5">
                <span className="font-bold text-white block">Covenant Surveillance Mandates</span>
                <div className="space-y-1.5">
                  {selectedApplication.covenants.map((c, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-[#10171B] flex items-center justify-between border border-[#1D2A32]"
                    >
                      <div className="flex items-center gap-2">
                        {c.compliant ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        )}
                        <span className="text-white font-medium">{c.name}</span>
                      </div>
                      <div className="text-right font-mono text-[11px]">
                        <span className="text-slate-400 mr-2">Req: {c.target}</span>
                        <span className={c.compliant ? "text-emerald-300 font-bold" : "text-amber-300 font-bold"}>
                          {c.actual}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Decision Buttons */}
            <div className="px-5 py-4 bg-[#10171B] border-t border-[#1D2A32] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-mono">
                Status: <strong className="text-white">{selectedApplication.status}</strong>
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleDecision(selectedApplication.id, "Rejected")}
                  className="px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 font-bold text-xs border border-red-800 transition-colors cursor-pointer"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleDecision(selectedApplication.id, "Additional Info Required")}
                  className="px-3.5 py-2 rounded-xl bg-[#162228] hover:bg-[#1D2A32] text-amber-300 font-bold text-xs border border-[#1D2A32] transition-colors cursor-pointer"
                >
                  Request Collateral / Info
                </button>
                <button
                  onClick={() => handleDecision(selectedApplication.id, "Committee Approved")}
                  className="px-4 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Committee Approval</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
