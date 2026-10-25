import React, { useState } from "react";
import {
  DollarSign,
  Truck,
  FileText,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  BarChart3,
  Scale,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Percent,
  Search,
  Filter,
  Plus,
  Lock,
  Building,
  User,
  ExternalLink,
  ChevronRight,
  Download,
  AlertCircle,
  FileCheck,
  Zap,
  Info,
  Calendar,
  Sparkles,
  Star,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const FreightCommercialOperations: React.FC = () => {
  const { selectedCountry } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<
    | "pricing_engine"
    | "transport_marketplace"
    | "digital_contracts"
    | "payments_settlements"
    | "trade_finance"
    | "insurance_claims"
    | "cost_analytics"
    | "dispute_management"
  >("pricing_engine");

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // 1. Freight Pricing Engine State
  const [calcOrigin, setCalcOrigin] = useState("Free State Silos, South Africa");
  const [calcDestination, setCalcDestination] = useState("Port of Durban Container Terminal");
  const [calcDistanceKm, setCalcDistanceKm] = useState(560);
  const [calcTonnage, setCalcTonnage] = useState(34);
  const [calcCommodity, setCalcCommodity] = useState("Grain");
  const [calcLoadType, setCalcLoadType] = useState<"FTL" | "LTL">("FTL");
  const [calcReeferRequired, setCalcReeferRequired] = useState(false);
  const [calcCustomsEscort, setCalcCustomsEscort] = useState(false);
  const [calcTailLift, setCalcTailLift] = useState(false);

  // Dynamic pricing calculation
  const baseRatePerTonneKm = calcCommodity === "Cold-Chain Fresh Produce" ? 0.082 : 0.054; // USD per tonne-km
  const baseFreight = calcDistanceKm * calcTonnage * baseRatePerTonneKm;
  const fuelSurchargePct = 0.142; // +14.2% diesel price volatility index
  const fuelSurcharge = baseFreight * fuelSurchargePct;
  const seasonalHarvestFactor = 0.18; // +18% peak maize/soy harvest demand adjustment
  const seasonalCost = baseFreight * seasonalHarvestFactor;
  const accessorialCharges =
    (calcReeferRequired ? 240 : 0) +
    (calcCustomsEscort ? 180 : 0) +
    (calcTailLift ? 75 : 0);
  const totalCalculatedFreightUSD = Math.round(baseFreight + fuelSurcharge + seasonalCost + accessorialCharges);
  const effectiveRatePerTonne = Math.round(totalCalculatedFreightUSD / calcTonnage);

  // 2. Transport Marketplace Load Board State
  const [marketplaceLoads, setMarketplaceLoads] = useState([
    {
      id: "LOAD-2026-881",
      commodity: "Grade-A White Maize Grain",
      weightTonnes: 34,
      origin: "Free State Silos (Kroonstad, ZA)",
      destination: "Durban Agri-Export Pier (ZA)",
      pickupDate: "2026-10-22",
      budgetTargetUSD: 2450,
      equipmentRequired: "Tri-Axle Bulk Grain Tipper",
      status: "Active - Bids Open",
      bidsCount: 3,
      topBidUSD: 2380,
      bids: [
        { carrier: "Trans-Southern Bulk Freight", rating: 4.8, bidUSD: 2380, transitHours: 14, fleetType: "Volvo FH16 Tipper" },
        { carrier: "Apex Agro-Hauliers Ltd", rating: 4.6, bidUSD: 2450, transitHours: 16, fleetType: "Scania R500" },
        { carrier: "Highveld Logistics Co-op", rating: 4.9, bidUSD: 2520, transitHours: 13, fleetType: "Mercedes Actros 2645" },
      ],
    },
    {
      id: "LOAD-2026-882",
      commodity: "Export Quality Avocado (Hass)",
      weightTonnes: 22,
      origin: "Mount Kenya Outgrower Depots (Meru, KE)",
      destination: "Mombasa Cold Berths (KE)",
      pickupDate: "2026-10-23",
      budgetTargetUSD: 1950,
      equipmentRequired: "Continuous IoT Reefer (+4°C)",
      status: "Negotiating",
      bidsCount: 4,
      topBidUSD: 1890,
      bids: [
        { carrier: "Equator ColdChain Express", rating: 4.9, bidUSD: 1890, transitHours: 11, fleetType: "ThermoKing SmartReefer" },
        { carrier: "Rift Valley Freight Liners", rating: 4.7, bidUSD: 1920, transitHours: 12, fleetType: "Carrier Transicold 26t" },
      ],
    },
    {
      id: "LOAD-2026-883",
      commodity: "Certified Fairtrade Cocoa Beans",
      weightTonnes: 28,
      origin: "Ashanti Farming Union (Kumasi, GH)",
      destination: "Tema Deep-Sea Berth 2 (GH)",
      pickupDate: "2026-10-24",
      budgetTargetUSD: 1620,
      equipmentRequired: "Enclosed Weatherproof Box Truck",
      status: "Contract Awarded",
      bidsCount: 2,
      topBidUSD: 1580,
      bids: [
        { carrier: "Gold Coast Inter-Modal Logistics", rating: 4.8, bidUSD: 1580, transitHours: 9, fleetType: "DAF XF Curtainsider" },
      ],
    },
  ]);

  const handleAwardContract = (loadId: string, carrierName: string, amount: number) => {
    setMarketplaceLoads((prev) =>
      prev.map((l) =>
        l.id === loadId
          ? { ...l, status: "Contract Awarded", topBidUSD: amount }
          : l
      )
    );
    setToastMsg(`Contract for ${loadId} awarded to ${carrierName} for $${amount.toLocaleString()} USD. Digital Agreement generated.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // 3. Digital Contracts State
  const [selectedContract, setSelectedContract] = useState({
    contractId: "CTR-2026-AF-941",
    loadRef: "LOAD-2026-881",
    shipperName: "Kroonstad Agricultural Cooperative Union",
    carrierName: "Trans-Southern Bulk Freight Ltd",
    agreedFreightUSD: 2380,
    transitSlaHours: 14,
    maximumAllowedDelayHours: 3,
    delayPenaltyPerHourUSD: 50,
    cargoLiabilityLimitUSD: 125000,
    cancellationNoticeHours: 24,
    governingLaw: "AfCFTA Cross-Border Road Transport Convention & SADC Corridor Protocol",
    signedByShipper: true,
    signedByCarrier: true,
    timestamp: "2026-10-19 08:32 UTC (SHA-256 Verified)",
  });

  // 4. Payments, Escrow & Settlements State
  const [escrowShipments] = useState([
    {
      id: "ESC-8810",
      shipmentRef: "SHP-2026-904",
      consignee: "Gold Coast Milling Corp",
      carrier: "Trans-Southern Bulk",
      authorizedBank: "Standard Bank Agri-Escrow Services",
      totalInvoiceUSD: 2380,
      escrowDepositedUSD: 2380,
      carrierAdvanceUSD: 714, // 30% on verified pickup
      balanceHeldUSD: 1666, // 70% released on digital POD
      escrowStatus: "Milestone 1 Cleared (In Transit)",
      payoutMethod: "Central Bank RTGS / Local Currency Clearing",
    },
    {
      id: "ESC-8809",
      shipmentRef: "SHP-2026-903",
      consignee: "Olam Cocoa Processing",
      carrier: "Gold Coast Inter-Modal",
      authorizedBank: "Ecobank Commercial Payments",
      totalInvoiceUSD: 1580,
      escrowDepositedUSD: 1580,
      carrierAdvanceUSD: 474,
      balanceHeldUSD: 0,
      escrowStatus: "Fully Settled & Reconciled",
      payoutMethod: "PAPSS Pan-African Clearing (GHS)",
    },
  ]);

  // 5. Trade Finance State
  const [financeEligibleShipments] = useState([
    {
      id: "FIN-SHP-01",
      shipmentRef: "SHP-2026-904",
      invoiceValueUSD: 84000,
      advanceAvailableUSD: 67200, // 80% advance
      discountingRateAnnual: "8.5%",
      tenureDays: 30,
      financialPartner: "Trade & Development Bank (TDB) / AfDB",
      status: "Eligible for Instant Advance",
    },
    {
      id: "FIN-SHP-02",
      shipmentRef: "SHP-2026-781",
      invoiceValueUSD: 145000,
      advanceAvailableUSD: 116000,
      discountingRateAnnual: "7.8%",
      tenureDays: 45,
      financialPartner: "Standard Bank Commodity Trade Desk",
      status: "Advance Disbursed to Farmer Co-op",
    },
  ]);

  // 6. Insurance & Claims State
  const [insuranceClaims, setInsuranceClaims] = useState([
    {
      id: "CLM-2026-042",
      policyNumber: "POL-AFRICA-RE-9921",
      underwriter: "Africa Reinsurance Corporation & Santam",
      shipmentRef: "SHP-2026-872",
      incidentType: "Reefer Compressor Failure (Temperature Excursion > 14°C)",
      cargoDescription: "Export Fresh Green Beans & Snow Peas",
      claimedLossUSD: 14200,
      status: "Under Evidence Assessment",
      telematicsEvidenceVerified: true,
      reportedDate: "2026-10-17 14:20 UTC",
    },
    {
      id: "CLM-2026-039",
      policyNumber: "POL-APA-CROP-4412",
      underwriter: "APA Insurance East Africa",
      shipmentRef: "SHP-2026-850",
      incidentType: "Transit Collision & Bag Damage (42 Bags Split)",
      cargoDescription: "Non-GMO Soybeans",
      claimedLossUSD: 3850,
      status: "Approved & Settled via Escrow",
      telematicsEvidenceVerified: true,
      reportedDate: "2026-10-12 09:15 UTC",
    },
  ]);

  // 7. Dispute Management State
  const [activeDisputes, setActiveDisputes] = useState([
    {
      id: "DSP-2026-12",
      shipmentId: "SHP-2026-880",
      parties: "Highveld Agro (Shipper) vs. QuickFreight Co (Carrier)",
      category: "Late Delivery & Unloading Demurrage Dispute",
      amountContestedUSD: 650,
      description: "Carrier arrived 7.5 hours beyond the contracted SLA delivery window, causing missing export container ship loading slot. Shipper demands contractual late penalty deduction.",
      telematicsRecord: "GPS logs confirm 4.2-hour breakdown at Beitbridge border checkpoint.",
      step: 3,
      stepTitle: "Independent Telematics Evidence Evaluation",
      recommendedCompromise: "50% penalty waiver ($325) due to verified customs clearance server outage.",
      status: "Resolution Pending Acceptance",
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#0B3D2C] border border-[#14533C] text-white shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Commercial & Financial Header */}
      <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-[#07261B] px-2.5 py-0.5 rounded border border-[#14533C] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Commercial Freight Operations</span>
            </span>
            <span className="text-xs font-mono font-bold text-cyan-300 bg-[#082835] px-2 py-0.5 rounded border border-[#10485E]">
              Regulated Escrow & Carrier Marketplace
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">
            Freight Pricing, Transport Marketplace & Settlements
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Commercial and financial operational infrastructure: publish loads, negotiate tariffs, execute digital transport contracts, settle milestone escrow, and manage freight claims.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] text-right">
            <div className="text-[10px] font-bold uppercase text-slate-400">Escrow Value Protected</div>
            <div className="text-xl font-mono font-extrabold text-emerald-400">$3.84M USD</div>
            <div className="text-[10px] text-emerald-300">Standard Bank / Ecobank / PAPSS</div>
          </div>
        </div>
      </div>

      {/* Mandatory Regulatory Partner Notice */}
      <div className="p-3.5 bg-[#07261B] rounded-xl border border-[#14533C] text-xs text-emerald-200 flex items-start gap-3">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Authorized Financial Architecture: </strong>
          Financial transactions, tripartite escrow reserves, invoice discounting, and shipment lending are executed exclusively through authorized financial partners (including Standard Bank Agri-Escrow, Ecobank, Trade & Development Bank TDB, and PAPSS). The platform operates as a secure orchestrator and does not take public deposits directly.
        </div>
      </div>

      {/* Commercial Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-[#10171B] p-2 rounded-2xl border border-[#1D2A32] text-xs font-bold">
        <button
          onClick={() => setActiveSubTab("pricing_engine")}
          className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "pricing_engine"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>Pricing Engine</span>
        </button>

        <button
          onClick={() => setActiveSubTab("transport_marketplace")}
          className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "transport_marketplace"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Truck className="w-4 h-4 text-cyan-400" />
          <span>Load Marketplace ({marketplaceLoads.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("digital_contracts")}
          className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "digital_contracts"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <FileCheck className="w-4 h-4 text-[#F5B942]" />
          <span>Digital Contracts</span>
        </button>

        <button
          onClick={() => setActiveSubTab("payments_settlements")}
          className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "payments_settlements"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <span>Escrow & Settlements</span>
        </button>

        <button
          onClick={() => setActiveSubTab("trade_finance")}
          className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "trade_finance"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Zap className="w-4 h-4 text-purple-400" />
          <span>Trade Finance & Advances</span>
        </button>

        <button
          onClick={() => setActiveSubTab("insurance_claims")}
          className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "insurance_claims"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>Cargo Insurance & Claims</span>
        </button>

        <button
          onClick={() => setActiveSubTab("cost_analytics")}
          className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "cost_analytics"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <BarChart3 className="w-4 h-4 text-teal-400" />
          <span>Cost & Margin Analytics</span>
        </button>

        <button
          onClick={() => setActiveSubTab("dispute_management")}
          className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "dispute_management"
              ? "bg-[#162228] text-white border border-[#1D2A32] shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Disputes ({activeDisputes.length})</span>
        </button>
      </div>

      {/* MODULE 1: FREIGHT PRICING ENGINE */}
      {activeSubTab === "pricing_engine" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Rate Card & Tariff Inputs */}
          <div className="lg:col-span-5 bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] space-y-4">
            <div className="pb-3 border-b border-[#19262F]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-[#07261B] px-2 py-0.5 rounded border border-[#14533C]">
                Dynamic Rate Engine
              </span>
              <h3 className="font-extrabold text-base text-white mt-1">
                Agricultural Freight Pricing Calculator
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculates transparent indicative pricing combining per-tonne/km tariffs, live diesel fuel surcharges, seasonal demand peaks, and accessorials.
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Origin & Destination Corridor</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={calcOrigin}
                    onChange={(e) => setCalcOrigin(e.target.value)}
                    className="p-2.5 rounded-xl bg-[#162228] border border-[#1D2A32] text-white"
                  />
                  <input
                    type="text"
                    value={calcDestination}
                    onChange={(e) => setCalcDestination(e.target.value)}
                    className="p-2.5 rounded-xl bg-[#162228] border border-[#1D2A32] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Distance (km):</span>
                    <span className="font-mono text-emerald-400 font-bold">{calcDistanceKm} km</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="2200"
                    step="50"
                    value={calcDistanceKm}
                    onChange={(e) => setCalcDistanceKm(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Tonnage (MT):</span>
                    <span className="font-mono text-emerald-400 font-bold">{calcTonnage} MT</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="2"
                    value={calcTonnage}
                    onChange={(e) => setCalcTonnage(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Commodity Class</label>
                  <select
                    value={calcCommodity}
                    onChange={(e) => setCalcCommodity(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#162228] border border-[#1D2A32] text-white"
                  >
                    <option value="Grain">Dry Bulk Grain (Maize / Soy)</option>
                    <option value="Cold-Chain Fresh Produce">Cold-Chain Fresh Produce</option>
                    <option value="Cocoa & Coffee">Export Cocoa / Coffee Beans</option>
                    <option value="Fertilizer">Subsidized Fertilizer Inputs</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Load Configuration</label>
                  <select
                    value={calcLoadType}
                    onChange={(e: any) => setCalcLoadType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#162228] border border-[#1D2A32] text-white"
                  >
                    <option value="FTL">Full Truckload (FTL)</option>
                    <option value="LTL">Consolidated Less-than-Truckload (LTL)</option>
                  </select>
                </div>
              </div>

              {/* Accessorial Checkboxes */}
              <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Accessorial & Special Handling Services</span>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={calcReeferRequired}
                      onChange={(e) => setCalcReeferRequired(e.target.checked)}
                      className="accent-emerald-500 rounded"
                    />
                    <span>Continuous Reefer Cold-Chain Power (+$240)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={calcCustomsEscort}
                      onChange={(e) => setCalcCustomsEscort(e.target.checked)}
                      className="accent-emerald-500 rounded"
                    />
                    <span>One-Stop Border Clearance & Seal (+$180)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={calcTailLift}
                      onChange={(e) => setCalcTailLift(e.target.checked)}
                      className="accent-emerald-500 rounded"
                    />
                    <span>Rural Farmgate Hydraulic Tail-Lift (+$75)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown & Quote Output */}
          <div className="lg:col-span-7 bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#19262F]">
                <h4 className="font-extrabold text-sm text-white">Itemized Freight Tariff Quotation</h4>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-[#07261B] px-2.5 py-0.5 rounded border border-[#14533C]">
                  Indicative Spot Rate
                </span>
              </div>

              {/* Primary Rate Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 text-xs">
                <div className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32]">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Total Freight Tariff</div>
                  <div className="text-2xl font-mono font-extrabold text-white mt-1">
                    ${totalCalculatedFreightUSD.toLocaleString()} USD
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Fixed-Route Guaranteed</div>
                </div>

                <div className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32]">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Rate per Tonne</div>
                  <div className="text-2xl font-mono font-extrabold text-emerald-400 mt-1">
                    ${effectiveRatePerTonne} / MT
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{calcTonnage} MT Payload</div>
                </div>

                <div className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32]">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Rate per Tonne/Km</div>
                  <div className="text-2xl font-mono font-extrabold text-cyan-400 mt-1">
                    ${(effectiveRatePerTonne / calcDistanceKm).toFixed(3)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{calcDistanceKm} km Transit</div>
                </div>
              </div>

              {/* Transparent Cost Formula Breakdown */}
              <div className="p-4 rounded-xl bg-[#162228] border border-[#1D2A32] space-y-2 text-xs">
                <div className="font-bold text-white mb-1">Itemized Cost Structure:</div>
                <div className="flex justify-between py-1 border-b border-[#1D2A32] text-slate-300">
                  <span>Base Distance-Tonnage Tariff ({calcDistanceKm} km × {calcTonnage} MT × ${baseRatePerTonneKm}/t-km)</span>
                  <span className="font-mono text-white">${Math.round(baseFreight).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1D2A32] text-slate-300">
                  <span>Fuel Price Surcharge Index (+14.2% regional diesel baseline)</span>
                  <span className="font-mono text-amber-300">+${Math.round(fuelSurcharge).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1D2A32] text-slate-300">
                  <span>Seasonal Harvest Capacity Premium (+18% grain evacuation surge)</span>
                  <span className="font-mono text-amber-300">+${Math.round(seasonalCost).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-300">
                  <span>Accessorial & Special Handling Charges (Reefer, Border Seal, Tail-Lift)</span>
                  <span className="font-mono text-cyan-300">+${accessorialCharges.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#19262F] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">Quote valid for 48 hours • Backed by AfCFTA Road Standard</span>
              <button
                onClick={() => {
                  setToastMsg("Tariff quote published to Transport Marketplace load board.");
                  setActiveSubTab("transport_marketplace");
                  setTimeout(() => setToastMsg(null), 3500);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold flex items-center gap-2 cursor-pointer shadow-md border border-[#196349]"
              >
                <span>Publish Load to Marketplace →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: TRANSPORT MARKETPLACE (LOAD BOARD & CARRIER BIDDING) */}
      {activeSubTab === "transport_marketplace" && (
        <div className="space-y-4">
          <div className="p-4 bg-[#10171B] rounded-2xl border border-[#1D2A32] flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-white">
                Agricultural Freight Marketplace & Live Carrier Bidding
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Shippers publish available cargo; verified transporters submit competitive rate proposals, negotiate, and execute awards.
              </p>
            </div>
            <button
              onClick={() => {
                setToastMsg("New Load Order form opened.");
                setTimeout(() => setToastMsg(null), 2500);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-[#196349]"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Post New Available Load</span>
            </button>
          </div>

          <div className="space-y-4">
            {marketplaceLoads.map((load) => (
              <div
                key={load.id}
                className="bg-[#10171B] rounded-2xl p-5 border border-[#1D2A32] space-y-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#19262F]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#07261B] border border-[#14533C] text-emerald-400 flex items-center justify-center font-bold text-xs">
                      <Truck className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{load.commodity}</h4>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#162228] text-slate-300 border border-[#1D2A32]">
                          {load.id}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {load.origin} → {load.destination}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Shipper Budget</div>
                      <div className="text-base font-mono font-extrabold text-white">
                        ${load.budgetTargetUSD.toLocaleString()} USD
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        load.status === "Contract Awarded"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : "bg-cyan-950 text-cyan-300 border border-cyan-800"
                      }`}
                    >
                      {load.status}
                    </span>
                  </div>
                </div>

                {/* Load Specifications */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                    <span className="text-[10px] text-slate-400 block font-semibold">Payload Volume</span>
                    <span className="font-mono font-bold text-white text-sm">{load.weightTonnes} MT</span>
                  </div>
                  <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                    <span className="text-[10px] text-slate-400 block font-semibold">Pickup Date</span>
                    <span className="font-semibold text-white">{load.pickupDate}</span>
                  </div>
                  <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                    <span className="text-[10px] text-slate-400 block font-semibold">Vehicle Requirement</span>
                    <span className="font-semibold text-white truncate block">{load.equipmentRequired}</span>
                  </div>
                  <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                    <span className="text-[10px] text-slate-400 block font-semibold">Carrier Bids Received</span>
                    <span className="font-mono font-bold text-cyan-300 text-sm">{load.bidsCount} Verified Proposals</span>
                  </div>
                </div>

                {/* Received Carrier Bids Table */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">Competitive Transporter Proposals:</span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#162228] text-slate-400 border-b border-[#1D2A32] text-[10px] uppercase font-bold">
                          <th className="p-2.5">Transporter / Fleet</th>
                          <th className="p-2.5">Carrier Rating</th>
                          <th className="p-2.5">Transit Window</th>
                          <th className="p-2.5">Quoted Tariff</th>
                          <th className="p-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#19262F]">
                        {load.bids.map((bid, i) => (
                          <tr key={i} className="hover:bg-[#162228]/50">
                            <td className="p-2.5">
                              <div className="font-bold text-white">{bid.carrier}</div>
                              <div className="text-[10px] text-slate-400">{bid.fleetType}</div>
                            </td>
                            <td className="p-2.5">
                              <span className="text-amber-400 font-bold inline-flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                {bid.rating}
                              </span>
                              <span className="text-[10px] text-slate-500 ml-1">(99% On-Time)</span>
                            </td>
                            <td className="p-2.5 font-mono text-slate-300">{bid.transitHours} Hours SLA</td>
                            <td className="p-2.5">
                              <span className="font-mono font-extrabold text-emerald-400 text-sm">
                                ${bid.bidUSD.toLocaleString()} USD
                              </span>
                            </td>
                            <td className="p-2.5 text-right">
                              {load.status !== "Contract Awarded" ? (
                                <button
                                  onClick={() => handleAwardContract(load.id, bid.carrier, bid.bidUSD)}
                                  className="px-3 py-1.5 rounded-lg bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] cursor-pointer"
                                >
                                  Award & Escrow
                                </button>
                              ) : (
                                <span className="text-xs text-emerald-400 font-semibold flex items-center justify-end gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Contract Active</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 3: DIGITAL CONTRACTS */}
      {activeSubTab === "digital_contracts" && (
        <div className="bg-[#10171B] rounded-2xl p-6 border border-[#1D2A32] space-y-5">
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#19262F] gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5B942] bg-[#2E2007] px-2 py-0.5 rounded border border-[#5E4210]">
                Legally Enforceable Digital Logistics Agreement
              </span>
              <h3 className="font-extrabold text-base text-white mt-1">
                AfCFTA Electronic Road Transport Agreement #{selectedContract.contractId}
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-[#07261B] px-3 py-1.5 rounded-xl border border-[#14533C]">
              Bilateral E-Signatures Verified
            </span>
          </div>

          <div className="p-4 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-3 text-xs leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3 border-b border-[#1D2A32]">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Shipper (Agricultural Union):</span>
                <div className="text-sm font-bold text-white mt-0.5">{selectedContract.shipperName}</div>
                <div className="text-[10px] text-emerald-400">Signed with Biometric Mobile Key</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Appointed Carrier:</span>
                <div className="text-sm font-bold text-white mt-0.5">{selectedContract.carrierName}</div>
                <div className="text-[10px] text-emerald-400">Signed with Transporter PKI Token</div>
              </div>
            </div>

            <div className="space-y-2 text-slate-300">
              <h5 className="font-bold text-white text-xs">Standard SLA & Operational Clauses:</h5>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li>
                  <strong>Transit Window SLA: </strong> The carrier commits to transit delivery within exactly <strong>{selectedContract.transitSlaHours} hours</strong> from verified loading completion.
                </li>
                <li>
                  <strong>Delay Penalties: </strong> Delays exceeding {selectedContract.maximumAllowedDelayHours} hours incur a statutory demurrage deduction of <strong>${selectedContract.delayPenaltyPerHourUSD}/hour</strong> deducted automatically from the final escrow disbursement.
                </li>
                <li>
                  <strong>Cargo Liability Limits: </strong> Underwriter backed coverage up to <strong>${selectedContract.cargoLiabilityLimitUSD.toLocaleString()} USD</strong> against loss, spill, road overturning, or moisture spoilage.
                </li>
                <li>
                  <strong>Governing Jurisdiction: </strong> {selectedContract.governingLaw}.
                </li>
              </ul>
            </div>

            <div className="p-3 bg-[#10171B] rounded-lg border border-[#1D2A32] text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>Cryptographic Proof: {selectedContract.timestamp}</span>
              <span className="text-emerald-400 font-bold">e-Waybill Ready</span>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4: PAYMENTS, ESCROW & SETTLEMENTS */}
      {activeSubTab === "payments_settlements" && (
        <div className="space-y-4">
          <div className="p-4 bg-[#10171B] rounded-2xl border border-[#1D2A32]">
            <h3 className="font-extrabold text-sm text-white">
              Tripartite Escrow & Multicurrency Carrier Settlements
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Protects both parties: funds are held by authorized partner banks and released upon telematics milestones and digital proof of delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {escrowShipments.map((esc) => (
              <div key={esc.id} className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#19262F]">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">{esc.id}</span>
                    <h4 className="font-bold text-sm text-white">{esc.shipmentRef}</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {esc.escrowStatus}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Authorized Banking Partner:</span>
                    <span className="text-white font-semibold">{esc.authorizedBank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Invoice Value:</span>
                    <span className="text-white font-mono font-bold">${esc.totalInvoiceUSD.toLocaleString()} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pickup Advance Released (30%):</span>
                    <span className="text-emerald-400 font-mono font-bold">${esc.carrierAdvanceUSD.toLocaleString()} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Balance in Escrow (70%):</span>
                    <span className="text-cyan-400 font-mono font-bold">${esc.balanceHeldUSD.toLocaleString()} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Clearing Rails:</span>
                    <span className="text-slate-300 font-mono text-[11px]">{esc.payoutMethod}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] flex items-center justify-between text-xs">
                  <span className="text-slate-400">Trigger: Digital Proof of Delivery (POD)</span>
                  <button
                    onClick={() => {
                      setToastMsg("Escrow release request dispatched to banking partner switch.");
                      setTimeout(() => setToastMsg(null), 3000);
                    }}
                    className="px-3 py-1 bg-[#0B3D2C] hover:bg-[#0E4B37] text-white text-xs font-bold rounded-lg border border-[#196349] cursor-pointer"
                  >
                    Release Escrow Balance
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 5: CREDIT & TRADE FINANCE */}
      {activeSubTab === "trade_finance" && (
        <div className="space-y-4">
          <div className="p-4 bg-[#10171B] rounded-2xl border border-[#1D2A32]">
            <h3 className="font-extrabold text-sm text-white">
              Shipment Receivables Financing & Invoice Discounting
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Unlock up to 80% working capital immediate advance upon verified cargo collection through accredited development finance partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {financeEligibleShipments.map((fin) => (
              <div key={fin.id} className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#19262F]">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400">{fin.id}</span>
                    <h4 className="font-bold text-sm text-white">{fin.shipmentRef}</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                    {fin.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Cargo Invoice</span>
                    <div className="text-lg font-mono font-extrabold text-white mt-1">
                      ${fin.invoiceValueUSD.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32]">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Immediate Advance (80%)</span>
                    <div className="text-lg font-mono font-extrabold text-emerald-400 mt-1">
                      ${fin.advanceAvailableUSD.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Discounting Facility APR:</span>
                    <span className="font-mono text-white font-bold">{fin.discountingRateAnnual}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Financing Partner:</span>
                    <span className="text-purple-300 font-semibold">{fin.financialPartner}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setToastMsg(`Working capital advance of $${fin.advanceAvailableUSD.toLocaleString()} USD referred to ${fin.financialPartner}.`);
                    setTimeout(() => setToastMsg(null), 3500);
                  }}
                  className="w-full py-2.5 bg-purple-950 hover:bg-purple-900 text-purple-200 text-xs font-bold rounded-xl border border-purple-800 transition-colors cursor-pointer"
                >
                  Apply for Immediate Invoice Advance →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 6: CARGO INSURANCE & CLAIMS */}
      {activeSubTab === "insurance_claims" && (
        <div className="space-y-4">
          <div className="p-4 bg-[#10171B] rounded-2xl border border-[#1D2A32] flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-white">
                Cargo Transit Insurance & Rapid Claims Settlement
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Marine and inland transit policies underwritten by Africa Re and regional syndicates with telematics evidence verification.
              </p>
            </div>
            <button
              onClick={() => {
                setToastMsg("New Cargo Damage Claim form initialized.");
                setTimeout(() => setToastMsg(null), 2500);
              }}
              className="px-3 py-1.5 bg-[#162228] hover:bg-[#1D2A32] text-amber-300 text-xs font-bold rounded-xl border border-[#1D2A32] flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Report Cargo Incident / Claim</span>
            </button>
          </div>

          <div className="space-y-3">
            {insuranceClaims.map((clm) => (
              <div key={clm.id} className="p-4 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">{clm.id}</span>
                    <span className="text-[10px] font-mono text-slate-400">({clm.policyNumber})</span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                    {clm.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Incident Type</span>
                    <div className="text-white font-bold mt-0.5">{clm.incidentType}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Claimed Loss</span>
                    <div className="text-emerald-400 font-mono font-extrabold text-sm mt-0.5">
                      ${clm.claimedLossUSD.toLocaleString()} USD
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Underwriter</span>
                    <div className="text-slate-300 font-medium mt-0.5">{clm.underwriter}</div>
                  </div>
                </div>

                <div className="p-2.5 bg-[#162228] rounded-xl border border-[#1D2A32] text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Telematics Evidence: GPS speed record & Reefer temperature probe graph attached</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Evidence Validated</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 7: COST & MARGIN ANALYTICS */}
      {activeSubTab === "cost_analytics" && (
        <div className="space-y-4">
          <div className="p-4 bg-[#10171B] rounded-2xl border border-[#1D2A32]">
            <h3 className="font-extrabold text-sm text-white">
              Logistics Cost, Revenue & Fleet Margin Analytics
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Unit economics across corridors: freight cost per tonne, per kilometre, operating margins, and fuel expense ratios.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 bg-[#10171B] rounded-xl border border-[#1D2A32]">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Avg Freight Cost</span>
              <div className="text-2xl font-mono font-extrabold text-white mt-1">$48.20 / MT</div>
              <span className="text-[10px] text-emerald-400">-12.4% vs 2025 benchmark</span>
            </div>

            <div className="p-4 bg-[#10171B] rounded-xl border border-[#1D2A32]">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Cost per Tonne-Km</span>
              <div className="text-2xl font-mono font-extrabold text-cyan-400 mt-1">$0.062</div>
              <span className="text-[10px] text-slate-400">Rail: $0.041 • Road: $0.074</span>
            </div>

            <div className="p-4 bg-[#10171B] rounded-xl border border-[#1D2A32]">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Platform Gross Margin</span>
              <div className="text-2xl font-mono font-extrabold text-emerald-400 mt-1">16.4%</div>
              <span className="text-[10px] text-emerald-300">Net operating margin</span>
            </div>

            <div className="p-4 bg-[#10171B] rounded-xl border border-[#1D2A32]">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Fuel Surcharge Ratio</span>
              <div className="text-2xl font-mono font-extrabold text-amber-400 mt-1">14.2%</div>
              <span className="text-[10px] text-slate-400">Indexed to local diesel rates</span>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 8: DISPUTE MANAGEMENT */}
      {activeSubTab === "dispute_management" && (
        <div className="space-y-4">
          <div className="p-4 bg-[#10171B] rounded-2xl border border-[#1D2A32]">
            <h3 className="font-extrabold text-sm text-white">
              Logistics Dispute Resolution Workflow
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured arbitration for late delivery penalties, damaged produce, weight shortages, and billing discrepancies.
            </p>
          </div>

          <div className="space-y-3">
            {activeDisputes.map((dsp) => (
              <div key={dsp.id} className="p-5 bg-[#10171B] rounded-2xl border border-[#1D2A32] space-y-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#19262F]">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">{dsp.id}</span>
                    <h4 className="font-bold text-sm text-white mt-0.5">{dsp.category}</h4>
                    <div className="text-[11px] text-slate-400">{dsp.parties}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Amount Contested</span>
                    <div className="text-lg font-mono font-extrabold text-amber-400">
                      ${dsp.amountContestedUSD} USD
                    </div>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed bg-[#162228] p-3 rounded-xl border border-[#1D2A32]">
                  {dsp.description}
                </p>

                <div className="p-3 bg-[#162228] rounded-xl border border-[#1D2A32] space-y-1">
                  <div className="font-bold text-white">Recommended Settlement Compromise:</div>
                  <div className="text-[11px] text-emerald-300">{dsp.recommendedCompromise}</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">Evidence: {dsp.telematicsRecord}</div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] text-slate-400">Step 3 of 4: Telematics Review Completed</span>
                  <button
                    onClick={() => {
                      setToastMsg("Settlement compromise approved and signed by mediator.");
                      setTimeout(() => setToastMsg(null), 3000);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0B3D2C] hover:bg-[#0E4B37] text-white font-bold text-xs border border-[#196349] cursor-pointer"
                  >
                    Accept Compromise & Close Dispute
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
