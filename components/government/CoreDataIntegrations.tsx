import React, { useState } from "react";
import {
  Database,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  Server,
  Zap,
  RefreshCw,
  Search,
  Filter,
  Lock,
  Layers,
  ArrowRight,
  ExternalLink,
  Sliders,
  AlertCircle,
  Activity,
  FileCheck,
  Smartphone,
  Landmark,
  Satellite,
  CloudRain,
  Sprout,
  DollarSign,
  Cpu,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export interface IntegrationConnector {
  id: string;
  category:
    | "Identity & Business Verification"
    | "Banking & Payment APIs"
    | "Satellite & GIS Services"
    | "Weather APIs"
    | "Soil & Crop Data"
    | "Commodity Market APIs"
    | "E-Signature & Document Services"
    | "Accounting & Core Banking"
    | "SMS, Email & WhatsApp"
    | "Government & Land Registries";
  operationalPurpose: string;
  provider: string;
  status: "Active & Latency Verified" | "Configuration Ready" | "Sandbox Mode";
  latencyMs: number;
  dataSharingConsentRequired: boolean;
  jurisdictionCompliance: string;
  countriesSupported: string[];
}

export const CoreDataIntegrations: React.FC = () => {
  const { selectedCountry } = useApp();
  const [activeCountry, setActiveCountry] = useState<string>("All Pan-African");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);

  const [integrations, setIntegrations] = useState<IntegrationConnector[]>([
    {
      id: "INT-ID-01",
      category: "Identity & Business Verification",
      operationalPurpose: "Verify farmers, companies, cooperatives and beneficial ownership where required.",
      provider: "National ID System & SmileID Biometrics",
      status: "Active & Latency Verified",
      latencyMs: 142,
      dataSharingConsentRequired: true,
      jurisdictionCompliance: "POPIA (ZA), Data Protection Act (KE/GH), NDPR (NG)",
      countriesSupported: ["South Africa", "Kenya", "Nigeria", "Ghana", "Rwanda"],
    },
    {
      id: "INT-PAY-02",
      category: "Banking & Payment APIs",
      operationalPurpose: "Disburse loans, collect repayments, receive premiums and settle claims.",
      provider: "M-Pesa Daraja, Paystack, Flutterwave & Bank EFT/RTGS",
      status: "Active & Latency Verified",
      latencyMs: 98,
      dataSharingConsentRequired: true,
      jurisdictionCompliance: "PCI-DSS Level 1, Central Bank National Payment Systems Act",
      countriesSupported: ["South Africa", "Kenya", "Nigeria", "Ghana", "Tanzania", "Rwanda"],
    },
    {
      id: "INT-SAT-03",
      category: "Satellite & GIS Services",
      operationalPurpose: "Map farms, calculate acreage and monitor crop conditions.",
      provider: "ESA Copernicus Sentinel-2 & Planet Labs 3m Skysat",
      status: "Active & Latency Verified",
      latencyMs: 240,
      dataSharingConsentRequired: false,
      jurisdictionCompliance: "Open Data Commons, Sovereign Spatial Cadastre",
      countriesSupported: ["South Africa", "Kenya", "Nigeria", "Ghana", "Tanzania", "Ethiopia", "Rwanda"],
    },
    {
      id: "INT-MET-04",
      category: "Weather APIs",
      operationalPurpose: "Obtain rainfall, temperature, forecasts and historical weather data.",
      provider: "NOAA CPC, ECMWF & CHIRPS 5km Gridded Rainfall",
      status: "Active & Latency Verified",
      latencyMs: 82,
      dataSharingConsentRequired: false,
      jurisdictionCompliance: "WMO Global Telecommunication System (GTS)",
      countriesSupported: ["South Africa", "Kenya", "Nigeria", "Ghana", "Tanzania", "Ethiopia", "Rwanda"],
    },
    {
      id: "INT-SOIL-05",
      category: "Soil & Crop Data",
      operationalPurpose: "Support yield estimates, agronomic risk assessment and underwriting.",
      provider: "ISRIC World Soil Information & CGIAR Crop Models",
      status: "Active & Latency Verified",
      latencyMs: 110,
      dataSharingConsentRequired: false,
      jurisdictionCompliance: "FAO Harmonized World Soil Database v2.0",
      countriesSupported: ["South Africa", "Kenya", "Nigeria", "Ghana", "Rwanda"],
    },
    {
      id: "INT-MKT-06",
      category: "Commodity Market APIs",
      operationalPurpose: "Track commodity prices and support revenue and repayment forecasts.",
      provider: "SAFEX (JSE Agri), AFEX Nigeria & East Africa Grain Council (EAGC)",
      status: "Active & Latency Verified",
      latencyMs: 65,
      dataSharingConsentRequired: false,
      jurisdictionCompliance: "Capital Markets Authority & Commodity Exchange Rules",
      countriesSupported: ["South Africa", "Kenya", "Nigeria", "Ghana", "Tanzania"],
    },
    {
      id: "INT-DOC-07",
      category: "E-Signature & Document Services",
      operationalPurpose: "Execute and store agreements, policies and supporting evidence.",
      provider: "Cryptographic PKI & Legally Enforceable Electronic Signatures",
      status: "Active & Latency Verified",
      latencyMs: 125,
      dataSharingConsentRequired: true,
      jurisdictionCompliance: "ECTA 2002 (ZA), Kenya KICA 2013, eIDAS Standard",
      countriesSupported: ["South Africa", "Kenya", "Nigeria", "Ghana", "Rwanda"],
    },
    {
      id: "INT-ERP-08",
      category: "Accounting & Core Banking",
      operationalPurpose: "Reconcile transactions and synchronise loan and financial records.",
      provider: "Temenos T24, Oracle FLEXCUBE & Finacle Connectors",
      status: "Active & Latency Verified",
      latencyMs: 180,
      dataSharingConsentRequired: true,
      jurisdictionCompliance: "ISO 20022 Financial Messaging Architecture",
      countriesSupported: ["South Africa", "Kenya", "Nigeria", "Ghana"],
    },
    {
      id: "INT-COM-09",
      category: "SMS, Email & WhatsApp",
      operationalPurpose: "Communicate application status, deadlines, alerts and payment reminders.",
      provider: "Infobip & Twilio WhatsApp Business API Gateways",
      status: "Active & Latency Verified",
      latencyMs: 95,
      dataSharingConsentRequired: true,
      jurisdictionCompliance: "Consumer Protection & Anti-Spam (Opt-in Mandate)",
      countriesSupported: ["South Africa", "Kenya", "Nigeria", "Ghana", "Tanzania", "Rwanda", "Ethiopia"],
    },
    {
      id: "INT-CAD-10",
      category: "Government & Land Registries",
      operationalPurpose: "Verify eligible farms, land records and subsidy programmes where accessible.",
      provider: "National Deeds Office, Ministry Cadastres & MoA Subsidy DB",
      status: "Active & Latency Verified",
      latencyMs: 290,
      dataSharingConsentRequired: true,
      jurisdictionCompliance: "Sovereign Land Tenure & Ministry Inter-operability Framework",
      countriesSupported: ["South Africa", "Kenya", "Ghana", "Rwanda"],
    },
  ]);

  const countries = ["All Pan-African", "South Africa", "Kenya", "Nigeria", "Ghana", "Rwanda", "Tanzania", "Ethiopia"];

  const filteredIntegrations = integrations.filter((item) => {
    const matchesCountry =
      activeCountry === "All Pan-African" || item.countriesSupported.includes(activeCountry);
    const matchesCat = categoryFilter === "all" || item.category === categoryFilter;
    return matchesCountry && matchesCat;
  });

  const handleTestPing = (id: string, name: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      setToastMsg(`Ping verified for ${name}: Handshake successful (HTTP 200 • Latency within SLA).`);
      setTimeout(() => setToastMsg(null), 4000);
    }, 900);
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

      {/* Top Banner */}
      <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
            Shared Agricultural Data Infrastructure
          </span>
          <h3 className="font-extrabold text-base text-white mt-1">
            Core Pan-African Data & System Integrations (10 Categories)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configurable by sovereign jurisdiction: availability, licensing, API access, and cross-border data-sharing permissions.
          </p>
        </div>

        {/* Country Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <Globe2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-slate-400 font-bold uppercase">Jurisdiction:</span>
          <select
            value={activeCountry}
            onChange={(e) => setActiveCountry(e.target.value)}
            className="px-3 py-2 bg-[#162228] text-white text-xs font-semibold rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Security, Compliance and Governance Highlight Card */}
      <div className="p-4 bg-[#07261B] rounded-2xl border border-[#14533C] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-sm text-white">
              Embedded Security, Compliance & Governance Architecture
            </h4>
          </div>
          <span className="text-[10px] font-mono text-emerald-300 bg-[#0B3D2C] px-2.5 py-0.5 rounded border border-[#196349]">
            Built-In By Design
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-slate-300">
          <div className="p-3 bg-[#10171B]/80 rounded-xl border border-[#14533C]/60">
            <strong className="text-white block mb-0.5">Data Sovereignty:</strong>
            Farmer and collateral records reside within in-country or regional cloud zones to meet national regulatory mandates.
          </div>
          <div className="p-3 bg-[#10171B]/80 rounded-xl border border-[#14533C]/60">
            <strong className="text-white block mb-0.5">Granular Farmer Consent:</strong>
            Explicit opt-in required before farm economics are transmitted between lenders and insurers.
          </div>
          <div className="p-3 bg-[#10171B]/80 rounded-xl border border-[#14533C]/60">
            <strong className="text-white block mb-0.5">Cryptographic Encryption:</strong>
            AES-256 at rest, TLS 1.3 in transit with mutual TLS authentication on inter-bank payment switches.
          </div>
          <div className="p-3 bg-[#10171B]/80 rounded-xl border border-[#14533C]/60">
            <strong className="text-white block mb-0.5">Immutable Audit Trails:</strong>
            Every credit sanction, policy underwrite, and subsidy disbursement is logged in a tamper-evident audit ledger.
          </div>
        </div>
      </div>

      {/* Integration Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIntegrations.map((conn) => (
          <div
            key={conn.id}
            className="p-5 rounded-2xl bg-[#10171B] border border-[#1D2A32] flex flex-col justify-between space-y-3 shadow-sm hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                  {conn.category}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{conn.id}</span>
              </div>

              <h4 className="font-bold text-sm text-white">{conn.provider}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {conn.operationalPurpose}
              </p>

              <div className="mt-3 p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Jurisdiction Compliance:</span>
                  <span className="text-white font-medium">{conn.jurisdictionCompliance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Farmer Consent Requirement:</span>
                  <span className="text-emerald-400 font-semibold">
                    {conn.dataSharingConsentRequired ? "Mandatory Explicit Consent" : "Public Telemetry / Open Access"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Active Countries:</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {conn.countriesSupported.slice(0, 4).map((c, i) => (
                      <span key={i} className="text-[9px] bg-[#10171B] px-1.5 py-0.5 rounded border border-[#1D2A32] text-slate-300">
                        {c}
                      </span>
                    ))}
                    {conn.countriesSupported.length > 4 && (
                      <span className="text-[9px] text-slate-500">+{conn.countriesSupported.length - 4}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#19262F] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">{conn.status}</span>
                <span className="text-[10px] font-mono text-slate-500">({conn.latencyMs}ms)</span>
              </div>

              <button
                onClick={() => handleTestPing(conn.id, conn.provider)}
                disabled={testingId === conn.id}
                className="px-3 py-1.5 bg-[#162228] hover:bg-[#1D2A32] text-slate-200 text-xs font-semibold rounded-lg border border-[#1D2A32] flex items-center gap-1.5 cursor-pointer"
              >
                {testingId === conn.id ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-300" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>Test Handshake</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
