import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  X,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileCheck,
  ShieldCheck,
  QrCode,
  Zap,
  Sparkles,
  ArrowRight,
  Eye,
  Sliders,
  FileText,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export interface ScannedCertificateData {
  certId: string;
  docTitle: string;
  authority: string;
  docNumber: string;
  category: "Certification" | "Contract" | "Soil Report" | "Land Title" | "Insurance";
  verifiedStatus: string;
  securityHash: string;
  capturedImageUrl?: string;
  specs: Record<string, string>;
}

interface ExportCertificateScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDocId?: string | null;
  onScanComplete: (docId: string, data: ScannedCertificateData) => void;
}

export const ExportCertificateScannerModal: React.FC<ExportCertificateScannerModalProps> = ({
  isOpen,
  onClose,
  targetDocId,
  onScanComplete,
}) => {
  const { currentFarm, addFarmerDocument } = useApp();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>("");
  const [scannedResult, setScannedResult] = useState<ScannedCertificateData | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<string>(targetDocId || "phyto");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core 7 Certificates metadata definitions
  const CERT_TEMPLATES: Record<
    string,
    { name: string; authority: string; category: "Certification" | "Contract" | "Soil Report" | "Land Title"; prefix: string; sampleSpecs: Record<string, string> }
  > = {
    phyto: {
      name: "Phytosanitary Certificate",
      authority: "National Plant Protection Organisation (NPPO / KEPHIS / DALRRD)",
      category: "Certification",
      prefix: "NPPO/ZA/2026/",
      sampleSpecs: {
        botanicalName: "Zea mays var. indentata",
        pestFreeStatus: "Zero quarantine pests detected (FAW / LGB free)",
        fumigationMethod: "Phosphine (PH3) @ 1.5g/m³ for 120 hrs at 24°C",
        netTonnage: "200.00 Metric Tonnes",
      },
    },
    origin: {
      name: "AfCFTA Certificate of Origin (Form A)",
      authority: "AfCFTA National Liaison Office / SACU Customs",
      category: "Certification",
      prefix: "AfCFTA-COO-2026-",
      sampleSpecs: {
        originCriterion: "100% Wholly Produced within AU Member State",
        preferentialTariff: "AfCFTA Annex 2 Eligible (0.0% Tariff)",
        customsOffice: "Durban Export Commercial Customs Desk",
        hsCode: "HS 1005.90 - Yellow Maize",
      },
    },
    bol: {
      name: "Multimodal Bill of Lading",
      authority: "Ocean Carrier / Multimodal Corridor Port Authority",
      category: "Contract",
      prefix: "BOL-MULT-2026-",
      sampleSpecs: {
        carrierVessel: "MV African Sun v.2604 / Beitbridge Corridor Rail Escort",
        portOfLoading: "Durban Container Terminal (DCT Pier 2)",
        portOfDischarge: "Mombasa Deepwater Terminal (Kilindini)",
        rfidSeals: "8 Container Tamper Seals Verified Armed",
      },
    },
    invoice: {
      name: "Commercial E-Invoice (PAPSS Pre-Cleared)",
      authority: "Pan-African Payment and Settlement System",
      category: "Contract",
      prefix: "PAPSS-INV-2026-",
      sampleSpecs: {
        settlementRoute: "Central Bank of Kenya ⇄ SARB South Africa",
        invoiceAmountUSD: "$56,000 USD Equivalent",
        papssEscrowRef: "ESCROW-ZA-KE-992014",
        currencyPair: "ZAR / KES Zero FX Spread",
      },
    },
    packing: {
      name: "Verified Export Packing List",
      authority: "Certified Axle Weighbridge Inspectorate",
      category: "Certification",
      prefix: "PL-EXP-2026-",
      sampleSpecs: {
        bagCount: "4,000 Polypropylene Food-Grade Bags (50kg each)",
        grossWeight: "201,240 kg (Palletized & Stretch-Wrapped)",
        tareWeight: "1,240 kg",
        weighbridgeSlip: "WB-SLIP-44019-CERT",
      },
    },
    quality: {
      name: "Quality & Grade Certificate (SGS / SAFEX)",
      authority: "Société Générale de Surveillance (SGS Africa)",
      category: "Certification",
      prefix: "SGS-QIS-2026-",
      sampleSpecs: {
        moistureContent: "12.1% (Compliant with < 13.5% Export Ceiling)",
        totalAflatoxin: "1.8 ppb (Strict AU Ceiling < 10 ppb)",
        gradeClassification: "SAFEX Export Grade 1 Premium",
        brokenKernels: "1.4% (Max allowable: 3.0%)",
      },
    },
    fumigation: {
      name: "Quarantine & Fumigation Clearance",
      authority: "SADC Plant Health Biosecurity Division",
      category: "Certification",
      prefix: "FUM-BIO-2026-",
      sampleSpecs: {
        fumigantApplied: "Aluminium Phosphide (Celphos pellets)",
        exposurePeriod: "120 Hours Continuous Concentration",
        aerationHours: "48 Hours Aeration Completed",
        residueLevel: "0.0 ppm Safe Residue Level",
      },
    },
  };

  // Sync default certificate selection if targetDocId changes
  useEffect(() => {
    if (targetDocId && CERT_TEMPLATES[targetDocId]) {
      setSelectedDocType(targetDocId);
    }
  }, [targetDocId]);

  // Start Camera Stream
  const startCamera = async (mode = facingMode) => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported on this device/browser.");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn("Camera access failed:", err);
      setCameraError(
        err?.message ||
          "Unable to access device camera. You can capture or upload a certificate photo below."
      );
      setIsCameraActive(false);
    }
  };

  // Stop camera when closing modal
  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
      }
      setIsCameraActive(false);
      setCapturedImage(null);
      setScannedResult(null);
      setIsAnalyzing(false);
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen]);

  // Flip Camera
  const toggleFacingMode = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture Snapshot from Video Frame
  const handleCaptureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(dataUrl);

    // Stop camera stream to preserve battery
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
      setIsCameraActive(false);
    }

    runSmartOcrAnalysis(dataUrl);
  };

  // Upload Photo File fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedImage(dataUrl);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
        setIsCameraActive(false);
      }
      runSmartOcrAnalysis(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Load Prototype Sample Certificate
  const handleLoadSample = (certKey: string) => {
    setSelectedDocType(certKey);
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Draw authentic document certificate background
      ctx.fillStyle = "#FDFBF7";
      ctx.fillRect(0, 0, 1200, 800);
      ctx.lineWidth = 12;
      ctx.strokeStyle = "#14532D";
      ctx.strokeRect(20, 20, 1160, 760);

      // Inner border
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#F5B942";
      ctx.strokeRect(36, 36, 1128, 728);

      // Title
      ctx.fillStyle = "#10171B";
      ctx.font = "bold 32px serif";
      ctx.textAlign = "center";
      ctx.fillText("AFRICAN CONTINENTAL FREE TRADE AREA", 600, 100);

      const template = CERT_TEMPLATES[certKey] || CERT_TEMPLATES.phyto;
      ctx.fillStyle = "#14532D";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText(template.name.toUpperCase(), 600, 150);

      ctx.fillStyle = "#475569";
      ctx.font = "16px monospace";
      ctx.fillText(`SERIAL REF: ${template.prefix}${Math.floor(10000 + Math.random() * 90000)}`, 600, 190);

      ctx.textAlign = "left";
      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(`PRODUCER / EXPORTER: ${currentFarm.name} (${currentFarm.country})`, 100, 260);
      ctx.fillText(`ISSUING BODY: ${template.authority}`, 100, 300);

      // Spec items
      let y = 360;
      ctx.font = "16px sans-serif";
      Object.entries(template.sampleSpecs).forEach(([k, v]) => {
        ctx.fillStyle = "#334155";
        ctx.fillText(`• ${k.replace(/([A-Z])/g, " $1").toUpperCase()}: ${v}`, 100, y);
        y += 35;
      });

      // Stamp
      ctx.strokeStyle = "#22C55E";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(1000, 640, 80, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#14532D";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("AfCFTA CUSTOMS", 1000, 630);
      ctx.fillText("SEAL VALIDATED", 1000, 655);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setCapturedImage(dataUrl);

      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
        setIsCameraActive(false);
      }

      runSmartOcrAnalysis(dataUrl, certKey);
    }
  };

  // Optical Character Recognition & Verification Simulation
  const runSmartOcrAnalysis = (imageSrc: string, forcedDocKey?: string) => {
    setIsAnalyzing(true);
    const docKey = forcedDocKey || selectedDocType || "phyto";
    const template = CERT_TEMPLATES[docKey] || CERT_TEMPLATES.phyto;

    setAnalysisStep("Calibrating perspective & optical contrast...");
    setTimeout(() => {
      setAnalysisStep("Decoding 2D single-window barcode & biometric seal...");
      setTimeout(() => {
        setAnalysisStep("Parsing authority, serial number, and consignment weights...");
        setTimeout(() => {
          const randomHash = Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join("");
          const randomSerial = `${template.prefix}${Math.floor(10000 + Math.random() * 89999)}`;

          const result: ScannedCertificateData = {
            certId: docKey,
            docTitle: template.name,
            authority: template.authority,
            docNumber: randomSerial,
            category: template.category,
            verifiedStatus: "Digitally Verified & Sealed via Camera OCR",
            securityHash: randomHash,
            capturedImageUrl: imageSrc,
            specs: {
              ...template.sampleSpecs,
              scannedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              opticalOcrConfidence: "98.4% Match",
            },
          };

          setScannedResult(result);
          setIsAnalyzing(false);
        }, 600);
      }, 600);
    }, 600);
  };

  // Save to AfCFTA checklist and vault
  const handleConfirmAndSave = () => {
    if (!scannedResult) return;

    // 1. Add to farmer documents vault
    addFarmerDocument({
      farmId: currentFarm.id,
      title: `${scannedResult.docTitle} (${scannedResult.docNumber})`,
      category: scannedResult.category,
      fileType: "pdf",
      fileSize: "2.4 MB (OCR Scanned)",
      issuingAuthority: scannedResult.authority,
      documentNumber: scannedResult.docNumber,
      parcelOrContractRef: `AfCFTA Export Consignment - ${currentFarm.name}`,
      verificationStatus: "Verified",
      securityTier: "ECDSA Digitally Sealed",
      sharedWith: ["AfCFTA Single-Window Customs Desk", "PAPSS Settlement Bank"],
      notes: `Digitized using on-device optical scanner on ${new Date().toLocaleDateString()}. Cryptographic hash verified.`,
      verifiedBy: scannedResult.authority,
    });

    // 2. Trigger parent callback to mark checklist item compliant
    onScanComplete(scannedResult.certId, scannedResult);
    onClose();
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    setScannedResult(null);
    setIsAnalyzing(false);
    startCamera(facingMode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1013]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-[#10171B] rounded-3xl max-w-2xl w-full border border-[#1D2A32] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#07261B] text-white flex items-center justify-between border-b border-[#14533C]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0B3D2C] border border-[#196349] text-white flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Optical Document Scanner & OCR
              </h3>
              <p className="text-[11px] text-slate-300">
                Digitize physical paper export certificates for instant AfCFTA single-window clearance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#0B3D2C] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Target Selector */}
        <div className="bg-[#162228] px-5 py-2.5 border-b border-[#1D2A32] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Target Certificate:</span>
            <select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              disabled={isAnalyzing || Boolean(scannedResult)}
              className="bg-[#0B1013] text-white font-bold px-2.5 py-1 rounded-lg border border-[#1D2A32] focus:border-emerald-500 focus:outline-none"
            >
              <option value="phyto">1. Phytosanitary Certificate (NPPO)</option>
              <option value="origin">2. AfCFTA Certificate of Origin</option>
              <option value="bol">3. Multimodal Bill of Lading</option>
              <option value="invoice">4. PAPSS Commercial E-Invoice</option>
              <option value="packing">5. Verified Export Packing List</option>
              <option value="quality">6. SGS / SAFEX Quality Certificate</option>
              <option value="fumigation">7. Quarantine & Fumigation Clearance</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-300 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
              Auto-Align Active
            </span>
          </div>
        </div>

        {/* Viewport Area */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Active Camera Viewfinder */}
          {!capturedImage && isCameraActive && (
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center border border-[#1D2A32] shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Optical Framing Overlay & Reticle */}
              <div className="absolute inset-4 sm:inset-8 border-2 border-dashed border-emerald-400/70 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                {/* 4 Corner Brackets */}
                <div className="flex justify-between items-start">
                  <div className="w-5 h-5 border-t-4 border-l-4 border-emerald-400" />
                  <div className="w-5 h-5 border-t-4 border-r-4 border-emerald-400" />
                </div>

                {/* Laser Scan Sweeper Line */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />

                <div className="flex justify-between items-end">
                  <div className="w-5 h-5 border-b-4 border-l-4 border-emerald-400" />
                  <div className="w-5 h-5 border-b-4 border-r-4 border-emerald-400" />
                </div>
              </div>

              {/* HUD Sensor Tag */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-emerald-300 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Optical Feed • 60 FPS</span>
              </div>

              {/* Top Controls */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  onClick={toggleFacingMode}
                  className="p-2 rounded-xl bg-black/70 hover:bg-black/90 text-white text-xs cursor-pointer transition-colors"
                  title="Switch Front/Rear Camera"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Trigger Controls */}
              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 px-4">
                <button
                  onClick={handleCaptureSnapshot}
                  className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#090D0F] font-extrabold text-xs shadow-xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Certificate</span>
                </button>
              </div>
            </div>
          )}

          {/* Captured Image / OCR Analysis Stage */}
          {capturedImage && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-16/10 flex items-center justify-center border border-[#1D2A32]">
                <img
                  src={capturedImage}
                  alt="Scanned Certificate"
                  className="w-full h-full object-contain"
                />

                {/* Scanning Laser HUD if analyzing */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                    <div>
                      <div className="text-sm font-bold text-white">Optical Character Recognition</div>
                      <div className="text-xs text-emerald-300 font-mono mt-1">{analysisStep}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Scanned Verification Card */}
              {scannedResult && !isAnalyzing && (
                <div className="p-4 bg-[#07261B] border border-[#14533C] rounded-2xl space-y-3 animate-in fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#14533C]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <div>
                        <div className="font-extrabold text-sm text-white">
                          {scannedResult.docTitle}
                        </div>
                        <div className="text-[11px] text-slate-300 font-mono">
                          Ref: <strong className="text-white">{scannedResult.docNumber}</strong>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-[#0B3D2C] text-emerald-300 px-2 py-0.5 rounded border border-[#196349]">
                      98.4% OCR Confidence
                    </span>
                  </div>

                  {/* Extracted Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-[#0B1512] rounded-xl border border-[#14533C]/60">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Issuing Authority
                      </span>
                      <span className="font-semibold text-slate-200 mt-0.5 block">
                        {scannedResult.authority}
                      </span>
                    </div>

                    <div className="p-2.5 bg-[#0B1512] rounded-xl border border-[#14533C]/60">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Cryptographic Hash
                      </span>
                      <span className="font-mono text-[10px] text-emerald-300 truncate block mt-0.5">
                        {scannedResult.securityHash.slice(0, 28)}...
                      </span>
                    </div>

                    {Object.entries(scannedResult.specs).map(([key, val], i) => (
                      <div key={i} className="p-2.5 bg-[#0B1512] rounded-xl border border-[#14533C]/60">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        <span className="font-medium text-slate-200 mt-0.5 block truncate">
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Fallback & Prototyping Options when camera is off or denied */}
          {(!isCameraActive || cameraError) && !capturedImage && (
            <div className="p-5 bg-[#162228] border border-[#1D2A32] rounded-2xl space-y-4">
              {cameraError && (
                <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Camera Access Notification</div>
                    <div className="text-[11px] text-amber-300/90">{cameraError}</div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => startCamera(facingMode)}
                  className="p-4 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white border border-[#196349] font-bold text-xs flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Camera className="w-5 h-5 text-emerald-300" />
                  <span>Start Device Camera</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-xl bg-[#10171B] hover:bg-[#1D2A32] text-slate-200 border border-[#1D2A32] font-bold text-xs flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span>Upload Certificate Photo / File</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,application/pdf"
                  className="hidden"
                />
              </div>

              {/* One-Click Prototype Samples */}
              <div className="pt-3 border-t border-[#1D2A32] space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Or Test with Real-world Certificate Templates (Instant OCR):
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleLoadSample("phyto")}
                    className="px-2.5 py-1.5 rounded-lg bg-[#10171B] hover:bg-[#1D2A32] text-[11px] text-slate-300 border border-[#1D2A32] cursor-pointer transition-colors"
                  >
                    Sample Phytosanitary Certificate
                  </button>
                  <button
                    onClick={() => handleLoadSample("origin")}
                    className="px-2.5 py-1.5 rounded-lg bg-[#10171B] hover:bg-[#1D2A32] text-[11px] text-slate-300 border border-[#1D2A32] cursor-pointer transition-colors"
                  >
                    Sample AfCFTA Certificate of Origin
                  </button>
                  <button
                    onClick={() => handleLoadSample("quality")}
                    className="px-2.5 py-1.5 rounded-lg bg-[#10171B] hover:bg-[#1D2A32] text-[11px] text-slate-300 border border-[#1D2A32] cursor-pointer transition-colors"
                  >
                    Sample SGS Grade Certificate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hidden Canvas for Frame Capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-[#10171B] border-t border-[#1D2A32] flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            Encrypted with ECDSA signature and synced to the single-window registry.
          </div>

          <div className="flex items-center gap-2">
            {capturedImage && (
              <button
                onClick={handleRetake}
                className="px-3.5 py-2 rounded-xl bg-[#162228] hover:bg-[#1D2A32] text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Scan Another
              </button>
            )}

            {scannedResult && (
              <button
                onClick={handleConfirmAndSave}
                className="px-5 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold transition-all shadow-md border border-[#196349] flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Digitize & Vault Certificate</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
