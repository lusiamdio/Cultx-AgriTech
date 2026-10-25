import React, { useState } from "react";
import {
  GitCommit,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  User,
  Building,
  FileText,
  DollarSign,
  CloudRain,
  Activity,
  Layers,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Send,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const OperationalWorkflows: React.FC = () => {
  const { selectedCountry } = useApp();
  const [activeWorkflow, setActiveWorkflow] = useState<"financing" | "insurance" | "bundled_integration">("bundled_integration");
  const [selectedFinancingStep, setSelectedFinancingStep] = useState(3);
  const [selectedInsuranceStep, setSelectedInsuranceStep] = useState(4);
  const [bundledSimulationStage, setBundledSimulationStage] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // 7-Stage Financing Workflow definitions
  const financingSteps = [
    {
      step: 1,
      title: "Farmer Registration & Identity Verification",
      responsibleParty: "Farmer & National Registry (NIN / BRS)",
      nextAction: "Biometric e-KYC & Farm Boundary Polygon Audit",
      auditRecord: "Identity verified via National ID Service; Land cadastre cleared.",
      sla: "Within 2 hours",
      status: "Completed",
    },
    {
      step: 2,
      title: "Crop Plans, Budgets, Historical Yields & Contracts",
      responsibleParty: "Farmer & Offtake Buyer",
      nextAction: "Upload verified forward contract and input cost breakdown",
      auditRecord: "Tiger Brands Maize Offtake Agreement #TB-881 attached; 5-yr yield 7.8t/ha logged.",
      sla: "Within 24 hours",
      status: "Completed",
    },
    {
      step: 3,
      title: "AI Credit Engine Affordability & Risk Evaluation",
      responsibleParty: "System AI Engine (AgriCredit-v3.1)",
      nextAction: "Generate DSCR projection, loan limit and SHAP explainability report",
      auditRecord: "Affordability Score: 88/100; Recommended limit: $125,000; Expected DSCR: 1.48x.",
      sla: "Automated (Instant)",
      status: "In Progress",
    },
    {
      step: 4,
      title: "Credit Officer & Committee Review",
      responsibleParty: "Authorized Credit Officer (Commercial Bank)",
      nextAction: "Review recommendation, sanction facility, or request additional collateral",
      auditRecord: "Pending Credit Committee signoff; covenants set at DSCR > 1.25x.",
      sla: "48 hours",
      status: "Pending Action",
    },
    {
      step: 5,
      title: "Digital Loan Agreement Execution & Disbursal",
      responsibleParty: "Lender & Agro-Dealer Clearinghouse",
      nextAction: "Execute e-Signature and disburse 60% direct to input supplier, 40% working capital",
      auditRecord: "Awaiting execution of digital tripartite agreement.",
      sla: "24 hours post-approval",
      status: "Upcoming",
    },
    {
      step: 6,
      title: "Farm Progress, Expenditure & Crop Telemetry Monitoring",
      responsibleParty: "Satellite IoT Surveillance & Agronomist",
      nextAction: "Continuous Sentinel-2 NDVI vegetative health and soil moisture checks",
      auditRecord: "Weekly automated NDVI health reports scheduled.",
      sla: "Continuous throughout season",
      status: "Upcoming",
    },
    {
      step: 7,
      title: "Repayment Reconciliation, Escalation or Renewal",
      responsibleParty: "Lender & Core Banking API",
      nextAction: "Reconcile grain harvest proceeds from buyer account; close or renew facility",
      auditRecord: "Auto-sweep configured with buyer escrow account.",
      sla: "At harvest settlement",
      status: "Upcoming",
    },
  ];

  // 7-Stage Insurance Workflow definitions
  const insuranceSteps = [
    {
      step: 1,
      title: "Farmer, Crop & Insured Area Verification",
      responsibleParty: "Farmer & GIS Engine",
      nextAction: "Confirm 50-hectare parcel GPS boundary and crop variety",
      auditRecord: "Parcel polygon cleared with zero overlap; hybrid yellow maize confirmed.",
      sla: "Instant",
      status: "Completed",
    },
    {
      step: 2,
      title: "Risk Evaluation & Automated Quotation",
      responsibleParty: "Insurer Underwriter & Actuarial Engine",
      nextAction: "Evaluate 20-year weather risks and generate parametric pricing",
      auditRecord: "Quote #Q-SANTAM-9912 generated: 4.8% premium rate; sum insured $140,000.",
      sla: "Instant",
      status: "Completed",
    },
    {
      step: 3,
      title: "Policy Terms, Exclusions & Premium Acceptance",
      responsibleParty: "Farmer & Lender (if bundled)",
      nextAction: "Digital acceptance of parametric triggers (<35mm rainfall in 30 days)",
      auditRecord: "Farmer consented to terms via SMS OTP signature.",
      sla: "48 hours",
      status: "Completed",
    },
    {
      step: 4,
      title: "Premium Collection & Policy Activation",
      responsibleParty: "Insurer & Payment Gateway",
      nextAction: "Premium deducted or funded via credit facility; policy becomes active",
      auditRecord: "Policy #POL-2026-AF41 active; Solvency reserve allocated.",
      sla: "Instant upon funding",
      status: "Active & Monitored",
    },
    {
      step: 5,
      title: "Satellite Weather & Crop Condition Surveillance",
      responsibleParty: "Earth Observation Telemetry (Sentinel + CHIRPS)",
      nextAction: "Monitor precipitation deficit and vegetation health continuously",
      auditRecord: "Current rainfall at 78% of norm; watch status active.",
      sla: "Daily automated check",
      status: "In Progress",
    },
    {
      step: 6,
      title: "Loss / Parametric Trigger Automated Assessment",
      responsibleParty: "Parametric Smart Contract Engine",
      nextAction: "Trigger verified if rainfall drops below threshold or yield loss detected",
      auditRecord: "Trigger criteria predefined; zero manual assessor required.",
      sla: "Real-time trigger detection",
      status: "Upcoming",
    },
    {
      step: 7,
      title: "Claim Validation, Debt Offset & Settlement / Appeals",
      responsibleParty: "Insurer Claims Desk & Escrow Engine",
      nextAction: "Apply claim proceeds to lender debt obligation first; remit balance to farmer",
      auditRecord: "Settlement audit ledger transparently accessible to all parties.",
      sla: "Within 48 hours of trigger",
      status: "Upcoming",
    },
  ];

  // Bundled Simulation sequence
  const bundledSimulationSteps = [
    {
      stage: 0,
      title: "Seasonal Maize Application & Production Budget",
      desc: "Farmer registers for 50ha maize in Free State. Production budget calculated at $125,000 ($2,500/ha). Estimated revenue: $185,000.",
      badge: "Credit Inception",
    },
    {
      stage: 1,
      title: "Lender Matching & Mandatory Insurance Requirement",
      desc: "Platform matches farmer with Standard Bank (8.5% rate). Standard Bank credit policy requires Multi-Peril / Parametric Crop Insurance.",
      badge: "Marketplace Match",
    },
    {
      stage: 2,
      title: "Seamless Bundled Insurance Quotation & Policy Issue",
      desc: "Santam Agri issues bundled quote ($6,000 premium) incorporated directly into the loan facility. Farmer e-signs tripartite agreement.",
      badge: "Bundled Execution",
    },
    {
      stage: 3,
      title: "Mid-Season Severe Drought Anomaly Detected",
      desc: "Satellite CHIRPS telemetry registers 30-day cumulative rainfall of only 22mm (Trigger threshold < 35mm). System flags material risk.",
      badge: "Risk Telemetry",
    },
    {
      stage: 4,
      title: "Automated Parametric Claim Trigger ($50,000 Settlement)",
      desc: "Parametric engine validates 70% loss tier. Africa Re syndicate settles $50,000 claim automatically within 48 hours.",
      badge: "Automated Claim",
    },
    {
      stage: 5,
      title: "Contractual Debt Protection & Remaining Farmer Payout",
      desc: "$35,000 applied to amortize outstanding loan balance at Standard Bank. Remaining $15,000 disbursed directly to farmer's mobile wallet.",
      badge: "Reconciled & Closed",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#0B3D2C] border border-[#14533C] text-white shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Workflow Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#10171B] p-2 rounded-2xl border border-[#1D2A32]">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveWorkflow("bundled_integration")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeWorkflow === "bundled_integration"
                ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>The Critical Integration: Bundled Credit + Insurance</span>
          </button>

          <button
            onClick={() => setActiveWorkflow("financing")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeWorkflow === "financing"
                ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Financing Workflow (7 Stages)</span>
          </button>

          <button
            onClick={() => setActiveWorkflow("insurance")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeWorkflow === "insurance"
                ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CloudRain className="w-4 h-4 text-cyan-400" />
            <span>Insurance Workflow (7 Stages)</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-emerald-300 bg-[#07261B] px-3 py-1 rounded-xl border border-[#14533C]">
          Live Operational State Machine
        </span>
      </div>

      {/* BUNDLED FINANCING + INSURANCE INTEGRATION */}
      {activeWorkflow === "bundled_integration" && (
        <div className="space-y-4">
          <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                  Unified Transaction-Level Risk Management
                </span>
                <h3 className="font-extrabold text-base text-white mt-1">
                  End-to-End Bundled Seasonal Maize Facility Lifecycle
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Demonstrates how connecting credit and insurance protects both bank capital and farmer livelihoods under adverse climate shocks.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const next = (bundledSimulationStage + 1) % bundledSimulationSteps.length;
                    setBundledSimulationStage(next);
                    setToastMsg(`Advanced to Simulation Stage ${next + 1}: ${bundledSimulationSteps[next].title}`);
                    setTimeout(() => setToastMsg(null), 3000);
                  }}
                  className="px-3 py-2 bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs rounded-xl border border-[#196349] flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Next Lifecycle Stage →</span>
                </button>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {bundledSimulationSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setBundledSimulationStage(idx)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    bundledSimulationStage === idx
                      ? "bg-[#162228] border-emerald-500 shadow-md"
                      : idx < bundledSimulationStage
                      ? "bg-[#10171B] border-[#14533C] text-slate-300"
                      : "bg-[#10171B] border-[#1D2A32] text-slate-500"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold">Stage 0{idx + 1}</span>
                    {idx <= bundledSimulationStage ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>
                  <div className="text-[11px] font-bold text-white line-clamp-1">{step.title}</div>
                  <div className="text-[9px] text-emerald-400 mt-0.5">{step.badge}</div>
                </button>
              ))}
            </div>

            {/* Selected Stage Detail Panel */}
            <div className="p-5 rounded-2xl bg-[#162228] border border-[#1D2A32] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                    Stage {bundledSimulationStage + 1} of 6 • {bundledSimulationSteps[bundledSimulationStage].badge}
                  </span>
                  <h4 className="text-sm font-extrabold text-white mt-1.5">
                    {bundledSimulationSteps[bundledSimulationStage].title}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Transaction ID</span>
                  <div className="text-xs font-mono font-bold text-white">#TX-BUNDLED-2026-981</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-[#10171B] p-4 rounded-xl border border-[#1D2A32]">
                {bundledSimulationSteps[bundledSimulationStage].desc}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32]">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Lender Role</div>
                  <div className="text-white font-semibold mt-1">Standard Bank Agribusiness</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Facility: $125,000 (8.5% rate)</div>
                </div>

                <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32]">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Insurer Role</div>
                  <div className="text-white font-semibold mt-1">Santam Agriculture Syndicate</div>
                  <div className="text-[10px] text-cyan-400 mt-0.5">Parametric Sum Insured: $140,000</div>
                </div>

                <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32]">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Farmer Benefit</div>
                  <div className="text-white font-semibold mt-1">Free State Maize Outgrower</div>
                  <div className="text-[10px] text-amber-400 mt-0.5">Zero Debt Trap / Climate Risk Free</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FINANCING WORKFLOW */}
      {activeWorkflow === "financing" && (
        <div className="space-y-4">
          <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-4">
            <div className="pb-3 border-b border-[#19262F]">
              <h3 className="font-extrabold text-base text-white">
                Financing Operational Workflow (7 Configurable Stages)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every loan application is routed through defined responsibilities, automated AI assessments, credit committee controls, and harvest reconciliation.
              </p>
            </div>

            <div className="space-y-3">
              {financingSteps.map((st) => (
                <div
                  key={st.step}
                  onClick={() => setSelectedFinancingStep(st.step)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedFinancingStep === st.step
                      ? "bg-[#162228] border-emerald-500 shadow-sm"
                      : "bg-[#10171B] border-[#1D2A32] hover:border-slate-700"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#07261B] text-emerald-400 border border-[#14533C] flex items-center justify-center font-mono font-bold text-xs">
                        {st.step}
                      </span>
                      <h4 className="font-bold text-sm text-white">{st.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10171B] text-slate-400 border border-[#1D2A32]">
                        SLA: {st.sla}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          st.status === "Completed"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : st.status === "In Progress"
                            ? "bg-amber-950 text-amber-300 border border-amber-800"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {st.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-3 pt-3 border-t border-[#19262F]">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Responsible Party:</span>
                      <div className="text-white font-medium mt-0.5">{st.responsibleParty}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Next Action Required:</span>
                      <div className="text-slate-300 font-medium mt-0.5">{st.nextAction}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Audit History / Record:</span>
                      <div className="text-emerald-400 font-mono text-[11px] mt-0.5">{st.auditRecord}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* INSURANCE WORKFLOW */}
      {activeWorkflow === "insurance" && (
        <div className="space-y-4">
          <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-4">
            <div className="pb-3 border-b border-[#19262F]">
              <h3 className="font-extrabold text-base text-white">
                Insurance Operational Workflow (7 Configurable Stages)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                From satellite farm boundary verification to automated index trigger settlement and appeal handling.
              </p>
            </div>

            <div className="space-y-3">
              {insuranceSteps.map((st) => (
                <div
                  key={st.step}
                  onClick={() => setSelectedInsuranceStep(st.step)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedInsuranceStep === st.step
                      ? "bg-[#162228] border-cyan-500 shadow-sm"
                      : "bg-[#10171B] border-[#1D2A32] hover:border-slate-700"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#082835] text-cyan-400 border border-[#10485E] flex items-center justify-center font-mono font-bold text-xs">
                        {st.step}
                      </span>
                      <h4 className="font-bold text-sm text-white">{st.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10171B] text-slate-400 border border-[#1D2A32]">
                        SLA: {st.sla}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          st.status === "Completed" || st.status === "Active & Monitored"
                            ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                            : st.status === "In Progress"
                            ? "bg-amber-950 text-amber-300 border border-amber-800"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {st.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-3 pt-3 border-t border-[#19262F]">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Responsible Party:</span>
                      <div className="text-white font-medium mt-0.5">{st.responsibleParty}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Next Action Required:</span>
                      <div className="text-slate-300 font-medium mt-0.5">{st.nextAction}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Audit History / Record:</span>
                      <div className="text-cyan-400 font-mono text-[11px] mt-0.5">{st.auditRecord}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
