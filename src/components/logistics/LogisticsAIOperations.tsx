import React, { useState } from "react";
import {
  Brain,
  Route,
  Zap,
  TrendingUp,
  Thermometer,
  Leaf,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Sliders,
  DollarSign,
  Truck,
  Train,
  Scale,
  Activity,
  FileCheck,
  Download,
  Share2,
  Compass,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const LogisticsAIOperations: React.FC = () => {
  const { selectedCountry } = useApp();
  const [activeModule, setActiveModule] = useState<
    "route_load" | "predictive_pricing" | "cold_chain" | "carbon_accounting"
  >("route_load");

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // 1. ROUTE & LOAD OPTIMIZATION STATE
  const [optOrigin, setOptOrigin] = useState("Kitwe Mining & Farming Depot, Zambia");
  const [optDestination, setOptDestination] = useState("Port of Lobito (Atlantic Terminal), Angola");
  const [optCargo, setOptCargo] = useState("Grade-A Non-GMO Soya Beans");
  const [optWeightTonnes, setOptWeightTonnes] = useState(68);
  const [optDeadheadAvoidance, setOptDeadheadAvoidance] = useState(true);
  const [isOptimizingRoute, setIsOptimizingRoute] = useState(false);
  const [routeOptimizedResult, setRouteOptimizedResult] = useState<{
    recommendedCorridor: string;
    distanceKm: number;
    transitHours: number;
    fuelCostUSD: number;
    borderDelayHours: number;
    consolidationBonusPct: number;
    returnLoadMatched: {
      loadId: string;
      cargo: string;
      shipper: string;
      origin: string;
      destination: string;
      revenueUSD: number;
    } | null;
    totalSavingsUSD: number;
  } | null>({
    recommendedCorridor: "Lobito Rail-Road Intermodal (CFB Benguela Corridor)",
    distanceKm: 1344,
    transitHours: 36,
    fuelCostUSD: 1420,
    borderDelayHours: 2.5,
    consolidationBonusPct: 18,
    returnLoadMatched: {
      loadId: "RET-LOB-9921",
      cargo: "Imported Agricultural NPK Fertilizer (Bulk Bags)",
      shipper: "Angola Agrochemicals Terminal",
      origin: "Port of Lobito, Angola",
      destination: "Ndola Fertilizer Silos, Zambia",
      revenueUSD: 2850,
    },
    totalSavingsUSD: 3640,
  });

  const handleRunRouteOptimizer = () => {
    setIsOptimizingRoute(true);
    setTimeout(() => {
      setIsOptimizingRoute(false);
      setRouteOptimizedResult({
        recommendedCorridor: optDestination.includes("Lobito")
          ? "Lobito Multimodal Rail Corridor (CFB Rail + Feeder)"
          : "North-South Highway Corridor (Trans-African 4)",
        distanceKm: 1280 + Math.floor(Math.random() * 180),
        transitHours: 32 + Math.floor(Math.random() * 8),
        fuelCostUSD: 1380 + Math.floor(Math.random() * 200),
        borderDelayHours: 1.8,
        consolidationBonusPct: 22,
        returnLoadMatched: optDeadheadAvoidance
          ? {
              loadId: `RET-BACK-${Math.floor(1000 + Math.random() * 9000)}`,
              cargo: "Bulk Certified Seed & Micro-Nutrients",
              shipper: "Southern Seed Aggregators SA",
              origin: optDestination,
              destination: optOrigin,
              revenueUSD: 3100,
            }
          : null,
        totalSavingsUSD: 4120,
      });
      showToast("AI Route & Load Engine: Optimal corridor & return-haul matched!");
    }, 800);
  };

  // 2. PREDICTIVE FREIGHT PRICING STATE
  const [priceCorridor, setPriceCorridor] = useState("Lusaka -> Lobito Atlantic Gateway");
  const [priceTonnage, setPriceTonnage] = useState(34);
  const [dieselPriceIndex, setDieselPriceIndex] = useState(1.42); // USD per Liter
  const [harvestSurgeSeason, setHarvestSurgeSeason] = useState(true);

  // Predictive pricing logic
  const baseTariffPerKm = 0.058; // USD/t-km
  const corridorKm = 1480;
  const dieselMultiplier = dieselPriceIndex / 1.25;
  const surgeMultiplier = harvestSurgeSeason ? 1.22 : 1.0;
  const spotRatePerTonne = Math.round(corridorKm * baseTariffPerKm * dieselMultiplier * surgeMultiplier);
  const contractRatePerTonne = Math.round(spotRatePerTonne * 0.88); // 12% discount on forward volume contract
  const predicted30DayTrend = harvestSurgeSeason ? "+7.4% (Peak Outflow)" : "-3.2% (Seasonal Trough)";

  // 3. COLD CHAIN & SHELF-LIFE TELEMETRY STATE
  const [reeferTemp, setReeferTemp] = useState(3.4); // Target 3.0°C
  const [reeferTargetTemp] = useState(3.0);
  const [reeferHumidity, setReeferHumidity] = useState(91); // %
  const [doorOpenCount, setDoorOpenCount] = useState(2);
  const [cargoType] = useState("Premium Hass Avocado (Export Standard)");
  const [ambientTemp, setAmbientTemp] = useState(31.5);
  const [batteryLevel] = useState(88); // %
  const [isCompressorActive, setIsCompressorActive] = useState(true);

  // Shelf-life Arrhenius degradation model:
  // Base shelf life at 3°C is 24 days. Every +1°C above target reduces remaining days exponentially.
  const tempExcess = Math.max(0, reeferTemp - reeferTargetTemp);
  const shelfLifeRemainingDays = Math.max(1.5, Number((24 / Math.pow(1.22, tempExcess * 2.5)).toFixed(1)));
  const shelfLifeHealthPct = Math.min(100, Math.round((shelfLifeRemainingDays / 24) * 100));
  const isExcursionAlarm = reeferTemp > 6.0;

  // 4. CARBON ACCOUNTING STATE
  const [carbonTonnes, setCarbonTonnes] = useState(480);
  const [carbonDistanceKm, setCarbonDistanceKm] = useState(1340);
  // Emission factors (g CO2e per tonne-km):
  // Road diesel: 62 g / t-km
  // Rail Lobito diesel-electric: 19 g / t-km
  // Inland barge: 24 g / t-km
  const roadEmissionsTotalTons = (carbonTonnes * carbonDistanceKm * 62) / 1_000_000;
  const railEmissionsTotalTons = (carbonTonnes * carbonDistanceKm * 19) / 1_000_000;
  const carbonSavedTons = roadEmissionsTotalTons - railEmissionsTotalTons;
  const carbonCutPct = Math.round(((roadEmissionsTotalTons - railEmissionsTotalTons) / roadEmissionsTotalTons) * 100);
  const carbonCreditValueUSD = Math.round(carbonSavedTons * 16.5); // $16.50 / ton certified green corridor credit

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B3D2C] text-emerald-200 border border-emerald-500/50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-950/80 rounded-xl border border-purple-800 text-purple-300">
              <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  AI Freight & Logistics Operational Intelligence
                </h3>
                <span className="text-[11px] font-bold text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-800">
                  Autonomous Decision Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Dynamic route & backhaul optimization, predictive tariff forecasting, IoT shelf-life degradation models, and AfCFTA Green Corridor carbon accounting.
              </p>
            </div>
          </div>
        </div>

        {/* Global Key Metrics Badges */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="bg-[#162228] px-3.5 py-2 rounded-xl border border-[#1D2A32] text-right">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Consolidation Uplift</div>
            <div className="text-sm font-extrabold text-emerald-400 font-mono">+24.8% Capacity</div>
          </div>
          <div className="bg-[#162228] px-3.5 py-2 rounded-xl border border-[#1D2A32] text-right">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Deadhead Reduction</div>
            <div className="text-sm font-extrabold text-cyan-400 font-mono">-62% Empty Miles</div>
          </div>
        </div>
      </div>

      {/* Module Selector Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#10171B] p-2 rounded-xl border border-[#1D2A32]">
        <button
          onClick={() => setActiveModule("route_load")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeModule === "route_load"
              ? "bg-[#0B3D2C] text-white border border-[#196349] shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-[#162228]"
          }`}
        >
          <Route className="w-3.5 h-3.5 text-emerald-400" />
          <span>Route & Load Optimization</span>
        </button>

        <button
          onClick={() => setActiveModule("predictive_pricing")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeModule === "predictive_pricing"
              ? "bg-[#0B3D2C] text-white border border-[#196349] shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-[#162228]"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          <span>Predictive Freight Pricing</span>
        </button>

        <button
          onClick={() => setActiveModule("cold_chain")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeModule === "cold_chain"
              ? "bg-[#0B3D2C] text-white border border-[#196349] shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-[#162228]"
          }`}
        >
          <Thermometer className="w-3.5 h-3.5 text-amber-400" />
          <span>Cold Chain & Shelf-Life Telemetry</span>
          {isExcursionAlarm && (
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveModule("carbon_accounting")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeModule === "carbon_accounting"
              ? "bg-[#0B3D2C] text-white border border-[#196349] shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-[#162228]"
          }`}
        >
          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          <span>Carbon Accounting & Multimodal Shift</span>
        </button>
      </div>

      {/* MODULE 1: AI ROUTE & LOAD OPTIMIZATION */}
      {activeModule === "route_load" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Configuration Panel */}
            <div className="lg:col-span-5 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1D2A32] pb-3">
                <div className="flex items-center gap-2">
                  <Route className="w-4 h-4 text-emerald-400" />
                  <span className="font-extrabold text-sm text-white">Cargo Requisition & Constraints</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                  Real-Time Feeds
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Origin Logistics Node</label>
                  <select
                    value={optOrigin}
                    onChange={(e) => setOptOrigin(e.target.value)}
                    className="w-full bg-[#162228] border border-[#1D2A32] rounded-xl px-3 py-2 text-white font-medium"
                  >
                    <option value="Kitwe Mining & Farming Depot, Zambia">Kitwe Mining & Farming Depot, Zambia</option>
                    <option value="Free State Silos (Kroonstad, South Africa)">Free State Silos (Kroonstad, South Africa)</option>
                    <option value="Nakuru Grain Aggregation Silo, Kenya">Nakuru Grain Aggregation Silo, Kenya</option>
                    <option value="Dawanau Grain Market (Kano, Nigeria)">Dawanau Grain Market (Kano, Nigeria)</option>
                    <option value="Kumasi Cocoa Aggregation Center, Ghana">Kumasi Cocoa Aggregation Center, Ghana</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Destination Gateway Port / Border</label>
                  <select
                    value={optDestination}
                    onChange={(e) => setOptDestination(e.target.value)}
                    className="w-full bg-[#162228] border border-[#1D2A32] rounded-xl px-3 py-2 text-white font-medium"
                  >
                    <option value="Port of Lobito (Atlantic Terminal), Angola">Port of Lobito (Atlantic Terminal), Angola</option>
                    <option value="Port of Durban Pier 1 Terminal, South Africa">Port of Durban Pier 1 Terminal, South Africa</option>
                    <option value="Mombasa Port Berths 21-22, Kenya">Mombasa Port Berths 21-22, Kenya</option>
                    <option value="Lagos Apapa Port Terminal, Nigeria">Lagos Apapa Port Terminal, Nigeria</option>
                    <option value="Tema Port Export Berths, Ghana">Tema Port Export Berths, Ghana</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Commodity Type</label>
                    <select
                      value={optCargo}
                      onChange={(e) => setOptCargo(e.target.value)}
                      className="w-full bg-[#162228] border border-[#1D2A32] rounded-xl px-3 py-2 text-white font-medium"
                    >
                      <option value="Grade-A Non-GMO Soya Beans">Grade-A Non-GMO Soya Beans</option>
                      <option value="White Maize Bulk">White Maize Bulk</option>
                      <option value="Reefer Avocados (Hass)">Reefer Avocados (Hass)</option>
                      <option value="Fermented Cocoa Beans">Fermented Cocoa Beans</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Consignment Weight</label>
                    <div className="flex items-center bg-[#162228] border border-[#1D2A32] rounded-xl px-3 py-1.5 text-white">
                      <input
                        type="number"
                        value={optWeightTonnes}
                        onChange={(e) => setOptWeightTonnes(Number(e.target.value))}
                        className="w-full bg-transparent outline-none font-mono text-sm"
                      />
                      <span className="text-[11px] text-slate-400 font-mono">MT</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer bg-[#162228] p-3 rounded-xl border border-[#1D2A32]">
                    <input
                      type="checkbox"
                      checked={optDeadheadAvoidance}
                      onChange={(e) => setOptDeadheadAvoidance(e.target.checked)}
                      className="accent-emerald-500 rounded"
                    />
                    <div>
                      <div className="font-bold text-white text-xs">Autonomous Backhaul Matching</div>
                      <div className="text-[11px] text-slate-400">
                        Scan reverse corridor supply chains to match return-cargo and eliminate empty return trips.
                      </div>
                    </div>
                  </label>
                </div>

                <button
                  onClick={handleRunRouteOptimizer}
                  disabled={isOptimizingRoute}
                  className="w-full py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs shadow-md border border-[#14533C] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isOptimizingRoute ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-300" />
                      <span>Computing Intermodal Route & Corridors...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Run AI Route & Load Optimization</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Optimization Results & Comparison */}
            <div className="lg:col-span-7 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1D2A32] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="font-extrabold text-sm text-white">AI Recommended Operational Solution</span>
                </div>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-800">
                  98.4% Confidence Score
                </span>
              </div>

              {routeOptimizedResult && (
                <div className="space-y-4">
                  {/* Recommended Routing Card */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#0B2E24]/60 to-[#12222E]/60 border border-emerald-500/30">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-mono text-emerald-400 uppercase font-bold">
                        Top Optimized Path
                      </div>
                      <span className="text-xs font-bold text-emerald-300 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                        Save ${routeOptimizedResult.totalSavingsUSD.toLocaleString()} USD
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-white mt-1">
                      {routeOptimizedResult.recommendedCorridor}
                    </h4>

                    {/* Corridor Milestone Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#1D2A32]/60">
                      <div className="bg-[#10171B]/80 p-2 rounded-lg border border-[#1D2A32]">
                        <div className="text-[10px] text-slate-400">Distance</div>
                        <div className="font-mono text-xs font-bold text-white">{routeOptimizedResult.distanceKm} km</div>
                      </div>
                      <div className="bg-[#10171B]/80 p-2 rounded-lg border border-[#1D2A32]">
                        <div className="text-[10px] text-slate-400">Total Transit</div>
                        <div className="font-mono text-xs font-bold text-cyan-300">{routeOptimizedResult.transitHours}h door-to-port</div>
                      </div>
                      <div className="bg-[#10171B]/80 p-2 rounded-lg border border-[#1D2A32]">
                        <div className="text-[10px] text-slate-400">Border Delay ETA</div>
                        <div className="font-mono text-xs font-bold text-emerald-300">{routeOptimizedResult.borderDelayHours}h (OSBP Fastrack)</div>
                      </div>
                      <div className="bg-[#10171B]/80 p-2 rounded-lg border border-[#1D2A32]">
                        <div className="text-[10px] text-slate-400">Estimated Fuel</div>
                        <div className="font-mono text-xs font-bold text-amber-300">${routeOptimizedResult.fuelCostUSD} USD</div>
                      </div>
                    </div>
                  </div>

                  {/* Return Load Opportunity Card */}
                  {routeOptimizedResult.returnLoadMatched && (
                    <div className="p-4 rounded-xl bg-[#162228] border border-cyan-800/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Matched Return-Haul Contract (0% Deadheading)</span>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-cyan-200 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-700">
                          +${routeOptimizedResult.returnLoadMatched.revenueUSD.toLocaleString()} Revenue
                        </span>
                      </div>
                      <div className="text-xs text-white font-medium">
                        {routeOptimizedResult.returnLoadMatched.cargo}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                        <span>Shipper: {routeOptimizedResult.returnLoadMatched.shipper}</span>
                        <span>•</span>
                        <span>Route: {routeOptimizedResult.returnLoadMatched.origin} to {routeOptimizedResult.returnLoadMatched.destination}</span>
                      </div>
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => showToast(`Backhaul contract ${routeOptimizedResult.returnLoadMatched?.loadId} pre-booked!`)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-900 hover:bg-cyan-800 text-cyan-100 text-xs font-bold cursor-pointer transition-all"
                        >
                          Lock Backhaul Contract
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Consolidations & Multi-Shipper Match */}
                  <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span className="text-slate-300">
                        Consolidated LTL cargo available along route: <strong className="text-white">+18 MT Dry Pulses</strong> (adds $1,120 net margin)
                      </span>
                    </div>
                    <button
                      onClick={() => showToast("Added 18 MT complementary cargo into consolidation manifesto.")}
                      className="px-3 py-1 rounded bg-[#0B3D2C] text-emerald-200 text-[11px] font-bold hover:bg-[#0E4B37] cursor-pointer"
                    >
                      Consolidate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: PREDICTIVE FREIGHT PRICING */}
      {activeModule === "predictive_pricing" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Tariff Simulator Parameters */}
            <div className="lg:col-span-5 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1D2A32] pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span className="font-extrabold text-sm text-white">Freight Tariff Forecasting Drivers</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  ML Tariff Engine v4.2
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Corridor Segment</label>
                  <select
                    value={priceCorridor}
                    onChange={(e) => setPriceCorridor(e.target.value)}
                    className="w-full bg-[#162228] border border-[#1D2A32] rounded-xl px-3 py-2 text-white font-medium"
                  >
                    <option value="Lusaka -> Lobito Atlantic Gateway">Lusaka to Lobito Atlantic Gateway (1,480 km)</option>
                    <option value="Free State Silos -> Durban Port">Free State Silos to Durban Port (560 km)</option>
                    <option value="Kano Silo -> Lagos Apapa Pier">Kano Silo to Lagos Apapa Pier (980 km)</option>
                    <option value="Eldoret Depot -> Mombasa Berths">Eldoret Depot to Mombasa Berths (840 km)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Consignment Volume (Tonnes)</label>
                  <div className="flex items-center bg-[#162228] border border-[#1D2A32] rounded-xl px-3 py-2 text-white">
                    <input
                      type="number"
                      value={priceTonnage}
                      onChange={(e) => setPriceTonnage(Number(e.target.value))}
                      className="w-full bg-transparent outline-none font-mono"
                    />
                    <span className="text-slate-400 font-mono">MT</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Diesel Volatility Benchmark Index</span>
                    <span className="font-mono text-white font-bold">${dieselPriceIndex.toFixed(2)} / Litre</span>
                  </div>
                  <input
                    type="range"
                    min="1.00"
                    max="2.20"
                    step="0.05"
                    value={dieselPriceIndex}
                    onChange={(e) => setDieselPriceIndex(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>$1.00/L (Low)</span>
                    <span>$1.50/L (Baseline)</span>
                    <span>$2.20/L (High Spike)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer bg-[#162228] p-3 rounded-xl border border-[#1D2A32]">
                    <input
                      type="checkbox"
                      checked={harvestSurgeSeason}
                      onChange={(e) => setHarvestSurgeSeason(e.target.checked)}
                      className="accent-cyan-500 rounded"
                    />
                    <div>
                      <div className="font-bold text-white text-xs">Peak Harvest Demand Factor (+22%)</div>
                      <div className="text-[11px] text-slate-400">
                        Factor in high seasonal outbound grain rush and carrier truck tightness.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Predictive Rate Output Card */}
            <div className="lg:col-span-7 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1D2A32] pb-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span className="font-extrabold text-sm text-white">Dynamic Rate Guidance & Hedging</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                  30-Day Forward Forecast
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Spot Rate */}
                <div className="bg-[#162228] p-4 rounded-xl border border-[#1D2A32] space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Immediate Spot Tariff</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-white font-mono">${spotRatePerTonne}</span>
                    <span className="text-xs text-slate-400">/ MT</span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    Total consignment: <strong className="text-white">${(spotRatePerTonne * priceTonnage).toLocaleString()} USD</strong>
                  </div>
                  <div className="text-[11px] text-amber-300 flex items-center gap-1 font-mono pt-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Projected Trend: {predicted30DayTrend}</span>
                  </div>
                </div>

                {/* Forward Volume Contract */}
                <div className="bg-gradient-to-br from-[#0B3D2C]/40 to-[#12222E]/40 p-4 rounded-xl border border-emerald-500/40 space-y-2">
                  <div className="text-[11px] font-mono text-emerald-400 uppercase font-bold">Forward Hedged Contract</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-emerald-300 font-mono">${contractRatePerTonne}</span>
                    <span className="text-xs text-emerald-400">/ MT</span>
                  </div>
                  <div className="text-xs text-emerald-100 font-medium">
                    Total consignment: <strong className="text-white">${(contractRatePerTonne * priceTonnage).toLocaleString()} USD</strong>
                  </div>
                  <div className="text-[11px] text-emerald-300 flex items-center gap-1 font-mono pt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Guaranteed Capacity SLA (12% Savings)</span>
                  </div>
                </div>
              </div>

              {/* 30-Day Historical and Predictive Forecast Graph */}
              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">30-Day Forward Rate Curve Prediction</span>
                  <div className="flex items-center gap-3 text-[10px] font-mono">
                    <span className="flex items-center gap-1 text-slate-400">
                      <span className="w-2.5 h-0.5 bg-slate-500" /> Historical
                    </span>
                    <span className="flex items-center gap-1 text-cyan-300">
                      <span className="w-2.5 h-0.5 bg-cyan-400" /> AI Median Forecast
                    </span>
                    <span className="flex items-center gap-1 text-purple-300">
                      <span className="w-2.5 h-0.5 bg-purple-400" /> Confidence Corridor
                    </span>
                  </div>
                </div>

                {/* SVG Curve */}
                <div className="h-32 w-full bg-[#0B1013] rounded-lg p-2 flex items-center justify-center">
                  <svg viewBox="0 0 400 100" className="w-full h-full">
                    {/* Confidence band */}
                    <polygon
                      points="200,50 250,42 300,35 350,28 390,22 390,58 350,55 300,58 250,62 200,68"
                      fill="#8B5CF6"
                      opacity="0.15"
                    />
                    {/* Historical line */}
                    <polyline
                      points="10,65 50,62 90,68 130,58 170,55 200,58"
                      fill="none"
                      stroke="#64748B"
                      strokeWidth="2.5"
                    />
                    {/* Forecast line */}
                    <polyline
                      points="200,58 240,50 280,44 320,38 360,32 395,26"
                      fill="none"
                      stroke="#22D3EE"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />
                    <circle cx="200" cy="58" r="4" fill="#22D3EE" />
                    <text x="180" y="78" fill="#94A3B8" fontSize="8" fontFamily="monospace">Today</text>
                    <text x="350" y="20" fill="#22D3EE" fontSize="8" fontFamily="monospace">+7.4% High</text>
                  </svg>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[11px] text-slate-400">
                    Recommendation: <strong>Lock 90-day forward master service agreement</strong> before harvest peak.
                  </span>
                  <button
                    onClick={() => showToast("Rate agreement quotation generated and added to Trade Finance")}
                    className="px-3 py-1.5 rounded-lg bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold cursor-pointer"
                  >
                    Lock Forward Rate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: COLD CHAIN & SHELF-LIFE TELEMETRY */}
      {activeModule === "cold_chain" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Real-Time Reefer IoT Telemetry Dashboard */}
            <div className="lg:col-span-6 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1D2A32] pb-3">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-amber-400" />
                  <span className="font-extrabold text-sm text-white">Reefer Container IoT Telemetry</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-300">Carrier #TRK-REEF-8842</span>
                </div>
              </div>

              {/* Cargo Identification */}
              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-mono">Consigned Cargo</div>
                  <div className="font-extrabold text-white text-sm">{cargoType}</div>
                </div>
                <span className="font-mono text-xs text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
                  Target: {reeferTargetTemp.toFixed(1)}°C
                </span>
              </div>

              {/* Telemetry Sensor Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Temperature */}
                <div className={`p-3 rounded-xl border ${
                  isExcursionAlarm
                    ? "bg-red-950/40 border-red-800 text-red-200"
                    : "bg-[#162228] border-[#1D2A32] text-slate-100"
                }`}>
                  <div className="text-[10px] uppercase font-mono text-slate-400">Current Temp</div>
                  <div className="text-2xl font-extrabold font-mono mt-1">
                    {reeferTemp.toFixed(1)}°C
                  </div>
                  <div className="text-[10px] mt-1 text-slate-400">
                    Ambient: {ambientTemp.toFixed(1)}°C
                  </div>
                </div>

                {/* Relative Humidity */}
                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                  <div className="text-[10px] uppercase font-mono text-slate-400">Relative Humidity</div>
                  <div className="text-2xl font-extrabold text-cyan-300 font-mono mt-1">
                    {reeferHumidity}%
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1">Optimal Range: 88-95%</div>
                </div>

                {/* Battery & Genset */}
                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                  <div className="text-[10px] uppercase font-mono text-slate-400">Genset Battery</div>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                    {batteryLevel}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Status: Normal Auto</div>
                </div>
              </div>

              {/* Excursion Simulator Controls */}
              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Interactive Reefer Excursion Test</span>
                  <span className="text-[10px] font-mono text-slate-400">Simulate HVAC failure or door breach</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Reefer Internal Temp Test Slider</span>
                    <span className="font-mono font-bold text-white">{reeferTemp.toFixed(1)}°C</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="14.0"
                    step="0.2"
                    value={reeferTemp}
                    onChange={(e) => setReeferTemp(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>1.0°C (Cold)</span>
                    <span>3.0°C (Optimal)</span>
                    <span>6.0°C (Threshold)</span>
                    <span>14.0°C (Degradation)</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setReeferTemp(3.2);
                      setDoorOpenCount(1);
                      showToast("Reefer HVAC reset to nominal 3.0°C setpoint");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold cursor-pointer transition-all"
                  >
                    Reset to Nominal
                  </button>
                  <button
                    onClick={() => {
                      setReeferTemp(8.6);
                      setDoorOpenCount((prev) => prev + 1);
                      showToast("Warning: Simulated high ambient thermal excursion!");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-100 text-xs font-bold cursor-pointer transition-all"
                  >
                    Simulate Excursion (8.6°C)
                  </button>
                </div>
              </div>
            </div>

            {/* AI Shelf-Life Arrhenius Model & Automated Contingency Routing */}
            <div className="lg:col-span-6 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1D2A32] pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="font-extrabold text-sm text-white">Dynamic Spoilage & Shelf-Life Model</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                  Arrhenius Bio-Decay Model
                </span>
              </div>

              {/* Degradation Metric Card */}
              <div className={`p-4 rounded-xl border ${
                isExcursionAlarm
                  ? "bg-red-950/30 border-red-700/60"
                  : "bg-[#162228] border-[#1D2A32]"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">
                    Remaining Commercial Shelf-Life
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isExcursionAlarm
                      ? "bg-red-900 text-red-200"
                      : "bg-[#07261B] text-emerald-300"
                  }`}>
                    {shelfLifeHealthPct}% Viability
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    {shelfLifeRemainingDays} Days
                  </span>
                  <span className="text-xs text-slate-400">at current {reeferTemp.toFixed(1)}°C exposure</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#0B1013] h-2.5 rounded-full overflow-hidden mt-3">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      shelfLifeRemainingDays < 5
                        ? "bg-red-500"
                        : shelfLifeRemainingDays < 12
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${shelfLifeHealthPct}%` }}
                  />
                </div>
              </div>

              {/* Automated AI Exception & Re-Routing Trigger */}
              {isExcursionAlarm ? (
                <div className="p-4 bg-red-950/40 border border-red-700 rounded-xl space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="text-sm font-extrabold text-red-200">
                        CRITICAL: Reefer Excursion Threshold Exceeded ({reeferTemp.toFixed(1)}°C)
                      </h4>
                      <p className="text-xs text-red-300 mt-0.5">
                        Produce will degrade below export supermarket standard before reaching target port. AI re-routing trigger initiated.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#10171B] rounded-lg border border-red-800/60 text-xs space-y-1.5">
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>Emergency Cross-Dock Diversion Recommendation:</span>
                      <span className="text-emerald-400 font-mono">38 km Away</span>
                    </div>
                    <div className="text-slate-300">
                      Reroute to <strong>Huambo Central Cold Storage Hub (Angola)</strong> for immediate flash precooling or domestic cannery dispatch.
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => showToast("Emergency re-routing coordinates transmitted to driver & telemetry unit!")}
                      className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
                    >
                      Authorize Immediate Reroute
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#162228] border border-emerald-900/50 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Cold Chain Integrity Compliant with EU & AfCFTA Export Rules</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Produce core temperature remains within the tight ±0.8°C envelope. Estimated ETA at port is 28 hours, with 22.8 days of post-arrival retail shelf life remaining.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4: CARBON ACCOUNTING & MULTIMODAL SHIFT */}
      {activeModule === "carbon_accounting" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input & Parameters */}
            <div className="lg:col-span-5 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1D2A32] pb-3">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <span className="font-extrabold text-sm text-white">Consignment Green Parameters</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                  GHG Scope 3 Protocol
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Consignment Total Tonnage</label>
                  <div className="flex items-center bg-[#162228] border border-[#1D2A32] rounded-xl px-3 py-2 text-white">
                    <input
                      type="number"
                      value={carbonTonnes}
                      onChange={(e) => setCarbonTonnes(Number(e.target.value))}
                      className="w-full bg-transparent outline-none font-mono"
                    />
                    <span className="text-slate-400 font-mono">MT</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Corridor Distance (km)</label>
                  <div className="flex items-center bg-[#162228] border border-[#1D2A32] rounded-xl px-3 py-2 text-white">
                    <input
                      type="number"
                      value={carbonDistanceKm}
                      onChange={(e) => setCarbonDistanceKm(Number(e.target.value))}
                      className="w-full bg-transparent outline-none font-mono"
                    />
                    <span className="text-slate-400 font-mono">km</span>
                  </div>
                </div>

                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1 text-slate-300 text-[11px]">
                  <div className="font-bold text-white">Verified Emission Factors (GLEC Framework):</div>
                  <div className="flex justify-between">
                    <span>Heavy Long-Haul Truck (Diesel):</span>
                    <strong className="font-mono text-slate-200">62 g CO2e / t-km</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Lobito Multimodal Rail (CFB):</span>
                    <strong className="font-mono text-emerald-300">19 g CO2e / t-km</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Inland Waterway Barge:</span>
                    <strong className="font-mono text-cyan-300">24 g CO2e / t-km</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Multimodal Carbon Reduction Comparison Card */}
            <div className="lg:col-span-7 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1D2A32] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="font-extrabold text-sm text-white">Multimodal Shift Impact</span>
                </div>
                <span className="text-xs font-bold text-emerald-300 bg-[#07261B] px-2.5 py-0.5 rounded-full border border-[#14533C]">
                  -{carbonCutPct}% CO2 Emissions
                </span>
              </div>

              {/* Road vs Rail Comparison Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Traditional Highway Convoy */}
                <div className="bg-[#162228] p-4 rounded-xl border border-[#1D2A32] space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Conventional Highway (Truck Convoy)</span>
                  </div>
                  <div className="text-2xl font-extrabold text-red-300 font-mono">
                    {roadEmissionsTotalTons.toFixed(1)} MT CO2e
                  </div>
                  <div className="text-xs text-slate-400">
                    Requires 22 separate heavy truck convoys with high road wear and fuel burn.
                  </div>
                </div>

                {/* Lobito Rail Shift */}
                <div className="bg-gradient-to-br from-[#0B3D2C]/40 to-[#12222E]/40 p-4 rounded-xl border border-emerald-500/40 space-y-2">
                  <div className="text-[11px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                    <Train className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Multimodal Lobito Rail Shift</span>
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-300 font-mono">
                    {railEmissionsTotalTons.toFixed(1)} MT CO2e
                  </div>
                  <div className="text-xs text-emerald-200">
                    Consolidated on single 40-wagon CFB rail freight consist directly to deep-water berths.
                  </div>
                </div>
              </div>

              {/* ESG Carbon Credit Monetization */}
              <div className="p-4 bg-[#162228] rounded-xl border border-emerald-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-mono text-emerald-400 font-bold">
                      AfCFTA Green Freight Credit Monetization
                    </div>
                    <div className="text-sm font-extrabold text-white mt-0.5">
                      Net Carbon Abatement: {carbonSavedTons.toFixed(1)} MT CO2e
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-mono font-extrabold text-emerald-300">
                      ${carbonCreditValueUSD.toLocaleString()} USD
                    </div>
                    <div className="text-[10px] text-slate-400">Carbon offset value ($16.50/t)</div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#1D2A32]">
                  <button
                    onClick={() => showToast("AfCFTA Green Multimodal Carbon Certificate generated and exported as PDF")}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Download AfCFTA Carbon Certificate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
