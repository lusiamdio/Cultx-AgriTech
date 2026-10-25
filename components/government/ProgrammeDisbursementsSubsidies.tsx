import React, { useState } from "react";
import {
  Landmark,
  Coins,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Filter,
  Plus,
  X,
  Check,
  ShieldCheck,
  FileSpreadsheet,
  Award,
  TrendingUp,
  Percent,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export interface SubsidyProgramme {
  id: string;
  name: string;
  fundingAgency: string;
  totalBudgetUSD: number;
  disbursedUSD: number;
  beneficiariesTarget: number;
  beneficiariesReached: number;
  femaleParticipationPct: number;
  youthParticipationPct: number;
  redemptionRatePct: number;
  fraudBlockedAttempts: number;
  status: "Active & Disbursing" | "Completed Season" | "Audit Phase";
  voucherMethod: "Biometric QR Card" | "Mobile USSD E-Voucher" | "Agro-Dealer POS Terminal";
  subsidyPercentage: number;
  commoditiesCovered: string;
}

export const ProgrammeDisbursementsSubsidies: React.FC = () => {
  const { selectedCountry } = useApp();

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [programmes] = useState<SubsidyProgramme[]>([
    {
      id: "PRG-FERT-2026",
      name: "National Smallholder Fertilizer E-Voucher Scheme",
      fundingAgency: "Ministry of Agriculture & AfDB Special Fund",
      totalBudgetUSD: 45000000,
      disbursedUSD: 38200000,
      beneficiariesTarget: 850000,
      beneficiariesReached: 782400,
      femaleParticipationPct: 44.2,
      youthParticipationPct: 28.6,
      redemptionRatePct: 92.4,
      fraudBlockedAttempts: 4120,
      status: "Active & Disbursing",
      voucherMethod: "Biometric QR Card",
      subsidyPercentage: 40,
      commoditiesCovered: "NPK 3:2:1, Urea 46%, Lime",
    },
    {
      id: "PRG-SEED-2026",
      name: "Climate-Smart Hybrid Seed Distribution Initiative",
      fundingAgency: "World Bank AGRA / National Seed Agency",
      totalBudgetUSD: 18000000,
      disbursedUSD: 16500000,
      beneficiariesTarget: 420000,
      beneficiariesReached: 405000,
      femaleParticipationPct: 48.0,
      youthParticipationPct: 32.1,
      redemptionRatePct: 96.4,
      fraudBlockedAttempts: 1890,
      status: "Active & Disbursing",
      voucherMethod: "Mobile USSD E-Voucher",
      subsidyPercentage: 50,
      commoditiesCovered: "Drought-Tolerant White/Yellow Maize, Soya",
    },
    {
      id: "PRG-SOLAR-2026",
      name: "Smallholder Solar Irrigation & Borehole Grant",
      fundingAgency: "Green Climate Fund (GCF) & FMO",
      totalBudgetUSD: 24000000,
      disbursedUSD: 14800000,
      beneficiariesTarget: 35000,
      beneficiariesReached: 22400,
      femaleParticipationPct: 39.5,
      youthParticipationPct: 41.2,
      redemptionRatePct: 88.0,
      fraudBlockedAttempts: 640,
      status: "Active & Disbursing",
      voucherMethod: "Agro-Dealer POS Terminal",
      subsidyPercentage: 60,
      commoditiesCovered: "Solar Submersible Pumps, Drip Tape Kits",
    },
    {
      id: "PRG-GRAIN-2025",
      name: "National Strategic Food Reserve Floor Guarantee",
      fundingAgency: "Treasury Contingency Reserve",
      totalBudgetUSD: 30000000,
      disbursedUSD: 30000000,
      beneficiariesTarget: 120000,
      beneficiariesReached: 124500,
      femaleParticipationPct: 42.1,
      youthParticipationPct: 24.5,
      redemptionRatePct: 100.0,
      fraudBlockedAttempts: 890,
      status: "Completed Season",
      voucherMethod: "Agro-Dealer POS Terminal",
      subsidyPercentage: 25,
      commoditiesCovered: "Grain Storage Bags, Silo Storage Vouchers",
    },
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleExportBeneficiaryReport = () => {
    const csvContent =
      "Programme ID,Programme Name,Funding Agency,Budget USD,Disbursed USD,Beneficiaries Reached,Female %,Youth %,Redemption %,Fraud Blocked\n" +
      programmes
        .map(
          (p) =>
            `"${p.id}","${p.name}","${p.fundingAgency}",${p.totalBudgetUSD},${p.disbursedUSD},${p.beneficiariesReached},${p.femaleParticipationPct},${p.youthParticipationPct},${p.redemptionRatePct},${p.fraudBlockedAttempts}`
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `National_Subsidy_Beneficiary_Audit_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Exported national subsidy and beneficiary report (.CSV).");
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3.5 bg-[#07261B] border border-[#14533C] rounded-xl text-xs font-bold text-emerald-200 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Banner: Programme & Beneficiary Oversight */}
      <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-2 rounded-xl bg-[#07261B] text-emerald-400 border border-[#14533C]">
              <Landmark className="w-5 h-5 text-emerald-400" />
            </span>
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              National Agricultural Programmes, Subsidies & Beneficiary Audit
            </h3>
            <span className="text-xs font-mono font-bold bg-[#07261B] text-emerald-300 px-2.5 py-0.5 rounded border border-[#14533C]">
              Zero Ghost Beneficiaries
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Audit national input subsidy disbursements, biometric redemption tracking at certified agro-dealer POS terminals, and gender/youth inclusion metrics.
          </p>
        </div>

        <button
          onClick={handleExportBeneficiaryReport}
          className="px-4 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] transition-all flex items-center gap-2 cursor-pointer shadow-md self-start md:self-auto shrink-0"
        >
          <Download className="w-4 h-4 text-emerald-300" />
          <span>Export Beneficiary Audit (.CSV)</span>
        </button>
      </div>

      {/* 4 Macro Programme Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Subsidies Budgeted
          </span>
          <div className="text-2xl font-mono font-extrabold text-white">$117.0M USD</div>
          <span className="text-[10px] text-emerald-400 block">$99.5M Disbursed YTD (85%)</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Verified Smallholders Reached
          </span>
          <div className="text-2xl font-mono font-extrabold text-emerald-400">1,334,300</div>
          <span className="text-[10px] text-slate-400 block">45.4% Female Smallholders</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            E-Voucher Redemption Velocity
          </span>
          <div className="text-2xl font-mono font-extrabold text-cyan-300">93.8%</div>
          <span className="text-[10px] text-slate-400 block">At 4,810 Certified Agro-Dealers</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#07261B] border border-[#14533C] space-y-1">
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
            Fraudulent Claims Deflected
          </span>
          <div className="text-2xl font-mono font-extrabold text-white">7,540 Attempts</div>
          <span className="text-[10px] text-emerald-300 font-bold block">$3.82M Public Funds Saved</span>
        </div>
      </div>

      {/* Programme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {programmes.map((prg) => (
          <div
            key={prg.id}
            className="p-5 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-3.5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-emerald-400 font-bold text-[11px]">{prg.id}</span>
                <h4 className="font-extrabold text-white text-sm mt-0.5">{prg.name}</h4>
                <div className="text-[11px] text-slate-400">{prg.fundingAgency}</div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  prg.status === "Active & Disbursing"
                    ? "bg-[#07261B] text-emerald-300 border-[#14533C]"
                    : "bg-[#162228] text-slate-300 border-[#1D2A32]"
                }`}
              >
                {prg.status}
              </span>
            </div>

            {/* Financial Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Budget Deployed:</span>
                <span className="text-white font-bold">
                  ${(prg.disbursedUSD / 1000000).toFixed(1)}M / ${(prg.totalBudgetUSD / 1000000).toFixed(1)}M USD (
                  {Math.round((prg.disbursedUSD / prg.totalBudgetUSD) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-[#162228] h-2 rounded-full overflow-hidden border border-[#1D2A32]">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${(prg.disbursedUSD / prg.totalBudgetUSD) * 100}%` }}
                />
              </div>
            </div>

            {/* Demographic and Redemption Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2.5 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Beneficiaries</span>
                <span className="font-mono font-extrabold text-white text-xs mt-0.5 block">
                  {prg.beneficiariesReached.toLocaleString()}
                </span>
              </div>

              <div className="p-2.5 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Women Farmers</span>
                <span className="font-mono font-extrabold text-emerald-400 text-xs mt-0.5 block">
                  {prg.femaleParticipationPct}%
                </span>
              </div>

              <div className="p-2.5 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Youth Reach</span>
                <span className="font-mono font-extrabold text-cyan-300 text-xs mt-0.5 block">
                  {prg.youthParticipationPct}%
                </span>
              </div>

              <div className="p-2.5 bg-[#162228] rounded-xl border border-[#1D2A32]">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Redemption</span>
                <span className="font-mono font-extrabold text-white text-xs mt-0.5 block">
                  {prg.redemptionRatePct}%
                </span>
              </div>
            </div>

            {/* Mechanism & Commodities Footer */}
            <div className="pt-2 border-t border-[#1D2A32] flex items-center justify-between text-[11px]">
              <div className="text-slate-400">
                Method: <strong className="text-slate-200">{prg.voucherMethod}</strong> ({prg.subsidyPercentage}% Subsidy)
              </div>
              <div className="text-emerald-400 font-mono">
                {prg.fraudBlockedAttempts} Leakages Deflected
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
