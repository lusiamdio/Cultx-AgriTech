import React, { useState } from "react";
import {
  Building2,
  Users,
  ShieldCheck,
  Lock,
  Key,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  X,
  Check,
  Globe2,
  FileCheck,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export interface OnboardedInstitution {
  id: string;
  name: string;
  type: "Commercial Bank" | "Microfinance (MFI)" | "Agricultural Insurer" | "Reinsurance Syndicate" | "Development Finance (DFI)" | "National Grain Board" | "Cooperative Union";
  country: string;
  jurisdiction: string;
  licensedBy: string;
  status: "Active & Certified" | "KYC Pending" | "Restricted Scope" | "Audited";
  usersCount: number;
  apiAccessLevel: "Full Read/Write" | "Underwriting Only" | "Audit & Surveillance";
  apiKeyId: string;
  tenantIsolationId: string;
  onboardedDate: string;
  covenantCompliant: boolean;
}

export const InstitutionalOnboardingPermissions: React.FC = () => {
  const { selectedCountry } = useApp();

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [institutions, setInstitutions] = useState<OnboardedInstitution[]>([
    {
      id: "INST-ZA-001",
      name: "Standard Bank Agricultural Banking",
      type: "Commercial Bank",
      country: "South Africa",
      jurisdiction: "South African Reserve Bank (SARB)",
      licensedBy: "Prudential Authority",
      status: "Active & Certified",
      usersCount: 48,
      apiAccessLevel: "Full Read/Write",
      apiKeyId: "key_live_std_9921_aes256",
      tenantIsolationId: "tenant-sarb-std-01",
      onboardedDate: "2025-01-14",
      covenantCompliant: true,
    },
    {
      id: "INST-KE-002",
      name: "KCB Agricultural Lending Group",
      type: "Commercial Bank",
      country: "Kenya",
      jurisdiction: "Central Bank of Kenya (CBK)",
      licensedBy: "CBK Banking Supervision",
      status: "Active & Certified",
      usersCount: 36,
      apiAccessLevel: "Full Read/Write",
      apiKeyId: "key_live_kcb_4401_aes256",
      tenantIsolationId: "tenant-cbk-kcb-02",
      onboardedDate: "2025-03-22",
      covenantCompliant: true,
    },
    {
      id: "INST-AFR-003",
      name: "Africa Reinsurance Corporation (Africa Re)",
      type: "Reinsurance Syndicate",
      country: "Pan-African (Nigeria / Kenya)",
      jurisdiction: "African Insurance Organization (AIO)",
      licensedBy: "Continental Reinsurance Treaty",
      status: "Active & Certified",
      usersCount: 22,
      apiAccessLevel: "Underwriting Only",
      apiKeyId: "key_live_afr_8819_aes256",
      tenantIsolationId: "tenant-aio-afr-03",
      onboardedDate: "2025-02-10",
      covenantCompliant: true,
    },
    {
      id: "INST-GH-004",
      name: "Sinapi Aba Savings and Loans",
      type: "Microfinance (MFI)",
      country: "Ghana",
      jurisdiction: "Bank of Ghana (BOG)",
      licensedBy: "BOG Non-Bank Financial Institutions",
      status: "Active & Certified",
      usersCount: 19,
      apiAccessLevel: "Full Read/Write",
      apiKeyId: "key_live_sin_1029_aes256",
      tenantIsolationId: "tenant-bog-sin-04",
      onboardedDate: "2025-05-18",
      covenantCompliant: true,
    },
    {
      id: "INST-DFI-005",
      name: "African Development Bank (AfDB) Ag-Fund",
      type: "Development Finance (DFI)",
      country: "Regional Pan-African",
      jurisdiction: "Multilateral Development Treaty",
      licensedBy: "Board of Governors AfDB",
      status: "Active & Certified",
      usersCount: 54,
      apiAccessLevel: "Audit & Surveillance",
      apiKeyId: "key_live_afdb_0091_aes256",
      tenantIsolationId: "tenant-dfi-afdb-05",
      onboardedDate: "2024-11-01",
      covenantCompliant: true,
    },
    {
      id: "INST-ZM-006",
      name: "Food Reserve Agency (FRA) Zambia",
      type: "National Grain Board",
      country: "Zambia",
      jurisdiction: "Ministry of Agriculture Zambia",
      licensedBy: "Statutory Food Security Body",
      status: "Active & Certified",
      usersCount: 15,
      apiAccessLevel: "Underwriting Only",
      apiKeyId: "key_live_fra_7712_aes256",
      tenantIsolationId: "tenant-zm-fra-06",
      onboardedDate: "2025-06-30",
      covenantCompliant: true,
    },
  ]);

  // Form state
  const [instName, setInstName] = useState("");
  const [instType, setInstType] = useState<OnboardedInstitution["type"]>("Commercial Bank");
  const [instCountry, setInstCountry] = useState("South Africa");
  const [instJurisdiction, setInstJurisdiction] = useState("National Reserve Bank");
  const [instAuthority, setInstAuthority] = useState("Banking Supervision Dept");
  const [instAccess, setInstAccess] = useState<OnboardedInstitution["apiAccessLevel"]>("Full Read/Write");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInst: OnboardedInstitution = {
      id: `INST-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: instName,
      type: instType,
      country: instCountry,
      jurisdiction: instJurisdiction,
      licensedBy: instAuthority,
      status: "Active & Certified",
      usersCount: 5,
      apiAccessLevel: instAccess,
      apiKeyId: `key_live_${Math.random().toString(36).slice(2, 8)}_aes256`,
      tenantIsolationId: `tenant-${instCountry.slice(0, 3).toLowerCase()}-${Math.floor(10 + Math.random() * 90)}`,
      onboardedDate: new Date().toISOString().slice(0, 10),
      covenantCompliant: true,
    };

    setInstitutions((prev) => [newInst, ...prev]);
    setIsOnboardModalOpen(false);
    showToast(`Successfully onboarded institutional partner "${newInst.name}". Multi-tenant isolation provisioned.`);
  };

  const filteredInsts = institutions.filter((inst) => {
    const matchesType = filterType === "all" || inst.type === filterType;
    const matchesSearch =
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3.5 bg-[#07261B] border border-[#14533C] rounded-xl text-xs font-bold text-emerald-200 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Banner: Multi-Tenant Architecture & Governance */}
      <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-2 rounded-xl bg-[#07261B] text-emerald-400 border border-[#14533C]">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </span>
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              Institutional Onboarding, Multi-Tenancy & Access Governance
            </h3>
            <span className="text-xs font-mono font-bold bg-[#07261B] text-emerald-300 px-2.5 py-0.5 rounded border border-[#14533C]">
              Strict Tenant Isolation Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Authorize commercial banks, agricultural insurers, DFIs, and regulatory ministries with dedicated cryptographic namespaces, isolated databases, and granular role permissions.
          </p>
        </div>

        <button
          onClick={() => setIsOnboardModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] transition-all flex items-center gap-2 cursor-pointer shadow-md self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-300" />
          <span>Onboard New Institution</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Certified Institutional Partners
          </span>
          <div className="text-2xl font-mono font-extrabold text-white">{institutions.length} Entities</div>
          <span className="text-[10px] text-emerald-400 block">7 African Jurisdictions</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Authorized Platform Operators
          </span>
          <div className="text-2xl font-mono font-extrabold text-white">
            {institutions.reduce((acc, i) => acc + i.usersCount, 0)} Officers
          </div>
          <span className="text-[10px] text-slate-400 block">FIDO2 Multi-Factor Enforced</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Multi-Tenant Namespaces
          </span>
          <div className="text-2xl font-mono font-extrabold text-emerald-300">100% Segregated</div>
          <span className="text-[10px] text-slate-400 block">Zero Cross-Tenant Leakage</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#07261B] border border-[#14533C] space-y-1">
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
            Covenant Compliance Audit
          </span>
          <div className="text-2xl font-mono font-extrabold text-emerald-300">100% Clean</div>
          <span className="text-[10px] text-emerald-400 block">Quarterly Audit Sign-off</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-3.5 bg-[#10171B] rounded-2xl border border-[#1D2A32] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#162228] px-3 py-1.5 rounded-xl border border-[#1D2A32]">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search partner or jurisdiction..."
              className="bg-transparent text-white focus:outline-none text-xs w-48 font-medium"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#162228] text-white border border-[#1D2A32] px-3 py-1.5 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
          >
            <option value="all">All Institution Archetypes</option>
            <option value="Commercial Bank">Commercial Bank</option>
            <option value="Microfinance (MFI)">Microfinance (MFI)</option>
            <option value="Agricultural Insurer">Agricultural Insurer</option>
            <option value="Reinsurance Syndicate">Reinsurance Syndicate</option>
            <option value="Development Finance (DFI)">Development Finance (DFI)</option>
            <option value="National Grain Board">National Grain Board</option>
          </select>
        </div>

        <span className="text-slate-400 font-mono text-[11px]">
          Displaying {filteredInsts.length} verified institutional nodes
        </span>
      </div>

      {/* Institutional Table */}
      <div className="bg-[#10171B] rounded-2xl border border-[#1D2A32] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#162228] text-slate-400 border-b border-[#1D2A32] font-semibold">
                <th className="p-3.5">Institution & Ref</th>
                <th className="p-3.5">Category & Jurisdiction</th>
                <th className="p-3.5">Regulatory License</th>
                <th className="p-3.5">Tenant Namespace</th>
                <th className="p-3.5">API Access Scope</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2A32]">
              {filteredInsts.map((inst) => (
                <tr key={inst.id} className="hover:bg-[#162228]/50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-mono text-emerald-400 font-bold">{inst.id}</div>
                    <div className="font-extrabold text-white text-xs mt-0.5">{inst.name}</div>
                    <div className="text-[10px] text-slate-400">{inst.country}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="text-slate-200 font-semibold">{inst.type}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{inst.jurisdiction}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="text-slate-300 font-medium">{inst.licensedBy}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">Audited: {inst.onboardedDate}</div>
                  </td>

                  <td className="p-3.5 font-mono text-slate-300">
                    <div className="text-emerald-300 font-bold text-[11px]">{inst.tenantIsolationId}</div>
                    <div className="text-[10px] text-slate-500">{inst.usersCount} Active Officers</div>
                  </td>

                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-[#162228] text-slate-300 font-mono text-[10px] border border-[#1D2A32]">
                      {inst.apiAccessLevel}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-[#07261B] text-emerald-300 border-[#14533C] inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{inst.status}</span>
                    </span>
                  </td>

                  <td className="p-3.5 text-right space-x-1.5">
                    <button
                      onClick={() => showToast(`Rotated cryptographic API token for ${inst.name}.`)}
                      className="px-2.5 py-1 rounded-lg bg-[#162228] hover:bg-[#1D2A32] text-slate-300 text-xs border border-[#1D2A32] cursor-pointer"
                    >
                      Rotate Key
                    </button>
                    <button
                      onClick={() => showToast(`Opened governance audit trail for ${inst.id}.`)}
                      className="px-2.5 py-1 rounded-lg bg-[#07261B] hover:bg-[#0B3D2C] text-emerald-300 text-xs border border-[#14533C] cursor-pointer"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Modal */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B1013]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#10171B] rounded-3xl max-w-lg w-full border border-[#1D2A32] shadow-2xl overflow-hidden my-auto">
            <div className="px-5 py-4 bg-[#07261B] text-white flex items-center justify-between border-b border-[#14533C]">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Onboard Institutional Partner & Provision Tenant
                </h3>
              </div>
              <button
                onClick={() => setIsOnboardModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOnboardSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Institution Legal Name</label>
                <input
                  type="text"
                  value={instName}
                  onChange={(e) => setInstName(e.target.value)}
                  placeholder="e.g., Ecobank Agricultural Credit Group"
                  className="w-full bg-[#162228] text-white px-3.5 py-2.5 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Institution Type</label>
                  <select
                    value={instType}
                    onChange={(e) => setInstType(e.target.value as OnboardedInstitution["type"])}
                    className="w-full bg-[#162228] text-white px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="Commercial Bank">Commercial Bank</option>
                    <option value="Microfinance (MFI)">Microfinance (MFI)</option>
                    <option value="Agricultural Insurer">Agricultural Insurer</option>
                    <option value="Reinsurance Syndicate">Reinsurance Syndicate</option>
                    <option value="Development Finance (DFI)">Development Finance (DFI)</option>
                    <option value="National Grain Board">National Grain Board</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Country Jurisdiction</label>
                  <select
                    value={instCountry}
                    onChange={(e) => setInstCountry(e.target.value)}
                    className="w-full bg-[#162228] text-white px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="South Africa">South Africa</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Zambia">Zambia</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Regional Pan-African">Regional Pan-African</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Supervising Regulator</label>
                  <input
                    type="text"
                    value={instJurisdiction}
                    onChange={(e) => setInstJurisdiction(e.target.value)}
                    placeholder="e.g., Central Bank of Nigeria"
                    className="w-full bg-[#162228] text-white px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">License Authority Reference</label>
                  <input
                    type="text"
                    value={instAuthority}
                    onChange={(e) => setInstAuthority(e.target.value)}
                    placeholder="e.g., Banking Act Section 14"
                    className="w-full bg-[#162228] text-white px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">API Access & Authorization Scope</label>
                <select
                  value={instAccess}
                  onChange={(e) => setInstAccess(e.target.value as OnboardedInstitution["apiAccessLevel"])}
                  className="w-full bg-[#162228] text-white px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="Full Read/Write">Full Read/Write (Direct Lending & Disbursals)</option>
                  <option value="Underwriting Only">Underwriting Only (Credit/Risk Assessment)</option>
                  <option value="Audit & Surveillance">Audit &amp; Surveillance (Ministry/Central Bank)</option>
                </select>
              </div>

              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] text-[11px] text-slate-300">
                <span className="font-bold text-white block mb-0.5">Automated Tenant Isolation:</span>
                Provisions a dedicated encrypted namespace with cryptographic key separation and independent audit logging.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#162228] text-slate-300 font-bold hover:bg-[#1D2A32] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold transition-all border border-[#196349] shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Provision Institution</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
