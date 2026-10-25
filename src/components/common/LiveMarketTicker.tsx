import React from "react";
import { TrendingUp, TrendingDown, Radio, Satellite, ShieldCheck, RefreshCw } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface TickerItem {
  id: string;
  symbol: string;
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
  type?: "commodity" | "telemetry" | "corridor";
}

export const LiveMarketTicker: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { commodityPrices, marketPricesLastSync, isSyncingMarketPrices, refreshMarketPrices } = useApp();

  // Dynamically map live commodity prices from the 12-hour Gemini sync engine
  const dynamicCommodityItems: TickerItem[] = commodityPrices.map((cp, idx) => {
    const symbolCode = cp.cityMarket.includes("SAFEX")
      ? "SAFEX"
      : cp.cityMarket.includes("ECX")
      ? "ECX"
      : cp.cityMarket.includes("AFEX")
      ? "AFEX"
      : cp.cityMarket.includes("GCX")
      ? "GCX"
      : cp.cityMarket.includes("ZAMACE")
      ? "ZAMACE"
      : cp.country.slice(0, 3).toUpperCase();

    return {
      id: `comm_${idx}`,
      symbol: `${symbolCode}-${cp.commodity.slice(0, 4).toUpperCase()}`,
      name: `${cp.commodity} (${cp.cityMarket})`,
      value: cp.currency === "USD" ? `$${cp.pricePerTonne.toLocaleString()}/MT` : `${cp.currency} ${cp.pricePerTonne.toLocaleString()}/MT`,
      change: `${cp.dailyChangePct >= 0 ? "+" : ""}${cp.dailyChangePct}%`,
      isPositive: cp.dailyChangePct >= 0,
      type: "commodity",
    };
  });

  const staticTelemetryItems: TickerItem[] = [
    { id: "tel_1", symbol: "S2-ORBIT", name: "Sentinel-2 Constellation", value: "Orbit #412 Active", change: "99.8% Telemetry", isPositive: true, type: "telemetry" },
    { id: "cor_1", symbol: "AfCFTA-TRANS", name: "Northern Corridor Transit", value: "42 Convoys Monitored", change: "On Schedule", isPositive: true, type: "corridor" },
    { id: "cor_2", symbol: "LOBITO-RAIL", name: "Lobito Atlantic Corridor (LAR)", value: "36h Atlantic Transit", change: "+18% Agro Freight", isPositive: true, type: "corridor" },
  ];

  const fullTickerData = [...dynamicCommodityItems, ...staticTelemetryItems];

  return (
    <div
      className={`w-full overflow-hidden bg-[#071116] py-1 px-2 select-none border-b border-[#14232C] ${className}`}
      aria-label="Real-time commodity ticker"
    >
      <div className="flex items-center">
        {/* Live Status Pill with Gemini 12h Cycle Indicator */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0B1E17] text-emerald-300 text-[10px] font-bold tracking-wider uppercase shrink-0 mr-2 z-10 shadow-xs border border-[#14533C]/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="hidden sm:inline">GEMINI 12H SYNC: LIVE</span>
          <Radio className="w-2.5 h-2.5 text-emerald-400" />
          <button
            onClick={() => refreshMarketPrices(true)}
            disabled={isSyncingMarketPrices}
            title={`Force 12h Market Sync now (${marketPricesLastSync})`}
            className="ml-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-2.5 h-2.5 text-emerald-400 ${isSyncingMarketPrices ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Scrolling Ticker Track (duplicated for seamless infinite loop) */}
        <div className="overflow-hidden relative flex-1 mask-radial">
          <div className="animate-live-ticker flex items-center gap-6">
            {[...fullTickerData, ...fullTickerData].map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="flex items-center gap-2 text-xs font-mono shrink-0 px-2 py-0.5 rounded transition-colors hover:bg-[#101F26]"
              >
                {item.type === "telemetry" ? (
                  <Satellite className="w-3 h-3 text-cyan-400" />
                ) : item.type === "corridor" ? (
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-wider">
                    {item.symbol}
                  </span>
                )}

                <span className="text-slate-200 font-medium text-[11px] font-sans">{item.name}</span>
                <span className="text-white font-bold">{item.value}</span>

                <span
                  className={`flex items-center gap-0.5 text-[10px] font-bold ${
                    item.isPositive ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {item.isPositive ? (
                    <TrendingUp className="w-2.5 h-2.5" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5" />
                  )}
                  {item.change}
                </span>
                <span className="text-slate-600 font-sans mx-1">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
