import React, { useState } from "react";
import {
  Calendar,
  Sprout,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Plus,
  X,
  FileSpreadsheet,
  Download,
  MapPin,
  Compass,
  Droplets,
  Layers,
  Thermometer,
  Activity,
  Check,
  ShieldCheck,
  Award,
} from "lucide-react";
import { useApp } from "../../../context/AppContext";

export interface ProductionRecord {
  id: string;
  season: string;
  crop: string;
  variety: string;
  areaHa: number;
  totalHarvestMT: number;
  yieldPerHa: number;
  moistureContent: number;
  qualityGrade: string;
  sellingPricePerMT: number;
  totalRevenueUSD: number;
  buyerName: string;
  notes: string;
}

export const FarmerCropCalendarProduction: React.FC = () => {
  const { currentFarm } = useApp();

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);

  // Crop Calendar Stages State
  const [calendarStages, setCalendarStages] = useState([
    {
      id: "prep",
      stageNumber: 1,
      name: "Land Preparation & Basal Fertilization",
      dates: "Aug 15 – Sep 10",
      status: "completed" as const,
      progressPct: 100,
      targetMetrics: "Deep ripping (45cm) + Lime application (2.5 t/ha) to pH 6.4",
      tasks: [
        { name: "Chisel ploughing & soil compaction breaking", done: true },
        { name: "Basal NPK 3:2:1 (32) blend application @ 250 kg/ha", done: true },
        { name: "Pre-emergence herbicide calibration", done: true },
      ],
    },
    {
      id: "planting",
      stageNumber: 2,
      name: "Precision Planting & Emergence",
      dates: "Sep 12 – Sep 30",
      status: "completed" as const,
      progressPct: 100,
      targetMetrics: "Target plant population: 65,000 seeds/ha; 98.2% emergence recorded",
      tasks: [
        { name: "Seed drill depth calibration (5.0 cm moist seedbed)", done: true },
        { name: "In-furrow systemic fungicide & insecticide treatment", done: true },
        { name: "Sentinel-2 germination emergence audit pass", done: true },
      ],
    },
    {
      id: "vegetative",
      stageNumber: 3,
      name: "Vegetative Growth & Canopy Development (V6 – V10)",
      dates: "Oct 01 – Nov 15",
      status: "active" as const,
      progressPct: 62,
      targetMetrics: "NDVI Index: 0.88 (Optimal Chlorophyll); Root depth: 65cm",
      tasks: [
        { name: "Side-dress Nitrogen (Urea 46% N) top-dressing @ 150 kg/ha", done: true },
        { name: "Pivot irrigation scheduled at 28mm weekly baseline", done: true },
        { name: "Scout parcel boundaries for Fall Armyworm & leaf streak", done: false },
        { name: "Drone multispectral canopy NDVI verification pass", done: false },
      ],
    },
    {
      id: "tasseling",
      stageNumber: 4,
      name: "Tasseling, Pollination & Silking (R1)",
      dates: "Nov 16 – Dec 15",
      status: "upcoming" as const,
      progressPct: 0,
      targetMetrics: "Critical water stress window: Maintain soil moisture >= 65%",
      tasks: [
        { name: "Zero moisture deficit irrigation mandate (35mm/week)", done: false },
        { name: "Foliar boron & zinc micronutrient boost spray", done: false },
        { name: "Parametric weather heat-shock sensor armed", done: false },
      ],
    },
    {
      id: "grain_filling",
      stageNumber: 5,
      name: "Grain Filling & Milk / Dent Stage (R2 – R5)",
      dates: "Dec 16 – Jan 30",
      status: "upcoming" as const,
      progressPct: 0,
      targetMetrics: "Starch deposition & kernel test weight accumulation",
      tasks: [
        { name: "Inspect grain ear fill & kernel tip abortion risk", done: false },
        { name: "Late-season stalk rot & ear rot scouting", done: false },
        { name: "Coordinate forward off-take delivery schedule with mill", done: false },
      ],
    },
    {
      id: "harvest",
      stageNumber: 6,
      name: "Physiological Black Layer Maturity & Harvest",
      dates: "Feb 01 – Feb 28",
      status: "upcoming" as const,
      progressPct: 0,
      targetMetrics: "Target harvest moisture: 13.5% SAFEX specification",
      tasks: [
        { name: "Combine harvester header calibration (<1.5% loss)", done: false },
        { name: "Grain moisture sensor verification on field samples", done: false },
        { name: "Logistics truck fleet dispatch & silo slot allocation", done: false },
      ],
    },
  ]);

  // Production Records State
  const [productionRecords, setProductionRecords] = useState<ProductionRecord[]>([
    {
      id: "PR-2025-26",
      season: "2025/2026 Season",
      crop: "Yellow Maize",
      variety: "Pioneer P1197 YHR (DroughtGard)",
      areaHa: 250,
      totalHarvestMT: 1550,
      yieldPerHa: 6.2,
      moistureContent: 12.1,
      qualityGrade: "SAFEX Grade 1",
      sellingPricePerMT: 295, // USD
      totalRevenueUSD: 457250,
      buyerName: "Pan-African Milling Ltd",
      notes: "Optimal NDVI across all 4 parcels. Harvest delivered directly to Zambezi Silo #04.",
    },
    {
      id: "PR-2024-25",
      season: "2024/2025 Season",
      crop: "Yellow Maize",
      variety: "DKC 73-76 R (DEKALB)",
      areaHa: 240,
      totalHarvestMT: 1416,
      yieldPerHa: 5.9,
      moistureContent: 12.4,
      qualityGrade: "SAFEX Grade 1",
      sellingPricePerMT: 270,
      totalRevenueUSD: 382320,
      buyerName: "Afrilog Grain Depots Ltd",
      notes: "Clean delivery. Zero dockage deductions. Off-take escrow auto-settled.",
    },
    {
      id: "PR-2023-24",
      season: "2023/2024 Season (El Niño)",
      crop: "White Maize",
      variety: "PAN 5R-791R",
      areaHa: 220,
      totalHarvestMT: 990,
      yieldPerHa: 4.5,
      moistureContent: 11.9,
      qualityGrade: "Grade 1 (Sub-yield)",
      sellingPricePerMT: 280,
      totalRevenueUSD: 277200,
      buyerName: "Southern Grain Cooperatives",
      notes: "Severe regional drought. Parametric drought insurance claim paid out $38,000 USD via Africa Re.",
    },
    {
      id: "PR-2022-23",
      season: "2022/2023 Season",
      crop: "Soybeans (Rotation)",
      variety: "Link Seed 6780 RR",
      areaHa: 180,
      totalHarvestMT: 486,
      yieldPerHa: 2.7,
      moistureContent: 11.2,
      qualityGrade: "Grade 1 Export",
      sellingPricePerMT: 445,
      totalRevenueUSD: 216270,
      buyerName: "Alexandria Feeds & Crushers",
      notes: "Nitrogen fixation improved soil baseline for subsequent maize crop by 22 kg N/ha.",
    },
  ]);

  // New Record Form State
  const [newSeason, setNewSeason] = useState("2026/2027 Season");
  const [newCrop, setNewCrop] = useState("Yellow Maize");
  const [newVariety, setNewVariety] = useState("Pioneer P1197 YHR");
  const [newArea, setNewArea] = useState("250");
  const [newHarvest, setNewHarvest] = useState("1600");
  const [newMoisture, setNewMoisture] = useState("12.2");
  const [newGrade, setNewGrade] = useState("SAFEX Grade 1");
  const [newPrice, setNewPrice] = useState("300");
  const [newBuyer, setNewBuyer] = useState("Pan-African Milling Ltd");
  const [newNotes, setNewNotes] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleToggleTask = (stageId: string, taskIdx: number) => {
    setCalendarStages((prev) =>
      prev.map((stage) => {
        if (stage.id !== stageId) return stage;
        const newTasks = [...stage.tasks];
        newTasks[taskIdx].done = !newTasks[taskIdx].done;
        const completedCount = newTasks.filter((t) => t.done).length;
        const newPct = Math.round((completedCount / newTasks.length) * 100);
        return {
          ...stage,
          tasks: newTasks,
          progressPct: newPct,
          status: newPct === 100 ? "completed" : "active",
        };
      })
    );
    showToast("Agronomic task status updated.");
  };

  const handleAddProductionRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const area = Number(newArea) || 100;
    const harvest = Number(newHarvest) || 500;
    const price = Number(newPrice) || 280;
    const yieldHa = Number((harvest / area).toFixed(2));
    const revenue = Math.round(harvest * price);

    const record: ProductionRecord = {
      id: `PR-${Date.now().toString().slice(-6)}`,
      season: newSeason,
      crop: newCrop,
      variety: newVariety,
      areaHa: area,
      totalHarvestMT: harvest,
      yieldPerHa: yieldHa,
      moistureContent: Number(newMoisture) || 12.0,
      qualityGrade: newGrade,
      sellingPricePerMT: price,
      totalRevenueUSD: revenue,
      buyerName: newBuyer,
      notes: newNotes || "Certified harvest record recorded into farm ledger.",
    };

    setProductionRecords((prev) => [record, ...prev]);
    setIsAddRecordModalOpen(false);
    showToast(`Added production record for ${record.season} (${record.totalHarvestMT} MT).`);
  };

  const handleExportRecords = () => {
    const csvContent =
      "Season,Crop,Variety,Area Ha,Total Harvest MT,Yield t/ha,Moisture %,Grade,Price/MT USD,Revenue USD,Buyer\n" +
      productionRecords
        .map(
          (r) =>
            `"${r.season}","${r.crop}","${r.variety}",${r.areaHa},${r.totalHarvestMT},${r.yieldPerHa},${r.moistureContent},"${r.qualityGrade}",${r.sellingPricePerMT},${r.totalRevenueUSD},"${r.buyerName}"`
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Farm_Production_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Exported multi-season production ledger (.CSV).");
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

      {/* Comprehensive Farm Profile Card */}
      <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1D2A32]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#07261B] border border-[#14533C] text-emerald-400 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Farm Profile & Cadastral Registration
                </h3>
                <span className="text-[10px] font-mono font-bold bg-[#07261B] text-emerald-300 px-2 py-0.5 rounded border border-[#14533C]">
                  Deed Ref: ZA-FS-2026-9481
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official property boundary, soil classification, water rights, and agro-ecological zone.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-[#162228] text-slate-300 border border-[#1D2A32] font-mono">
              GPS: 29.133° S, 26.214° E
            </span>
          </div>
        </div>

        {/* Profile Attributes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Land Holding</span>
            <div className="text-base font-mono font-extrabold text-white">
              {currentFarm.totalHectares} Hectares
            </div>
            <span className="text-[10px] text-slate-400 block">4 Micro-Field Parcels</span>
          </div>

          <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Soil Classification</span>
            <div className="text-sm font-extrabold text-white">Mollisol Clay-Loam</div>
            <span className="text-[10px] text-emerald-300 font-mono block">pH 6.4 • Org. Carbon 3.8%</span>
          </div>

          <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Irrigation System</span>
            <div className="text-sm font-extrabold text-white">3 Center Pivots</div>
            <span className="text-[10px] text-cyan-300 font-mono block">180 Ha Irrigated • Furrows</span>
          </div>

          <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Water License</span>
            <div className="text-sm font-extrabold text-emerald-400">Valid to 2031</div>
            <span className="text-[10px] text-slate-400 block">650,000 m³/yr Allocation</span>
          </div>

          <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Agro-Ecological Zone</span>
            <div className="text-sm font-extrabold text-white">Highveld Summer Rain</div>
            <span className="text-[10px] text-slate-400 block">620mm Mean Precipitation</span>
          </div>

          <div className="p-3 bg-[#07261B] rounded-xl border border-[#14533C] space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block">SAFEX Silo Distance</span>
            <div className="text-base font-mono font-extrabold text-emerald-300">14.2 km</div>
            <span className="text-[10px] text-emerald-400 block">Zambezi Depot #04</span>
          </div>
        </div>
      </div>

      {/* Dynamic Seasonal Crop Calendar */}
      <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1D2A32]">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-extrabold text-white">
                2026/2027 Crop Calendar & Phenological Milestones
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live phenological tracking matched to satellite thermal accumulation (GDD) and soil moisture telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-[#07261B] text-emerald-300 px-3 py-1 rounded-xl border border-[#14533C]">
              Active Stage: Vegetative (V6) • 106 Days to Harvest
            </span>
          </div>
        </div>

        {/* Growth Stages Timeline Track */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
          {calendarStages.map((stage) => (
            <div
              key={stage.id}
              className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                stage.status === "active"
                  ? "bg-[#07261B] border-emerald-500 shadow-md ring-1 ring-emerald-500/40"
                  : stage.status === "completed"
                  ? "bg-[#162228] border-[#1D2A32] opacity-90"
                  : "bg-[#10171B] border-[#1D2A32]/70 opacity-60"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[10px] text-slate-400">
                    Stage 0{stage.stageNumber}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      stage.status === "active"
                        ? "bg-emerald-500 text-slate-950 animate-pulse font-extrabold"
                        : stage.status === "completed"
                        ? "bg-[#14533C] text-emerald-300"
                        : "bg-[#162228] text-slate-500"
                    }`}
                  >
                    {stage.status === "active" ? "In Progress" : stage.status === "completed" ? "Completed" : "Upcoming"}
                  </span>
                </div>

                <div className="font-extrabold text-white text-xs leading-snug">{stage.name}</div>
                <div className="text-[10px] font-mono text-emerald-400">{stage.dates}</div>

                {/* Mini Progress Bar */}
                <div className="w-full bg-[#10171B] h-1.5 rounded-full overflow-hidden mt-1 border border-[#1D2A32]">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stage.progressPct}%` }}
                  />
                </div>
              </div>

              {/* Tasks List within Stage */}
              <div className="mt-3 pt-2.5 border-t border-[#1D2A32] space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Tasks:</span>
                {stage.tasks.map((task, tIdx) => (
                  <button
                    key={tIdx}
                    onClick={() => handleToggleTask(stage.id, tIdx)}
                    className="w-full text-left flex items-start gap-1.5 p-1 rounded hover:bg-[#162228] transition-colors cursor-pointer group"
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                        task.done
                          ? "bg-emerald-500 border-emerald-400 text-slate-950"
                          : "border-slate-500 group-hover:border-emerald-400"
                      }`}
                    >
                      {task.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </span>
                    <span
                      className={`text-[10px] leading-tight ${
                        task.done ? "text-slate-400 line-through" : "text-slate-200 group-hover:text-white"
                      }`}
                    >
                      {task.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Production & Harvest Records Ledger */}
      <div className="bg-[#10171B] rounded-2xl border border-[#1D2A32] overflow-hidden shadow-sm space-y-0">
        <div className="p-4 sm:p-5 bg-[#162228] border-b border-[#1D2A32] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-white">
                Multi-Season Production Ledger & Historical Yield Records
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Verified crop yields, moisture test audits, off-take selling prices, and gross farm revenues.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportRecords}
              className="px-3.5 py-2 rounded-xl bg-[#10171B] hover:bg-[#1D2A32] text-slate-200 border border-[#1D2A32] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Ledger (.CSV)</span>
            </button>

            <button
              onClick={() => setIsAddRecordModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-300" />
              <span>Log Harvest Record</span>
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#10171B] text-slate-400 border-b border-[#1D2A32] font-semibold">
                <th className="p-3.5">Season & Crop</th>
                <th className="p-3.5">Variety & Seed</th>
                <th className="p-3.5">Area & Total MT</th>
                <th className="p-3.5">Mean Yield</th>
                <th className="p-3.5">Moisture & Quality</th>
                <th className="p-3.5">Price & Gross Revenue</th>
                <th className="p-3.5 text-right">Off-Take Buyer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2A32]">
              {productionRecords.map((r) => (
                <tr key={r.id} className="hover:bg-[#162228]/50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-mono text-emerald-400 font-bold">{r.season}</div>
                    <div className="font-extrabold text-white text-xs mt-0.5">{r.crop}</div>
                  </td>

                  <td className="p-3.5 text-slate-300">
                    <div>{r.variety}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Ref: {r.id}</div>
                  </td>

                  <td className="p-3.5 font-mono">
                    <div className="font-bold text-white">{r.totalHarvestMT.toLocaleString()} MT</div>
                    <div className="text-[10px] text-slate-400">{r.areaHa} Hectares planted</div>
                  </td>

                  <td className="p-3.5">
                    <span className="font-mono font-extrabold text-white text-sm bg-[#162228] px-2 py-0.5 rounded border border-[#1D2A32]">
                      {r.yieldPerHa} t/ha
                    </span>
                  </td>

                  <td className="p-3.5">
                    <div className="text-white font-medium">{r.qualityGrade}</div>
                    <div className="text-[10px] text-emerald-300 font-mono">Moisture: {r.moistureContent}%</div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-mono font-extrabold text-white text-sm">
                      ${r.totalRevenueUSD.toLocaleString()} USD
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">${r.sellingPricePerMT} / MT</div>
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="font-semibold text-white">{r.buyerName}</div>
                    <div className="text-[10px] text-emerald-400">Escrow Settled</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Production Record Modal */}
      {isAddRecordModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B1013]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#10171B] rounded-3xl max-w-lg w-full border border-[#1D2A32] shadow-2xl overflow-hidden my-auto">
            <div className="px-5 py-4 bg-[#07261B] text-white flex items-center justify-between border-b border-[#14533C]">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Log New Season Harvest & Production Record
                </h3>
              </div>
              <button
                onClick={() => setIsAddRecordModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductionRecord} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Production Season</label>
                  <input
                    type="text"
                    value={newSeason}
                    onChange={(e) => setNewSeason(e.target.value)}
                    className="w-full bg-[#162228] text-white font-mono px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Commodity / Crop</label>
                  <input
                    type="text"
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    className="w-full bg-[#162228] text-white px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Seed Variety</label>
                  <input
                    type="text"
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    className="w-full bg-[#162228] text-white px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Area Harvested (Ha)</label>
                  <input
                    type="number"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full bg-[#162228] text-white font-mono px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Total MT</label>
                  <input
                    type="number"
                    value={newHarvest}
                    onChange={(e) => setNewHarvest(e.target.value)}
                    className="w-full bg-[#162228] text-white font-mono px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Moisture %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMoisture}
                    onChange={(e) => setNewMoisture(e.target.value)}
                    className="w-full bg-[#162228] text-white font-mono px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Price / MT ($)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-[#162228] text-white font-mono px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Quality Grade</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full bg-[#162228] text-white px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                  >
                    <option value="SAFEX Grade 1">SAFEX Grade 1 (&lt; 12.5% moisture)</option>
                    <option value="SAFEX Grade 2">SAFEX Grade 2</option>
                    <option value="Feed Grade">Feed Grade</option>
                    <option value="Export Premium">Export Premium / Non-GMO</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Off-Take Buyer</label>
                  <input
                    type="text"
                    value={newBuyer}
                    onChange={(e) => setNewBuyer(e.target.value)}
                    className="w-full bg-[#162228] text-white px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Field Notes / Observations</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g., Grain quality test, certified silo scale ticket #9021."
                  rows={2}
                  className="w-full bg-[#162228] text-white px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-[#1D2A32] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRecordModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#162228] text-slate-300 font-bold hover:bg-[#1D2A32] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold transition-all border border-[#196349] shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Save Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
