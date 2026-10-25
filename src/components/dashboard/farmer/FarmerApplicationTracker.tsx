import React, { useState } from "react";
import {
  FileCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  Eye,
  Download,
  Lock,
  ShieldCheck,
  FileText,
  X,
  Plus,
  Check,
  Building,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useApp } from "../../../context/AppContext";

export interface RequiredDocItem {
  id: string;
  name: string;
  category: "Legal & Land" | "Agronomic" | "Commercial" | "Regulatory" | "Identity";
  mandateFor: string;
  status: "Verified & Active" | "Under Review" | "Action Required" | "Expired";
  expiryDate: string;
  documentHash: string;
  fileSize: string;
  authority: string;
}

export const FarmerApplicationTracker: React.FC = () => {
  const { currentFarm } = useApp();

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState<RequiredDocItem | null>(null);

  // Active Credit / Insurance Application Progress Milestones
  const [applicationStages] = useState([
    {
      id: "step1",
      stepNum: 1,
      title: "Digital KYC & Biometric Identity",
      date: "Completed Oct 08, 2026",
      status: "completed" as const,
      description: "National ID biometric match + FIDO2 cryptographic sovereign passport.",
      oracle: "National Identity Authority + Biometric Anchor",
    },
    {
      id: "step2",
      stepNum: 2,
      title: "Cadastral Land Title & Parcel Polygons",
      date: "Completed Oct 10, 2026",
      status: "completed" as const,
      description: "250 Hectare freehold deed registry validated on national cadastre.",
      oracle: "Deeds Registry Free State (Ref: ZA-FS-9481)",
    },
    {
      id: "step3",
      stepNum: 3,
      title: "Satellite Agronomic Audit & NDVI Health",
      date: "Completed Oct 12, 2026",
      status: "completed" as const,
      description: "Sentinel-2 MSI recorded 0.88 NDVI vegetative vigour across all 4 parcels.",
      oracle: "Copernicus Space Data Hub / ESA Telemetry",
    },
    {
      id: "step4",
      stepNum: 4,
      title: "Credit Committee Deliberation & Term Sheet",
      date: "Active Stage • In Review",
      status: "active" as const,
      description: "Facility terms under consideration: $85,000 USD input credit @ 9.2% p.a.",
      oracle: "Standard Bank / AfDB Risk Committee",
    },
    {
      id: "step5",
      stepNum: 5,
      title: "Escrow Ring-Fencing & Covenant Signing",
      date: "Scheduled Oct 20, 2026",
      status: "pending" as const,
      description: "Forward off-take delivery escrow locking with Pan-African Milling.",
      oracle: "SAFEX Licensed Grain Escrow Vault",
    },
    {
      id: "step6",
      stepNum: 6,
      title: "Capital Disbursement to Supplier Rail",
      date: "Scheduled Oct 22, 2026",
      status: "pending" as const,
      description: "Direct voucher disbursement to certified seed and fertilizer aggregators.",
      oracle: "PAPSS Instant Inter-Bank Settlement",
    },
  ]);

  // Required Document Checklist
  const [requiredDocs, setRequiredDocs] = useState<RequiredDocItem[]>([
    {
      id: "DOC-REQ-01",
      name: "Freehold Land Title Deed & Survey Cadastre",
      category: "Legal & Land",
      mandateFor: "Bank Collateral & Cadastral Registration",
      status: "Verified & Active",
      expiryDate: "Perpetual Freehold",
      documentHash: "0x98f12a4b8821ec09",
      fileSize: "4.8 MB (PDF)",
      authority: "Surveyor-General Office",
    },
    {
      id: "DOC-REQ-02",
      name: "Soil Comprehensive Physical & Chemical Assay",
      category: "Agronomic",
      mandateFor: "Agronomic Health Scoring & VRA Planning",
      status: "Verified & Active",
      expiryDate: "Valid to Aug 2027",
      documentHash: "0x77c289ad9104fa22",
      fileSize: "2.4 MB (PDF)",
      authority: "SGS Agrolab South Africa",
    },
    {
      id: "DOC-REQ-03",
      name: "Guaranteed Forward Off-Take Purchase Agreement",
      category: "Commercial",
      mandateFor: "Credit Repayment Escrow Underwriting",
      status: "Verified & Active",
      expiryDate: "Valid to March 2027",
      documentHash: "0x44fa10b98213de55",
      fileSize: "3.1 MB (Signed)",
      authority: "Pan-African Milling Ltd",
    },
    {
      id: "DOC-REQ-04",
      name: "GlobalGAP Food Safety & Traceability Certificate",
      category: "Regulatory",
      mandateFor: "AfCFTA Cross-Border Trade & Institutional Export",
      status: "Verified & Active",
      expiryDate: "Valid to Dec 2027",
      documentHash: "0x55bc3289011afb94",
      fileSize: "1.9 MB (Audit)",
      authority: "Control Union Inspections",
    },
    {
      id: "DOC-REQ-05",
      name: "SARS Agricultural Tax Clearance & Exemption",
      category: "Regulatory",
      mandateFor: "Subsidized Facility Interest Rates",
      status: "Verified & Active",
      expiryDate: "Valid to Feb 2027",
      documentHash: "0x11fa990022bbaec8",
      fileSize: "1.2 MB (e-Certificate)",
      authority: "South African Revenue Service",
    },
    {
      id: "DOC-REQ-06",
      name: "Water Extraction Allocation Permit (#WAT-650K)",
      category: "Legal & Land",
      mandateFor: "Center Pivot Irrigation Risk Clearance",
      status: "Verified & Active",
      expiryDate: "Valid to 2031",
      documentHash: "0x33ee881944ccd890",
      fileSize: "2.7 MB (Permit)",
      authority: "Dept of Water and Sanitation",
    },
  ]);

  // Upload modal form state
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] = useState<RequiredDocItem["category"]>("Agronomic");
  const [docAuthority, setDocAuthority] = useState("");
  const [docMandate, setDocMandate] = useState("");
  const [docExpiry, setDocExpiry] = useState("2027-12-31");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleUploadNewDoc = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: RequiredDocItem = {
      id: `DOC-REQ-${Math.floor(10 + Math.random() * 90)}`,
      name: docTitle || "Updated Certificate",
      category: docCategory,
      mandateFor: docMandate || "Facility Compliance",
      status: "Under Review",
      expiryDate: `Valid to ${docExpiry}`,
      documentHash: `0x${Math.random().toString(16).slice(2, 18)}`,
      fileSize: "2.8 MB (Encrypted)",
      authority: docAuthority || "Certified Authority",
    };

    setRequiredDocs((prev) => [newDoc, ...prev]);
    setIsUploadModalOpen(false);
    showToast(`Uploaded "${newDoc.name}". Dispatched to Underwriting Committee.`);
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

      {/* SECTION 1: Active Loan & Insurance Application Tracker */}
      <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1D2A32]">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-extrabold text-white">
                Live Credit Underwriting & Application Progress Pipeline
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Application Ref: <strong className="font-mono text-emerald-400">LN-2026-9041</strong> • Facility: $85,000 USD Input Credit (AfDB & Standard Bank)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-[#07261B] text-emerald-300 px-3 py-1 rounded-xl border border-[#14533C]">
              Step 4 of 6: Credit Committee Review
            </span>
          </div>
        </div>

        {/* Milestone Steps Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {applicationStages.map((stg) => (
            <div
              key={stg.id}
              className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                stg.status === "completed"
                  ? "bg-[#162228] border-emerald-900/60"
                  : stg.status === "active"
                  ? "bg-[#07261B] border-emerald-500 ring-1 ring-emerald-500/50 shadow-md"
                  : "bg-[#10171B] border-[#1D2A32]/70 opacity-60"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[10px] text-slate-400">
                    Stage 0{stg.stepNum}
                  </span>
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      stg.status === "completed"
                        ? "bg-emerald-500 text-slate-950"
                        : stg.status === "active"
                        ? "bg-amber-400 text-slate-950 animate-pulse font-extrabold"
                        : "bg-[#1D2A32] text-slate-400"
                    }`}
                  >
                    {stg.status === "completed" ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      stg.stepNum
                    )}
                  </span>
                </div>

                <div className="font-extrabold text-white text-xs leading-snug">{stg.title}</div>
                <div
                  className={`text-[10px] font-mono font-medium ${
                    stg.status === "completed"
                      ? "text-emerald-400"
                      : stg.status === "active"
                      ? "text-amber-300 font-bold"
                      : "text-slate-500"
                  }`}
                >
                  {stg.date}
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  {stg.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#1D2A32] text-[10px] text-slate-400 font-mono truncate">
                {stg.oracle}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Required Documents & Compliance Checklist */}
      <div className="bg-[#10171B] rounded-2xl border border-[#1D2A32] overflow-hidden shadow-sm space-y-0">
        <div className="p-4 sm:p-5 bg-[#162228] border-b border-[#1D2A32] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-white">
                Required Regulatory, Agronomic & Financial Documents Checklist
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              All documents are cryptographically anchored with SHA-256 hashes and verifiable by authorized financial underwriters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-300" />
              <span>Upload Compliance Document</span>
            </button>
          </div>
        </div>

        {/* Documents Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#10171B] text-slate-400 border-b border-[#1D2A32] font-semibold">
                <th className="p-3.5">Document Title & Authority</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Underwriting Mandate</th>
                <th className="p-3.5">Compliance Status</th>
                <th className="p-3.5">Validity / Expiry</th>
                <th className="p-3.5">Verification Hash</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2A32]">
              {requiredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#162228]/50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-extrabold text-white text-xs">{doc.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{doc.authority}</div>
                  </td>

                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-[#162228] text-slate-300 font-mono text-[10px] border border-[#1D2A32]">
                      {doc.category}
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-300">
                    <div>{doc.mandateFor}</div>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                        doc.status === "Verified & Active"
                          ? "bg-[#07261B] text-emerald-300 border-[#14533C]"
                          : "bg-amber-950 text-amber-300 border-amber-800"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{doc.status}</span>
                    </span>
                  </td>

                  <td className="p-3.5 font-mono text-slate-300">
                    <div>{doc.expiryDate}</div>
                    <div className="text-[10px] text-slate-500">{doc.fileSize}</div>
                  </td>

                  <td className="p-3.5 font-mono text-[11px] text-slate-400">
                    <div className="text-emerald-300">{doc.documentHash}</div>
                    <div className="text-[9px] text-slate-500">SHA-256 Ledger Anchor</div>
                  </td>

                  <td className="p-3.5 text-right space-x-1.5">
                    <button
                      onClick={() => setSelectedDocPreview(doc)}
                      className="px-2.5 py-1 rounded-lg bg-[#162228] hover:bg-[#1D2A32] text-slate-300 text-xs border border-[#1D2A32] cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        showToast(`Downloaded verified copy of ${doc.name}.`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#07261B] hover:bg-[#0B3D2C] text-emerald-300 text-xs border border-[#14533C] cursor-pointer"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B1013]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#10171B] rounded-3xl max-w-lg w-full border border-[#1D2A32] shadow-2xl overflow-hidden my-auto">
            <div className="px-5 py-4 bg-[#07261B] text-white flex items-center justify-between border-b border-[#14533C]">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Upload Compliance or Agronomic Document
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadNewDoc} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Document Title</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g., Soil Organic Carbon & Micronutrient Analysis 2026"
                  className="w-full bg-[#162228] text-white px-3.5 py-2.5 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as RequiredDocItem["category"])}
                    className="w-full bg-[#162228] text-white px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Agronomic">Agronomic</option>
                    <option value="Legal & Land">Legal & Land</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Regulatory">Regulatory</option>
                    <option value="Identity">Identity</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Issuing Authority</label>
                  <input
                    type="text"
                    value={docAuthority}
                    onChange={(e) => setDocAuthority(e.target.value)}
                    placeholder="e.g., SGS Agrolab / AgriSA"
                    className="w-full bg-[#162228] text-white px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Mandated For</label>
                  <input
                    type="text"
                    value={docMandate}
                    onChange={(e) => setDocMandate(e.target.value)}
                    placeholder="e.g., Loan Underwriting"
                    className="w-full bg-[#162228] text-white px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={docExpiry}
                    onChange={(e) => setDocExpiry(e.target.value)}
                    className="w-full bg-[#162228] text-white font-mono px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div className="border-2 border-dashed border-[#1D2A32] hover:border-emerald-500/60 rounded-2xl p-6 text-center space-y-2 bg-[#162228]/50 cursor-pointer">
                <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="font-bold text-white text-xs">
                  Drag and drop PDF, Scan or Image here
                </div>
                <p className="text-[11px] text-slate-400">
                  Files are encrypted locally before transmission. SHA-256 seal auto-generated.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#162228] text-slate-300 font-bold hover:bg-[#1D2A32] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold transition-all border border-[#196349] shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Submit & Anchor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Document Preview Modal */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 bg-[#0B1013]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#10171B] rounded-3xl max-w-lg w-full border border-[#1D2A32] shadow-2xl overflow-hidden my-auto">
            <div className="px-5 py-4 bg-[#07261B] text-white flex items-center justify-between border-b border-[#14533C]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Compliance Dossier: {selectedDocPreview.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Authority</span>
                  <div className="font-bold text-white mt-0.5">{selectedDocPreview.authority}</div>
                </div>
                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                  <div className="font-bold text-emerald-300 mt-0.5">{selectedDocPreview.status}</div>
                </div>
              </div>

              <div className="p-3.5 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Underwriting Mandate</span>
                <p className="text-slate-200">{selectedDocPreview.mandateFor}</p>
              </div>

              <div className="p-3.5 bg-[#07261B] rounded-xl border border-[#14533C] space-y-1 font-mono">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">Cryptographic Hash</span>
                <div className="text-white break-all text-[11px]">{selectedDocPreview.documentHash}</div>
                <div className="text-[10px] text-emerald-400">Validated against national agricultural cadastre</div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedDocPreview(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold transition-all border border-[#196349] cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
