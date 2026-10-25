import React, { useState } from "react";
import {
  Coins,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Download,
  Percent,
  Check,
  X,
  CreditCard,
  Building,
  Layers,
  Sparkles,
  RefreshCw,
  Warehouse,
} from "lucide-react";
import { useApp } from "../../../context/AppContext";

export const FarmerFinancingInsurance: React.FC = () => {
  const { currentFarm, financingProducts } = useApp();

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [selectedFacilityForRepay, setSelectedFacilityForRepay] = useState<string | null>(null);
  const [repayAmount, setRepayAmount] = useState<string>("5420");
  const [isProcessingRepayment, setIsProcessingRepayment] = useState(false);

  // Available Financing Offers
  const [loanOffers] = useState([
    {
      id: "OFFER-INP-01",
      name: "Seasonal Input Credit Facility",
      provider: "Standard Bank / AfDB Risk Pool",
      maxAmountUSD: 85000,
      interestRateAnnual: 9.2,
      tenureMonths: 8,
      collateral: "e-WRS Grain Lien + Crop Off-Take Escrow",
      preApproved: true,
      purpose: "Certified drought-tolerant seed, basal & top-dress fertilizer, crop protection",
    },
    {
      id: "OFFER-MEC-02",
      name: "Smart Center-Pivot & Solar Mechanization Lease",
      provider: "Agricultural Development Bank / IFC Blended",
      maxAmountUSD: 120000,
      interestRateAnnual: 8.8,
      tenureMonths: 36,
      collateral: "Asset Telematics Lien + Land Freehold Reference",
      preApproved: true,
      purpose: "Variable rate irrigation pivots, solar pumping inverters, GPS guidance kits",
    },
    {
      id: "OFFER-LIQ-03",
      name: "Harvest Post-Storage Liquidity (e-WRS)",
      provider: "Afrilog Trade Credit Hub",
      maxAmountUSD: 50000,
      interestRateAnnual: 8.5,
      tenureMonths: 6,
      collateral: "SAFEX Licensed Silo Receipt #08819",
      preApproved: true,
      purpose: "Immediate working capital to prevent distress sales at harvest trough",
    },
  ]);

  // Available Parametric Insurance Offers
  const [insuranceOffers] = useState([
    {
      id: "INS-DROUGHT-01",
      name: "Satellite Rainfall Deficit Index (CHIRPS)",
      underwriter: "Swiss Re / Africa Re Agriculture",
      totalSumInsuredUSD: 95000,
      premiumRatePct: 6.2,
      annualPremiumUSD: 5890,
      triggerIndex: "CHIRPS 18-day consecutive rainfall deficit < 25mm",
      settlementTime: "48-Hour Instant M-Pesa / Bank Wire",
      coveredParcels: "All 4 Parcels (250 Ha)",
    },
    {
      id: "INS-FLOOD-02",
      name: "Excess Precipitation & Flash Flood Rider",
      underwriter: "ZEP-RE / Munich Re Agriculture",
      totalSumInsuredUSD: 45000,
      premiumRatePct: 4.2,
      annualPremiumUSD: 1890,
      triggerIndex: "Sentinel-1 SAR surface water flood extent > 15%",
      settlementTime: "Direct Account Credit",
      coveredParcels: "Parcel 03 & 04 Lowlands",
    },
    {
      id: "INS-MPCI-03",
      name: "Multi-Peril Harvest Yield Floor Guarantee",
      underwriter: "Old Mutual Agricultural Syndicate",
      totalSumInsuredUSD: 110000,
      premiumRatePct: 7.5,
      annualPremiumUSD: 8250,
      triggerIndex: "Combined Weather + Pest + Yield Floor < 70% Historic",
      settlementTime: "Post-Harvest Audit",
      coveredParcels: "Whole Commercial Holding",
    },
  ]);

  // Active Loans & Balances
  const [activeLoans, setActiveLoans] = useState([
    {
      id: "LN-2026-9041",
      facilityName: "AfDB Working Capital & Input Facility",
      lender: "Standard Bank Agriculture",
      principalUSD: 85000,
      outstandingUSD: 42000,
      repaidUSD: 43000,
      nextPaymentDueDate: "2026-11-15",
      installmentUSD: 5420,
      interestRatePct: 9.2,
      maturityDate: "2027-04-30",
      status: "Performing (Clean Standing)",
      repaymentChannel: "Forward Contract Off-Take Escrow (Pan-African Milling)",
    },
    {
      id: "LN-2025-4812",
      facilityName: "Solar Pump & Center Pivot Lease",
      lender: "FMO / Nedbank Green Agri",
      principalUSD: 60000,
      outstandingUSD: 24800,
      repaidUSD: 35200,
      nextPaymentDueDate: "2026-12-01",
      installmentUSD: 2150,
      interestRatePct: 8.8,
      maturityDate: "2027-11-30",
      status: "Performing",
      repaymentChannel: "Debit Order / EFT Wire",
    },
  ]);

  // Active Insurance Policies & Expiry
  const [activePolicies, setActivePolicies] = useState([
    {
      id: "POL-AFR-2026-104",
      name: "Parametric Drought Index Policy",
      underwriter: "Africa Re Group / Swiss Re",
      totalSumInsuredUSD: 95000,
      grossPremiumUSD: 5890,
      expiryDate: "2026-11-30",
      daysToExpiry: 43,
      status: "Active & Monitored",
      triggerSensor: "NASA SMAP + Sentinel-2 MSI",
      autoRenew: true,
    },
    {
      id: "POL-MAC-882",
      name: "Heavy Tractor & Combine Harvester Breakdown",
      underwriter: "Old Mutual Insure",
      totalSumInsuredUSD: 65000,
      grossPremiumUSD: 2400,
      expiryDate: "2027-03-31",
      daysToExpiry: 164,
      status: "Active",
      triggerSensor: "GPS Telematics Diagnostics",
      autoRenew: true,
    },
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleToggleAutoRenew = (policyId: string) => {
    setActivePolicies((prev) =>
      prev.map((p) => (p.id === policyId ? { ...p, autoRenew: !p.autoRenew } : p))
    );
    showToast("Policy auto-renewal preference updated.");
  };

  const handleMakeRepayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacilityForRepay) return;
    setIsProcessingRepayment(true);

    setTimeout(() => {
      setIsProcessingRepayment(false);
      const paid = Number(repayAmount) || 0;
      setActiveLoans((prev) =>
        prev.map((l) =>
          l.id === selectedFacilityForRepay
            ? {
                ...l,
                outstandingUSD: Math.max(0, l.outstandingUSD - paid),
                repaidUSD: l.repaidUSD + paid,
              }
            : l
        )
      );
      setSelectedFacilityForRepay(null);
      showToast(`Repayment of $${paid.toLocaleString()} USD successfully executed via Escrow settlement.`);
    }, 1200);
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

      {/* High-Level Overview Metrics: Debt, Repayments, Policy Expiry */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Outstanding Debt
          </span>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-white">
            ${activeLoans.reduce((acc, l) => acc + l.outstandingUSD, 0).toLocaleString()} USD
          </div>
          <span className="text-[10px] font-mono text-emerald-400 block">
            ${activeLoans.reduce((acc, l) => acc + l.repaidUSD, 0).toLocaleString()} USD Repaid
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Next Upcoming Repayment
          </span>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-amber-300">
            $5,420 USD
          </div>
          <span className="text-[10px] text-slate-400 block">Due Nov 15, 2026 (In 28 Days)</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#10171B] border border-[#1D2A32] space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Insurance Sum (TSI)
          </span>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400">
            ${activePolicies.reduce((acc, p) => acc + p.totalSumInsuredUSD, 0).toLocaleString()} USD
          </div>
          <span className="text-[10px] text-slate-400 block">100% Cropland & Machinery</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#07261B] border border-[#14533C] space-y-1">
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
            Earliest Policy Expiry
          </span>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-white">43 Days</div>
          <span className="text-[10px] text-emerald-300 font-bold block">Nov 30, 2026 • Auto-Renew ON</span>
        </div>
      </div>

      {/* SECTION 1: Active Loan Balances & Upcoming Repayment Schedule */}
      <div className="bg-[#10171B] rounded-2xl border border-[#1D2A32] overflow-hidden shadow-sm space-y-0">
        <div className="p-4 sm:p-5 bg-[#162228] border-b border-[#1D2A32] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-white">
                Active Loan Balances & Upcoming Repayment Schedule
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Debt service schedules synchronized with forward harvest escrow deductions and mobile money settlement.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-[#07261B] px-2.5 py-1 rounded-lg border border-[#14533C]">
            Zero Arrears • 100% On-Time Record
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#10171B] text-slate-400 border-b border-[#1D2A32] font-semibold">
                <th className="p-3.5">Facility & Lender</th>
                <th className="p-3.5">Disbursed / Principal</th>
                <th className="p-3.5">Current Balance</th>
                <th className="p-3.5">Next Installment</th>
                <th className="p-3.5">Rate & Maturity</th>
                <th className="p-3.5">Repayment Method</th>
                <th className="p-3.5 text-right">Repayment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2A32]">
              {activeLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-[#162228]/50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-mono text-emerald-400 font-bold">{loan.id}</div>
                    <div className="font-extrabold text-white text-xs mt-0.5">{loan.facilityName}</div>
                    <div className="text-[10px] text-slate-400">{loan.lender}</div>
                  </td>

                  <td className="p-3.5 font-mono">
                    <div className="font-bold text-white">${loan.principalUSD.toLocaleString()} USD</div>
                    <div className="text-[10px] text-emerald-400">${loan.repaidUSD.toLocaleString()} repaid</div>
                  </td>

                  <td className="p-3.5 font-mono">
                    <div className="text-base font-extrabold text-white">
                      ${loan.outstandingUSD.toLocaleString()} USD
                    </div>
                    <div className="w-24 bg-[#162228] h-1.5 rounded-full overflow-hidden mt-1 border border-[#1D2A32]">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${(loan.repaidUSD / loan.principalUSD) * 100}%` }}
                      />
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-mono font-extrabold text-amber-300 text-sm">
                      ${loan.installmentUSD.toLocaleString()} USD
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">Due: {loan.nextPaymentDueDate}</div>
                  </td>

                  <td className="p-3.5 font-mono text-slate-300">
                    <div>{loan.interestRatePct}% p.a.</div>
                    <div className="text-[10px] text-slate-500">Maturity: {loan.maturityDate}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="text-slate-200 font-medium">{loan.repaymentChannel}</div>
                    <div className="text-[10px] text-emerald-300 font-mono">Status: {loan.status}</div>
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        setSelectedFacilityForRepay(loan.id);
                        setRepayAmount(String(loan.installmentUSD));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] transition-all cursor-pointer"
                    >
                      Make Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Active Insurance Policies & Policy Expiry Dates */}
      <div className="bg-[#10171B] rounded-2xl border border-[#1D2A32] overflow-hidden shadow-sm space-y-0">
        <div className="p-4 sm:p-5 bg-[#162228] border-b border-[#1D2A32] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-white">
                Active Insurance Policies, Coverage Telemetry & Expiry Dates
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Satellite indices armed to trigger immediate automatic compensation if weather indices breach contract ceilings.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-[#07261B] px-2.5 py-1 rounded-lg border border-[#14533C]">
            All Parcels Insured
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#10171B] text-slate-400 border-b border-[#1D2A32] font-semibold">
                <th className="p-3.5">Policy Ref & Coverage</th>
                <th className="p-3.5">Underwriter Syndicate</th>
                <th className="p-3.5">Total Sum Insured</th>
                <th className="p-3.5">Gross Premium</th>
                <th className="p-3.5">Satellite Oracle Trigger</th>
                <th className="p-3.5">Expiry Date & Countdown</th>
                <th className="p-3.5 text-right">Auto-Renewal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2A32]">
              {activePolicies.map((pol) => (
                <tr key={pol.id} className="hover:bg-[#162228]/50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-mono text-emerald-400 font-bold">{pol.id}</div>
                    <div className="font-extrabold text-white text-xs mt-0.5">{pol.name}</div>
                  </td>

                  <td className="p-3.5 text-slate-300">
                    <div className="font-semibold text-white">{pol.underwriter}</div>
                    <div className="text-[10px] text-slate-400">Direct Syndicate Treaty</div>
                  </td>

                  <td className="p-3.5 font-mono font-extrabold text-white text-sm">
                    ${pol.totalSumInsuredUSD.toLocaleString()} USD
                  </td>

                  <td className="p-3.5 font-mono text-slate-300">
                    <div>${pol.grossPremiumUSD.toLocaleString()} USD</div>
                    <div className="text-[10px] text-emerald-400">Paid via Harvest Advance</div>
                  </td>

                  <td className="p-3.5 font-mono text-slate-300 text-[11px]">
                    <div className="text-emerald-300 font-bold">{pol.triggerSensor}</div>
                    <div className="text-[10px] text-slate-400">Continuous 12-hour pass</div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-mono font-bold text-white">{pol.expiryDate}</div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block mt-0.5 ${
                        pol.daysToExpiry <= 60
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : "bg-[#07261B] text-emerald-300 border border-[#14533C]"
                      }`}
                    >
                      {pol.daysToExpiry} Days Remaining
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleToggleAutoRenew(pol.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        pol.autoRenew
                          ? "bg-[#07261B] text-emerald-300 border border-[#14533C]"
                          : "bg-[#162228] text-slate-400 border border-[#1D2A32]"
                      }`}
                    >
                      {pol.autoRenew ? "Auto-Renew Active" : "Disabled"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Available Financing & Insurance Offers Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Financing Offers */}
        <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1D2A32]">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-white">Pre-Approved Agri-Financing Offers</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
              Credit Tier A+
            </span>
          </div>

          <div className="space-y-3">
            {loanOffers.map((offer) => (
              <div
                key={offer.id}
                className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] hover:border-emerald-500/50 transition-all space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-white text-sm">{offer.name}</h4>
                    <span className="text-[11px] text-slate-400">{offer.provider}</span>
                  </div>
                  <span className="font-mono font-extrabold text-emerald-300 text-sm bg-[#10171B] px-2.5 py-1 rounded border border-[#1D2A32]">
                    Up to ${offer.maxAmountUSD.toLocaleString()} USD
                  </span>
                </div>

                <p className="text-[11px] text-slate-300">{offer.purpose}</p>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-[#1D2A32]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Annual Interest</span>
                    <span className="font-bold text-white">{offer.interestRateAnnual}% p.a. (Subsidized)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tenure</span>
                    <span className="font-bold text-white">{offer.tenureMonths} Months</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 truncate max-w-[220px]">
                    Lien: {offer.collateral}
                  </span>
                  <button
                    onClick={() => {
                      showToast(`Application initiated for ${offer.name}. Auto-sharing digital farm passport.`);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] transition-all cursor-pointer"
                  >
                    Accept Offer →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Insurance Offers */}
        <div className="bg-[#10171B] rounded-2xl p-5 sm:p-6 border border-[#1D2A32] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1D2A32]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-white">Available Parametric Weather Policies</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
              Zero Adjuster Overhead
            </span>
          </div>

          <div className="space-y-3">
            {insuranceOffers.map((ins) => (
              <div
                key={ins.id}
                className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] hover:border-emerald-500/50 transition-all space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-white text-sm">{ins.name}</h4>
                    <span className="text-[11px] text-slate-400">{ins.underwriter}</span>
                  </div>
                  <span className="font-mono font-extrabold text-emerald-300 text-sm bg-[#10171B] px-2.5 py-1 rounded border border-[#1D2A32]">
                    ${ins.totalSumInsuredUSD.toLocaleString()} TSI
                  </span>
                </div>

                <div className="p-2 bg-[#10171B] rounded-lg border border-[#1D2A32] text-[11px] text-slate-300 space-y-0.5 font-mono">
                  <div>Trigger: <strong className="text-amber-300">{ins.triggerIndex}</strong></div>
                  <div className="text-[10px] text-slate-400">Settlement: {ins.settlementTime}</div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-xs font-mono">
                    <span className="text-slate-400">Premium: </span>
                    <strong className="text-white">${ins.annualPremiumUSD} USD ({ins.premiumRatePct}%)</strong>
                  </div>
                  <button
                    onClick={() => {
                      showToast(`Bound weather policy ${ins.name}. Instant certificate issued.`);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] transition-all cursor-pointer"
                  >
                    Bind Policy →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Repayment Modal */}
      {selectedFacilityForRepay && (
        <div className="fixed inset-0 z-50 bg-[#0B1013]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#10171B] rounded-3xl max-w-md w-full border border-[#1D2A32] shadow-2xl overflow-hidden my-auto">
            <div className="px-5 py-4 bg-[#07261B] text-white flex items-center justify-between border-b border-[#14533C]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Execute Loan Repayment
                </h3>
              </div>
              <button
                onClick={() => setSelectedFacilityForRepay(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMakeRepayment} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Repayment Facility ID</label>
                <div className="font-mono text-emerald-400 font-bold p-2.5 rounded-xl bg-[#162228] border border-[#1D2A32]">
                  {selectedFacilityForRepay}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Repayment Amount (USD)</label>
                <input
                  type="number"
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  className="w-full bg-[#162228] text-white font-mono font-bold text-base px-3.5 py-2.5 rounded-xl border border-[#1D2A32] focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1.5">
                <span className="font-bold text-white block">Payment Source:</span>
                <div className="text-[11px] text-slate-300">
                  • Deducted from Pan-African Milling Off-Take Escrow Advance
                </div>
                <div className="text-[11px] text-emerald-400">
                  • Zero transaction fees under African Development Bank concessional rail
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedFacilityForRepay(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#162228] text-slate-300 font-bold hover:bg-[#1D2A32] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingRepayment}
                  className="px-5 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold transition-all border border-[#196349] shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>{isProcessingRepayment ? "Authorizing..." : "Authorize Repayment"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
