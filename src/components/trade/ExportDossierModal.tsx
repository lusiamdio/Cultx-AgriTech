import React, { useState, useEffect, useRef } from "react";
import {
  X,
  FileCheck,
  Download,
  Printer,
  ShieldCheck,
  QrCode,
  Building,
  CheckCircle2,
  ExternalLink,
  Award,
  Truck,
  Layers,
  Copy,
  Check,
  FileText,
  Lock,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export interface ExportDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDocId?: string | null;
}

const DOC_INDEX_MAP: Record<string, number> = {
  phyto: 0,
  origin: 1,
  bol: 2,
  invoice: 3,
  papss_inv: 3,
  packing: 4,
  quality: 5,
  fumigation: 6,
};

export const ExportDossierModal: React.FC<ExportDossierModalProps> = ({
  isOpen,
  onClose,
  selectedDocId,
}) => {
  const { currentFarm, setCurrentView } = useApp();
  const [activeDocTab, setActiveDocTab] = useState<number>(0);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const tabListRef = useRef<HTMLDivElement>(null);

  // Sync tab with selectedDocId whenever modal opens or docId changes
  useEffect(() => {
    if (selectedDocId && DOC_INDEX_MAP[selectedDocId] !== undefined) {
      setActiveDocTab(DOC_INDEX_MAP[selectedDocId]);
    }
  }, [selectedDocId, isOpen]);

  // Scroll active tab into view
  useEffect(() => {
    if (tabListRef.current) {
      const activeEl = tabListRef.current.children[activeDocTab] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [activeDocTab]);

  if (!isOpen) return null;

  const documents = [
    {
      id: "phyto",
      title: "1. Phytosanitary Certificate",
      shortLabel: "1. Phyto SPS",
      authority: "National Plant Protection Organisation (NPPO)",
      docNumber: "NPPO/ZA/2026/04192",
      status: "Verified & Inspected",
      legalClause: "AfCFTA Annex 7 on Sanitary & Phytosanitary Measures (SPS)",
      sha256Hash: "8f4b2e91a07d391c49e257b60c91837d9910c2834b7190d65a881923719cf012",
      content: {
        botanicalName: "Zea mays var. indentata (Yellow Maize)",
        declaration:
          "Inspected and confirmed free from quarantine pests (Spodoptera frugiperda and Prostephanus truncatus) in accordance with Kenyan importing regulations.",
        treatment: "Phosphine (PH3) Fumigation @ 1.5g/m³ for 120 hours at 24°C",
        consignmentWeight: "200.00 Metric Tonnes (4,000 x 50kg bags)",
        pointOfEntry: "Port of Mombasa, Kenya / Malaba Border Post",
      },
    },
    {
      id: "origin",
      title: "2. AfCFTA Certificate of Origin",
      shortLabel: "2. Origin COO",
      authority: "AfCFTA Secretariat / SACU Customs Directorate",
      docNumber: "AfCFTA-COO-2026-98124",
      status: "Preferential Tariff Qualified (0% Duty)",
      legalClause: "AfCFTA Protocol on Trade in Goods (Annex 2 Rules of Origin)",
      sha256Hash: "3a9c7b12d5e480f21489acbb094e11247da883912048f0291e774910248cc901",
      content: {
        exporter: `${currentFarm.name}, Free State, South Africa`,
        importer: "Kenya National Cereals and Produce Board (NCPB), Nairobi",
        originCriterion: "100% Wholly Produced in AU Member State (Rule of Origin Annex 2)",
        hsCode: "HS 1005.90 - Maize (Corn), Other Than Seed",
        customsTariffTreatment: "Preferential AfCFTA Regime - 0.0% Import Tariff (Regular MFN: 25.0%)",
        papssInvoiceRef: "PAPSS-INV-ZA-KE-2026-7789",
      },
    },
    {
      id: "bol",
      title: "3. Multimodal Bill of Lading",
      shortLabel: "3. Bill of Lading",
      authority: "Bolloré / CMA CGM African Logistics Corridor",
      docNumber: "BOL-MULT-2026-8831",
      status: "Telematic Escort Active",
      legalClause: "Intermodal Corridors & Single Electronic Waybill Standard",
      sha256Hash: "6c2b19f048d281a94029eb1047fa9938201948ba291048e918239014820bc019",
      content: {
        carrier: "Trans-East Multimodal Rail & Freight",
        vesselVoyage: "MV African Sun v.2604 / Beitbridge-Malaba Rail Escort",
        portOfLoading: "Durban Container Terminal, South Africa",
        portOfDischarge: "Inland Container Depot Nairobi (ICDN), Kenya",
        containers: "8 x 40ft High-Cube Sealed Grain Containers (TGHU-99214 to TGHU-99221)",
        tamperSealStatus: "Digital RFID Tamper Seals Armed (0 Breaches)",
      },
    },
    {
      id: "invoice",
      title: "4. Commercial E-Invoice (PAPSS)",
      shortLabel: "4. PAPSS Invoice",
      authority: "Pan-African Payment and Settlement System",
      docNumber: "PAPSS-TX-992104-EINV",
      status: "Escrow Deposited in KES",
      legalClause: "Afreximbank PAPSS Multilateral Settlement Framework",
      sha256Hash: "4f901824abce891047da98231049281734910482039481902847190283471029",
      content: {
        settlementRoute: "Central Bank of Kenya (CBK) ⇄ South African Reserve Bank (SARB)",
        contractValueLocal: "KES 41,180,000 Locked in Escrow",
        disbursementValueLocal: "R5,420,000 ZAR Auto-Credit on Delivery",
        fxIntermediation: "Zero USD conversion required (Saved $2,840 in correspondent banking fees)",
        taxExemption: "AfCFTA Cross-Border Trade Exemption Article 13",
      },
    },
    {
      id: "packing",
      title: "5. Export Packing List",
      shortLabel: "5. Packing List",
      authority: "Verified Weighbridge & Logistics Inspectorate",
      docNumber: "PL-EXP-2026-5542",
      status: "Axle Weighbridge Certified",
      legalClause: "AfCFTA Harmonized Weighbridge Standards & Axle Load Limits",
      sha256Hash: "1e892049ba83910248abce910283948102938471029384719028347102938471",
      content: {
        packaging: "Heavy-duty UV-stabilized food grade Polypropylene Bags",
        bagCount: "4,000 Bags @ 50.0 kg Net each",
        grossWeight: "201,240 kg (Palletized & stretch wrapped)",
        tareWeight: "1,240 kg",
        markings: "CULTX / AFRIGRAIN EXPORT LOT #ZA-2026-08 - FOOD AID & COMMERCIAL RESERVE",
      },
    },
    {
      id: "quality",
      title: "6. SGS / SAFEX Quality & Grade Certificate",
      shortLabel: "6. SGS Quality",
      authority: "Société Générale de Surveillance (SGS Africa)",
      docNumber: "SGS-QIS-2026-1189",
      status: "Grade 1 Export Premium",
      legalClause: "ISO/IEC 17025 Accredited Laboratory Grain Inspection",
      sha256Hash: "9028347102938471029384719028347102938471029384719028347102938471",
      content: {
        moistureContent: "12.1% (Standard Export Ceiling: 13.5%)",
        totalAflatoxin: "1.8 ppb (Strict AU Ceiling: < 10 ppb)",
        brokenKernels: "1.4% (Max Allowable: 3.0%)",
        foreignMatter: "0.2% (Max Allowable: 1.0%)",
        proteinDryBasis: "9.2% (Optimal Feed & Milling Grade)",
      },
    },
    {
      id: "fumigation",
      title: "7. Quarantine & Fumigation Clearance",
      shortLabel: "7. Fumigation",
      authority: "SADC Plant Health Biosecurity Division",
      docNumber: "FUM-BIO-2026-3391",
      status: "Residue Level 0.0 ppm (Safe)",
      legalClause: "International Plant Protection Convention (IPPC) ISPM 15",
      sha256Hash: "5b7190d65a881923719cf0128f4b2e91a07d391c49e257b60c91837d9910c283",
      content: {
        fumigantGas: "Aluminium Phosphide (Celphos pellets generating Phosphine gas)",
        gasConcentrationRetained: "450 ppm for 120 hours minimum",
        degassingVentilationTime: "48 hours aeration completed",
        postTreatmentLiveInsects: "NIL (Zero live weevils or borer insects)",
        safetyOfficerSignOff: "Dr. K. Naidoo, Reg. Biosecurity Inspector #441",
      },
    },
  ];

  const currentDoc = documents[activeDocTab] || documents[0];

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(currentDoc.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2500);
  };

  const handleDownloadSingleCert = (doc: typeof documents[0]) => {
    const certText = `================================================================================
AFRICAN CONTINENTAL FREE TRADE AREA (AfCFTA)
OFFICIAL SINGLE-WINDOW ELECTRONIC TRADE DOSSIER
================================================================================

CERTIFICATE: ${doc.title}
DOCUMENT REF: ${doc.docNumber}
ISSUING AUTHORITY: ${doc.authority}
STATUS: ${doc.status}
LEGAL BASIS: ${doc.legalClause}

PRODUCER / EXPORTER: ${currentFarm.name} (${currentFarm.ownerName})
ORIGIN JURISDICTION: ${currentFarm.region}, ${currentFarm.country}
DATE OF ISSUANCE: October 16, 2026
VALIDITY PERIOD: 2026/2027 Export Season

VERIFIED DATA SPECIFICATIONS:
${Object.entries(doc.content)
  .map(([k, v]) => `* ${k.replace(/([A-Z])/g, " $1").toUpperCase()}: ${v}`)
  .join("\n")}

DIGITAL SECURITY & AUTHENTICATION:
* Authentication Protocol: ECDSA P-256 Public Key Verified
* Ledger Nonce: 8841029
* SHA-256 Cryptographic Hash: ${doc.sha256Hash}
* Single-Window QR Attestation: Validated across SACU, EAC, COMESA, SADC customs
================================================================================`;

    const blob = new Blob([certText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.title.replace(/[^a-zA-Z0-9]/g, "_")}_AfCFTA.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(`Downloaded: ${doc.title}`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDownloadAllDocs = () => {
    const fullPacket = `================================================================================
AfCFTA CONSOLIDATED 7-DOCUMENT HARMONIZED TRADE DOSSIER
Applicant Farm: ${currentFarm.name} (${currentFarm.ownerName})
Territory: ${currentFarm.region}, ${currentFarm.country}
Harmonized Tariff Treaty: AfCFTA Trade in Goods Protocol
PAPSS Transaction Ref: PAPSS-TX-992104-EINV
================================================================================

${documents
  .map(
    (d, i) => `
--------------------------------------------------------------------------------
DOCUMENT ${i + 1}: ${d.title}
Document Ref: ${d.docNumber}
Issuing Authority: ${d.authority}
Status: ${d.status}
Legal Framework: ${d.legalClause}
SHA-256: ${d.sha256Hash}

Details:
${Object.entries(d.content)
  .map(([k, v]) => `  - ${k.replace(/([A-Z])/g, " $1")}: ${v}`)
  .join("\n")}
`
  )
  .join("\n")}
================================================================================`;

    const blob = new Blob([fullPacket], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AfCFTA_7_Document_Harmonized_Dossier_${currentFarm.name.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess("Downloaded complete 7-document dossier package");
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleNavigateToVault = () => {
    onClose();
    setCurrentView("farms");
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1013]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-[#10171B] rounded-3xl max-w-4xl w-full border border-[#1D2A32] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#07261B] text-white flex items-center justify-between border-b border-[#14533C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B3D2C] border border-[#196349] text-white flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  AfCFTA 7-Document Harmonized Trade Dossier
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B3D2C] text-emerald-300 border border-[#196349]">
                  PAPSS & Single-Window Compliant
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Official cross-border legal, customs, and phytosanitary packet for {currentFarm.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#0B3D2C] text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Document Notification Banner */}
        <div className="bg-[#0B1512] px-5 py-2.5 border-b border-[#14533C]/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-slate-400">Inspecting Document:</span>
            <span className="font-bold text-white">{currentDoc.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-300 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
              Doc {activeDocTab + 1} of 7
            </span>
            <button
              onClick={handleNavigateToVault}
              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View in Document Vault</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 7 Document Switcher Tabs */}
        <div
          ref={tabListRef}
          className="bg-[#162228] p-2 border-b border-[#1D2A32] flex items-center gap-1.5 overflow-x-auto scrollbar-none"
        >
          {documents.map((doc, idx) => (
            <button
              key={doc.id}
              onClick={() => setActiveDocTab(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeDocTab === idx
                  ? "bg-[#0B3D2C] text-white shadow-sm border border-[#196349] font-bold"
                  : "text-slate-400 hover:text-white hover:bg-[#1D2A32]"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono ${
                  activeDocTab === idx
                    ? "bg-emerald-400 text-[#090D0F] font-bold"
                    : "bg-[#0E161C] text-slate-400"
                }`}
              >
                {idx + 1}
              </span>
              <span>{doc.shortLabel}</span>
            </button>
          ))}
        </div>

        {/* Active Document Viewer Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {downloadSuccess && (
            <div className="p-3 bg-[#07261B] text-emerald-200 border border-[#14533C] rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          <div className="p-5 sm:p-6 bg-[#162228] rounded-2xl border-2 border-dashed border-[#1D2A32] relative space-y-4 shadow-inner">
            {/* Official Watermark & Stamp */}
            <div className="absolute top-5 right-5 flex flex-col items-center opacity-90 pointer-events-none">
              <div className="w-20 h-20 rounded-full border-2 border-emerald-500 flex flex-col items-center justify-center text-emerald-300 text-[9px] font-mono uppercase font-bold text-center p-1 transform rotate-12 bg-[#07261B]/70">
                <span>AfCFTA</span>
                <span className="text-[8px] font-extrabold text-white">VERIFIED</span>
                <span>ORIGIN SACU</span>
              </div>
              <div className="text-[9px] font-mono text-slate-500 mt-1">
                Hash: {currentDoc.sha256Hash.slice(0, 10)}...
              </div>
            </div>

            {/* Document Header */}
            <div className="border-b border-[#1D2A32] pb-4 pr-24 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentDoc.authority}</span>
              </div>
              <h4 className="text-lg sm:text-xl font-extrabold text-white">
                {currentDoc.title}
              </h4>
              <p className="text-[11px] text-slate-400">
                Legal Basis: <strong className="text-slate-300">{currentDoc.legalClause}</strong>
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
                <span>
                  Document Ref: <strong className="text-white">{currentDoc.docNumber}</strong>
                </span>
                <span>•</span>
                <span className="text-emerald-300 font-bold bg-[#07261B] border border-[#14533C] px-2 py-0.5 rounded">
                  {currentDoc.status}
                </span>
              </div>
            </div>

            {/* Document Content Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              {Object.entries(currentDoc.content).map(([key, value], idx) => (
                <div key={idx} className="p-3.5 bg-[#10171B] rounded-xl border border-[#1D2A32] space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </div>
                  <div className="font-semibold text-slate-200 leading-relaxed">
                    {String(value)}
                  </div>
                </div>
              ))}
            </div>

            {/* Verification Signatures, QR & Cryptographic Ledger */}
            <div className="pt-4 border-t border-[#1D2A32] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-300 p-1 flex items-center justify-center shadow-xs shrink-0">
                  <QrCode className="w-10 h-10 text-slate-900" />
                </div>
                <div className="text-xs space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>Single-Window Digital Signature</span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-[#07261B] px-1.5 py-0.2 rounded border border-[#14533C]">
                      ECDSA Validated
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 flex-wrap">
                    <span>SHA-256: {currentDoc.sha256Hash.slice(0, 24)}...</span>
                    <button
                      onClick={handleCopyHash}
                      className="text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-0.5 cursor-pointer ml-1"
                    >
                      {copiedHash ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Hash</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right text-xs">
                  <div className="text-slate-400 font-medium">Certified Officer</div>
                  <div className="font-bold text-emerald-300 font-serif italic text-sm">
                    Dr. K. Naidoo (Lead Inspector)
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadSingleCert(currentDoc)}
                  className="px-3 py-1.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-[#196349]"
                  title="Download this specific certificate"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Save Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 bg-[#10171B] border-t border-[#1D2A32] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Export packet accepted at all 54 African Union border posts under AfCFTA protocols.
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl border border-[#1D2A32] bg-[#162228] hover:bg-[#1D2A32] text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Print</span>
            </button>

            <button
              onClick={handleNavigateToVault}
              className="px-3.5 py-2 rounded-xl border border-[#1D2A32] bg-[#162228] hover:bg-[#1D2A32] text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Document Vault</span>
            </button>

            <button
              onClick={handleDownloadAllDocs}
              className="px-4 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md border border-[#196349] min-h-[40px]"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Download Signed Dossier (.TXT / PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
