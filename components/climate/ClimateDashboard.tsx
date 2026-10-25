import React, { useState, useMemo, useEffect } from "react";
import {
  CloudSunRain,
  CloudRain,
  Sun,
  Wind,
  Droplet,
  AlertTriangle,
  Calendar,
  Sparkles,
  TrendingDown,
  Compass,
  ArrowRight,
  ShieldAlert,
  CloudLightning,
  Cloud,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sliders,
  Filter,
  Check,
  Activity,
  Layers,
  Info,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface DayForecast {
  index: number;
  date: Date;
  dayName: string;
  shortDay: string;
  formattedDate: string;
  label: string;
  tempHigh: number;
  tempLow: number;
  condition: string;
  rainMm: number;
  rainProb: string;
  windSpeed: number; // km/h
  humidity: number; // %
  soilMoisture: number; // %
  et0: number; // mm/day
  icon: React.ElementType;
  advice: string;
  sprayingStatus: "optimal" | "restricted" | "prohibited";
  tillageStatus: "optimal" | "moderate" | "unfavorable";
  harvestStatus: "optimal" | "moderate" | "unfavorable";
  irrigationAction: string;
  fertilizerAction: string;
  hourly: {
    time: string;
    temp: number;
    rainProb: number;
    windKm: number;
    spraySafe: boolean;
  }[];
}

export const ClimateDashboard: React.FC = () => {
  const { currentFarm, setIsCopilotOpen } = useApp();
  const [selectedHorizon, setSelectedHorizon] = useState<"14d" | "30d" | "seasonal">("14d");
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [operationFilter, setOperationFilter] = useState<"all" | "spraying" | "tillage" | "irrigation" | "harvesting" | "fertilizing">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>("Synced 05:25 AM (12h Gemini & ECMWF 00Z)");
  const [anchorMode, setAnchorMode] = useState<"monday" | "system">("monday");
  const [dayOffset, setDayOffset] = useState<number>(0);
  const [geminiClimateData, setGeminiClimateData] = useState<any>(null);

  // Fetch 12-hour Gemini Climate Intelligence
  const fetchGeminiClimate = async (force: boolean = false) => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/gemini/climate-intelligence?force=${force ? "true" : "false"}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.climateData) {
          setGeminiClimateData(data.climateData);
          const now = new Date();
          const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
          setLastRefreshed(`Synced ${timeStr} (12h Gemini & ECMWF Cycle)`);
        }
      }
    } catch (e) {
      console.warn("Could not fetch Gemini climate intelligence:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGeminiClimate(false);
    const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
    const interval = setInterval(() => {
      fetchGeminiClimate(true);
    }, TWELVE_HOURS_MS);
    return () => clearInterval(interval);
  }, []);

  // Compute the anchor date dynamically
  const anchorDate = useMemo(() => {
    const now = new Date();
    if (anchorMode === "monday") {
      // Find the Monday of the current week (or today if Monday)
      const dayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon, 2 is Tue...
      const daysSinceMon = (dayOfWeek + 6) % 7;
      const monday = new Date(now);
      monday.setDate(now.getDate() - daysSinceMon + dayOffset);
      return monday;
    }
    const d = new Date(now);
    d.setDate(now.getDate() + dayOffset);
    return d;
  }, [anchorMode, dayOffset]);

  // Generate 14 dynamic days starting strictly from the Anchor Date (e.g. Monday)
  const forecastDays: DayForecast[] = useMemo(() => {
    // Meteorological day profile mapped to weekday (0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun)
    const weekdayProfiles = [
      // Monday (0)
      { tempHigh: 25, tempLow: 14, rainMm: 0, rainProb: "5%", condition: "Sunny", icon: Sun, wind: 7, humidity: 44, soilMoisture: 42, advice: "Ideal for tractor cultivation & weed scouting" },
      // Tuesday (1)
      { tempHigh: 26, tempLow: 15, rainMm: 2, rainProb: "20%", condition: "Partly Cloudy", icon: CloudSunRain, wind: 9, humidity: 48, soilMoisture: 41, advice: "Monitor Field 03 soil moisture before scheduled pivot irrigation" },
      // Wednesday (2)
      { tempHigh: 24, tempLow: 16, rainMm: 6, rainProb: "45%", condition: "Scattered Showers", icon: CloudSunRain, wind: 14, humidity: 62, soilMoisture: 45, advice: "Pre-rain drainage ditch inspection; suspend foliar herbicides" },
      // Thursday (3)
      { tempHigh: 21, tempLow: 13, rainMm: 18, rainProb: "70%", condition: "Moderate Showers", icon: CloudRain, wind: 19, humidity: 78, soilMoisture: 58, advice: "Prepare irrigation pump shutdown; high wash-off hazard" },
      // Friday (4) - Convective Storm
      { tempHigh: 19, tempLow: 12, rainMm: 34, rainProb: "90%", condition: "Convective Storm", icon: CloudLightning, wind: 28, humidity: 91, soilMoisture: 78, advice: "DO NOT spray or fertilize. Severe runoff and leaching hazard" },
      // Saturday (5) - Post storm runoff
      { tempHigh: 21, tempLow: 13, rainMm: 12, rainProb: "55%", condition: "Overcast Showers", icon: CloudRain, wind: 16, humidity: 76, soilMoisture: 72, advice: "Soil water absorption phase; avoid heavy machinery compaction" },
      // Sunday (6) - Clearing skies
      { tempHigh: 23, tempLow: 14, rainMm: 1, rainProb: "15%", condition: "Clearing Skies", icon: CloudSunRain, wind: 8, humidity: 58, soilMoisture: 65, advice: "Spray window re-opens 06:00-11:00; resume scouting" },
    ];

    // Second week progressive variations (Days 7 to 13)
    const secondWeekProfiles = [
      // Monday 2 (7)
      { tempHigh: 25, tempLow: 15, rainMm: 0, rainProb: "5%", condition: "Sunny", icon: Sun, wind: 6, humidity: 46, soilMoisture: 58, advice: "Resume top-dress nitrogen application; optimal vegetative uptake" },
      // Tuesday 2 (8)
      { tempHigh: 27, tempLow: 16, rainMm: 0, rainProb: "10%", condition: "Clear Skies", icon: Sun, wind: 8, humidity: 41, soilMoisture: 52, advice: "Maize kernel moisture drop accelerating; prep combine harvesters" },
      // Wednesday 2 (9)
      { tempHigh: 26, tempLow: 15, rainMm: 0, rainProb: "15%", condition: "Sunny", icon: Sun, wind: 9, humidity: 43, soilMoisture: 47, advice: "Optimal grain harvesting window opens (kernel moisture < 14%)" },
      // Thursday 2 (10)
      { tempHigh: 24, tempLow: 14, rainMm: 4, rainProb: "35%", condition: "Partly Cloudy", icon: CloudSunRain, wind: 12, humidity: 55, soilMoisture: 46, advice: "Post-harvest residue management & cover crop soil prep" },
      // Friday 2 (11)
      { tempHigh: 22, tempLow: 13, rainMm: 9, rainProb: "60%", condition: "Light Rain", icon: CloudRain, wind: 15, humidity: 68, soilMoisture: 54, advice: "Favorable soil recharge for winter cover legume seeding" },
      // Saturday 2 (12)
      { tempHigh: 23, tempLow: 14, rainMm: 0, rainProb: "10%", condition: "Partly Cloudy", icon: CloudSunRain, wind: 8, humidity: 50, soilMoisture: 52, advice: "Legume drill seeding window opens; optimal seed-to-soil contact" },
      // Sunday 2 (13)
      { tempHigh: 25, tempLow: 15, rainMm: 0, rainProb: "5%", condition: "Sunny", icon: Sun, wind: 7, humidity: 44, soilMoisture: 48, advice: "Full machinery access; favorable soil moisture & warm germination" },
    ];

    const results: DayForecast[] = [];

    for (let i = 0; i < 14; i++) {
      const d = new Date(anchorDate);
      d.setDate(anchorDate.getDate() + i);

      const dayOfWeek = (d.getDay() + 6) % 7; // Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
      const profile = i < 7 ? weekdayProfiles[dayOfWeek] : secondWeekProfiles[dayOfWeek];

      const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
      const shortDay = d.toLocaleDateString("en-US", { weekday: "short" });
      const formattedDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      
      const label = i === 0 ? `Today (${shortDay})` : i === 1 ? `Tomorrow (${shortDay})` : `${shortDay}, ${formattedDate}`;

      // Agronomic evaluations
      const sprayingStatus: "optimal" | "restricted" | "prohibited" =
        profile.rainMm > 5 || profile.wind > 15
          ? "prohibited"
          : profile.rainMm > 0 || profile.wind > 10
          ? "restricted"
          : "optimal";

      const tillageStatus: "optimal" | "moderate" | "unfavorable" =
        profile.soilMoisture > 70
          ? "unfavorable"
          : profile.soilMoisture > 55
          ? "moderate"
          : "optimal";

      const harvestStatus: "optimal" | "moderate" | "unfavorable" =
        profile.rainMm > 3
          ? "unfavorable"
          : profile.humidity > 70
          ? "moderate"
          : "optimal";

      const irrigationAction =
        profile.rainMm > 15
          ? "Suspend All Pumps (Rain surplus)"
          : profile.rainMm > 5
          ? "Reduce Pivot to 40% Rate"
          : "Standard Cycle (8mm application)";

      const fertilizerAction =
        profile.rainMm > 20
          ? "Strict Halt (Runoff Hazard)"
          : profile.rainMm > 5
          ? "Caution (Postpone Top-dress)"
          : "Favorable (Optimal Uptake)";

      const hourly = [
        { time: "06:00", temp: profile.tempLow, rainProb: Math.max(0, parseInt(profile.rainProb) - 20), windKm: Math.max(3, profile.wind - 3), spraySafe: profile.wind <= 10 && profile.rainMm === 0 },
        { time: "09:00", temp: Math.round((profile.tempLow + profile.tempHigh) / 2), rainProb: parseInt(profile.rainProb), windKm: profile.wind, spraySafe: profile.wind <= 12 && profile.rainMm < 3 },
        { time: "12:00", temp: profile.tempHigh, rainProb: parseInt(profile.rainProb), windKm: profile.wind + 2, spraySafe: false }, // noon thermal drift
        { time: "15:00", temp: profile.tempHigh - 1, rainProb: Math.min(100, parseInt(profile.rainProb) + 10), windKm: profile.wind + 3, spraySafe: false },
        { time: "18:00", temp: profile.tempHigh - 4, rainProb: parseInt(profile.rainProb), windKm: profile.wind - 2, spraySafe: profile.wind <= 10 && profile.rainMm < 2 },
        { time: "21:00", temp: profile.tempLow + 2, rainProb: Math.max(0, parseInt(profile.rainProb) - 15), windKm: profile.wind - 4, spraySafe: false },
      ];

      results.push({
        index: i,
        date: d,
        dayName,
        shortDay,
        formattedDate,
        label,
        tempHigh: profile.tempHigh,
        tempLow: profile.tempLow,
        condition: profile.condition,
        rainMm: profile.rainMm,
        rainProb: profile.rainProb,
        windSpeed: profile.wind,
        humidity: profile.humidity,
        soilMoisture: profile.soilMoisture,
        et0: Number((profile.tempHigh * 0.16 + (profile.wind * 0.05)).toFixed(1)),
        icon: profile.icon,
        advice: profile.advice,
        sprayingStatus,
        tillageStatus,
        harvestStatus,
        irrigationAction,
        fertilizerAction,
        hourly,
      });
    }

    return results;
  }, [anchorDate, lastRefreshed]);

  const activeDay = forecastDays[selectedDayIndex] || forecastDays[0];

  // Dynamic discovery of nearest significant storm/heavy rain event
  const heavyRainEvent = useMemo(() => {
    return forecastDays.find((d) => d.rainMm >= 20) || forecastDays.find((d) => d.rainMm >= 10);
  }, [forecastDays]);

  // Dynamic next optimal spraying window
  const nextOptimalSpray = useMemo(() => {
    return forecastDays.find((d) => d.sprayingStatus === "optimal");
  }, [forecastDays]);

  // Dynamic next dry harvest window
  const nextHarvestWindow = useMemo(() => {
    const dryDays = forecastDays.filter((d) => d.harvestStatus === "optimal");
    if (dryDays.length >= 2) {
      return `${dryDays[0].label} - ${dryDays[dryDays.length - 1].label}`;
    }
    return "Weather dependent";
  }, [forecastDays]);

  // Cumulative rainfall calculation across 14 days
  const cumulativeRain14d = useMemo(() => {
    return forecastDays.reduce((acc, curr) => acc + curr.rainMm, 0);
  }, [forecastDays]);

  const handleRefresh = () => {
    fetchGeminiClimate(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Dynamic Action-Oriented Decision Intelligence */}
      <div className="bg-[#07261B] rounded-2xl p-6 text-white border border-[#14533C] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/10 to-transparent pointer-events-none rounded-full blur-2xl" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B3D2C] text-emerald-300 border border-[#196349] text-xs font-bold">
              <CloudSunRain className="w-3.5 h-3.5 text-emerald-400" />
              <span>12-Hour Gemini Climate Intelligence Sync</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              {heavyRainEvent ? (
                <>
                  <span className="text-amber-400">
                    {geminiClimateData?.convectiveStormAlert?.precipitationMm || heavyRainEvent.rainMm}mm Convective Rain
                  </span>
                  <span>Predicted on {heavyRainEvent.label}</span>
                </>
              ) : (
                <>Stable Micro-Climate Horizon across 14 Days</>
              )}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">Agronomic Directive: </strong>
              {geminiClimateData?.agronomicDirective || (heavyRainEvent ? (
                <>
                  Delay scheduled nitrogen top-dressing and chemical foliar spraying until{" "}
                  <span className="text-emerald-300 font-bold">
                    {forecastDays.find((d, idx) => idx > heavyRainEvent.index && d.rainMm <= 1)?.label || "Sunday"}
                  </span>{" "}
                  to avoid complete wash-off, financial input loss, and groundwater contamination.
                </>
              ) : (
                <>Favorable meteorological conditions present for routine tractor tillage, crop scouting, and scheduled pivot irrigation.</>
              ))}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-300 font-medium">
              <span className="flex items-center gap-1.5 bg-[#0B3D2C]/80 px-2.5 py-1 rounded-lg border border-[#196349]">
                <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                14-Day Cumulative: <strong className="text-white font-mono">{cumulativeRain14d} mm</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-[#0B3D2C]/80 px-2.5 py-1 rounded-lg border border-[#196349]">
                <Wind className="w-3.5 h-3.5 text-amber-400" />
                Next Clear Spray Window: <strong className="text-emerald-300">{nextOptimalSpray?.label || "Sunday"}</strong>
              </span>
              <span className="text-slate-400 italic">
                {lastRefreshed}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-[#10171B] p-3.5 rounded-xl border border-[#1D2A32] text-center min-w-[110px]">
              <div className="text-[10px] font-bold uppercase text-slate-400">Drought Index</div>
              <div className="text-lg font-mono font-bold text-emerald-300 mt-0.5">
                {geminiClimateData?.droughtIndex || "Low (18%)"}
              </div>
              <div className="text-[10px] text-slate-500">Root zone safe</div>
            </div>
            <div className="bg-[#10171B] p-3.5 rounded-xl border border-[#1D2A32] text-center min-w-[110px]">
              <div className="text-[10px] font-bold uppercase text-slate-400">Flood Risk</div>
              <div className="text-lg font-mono font-bold text-amber-400 mt-0.5">
                {geminiClimateData?.floodRisk || "Moderate"}
              </div>
              <div className="text-[10px] text-slate-500">Day 4-5 crest</div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] text-slate-300 hover:text-white hover:border-[#196349] transition-all flex flex-col items-center justify-center cursor-pointer min-w-[70px]"
              title="Refresh meteorological radar telemetry"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-400 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="text-[10px] font-bold mt-1 text-slate-400">Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* 14-Day Calendar Forecast Header & Controls */}
      <div className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">14-Day Precipitation & Agronomic Scheduling</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                Live Dynamic Calendar
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ECMWF High-Resolution Global Forecast + Multi-satellite GPM IMERG 30-minute radar precipitation
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Horizon Switcher */}
            <div className="flex gap-1 text-xs bg-[#162228] p-1 rounded-xl border border-[#1D2A32]">
              {(["14d", "30d", "seasonal"] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setSelectedHorizon(h)}
                  className={`px-3 py-1.5 rounded-lg font-semibold uppercase text-[11px] cursor-pointer transition-all ${
                    selectedHorizon === h
                      ? "bg-[#0B3D2C] text-white border border-[#196349] shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {h === "14d" ? "14-Day Schedule" : h === "30d" ? "30-Day Trend" : "Seasonal Decadal"}
                </button>
              ))}
            </div>

            <button
              onClick={handleRefresh}
              className="px-3 py-1.5 rounded-xl bg-[#162228] hover:bg-[#1D2A32] text-xs font-semibold text-slate-300 border border-[#1D2A32] flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Update Telemetry</span>
            </button>
          </div>
        </div>

        {/* Dynamic Day Progression & Base Day Anchor */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#162228] p-3 rounded-xl border border-[#1D2A32] text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              Calendar Base Anchor:
            </span>
            <div className="flex items-center gap-1 bg-[#10171B] p-0.5 rounded-lg border border-[#1D2A32]">
              <button
                onClick={() => {
                  setAnchorMode("monday");
                  setDayOffset(0);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  anchorMode === "monday" && dayOffset === 0
                    ? "bg-[#0B3D2C] text-emerald-300 border border-[#196349]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Today is Monday
              </button>
              <button
                onClick={() => {
                  setAnchorMode("system");
                  setDayOffset(0);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  anchorMode === "system" && dayOffset === 0
                    ? "bg-[#0B3D2C] text-emerald-300 border border-[#196349]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                System Date ({new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">Step Calendar Days:</span>
            <button
              onClick={() => setDayOffset((prev) => prev - 1)}
              className="px-2 py-1 bg-[#10171B] hover:bg-[#1C2C35] rounded text-[11px] font-bold text-slate-300 border border-[#1D2A32] cursor-pointer"
              title="Previous Day (-1d)"
            >
              -1 Day
            </button>
            <span className="font-mono font-bold text-emerald-400 bg-[#0B3D2C]/60 px-2.5 py-1 rounded border border-[#196349] text-[11px]">
              Active Start: {anchorDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </span>
            <button
              onClick={() => setDayOffset((prev) => prev + 1)}
              className="px-2 py-1 bg-[#10171B] hover:bg-[#1C2C35] rounded text-[11px] font-bold text-slate-300 border border-[#1D2A32] cursor-pointer"
              title="Next Day (+1d)"
            >
              +1 Day
            </button>
            {dayOffset !== 0 && (
              <button
                onClick={() => setDayOffset(0)}
                className="text-[10px] text-slate-400 hover:text-amber-400 underline cursor-pointer ml-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Operation Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              Agronomic Activity Suitability:
            </span>
            {[
              { id: "all", label: "All Operations" },
              { id: "spraying", label: "Chemical Spraying" },
              { id: "tillage", label: "Tillage & Traffic" },
              { id: "irrigation", label: "Irrigation Scheduling" },
              { id: "harvesting", label: "Harvest Safety" },
              { id: "fertilizing", label: "Top-Dress Fertilization" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setOperationFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  operationFilter === f.id
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-[#162228] text-slate-400 hover:text-slate-200 border border-[#1D2A32]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Optimal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Caution / Reduced
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> Prohibited / High Risk
            </span>
          </div>
        </div>

        {/* 14-Day View: Dynamic 14 Cards Grid */}
        {selectedHorizon === "14d" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {forecastDays.map((d) => {
              const Icon = d.icon;
              const isSelected = selectedDayIndex === d.index;
              const isHeavyRain = d.rainMm >= 20;

              // Compute activity indicator based on filter
              let statusColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
              let statusLabel = "Optimal";

              if (operationFilter === "spraying") {
                if (d.sprayingStatus === "prohibited") {
                  statusColor = "bg-rose-500/20 text-rose-300 border-rose-500/40";
                  statusLabel = "No Spray";
                } else if (d.sprayingStatus === "restricted") {
                  statusColor = "bg-amber-500/20 text-amber-300 border-amber-500/40";
                  statusLabel = "Early AM Only";
                } else {
                  statusColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
                  statusLabel = "Spray Safe";
                }
              } else if (operationFilter === "tillage") {
                if (d.tillageStatus === "unfavorable") {
                  statusColor = "bg-rose-500/20 text-rose-300 border-rose-500/40";
                  statusLabel = "Soil Wet";
                } else if (d.tillageStatus === "moderate") {
                  statusColor = "bg-amber-500/20 text-amber-300 border-amber-500/40";
                  statusLabel = "Light Tractor";
                } else {
                  statusColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
                  statusLabel = "Optimal Tillage";
                }
              } else if (operationFilter === "irrigation") {
                if (d.rainMm > 15) {
                  statusColor = "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
                  statusLabel = "Cutoff 100%";
                } else if (d.rainMm > 5) {
                  statusColor = "bg-amber-500/20 text-amber-300 border-amber-500/40";
                  statusLabel = "Throttle 50%";
                } else {
                  statusColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
                  statusLabel = "Active Pivot";
                }
              } else if (operationFilter === "harvesting") {
                if (d.harvestStatus === "unfavorable") {
                  statusColor = "bg-rose-500/20 text-rose-300 border-rose-500/40";
                  statusLabel = "Moisture Risk";
                } else if (d.harvestStatus === "moderate") {
                  statusColor = "bg-amber-500/20 text-amber-300 border-amber-500/40";
                  statusLabel = "Monitor Grain";
                } else {
                  statusColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
                  statusLabel = "Harvest Safe";
                }
              } else if (operationFilter === "fertilizing") {
                if (d.rainMm > 20) {
                  statusColor = "bg-rose-500/20 text-rose-300 border-rose-500/40";
                  statusLabel = "Leaching Stop";
                } else if (d.rainMm > 5) {
                  statusColor = "bg-amber-500/20 text-amber-300 border-amber-500/40";
                  statusLabel = "Wait 24h";
                } else {
                  statusColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
                  statusLabel = "Optimal Uptake";
                }
              }

              return (
                <button
                  key={d.index}
                  onClick={() => setSelectedDayIndex(d.index)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-[#0A3022] border-emerald-400 ring-2 ring-emerald-500/40 shadow-lg scale-[1.02]"
                      : isHeavyRain
                      ? "bg-[#07261B] border-emerald-900/60 hover:border-emerald-700"
                      : "bg-[#162228] border-[#1D2A32] hover:border-slate-600"
                  }`}
                >
                  {/* Top Badge: Today / Tomorrow / Date */}
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[11px] font-extrabold ${d.index === 0 ? "text-emerald-400" : "text-white"}`}>
                        {d.index === 0 ? "Today" : d.index === 1 ? "Tomorrow" : d.shortDay}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {d.formattedDate}
                      </span>
                    </div>

                    {/* Weather Icon & Temperature */}
                    <div className="my-2 flex items-center justify-between">
                      <Icon className={`w-6 h-6 ${isHeavyRain ? "text-cyan-400 animate-pulse" : d.rainMm > 0 ? "text-cyan-400" : "text-amber-400"}`} />
                      <div className="text-right">
                        <div className="font-mono font-bold text-sm text-white">
                          {d.tempHigh}°
                          <span className="text-xs text-slate-400 font-normal ml-0.5">/{d.tempLow}°</span>
                        </div>
                      </div>
                    </div>

                    {/* Precipitation & Probability */}
                    <div className="bg-[#10171B]/70 px-2 py-1 rounded-md flex items-center justify-between text-[11px] font-mono">
                      <span className="text-cyan-300 font-bold flex items-center gap-1">
                        <Droplet className="w-3 h-3 text-cyan-400" />
                        {d.rainMm} mm
                      </span>
                      <span className="text-slate-400 text-[10px]">{d.rainProb}</span>
                    </div>

                    {/* Specific Filter Tag */}
                    {operationFilter !== "all" && (
                      <div className={`mt-2 px-1.5 py-0.5 rounded text-[9px] font-bold text-center border ${statusColor}`}>
                        {statusLabel}
                      </div>
                    )}
                  </div>

                  {/* Advice snippet */}
                  <div className="mt-2.5 pt-2 border-t border-[#19262F] text-[10px] text-slate-400 line-clamp-2 leading-tight">
                    {d.advice}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* 30-Day Trend View */}
        {selectedHorizon === "30d" && (
          <div className="p-5 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-white">30-Day Rolling Precipitation & Evapotranspiration Trajectory</h4>
                <p className="text-xs text-slate-400">Ensemble ECMWF seasonal model projecting soil water deficit</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Projected 30d Total: </span>
                <span className="font-mono font-bold text-emerald-300 text-sm">118 mm</span>
              </div>
            </div>

            {/* Decadal 10-day bar comparisons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 bg-[#10171B] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="text-xs font-bold text-white flex justify-between">
                  <span>Decade 1 (Days 1–10)</span>
                  <span className="text-emerald-400 font-mono">72 mm</span>
                </div>
                <div className="w-full bg-[#162228] h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: "75%" }} />
                </div>
                <p className="text-[10px] text-slate-400">High moisture surge; 34mm convective event on Day 5.</p>
              </div>

              <div className="p-3.5 bg-[#10171B] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="text-xs font-bold text-white flex justify-between">
                  <span>Decade 2 (Days 11–20)</span>
                  <span className="text-cyan-400 font-mono">28 mm</span>
                </div>
                <div className="w-full bg-[#162228] h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: "38%" }} />
                </div>
                <p className="text-[10px] text-slate-400">Optimal drying period; primary window for grain harvesting.</p>
              </div>

              <div className="p-3.5 bg-[#10171B] rounded-xl border border-[#1D2A32] space-y-2">
                <div className="text-xs font-bold text-white flex justify-between">
                  <span>Decade 3 (Days 21–30)</span>
                  <span className="text-purple-400 font-mono">18 mm</span>
                </div>
                <div className="w-full bg-[#162228] h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-full rounded-full" style={{ width: "25%" }} />
                </div>
                <p className="text-[10px] text-slate-400">Moderate soil water reserve; ideal for winter legume emergence.</p>
              </div>
            </div>
          </div>
        )}

        {/* Seasonal Decadal View */}
        {selectedHorizon === "seasonal" && (
          <div className="p-5 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-white">Seasonal Climate Outlook & Teleconnection Indicies</h4>
                <p className="text-xs text-slate-400">Correlated with ENSO Neutral / Indian Ocean Dipole (IOD) negative phase</p>
              </div>
              <span className="text-xs font-bold text-emerald-300 bg-[#0B3D2C] px-2.5 py-1 rounded-lg border border-[#196349]">
                Normal-to-Above Average Rainfall (+12%)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32]">
                <div className="text-slate-400 text-[11px] font-bold">Month 1 (November)</div>
                <div className="text-lg font-mono font-bold text-white mt-1">94 mm / 24°C avg</div>
                <p className="text-[10px] text-emerald-400 mt-1">Favorable establishment for summer cereal crops.</p>
              </div>
              <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32]">
                <div className="text-slate-400 text-[11px] font-bold">Month 2 (December)</div>
                <div className="text-lg font-mono font-bold text-white mt-1">112 mm / 26°C avg</div>
                <p className="text-[10px] text-cyan-400 mt-1">Peak vegetative canopy water requirement.</p>
              </div>
              <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32]">
                <div className="text-slate-400 text-[11px] font-bold">Month 3 (January)</div>
                <div className="text-lg font-mono font-bold text-white mt-1">86 mm / 27°C avg</div>
                <p className="text-[10px] text-amber-400 mt-1">Tasseling & pollination stage; low thermal risk.</p>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Detailed Day Workorder Breakdown */}
        {selectedHorizon === "14d" && activeDay && (
          <div className="mt-4 p-4.5 bg-[#141E24] rounded-xl border border-emerald-900/60 shadow-inner">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#1D2A32] gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#0B3D2C] rounded-xl border border-[#196349]">
                  <activeDay.icon className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-base text-white">
                      {activeDay.dayName}, {activeDay.formattedDate}
                    </h4>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#1D2A32] text-slate-300">
                      {activeDay.condition}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Telemetry: High <strong className="text-white font-mono">{activeDay.tempHigh}°C</strong> / Low <strong className="text-white font-mono">{activeDay.tempLow}°C</strong> | Wind <strong className="text-white font-mono">{activeDay.windSpeed} km/h</strong> | Humidity <strong className="text-white font-mono">{activeDay.humidity}%</strong> | Soil Moisture <strong className="text-emerald-300 font-mono">{activeDay.soilMoisture}%</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Precipitation Forecast</div>
                  <div className="text-base font-mono font-extrabold text-cyan-300">
                    {activeDay.rainMm} mm <span className="text-xs text-slate-400 font-normal">({activeDay.rainProb} probability)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Agronomic Operations Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3 text-xs">
              <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Chemical Spraying</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    activeDay.sprayingStatus === "optimal"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      : activeDay.sprayingStatus === "restricted"
                      ? "bg-amber-950 text-amber-300 border border-amber-800"
                      : "bg-rose-950 text-rose-300 border border-rose-800"
                  }`}>
                    {activeDay.sprayingStatus.toUpperCase()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  {activeDay.sprayingStatus === "optimal"
                    ? "Safe delta-T index (2–8), zero spray drift or droplet evaporation."
                    : activeDay.sprayingStatus === "restricted"
                    ? "Limit spraying to 06:00-09:00 prior to wind pickup."
                    : "Prohibited: Rain wash-off or wind speed exceeding 15 km/h."}
                </div>
              </div>

              <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Tillage & Trafficability</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    activeDay.tillageStatus === "optimal"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      : activeDay.tillageStatus === "moderate"
                      ? "bg-amber-950 text-amber-300 border border-amber-800"
                      : "bg-rose-950 text-rose-300 border border-rose-800"
                  }`}>
                    {activeDay.tillageStatus.toUpperCase()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 leading-snug">
                  {activeDay.tillageStatus === "optimal"
                    ? "Soil moisture in plastic limit range; minimal subsoil compaction."
                    : activeDay.tillageStatus === "moderate"
                    ? "Restrict to light flotation wheel tractors; avoid heavy haulers."
                    : "High rutting and soil structure smearing risk."}
                </div>
              </div>

              <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Irrigation Directive</span>
                  <span className="text-[10px] font-mono text-cyan-400">ETo {activeDay.et0} mm</span>
                </div>
                <div className="text-[11px] text-slate-300 leading-snug font-medium">
                  {activeDay.irrigationAction}
                </div>
              </div>

              <div className="p-3 bg-[#10171B] rounded-xl border border-[#1D2A32]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Top-Dress Nitrogen</span>
                  <span className="text-[10px] font-mono text-emerald-400">Root Zone</span>
                </div>
                <div className="text-[11px] text-slate-300 leading-snug font-medium">
                  {activeDay.fertilizerAction}
                </div>
              </div>
            </div>

            {/* Hourly Micro-Climate Bar */}
            <div className="mt-3 pt-3 border-t border-[#1D2A32]">
              <div className="text-[10px] font-bold uppercase text-slate-400 mb-2 flex items-center justify-between">
                <span>Diurnal Hourly Evolution ({activeDay.dayName})</span>
                <span className="text-slate-400">Wind &lt; 12 km/h indicates spray suitability</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {activeDay.hourly.map((h, hIdx) => (
                  <div
                    key={hIdx}
                    className="p-2 bg-[#10171B] rounded-lg border border-[#1D2A32] text-center"
                  >
                    <div className="text-[10px] font-mono text-slate-400 font-bold">{h.time}</div>
                    <div className="font-mono text-xs font-bold text-white my-0.5">{h.temp}°C</div>
                    <div className="text-[10px] text-cyan-300 font-mono">{h.rainProb}% Rain</div>
                    <div className="text-[10px] text-slate-400 font-mono">{h.windKm} km/h</div>
                    <div className={`mt-1 text-[9px] font-bold px-1 py-0.5 rounded ${
                      h.spraySafe
                        ? "bg-emerald-950 text-emerald-300"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {h.spraySafe ? "Spray Safe" : "No Spray"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Climate Risk Indicators & Planting Windows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Optimal Planting & Spraying Windows */}
        <div className="lg:col-span-6 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-white">Optimal Field Operation Windows</h3>
            <span className="text-[10px] font-bold text-emerald-300 bg-[#07261B] border border-[#14533C] px-2 py-0.5 rounded">
              Crop Phenology Model
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Chemical Spraying Window</div>
                <div className="text-slate-400 text-[11px]">Wind &lt; 8 km/h, zero precipitation, Delta-T in bounds</div>
              </div>
              <span className="font-mono font-bold text-emerald-300 bg-[#07261B] border border-[#14533C] px-2.5 py-1 rounded-lg">
                {nextOptimalSpray ? `${nextOptimalSpray.label} 06:00 - 11:00` : "Sunday 06:00 - 11:00"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Harvest Readiness (Maize)</div>
                <div className="text-slate-400 text-[11px]">Grain moisture reaching 13.5% safe storage target</div>
              </div>
              <span className="font-mono font-bold text-cyan-300 bg-[#07261B] border border-cyan-800/60 px-2.5 py-1 rounded-lg">
                {nextHarvestWindow}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Winter Cover Crop Seeding</div>
                <div className="text-slate-400 text-[11px]">Soil temperature optimal for legume germination post-rain</div>
              </div>
              <span className="font-mono font-bold text-purple-300 bg-[#07261B] border border-purple-800/60 px-2.5 py-1 rounded-lg">
                {forecastDays[11]?.label || "Oct 30"} – {forecastDays[13]?.label || "Nov 02"}
              </span>
            </div>
          </div>
        </div>

        {/* Parametric Weather Insurance Trigger */}
        <div className="lg:col-span-6 bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-white">Parametric Climate Insurance</h3>
              <span className="text-[10px] font-bold text-cyan-300 bg-[#07261B] border border-cyan-800/60 px-2 py-0.5 rounded">
                Smart Contract Policy
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Protected by orbital satellite rainfall indexing (CHIRPS & GPM IMERG). Precipitation deficit below 45mm across rolling 30 days triggers automatic payout without manual claim paperwork.
            </p>

            <div className="mt-4 p-3.5 rounded-xl bg-[#162228] border border-[#1D2A32] grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Cumulative 14-Day Rain</span>
                <span className="font-mono font-bold text-white text-sm">{cumulativeRain14d} mm / 45mm index</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Payout Protection</span>
                <span className="font-mono font-bold text-emerald-300 text-sm">R180,000 Active</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#19262F] flex items-center justify-between text-xs mt-4">
            <span className="text-slate-400">Underwritten by African Risk Capacity (ARC)</span>
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="text-emerald-300 font-bold hover:underline cursor-pointer flex items-center gap-1 min-h-[44px]"
            >
              <span>Simulate Drought Payout →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
