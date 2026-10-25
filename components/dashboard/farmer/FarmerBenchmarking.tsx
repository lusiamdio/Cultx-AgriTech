import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Layers,
  Sprout,
  Droplet,
  DollarSign,
  ShieldCheck,
  Award,
  Sparkles,
  Info,
  ChevronRight,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Percent,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  Globe2,
  Users,
} from "lucide-react";
import { useApp } from "../../../context/AppContext";

export const FarmerBenchmarking: React.FC = () => {
  const { currentFarm, selectedCountry } = useApp();

  const [selectedCrop, setSelectedCrop] = useState<string>("Maize (White & Yellow)");
  const [selectedCohort, setSelectedCohort] = useState<string>("Regional Agro-Ecological Peer Group");
  const [selectedScale, setSelectedScale] = useState<string>("Emerging Commercial (5-50 ha)");
  const [activeMetricTab, setActiveMetricTab] = useState<"yields" | "inputs" | "financials" | "gap_analysis">("yields");

  // What-If Simulation State
  const [adoptedPractices, setAdoptedPractices] = useState<{
    splitFertilizer: boolean;
    precisionSeeding: boolean;
    hermeticSilos: boolean;
    soilpHBalancing: boolean;
  }>({
    splitFertilizer: true,
    precisionSeeding: false,
    hermeticSilos: true,
    soilpHBalancing: false,
  });

  const togglePractice = (key: keyof typeof adoptedPractices) => {
    setAdoptedPractices((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Base metrics for active farm / cooperative
  const farmYield = 7.42; // t/ha
  const regionalMedianYield = 5.85; // t/ha
  const top10FrontierYield = 8.90; // t/ha
  const nationalAverageYield = 4.40; // t/ha

  // Calculate potential uplift from What-If gaps
  const potentialUplift =
    (adoptedPractices.precisionSeeding ? 0.65 : 0) +
    (adoptedPractices.soilpHBalancing ? 0.55 : 0) +
    (adoptedPractices.splitFertilizer ? 0.40 : 0) +
    (adoptedPractices.hermeticSilos ? 0.30 : 0);

  const simulatedYield = (farmYield + potentialUplift).toFixed(2);
  const revenuePerHa = (Number(simulatedYield) * 265).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-[#07261B] px-2.5 py-0.5 rounded border border-[#14533C] flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Peer Benchmarking Engine</span>
            </span>
            <span className="text-xs font-mono font-bold text-cyan-300 bg-[#082835] px-2 py-0.5 rounded border border-[#10485E]">
              k-Anonymity Verified (Cohort: 148 Peer Farms)
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
            Anonymous Regional Performance & Best Practice Benchmarking
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Compare agricultural yields, input utilization efficiency, and financial unit economics anonymously against top-decile regional agro-ecological peers.
          </p>
        </div>

        {/* Cohort & Commodity Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Commodity</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-3 py-1.5 bg-[#162228] text-white text-xs font-semibold rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
            >
              <option value="Maize (White & Yellow)">Maize (Grain)</option>
              <option value="Soybeans">Soybeans (Oilseed)</option>
              <option value="Cocoa Beans">Cocoa (Export Grade)</option>
              <option value="Wheat">Winter Wheat</option>
              <option value="Irrigated Rice">Paddy Rice</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Scale Cohort</label>
            <select
              value={selectedScale}
              onChange={(e) => setSelectedScale(e.target.value)}
              className="px-3 py-1.5 bg-[#162228] text-white text-xs font-semibold rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
            >
              <option value="Smallholder (<5 ha)">Smallholder (&lt;5 ha)</option>
              <option value="Emerging Commercial (5-50 ha)">Emerging (5-50 ha)</option>
              <option value="Commercial (>50 ha)">Commercial (&gt;50 ha)</option>
              <option value="Cooperative Outgrower Aggregated">Cooperative Aggregated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Anonymous Privacy & Data Protection Guarantee */}
      <div className="p-3.5 bg-[#07261B] rounded-xl border border-[#14533C] text-xs text-emerald-200 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Strict Anonymous Peer Privacy:</strong> Benchmarking cohorts require a minimum of 40 verified farms in your agro-ecological micro-zone. No individual farmer identities, GPS boundary coordinates, or proprietary buyer pricing are ever exposed. All peer data is aggregated with differential privacy noise.
        </div>
      </div>

      {/* Executive Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Yield Percentile</div>
          <div className="text-2xl font-mono font-extrabold text-emerald-400">82nd</div>
          <div className="text-[10px] text-emerald-300 mt-0.5">+26.8% vs Regional Median</div>
        </div>

        <div className="p-4 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Unit Production Cost</div>
          <div className="text-2xl font-mono font-extrabold text-white">$191 / t</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Top 20% Cost Efficiency</div>
        </div>

        <div className="p-4 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fertilizer Efficiency</div>
          <div className="text-2xl font-mono font-extrabold text-cyan-400">28 kg NPK/t</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Peer median: 38 kg/t</div>
        </div>

        <div className="p-4 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Frontier Yield Gap</div>
          <div className="text-2xl font-mono font-extrabold text-amber-300">-1.48 t/ha</div>
          <div className="text-[10px] text-amber-300/80 mt-0.5">Potential: +$392/ha Net Margin</div>
        </div>
      </div>

      {/* Benchmarking Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#10171B] p-2 rounded-2xl border border-[#1D2A32]">
        <button
          onClick={() => setActiveMetricTab("yields")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeMetricTab === "yields"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Sprout className="w-4 h-4 text-emerald-400" />
          <span>Regional Agricultural Yields</span>
        </button>

        <button
          onClick={() => setActiveMetricTab("inputs")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeMetricTab === "inputs"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Droplet className="w-4 h-4 text-cyan-400" />
          <span>Input Utilization Efficiency</span>
        </button>

        <button
          onClick={() => setActiveMetricTab("financials")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeMetricTab === "financials"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <DollarSign className="w-4 h-4 text-amber-400" />
          <span>Financial Performance & Unit Costs</span>
        </button>

        <button
          onClick={() => setActiveMetricTab("gap_analysis")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeMetricTab === "gap_analysis"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Best Practice Gap Analysis & Roadmap</span>
        </button>
      </div>

      {/* PILLAR 1: REGIONAL AGRICULTURAL YIELDS BENCHMARK */}
      {activeMetricTab === "yields" && (
        <div className="space-y-4">
          <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] gap-2">
              <div>
                <h3 className="font-extrabold text-sm text-white">
                  Regional Yield Benchmark Comparison ({selectedCrop})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Grounded on verified multi-year satellite NDVI and weighing bridge receipts across 148 regional peer farms.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-[#07261B] px-3 py-1 rounded-xl border border-[#14533C]">
                Your Yield: {farmYield} t/ha
              </span>
            </div>

            {/* Comparison Bars */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span>Your Farm / Cooperative ({currentFarm.name})</span>
                  </span>
                  <span className="font-mono text-emerald-300 font-bold">{farmYield} t/ha (82nd Percentile)</span>
                </div>
                <div className="w-full bg-[#162228] h-4 rounded-full overflow-hidden p-0.5 border border-[#1D2A32]">
                  <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full" style={{ width: `${(farmYield / 10) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-purple-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                    <span>Top 10% Regional Frontier (Best Practice Leaders)</span>
                  </span>
                  <span className="font-mono text-purple-300 font-bold">{top10FrontierYield} t/ha (Top Decile)</span>
                </div>
                <div className="w-full bg-[#162228] h-4 rounded-full overflow-hidden p-0.5 border border-[#1D2A32]">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-full rounded-full" style={{ width: `${(top10FrontierYield / 10) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    <span>Regional Agro-Ecological Median</span>
                  </span>
                  <span className="font-mono text-slate-300 font-bold">{regionalMedianYield} t/ha (Median)</span>
                </div>
                <div className="w-full bg-[#162228] h-4 rounded-full overflow-hidden p-0.5 border border-[#1D2A32]">
                  <div className="bg-slate-500 h-full rounded-full" style={{ width: `${(regionalMedianYield / 10) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                    <span>National Smallholder Average</span>
                  </span>
                  <span className="font-mono text-slate-400 font-bold">{nationalAverageYield} t/ha</span>
                </div>
                <div className="w-full bg-[#162228] h-4 rounded-full overflow-hidden p-0.5 border border-[#1D2A32]">
                  <div className="bg-slate-700 h-full rounded-full" style={{ width: `${(nationalAverageYield / 10) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Historical Yield Consistency Curve */}
            <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
              <h4 className="font-bold text-xs text-white">3-Season Yield Consistency vs Regional Peaking</h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-[#10171B] rounded-lg border border-[#1D2A32]">
                  <div className="text-[10px] text-slate-400">2024 Season</div>
                  <div className="text-lg font-mono font-bold text-white mt-1">6.80 t/ha</div>
                  <div className="text-[10px] text-emerald-400">+1.2 t/ha vs Median</div>
                </div>

                <div className="p-3 bg-[#10171B] rounded-lg border border-[#1D2A32]">
                  <div className="text-[10px] text-slate-400">2025 Season</div>
                  <div className="text-lg font-mono font-bold text-white mt-1">7.15 t/ha</div>
                  <div className="text-[10px] text-emerald-400">+1.4 t/ha vs Median</div>
                </div>

                <div className="p-3 bg-[#10171B] rounded-lg border border-[#1D2A32]">
                  <div className="text-[10px] text-slate-400">2026 Forecast</div>
                  <div className="text-lg font-mono font-bold text-emerald-400 mt-1">7.42 t/ha</div>
                  <div className="text-[10px] text-emerald-300">+1.57 t/ha vs Median</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PILLAR 2: INPUT UTILIZATION EFFICIENCY */}
      {activeMetricTab === "inputs" && (
        <div className="space-y-4">
          <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] gap-2">
              <div>
                <h3 className="font-extrabold text-sm text-white">
                  Agronomic Input Utilization Efficiency
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Measures resource efficiency per unit of output produced to detect over-application and soil toxicity risks.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-[#082835] px-3 py-1 rounded-xl border border-[#10485E]">
                High Resource Efficiency
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Fertilizer Efficiency */}
              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Fertilizer Intensity (kg NPK / MT Grain)</span>
                  <span className="font-mono text-emerald-400 font-bold">28 kg / MT</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Regional Median: 38 kg / MT • Top 10% Leaders: 24 kg / MT
                </div>
                <p className="text-[11px] text-slate-400">
                  You are utilizing 26% less fertilizer per tonne than regional peers due to split-banding nitrogen application at V6 growth stage.
                </p>
                <div className="pt-2 border-t border-[#1D2A32] text-[10px] font-mono text-emerald-300">
                  Efficiency Rating: Excellent (Low Runoff & Low Soil Acidity Impact)
                </div>
              </div>

              {/* Water Productivity */}
              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Water Productivity (m³ Water / MT Grain)</span>
                  <span className="font-mono text-cyan-400 font-bold">480 m³ / MT</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Regional Median: 620 m³ / MT • Top 10% Leaders: 410 m³ / MT
                </div>
                <p className="text-[11px] text-slate-400">
                  Soil moisture sensor automation reduced supplementary irrigation cycles by 22% while safeguarding tasseling yield.
                </p>
                <div className="pt-2 border-t border-[#1D2A32] text-[10px] font-mono text-cyan-300">
                  Efficiency Rating: High (140 m³/MT Water Conserved)
                </div>
              </div>

              {/* Seed Germination & Seeding Density */}
              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Certified Seed Germination Rate</span>
                  <span className="font-mono text-emerald-400 font-bold">98.2%</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Regional Median: 84.0% • Top 10% Leaders: 99.0%
                </div>
                <p className="text-[11px] text-slate-400">
                  Certified hybrid seed varieties purchased through accredited AfCFTA seed dealers ensured optimal plant stand uniformity.
                </p>
                <div className="pt-2 border-t border-[#1D2A32] text-[10px] font-mono text-emerald-300">
                  Efficiency Rating: Tier-1 Certified
                </div>
              </div>

              {/* Crop Protection Frequency */}
              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Pesticide Spray Frequency (Passes/Season)</span>
                  <span className="font-mono text-white font-bold">2 Targeted Passes</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Regional Median: 4.2 Passes • Codex MRL Target: &lt;= 3 Passes
                </div>
                <p className="text-[11px] text-slate-400">
                  Early AI scout traps prevented fall armyworm outbreak without excessive broad-spectrum organophosphate applications.
                </p>
                <div className="pt-2 border-t border-[#1D2A32] text-[10px] font-mono text-emerald-300">
                  Codex MRL Chemical Residue Compliance: 100% Passed
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PILLAR 3: FINANCIAL PERFORMANCE & UNIT COSTS */}
      {activeMetricTab === "financials" && (
        <div className="space-y-4">
          <div className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] gap-2">
              <div>
                <h3 className="font-extrabold text-sm text-white">
                  Financial Performance & Production Economics Benchmark
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Unit cost of production, net margins, and debt repayment safety margins compared against regional peers.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-[#07261B] px-3 py-1 rounded-xl border border-[#14533C]">
                Gross Margin: $1,080 / ha
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Cost of Production per Hectare</div>
                <div className="text-xl font-mono font-extrabold text-white mt-1">$1,420 / ha</div>
                <div className="text-[11px] text-emerald-400 font-semibold">-$260 / ha vs Median ($1,680)</div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Saved on bulk seed procurement and solar irrigation pumping vs diesel gensets.
                </p>
              </div>

              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Cost of Production per MT</div>
                <div className="text-xl font-mono font-extrabold text-emerald-400 mt-1">$191 / MT</div>
                <div className="text-[11px] text-emerald-300 font-semibold">33.9% Lower than Median ($289)</div>
                <p className="text-[10px] text-slate-400 mt-1">
                  High yield dilution (7.42 t/ha) drives down unit breakeven cost substantially.
                </p>
              </div>

              <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Debt Service Coverage (DSCR)</div>
                <div className="text-xl font-mono font-extrabold text-cyan-400 mt-1">1.62x</div>
                <div className="text-[11px] text-cyan-300 font-semibold">Well above Bank Hurdle (1.30x)</div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Provides strong buffer against price volatility or delayed buyer settlement.
                </p>
              </div>
            </div>

            {/* Comprehensive Unit Economics Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#162228] text-slate-400 border-b border-[#1D2A32] text-[10px] uppercase font-bold">
                    <th className="p-3">Financial Metric</th>
                    <th className="p-3">Your Farm ({currentFarm.name})</th>
                    <th className="p-3">Regional Median</th>
                    <th className="p-3">Top 10% Leaders</th>
                    <th className="p-3">Competitive Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#19262F]">
                  <tr>
                    <td className="p-3 font-semibold text-white">Gross Revenue per Hectare</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">$2,500 / ha</td>
                    <td className="p-3 font-mono text-slate-300">$1,880 / ha</td>
                    <td className="p-3 font-mono text-purple-300">$3,020 / ha</td>
                    <td className="p-3 text-emerald-400 font-semibold">+$620 / ha (+33.0%)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Net Operating Margin</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">43.2%</td>
                    <td className="p-3 font-mono text-slate-300">22.4%</td>
                    <td className="p-3 font-mono text-purple-300">51.2%</td>
                    <td className="p-3 text-emerald-400 font-semibold">+20.8% Margin Lead</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Insurance Cost as % of Revenue</td>
                    <td className="p-3 font-mono font-bold text-white">3.8%</td>
                    <td className="p-3 font-mono text-slate-300">5.4%</td>
                    <td className="p-3 font-mono text-purple-300">3.2%</td>
                    <td className="p-3 text-emerald-400 font-semibold">-1.6% (Discounted)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Post-Harvest Grain Loss Rate</td>
                    <td className="p-3 font-mono font-bold text-cyan-400">3.4%</td>
                    <td className="p-3 font-mono text-slate-300">14.8%</td>
                    <td className="p-3 font-mono text-purple-300">1.2%</td>
                    <td className="p-3 text-emerald-400 font-semibold">+11.4% Loss Saved</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PILLAR 4: BEST PRACTICE GAP ANALYSIS & SIMULATOR */}
      {activeMetricTab === "gap_analysis" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Gap Analysis Simulator Controls */}
            <div className="lg:col-span-6 bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] space-y-4">
              <div className="pb-3 border-b border-[#19262F]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-[#250835] px-2 py-0.5 rounded border border-[#48105E]">
                  Actionable Uplift Roadmap
                </span>
                <h3 className="font-extrabold text-base text-white mt-1">
                  Closing the Frontier Yield & Cost Gap
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Toggle best practices adopted by regional top-decile producers to simulate your yield and revenue uplift.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {/* Practice 1 */}
                <div
                  onClick={() => togglePractice("precisionSeeding")}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    adoptedPractices.precisionSeeding
                      ? "bg-[#162228] border-emerald-500 shadow-sm"
                      : "bg-[#10171B] border-[#1D2A32] hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>Precision Seed Spacing & Variable Rate Metering</span>
                      {adoptedPractices.precisionSeeding && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Calibrates plant density to 62,000 stands/ha for uniform solar interception.
                    </p>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-xs shrink-0">+0.65 t/ha</span>
                </div>

                {/* Practice 2 */}
                <div
                  onClick={() => togglePractice("soilpHBalancing")}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    adoptedPractices.soilpHBalancing
                      ? "bg-[#162228] border-emerald-500 shadow-sm"
                      : "bg-[#10171B] border-[#1D2A32] hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>Soil Acidity Correction (Agricultural Lime + Zinc)</span>
                      {adoptedPractices.soilpHBalancing && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Restores soil pH from 5.2 to optimal 6.4 to unlock phosphorus uptake.
                    </p>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-xs shrink-0">+0.55 t/ha</span>
                </div>

                {/* Practice 3 */}
                <div
                  onClick={() => togglePractice("splitFertilizer")}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    adoptedPractices.splitFertilizer
                      ? "bg-[#162228] border-emerald-500 shadow-sm"
                      : "bg-[#10171B] border-[#1D2A32] hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>Split-Banding Nitrogen Application (Basal + V6 Top-Dress)</span>
                      {adoptedPractices.splitFertilizer && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Eliminates nutrient leaching by applying urea right before rapid elongation.
                    </p>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-xs shrink-0">+0.40 t/ha</span>
                </div>

                {/* Practice 4 */}
                <div
                  onClick={() => togglePractice("hermeticSilos")}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    adoptedPractices.hermeticSilos
                      ? "bg-[#162228] border-emerald-500 shadow-sm"
                      : "bg-[#10171B] border-[#1D2A32] hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>Hermetic Cocoon Grain Storage (Zero Insecticide Loss)</span>
                      {adoptedPractices.hermeticSilos && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Reduces storage post-harvest losses from 14% to under 1.5%.
                    </p>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-xs shrink-0">+0.30 t/ha</span>
                </div>
              </div>
            </div>

            {/* Gap Simulation Output */}
            <div className="lg:col-span-6 bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#19262F]">
                  <h4 className="font-bold text-sm text-white">Projected Frontier Convergence</h4>
                  <span className="text-[10px] font-mono text-emerald-400 bg-[#07261B] px-2.5 py-0.5 rounded border border-[#14533C]">
                    Simulated Output
                  </span>
                </div>

                <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] my-4 text-center space-y-2">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                    Projected Farm Yield with Selected Interventions
                  </div>
                  <div className="text-4xl font-mono font-extrabold text-emerald-400">
                    {simulatedYield} t/ha
                  </div>
                  <div className="text-xs font-semibold text-emerald-300">
                    +{potentialUplift.toFixed(2)} t/ha Yield Uplift ({((potentialUplift / farmYield) * 100).toFixed(1)}% gain)
                  </div>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto mt-2">
                    Adopting these selected practices closes {(((Number(simulatedYield) - farmYield) / (top10FrontierYield - farmYield)) * 100).toFixed(0)}% of the gap between your current operation and the top 10% regional frontier.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                    <div className="text-[10px] text-slate-400">Projected Revenue / ha</div>
                    <div className="text-xl font-mono font-extrabold text-white mt-1">
                      ${revenuePerHa}
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">
                      +${(Number(revenuePerHa) - (farmYield * 265)).toFixed(0)} / ha gain
                    </div>
                  </div>

                  <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                    <div className="text-[10px] text-slate-400">Top 10% Convergence</div>
                    <div className="text-xl font-mono font-extrabold text-purple-300 mt-1">
                      {((Number(simulatedYield) / top10FrontierYield) * 100).toFixed(0)}%
                    </div>
                    <div className="text-[10px] text-purple-300/80 mt-0.5">
                      Frontier: {top10FrontierYield} t/ha
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#19262F] flex items-center justify-between text-xs">
                <span className="text-slate-400">Recommendations verified by CGIAR & CIMMYT maize trials</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Agronomic Viability Cleared</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
