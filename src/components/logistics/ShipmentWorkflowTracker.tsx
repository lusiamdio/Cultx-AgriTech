import React, { useState } from "react";
import {
  GitCommit,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  User,
  Truck,
  Building,
  FileText,
  DollarSign,
  Thermometer,
  QrCode,
  MapPin,
  FileCheck,
  AlertTriangle,
  Download,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  Search,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export interface ShipmentStageData {
  step: number;
  stageCode: string;
  title: string;
  description: string;
  accountableParty: string;
  timestamp: string;
  location: string;
  status: "Completed" | "In Progress" | "Pending Action" | "Upcoming";
  evidenceData: Record<string, string>;
  documents: string[];
}

export interface TrackableShipment {
  id: string;
  commodity: string;
  volumeTonnes: number;
  shipper: string;
  carrier: string;
  driverName: string;
  vehiclePlate: string;
  origin: string;
  destination: string;
  temperatureControlled: boolean;
  currentStageIndex: number; // 0 to 7 (corresponds to steps 1-8)
  stages: ShipmentStageData[];
}

export const ShipmentWorkflowTracker: React.FC = () => {
  const { selectedCountry } = useApp();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [shipments, setShipments] = useState<TrackableShipment[]>([
    {
      id: "SHP-2026-904",
      commodity: "Export Grade Fermented Cocoa Beans",
      volumeTonnes: 32,
      shipper: "Ashanti Cocoa Farming Cooperative",
      carrier: "Gold Coast Inter-Modal Logistics",
      driverName: "Kwame Asante (License #GH-DRV-8812)",
      vehiclePlate: "GW-4412-24 (Tri-Axle Container)",
      origin: "Kumasi Aggregation Silo, Ghana",
      destination: "Tema Port Container Berth 2, Ghana",
      temperatureControlled: false,
      currentStageIndex: 4, // Step 05: Transit Monitoring
      stages: [
        {
          step: 1,
          stageCode: "01",
          title: "Shipment Request Created",
          description: "Cooperative entered cargo requisition for 32 MT cocoa destined for Barry Callebaut export terminal.",
          accountableParty: "Ashanti Co-op Dispatch Manager",
          timestamp: "2026-10-18 07:15 UTC",
          location: "Kumasi, Ghana",
          status: "Completed",
          evidenceData: {
            "Consignment Order": "#ORD-COCOA-9912",
            "Moisture Content Baseline": "7.2% (Dry Export Ready)",
            "Packaging": "500 Jute Bags (64kg each)",
          },
          documents: ["Shipper Commercial Invoice", "AfCFTA Certificate of Origin Application"],
        },
        {
          step: 2,
          stageCode: "02",
          title: "Quote & Transporter Matching",
          description: "Automated rate pricing engine matched load with verified carriers; Gold Coast Inter-Modal selected at $1,580 USD.",
          accountableParty: "CULTx Marketplace Matcher",
          timestamp: "2026-10-18 09:30 UTC",
          location: "Regional Corridor Matching Node",
          status: "Completed",
          evidenceData: {
            "Indicative Tariff": "$1,580 USD ($49.38/MT)",
            "Carrier Reliability Score": "4.85 / 5.0 (99% SLA)",
            "Escrow Deposit Funded": "$1,580 in Ecobank Escrow",
          },
          documents: ["Tariff Schedule #TS-904", "Escrow Proof of Deposit"],
        },
        {
          step: 3,
          stageCode: "03",
          title: "Booking & Vehicle Dispatch",
          description: "Carrier confirmed vehicle assignment; driver Kwame Asante dispatched with Volvo FH16 truck and electronic pickup QR key.",
          accountableParty: "Gold Coast Logistics Fleet Controller",
          timestamp: "2026-10-18 11:00 UTC",
          location: "Kumasi Fleet Depot",
          status: "Completed",
          evidenceData: {
            "Assigned Vehicle": "GW-4412-24",
            "Driver Phone": "+233 24 555 7890",
            "Scheduled Pickup Window": "2026-10-18 13:00 - 15:00 UTC",
          },
          documents: ["Electronic Transport Agreement #CTR-904", "Driver Authorization Token"],
        },
        {
          step: 4,
          stageCode: "04",
          title: "Collection & Cargo Verification",
          description: "Weighbridge gross tally verified (32.14 MT net); moisture re-tested at 7.1%; tamper-evident electronic seals #SL-8841/42 applied.",
          accountableParty: "Kumasi Silo Officer & Transporter Driver",
          timestamp: "2026-10-18 14:22 UTC",
          location: "Kumasi Warehouse Scale #02",
          status: "Completed",
          evidenceData: {
            "Gross Weight": "48,220 kg",
            "Tare Weight": "16,080 kg",
            "Net Cocoa Cargo": "32,140 kg (+0.4% tolerance)",
            "Security Seal Number": "E-SEAL-8841-RFID",
          },
          documents: ["Weighbridge Certificate #WB-8812", "Collection Manifest & Photo Audit"],
        },
        {
          step: 5,
          stageCode: "05",
          title: "Transit Monitoring & Telematics",
          description: "Continuous GPS route monitoring on N6 highway; speed normal (58 km/h); zero geofence deviations; humidity sensors normal.",
          accountableParty: "IoT Telematics Control Tower",
          timestamp: "2026-10-19 03:45 UTC (Live Active)",
          location: "N6 Highway (En route to Accra/Tema, km 184)",
          status: "In Progress",
          evidenceData: {
            "Current Coordinates": "5.9182° N, 0.4281° W",
            "ETA to Tema Terminal": "2.5 Hours Remaining",
            "Internal Humidity": "64% (Optimal Safe Grain Window)",
            "Geofence Status": "On Prescribed Highway Path",
          },
          documents: ["Live Telematics Telemetry Stream", "En-Route Highway Waybill"],
        },
        {
          step: 6,
          stageCode: "06",
          title: "Border or Warehouse Processing",
          description: "Pre-arrival electronic single-window manifest submitted to Ghana Revenue Authority (GRA) customs and export phytosanitary desk.",
          accountableParty: "Tema Port Customs Authority",
          timestamp: "Estimated 2026-10-19 06:15 UTC",
          location: "Tema Port Gate 1 Inland Clearance Depot",
          status: "Upcoming",
          evidenceData: {
            "Customs Status": "Pre-Lodged (Green Channel)",
            "SPS Certificate": "e-Phyto Clean Pass #GH-SPS-2026-904",
          },
          documents: ["GRA Single-Window Customs Form", "Phytosanitary Health Pass"],
        },
        {
          step: 7,
          stageCode: "07",
          title: "Delivery & Consignee Acceptance",
          description: "Consignee terminal checks tare weight, confirms seal integrity, conducts aflatoxin/moisture test, and signs digital Proof of Delivery (POD).",
          accountableParty: "Barry Callebaut Receiving Officer",
          timestamp: "Scheduled 2026-10-19 07:30 UTC",
          location: "Tema Port Pier 2 Offload Berth",
          status: "Upcoming",
          evidenceData: {
            "Acceptance Criteria": "Moisture < 7.5%, Aflatoxin < 4 ppb",
            "Digital Signature": "Pending Receiver E-Sign",
          },
          documents: ["Digital Proof of Delivery (POD) Template"],
        },
        {
          step: 8,
          stageCode: "08",
          title: "Settlement & Performance Scoring",
          description: "Escrow funds ($1,580) disbursed automatically to carrier via PAPSS/local bank switch; demurrage cleared; carrier scored 5 stars.",
          accountableParty: "Banking Partner Escrow Engine",
          timestamp: "Triggered upon POD confirmation",
          location: "Inter-Bank Settlement Gateway",
          status: "Upcoming",
          evidenceData: {
            "Escrow Release Amount": "$1,106 USD (70% final balance)",
            "Carrier Scoring": "Prompt Transit & Pristine Cargo Condition",
          },
          documents: ["Bank Settlement Voucher", "Carrier Performance Scorecard"],
        },
      ],
    },
    {
      id: "SHP-2026-781",
      commodity: "Commercial Non-GMO Soybeans",
      volumeTonnes: 540,
      shipper: "Zambia Agricultural Outgrower Union",
      carrier: "Lobito Atlantic Railway (LAR)",
      driverName: "Engineer M. Da Silva & Crew",
      vehiclePlate: "LAR Unit Train #TRN-401 (18 Wagons)",
      origin: "Ndola Grain Terminal, Zambia",
      destination: "Port of Lobito Deep-Sea Quay, Angola",
      temperatureControlled: false,
      currentStageIndex: 5, // Step 06: Border or Warehouse Processing (Luau OSBP)
      stages: [
        {
          step: 1,
          stageCode: "01",
          title: "Shipment Request Created",
          description: "Bulk export order for 540 MT soybeans destined for European processing mills via Atlantic gateway.",
          accountableParty: "Zambia Outgrowers Grain Desk",
          timestamp: "2026-10-16 08:00 UTC",
          location: "Ndola, Zambia",
          status: "Completed",
          evidenceData: { "Payload": "540 MT Cleaned Soybeans", "Grade": "Export Grade 1" },
          documents: ["Export Invoice #EXP-ZAM-881"],
        },
        {
          step: 2,
          stageCode: "02",
          title: "Quote & Transporter Matching",
          description: "Lobito Rail Express matched at $34,560 USD ($64/MT vs $118/MT road alternative).",
          accountableParty: "Lobito Freight Brokerage Desk",
          timestamp: "2026-10-16 10:30 UTC",
          location: "Corridor Operations Terminal",
          status: "Completed",
          evidenceData: { "Agreed Tariff": "$34,560 USD ($64/MT)" },
          documents: ["Rail Freight Charter Agreement"],
        },
        {
          step: 3,
          stageCode: "03",
          title: "Booking & Rail Dispatch",
          description: "18 grain hopper wagons marshaled at Ndola railhead; brake inspection passed.",
          accountableParty: "LAR Yardmaster Ndola",
          timestamp: "2026-10-16 16:00 UTC",
          location: "Ndola Freight Yard",
          status: "Completed",
          evidenceData: { "Train Number": "LAR-401", "Wagons": "18 Hopper Cars" },
          documents: ["Train Dispatch Consist"],
        },
        {
          step: 4,
          stageCode: "04",
          title: "Collection & Cargo Verification",
          description: "Automated silo gravity chutes filled all 18 wagons; net mass 541.2 MT certified.",
          accountableParty: "Ndola Terminal Scale Master",
          timestamp: "2026-10-17 06:40 UTC",
          location: "Ndola Silo Bay 4",
          status: "Completed",
          evidenceData: { "Total Net Mass": "541,200 kg", "RFID Wagon Seals": "Affixed" },
          documents: ["Silo Scale Out-turn Certificate"],
        },
        {
          step: 5,
          stageCode: "05",
          title: "Transit Monitoring & Rail Telemetry",
          description: "CFB Benguela railway telemetry logged continuous 48 km/h transit across Katanga corridor.",
          accountableParty: "LAR Central Dispatcher",
          timestamp: "2026-10-18 12:00 UTC",
          location: "Kolwezi - Dilolo Rail Corridor",
          status: "Completed",
          evidenceData: { "Rail Distance Covered": "740 km", "Mechanical Status": "Nominal" },
          documents: ["Rail Transit Telematics Log"],
        },
        {
          step: 6,
          stageCode: "06",
          title: "Border Processing (Luau OSBP)",
          description: "One-Stop Border Post between DRC and Angola; joint electronic clearance in progress.",
          accountableParty: "Luau One-Stop Border Customs Post",
          timestamp: "2026-10-19 02:10 UTC (Active)",
          location: "Luau OSBP (Angola / DRC Border)",
          status: "In Progress",
          evidenceData: { "Border Wait Time": "1.8 Hours (Target < 3h)", "AfCFTA Duty": "0% Preferential" },
          documents: ["AfCFTA Preferential Customs Stamp", "SPS International Phytosanitary Permit"],
        },
        {
          step: 7,
          stageCode: "07",
          title: "Delivery & Port Acceptance",
          description: "Bulk hopper discharge onto conveyor belts directly into Port of Lobito Atlantic silo berths.",
          accountableParty: "Port of Lobito Bulk Terminal Stevedores",
          timestamp: "Scheduled 2026-10-20 04:00 UTC",
          location: "Port of Lobito Quay 3",
          status: "Upcoming",
          evidenceData: { "Berth Number": "Deep-Sea Berth #03" },
          documents: ["Port Landing Receipt"],
        },
        {
          step: 8,
          stageCode: "08",
          title: "Settlement & Performance Scoring",
          description: "Final multimodal settlement cleared via Standard Bank / Angola National Bank RTGS.",
          accountableParty: "Treasury Clearing Node",
          timestamp: "Scheduled post-ship loading",
          location: "Financial Switch",
          status: "Upcoming",
          evidenceData: { "Settlement Status": "Pending Port POD" },
          documents: ["Multimodal Clearing Voucher"],
        },
      ],
    },
  ]);

  const [selectedShipmentId, setSelectedShipmentId] = useState("SHP-2026-904");
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(4);

  const activeShipment = shipments.find((s) => s.id === selectedShipmentId) || shipments[0];
  const activeStage = activeShipment.stages[selectedStepIndex] || activeShipment.stages[0];

  const handleAdvanceStage = () => {
    if (activeShipment.currentStageIndex < 7) {
      const nextIdx = activeShipment.currentStageIndex + 1;
      setShipments((prev) =>
        prev.map((s) => {
          if (s.id === activeShipment.id) {
            const updatedStages = s.stages.map((stg, i) => {
              if (i === activeShipment.currentStageIndex) return { ...stg, status: "Completed" as const };
              if (i === nextIdx) return { ...stg, status: "In Progress" as const };
              return stg;
            });
            return { ...s, currentStageIndex: nextIdx, stages: updatedStages };
          }
          return s;
        })
      );
      setSelectedStepIndex(nextIdx);
      setToastMsg(`Shipment ${activeShipment.id} progressed to Stage 0${nextIdx + 1}: ${activeShipment.stages[nextIdx].title}`);
      setTimeout(() => setToastMsg(null), 3500);
    }
  };

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
      <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-[#07261B] px-2.5 py-0.5 rounded border border-[#14533C] flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5" />
              <span>Traceable Shipment Lifecycle</span>
            </span>
            <span className="text-xs font-mono font-bold text-cyan-300 bg-[#082835] px-2 py-0.5 rounded border border-[#10485E]">
              8 Verified Operational Stages
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">
            End-to-End Shipment Workflow & Event History
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            From initial cargo requisition to carrier appointment, weighbridge verification, border clearance, digital proof of delivery, and automated escrow settlement.
          </p>
        </div>

        {/* Consignment Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Select Consignment:</span>
          <select
            value={selectedShipmentId}
            onChange={(e) => {
              setSelectedShipmentId(e.target.value);
              const target = shipments.find((s) => s.id === e.target.value);
              if (target) setSelectedStepIndex(target.currentStageIndex);
            }}
            className="px-3.5 py-2 rounded-xl bg-[#162228] border border-[#1D2A32] text-white font-mono text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {shipments.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#10171B] text-white">
                {s.id} • {s.commodity} ({s.volumeTonnes} MT)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Shipment Snapshot Banner */}
      <div className="p-4 bg-[#162228] rounded-2xl border border-[#1D2A32] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Commodity & Volume</span>
          <div className="text-white font-bold mt-0.5">{activeShipment.commodity}</div>
          <div className="text-emerald-400 font-mono text-[11px] font-bold">{activeShipment.volumeTonnes} Metric Tonnes</div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Appointed Carrier & Vehicle</span>
          <div className="text-white font-bold mt-0.5">{activeShipment.carrier}</div>
          <div className="text-slate-300 font-mono text-[11px]">{activeShipment.vehiclePlate}</div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Corridor Origin & Destination</span>
          <div className="text-white font-bold mt-0.5">{activeShipment.origin}</div>
          <div className="text-slate-300 text-[11px]">→ {activeShipment.destination}</div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          <button
            onClick={handleAdvanceStage}
            disabled={activeShipment.currentStageIndex >= 7}
            className="px-3.5 py-2 bg-[#0B3D2C] hover:bg-[#0E4B37] disabled:opacity-50 text-white font-bold text-xs rounded-xl border border-[#196349] flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Advance Next Stage →</span>
          </button>
        </div>
      </div>

      {/* 8-Stage Interactive Horizontal Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {activeShipment.stages.map((stg, idx) => {
          const isSelected = selectedStepIndex === idx;
          const isCurrentLive = activeShipment.currentStageIndex === idx;

          return (
            <button
              key={stg.step}
              onClick={() => setSelectedStepIndex(idx)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-[#14261E] border-emerald-500 shadow-md ring-1 ring-emerald-500/30"
                  : isCurrentLive
                  ? "bg-[#162228] border-cyan-500 shadow-sm"
                  : stg.status === "Completed"
                  ? "bg-[#10171B] border-[#1D2A32] text-slate-300 hover:border-slate-600"
                  : "bg-[#10171B] border-[#1D2A32] text-slate-500 opacity-75"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] font-extrabold text-slate-400">
                  {stg.stageCode}
                </span>
                {stg.status === "Completed" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : isCurrentLive ? (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
              </div>
              <div className="text-[11px] font-bold text-white line-clamp-2 leading-tight">
                {stg.title}
              </div>
              <div
                className={`text-[9px] font-bold uppercase tracking-wider mt-2 ${
                  stg.status === "Completed"
                    ? "text-emerald-400"
                    : isCurrentLive
                    ? "text-cyan-300"
                    : "text-slate-500"
                }`}
              >
                {stg.status}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Dossier Card */}
      <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] space-y-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#07261B] text-emerald-400 border border-[#14533C] flex items-center justify-center font-mono font-extrabold text-xs">
                {activeStage.stageCode}
              </span>
              <h3 className="font-extrabold text-base text-white">
                Stage {activeStage.stageCode}: {activeStage.title}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {activeStage.description}
            </p>
          </div>

          <div className="text-right">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block ${
                activeStage.status === "Completed"
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                  : activeStage.status === "In Progress"
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {activeStage.status}
            </span>
            <div className="text-[10px] font-mono text-slate-400 mt-1">
              {activeStage.timestamp}
            </div>
          </div>
        </div>

        {/* Detailed Operational Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Accountable Party</span>
            <div className="text-white font-bold text-sm">{activeStage.accountableParty}</div>
            <div className="text-[10px] text-emerald-400">Digital Handshake Verified</div>
          </div>

          <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Location Event Point</span>
            <div className="text-white font-bold text-sm">{activeStage.location}</div>
            <div className="text-[10px] text-slate-400">Corridor Checkpoint Validated</div>
          </div>

          <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Security & Integrity</span>
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Tamper-Proof Audit Trail</span>
            </div>
            <div className="text-[10px] text-slate-400">SHA-256 Hashed on Agricultural Ledger</div>
          </div>
        </div>

        {/* Audit Evidence Key-Values */}
        <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2 text-xs">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            Operational Evidence & Telematics Records:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {Object.entries(activeStage.evidenceData).map(([key, val]) => (
              <div key={key} className="p-2.5 bg-[#10171B] rounded-lg border border-[#1D2A32]">
                <div className="text-[10px] text-slate-400 font-semibold">{key}</div>
                <div className="text-xs font-mono font-bold text-white mt-0.5 truncate">{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Attached Digital Documents */}
        <div className="pt-2">
          <span className="text-xs font-bold text-slate-300 block mb-2">Attached Statutory Documents & Electronic Passes:</span>
          <div className="flex flex-wrap gap-2">
            {activeStage.documents.map((doc, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-xl bg-[#162228] border border-[#1D2A32] text-xs text-white flex items-center gap-2 hover:border-emerald-500 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>{doc}</span>
                <button
                  onClick={() => {
                    setToastMsg(`Downloaded document: ${doc}`);
                    setTimeout(() => setToastMsg(null), 3000);
                  }}
                  className="p-1 text-slate-400 hover:text-emerald-400 cursor-pointer ml-1"
                  title="Download Certificate"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
