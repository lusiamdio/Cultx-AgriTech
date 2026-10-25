import React from "react";
import { ShieldAlert, ArrowRight, RefreshCw, Lock } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { ROLE_CONFIGS, isViewAllowedForRole, getPrimaryViewForRole } from "../../utils/rbac";
import { UserRole } from "../../types";

interface RoleAccessGuardProps {
  viewId: string;
  viewTitle?: string;
  children: React.ReactNode;
}

export const RoleAccessGuard: React.FC<RoleAccessGuardProps> = ({
  viewId,
  viewTitle = "Operational Workspace",
  children,
}) => {
  const { userRole, setCurrentView, openAuthModal } = useApp();

  const isAllowed = isViewAllowedForRole(viewId, userRole);

  if (isAllowed) {
    return <>{children}</>;
  }

  const roleConfig = ROLE_CONFIGS[userRole] || ROLE_CONFIGS.farmer;
  const primaryView = getPrimaryViewForRole(userRole);

  // Find which roles are allowed for this view
  const authorizedRoles = Object.entries(ROLE_CONFIGS)
    .filter(([_, cfg]) => cfg.allowedViews.includes(viewId))
    .map(([roleKey]) => roleKey as UserRole);

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 animate-in fade-in">
      <div className="rounded-3xl bg-[#0F161B] border border-[#1E2E38] p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
        {/* Subtle top indicator */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />

        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-amber-400" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18232B] text-amber-300 text-xs font-bold mb-3 border border-amber-600/30">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Role-Based Access Control (RBAC) Boundary</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Feature Restricted: {viewTitle}
        </h2>

        <p className="text-sm text-slate-300 max-w-xl mx-auto mt-3 leading-relaxed">
          Signed in as <span className="font-bold text-white">{roleConfig.label}</span>.
          Access is restricted to authorized roles to ensure data confidentiality and regulatory compliance.
        </p>

        {/* Authorized Roles Listing */}
        {authorizedRoles.length > 0 && (
          <div className="mt-6 pt-6 border-t border-[#1C2A34] max-w-lg mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Authorized Ecosystem Roles:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {authorizedRoles.map((r) => (
                <span
                  key={r}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#162228] text-emerald-300 border border-[#20303A]"
                >
                  {ROLE_CONFIGS[r]?.label || r}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentView(primaryView)}
            className="px-6 py-3 rounded-xl bg-[#14532D] hover:bg-[#0F3D22] text-[#FDFBF7] text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer border border-[#1E6B3E] min-h-[44px]"
          >
            <span>Return to My Authorized Workspace ({roleConfig.label})</span>
            <ArrowRight className="w-4 h-4 text-[#F5B942]" />
          </button>

          <button
            onClick={() => openAuthModal("signup")}
            className="px-5 py-3 rounded-xl bg-[#1A252D] hover:bg-[#22323D] text-slate-200 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer border border-[#263744] min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            <span>Switch Role Persona</span>
          </button>
        </div>
      </div>
    </div>
  );
};
