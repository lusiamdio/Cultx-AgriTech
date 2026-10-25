import React, { useState } from "react";
import {
  Truck,
  Ship,
  Train,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Thermometer,
  Activity,
  ArrowRight,
  Sparkles,
  RefreshCw,
  FileCheck,
  ExternalLink,
  Layers,
  Radio,
  Anchor,
  Box,
} from "lucide-react";

export interface ExportShipment {
  id: string;
  trackingNumber: string;
  consignmentName: string;
  commodity: string;
  tonnage: number;
  origin: string;
  destination: string;
  corridor: string;
  transportMode: "Maritime" | "Rail" | "Road";
  status: "In Ocean Transit" | "Border Clearance" | "In Rail Transit" | "Port Loading" | "Delivered";
  progressPct: number;
  currentLocationName: string;
  coordinates: string;
  speed: string;
  estimatedArrival: string;
  remainingTime: string;
  carrier: string;
  rfidSealNumber: string;
  ambientTemp: string;
  humidity: string;
  moistureLevel: string;
  tamperSealStatus: "Armed & Secure" | "Customs Inspected" | "Intact";
  papssEscrowStatus: string;
  nextMilestone: string;
  milestones: {
    title: string;
    location: string;
    timestamp: string;
    completed: boolean;
    current?: boolean;
  }[];
}

interface ExportShipmentTrackingDashboardProps {
  onInspectDossier?: (docId: string) => void;
}

export const ExportShipmentTrackingDashboard: React.FC<ExportShipmentTrackingDashboardProps> = ({
  onInspectDossier,
}) => {
  const [shipments, setShipments] = useState<ExportShipment[]>([
    {
      id: "ship-01",
      trackingNumber: "EXP-ZA-KE-2026-881",
      consignmentName: "200 MT Yellow Maize (Food Reserve Batch)",
      commodity: "Yellow Maize (SAFEX Grade 1)",
      tonnage: 200,
      origin: "Free State, South Africa (Cape Farm)",
      destination: "Nairobi Central Silos, Kenya (NCPB)",
      corridor: "Southern-East Africa Maritime & SGR Corridor",
      transportMode: "Maritime",
      status: "In Ocean Transit",
      progressPct: 68,
      currentLocationName: "Mozambique Channel (480 nm to Port of Mombasa)",
      coordinates: "12°28'48\"S, 40°49'12\"E",
      speed: "16.4 Knots (Cruising)",
      estimatedArrival: "Oct 24, 2026 • 14:00 EAT",
      remainingTime: "2 Days, 6 Hours",
      carrier: "Trans-East Multimodal (MV African Sun v.2604)",
      rfidSealNumber: "SEAL-RFID-ZA-99214-08",
      ambientTemp: "18.2°C (Optimal grain aeration)",
      humidity: "52% RH",
      moistureLevel: "12.1% (Below 13.5% ceiling)",
      tamperSealStatus: "Armed & Secure",
      papssEscrowStatus: "50% Released ($28,000 USD via PAPSS)",
      nextMilestone: "Arrival at Port of Mombasa Kilindini Berth 5",
      milestones: [
        { title: "Farm Weighbridge & Bagging", location: "Cape Farm, Free State", timestamp: "Oct 16, 08:30", completed: true },
        { title: "Durban Port Loading & Phytosanitary Pass", location: "Durban Container Terminal", timestamp: "Oct 18, 14:15", completed: true },
        { title: "Indian Ocean Maritime Escort", location: "Mozambique Channel", timestamp: "Oct 21, Live", completed: true, current: true },
        { title: "Port of Mombasa SGR Transfer", location: "Mombasa Kilindini Berth 5", timestamp: "Oct 24, Est.", completed: false },
        { title: "Nairobi Inland Depot Silo Discharge", location: "ICD Nairobi", timestamp: "Oct 25, Est.", completed: false },
      ],
    },
    {
      id: "ship-02",
      trackingNumber: "EXP-CI-NG-2026-442",
      consignmentName: "150 MT Grade 1 Cocoa Beans & Liquor",
      commodity: "Cocoa Beans (SGS Inspected)",
      tonnage: 150,
      origin: "Abidjan Cocoa Logistics Hub, Côte d'Ivoire",
      destination: "Lagos Industrial Processing Zone, Nigeria",
      corridor: "Abidjan-Lagos Coastal Trans-West Corridor",
      transportMode: "Road",
      status: "Border Clearance",
      progressPct: 82,
      currentLocationName: "Seme-Krake Joint OSBP (Benin-Nigeria Border)",
      coordinates: "06°22'54\"N, 02°43'18\"E",
      speed: "0 km/h (Customs Inspection Lane 3)",
      estimatedArrival: "Oct 21, 2026 • 18:30 WAT",
      remainingTime: "18 Hours",
      carrier: "West-Coast Fast Freight Fleet Convoy #12",
      rfidSealNumber: "SEAL-ECOWAS-CI-48192-A",
      ambientTemp: "23.4°C",
      humidity: "58% RH (Dry storage)",
      moistureLevel: "7.2% (Target < 7.5%)",
      tamperSealStatus: "Customs Inspected",
      papssEscrowStatus: "75% Released ($120,000 USD via PAPSS)",
      nextMilestone: "Seme OSBP Green-Lane Clearance into Lagos",
      milestones: [
        { title: "Abidjan Warehousing & Quality Check", location: "Abidjan Logistics Park", timestamp: "Oct 17, 09:00", completed: true },
        { title: "Ghana Corridor Transit (Tema Bypass)", location: "Tema Free Trade Zone", timestamp: "Oct 19, 11:30", completed: true },
        { title: "Seme-Krake Joint Border OSBP", location: "Benin-Nigeria Border", timestamp: "Oct 21, Live", completed: true, current: true },
        { title: "Lagos Port Expressway Escort", location: "Badagry Expressway", timestamp: "Oct 21, 16:00", completed: false },
        { title: "Apapa Food Processing Silo Receipt", location: "Lagos Apapa Terminal", timestamp: "Oct 21, 18:30", completed: false },
      ],
    },
    {
      id: "ship-03",
      trackingNumber: "EXP-ZM-AO-2026-905",
      consignmentName: "320 MT Non-GMO Soybeans (Heavy Rail Convoy)",
      commodity: "Soybeans (Grade 1)",
      tonnage: 320,
      origin: "Ndola Agro Terminal, Copperbelt, Zambia",
      destination: "Port of Lobito Atlantic Deepwater Hub, Angola",
      corridor: "Lobito Atlantic Rail Freight Corridor (LAR)",
      transportMode: "Rail",
      status: "In Rail Transit",
      progressPct: 54,
      currentLocationName: "Huambo Highland Railway Siding, Angola",
      coordinates: "12°46'12\"S, 15°44'24\"E",
      speed: "62 km/h (Express Unit Train)",
      estimatedArrival: "Oct 22, 2026 • 09:15 WAT",
      remainingTime: "1 Day, 2 Hours",
      carrier: "Lobito Atlantic Railway (LAR Train #8842)",
      rfidSealNumber: "SEAL-LAR-CFB-2026-004",
      ambientTemp: "21.0°C",
      humidity: "48% RH",
      moistureLevel: "11.8% (Below 13% ceiling)",
      tamperSealStatus: "Armed & Secure",
      papssEscrowStatus: "50% Released ($92,000 USD via PAPSS)",
      nextMilestone: "Benguela Coastal Descent & Lobito Port Berth 3",
      milestones: [
        { title: "Ndola Silo Rail Loading & Axle Weighing", location: "Ndola Rail Depot", timestamp: "Oct 18, 07:00", completed: true },
        { title: "Luau One-Stop Border Post (DRC/Angola)", location: "Luau OSBP", timestamp: "Oct 19, 16:45", completed: true },
        { title: "Huambo Central Plateau Express Transit", location: "Huambo Railway Station", timestamp: "Oct 21, Live", completed: true, current: true },
        { title: "Benguela Escarpment Brake Inspection", location: "Cubal Station", timestamp: "Oct 21, 22:00", completed: false },
        { title: "Port of Lobito Pier 3 Bulk Grain Discharge", location: "Lobito Atlantic Terminal", timestamp: "Oct 22, 09:15", completed: false },
      ],
    },
  ]);

  const [selectedShipmentId, setSelectedShipmentId] = useState<string>("ship-01");
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [lastPingTime, setLastPingTime] = useState<string>("Just now");

  const currentShipment =
    shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

  const handleSimulatePing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      setLastPingTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 700);
  };

  return (
    <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-sm space-y-6">
      {/* Header with Title and Mode Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1D2A32]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-2 rounded-xl bg-[#07261B] text-emerald-400 border border-[#14533C]">
              <Radio className="w-4 h-4 animate-pulse" />
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
              AfCFTA Real-Time Cross-Border Export Tracking
            </h3>
            <span className="text-[10px] font-mono font-bold bg-[#07261B] text-emerald-300 px-2.5 py-0.5 rounded border border-[#14533C]">
              IoT Telematics Live
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end GPS, weighbridge telemetry, and phytosanitary border clearance across intra-African corridors.
          </p>
        </div>

        {/* Live Refresh Button */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden md:block">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Telemetry Ping</span>
            <span className="text-xs font-mono text-emerald-400">{lastPingTime}</span>
          </div>

          <button
            onClick={handleSimulatePing}
            disabled={isPinging}
            className="px-3.5 py-2 rounded-xl bg-[#162228] hover:bg-[#1D2A32] text-slate-200 border border-[#1D2A32] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Poll active satellite and corridor IoT nodes"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isPinging ? "animate-spin" : ""}`} />
            <span>{isPinging ? "Querying Nodes..." : "Poll Live GPS"}</span>
          </button>
        </div>
      </div>

      {/* Shipment Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {shipments.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedShipmentId(s.id)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
              selectedShipmentId === s.id
                ? "bg-[#07261B] border-emerald-500 shadow-sm ring-1 ring-emerald-500/40"
                : "bg-[#162228] border-[#1D2A32] hover:border-[#1E2E38]"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-extrabold text-white font-mono truncate">
                {s.trackingNumber}
              </span>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase shrink-0 ${
                  s.status === "In Ocean Transit"
                    ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                    : s.status === "Border Clearance"
                    ? "bg-amber-950 text-amber-300 border border-amber-800"
                    : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                }`}
              >
                {s.status}
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-200 truncate">{s.commodity}</div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                {s.origin.split(",")[0]} → {s.destination.split(",")[0]}
              </div>
            </div>

            {/* Mini Progress Bar */}
            <div className="w-full bg-[#0E161C] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${s.progressPct}%` }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Active Shipment Command Telemetry Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Corridor Route, Status & Milestones (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-5 bg-[#162228] rounded-2xl border border-[#1D2A32] space-y-4">
            {/* Title & Speed */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1D2A32]">
              <div>
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  {currentShipment.corridor}
                </div>
                <h4 className="text-base font-extrabold text-white mt-0.5">
                  {currentShipment.consignmentName}
                </h4>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Current Velocity</span>
                <span className="text-xs font-mono font-bold text-white bg-[#0B1013] px-2 py-1 rounded border border-[#1D2A32] inline-block mt-0.5">
                  {currentShipment.speed}
                </span>
              </div>
            </div>

            {/* Origin & Destination Route Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32] space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Consignment Origin</span>
                </div>
                <div className="font-bold text-white">{currentShipment.origin}</div>
                <div className="text-[11px] text-slate-400 font-mono">Shipper: {currentShipment.carrier}</div>
              </div>

              <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32] space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Anchor className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Consignment Destination</span>
                </div>
                <div className="font-bold text-white">{currentShipment.destination}</div>
                <div className="text-[11px] text-emerald-300 font-mono">ETA: {currentShipment.estimatedArrival}</div>
              </div>
            </div>

            {/* Live Progress Bar with Time Remaining */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Corridor Transit Completion: {currentShipment.progressPct}%</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  {currentShipment.remainingTime} remaining
                </span>
              </div>
              <div className="w-full bg-[#0E161C] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#1D2A32]">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${currentShipment.progressPct}%` }}
                />
              </div>
            </div>

            {/* Milestone Timeline */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Corridor Milestone Clearance Checkpoints
              </span>
              <div className="space-y-2">
                {currentShipment.milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                      m.current
                        ? "bg-[#07261B] border-emerald-500 text-white shadow-xs"
                        : m.completed
                        ? "bg-[#10171B] border-[#14533C]/50 text-slate-300"
                        : "bg-[#0E1418] border-[#1D2A32] text-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {m.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                      )}
                      <div>
                        <div className={`font-bold ${m.current ? "text-emerald-300" : ""}`}>
                          {m.title}
                        </div>
                        <div className="text-[10px] text-slate-400">{m.location}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono text-[11px] text-slate-400">
                      {m.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Telematics, Sensors, & Certificate Dossier Link (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Live Container Ambient Telemetry */}
          <div className="p-4 sm:p-5 bg-[#162228] rounded-2xl border border-[#1D2A32] space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#1D2A32]">
              <span className="font-extrabold text-xs text-white flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-emerald-400" />
                <span>Cargo IoT Sensor Telemetry</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                Calibrated
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Container Temp
                </span>
                <span className="font-mono text-sm font-extrabold text-white mt-0.5 block">
                  {currentShipment.ambientTemp.split(" ")[0]}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium mt-0.5 block">
                  Safe Aeration Zone
                </span>
              </div>

              <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Grain Moisture
                </span>
                <span className="font-mono text-sm font-extrabold text-white mt-0.5 block">
                  {currentShipment.moistureLevel.split(" ")[0]}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium mt-0.5 block">
                  Standard &lt;13.5%
                </span>
              </div>

              <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Relative Humidity
                </span>
                <span className="font-mono text-sm font-extrabold text-white mt-0.5 block">
                  {currentShipment.humidity}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Dry Ambient
                </span>
              </div>

              <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  RFID Tamper Seal
                </span>
                <span className="font-mono text-xs font-bold text-emerald-300 mt-0.5 block truncate">
                  {currentShipment.tamperSealStatus}
                </span>
                <span className="text-[9px] font-mono text-slate-400 truncate block">
                  0 Breaches Logged
                </span>
              </div>
            </div>

            {/* GPS Location & Coordinates Card */}
            <div className="p-3 bg-[#0B1013] rounded-xl border border-[#1D2A32] space-y-1 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-400 text-[10px] uppercase">
                <span>GPS Telemetric Coordinates</span>
                <span className="text-emerald-400">Lock: Galileo / GPS</span>
              </div>
              <div className="text-white font-bold text-[11px] truncate">
                {currentShipment.coordinates}
              </div>
              <div className="text-slate-400 text-[10px] truncate">
                Current Anchor: {currentShipment.currentLocationName}
              </div>
            </div>
          </div>

          {/* PAPSS Escrow Release Card */}
          <div className="p-4 bg-[#07261B] rounded-2xl border border-[#14533C] space-y-2 text-xs">
            <div className="flex items-center justify-between text-white font-extrabold">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>PAPSS Cross-Border Smart Escrow</span>
              </span>
              <span className="font-mono text-emerald-300 text-xs">Auto-Disbursed</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Real-time payment tranches automatically release to seller account upon telematic GPS corridor verification.
            </p>
            <div className="p-2.5 bg-[#0B1512] rounded-xl border border-[#14533C]/60 text-white font-bold text-xs flex justify-between">
              <span className="text-slate-400">Released to Date:</span>
              <span className="text-emerald-300 font-mono">{currentShipment.papssEscrowStatus}</span>
            </div>
          </div>

          {/* Accompanying 7-Certificate Dossier Direct Link */}
          <div className="p-4 bg-[#162228] rounded-2xl border border-[#1D2A32] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Accompanying Export Dossier</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                7 / 7 Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Inspect the official phytosanitary certificates, certificate of origin, and bill of lading attached to this consignment.
            </p>

            <button
              onClick={() => onInspectDossier?.("phyto")}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#196349]"
            >
              <span>Inspect 7-Certificate Dossier Package</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
