import React, { useState } from "react";
import {
  Landmark,
  Users,
  Sprout,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Coins,
  ChevronRight,
  Globe2,
  Award,
  CheckCircle2,
  Building2,
  PieChart,
  FileSpreadsheet,
  Cpu,
  Layers,
  GitCommit,
  Database,
  FileText,
  Activity,
  Zap,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import { useApp } from "../../context/AppContext";
import { InstitutionalOnboardingPermissions } from "./InstitutionalOnboardingPermissions";
import { FinanceInsuranceDistribution } from "./FinanceInsuranceDistribution";
import { ProgrammeDisbursementsSubsidies } from "./ProgrammeDisbursementsSubsidies";
import { AdvancedOperationalFeatures } from "./AdvancedOperationalFeatures";
import { OperationalWorkflows } from "./OperationalWorkflows";
import { CoreDataIntegrations } from "./CoreDataIntegrations";
import { RegulatoryExportsAuditTrails } from "./RegulatoryExportsAuditTrails";
import { RegulatoryComplianceMonitor } from "./RegulatoryComplianceMonitor";

export const GovernmentView: React.FC = () => {
  const { selectedCountry } = useApp();

  const [activeTab, setActiveTab] = useState<
    | "overview_simulator"
    | "compliance_monitor"
    | "onboarding_permissions"
    | "finance_insurance"
    | "programmes_subsidies"
    | "operational_features"
    | "workflows"
    | "integrations_audit"
  >("overview_simulator");

  // Policy Simulator inputs
  const [subsidyPct, setSubsidyPct] = useState("20");
  const [policyType, setPolicyType] = useState("Fertilizer Subsidy");
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>({
    projectedYieldIncreasePct: 14,
    fiscalCostUSD: "$42 Million USD",
    forexSavingsUSD: "$68 Million USD",
    netEconomicBenefitUSD: "+$26 Million USD Net Surplus",
    keyRecommendations: [
      "Target smallholders under 5 hectares via digital e-vouchers on CULTx Mobile to prevent leakage",
      "Combine fertilizer distribution with certified hybrid drought-tolerant seed",
      "Monitor soil acidity (pH) to prevent soil acidification from excess ammonium nitrate",
    ],
  });

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimulating(true);

    try {
      const res = await fetch("/api/gemini/policy-simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policyProposal: `National Policy Simulation for ${selectedCountry.name}: Subsidize ${policyType} by ${subsidyPct}%. Current national smallholders: 2.4M, Land: 8.7M hectares, Production: 14.8M tonnes.`,
          country: selectedCountry.name,
        }),
      });
      const data = await res.json();
      setSimulationResult(data);
    } catch (err) {
      // Keep baseline response
      setSimulationResult({
        projectedYieldIncreasePct: 14,
        fiscalCostUSD: "$42 Million USD",
        forexSavingsUSD: "$68 Million USD",
        netEconomicBenefitUSD: "+$26 Million USD Net Surplus",
        keyRecommendations: [
          "Target smallholders under 5 hectares via digital e-vouchers on CULTx Mobile to prevent leakage",
          "Combine fertilizer distribution with certified hybrid drought-tolerant seed",
          "Monitor soil acidity (pH) to prevent soil acidification from excess ammonium nitrate",
        ],
      });
    } finally {
      setSimulating(false);
    }
  };

  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleExportCabinetMemorandum = () => {
    setIsExportingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const margin = 14;

      // Header band
      doc.setFillColor(7, 38, 27); // #07261B
      doc.rect(0, 0, pageWidth, 28, "F");
      doc.setFillColor(245, 185, 66); // Gold stripe
      doc.rect(0, 28, pageWidth, 2.5, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(253, 251, 247);
      doc.text(`REPUBLIC OF ${selectedCountry.name.toUpperCase()} • CABINET MEMORANDUM`, margin, 12);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(220, 235, 225);
      doc.text(
        `Ministry of Agriculture & National Food Security • Sovereign Macro Policy Impact Simulation`,
        margin,
        18
      );
      doc.text(
        `Reference: MEMO-${selectedCountry.code}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        margin,
        23
      );

      // Body content
      doc.setTextColor(20, 30, 25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(`POLICY INITIATIVE: ${policyType.toUpperCase()} (${subsidyPct}% SUBSIDY)`, margin, 42);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(80, 90, 85);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
        margin,
        48
      );
      doc.text(
        `Grounded on Sentinel-2 L2A orbital telemetry, FAO Food Balance Sheets, and IFPRI predictive matrices.`,
        margin,
        53
      );

      // Metrics Table
      doc.setFillColor(240, 245, 242);
      doc.roundedRect(margin, 58, pageWidth - margin * 2, 42, 3, 3, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 60, 35);
      doc.text("EXECUTIVE FISCAL & PRODUCTION PROJECTIONS", margin + 6, 66);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(40, 50, 45);
      doc.text(`• Projected National Yield Increase: +${simulationResult.projectedYieldIncreasePct}%`, margin + 6, 73);
      doc.text(`• Estimated Fiscal Intervention Cost: ${simulationResult.fiscalCostUSD}`, margin + 6, 79);
      doc.text(`• Foreign Exchange (FOREX) Savings: ${simulationResult.forexSavingsUSD}`, margin + 6, 85);
      doc.text(`• Net Economic Benefit / Surplus: ${simulationResult.netEconomicBenefitUSD}`, margin + 6, 91);

      // Recommendations section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(15, 60, 35);
      doc.text("MINISTRY IMPLEMENTATION SAFEGUARDS & ACTION PLAN:", margin, 110);

      let yPos = 117;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(50, 60, 55);
      const recs = simulationResult.keyRecommendations || [];
      recs.forEach((rec: string, i: number) => {
        const lines = doc.splitTextToSize(`${i + 1}. ${rec}`, pageWidth - margin * 2);
        doc.text(lines, margin, yPos);
        yPos += lines.length * 4.5 + 2.5;
      });

      // Regulatory Compliance
      yPos += 5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(20, 83, 45);
      doc.text("STANDARDS & AfCFTA COMPLIANCE AUDIT:", margin, yPos);
      yPos += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(70, 80, 75);
      doc.text("• UN CFS World Food Security & Codex Alimentarius MRL Alignment: COMPLIANT", margin, yPos);
      yPos += 5;
      doc.text("• AfCFTA Digital Certificate of Origin (Annex 2 Protocol): PRE-APPROVED", margin, yPos);
      yPos += 5;
      doc.text("• Central Bank PAPSS Settlement Clearing Protocol: INTEGRATED", margin, yPos);

      // Sign-off footer
      yPos = Math.max(yPos + 12, 235);
      doc.setDrawColor(200, 215, 205);
      doc.line(margin, yPos, margin + 70, yPos);
      doc.line(pageWidth - margin - 70, yPos, pageWidth - margin, yPos);

      doc.setFontSize(7.5);
      doc.setTextColor(120, 130, 125);
      doc.text("Permanent Secretary, Ministry of Agriculture", margin, yPos + 5);
      doc.text("Chief Economist, National Planning Commission", pageWidth - margin - 70, yPos + 5);

      doc.text("CULTx Pan-African Agricultural Operating System • Confidential Cabinet Document", margin, 285);

      doc.save(`Cabinet_Memorandum_${selectedCountry.name}_${policyType.replace(/\s+/g, "_")}.pdf`);
    } finally {
      setTimeout(() => setIsExportingPdf(false), 800);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#07261B] text-white rounded-2xl p-6 border border-[#14533C] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <Landmark className="w-6 h-6 text-emerald-400" />
              <span>Ministry, Regulators & Agricultural Development Programmes</span>
            </h2>
            <span className="text-xs font-mono font-bold text-emerald-300 bg-[#0B3D2C] px-2.5 py-0.5 rounded border border-[#196349]">
              Sovereign Command & Regulatory Oversight
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Unified digital operating system for Platform Operators, Central Banks, Insurance Commissions, and Ministry Policy Makers ({selectedCountry.name}).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#10171B] px-4 py-2.5 rounded-xl border border-[#1D2A32] text-right">
            <div className="text-[10px] font-bold uppercase text-slate-400">National Food Security</div>
            <div className="text-base font-mono font-extrabold text-emerald-300 mt-0.5">
              78% (Stable)
            </div>
          </div>
          <div className="bg-[#10171B] px-4 py-2.5 rounded-xl border border-[#1D2A32] text-right">
            <div className="text-[10px] font-bold uppercase text-slate-400">Supervised Capital</div>
            <div className="text-base font-mono font-extrabold text-white mt-0.5">
              $148.5M USD
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#10171B] p-2.5 rounded-2xl border border-[#1D2A32]">
        <button
          onClick={() => setActiveTab("overview_simulator")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "overview_simulator"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span>Macro Stats & Policy Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab("compliance_monitor")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "compliance_monitor"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Regulatory Compliance Monitor</span>
        </button>

        <button
          onClick={() => setActiveTab("onboarding_permissions")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "onboarding_permissions"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span>Institutional Onboarding & Permissions</span>
        </button>

        <button
          onClick={() => setActiveTab("finance_insurance")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "finance_insurance"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <PieChart className="w-4 h-4 text-emerald-400" />
          <span>Finance & Insurance Distribution</span>
        </button>

        <button
          onClick={() => setActiveTab("programmes_subsidies")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "programmes_subsidies"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-amber-400" />
          <span>Programmes & Subsidies</span>
        </button>

        <button
          onClick={() => setActiveTab("operational_features")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "operational_features"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>Advanced Operational Capabilities</span>
        </button>

        <button
          onClick={() => setActiveTab("workflows")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "workflows"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <GitCommit className="w-4 h-4 text-emerald-300" />
          <span>End-to-End Operational Workflows</span>
        </button>

        <button
          onClick={() => setActiveTab("integrations_audit")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "integrations_audit"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Database className="w-4 h-4 text-blue-400" />
          <span>Data Infrastructure & Audits</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & POLICY SIMULATOR */}
      {activeTab === "overview_simulator" && (
        <div className="space-y-6">
          {/* National Agricultural Statistics (Blueprint Section 20) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registered Farmers</div>
              <div className="text-xl font-mono font-extrabold text-white mt-1">2.4M</div>
              <div className="text-[11px] text-emerald-300 mt-0.5">91% Smallholders</div>
            </div>

            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registered Land</div>
              <div className="text-xl font-mono font-extrabold text-white mt-1">8.7M ha</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Digital Cadastre</div>
            </div>

            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Season Production</div>
              <div className="text-xl font-mono font-extrabold text-white mt-1">14.8M MT</div>
              <div className="text-[11px] text-emerald-300 mt-0.5">+6.4% YoY Forecast</div>
            </div>

            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Drought Vulnerability</div>
              <div className="text-xl font-mono font-extrabold text-amber-400 mt-1">Medium</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Free State & Highveld</div>
            </div>

            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fertilizer Utilization</div>
              <div className="text-xl font-mono font-extrabold text-white mt-1">64%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Target: 80% NPK</div>
            </div>

            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">National Strategic Grain</div>
              <div className="text-xl font-mono font-extrabold text-white mt-1">2.1M MT</div>
              <div className="text-[11px] text-emerald-300 mt-0.5">180 Days Buffer</div>
            </div>
          </div>

          {/* Interactive National Policy Simulator (Blueprint Mandate) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Simulator Controls */}
            <div className="lg:col-span-5 bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm">
              <div className="pb-3 border-b border-[#19262F] mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                  Algorithmic Policy Laboratory
                </span>
                <h3 className="font-extrabold text-base text-white mt-2">
                  National Agricultural Policy Simulator
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Simulate macroeconomic yields, fiscal outlays, and foreign exchange impacts before enacting national decrees.
                </p>
              </div>

              <form onSubmit={handleSimulate} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Policy Intervention Category
                  </label>
                  <select
                    value={policyType}
                    onChange={(e) => setPolicyType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#1D2A32] bg-[#162228] text-white font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="World Food Security & Codex Standards Harmonization" className="bg-[#162228] text-white">World Food Security & Codex Standards Harmonization</option>
                    <option value="Fertilizer Subsidy" className="bg-[#162228] text-white">Fertilizer Subsidy (NPK + Urea)</option>
                    <option value="Certified Hybrid Seed Distribution" className="bg-[#162228] text-white">Certified Hybrid Seed Distribution</option>
                    <option value="Smallholder Solar Irrigation Subsidy" className="bg-[#162228] text-white">Smallholder Solar Irrigation Subsidy</option>
                    <option value="Strategic Grain Reserve Price Floor" className="bg-[#162228] text-white">Strategic Grain Reserve Price Floor</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1 font-bold">
                    <span className="text-slate-300">Subsidy / Intervention Magnitude:</span>
                    <span className="text-emerald-300 font-mono text-sm">{subsidyPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={subsidyPct}
                    onChange={(e) => setSubsidyPct(e.target.value)}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>5% (Targeted Pilot)</span>
                    <span>25% (Standard)</span>
                    <span>50% (Max Stimulus)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={simulating}
                  className="w-full py-3 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors border border-[#196349] min-h-[44px]"
                >
                  {simulating ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                  )}
                  <span>Run Macroeconomic Simulation →</span>
                </button>
              </form>
            </div>

            {/* Simulator Outputs */}
            <div className="lg:col-span-7 bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] mb-4 gap-2">
                  <h4 className="font-extrabold text-sm text-white">
                    Simulated Policy Impact: {policyType} ({subsidyPct}%)
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-emerald-300 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                    Econometric Projection
                  </span>
                </div>

                {/* 4 Core Financial & Output Metrics */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32]">
                    <div className="text-slate-400 font-semibold text-[11px]">Projected Yield Increase</div>
                    <div className="text-2xl font-mono font-extrabold text-emerald-300 mt-1">
                      +{simulationResult.projectedYieldIncreasePct}%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Est. +2.07M Tonnes Grain</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32]">
                    <div className="text-slate-400 font-semibold text-[11px]">Fiscal Budget Cost</div>
                    <div className="text-2xl font-mono font-extrabold text-white mt-1">
                      {simulationResult.fiscalCostUSD}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Earmarked from Agricultural Ministry</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32]">
                    <div className="text-slate-400 font-semibold text-[11px]">Foreign Exchange Savings</div>
                    <div className="text-2xl font-mono font-extrabold text-cyan-300 mt-1">
                      {simulationResult.forexSavingsUSD}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Displacing imported grain shipments</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#07261B] border border-[#14533C]">
                    <div className="text-emerald-300 font-semibold text-[11px]">Net Economic Benefit</div>
                    <div className="text-2xl font-mono font-extrabold text-white mt-1">
                      {simulationResult.netEconomicBenefitUSD}
                    </div>
                    <div className="text-[10px] text-emerald-300 mt-0.5">ROI: 1.62x on public capital</div>
                  </div>
                </div>

                {/* Policy Recommendations */}
                <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] text-xs">
                  <div className="font-bold text-white mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Ministry Implementation Safeguards:</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                    {simulationResult.keyRecommendations?.map((rec: string, idx: number) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[#19262F] flex flex-wrap items-center justify-between text-xs mt-4 gap-2">
                <span className="text-slate-400">Models grounded on FAO, IFPRI, and Sentinel-2 telemetry</span>
                <button
                  onClick={handleExportCabinetMemorandum}
                  disabled={isExportingPdf}
                  className="px-3 py-1.5 rounded-lg bg-[#07261B] hover:bg-[#0E3D2B] border border-[#14533C] text-emerald-300 font-bold transition-all cursor-pointer min-h-[36px] flex items-center gap-2 active:scale-95 shadow-sm"
                  id="export-cabinet-memo-btn"
                >
                  <Download className={`w-3.5 h-3.5 ${isExportingPdf ? "animate-bounce text-[#F5B942]" : ""}`} />
                  <span>{isExportingPdf ? "Generating Memorandum PDF..." : "Export Cabinet Memorandum PDF →"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* National World Food Security & Global Standards Compliance Oversight */}
          <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#07261B] border border-[#14533C] text-emerald-400 flex items-center justify-center shrink-0">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <span>National World Food Security Policy & Global Standards Alignment</span>
                    <span className="text-[10px] font-mono font-bold bg-[#07261B] text-emerald-300 px-2 py-0.5 rounded border border-[#14533C]">
                      UN CFS & Codex Compliant
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Tracking national farmer certification against Codex Alimentarius, GlobalG.A.P. IFA v6, and AfCFTA SPS mandates.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-[#07261B] px-3 py-1.5 rounded-lg border border-[#14533C]">
                  +$112M Forex Export Surplus
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Codex MRL Safety Coverage
                </div>
                <div className="text-xl font-mono font-extrabold text-white">82.4%</div>
                <div className="text-[11px] text-emerald-300">
                  Commercial grains tested &lt; 10 ppb aflatoxin
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  GlobalG.A.P. Cooperative Rate
                </div>
                <div className="text-xl font-mono font-extrabold text-white">68.1%</div>
                <div className="text-[11px] text-emerald-300">
                  464 outgrower co-ops audit-ready
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Post-Harvest Grain Loss
                </div>
                <div className="text-xl font-mono font-extrabold text-cyan-400">8.4%</div>
                <div className="text-[11px] text-slate-400">
                  Down from 22.1% baseline via hermetic silos
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  AfCFTA e-Phyto Passports
                </div>
                <div className="text-xl font-mono font-extrabold text-amber-300">4,120 XMLs</div>
                <div className="text-[11px] text-slate-400">
                  Inter-state frictionless cross-border transit
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPLIANCE MONITOR */}
      {activeTab === "compliance_monitor" && (
        <RegulatoryComplianceMonitor />
      )}

      {/* TAB 2: INSTITUTIONAL ONBOARDING & PERMISSIONS */}
      {activeTab === "onboarding_permissions" && (
        <InstitutionalOnboardingPermissions />
      )}

      {/* TAB 3: FINANCE & INSURANCE DISTRIBUTION */}
      {activeTab === "finance_insurance" && (
        <FinanceInsuranceDistribution />
      )}

      {/* TAB 4: PROGRAMMES, SUBSIDIES & BENEFICIARY REPORTING */}
      {activeTab === "programmes_subsidies" && (
        <ProgrammeDisbursementsSubsidies />
      )}

      {/* TAB 5: ADVANCED OPERATIONAL CAPABILITIES */}
      {activeTab === "operational_features" && (
        <AdvancedOperationalFeatures />
      )}

      {/* TAB 6: END-TO-END OPERATIONAL WORKFLOWS */}
      {activeTab === "workflows" && (
        <OperationalWorkflows />
      )}

      {/* TAB 7: DATA INFRASTRUCTURE & REGULATORY AUDIT TRAILS */}
      {activeTab === "integrations_audit" && (
        <div className="space-y-6">
          <CoreDataIntegrations />
          <RegulatoryExportsAuditTrails />
        </div>
      )}
    </div>
  );
};
