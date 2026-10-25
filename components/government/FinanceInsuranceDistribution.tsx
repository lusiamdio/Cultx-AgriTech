import React, { useState } from "react";
import {
  Coins,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Layers,
  PieChart,
  BarChart3,
  Calendar,
  Compass,
  ArrowRight,
  Download,
  Filter,
  CheckCircle2,
  DollarSign,
  Globe2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const FinanceInsuranceDistribution: React.FC = () => {
  const { selectedCountry } = useApp();

  const [selectedGeo, setSelectedGeo] = useState<string>("all");
  const [selectedCrop, setSelectedCrop] = useState<string>("all");

  const regionalFinanceData = [
    {
      region: "Free State & Highveld",
      country: "South Africa",
      disbursedUSD: 14200000,
      activeBorrowers: 642,
      topCrop: "Yellow & White Maize",
      repaymentRate: 98.2,
      insuranceCoveragePct: 78.4,
      claimsSettledUSD: 245000,
      lossRatioPct: 38.2,
    },
    {
      region: "Rift Valley & Nakuru",
      country: "Kenya",
      disbursedUSD: 10800000,
      activeBorrowers: 890,
      topCrop: "Tea, Macadamia & Maize",
      repaymentRate: 97.4,
      insuranceCoveragePct: 72.1,
      claimsSettledUSD: 180000,
      lossRatioPct: 41.0,
    },
    {
      region: "Ashanti & Kumasi Hinterland",
      country: "Ghana",
      disbursedUSD: 7500000,
      activeBorrowers: 520,
      topCrop: "Cocoa & Oil Palm",
      repaymentRate: 96.8,
      insuranceCoveragePct: 64.5,
      claimsSettledUSD: 112000,
      lossRatioPct: 44.5,
    },
    {
      region: "Mkushi Farming Block",
      country: "Zambia",
      disbursedUSD: 6100000,
      activeBorrowers: 310,
      topCrop: "Soybeans & Wheat",
      repaymentRate: 97.1,
      insuranceCoveragePct: 69.2,
      claimsSettledUSD: 98000,
      lossRatioPct: 39.8,
    },
    {
      region: "Beheira & Nile Delta",
      country: "Egypt",
      disbursedUSD: 4200000,
      activeBorrowers: 280,
      topCrop: "Citrus & Wheat",
      repaymentRate: 98.9,
      insuranceCoveragePct: 84.0,
      claimsSettledUSD: 54000,
      lossRatioPct: 29.5,
    },
  ];

  const cropDistributionData = [
    { crop: "Yellow & White Maize", totalDisbursedUSD: 15400000, sharePct: 36, insuredHectares: 172000, claimsRatio: 42.1 },
    { crop: "Soybeans & Oilseeds", totalDisbursedUSD: 10200000, sharePct: 24, insuredHectares: 115000, claimsRatio: 37.8 },
    { crop: "Cocoa & Tree Crops", totalDisbursedUSD: 7700000, sharePct: 18, insuredHectares: 84000, claimsRatio: 46.2 },
    { crop: "Export Citrus & Fruit", totalDisbursedUSD: 5100000, sharePct: 12, insuredHectares: 48000, claimsRatio: 31.4 },
    { crop: "Smallholder Legumes", totalDisbursedUSD: 4400000, sharePct: 10, insuredHectares: 63000, claimsRatio: 44.0 },
  ];

  const filteredRegions = regionalFinanceData.filter((r) => {
    const matchGeo = selectedGeo === "all" || r.country === selectedGeo;
    const matchCrop = selectedCrop === "all" || r.topCrop.toLowerCase().includes(selectedCrop.toLowerCase());
    return matchGeo && matchCrop;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Distribution & Insurance Performance */}
      <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-2 rounded-xl bg-[#07261B] text-emerald-400 border border-[#14533C]">
              <Coins className="w-5 h-5 text-emerald-400" />
            </span>
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              Agricultural Finance & Parametric Insurance Distribution
            </h3>
            <span className="text-xs font-mono font-bold bg-[#07261B] text-emerald-300 px-2.5 py-0.5 rounded border border-[#14533C]">
              Cross-Territorial Analysis
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time geospatial tracking of credit allocation, insurance penetration, and claims loss severity across key agricultural value chains and smallholder corridors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-[#07261B] text-emerald-300 px-3 py-1.5 rounded-xl border border-[#14533C]">
            Total Distributed: $42.8M USD
          </span>
        </div>
      </div>

      {/* 4 Core Macro Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            National Finance Deployment
          </span>
          <div className="text-2xl font-mono font-extrabold text-white">$42.8M USD</div>
          <span className="text-[10px] text-emerald-400 block">+18.4% YoY Growth</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Insurance Penetration Rate
          </span>
          <div className="text-2xl font-mono font-extrabold text-emerald-400">73.6%</div>
          <span className="text-[10px] text-slate-400 block">Up from 18.2% Baseline</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Average Smallholder Facility
          </span>
          <div className="text-2xl font-mono font-extrabold text-cyan-300">$3,850 USD</div>
          <span className="text-[10px] text-slate-400 block">$95,000 for Commercials</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#07261B] border border-[#14533C] space-y-1">
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
            Aggregate Loss Ratio
          </span>
          <div className="text-2xl font-mono font-extrabold text-white">41.2%</div>
          <span className="text-[10px] text-emerald-300 font-bold block">48-Hour Payout SLA</span>
        </div>
      </div>

      {/* Value Chain / Crop Allocation Matrix */}
      <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#1D2A32] gap-2">
          <div>
            <h4 className="font-extrabold text-sm text-white">
              Agricultural Credit & Insurance Volume by Value Chain
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Portfolio distribution against national food security priorities and export cash crops.
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-[#07261B] px-2.5 py-1 rounded-lg border border-[#14533C]">
            5 Strategic Commodities
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {cropDistributionData.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-extrabold text-white text-xs">{item.crop}</span>
                <span className="font-mono text-emerald-400 font-bold">{item.sharePct}%</span>
              </div>
              <div className="text-base font-mono font-extrabold text-white">
                ${(item.totalDisbursedUSD / 1000000).toFixed(1)}M USD
              </div>
              <div className="w-full bg-[#10171B] h-1.5 rounded-full overflow-hidden border border-[#1D2A32]">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.sharePct * 2.5}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-mono">
                <span>{item.insuredHectares.toLocaleString()} Ha</span>
                <span>Loss: {item.claimsRatio}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Finance & Insurance Ledger */}
      <div className="bg-[#10171B] rounded-2xl border border-[#1D2A32] overflow-hidden shadow-sm space-y-0">
        <div className="p-4 sm:p-5 bg-[#162228] border-b border-[#1D2A32] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <h4 className="font-extrabold text-sm text-white">
              Geographic Distribution & Claims Settlement Performance
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Regional breakdown across provincial clusters with parametric claim payouts and repayment rates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedGeo}
              onChange={(e) => setSelectedGeo(e.target.value)}
              className="bg-[#10171B] text-white border border-[#1D2A32] px-2.5 py-1.5 rounded-xl font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Jurisdictions</option>
              <option value="South Africa">South Africa</option>
              <option value="Kenya">Kenya</option>
              <option value="Ghana">Ghana</option>
              <option value="Zambia">Zambia</option>
              <option value="Egypt">Egypt</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#10171B] text-slate-400 border-b border-[#1D2A32] font-semibold">
                <th className="p-3.5">Agricultural Corridor</th>
                <th className="p-3.5">Capital Disbursed</th>
                <th className="p-3.5">Active Borrowers</th>
                <th className="p-3.5">Leading Value Chain</th>
                <th className="p-3.5">Repayment Rate</th>
                <th className="p-3.5">Insurance Penetration</th>
                <th className="p-3.5 text-right">Claims Settled & Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2A32]">
              {filteredRegions.map((reg, idx) => (
                <tr key={idx} className="hover:bg-[#162228]/50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-extrabold text-white text-xs">{reg.region}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{reg.country}</div>
                  </td>

                  <td className="p-3.5 font-mono text-white font-extrabold">
                    ${(reg.disbursedUSD / 1000000).toFixed(2)}M USD
                  </td>

                  <td className="p-3.5 font-mono text-slate-300">
                    <div>{reg.activeBorrowers} Facilities</div>
                    <div className="text-[10px] text-slate-500">Tier-1 & Smallholder</div>
                  </td>

                  <td className="p-3.5">
                    <span className="text-white font-medium">{reg.topCrop}</span>
                  </td>

                  <td className="p-3.5 font-mono">
                    <span className="text-emerald-400 font-extrabold text-xs">{reg.repaymentRate}%</span>
                    <div className="text-[10px] text-slate-500">PAR &lt; 2.5%</div>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 font-mono text-white">
                      <span>{reg.insuranceCoveragePct}%</span>
                    </div>
                    <div className="w-20 bg-[#162228] h-1.5 rounded-full overflow-hidden mt-1 border border-[#1D2A32]">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${reg.insuranceCoveragePct}%` }} />
                    </div>
                  </td>

                  <td className="p-3.5 text-right font-mono">
                    <div className="text-emerald-300 font-bold">${reg.claimsSettledUSD.toLocaleString()} USD</div>
                    <div className="text-[10px] text-slate-400">Loss Ratio: {reg.lossRatioPct}%</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
