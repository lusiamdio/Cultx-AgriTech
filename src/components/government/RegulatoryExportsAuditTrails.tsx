import React, { useState } from "react";
import {
  FileText,
  Download,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Lock,
  Database,
  BarChart3,
  Server,
  Cpu,
  Layers,
  Sprout,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: "Ministry Auditor" | "Central Bank Regulator" | "System AI Engine" | "Credit Officer" | "Insurance Underwriter";
  institution: string;
  action: string;
  category: "Credit Decision" | "Underwriting Policy" | "Subsidy Earmark" | "System Config" | "Parametric Trigger" | "Override";
  modelVersion?: string;
  decisionReason: string;
  status: "Verified & Immutable" | "Flagged for Review" | "Under Appeal";
  hash: string;
}

export const RegulatoryExportsAuditTrails: React.FC = () => {
  const { selectedCountry } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<"audit_trails" | "regulatory_exports" | "system_performance" | "resilience_indicators">("audit_trails");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [auditLogs] = useState<AuditLogEntry[]>([
    {
      id: "AUD-2026-9812",
      timestamp: "2026-10-18 07:42:19 UTC",
      actor: "Dr. K. Mensah (Lead Agronomic Assessor)",
      actorRole: "Ministry Auditor",
      institution: "Ministry of Food and Agriculture (MoFA)",
      action: "Approved National Maize Fertilizer Subsidy Allocation #MoFA-4491",
      category: "Subsidy Earmark",
      modelVersion: "AgriPolicy-Sim-v4.2",
      decisionReason: "Soil acidity test confirmed optimal NPK ratio; parcel cadastre verified without overlap.",
      status: "Verified & Immutable",
      hash: "0x8f2c...9e31",
    },
    {
      id: "AUD-2026-9811",
      timestamp: "2026-10-18 06:14:02 UTC",
      actor: "AgriCredit-RiskEngine-v3.1",
      actorRole: "System AI Engine",
      institution: "Standard Bank Agricultural Banking",
      action: "Credit Capacity Score Generated: FarmID #ZA-FS-491 ($125,000 facility)",
      category: "Credit Decision",
      modelVersion: "AfriScore-Credit-v3.1.4",
      decisionReason: "Historical 5-year maize yield 7.8t/ha, forward contract with Tiger Brands verified, debt-service coverage 1.48x.",
      status: "Verified & Immutable",
      hash: "0x3b11...e412",
    },
    {
      id: "AUD-2026-9810",
      timestamp: "2026-10-17 21:55:40 UTC",
      actor: "A. van der Merwe (Senior Underwriter)",
      actorRole: "Insurance Underwriter",
      institution: "Santam Agriculture",
      action: "Human Override of Weather Derivative Trigger (Volta Rice Basin)",
      category: "Override",
      modelVersion: "Parametric-CHIRPS-v2.0",
      decisionReason: "Ground meteorological station recorded 8.4mm micro-shower offset from satellite CHIRPS grid. Verified with ground station.",
      status: "Verified & Immutable",
      hash: "0xaa45...77c8",
    },
    {
      id: "AUD-2026-9809",
      timestamp: "2026-10-17 18:30:11 UTC",
      actor: "Central Bank Oversight Terminal #04",
      actorRole: "Central Bank Regulator",
      institution: "South African Reserve Bank (SARB)",
      action: "Basel III Agricultural Risk-Weighted Asset (RWA) Extract Generated",
      category: "System Config",
      decisionReason: "Mandatory Q3 prudential stress capital review under Regulation 28.",
      status: "Verified & Immutable",
      hash: "0xd901...33bf",
    },
    {
      id: "AUD-2026-9808",
      timestamp: "2026-10-17 14:12:00 UTC",
      actor: "AgriInsure-ParametricEngine",
      actorRole: "System AI Engine",
      institution: "Africa Re Syndicate",
      action: "Drought Payout Trigger Event Verified (Rainfall Deficit < 35mm)",
      category: "Parametric Trigger",
      modelVersion: "Parametric-CHIRPS-v2.0",
      decisionReason: "30-day cumulative precipitation below 20-year rolling standard deviation threshold.",
      status: "Verified & Immutable",
      hash: "0x55ef...8821",
    },
    {
      id: "AUD-2026-9807",
      timestamp: "2026-10-16 11:08:44 UTC",
      actor: "M. Osei (Senior Credit Officer)",
      actorRole: "Credit Officer",
      institution: "Sinapi Aba Savings & Loans",
      action: "Credit Facility Sanctioned with Linked Crop Insurance Obligation",
      category: "Credit Decision",
      decisionReason: "Lender mandate satisfied; multi-peril policy underwritten by Star Assurance Ghana.",
      status: "Verified & Immutable",
      hash: "0x12c4...f990",
    },
  ]);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesCat = categoryFilter === "all" || log.category === categoryFilter;
    const matchesSearch =
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.decisionReason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleExport = (format: string, reportName: string) => {
    setDownloadingFormat(reportName);
    setTimeout(() => {
      setDownloadingFormat(null);
      setToastMsg(`Successfully generated and dispatched ${reportName} in ${format.toUpperCase()} format with digital ministry signature.`);
      setTimeout(() => setToastMsg(null), 4500);
    }, 1200);
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

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#10171B] p-2 rounded-2xl border border-[#1D2A32]">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveSubTab("audit_trails")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "audit_trails"
                ? "bg-[#162228] text-white shadow-sm border border-[#1D2A32]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Decision Auditability & Hash Trails</span>
          </button>

          <button
            onClick={() => setActiveSubTab("regulatory_exports")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "regulatory_exports"
                ? "bg-[#162228] text-white shadow-sm border border-[#1D2A32]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Regulatory & Prudential Exports</span>
          </button>

          <button
            onClick={() => setActiveSubTab("system_performance")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "system_performance"
                ? "bg-[#162228] text-white shadow-sm border border-[#1D2A32]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>System Performance & SLA Metrics</span>
          </button>

          <button
            onClick={() => setActiveSubTab("resilience_indicators")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "resilience_indicators"
                ? "bg-[#162228] text-white shadow-sm border border-[#1D2A32]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>Aggregated Resilience Indicators</span>
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-[#162228] rounded-xl border border-[#1D2A32]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[11px] font-mono text-slate-300">Auditor Node: Sovereign-Node-01</span>
        </div>
      </div>

      {/* SUB-TAB 1: DECISION AUDITABILITY & HASH TRAILS */}
      {activeSubTab === "audit_trails" && (
        <div className="space-y-4">
          <div className="p-4 bg-[#10171B] rounded-2xl border border-[#1D2A32] flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <span>Cryptographic Decision Audit Ledger</span>
                <span className="text-[10px] font-mono bg-[#07261B] text-emerald-300 px-2 py-0.5 rounded border border-[#14533C]">
                  SHA-256 Immutability Enabled
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Full chronological registry of every credit decision, parametric underwriting rule, public subsidy allocation, and human override.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter by actor, action or hash..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-2 bg-[#162228] rounded-xl text-xs text-white border border-[#1D2A32] focus:outline-none focus:border-emerald-500 w-64"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-[#162228] rounded-xl text-xs text-white border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Audit Categories</option>
                <option value="Credit Decision">Credit Decision</option>
                <option value="Underwriting Policy">Underwriting Policy</option>
                <option value="Subsidy Earmark">Subsidy Earmark</option>
                <option value="Parametric Trigger">Parametric Trigger</option>
                <option value="Override">Human Override</option>
                <option value="System Config">System Config</option>
              </select>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-[#10171B] rounded-2xl border border-[#1D2A32] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#162228] text-slate-400 border-b border-[#1D2A32] text-[11px] uppercase tracking-wider font-bold">
                    <th className="p-3.5">Log ID & Timestamp</th>
                    <th className="p-3.5">Actor & Role</th>
                    <th className="p-3.5">Action Executed</th>
                    <th className="p-3.5">Category & Model</th>
                    <th className="p-3.5">Audit Reason & Justification</th>
                    <th className="p-3.5">Integrity Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#19262F]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#162228]/50 transition-colors">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-white">{log.id}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{log.timestamp}</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-white">{log.actor}</div>
                        <div className="text-[10px] text-emerald-400">{log.institution}</div>
                        <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded bg-[#162228] border border-[#1D2A32] text-slate-300">
                          {log.actorRole}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-200">{log.action}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#07261B] text-emerald-300 border border-[#14533C]">
                          {log.category}
                        </span>
                        {log.modelVersion && (
                          <div className="text-[10px] font-mono text-slate-400 mt-1">
                            {log.modelVersion}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 max-w-xs">
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {log.decisionReason}
                        </p>
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono text-[10px] text-slate-400 bg-[#162228] px-2 py-1 rounded border border-[#1D2A32]">
                          {log.hash}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Valid Proof</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: REGULATORY & PRUDENTIAL EXPORTS */}
      {activeSubTab === "regulatory_exports" && (
        <div className="space-y-4">
          <div className="p-4 bg-[#10171B] rounded-2xl border border-[#1D2A32]">
            <h3 className="font-extrabold text-sm text-white">
              Official Regulatory Filing & Prudential Data Exports
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Generate standardized, audit-ready regulatory documentation for Central Banks, Financial Conduct Authorities, National Insurance Commissions, and AfCFTA Trade Secretariat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Export 1: Central Bank Agricultural Credit Prudential Return */}
            <div className="p-5 rounded-2xl bg-[#10171B] border border-[#1D2A32] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                    Banking Regulator
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Monthly Return (Form 21-A)</span>
                </div>
                <h4 className="font-bold text-sm text-white">Central Bank Agricultural Credit Return</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Full loan book exposure, Portfolio-at-Risk (PAR30/90), non-performing loans (NPL), and sector concentration by crop & province.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-300">
                  <span className="bg-[#162228] px-2 py-0.5 rounded border border-[#1D2A32]">Basel III RWA</span>
                  <span className="bg-[#162228] px-2 py-0.5 rounded border border-[#1D2A32]">IFRS 9 Impairments</span>
                  <span className="bg-[#162228] px-2 py-0.5 rounded border border-[#1D2A32]">1,622 Loan Files</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#19262F] flex items-center justify-between gap-2">
                <button
                  onClick={() => handleExport("csv", "Central Bank Credit Return (CSV)")}
                  disabled={downloadingFormat === "Central Bank Credit Return (CSV)"}
                  className="px-3 py-1.5 bg-[#162228] hover:bg-[#1D2A32] text-slate-200 text-xs font-semibold rounded-lg border border-[#1D2A32] flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => handleExport("pdf", "Central Bank Credit Return (PDF)")}
                  disabled={downloadingFormat === "Central Bank Credit Return (PDF)"}
                  className="px-3 py-1.5 bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold rounded-lg border border-[#196349] flex items-center gap-1.5 cursor-pointer"
                >
                  {downloadingFormat === "Central Bank Credit Return (PDF)" ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-300" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>Signed PDF</span>
                </button>
              </div>
            </div>

            {/* Export 2: National Insurance Commission Solvency & Loss Ratio Schedule */}
            <div className="p-5 rounded-2xl bg-[#10171B] border border-[#1D2A32] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-[#082835] px-2 py-0.5 rounded border border-[#10485E]">
                    Insurance Commission
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Quarterly Solvency II</span>
                </div>
                <h4 className="font-bold text-sm text-white">Solvency & Agricultural Underwriting Return</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Gross Written Premium, technical loss reserves, claims frequency, parametric weather triggers, and reinsurance treaty retentions.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-300">
                  <span className="bg-[#162228] px-2 py-0.5 rounded border border-[#1D2A32]">218% Solvency Ratio</span>
                  <span className="bg-[#162228] px-2 py-0.5 rounded border border-[#1D2A32]">41.2% Loss Ratio</span>
                  <span className="bg-[#162228] px-2 py-0.5 rounded border border-[#1D2A32]">Reinsurance Treaty</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#19262F] flex items-center justify-between gap-2">
                <button
                  onClick={() => handleExport("xbrl", "Insurance Commission Solvency Return (XBRL)")}
                  className="px-3 py-1.5 bg-[#162228] hover:bg-[#1D2A32] text-slate-200 text-xs font-semibold rounded-lg border border-[#1D2A32] flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>XBRL / XML</span>
                </button>
                <button
                  onClick={() => handleExport("pdf", "Insurance Commission Solvency Return (PDF)")}
                  className="px-3 py-1.5 bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold rounded-lg border border-[#196349] flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Signed PDF</span>
                </button>
              </div>
            </div>

            {/* Export 3: Ministry of Agriculture Subsidy Disbursement Audit */}
            <div className="p-5 rounded-2xl bg-[#10171B] border border-[#1D2A32] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-[#352508] px-2 py-0.5 rounded border border-[#5E4210]">
                    Ministry & Auditor-General
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Season Accountability</span>
                </div>
                <h4 className="font-bold text-sm text-white">Public Subsidy & Beneficiary Audit Dossier</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Reconciled voucher disbursements, biometric farmer redemption logs, agro-dealer clearing records, and blocked fraudulent attempts.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-300">
                  <span className="bg-[#162228] px-2 py-0.5 rounded border border-[#1D2A32]">$76.6M Audited</span>
                  <span className="bg-[#162228] px-2 py-0.5 rounded border border-[#1D2A32]">92.4% Redemption</span>
                  <span className="bg-[#162228] px-2 py-0.5 rounded border border-[#1D2A32]">Anti-Leakage Certified</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#19262F] flex items-center justify-between gap-2">
                <button
                  onClick={() => handleExport("csv", "Subsidy Beneficiary Dossier (CSV)")}
                  className="px-3 py-1.5 bg-[#162228] hover:bg-[#1D2A32] text-slate-200 text-xs font-semibold rounded-lg border border-[#1D2A32] flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => handleExport("pdf", "Subsidy Beneficiary Dossier (PDF)")}
                  className="px-3 py-1.5 bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold rounded-lg border border-[#196349] flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Signed PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SYSTEM PERFORMANCE & INFRASTRUCTURE HEALTH */}
      {activeSubTab === "system_performance" && (
        <div className="space-y-4">
          <div className="p-4 bg-[#10171B] rounded-2xl border border-[#1D2A32]">
            <h3 className="font-extrabold text-sm text-white">
              Sovereign Platform Infrastructure Health & SLA Metrics
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time telemetry on API uptime, cryptographic tenant isolation, database query throughput, and telecom USSD/SMS gateway latency.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Core Engine Uptime</div>
              <div className="text-2xl font-mono font-extrabold text-emerald-400 mt-1">99.98%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Trailing 365 Days SLA</div>
            </div>

            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">API Gateway Latency</div>
              <div className="text-2xl font-mono font-extrabold text-white mt-1">42ms</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">p99 &lt; 120ms Target</div>
            </div>

            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">USSD / SMS Pipeline</div>
              <div className="text-2xl font-mono font-extrabold text-white mt-1">1.2s</div>
              <div className="text-[10px] text-slate-400 mt-0.5">MTN, Safaricom, Vodacom</div>
            </div>

            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tenant Data Isolation</div>
              <div className="text-2xl font-mono font-extrabold text-cyan-400 mt-1">100%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">AES-256 Per Institution</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">
              Active Server Clusters & Cloud Telemetry
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Johannesburg (JNB-01)</div>
                  <div className="text-[10px] text-slate-400">Southern African Core Cluster</div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                  Healthy • 38ms
                </span>
              </div>

              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Nairobi (NBO-01)</div>
                  <div className="text-[10px] text-slate-400">East African Hub & Telecom Node</div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                  Healthy • 44ms
                </span>
              </div>

              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Lagos (LOS-01)</div>
                  <div className="text-[10px] text-slate-400">West African Inter-Bank Node</div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                  Healthy • 51ms
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: AGGREGATED RESILIENCE INDICATORS */}
      {activeSubTab === "resilience_indicators" && (
        <div className="space-y-4">
          <div className="p-4 bg-[#10171B] rounded-2xl border border-[#1D2A32]">
            <h3 className="font-extrabold text-sm text-white">
              Aggregated Food Production & Agricultural Resilience Indicators
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive macroeconomic indicators monitoring systemic food security, climate adaptation metrics, and agricultural resilience across agro-ecological zones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                National Food Self-Sufficiency
              </div>
              <div className="text-2xl font-mono font-extrabold text-emerald-400">88.4%</div>
              <p className="text-[11px] text-slate-400">
                +4.2% YoY driven by certified hybrid seed adoption and targeted input financing.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Strategic Grain Buffer Duration
              </div>
              <div className="text-2xl font-mono font-extrabold text-white">184 Days</div>
              <p className="text-[11px] text-slate-400">
                2.1M MT in silos; well above the UN FAO minimum safety threshold of 90 days.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Climate Adaptation Adoption
              </div>
              <div className="text-2xl font-mono font-extrabold text-cyan-400">64.2%</div>
              <p className="text-[11px] text-slate-400">
                Farmers practicing minimum tillage, solar micro-irrigation, and cover cropping.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#10171B] border border-[#1D2A32] space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Crop Yield Stability Index
              </div>
              <div className="text-2xl font-mono font-extrabold text-amber-400">0.82 / 1.0</div>
              <p className="text-[11px] text-slate-400">
                Inter-annual yield coefficient of variation reduced by 34% through parametric safety nets.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
