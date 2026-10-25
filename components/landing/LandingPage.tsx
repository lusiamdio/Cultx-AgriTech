import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  TrendingUp,
  Cpu,
  BarChart3,
  CloudRain,
  ShieldCheck,
  Building2,
  Sprout,
  Coins,
  Truck,
  Globe2,
  Satellite,
  ChevronRight,
  Sparkles,
  Layers,
  Radio,
  Server,
  Activity,
  CheckCircle2,
  Lock,
  Zap,
  RefreshCw,
  Sliders,
  Terminal,
  Database,
  Wifi,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { WebsiteFooter } from "../common/WebsiteFooter";
import { TrustedBySection } from "./TrustedBySection";
import droneHarvestBgImage from "../../assets/images/drone_farm_harvest_1789082466079.jpg";

export const LandingPage: React.FC = () => {
  const { setCurrentView, openAuthModal } = useApp();
  const [selectedArchTier, setSelectedArchTier] = useState<number>(0);
  const [isSimulatingSync, setIsSimulatingSync] = useState<boolean>(false);
  const [syncCount, setSyncCount] = useState<number>(14820);

  const triggerMeshSync = () => {
    setIsSimulatingSync(true);
    setSyncCount((prev) => prev + 124);
    setTimeout(() => {
      setIsSimulatingSync(false);
    }, 1800);
  };

  const challengeStats = [
    {
      title: "FOOD SECURITY",
      metric: "33M+",
      subtitle: "Smallholder Farmers",
      description: "Produce over 70% of the continent's caloric supply yet face extreme structural fragmentation.",
      color: "from-emerald-500 to-emerald-700",
      icon: Sprout,
    },
    {
      title: "CLIMATE VULNERABILITY",
      metric: "82%",
      subtitle: "Rainfed Cultivation",
      description: "High exposure to unforecasted drought spikes, sudden pest vectors, and erratic monsoon cycles.",
      color: "from-blue-500 to-blue-700",
      icon: CloudRain,
    },
    {
      title: "EMPLOYMENT ENGINE",
      metric: "52%",
      subtitle: "African Workforce",
      description: "Agriculture constitutes the primary livelihood driver across rural and peri-urban demographics.",
      color: "from-amber-500 to-amber-700",
      icon: TrendingUp,
    },
    {
      title: "FRAGMENTED VALUE CHAINS",
      metric: "$45B",
      subtitle: "Annual Post-Harvest Loss",
      description: "Arbitrage middlemen and uncoordinated transport deplete farmgate revenues by up to 38%.",
      color: "from-purple-500 to-purple-700",
      icon: Building2,
    },
  ];

  const architectureTiers = [
    {
      id: "tier-1",
      number: "TIER 01",
      layerCode: "PHYS-EDGE-01",
      title: "Edge Telemetry & Sensory Mesh",
      subtitle: "In-Situ Soil Probes, Drone Canopies & 2G USSD Fallback",
      badge: "<38ms Edge Latency",
      icon: Radio,
      accent: "#22C55E",
      glowColor: "rgba(34, 197, 94, 0.25)",
      status: "NOMINAL & STREAMING",
      description:
        "High-density physical sensory layer streaming ground telemetry from micro-climate stations and multispectral crop canopies, backed by an autonomous 2G USSD/SMS fallback for remote offline rural grids.",
      components: [
        { label: "Capacitive Soil Moisture Array", spec: "10cm / 30cm / 60cm multi-strata capacitance probes", status: "ONLINE" },
        { label: "Drone Hyperspectral Crop Canopies", spec: "Sub-centimeter NDVI, NDRE & RGB orthomosaics", status: "INGESTING" },
        { label: "Micro-Meteorological Stations", spec: "Barometric pressure, solar irradiance & leaf wetness", status: "STREAMING" },
        { label: "2G USSD / Feature Phone Gateway", spec: "Universal *384*2858# zero-data offline protocol", status: "ACTIVE" },
      ],
      metrics: {
        throughput: "14,800 events/sec",
        availability: "99.98% Edge SLA",
        cryptography: "Hardware Keystore (ECC-256)",
      },
    },
    {
      id: "tier-2",
      number: "TIER 02",
      layerCode: "ORBIT-AI-02",
      title: "Sentinel Orbital Radar & AI Agronomy Core",
      subtitle: "Planetary Remote Sensing, Weather Doppler & Pathology Vision",
      badge: "5-Day Refresh Cycle",
      icon: Satellite,
      accent: "#06B6D4",
      glowColor: "rgba(6, 182, 212, 0.25)",
      status: "SENTINEL-2B SYNCED",
      description:
        "Continuous planetary remote sensing mesh coupled with deep agronomic computer vision models trained on over 1.2M African crop pathology samples for instant disease detection and yield forecasting.",
      components: [
        { label: "Sentinel-2 Constellation Ingest", spec: "10m multispectral resolution (B2, B3, B4, B8, B11 bands)", status: "ORBITAL" },
        { label: "Doppler Precipitation Radar Feeds", spec: "72-hour hyper-localized rain cell & drought vectors", status: "CALIBRATED" },
        { label: "Crop Doctor AI Vision Diagnostic", spec: "Maize lethal necrosis, rust & fall armyworm detection", status: "INFERENCE READY" },
        { label: "Digital Twin Parcel Geometries", spec: "Sub-meter polygon boundary legal cadastre staking", status: "VERIFIED" },
      ],
      metrics: {
        throughput: "220M Hectares Mapped",
        availability: "Sentinel-2 L2A Synced",
        cryptography: "Sovereign Geospatial Enclave",
      },
    },
    {
      id: "tier-3",
      number: "TIER 03",
      layerCode: "FIN-LOG-03",
      title: "AfCFTA Cross-Border Trade & Liquidity Bus",
      subtitle: "Duty-Free Green Lanes, Cold-Chain IoT & Smart Escrow",
      badge: "AfCFTA Compliant",
      icon: Truck,
      accent: "#F5B942",
      glowColor: "rgba(245, 185, 66, 0.25)",
      status: "DUTY-FREE CORRIDOR ACTIVE",
      description:
        "Unified transactional layer automating trade documentation, phytosanitary certifications, refrigerated cold-chain transit telematics, and instant escrow settlement across continental trade routes.",
      components: [
        { label: "AfCFTA Duty-Free Green Lane Clearing", spec: "Automated phytosanitary & digital origins certificates", status: "ZERO TARIFF" },
        { label: "Cold-Chain Reefer Fleet Telemetry", spec: "Real-time container temperature, humidity & GPS tracking", status: "TELEMETRIC" },
        { label: "Smart Grain Silo Fill Monitors", spec: "Ultrasonic headspace & internal humidity sensors", status: "MONITORED" },
        { label: "Parametric Insurance & Invoice Escrow", spec: "Satellite weather index automatic settlement oracles", status: "ESCROW LOCKED" },
      ],
      metrics: {
        throughput: "Continental Corridors Synced",
        availability: "12,400 MT Daily Clearing",
        cryptography: "Smart Contract Escrow Oracle",
      },
    },
    {
      id: "tier-4",
      number: "TIER 04",
      layerCode: "RBAC-SOV-04",
      title: "Sovereign Multi-Role Operational Terminals",
      subtitle: "Strict Role-Based Access Control, Policy Modeling & Sync Mesh",
      badge: "Strict RBAC Enforced",
      icon: Layers,
      accent: "#EC4899",
      glowColor: "rgba(236, 72, 153, 0.25)",
      status: "7 ROLES SYNCHRONIZED",
      description:
        "Synchronized enterprise consoles tailored for Smallholders, Aggregators, Millers, Cooperatives, Logistics Carriers, Insurers, and National Food Security Ministries with zero cross-role data leakage.",
      components: [
        { label: "Farmer Voice & Touch Command Twin", spec: "9-language agronomic action cards & harvest logging", status: "CONNECTED" },
        { label: "Miller & Buyer Offtake Trading Desk", spec: "Codex quality grading & bulk forward contract booking", status: "SETTLED" },
        { label: "Cooperative Union Aggregation Ledger", spec: "Member pooled harvest & bulk fertilizer distribution", status: "BALANCED" },
        { label: "National Food Security Policy Console", spec: "Strategic grain reserves & regional tariff simulation", status: "SOVEREIGN" },
      ],
      metrics: {
        throughput: "7 Primary Roles Synced",
        availability: "Zero Data Leakage SLA",
        cryptography: "Role-Based Sovereign Enclave",
      },
    },
  ];

  return (
    <div className="bg-[#0B1013] text-white min-h-screen selection:bg-emerald-600 selection:text-white w-full overflow-x-hidden">
      {/* ─────────────────────────────────────────────────────────────
          EXPANDED CORNER-TO-CORNER HEADER
         ───────────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="w-full py-4 px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between border-b border-[#1A262F]/60 bg-[#090E11]/90 backdrop-blur-md sticky top-0 z-40"
      >
        <div className="flex items-center gap-3">
          <motion.img
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src="/cultx_logo.png"
            alt="CULTx"
            className="w-10 h-10 rounded-xl object-contain shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="font-extrabold text-white text-lg tracking-tight"
              >
                CULTx
              </motion.span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#07261B] text-emerald-300 tracking-wider border border-[#14532D]">
                PAN-AFRICA
              </span>
            </div>
            <motion.p
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-[11px] font-medium text-slate-400 leading-none"
            >
              Agricultural Operating System
            </motion.p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openAuthModal("login")}
            className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#162228] text-xs font-semibold transition-colors cursor-pointer min-h-[40px]"
            id="landing-sign-in-button"
          >
            Sign In
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => openAuthModal("signup")}
            className="px-5 py-2.5 rounded-xl bg-[#F5B942] hover:bg-[#E5A832] text-[#1A1105] text-xs font-extrabold transition-all shadow-md cursor-pointer min-h-[40px] flex items-center gap-1.5"
            id="landing-choose-role-button"
          >
            <span>Choose Role & Join</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </motion.header>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: HERO (EXPANDED CORNER TO CORNER WITH SLIDE IN)
         ───────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 70 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden pt-12 pb-20 lg:py-28 bg-[#050C09] w-full"
      >
        {/* Farm & Drone Harvest Background Image - Prominently Visible Corner-to-Corner */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <img
            src={droneHarvestBgImage || "/images/drone-farm-harvest.jpg"}
            alt="African Farmers Harvesting Crops with Autonomous Agricultural Drones"
            className="w-full h-full object-cover object-center sm:object-[center_32%] opacity-85 sm:opacity-90 brightness-95 contrast-105 transition-opacity duration-700"
            referrerPolicy="no-referrer"
          />
          {/* Subtle directional scrim: soft dark gradient on the left, clear and open on the center and right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050E0B]/92 via-[#06120E]/65 to-[#050E0B]/30 lg:from-[#050E0B]/90 lg:via-[#06120E]/50 lg:to-transparent" />
          {/* Gentle top and bottom feathering for seamless transition */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080D10] via-transparent to-black/25" />
        </div>

        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
          <div className="max-w-4xl space-y-6 drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]">
            {/* Main Headline with Zoom-In / Zoom-Out Animation */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.86 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.86 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#FDFBF7] leading-[1.08] drop-shadow-lg"
            >
              Africa's Agriculture. <br />
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.7, delay: 0.12 }}
                className="text-[#22C55E]"
              >
                Powered by Intelligence.
              </motion.span>
            </motion.h1>

            {/* Paragraph Description with Zoom-In / Zoom-Out Animation */}
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="text-base sm:text-xl text-slate-100 font-normal leading-relaxed max-w-2xl drop-shadow-md"
            >
              A unified digital infrastructure connecting African farmers, markets, finance,
              logistics, and institutions—from farmgate telemetry to Pan-African market commerce.
            </motion.p>

            {/* Action Buttons with Brand Balance CTAs */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="flex flex-wrap items-center gap-4 pt-3"
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => openAuthModal("signup")}
                className="px-7 py-4 rounded-xl bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] font-extrabold text-sm shadow-xl hover:shadow-2xl transition-all flex items-center gap-2.5 cursor-pointer min-h-[48px] border border-[#1E6B3E]"
                id="hero-get-started-button"
              >
                <span>Choose Role & Register</span>
                <ArrowRight className="w-4 h-4 text-[#F5B942]" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentView("dashboard")}
                className="px-7 py-4 rounded-xl bg-[#F5B942] hover:bg-[#E5A832] text-[#1A1105] font-extrabold text-sm shadow-lg transition-colors flex items-center gap-2.5 cursor-pointer min-h-[48px]"
                id="hero-explore-dashboard-button"
              >
                <Satellite className="w-4 h-4 text-[#1A1105]" />
                <span>Explore Farmer Dashboard</span>
              </motion.button>
            </motion.div>

            {/* Expansive Strategic Metrics Grid with Zoom In/Out Animations */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 max-w-3xl"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.5, delay: 0.32 }}
                className="bg-[#0A1410]/85 backdrop-blur-md border border-[#173827]/60 p-3.5 rounded-2xl shadow-md"
              >
                <div className="font-extrabold text-white text-xl sm:text-2xl font-mono">7 Pillars</div>
                <div className="text-xs text-slate-300 font-medium">Farm to Export OS</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.5, delay: 0.36 }}
                className="bg-[#0A1410]/85 backdrop-blur-md border border-[#173827]/60 p-3.5 rounded-2xl shadow-md"
              >
                <div className="font-extrabold text-white text-xl sm:text-2xl font-mono">Continental</div>
                <div className="text-xs text-slate-300 font-medium">AfCFTA Corridors</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-[#0A1410]/85 backdrop-blur-md border border-[#173827]/60 p-3.5 rounded-2xl shadow-md"
              >
                <div className="font-extrabold text-white text-xl sm:text-2xl font-mono">&lt;8h Advice</div>
                <div className="text-xs text-slate-300 font-medium">Real-Time Copilot</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.5, delay: 0.44 }}
                className="bg-[#0A1410]/85 backdrop-blur-md border border-[#173827]/60 p-3.5 rounded-2xl shadow-md"
              >
                <div className="font-extrabold text-white text-xl sm:text-2xl font-mono">100% Synced</div>
                <div className="text-xs text-slate-300 font-medium">Data Mesh Core</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ─────────────────────────────────────────────────────────────
          INSTITUTIONAL TRUST (EXPANDED CORNER TO CORNER WITH SLIDE IN)
         ───────────────────────────────────────────────────────────── */}
      <TrustedBySection />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: THE AGRICULTURAL CHALLENGE (CORNER TO CORNER WITH ZOOM & SLIDE)
         ───────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 75 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="py-20 bg-[#0B1013] border-b border-[#1D2A32] w-full"
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="max-w-3xl mb-12">
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-[#07261B] px-3 py-1 rounded-md border border-[#14533C]"
            >
              The Pan-African Challenge
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mt-3"
            >
              Transforming Structural Bottlenecks into Digital Value
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl"
            >
              African smallholders and commercial agro-enterprises lose billions annually to asymmetric information,
              fragmented transport, and absent credit histories.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {challengeStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.86, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.86 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.035, y: -6, transition: { duration: 0.2 } }}
                  className="p-6 sm:p-7 rounded-2xl bg-[#10171B] border border-[#1D2A32] hover:border-[#14533C] transition-all shadow-md group cursor-default"
                >
                  <div className="flex items-center justify-between mb-4">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      viewport={{ once: false, amount: 0.2 }}
                      className="text-[11px] font-bold tracking-wider text-slate-400 uppercase"
                    >
                      {stat.title}
                    </motion.span>
                    <div className="w-10 h-10 rounded-xl bg-[#162228] border border-[#1D2A32] flex items-center justify-center text-slate-300 group-hover:text-emerald-300 group-hover:scale-110 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <motion.div
                    initial={{ scale: 0.88, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.88, opacity: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight group-hover:text-emerald-200 transition-colors"
                  >
                    {stat.metric}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: 0.08 }}
                    className="text-xs font-bold text-emerald-300 mt-1"
                  >
                    {stat.subtitle}
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: 0.12 }}
                    className="text-xs text-slate-400 mt-3 leading-relaxed"
                  >
                    {stat.description}
                  </motion.p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: PREMIUM OPERATING SYSTEM ARCHITECTURE (EXPANDED CORNER TO CORNER)
         ───────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 85 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="py-24 bg-gradient-to-b from-[#05110B] via-[#071811] to-[#040C08] text-white border-t border-[#14533C]/80 w-full relative overflow-hidden"
      >
        {/* Dynamic Architectural Cybernetic Grid & Glowing Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[650px] bg-emerald-500/12 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-0 right-10 w-96 h-96 bg-amber-500/8 rounded-full blur-[140px] pointer-events-none" />
        
        {/* Subtle Cyber Radar Sweep Background Animation */}
        <div className="absolute inset-0 bg-[radial-gradient(#14532D_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none" />

        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
          {/* Section Header with Zoom In / Zoom Out Animations */}
          <div className="text-center max-w-4xl mx-auto mb-14">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#082218]/90 text-emerald-300 text-xs font-mono font-bold border border-[#14533C] mb-3.5 shadow-lg shadow-emerald-950/40 backdrop-blur-md"
            >
              <Cpu className="w-4 h-4 text-[#F5B942] animate-pulse" />
              <span>SYNCHRONIZED PAN-AFRICAN COMPUTATIONAL FABRIC • TIER-4 ARCHITECTURE</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
            >
              Operating System Architecture
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.65, delay: 0.16 }}
              className="text-slate-300 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed"
            >
              A fault-tolerant four-tier computational stack unifying physical in-situ telemetry, satellite remote sensing,
              inter-enterprise liquidity, and sovereign role-governed execution consoles.
            </motion.p>
          </div>

          {/* High-Integrity Live Telemetry HUD Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10 p-3 sm:p-4 rounded-2xl bg-[#091510]/80 backdrop-blur-xl border border-[#173827] shadow-xl flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="font-bold text-white">KERNEL STATUS:</span>
                <span className="text-emerald-400">NOMINAL & SYNCHRONIZED</span>
              </div>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>CONSENSUS LATENCY:</span>
                <span className="font-bold text-white">38ms</span>
              </div>
              <span className="text-slate-600 hidden md:inline">|</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-[#F5B942]" />
                <span>ENCLAVE:</span>
                <span className="font-bold text-white">ECC-256 / HARDWARE SEALED</span>
              </div>
            </div>

            <button
              onClick={triggerMeshSync}
              disabled={isSimulatingSync}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                isSimulatingSync
                  ? "bg-emerald-900/60 text-emerald-200 border-emerald-500 animate-pulse"
                  : "bg-[#11241C] text-emerald-300 border-[#1E4D36] hover:bg-[#163024] hover:border-emerald-400"
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingSync ? "animate-spin text-emerald-300" : ""}`} />
              <span>{isSimulatingSync ? "PULSING MESH..." : "SIMULATE MESH SYNC"}</span>
            </button>
          </motion.div>

          {/* Interactive Tier Tabs Navigation with Hover and Active Radiance */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
            {architectureTiers.map((tier, idx) => {
              const TierIcon = tier.icon;
              const isActive = selectedArchTier === idx;
              return (
                <motion.button
                  key={tier.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedArchTier(idx)}
                  className={`px-4 sm:px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer border min-h-[44px] ${
                    isActive
                      ? "bg-[#14532D] text-white border-[#22C55E] shadow-xl shadow-emerald-950/80 ring-2 ring-[#22C55E]/40"
                      : "bg-[#0A130F] text-slate-300 border-[#1A2C23] hover:bg-[#101F18] hover:text-white hover:border-[#1E4D36]"
                  }`}
                >
                  <TierIcon className="w-4 h-4" style={{ color: tier.accent }} />
                  <span className="font-mono text-slate-400">{tier.number}:</span>
                  <span>{tier.title.split("&")[0]}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />}
                </motion.button>
              );
            })}
          </div>

          {/* Premium Architectural Deck Presentation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 5 Cols: Active Tier Deep-Dive Spotlight Card */}
            <motion.div
              key={selectedArchTier}
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B1A13] via-[#091510] to-[#060D0A] border border-[#1A4232] shadow-2xl relative overflow-hidden space-y-6"
            >
              {/* Dynamic Aura Gradient based on Tier Accent */}
              <div
                className="absolute top-0 right-0 w-60 h-60 rounded-full blur-3xl opacity-25 pointer-events-none transition-all duration-700"
                style={{ backgroundColor: architectureTiers[selectedArchTier].accent }}
              />

              {/* Tier Code Badge & Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-mono font-extrabold px-3 py-1 rounded-full border"
                    style={{
                      backgroundColor: `${architectureTiers[selectedArchTier].accent}18`,
                      color: architectureTiers[selectedArchTier].accent,
                      borderColor: `${architectureTiers[selectedArchTier].accent}45`,
                    }}
                  >
                    {architectureTiers[selectedArchTier].number} • {architectureTiers[selectedArchTier].layerCode}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-300 bg-[#07261B] px-3 py-1 rounded-lg border border-[#14533C]">
                  {architectureTiers[selectedArchTier].badge}
                </span>
              </div>

              {/* Title & Description with Zoom Transition */}
              <div>
                <motion.h3
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
                >
                  {architectureTiers[selectedArchTier].title}
                </motion.h3>
                <p className="text-xs text-emerald-400 font-mono mt-1 font-semibold">
                  {architectureTiers[selectedArchTier].subtitle}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                  {architectureTiers[selectedArchTier].description}
                </p>
              </div>

              {/* Real-time Hardware & Software Subsystem Monitors */}
              <div className="space-y-2.5 pt-2 border-t border-[#163628]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Active Subsystem Verification
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE TELEMETRY
                  </span>
                </div>

                {architectureTiers[selectedArchTier].components.map((comp, ci) => (
                  <motion.div
                    key={ci}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: ci * 0.05 }}
                    className="p-3 rounded-xl bg-[#0F2319]/80 border border-[#1C4231] flex items-start justify-between gap-3 hover:border-emerald-500/60 transition-all"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: architectureTiers[selectedArchTier].accent }}
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-white truncate">{comp.label}</div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">{comp.spec}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#0A1712] text-emerald-300 border border-[#163829] shrink-0">
                      {comp.status}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Micro-Telemetry Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-[#163628]">
                <div className="p-3 rounded-xl bg-[#091510] border border-[#163829]">
                  <div className="text-[9px] font-mono text-slate-400 uppercase">Throughput</div>
                  <div className="font-mono font-bold text-xs text-white mt-1 truncate">
                    {architectureTiers[selectedArchTier].metrics.throughput}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#091510] border border-[#163829]">
                  <div className="text-[9px] font-mono text-slate-400 uppercase">Availability</div>
                  <div className="font-mono font-bold text-xs text-emerald-300 mt-1 truncate">
                    {architectureTiers[selectedArchTier].metrics.availability}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#091510] border border-[#163829]">
                  <div className="text-[9px] font-mono text-slate-400 uppercase">Security</div>
                  <div className="font-mono font-bold text-xs text-amber-300 mt-1 truncate">
                    {architectureTiers[selectedArchTier].metrics.cryptography}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right 7 Cols: Complete 4-Layer Synchronized Architecture Stack */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full Stack Execution Fabric (Physical to Policy)</span>
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Bi-Directional Bus Active
                </span>
              </div>

              {architectureTiers.map((tier, idx) => {
                const TierIcon = tier.icon;
                const isSelected = selectedArchTier === idx;

                return (
                  <motion.div
                    key={tier.id}
                    onClick={() => setSelectedArchTier(idx)}
                    whileHover={{ scale: 1.02, x: 6 }}
                    transition={{ duration: 0.2 }}
                    className={`p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden shadow-lg ${
                      isSelected
                        ? "bg-[#0E261A] border-[#22C55E] shadow-2xl ring-2 ring-[#22C55E]/40"
                        : "bg-[#0B1510] border-[#182C22] hover:border-[#1E5238] hover:bg-[#0E1E17]"
                    }`}
                  >
                    {/* Glowing active indicator stripe on left */}
                    {isSelected && (
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1.5"
                        style={{ backgroundColor: tier.accent }}
                      />
                    )}

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-md transition-transform group-hover:scale-110"
                          style={{
                            backgroundColor: `${tier.accent}22`,
                            borderColor: `${tier.accent}55`,
                            color: tier.accent,
                          }}
                        >
                          <TierIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#07130D] text-slate-300 border border-[#142C20]">
                              {tier.number}
                            </span>
                            <span className="font-extrabold text-sm sm:text-base text-white truncate">
                              {tier.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-1">
                            {tier.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="hidden sm:inline-block text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[#081510] text-emerald-300 border border-[#173827]">
                          {tier.badge}
                        </span>
                        <ChevronRight
                          className={`w-5 h-5 transition-transform ${
                            isSelected ? "text-emerald-400 rotate-90" : "text-slate-500"
                          }`}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* High-Integrity Launch CTA inside Architecture */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="pt-4 flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0C1E15] via-[#0F291C] to-[#0A1A12] border border-[#1E4D35] shadow-xl"
              >
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#F5B942]" />
                    <span>Sovereign Deployment Ready Across 54 AU Member States</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1 max-w-lg">
                    Deploy CULTx for your cooperative, national commodity board, or commercial agribusiness.
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => openAuthModal("signup")}
                  className="px-6 py-3.5 rounded-xl bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-[#1E6B3E] min-h-[44px]"
                >
                  <span>Provision Custom OS</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#F5B942]" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─────────────────────────────────────────────────────────────
          EXPANDED CORNER-TO-CORNER WEBSITE FOOTER (WITH SLIDE IN)
         ───────────────────────────────────────────────────────────── */}
      <WebsiteFooter />
    </div>
  );
};
