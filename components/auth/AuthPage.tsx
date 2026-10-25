import React, { useState } from "react";
import {
  Lock,
  Mail,
  User,
  Building2,
  Globe,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Sprout,
  ShoppingBag,
  Users2,
  Truck,
  Coins,
  Landmark,
  Zap,
  Check,
  ArrowLeft,
  Activity,
  Layers,
  Database,
  Radio,
  FileCheck,
  ChevronRight,
  Shield,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { UserRole } from "../../types";
import { ROLE_CONFIGS, PRIMARY_ROLES } from "../../utils/rbac";
import { AFRICAN_COUNTRIES } from "../../data/countries";

const ROLE_ICONS: Record<string, React.ElementType> = {
  Sprout,
  Building2,
  ShoppingBag,
  Users2,
  Truck,
  Coins,
  Landmark,
};

export const AuthPage: React.FC = () => {
  const {
    authModalTab,
    setAuthModalTab,
    loginUser,
    signupUser,
    userRole,
    setCurrentView,
    selectedCountry,
    setSelectedCountry,
    isOffline,
  } = useApp();

  // Sign In State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Sign Up State
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupOrg, setSignupOrg] = useState("");
  const [signupCountry, setSignupCountry] = useState(selectedCountry.code || "KE");
  const [selectedSignupRole, setSelectedSignupRole] = useState<UserRole>("farmer");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const email = loginEmail.trim() || ROLE_CONFIGS[userRole].demoUser.email;
      await loginUser(email, loginPassword);
    } catch {
      setErrorMessage("Authentication failed. Please verify credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim()) {
      setErrorMessage("Please provide your legal name and email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await signupUser({
        name: signupName,
        email: signupEmail,
        role: selectedSignupRole,
        countryCode: signupCountry,
        organization: signupOrg.trim() || undefined,
      });
    } catch {
      setErrorMessage("Unable to complete registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (role: UserRole) => {
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const demoUser = ROLE_CONFIGS[role].demoUser;
      await loginUser(demoUser.email, "demo-password", role);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B0E] text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Global Navigation Bar */}
      <header className="h-16 px-4 sm:px-8 border-b border-[#1A2832] bg-[#090E11]/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView("landing")}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-[#10171B] hover:bg-[#162228] px-3 py-2 rounded-xl border border-[#1D2A32] transition-colors cursor-pointer mr-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>Return to Platform</span>
          </button>

          <div className="flex items-center gap-2.5">
            <img
              src="/cultx_logo.png"
              alt="CULTx Agri-OS"
              className="w-8 h-8 rounded-lg object-contain shadow-xs shrink-0"
            />
            <div className="hidden sm:block">
              <span className="font-extrabold text-white text-sm tracking-tight flex items-center gap-1.5">
                <span>CULTx Agri-OS</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#07261B] text-emerald-400 border border-[#14533C]">
                  Sovereign Identity
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Country Selector */}
          <div className="flex items-center gap-1.5 bg-[#10171B] px-3 py-1.5 rounded-xl border border-[#1D2A32] text-xs">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedCountry.code}
              onChange={(e) => {
                const c = AFRICAN_COUNTRIES.find((cntry) => cntry.code === e.target.value);
                if (c) setSelectedCountry(c);
              }}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              {AFRICAN_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#10171B] text-white">
                  {c.name} ({c.currency})
                </option>
              ))}
            </select>
          </div>

          {/* Sync indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#07261B] border border-[#14533C] text-[11px] font-mono text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{isOffline ? "Offline Cache Active" : "54 Nations Synced"}</span>
          </div>
        </div>
      </header>

      {/* Main Dual-Column Webpage Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-4rem)]">
        {/* =================================================================== */}
        {/* LEFT COLUMN: BRAND HERO SHOWCASE & SOVEREIGN ECOSYSTEM HIGHLIGHTS   */}
        {/* =================================================================== */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#091116] via-[#081318] to-[#060D10] p-6 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-[#19262F] flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background ambient mesh glow */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#F5B942]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            {/* Brand Title Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#07261B] text-emerald-300 border border-[#14533C] text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#F5B942]" />
              <span>Pan-African Sovereign Agricultural Operating System</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              One Shared Platform.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-[#F5B942]">
                Seven Value-Chain Roles.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
              CULTx Agri-OS coordinates farmers, agribusiness aggregators, international grain buyers, cooperatives, cold-chain logistics, financial underwriters, and sovereign ministries on a shared real-time agricultural telemetry mesh.
            </p>

            {/* 4 Core Value Pillars */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#10171B]/90 border border-[#1D2A32] flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#07261B] border border-[#14533C] flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Satellite Cadastre & Precision Agronomy</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Copernicus Sentinel-2 NDVI passes and NASA SMAP root-zone soil telemetry linked directly to verified land polygons.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#10171B]/90 border border-[#1D2A32] flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#082035] border border-[#10385E] flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Bundled Credit & 72-Hour Parametric Insurance</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Affordable seasonal input financing protected by automated rainfall and vegetation trigger settlements.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#10171B]/90 border border-[#1D2A32] flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#281506] border border-[#4E280C] flex items-center justify-center shrink-0 text-[#F5B942] mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">AfCFTA SPS & Codex MRL Cross-Border Corridors</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Frictionless digital e-Phyto sanitary passports and cold-chain refrigerated telemetry across regional trading borders.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#10171B]/90 border border-[#1D2A32] flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#150D24] border border-[#2E1B4E] flex items-center justify-center shrink-0 text-purple-400 mt-0.5">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Sovereign Policy Command & 99.4% Anti-Leakage</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Biometric fertilizer e-vouchers, national strategic grain buffers, and Central Bank prudential audit schedules.
                  </p>
                </div>
              </div>
            </div>

            {/* Live Macro Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-3 rounded-xl bg-[#10171B] border border-[#1D2A32]">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Smallholders</div>
                <div className="text-lg font-mono font-extrabold text-emerald-400 mt-0.5">2.4M</div>
                <div className="text-[9px] text-emerald-300">91% In-Platform</div>
              </div>

              <div className="p-3 rounded-xl bg-[#10171B] border border-[#1D2A32]">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Supervised</div>
                <div className="text-lg font-mono font-extrabold text-white mt-0.5">$148.5M</div>
                <div className="text-[9px] text-slate-400">Total Capital</div>
              </div>

              <div className="p-3 rounded-xl bg-[#10171B] border border-[#1D2A32]">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Grain Buffer</div>
                <div className="text-lg font-mono font-extrabold text-cyan-300 mt-0.5">184 Days</div>
                <div className="text-[9px] text-slate-400">Strategic Reserve</div>
              </div>

              <div className="p-3 rounded-xl bg-[#10171B] border border-[#1D2A32]">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Subsidy Clean</div>
                <div className="text-lg font-mono font-extrabold text-amber-300 mt-0.5">99.4%</div>
                <div className="text-[9px] text-emerald-300">Zero Leakage</div>
              </div>
            </div>
          </div>

          {/* Security & Regulatory Standards Badges */}
          <div className="pt-6 border-t border-[#19262F] flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2 relative z-10">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>AES-256 Multi-Tenant Isolation</span>
            </div>
            <span>SARB & Central Bank Supervised</span>
            <span>ISO 20022 Compliant</span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: INTERACTIVE AUTHENTICATION & ROLE PROVISIONING        */}
        {/* =================================================================== */}
        <div className="lg:col-span-7 bg-[#090D10] p-6 sm:p-10 lg:p-12 flex flex-col justify-between overflow-y-auto">
          <div className="max-w-2xl mx-auto w-full space-y-6">
            {/* Top Auth Banner / Segment Control */}
            <div className="bg-[#10171B] p-1.5 rounded-2xl border border-[#1D2A32] flex">
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab("login");
                  setErrorMessage("");
                }}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authModalTab === "login"
                    ? "bg-[#14532D] text-white shadow-md border border-[#196349]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Lock className="w-4 h-4 text-emerald-300" />
                <span>Sign In to Workspace</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthModalTab("signup");
                  setErrorMessage("");
                }}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authModalTab === "signup"
                    ? "bg-[#F5B942] text-[#1A1105] shadow-md border border-[#D99B26]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <User className="w-4 h-4 text-slate-900" />
                <span>Create Account / Choose Role</span>
              </button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ============================================================== */}
            {/* SECTION 1: SIGN IN WORKFLOW                                    */}
            {/* ============================================================== */}
            {authModalTab === "login" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Sign In to Your Workspace
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter your registered credentials or select a verified role profile below for instant access.
                  </p>
                </div>

                {/* Direct Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address, Phone Number or National Farmer ID
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="e.g. james.banda@kakuzifarms.co.ke"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#10171B] border border-[#1D2A32] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Password / Cryptographic Key
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[11px] text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showPassword ? "Hide" : "Show"}</span>
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your security passphrase"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#10171B] border border-[#1D2A32] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#14532D] hover:bg-[#0E4223] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#196349] min-h-[44px]"
                  >
                    <span>{isSubmitting ? "Authenticating Session..." : "Sign In to Workspace"}</span>
                    <ArrowRight className="w-4 h-4 text-[#F5B942]" />
                  </button>
                </form>

                {/* 1-Click Role Logins Grid */}
                <div className="pt-4 border-t border-[#19262F] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#F5B942]" />
                        <span>Instant Verified 1-Click Role Profiles</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Click any role to load its pre-configured synchronized credentials and view its exclusive tools:
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {PRIMARY_ROLES.map((roleKey) => {
                      const cfg = ROLE_CONFIGS[roleKey];
                      const IconComp = ROLE_ICONS[cfg.iconName] || Sprout;

                      return (
                        <button
                          key={roleKey}
                          type="button"
                          onClick={() => handleQuickDemoLogin(roleKey)}
                          className="p-3.5 rounded-2xl bg-[#10171B] hover:bg-[#162228] border border-[#1D2A32] hover:border-emerald-500/60 transition-all text-left flex items-start gap-3 group cursor-pointer"
                        >
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm"
                            style={{ backgroundColor: `${cfg.accentColor}20` }}
                          >
                            <IconComp className="w-4 h-4" style={{ color: cfg.accentColor }} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-xs text-white group-hover:text-emerald-300 transition-colors truncate">
                                {cfg.label}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#070B0E] text-slate-400 shrink-0 ml-1">
                                {cfg.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              {cfg.demoUser.name} • {cfg.demoUser.organization}
                            </p>
                            <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-semibold mt-1">
                              <span>Enter as {cfg.label.split(" ")[0]}</span>
                              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SECTION 2: CREATE ACCOUNT & CHOOSE ROLE WORKFLOW               */}
            {/* ============================================================== */}
            {authModalTab === "signup" && (
              <form onSubmit={handleSignupSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Create Account & Choose Your Role
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select your exact position in the agricultural value chain. Your role configures your telemetry feeds, operational dashboards, and permission boundaries.
                  </p>
                </div>

                {/* Personal & Organization Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Legal Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="e.g. Tendai Moyo"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#10171B] border border-[#1D2A32] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#F5B942]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Official Email or Phone *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="e.g. tendai@farmco.africa"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#10171B] border border-[#1D2A32] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#F5B942]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Farm, Enterprise or Institution Name
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={signupOrg}
                        onChange={(e) => setSignupOrg(e.target.value)}
                        placeholder="e.g. Moyo Agritech & Outgrower Union"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#10171B] border border-[#1D2A32] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#F5B942]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Primary Operating Country (54 African Nations)
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={signupCountry}
                        onChange={(e) => setSignupCountry(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#10171B] border border-[#1D2A32] text-white text-xs focus:outline-none focus:border-[#F5B942] appearance-none cursor-pointer"
                      >
                        {AFRICAN_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code} className="bg-[#10171B] text-white">
                            [{c.code}] {c.name} ({c.currency})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Set Master Passphrase / Security Key
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Create a strong security passphrase"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#10171B] border border-[#1D2A32] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#F5B942]"
                    />
                  </div>
                </div>

                {/* CHOOSE ROLE SECTION - THE 7 CORE SPECIFIED ROLES */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#F5B942]" />
                      <span>Select Value-Chain Role (Mandatory)</span>
                    </label>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      Configures Workspace & Access Guard
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {PRIMARY_ROLES.map((roleKey) => {
                      const cfg = ROLE_CONFIGS[roleKey];
                      const IconComp = ROLE_ICONS[cfg.iconName] || Sprout;
                      const isSelected = selectedSignupRole === roleKey;

                      return (
                        <div
                          key={roleKey}
                          onClick={() => setSelectedSignupRole(roleKey)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#07261B] border-[#22C55E] shadow-lg ring-1 ring-[#22C55E]/40"
                              : "bg-[#10171B] border-[#1D2A32] hover:border-slate-700 hover:bg-[#141E24]"
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                                isSelected ? "bg-[#22C55E]/20 text-[#22C55E]" : "bg-[#162228] text-slate-400"
                              }`}
                            >
                              <IconComp className="w-5 h-5" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-sm text-white">
                                  {cfg.label}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0E151A] text-slate-300 border border-[#1D2A32]">
                                    {cfg.category}
                                  </span>
                                  {isSelected ? (
                                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border border-slate-600" />
                                  )}
                                </div>
                              </div>

                              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                {cfg.tagline}
                              </p>

                              {/* Features preview for selected role */}
                              {isSelected && (
                                <div className="mt-3 pt-2.5 border-t border-[#14532D]/40 flex flex-wrap gap-1.5">
                                  {cfg.keyFeatures.map((feat, i) => (
                                    <span
                                      key={i}
                                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#0A3022] text-emerald-300 border border-[#14533C] inline-flex items-center gap-1"
                                    >
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span>{feat}</span>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Sign Up Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#F5B942] hover:bg-[#E5A832] text-[#1A1105] font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <ShieldCheck className="w-4 h-4 text-[#1A1105]" />
                  <span>
                    {isSubmitting
                      ? "Provisioning Synchronized Account..."
                      : `Complete Registration as ${ROLE_CONFIGS[selectedSignupRole].label}`}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#1A1105]" />
                </button>
              </form>
            )}

            {/* Sovereign Data Mesh Notice */}
            <div className="p-4 rounded-2xl bg-[#08130E] border border-[#14532D]/60 flex items-start gap-3">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">Real-Time Sovereign Synchronization: </strong>
                Each role accesses exclusive data tailored to their mandate, while all transactions (grain shipments, forward contracts, cold storage bookings, loan disbursements, and policy decrees) are synchronized in real time across the Pan-African mesh.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
