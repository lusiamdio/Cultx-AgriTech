import React from "react";
import { Cpu, RefreshCw } from "lucide-react";

interface ViewLoadingSkeletonProps {
  viewId?: string;
}

export const ViewLoadingSkeleton: React.FC<ViewLoadingSkeletonProps> = ({ viewId = "module" }) => {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse">
      {/* Top Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60 animate-ping" />
            <div className="h-6 w-48 bg-slate-800 rounded-lg" />
          </div>
          <div className="h-4 w-72 bg-slate-800/60 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-28 bg-slate-800/80 rounded-xl" />
          <div className="h-9 w-32 bg-emerald-950/40 border border-emerald-500/20 rounded-xl" />
        </div>
      </div>

      {/* KPI Stat Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-[#0E161C] border border-slate-800/60 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-slate-800 rounded" />
              <div className="w-7 h-7 rounded-lg bg-slate-800/80" />
            </div>
            <div className="h-7 w-28 bg-slate-700/80 rounded-md" />
            <div className="h-3 w-36 bg-slate-800/50 rounded" />
          </div>
        ))}
      </div>

      {/* Main Workspace Skeleton (Chart & Table / Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0E161C] border border-slate-800/60 space-y-4 min-h-[360px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="h-4 w-36 bg-slate-800 rounded" />
            <div className="h-7 w-24 bg-slate-800/80 rounded-lg" />
          </div>
          <div className="w-full flex-1 flex items-center justify-center my-8">
            <div className="flex flex-col items-center gap-2 text-slate-600">
              <RefreshCw className="w-6 h-6 text-emerald-500/50 animate-spin" />
              <span className="text-xs font-mono tracking-wider text-slate-500 uppercase">
                Loading {viewId.replace("_", " ")} telemetry chunk...
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/40">
            <div className="h-3 bg-slate-800/60 rounded" />
            <div className="h-3 bg-slate-800/60 rounded" />
            <div className="h-3 bg-slate-800/60 rounded" />
            <div className="h-3 bg-slate-800/60 rounded" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E161C] border border-slate-800/60 space-y-4 min-h-[360px]">
          <div className="h-4 w-28 bg-slate-800 rounded" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((j) => (
              <div
                key={j}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/40 space-y-2"
              >
                <div className="h-3 w-32 bg-slate-800 rounded" />
                <div className="h-2.5 w-44 bg-slate-800/50 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
