import React, { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Slash,
  AlertCircle,
  BarChart3,
  Scale,
  Lock,
  ChevronRight,
  ExternalLink,
  Users,
  Building,
  Zap,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export interface ComplianceAnomaly {
  id: string;
  timestamp: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  policyViolated: string;
  entityName: string;
  entityType: "Agro-Dealer" | "Borrower / Farm" | "Commercial Bank" | "Outgrower Co-op" | "Warehouse";
  region: string;
  description: string;
  auditEvidence: string;
  status: "Open Investigation" | "Pending Field Audit" | "Account Frozen" | "Resolved / Cleared";
}

export const RegulatoryComplianceMonitor: React.FC = () => {
  const { selectedCountry } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState<ComplianceAnomaly | null>(null);

  // Policy Mandates Adherence Metrics
  const policyMandates = [
    {
      id: "POL-01",
      name: "Strategic Grain Escrow Reserve Quota",
      statutoryAuthority: "National Agricultural Marketing Act",
      adherenceRate: 98.4,
      trend: "+1.2%",
      status: "Compliant",
      target: "10% of commercial grain offtakes",
      nonCompliantEntities: 3,
    },
    {
      id: "POL-02",
      name: "Codex MRL Chemical Residue Limits",
      statutoryAuthority: "Pesticides Control & Standards Agency",
      adherenceRate: 96.1,
      trend: "+3.4%",
      status: "Compliant",
      target: "< 10 ppb aflatoxin & zero banned organophosphates",
      nonCompliantEntities: 7,
    },
    {
      id: "POL-03",
      name: "AfCFTA Non-Deforestation Traceability (EUDR/AfCFTA)",
      statutoryAuthority: "Sovereign Forestry & Land Cadastre",
      adherenceRate: 92.8,
      trend: "+4.1%",
      status: "Watch",
      target: "Zero expansion into gazetted primary forest cut-offs",
      nonCompliantEntities: 14,
    },
    {
      id: "POL-04",
      name: "Concessional Agricultural Lending Rate Floor",
      statutoryAuthority: "Central Bank Banking Supervision Directive",
      adherenceRate: 99.2,
      trend: "+0.5%",
      status: "Compliant",
      target: "Capped interest spread <= 400 bps over repo rate",
      nonCompliantEntities: 1,
    },
    {
      id: "POL-05",
      name: "Parametric Weather Claim Settlement SLA",
      statutoryAuthority: "National Insurance Regulatory Commission",
      adherenceRate: 91.5,
      trend: "+6.8%",
      status: "Watch",
      target: "Settlement executed <= 72 hours of satellite index trigger",
      nonCompliantEntities: 6,
    },
  ];

  // Anomaly Radar Feed
  const [anomalies, setAnomalies] = useState<ComplianceAnomaly[]>([
    {
      id: "ANOM-2026-081",
      timestamp: "2026-10-18 10:14 UTC",
      severity: "Critical",
      policyViolated: "Subsidy Anti-Hoarding & Resale Prohibition",
      entityName: "Agro-Pro Supply Depot #104",
      entityType: "Agro-Dealer",
      region: "Free State & Highveld",
      description: "48 national fertilizer e-vouchers redeemed within 22 minutes from identical mobile MAC address. Suspected bulk liquidation and black-market arbitrage.",
      auditEvidence: "Biometric timestamp collision; GPS mismatch from registered retail storefront (14km divergence).",
      status: "Account Frozen",
    },
    {
      id: "ANOM-2026-079",
      timestamp: "2026-10-18 08:35 UTC",
      severity: "High",
      policyViolated: "Cadastral Double-Pledging & Overlapping Collateral",
      entityName: "Valley Crest Agro-Ventures",
      entityType: "Borrower / Farm",
      region: "Rift Valley Basin",
      description: "GIS parcel boundary #KE-RV-992 overlaps 94.2% with active collateral facility registered at another commercial bank under duplicate entity title.",
      auditEvidence: "Spatial polygon intersection detected on National Cadastre layer. Total duplicate exposure: $185,000.",
      status: "Open Investigation",
    },
    {
      id: "ANOM-2026-076",
      timestamp: "2026-10-17 19:40 UTC",
      severity: "High",
      policyViolated: "Parametric Claim Telemetry Discrepancy",
      entityName: "Volta Rice Outgrower Block B",
      entityType: "Outgrower Co-op",
      region: "Ashanti & Volta Basin",
      description: "Manual damage claim lodged for total crop failure due to drought, but Sentinel-2 NDVI vegetative vigor index shows healthy 0.72 canopy coverage.",
      auditEvidence: "Copernicus Sentinel-2 multispectral passes from Oct 04 and Oct 14 contradict field agent manual claims.",
      status: "Pending Field Audit",
    },
    {
      id: "ANOM-2026-072",
      timestamp: "2026-10-17 14:15 UTC",
      severity: "Medium",
      policyViolated: "Gazetted Maximum Retail Price (MRP) Cap",
      entityName: "Kumasi Input Wholesalers",
      entityType: "Agro-Dealer",
      region: "Ashanti Corridor",
      description: "Charged 14.5% illegal administrative handling fee to smallholder farmers redeeming subsidized certified seed vouchers.",
      auditEvidence: "POS receipt audit trail and 18 digital beneficiary grievance SMS submissions received via USSD *384#.",
      status: "Open Investigation",
    },
    {
      id: "ANOM-2026-068",
      timestamp: "2026-10-16 11:20 UTC",
      severity: "Low",
      policyViolated: "Lender Disbursement SLA Mandate",
      entityName: "First Pan-African Trust",
      entityType: "Commercial Bank",
      region: "Gauteng North",
      description: "Disbursement latency exceeded 7-day statutory threshold following Credit Committee approval for 12 approved smallholder loans.",
      auditEvidence: "Core banking API timestamp discrepancy: Approval dated Oct 02, funds still un-disbursed as of Oct 16.",
      status: "Resolved / Cleared",
    },
  ]);

  const handleUpdateStatus = (id: string, newStatus: ComplianceAnomaly["status"]) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    setToastMsg(`Anomaly #${id} status updated to: ${newStatus}`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const filteredAnomalies = anomalies.filter((a) => {
    const matchesSeverity = severityFilter === "all" || a.severity === severityFilter;
    const matchesStatus = activeFilter === "all" || a.status === activeFilter;
    const matchesSearch =
      a.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.policyViolated.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#0B3D2C] border border-[#14533C] text-white shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-[#07261B] px-2.5 py-0.5 rounded border border-[#14533C] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Real-Time Policy Compliance</span>
            </span>
            <span className="text-xs font-mono font-bold text-cyan-300 bg-[#082835] px-2 py-0.5 rounded border border-[#10485E]">
              Auditing 2.4M Smallholders & 48 Institutions
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
            National Agricultural Policy & Subsidy Compliance Monitor
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Surveils real-time statutory adherence, tracks public input subsidy delivery efficiency, and flags potential audit-triggering anomalies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] text-right">
            <div className="text-[10px] font-bold uppercase text-slate-400">National Adherence Index</div>
            <div className="text-2xl font-mono font-extrabold text-emerald-400">95.6%</div>
            <div className="text-[10px] text-emerald-300 mt-0.5">+2.4% vs Q2 Target</div>
          </div>

          <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] text-right">
            <div className="text-[10px] font-bold uppercase text-slate-400">Active Audit Flags</div>
            <div className="text-2xl font-mono font-extrabold text-amber-400">{anomalies.filter(a => a.status !== "Resolved / Cleared").length}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">2 Frozen Accounts</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: SUBSIDY DISTRIBUTION EFFICIENCY TELEMETRY */}
      <div className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] gap-2">
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>National Subsidy Distribution & Anti-Leakage Efficiency</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Auditing $76.2M in public fertilizer, seed, and solar irrigation vouchers across 3,420 accredited agro-dealer POS terminals.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-[#07261B] px-3 py-1 rounded-xl border border-[#14533C]">
            99.4% Anti-Leakage Accuracy
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Delivery Velocity</div>
            <div className="text-2xl font-mono font-extrabold text-emerald-400 mt-1">3.2 Days</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Digital allocation to field pickup</p>
          </div>

          <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Diversion / Leakage Rate</div>
            <div className="text-2xl font-mono font-extrabold text-emerald-400 mt-1">0.6%</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Down from 28% paper voucher baseline</p>
          </div>

          <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Agro-Dealer Settlement</div>
            <div className="text-2xl font-mono font-extrabold text-cyan-400 mt-1">&lt; 24 Hours</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Automated inter-switch bank clearing</p>
          </div>

          <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Inclusion Precision</div>
            <div className="text-2xl font-mono font-extrabold text-amber-300 mt-1">92.4%</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Verified smallholders (&lt; 5 hectares)</p>
          </div>
        </div>

        {/* Efficiency Progress Bars */}
        <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white">Voucher Redemption Progress (Season 2026-A)</span>
            <span className="font-mono text-emerald-400 font-bold">1,842,000 / 2,000,000 (92.1%)</span>
          </div>
          <div className="w-full bg-[#10171B] h-2.5 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: "92.1%" }} />
            <div className="bg-amber-500 h-full" style={{ width: "4.5%" }} />
            <div className="bg-slate-700 h-full" style={{ width: "3.4%" }} />
          </div>
          <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Fully Redeemed & Audited (92.1%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Pending POS Pickup (4.5%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-600"></span>
              <span>Unclaimed Allocation (3.4%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: STATUTORY POLICY ADHERENCE SCORECARD */}
      <div className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] gap-2">
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Adherence to National Agricultural Policies</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated compliance surveillance across sovereign decrees, environmental cut-offs, and prudential lending ceilings.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-[#162228] px-2.5 py-1 rounded-lg border border-[#1D2A32]">
            Statutory Engine: v2026.4
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#162228] text-slate-400 border-b border-[#1D2A32] text-[10px] uppercase tracking-wider font-bold">
                <th className="p-3">Policy Mandate</th>
                <th className="p-3">Statutory Authority</th>
                <th className="p-3">National Target / Threshold</th>
                <th className="p-3">Adherence Rate</th>
                <th className="p-3">Non-Compliant Entities</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#19262F]">
              {policyMandates.map((m) => (
                <tr key={m.id} className="hover:bg-[#162228]/50 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-white">{m.name}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">{m.id}</div>
                  </td>
                  <td className="p-3 text-slate-300 font-medium">{m.statutoryAuthority}</td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">{m.target}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">{m.adherenceRate}%</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">{m.trend}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      m.nonCompliantEntities === 0
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : "bg-amber-950 text-amber-300 border border-amber-800"
                    }`}>
                      {m.nonCompliantEntities} Flagged
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      m.status === "Compliant"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : "bg-amber-950 text-amber-300 border border-amber-800"
                    }`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: AUDIT-TRIGGERING ANOMALIES & FORENSIC RISK RADAR */}
      <div className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] gap-2">
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Audit-Triggering Anomalies & Forensic Risk Radar</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live algorithmic radar flagging duplicate parcels, black-market voucher resale, and parametric claim telemetry mismatches.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search anomaly, entity, policy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-2 bg-[#162228] text-white text-xs rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500 w-56"
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 bg-[#162228] text-white text-xs rounded-xl border border-[#1D2A32]"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="px-3 py-2 bg-[#162228] text-white text-xs rounded-xl border border-[#1D2A32]"
            >
              <option value="all">All Statuses</option>
              <option value="Account Frozen">Account Frozen</option>
              <option value="Open Investigation">Open Investigation</option>
              <option value="Pending Field Audit">Pending Field Audit</option>
              <option value="Resolved / Cleared">Resolved / Cleared</option>
            </select>
          </div>
        </div>

        {/* Anomaly Cards List */}
        <div className="space-y-3">
          {filteredAnomalies.map((anom) => (
            <div
              key={anom.id}
              className={`p-4 rounded-xl border transition-all ${
                anom.severity === "Critical"
                  ? "bg-[#181113] border-red-900/50 hover:border-red-600"
                  : anom.severity === "High"
                  ? "bg-[#181510] border-amber-900/50 hover:border-amber-600"
                  : "bg-[#162228] border-[#1D2A32] hover:border-slate-600"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      anom.severity === "Critical"
                        ? "bg-red-950 text-red-300 border border-red-800"
                        : anom.severity === "High"
                        ? "bg-amber-950 text-amber-300 border border-amber-800"
                        : "bg-blue-950 text-blue-300 border border-blue-800"
                    }`}
                  >
                    {anom.severity} Priority
                  </span>
                  <span className="font-mono text-xs text-slate-400 font-bold">{anom.id}</span>
                  <span className="text-[11px] text-slate-400 font-semibold">• {anom.region}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{anom.timestamp}</span>
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      anom.status === "Account Frozen"
                        ? "bg-red-900/80 text-white"
                        : anom.status === "Resolved / Cleared"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : "bg-amber-950 text-amber-300 border border-amber-800"
                    }`}
                  >
                    {anom.status}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold text-sm text-white">{anom.entityName}</h4>
                  <span className="text-[10px] font-mono bg-[#10171B] px-2 py-0.5 rounded text-slate-300 border border-[#1D2A32]">
                    {anom.entityType}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold">• Policy: {anom.policyViolated}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {anom.description}
                </p>

                <div className="p-2.5 bg-[#10171B] rounded-lg border border-[#1D2A32] text-[11px] text-slate-400">
                  <strong className="text-slate-300">Forensic Audit Evidence: </strong>
                  {anom.auditEvidence}
                </div>
              </div>

              {/* Action Controls */}
              <div className="mt-3 pt-3 border-t border-[#19262F] flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400">
                  Audit Protocol: Central Bank & Ministry Auditor-General Joint Notification Active
                </span>

                <div className="flex items-center gap-2">
                  {anom.status !== "Account Frozen" && (
                    <button
                      onClick={() => handleUpdateStatus(anom.id, "Account Frozen")}
                      className="px-2.5 py-1 bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-semibold rounded-lg border border-red-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Freeze Account</span>
                    </button>
                  )}

                  {anom.status !== "Pending Field Audit" && (
                    <button
                      onClick={() => handleUpdateStatus(anom.id, "Pending Field Audit")}
                      className="px-2.5 py-1 bg-[#162228] hover:bg-[#1D2A32] text-amber-300 text-xs font-semibold rounded-lg border border-[#1D2A32] flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Dispatch Field Inspector</span>
                    </button>
                  )}

                  {anom.status !== "Resolved / Cleared" && (
                    <button
                      onClick={() => handleUpdateStatus(anom.id, "Resolved / Cleared")}
                      className="px-2.5 py-1 bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold rounded-lg border border-[#196349] flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Resolve & Clear Flag</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
