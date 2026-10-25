import React, { useState } from "react";
import {
  X,
  AlertTriangle,
  RotateCw,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  WifiOff,
  Radio,
  Search,
  PlusCircle,
  Database,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useOfflineActivityLogs } from "../../utils/offlineActivityLogger";
import { OfflineActivityLogEntry } from "../../types";

interface OfflineActivityLogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineActivityLog: React.FC<OfflineActivityLogProps> = ({ isOpen, onClose }) => {
  const { syncQueue, triggerManualSync, isOffline } = useApp();
  const {
    logs,
    failedCount,
    resolvedCount,
    retryLog,
    retryAll,
    removeLog,
    clearResolved,
    clearAll,
    simulateSyncFailure,
  } = useOfflineActivityLogs();

  const [activeTab, setActiveTab] = useState<"all" | "failed" | "pending" | "resolved">("failed");
  const [searchQuery, setSearchQuery] = useState("");
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [isRetryingAll, setIsRetryingAll] = useState(false);
  const [expandedPayloadIds, setExpandedPayloadIds] = useState<Set<string>>(new Set());
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleExpandPayload = (id: string) => {
    setExpandedPayloadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRetryOne = async (id: string) => {
    setRetryingId(id);
    const result = await retryLog(id);
    setRetryingId(null);
    setFeedbackMessage(result.message);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleRetryAll = async () => {
    setIsRetryingAll(true);
    const result = await retryAll();
    setIsRetryingAll(false);
    setFeedbackMessage(
      `Retried failed operations: ${result.succeeded} resolved, ${result.failed} still unreachable.`
    );
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Filter logs based on active tab and search query
  const filteredLogs = logs.filter((log) => {
    if (activeTab === "failed" && log.status !== "failed" && log.status !== "retry_pending") return false;
    if (activeTab === "resolved" && log.status !== "resolved") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchEntity = log.entity.toLowerCase().includes(q);
      const matchAction = log.actionType.toLowerCase().includes(q);
      const matchError = log.errorMessage.toLowerCase().includes(q);
      const matchCode = (log.errorCode || "").toLowerCase().includes(q);
      return matchEntity || matchAction || matchError || matchCode;
    }
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0E151A] border border-amber-800/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-950/60 via-[#131D24] to-[#0E151A] border-b border-amber-900/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Offline Activity & Sync Log
                </h3>
                {failedCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-800">
                    {failedCount} FAILED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                    SYNCHRONIZED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Persistent local transaction store for low-connectivity & offline edge mutations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Close log"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert Banner */}
        {feedbackMessage && (
          <div className="px-4 py-2.5 bg-emerald-950/70 border-b border-emerald-800/40 text-emerald-200 text-xs font-medium flex items-center gap-2 animate-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Control & Tab Bar */}
        <div className="px-5 py-3 bg-[#111A20] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#090D0F] rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab("failed")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === "failed"
                  ? "bg-rose-950/80 text-rose-300 border border-rose-800/60"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              Failed Attempts
              {failedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-900 text-rose-200 font-bold">
                  {failedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === "pending"
                  ? "bg-amber-950/80 text-amber-300 border border-amber-800/60"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <RotateCw className="w-3.5 h-3.5 text-amber-400" />
              Active Queue
              {syncQueue.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-900 text-amber-200 font-bold">
                  {syncQueue.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "all"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All Records ({logs.length})
            </button>

            <button
              onClick={() => setActiveTab("resolved")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === "resolved"
                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Resolved ({resolvedCount})
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {failedCount > 0 && (
              <button
                onClick={handleRetryAll}
                disabled={isRetryingAll}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRetryingAll ? "animate-spin" : ""}`} />
                {isRetryingAll ? "Retrying All..." : `Retry All (${failedCount})`}
              </button>
            )}

            <button
              onClick={simulateSyncFailure}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
              title="Simulate an offline mutation network failure for testing"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Simulate Failure</span>
            </button>

            {resolvedCount > 0 && (
              <button
                onClick={clearResolved}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs flex items-center gap-1 cursor-pointer"
                title="Clear resolved records"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Clear Resolved</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-5 py-2.5 bg-[#0C1217] border-b border-slate-800/60 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search by action type, entity, error reason or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-[11px] text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Main Log List Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px]">
          {activeTab === "pending" ? (
            /* Pending Sync Queue View */
            syncQueue.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-10 h-10 text-emerald-400/60 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-300">Sync Queue is Empty</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  All local agricultural transactions, telemetry pings, and recommendations are fully synced.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-semibold text-slate-400">
                    Active mutations waiting to reach cloud mesh ({syncQueue.length}):
                  </span>
                  <button
                    onClick={triggerManualSync}
                    className="px-2.5 py-1 rounded bg-amber-800 hover:bg-amber-700 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw className="w-3 h-3" />
                    Force Sync Now
                  </button>
                </div>
                {syncQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#131D24] border border-amber-900/30 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-950/70 border border-amber-700/50 flex items-center justify-center text-amber-400 shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-100">{item.action}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono uppercase bg-amber-950 text-amber-300 border border-amber-800">
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Entity: {item.entity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 font-mono">{item.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : filteredLogs.length === 0 ? (
            /* Empty State for Logs */
            <div className="text-center py-12">
              <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-300">No Log Entries Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {searchQuery
                  ? "No sync logs match your search filter criteria."
                  : activeTab === "failed"
                  ? "Great news! No failed sync attempts are currently stored."
                  : "No activity logs recorded."}
              </p>
              {activeTab === "failed" && (
                <button
                  onClick={simulateSyncFailure}
                  className="mt-4 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Simulate a Failed Sync Attempt
                </button>
              )}
            </div>
          ) : (
            /* Failed and All Logs View */
            filteredLogs.map((log) => {
              const isFailed = log.status === "failed" || log.status === "retry_pending";
              const isResolved = log.status === "resolved";
              const isExpanded = expandedPayloadIds.has(log.id);
              const isItemRetrying = retryingId === log.id;

              return (
                <div
                  key={log.id}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                    isFailed
                      ? "bg-rose-950/20 border-rose-900/40 hover:border-rose-700/60"
                      : "bg-[#131D24] border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isFailed
                            ? "bg-rose-950/80 border border-rose-700 text-rose-400"
                            : "bg-emerald-950/80 border border-emerald-700 text-emerald-400"
                        }`}
                      >
                        {isFailed ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-white tracking-wide">
                            {log.entity}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                            {log.actionType}
                          </span>
                          {isFailed ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                              FAILED {log.retryCount > 0 ? `(Attempt #${log.retryCount + 1})` : ""}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              RESOLVED
                            </span>
                          )}
                        </div>

                        {/* Error Callout */}
                        {isFailed && (
                          <div className="mt-2 p-2.5 rounded-lg bg-rose-950/40 border border-rose-900/50 text-rose-200 text-xs">
                            <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                              <span>Reason:</span>
                              <span className="font-mono text-[10px] px-1.5 py-0.2 bg-rose-900/80 rounded border border-rose-700">
                                {log.errorCode || "ERR_OFFLINE_SYNC"}
                              </span>
                            </div>
                            <p className="mt-0.5 text-rose-200/90 text-[11px] leading-relaxed">
                              {log.errorMessage}
                            </p>
                          </div>
                        )}

                        {/* Payload Summary */}
                        {log.payloadSummary && (
                          <p className="text-[11px] text-slate-400 mt-2">
                            <span className="font-medium text-slate-300">Payload: </span>
                            {log.payloadSummary}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions on Item */}
                    <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                      <span className="text-[11px] text-slate-500 font-mono mr-2 hidden sm:inline">
                        {log.timestamp}
                      </span>

                      {isFailed && (
                        <button
                          onClick={() => handleRetryOne(log.id)}
                          disabled={isItemRetrying}
                          className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                          title="Retry this operation"
                        >
                          <RotateCw className={`w-3 h-3 ${isItemRetrying ? "animate-spin" : ""}`} />
                          {isItemRetrying ? "Retrying..." : "Retry"}
                        </button>
                      )}

                      {(log.details || log.payloadSummary) && (
                        <button
                          onClick={() => toggleExpandPayload(log.id)}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="View JSON Payload"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      )}

                      <button
                        onClick={() => removeLog(log.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Dismiss / remove log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded JSON Inspector */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono uppercase mb-1">
                        <span>Payload Metadata & Diagnostics:</span>
                        <span>ID: {log.id}</span>
                      </div>
                      <pre className="p-2.5 rounded bg-black/60 border border-slate-800 text-[11px] font-mono text-emerald-300/90 overflow-x-auto max-h-40">
                        {JSON.stringify(log.details || { summary: log.payloadSummary }, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Edge Sync Telemetry & Heartbeat */}
        <div className="px-5 py-3 bg-[#0A0F12] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            {isOffline ? (
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <WifiOff className="w-3.5 h-3.5" />
                Offline Mode • All changes saved to local IndexedDB
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Cloud Mesh Heartbeat Active (Every 30s)
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500">
              Storage: IndexedDB + LocalStorage Mesh
            </span>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
