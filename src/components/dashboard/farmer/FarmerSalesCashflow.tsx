import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Download,
  CheckCircle2,
  Clock,
  Building,
  FileSpreadsheet,
  Plus,
  X,
  Check,
  CreditCard,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { useApp } from "../../../context/AppContext";

export interface HarvestSaleContract {
  id: string;
  buyerName: string;
  buyerType: "Flour & Grain Miller" | "Export Logistics Consortium" | "Animal Feed Crusher" | "National Strategic Food Reserve";
  commodity: string;
  metricTonnes: number;
  pricePerMTUSD: number;
  totalValueUSD: number;
  deliveryLocation: string;
  contractDate: string;
  deliveryDeadline: string;
  escrowStatus: "100% Settled" | "50% Advance in Escrow" | "Pending Warehouse Receipt";
  advancePaidUSD: number;
  balanceDueUSD: number;
  paymentRail: string;
}

export interface SeasonFinancialSummary {
  season: string;
  grossRevenueUSD: number;
  inputCostsUSD: number;
  mechanizationLaborUSD: number;
  debtServiceUSD: number;
  insurancePremiumUSD: number;
  netFarmerProfitUSD: number;
  profitMarginPct: number;
}

export const FarmerSalesCashflow: React.FC = () => {
  const { currentFarm } = useApp();

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isAddContractModalOpen, setIsAddContractModalOpen] = useState(false);

  // Harvest Sales Contracts
  const [salesContracts, setSalesContracts] = useState<HarvestSaleContract[]>([
    {
      id: "CTR-2026-8801",
      buyerName: "Pan-African Milling Ltd",
      buyerType: "Flour & Grain Miller",
      commodity: "Yellow Maize (Grade 1)",
      metricTonnes: 800,
      pricePerMTUSD: 295,
      totalValueUSD: 236000,
      deliveryLocation: "Zambezi Central Silo #04",
      contractDate: "2026-09-15",
      deliveryDeadline: "2027-02-28",
      escrowStatus: "50% Advance in Escrow",
      advancePaidUSD: 118000,
      balanceDueUSD: 118000,
      paymentRail: "SAFEX Escrow / Standard Bank ZAR Rail",
    },
    {
      id: "CTR-2026-8802",
      buyerName: "Afrilog Grain Export Consortium",
      buyerType: "Export Logistics Consortium",
      commodity: "Grade 1 Maize (Export Grade)",
      metricTonnes: 450,
      pricePerMTUSD: 310,
      totalValueUSD: 139500,
      deliveryLocation: "Durban Multi-Modal Terminal",
      contractDate: "2026-10-02",
      deliveryDeadline: "2027-03-15",
      escrowStatus: "50% Advance in Escrow",
      advancePaidUSD: 69750,
      balanceDueUSD: 69750,
      paymentRail: "PAPSS Cross-Border Intra-African Rail",
    },
    {
      id: "CTR-2025-7740",
      buyerName: "Southern Oilseed & Feeds",
      buyerType: "Animal Feed Crusher",
      commodity: "Soybeans (Non-GMO)",
      metricTonnes: 300,
      pricePerMTUSD: 440,
      totalValueUSD: 132000,
      deliveryLocation: "Bloemfontein Processing Plant",
      contractDate: "2025-08-20",
      deliveryDeadline: "2026-02-15",
      escrowStatus: "100% Settled",
      advancePaidUSD: 132000,
      balanceDueUSD: 0,
      paymentRail: "EFT Wire Settlement",
    },
  ]);

  // Historical Financial Statements & Profitability
  const [financialSummaries] = useState<SeasonFinancialSummary[]>([
    {
      season: "2025/2026 Season (Current)",
      grossRevenueUSD: 457250,
      inputCostsUSD: 142000,
      mechanizationLaborUSD: 68000,
      debtServiceUSD: 38640,
      insurancePremiumUSD: 5890,
      netFarmerProfitUSD: 202720,
      profitMarginPct: 44.3,
    },
    {
      season: "2024/2025 Season",
      grossRevenueUSD: 382320,
      inputCostsUSD: 128000,
      mechanizationLaborUSD: 62000,
      debtServiceUSD: 34100,
      insurancePremiumUSD: 5200,
      netFarmerProfitUSD: 153020,
      profitMarginPct: 40.0,
    },
    {
      season: "2023/2024 Season (Drought)",
      grossRevenueUSD: 315200, // Includes $38,000 parametric claim
      inputCostsUSD: 120000,
      mechanizationLaborUSD: 58000,
      debtServiceUSD: 31000,
      insurancePremiumUSD: 4800,
      netFarmerProfitUSD: 101400,
      profitMarginPct: 32.2,
    },
  ]);

  // Form State for new contract
  const [buyerName, setBuyerName] = useState("");
  const [buyerType, setBuyerType] = useState<HarvestSaleContract["buyerType"]>("Flour & Grain Miller");
  const [commodity, setCommodity] = useState("Yellow Maize (Grade 1)");
  const [tonnes, setTonnes] = useState("300");
  const [priceMT, setPriceMT] = useState("300");
  const [deliveryLoc, setDeliveryLoc] = useState("Zambezi Silo #04");
  const [deadline, setDeadline] = useState("2027-03-31");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleAddContract = (e: React.FormEvent) => {
    e.preventDefault();
    const mt = Number(tonnes) || 100;
    const price = Number(priceMT) || 280;
    const total = mt * price;
    const advance = Math.round(total * 0.5);

    const contract: HarvestSaleContract = {
      id: `CTR-2026-${Math.floor(8810 + Math.random() * 80)}`,
      buyerName: buyerName || "Certified Agri-Buyer",
      buyerType: buyerType,
      commodity: commodity,
      metricTonnes: mt,
      pricePerMTUSD: price,
      totalValueUSD: total,
      deliveryLocation: deliveryLoc,
      contractDate: new Date().toISOString().slice(0, 10),
      deliveryDeadline: deadline,
      escrowStatus: "50% Advance in Escrow",
      advancePaidUSD: advance,
      balanceDueUSD: total - advance,
      paymentRail: "SAFEX Escrow Guaranteed",
    };

    setSalesContracts((prev) => [contract, ...prev]);
    setIsAddContractModalOpen(false);
    showToast(`Registered forward contract for ${contract.metricTonnes} MT ($${contract.totalValueUSD.toLocaleString()} USD).`);
  };

  const handleExportStatement = () => {
    const csvContent =
      "Contract ID,Buyer Name,Type,Commodity,Tonnes,Price/MT USD,Total USD,Escrow Status,Advance USD,Balance Due USD\n" +
      salesContracts
        .map(
          (c) =>
            `"${c.id}","${c.buyerName}","${c.buyerType}","${c.commodity}",${c.metricTonnes},${c.pricePerMTUSD},${c.totalValueUSD},"${c.escrowStatus}",${c.advancePaidUSD},${c.balanceDueUSD}`
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Harvest_Sales_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Exported harvest sales contracts (.CSV).");
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

      {/* Top Banner: Financial Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Contracted Harvest Sales
          </span>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-white">
            ${salesContracts.reduce((a, b) => a + b.totalValueUSD, 0).toLocaleString()} USD
          </div>
          <span className="text-[10px] text-slate-400 block">
            {salesContracts.reduce((a, b) => a + b.metricTonnes, 0).toLocaleString()} MT Total Volume
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#07261B] border border-[#14533C] space-y-1">
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
            Escrow Protected Advance
          </span>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-300">
            ${salesContracts.reduce((a, b) => a + b.advancePaidUSD, 0).toLocaleString()} USD
          </div>
          <span className="text-[10px] text-emerald-400 font-mono block">Zero Buyer Counterparty Risk</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Pending Balance at Silo
          </span>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-white">
            ${salesContracts.reduce((a, b) => a + b.balanceDueUSD, 0).toLocaleString()} USD
          </div>
          <span className="text-[10px] text-slate-400 block">Payable on physical delivery</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Net Farmer Margin (YTD)
          </span>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400">44.3%</div>
          <span className="text-[10px] text-slate-400 block">$202,720 USD Net Take-Home</span>
        </div>
      </div>

      {/* SECTION 1: Harvest Sales Contracts & Escrow Payments Ledger */}
      <div className="bg-[#10171B] rounded-2xl border border-[#1D2A32] overflow-hidden shadow-sm space-y-0">
        <div className="p-4 sm:p-5 bg-[#162228] border-b border-[#1D2A32] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-white">
                Forward Harvest Sales Contracts & Escrow Settlement Timeline
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Binding off-take contracts locked in SAFEX and PAPSS multi-currency escrow vaults.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportStatement}
              className="px-3.5 py-2 rounded-xl bg-[#10171B] hover:bg-[#1D2A32] text-slate-200 border border-[#1D2A32] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Contracts (.CSV)</span>
            </button>

            <button
              onClick={() => setIsAddContractModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-300" />
              <span>Log Off-Take Contract</span>
            </button>
          </div>
        </div>

        {/* Sales Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#10171B] text-slate-400 border-b border-[#1D2A32] font-semibold">
                <th className="p-3.5">Contract Ref & Off-Taker</th>
                <th className="p-3.5">Commodity & MT</th>
                <th className="p-3.5">Price & Total Value</th>
                <th className="p-3.5">Escrow Advance</th>
                <th className="p-3.5">Balance on Delivery</th>
                <th className="p-3.5">Delivery Deadline</th>
                <th className="p-3.5 text-right">Settlement Rail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2A32]">
              {salesContracts.map((ctr) => (
                <tr key={ctr.id} className="hover:bg-[#162228]/50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-mono text-emerald-400 font-bold">{ctr.id}</div>
                    <div className="font-extrabold text-white text-xs mt-0.5">{ctr.buyerName}</div>
                    <div className="text-[10px] text-slate-400">{ctr.buyerType}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-semibold text-white">{ctr.commodity}</div>
                    <div className="font-mono text-emerald-300 font-bold">{ctr.metricTonnes} MT</div>
                  </td>

                  <td className="p-3.5 font-mono">
                    <div className="text-base font-extrabold text-white">
                      ${ctr.totalValueUSD.toLocaleString()} USD
                    </div>
                    <div className="text-[10px] text-slate-400">${ctr.pricePerMTUSD} / MT</div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-mono font-bold text-emerald-300">
                      ${ctr.advancePaidUSD.toLocaleString()} USD
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#07261B] text-emerald-300 border border-[#14533C]">
                      {ctr.escrowStatus}
                    </span>
                  </td>

                  <td className="p-3.5 font-mono">
                    <div className="font-bold text-white">${ctr.balanceDueUSD.toLocaleString()} USD</div>
                    <div className="text-[10px] text-slate-400">{ctr.deliveryLocation}</div>
                  </td>

                  <td className="p-3.5 font-mono text-slate-300">
                    <div>{ctr.deliveryDeadline}</div>
                    <div className="text-[10px] text-slate-500">Booked slot</div>
                  </td>

                  <td className="p-3.5 text-right font-mono text-slate-300 text-[11px]">
                    <div>{ctr.paymentRail}</div>
                    <div className="text-[10px] text-emerald-400">Lien Validated</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Multi-Season Financial History & Profitability Statement */}
      <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1D2A32]">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Historical Financial Performance & Cashflow Statement
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive farm income, input expenditure, debt service allocation, and net owner margins.
            </p>
          </div>

          <span className="text-xs font-mono font-bold bg-[#07261B] text-emerald-300 px-3 py-1 rounded-xl border border-[#14533C]">
            Bank-Audited Agricultural Accounting
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {financialSummaries.map((fin, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#162228] border border-[#1D2A32] space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center pb-2 border-b border-[#1D2A32]">
                  <h4 className="font-extrabold text-white text-sm">{fin.season}</h4>
                  <span className="font-mono font-bold text-emerald-400 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                    {fin.profitMarginPct}% Margin
                  </span>
                </div>

                <div className="space-y-2 mt-3 text-slate-300">
                  <div className="flex justify-between">
                    <span>Gross Farm Revenue:</span>
                    <span className="font-mono font-bold text-white">
                      ${fin.grossRevenueUSD.toLocaleString()} USD
                    </span>
                  </div>

                  <div className="flex justify-between text-red-300">
                    <span>Seed & Fertilizer Inputs:</span>
                    <span className="font-mono">-${fin.inputCostsUSD.toLocaleString()} USD</span>
                  </div>

                  <div className="flex justify-between text-red-300">
                    <span>Machinery, Fuel & Labor:</span>
                    <span className="font-mono">-${fin.mechanizationLaborUSD.toLocaleString()} USD</span>
                  </div>

                  <div className="flex justify-between text-red-300">
                    <span>Credit Facility Debt Service:</span>
                    <span className="font-mono">-${fin.debtServiceUSD.toLocaleString()} USD</span>
                  </div>

                  <div className="flex justify-between text-red-300">
                    <span>Parametric Insurance Premium:</span>
                    <span className="font-mono">-${fin.insurancePremiumUSD.toLocaleString()} USD</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1D2A32] flex justify-between items-baseline">
                <span className="font-bold text-white uppercase text-[11px]">Net Farm Profit:</span>
                <span className="font-mono text-lg font-extrabold text-emerald-400">
                  ${fin.netFarmerProfitUSD.toLocaleString()} USD
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Forward Contract Modal */}
      {isAddContractModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B1013]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#10171B] rounded-3xl max-w-lg w-full border border-[#1D2A32] shadow-2xl overflow-hidden my-auto">
            <div className="px-5 py-4 bg-[#07261B] text-white flex items-center justify-between border-b border-[#14533C]">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Register Harvest Forward Off-Take Contract
                </h3>
              </div>
              <button
                onClick={() => setIsAddContractModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddContract} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Off-Taker / Buyer Name</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g., Pan-African Milling Ltd"
                    className="w-full bg-[#162228] text-white px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Buyer Category</label>
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value as HarvestSaleContract["buyerType"])}
                    className="w-full bg-[#162228] text-white px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Flour & Grain Miller">Flour &amp; Grain Miller</option>
                    <option value="Export Logistics Consortium">Export Logistics Consortium</option>
                    <option value="Animal Feed Crusher">Animal Feed Crusher</option>
                    <option value="National Strategic Food Reserve">National Strategic Food Reserve</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Contract MT</label>
                  <input
                    type="number"
                    value={tonnes}
                    onChange={(e) => setTonnes(e.target.value)}
                    className="w-full bg-[#162228] text-white font-mono px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Price / MT ($)</label>
                  <input
                    type="number"
                    value={priceMT}
                    onChange={(e) => setPriceMT(e.target.value)}
                    className="w-full bg-[#162228] text-white font-mono px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Commodity</label>
                  <input
                    type="text"
                    value={commodity}
                    onChange={(e) => setCommodity(e.target.value)}
                    className="w-full bg-[#162228] text-white px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Designated Silo / Port</label>
                  <input
                    type="text"
                    value={deliveryLoc}
                    onChange={(e) => setDeliveryLoc(e.target.value)}
                    className="w-full bg-[#162228] text-white px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Delivery Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-[#162228] text-white font-mono px-3 py-2 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] text-[11px] text-slate-300">
                <span className="font-bold text-white block mb-0.5">Escrow Pre-Funding Mandate:</span>
                50% advance ($
                {Math.round((Number(tonnes) * Number(priceMT) * 0.5) || 0).toLocaleString()} USD)
                will be deposited by the buyer into the SAFEX licensed clearing vault upon contract execution.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddContractModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#162228] text-slate-300 font-bold hover:bg-[#1D2A32] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold transition-all border border-[#196349] shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Lock Forward Contract</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
