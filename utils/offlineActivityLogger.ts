import { useState, useEffect } from "react";
import { OfflineActivityLogEntry } from "../types";

const STORAGE_KEY = "cultx_offline_activity_log_v1";

const SEED_FAILED_LOGS: OfflineActivityLogEntry[] = [
  {
    id: "log_fail_101",
    actionType: "SOIL_TELEMETRY",
    entity: "Sensor Node ELD-04 (Field B - Rift Valley)",
    timestamp: "18m ago",
    createdAt: Date.now() - 18 * 60 * 1000,
    status: "failed",
    errorMessage: "LoRaWAN edge gateway timeout: Remote mesh hop packet dropped (RSSI -112dBm)",
    errorCode: "ERR_MESH_PACKET_LOSS_504",
    retryCount: 2,
    payloadSummary: "Moisture 12.4%, Temp 24.2°C, Nitrogen 38ppm, Battery 78%",
    details: {
      nodeId: "ELD-04",
      fieldId: "fld-rift-02",
      sensorProtocol: "LoRaWAN 868MHz",
      gateway: "Silo-Hub-Node-North",
      lastHopRssi: -112,
    },
  },
  {
    id: "log_fail_102",
    actionType: "CREATE_LISTING",
    entity: "45 MT Grade-A White Maize (Nakuru Hub)",
    timestamp: "42m ago",
    createdAt: Date.now() - 42 * 60 * 1000,
    status: "failed",
    errorMessage: "AfCFTA Continental Registry sync timeout: HTTP 504 Gateway Timeout during escrow token validation",
    errorCode: "ERR_REGISTRY_TIMEOUT_504",
    retryCount: 1,
    payloadSummary: "Quantity: 45 MT, Grade: Grade 1 (Export), Min Price: $280/MT, Moisture: 12.8%",
    details: {
      commodity: "White Maize",
      tonnes: 45,
      priceUSD: 280,
      warehouseNode: "Nakuru Silo 02",
      standard: "COMESA-MRL-2026",
    },
  },
  {
    id: "log_fail_103",
    actionType: "APPLY_RECOMMENDATION",
    entity: "Nitrogen Top-Dressing Directive #REC-884",
    timestamp: "1h 15m ago",
    createdAt: Date.now() - 75 * 60 * 1000,
    status: "failed",
    errorMessage: "Cloud synchronization aborted: Client disconnected before server 200 OK acknowledged",
    errorCode: "ERR_CLIENT_DISCONNECT_ABORT",
    retryCount: 3,
    payloadSummary: "Recommendation: Split-dose urea top-dressing delayed prior to convective storm",
    details: {
      recommendationId: "rec-884",
      farmId: "farm-kakuzi-01",
      directiveType: "Nutrient Conservation",
      weatherContingency: "Convective Storm Crest",
    },
  },
];

type LogListener = (logs: OfflineActivityLogEntry[]) => void;
const listeners: Set<LogListener> = new Set();

function notifyListeners(logs: OfflineActivityLogEntry[]) {
  listeners.forEach((listener) => {
    try {
      listener(logs);
    } catch (e) {
      console.warn("Error notifying activity log listener:", e);
    }
  });
}

export const offlineActivityLogger = {
  getLogs(): OfflineActivityLogEntry[] {
    if (typeof window === "undefined") return SEED_FAILED_LOGS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Seed initial realistic failures so the user can immediately inspect the log
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_FAILED_LOGS));
        return SEED_FAILED_LOGS;
      }
      return JSON.parse(raw);
    } catch {
      return SEED_FAILED_LOGS;
    }
  },

  saveLogs(logs: OfflineActivityLogEntry[]) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      notifyListeners(logs);
    } catch (e) {
      console.warn("Failed to persist offline activity log:", e);
    }
  },

  logFailure(entry: {
    actionType: string;
    entity: string;
    errorMessage: string;
    errorCode?: string;
    payloadSummary?: string;
    details?: Record<string, any>;
  }): OfflineActivityLogEntry {
    const logs = this.getLogs();
    const newEntry: OfflineActivityLogEntry = {
      id: `fail_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      actionType: entry.actionType,
      entity: entry.entity,
      timestamp: "Just now",
      createdAt: Date.now(),
      status: "failed",
      errorMessage: entry.errorMessage,
      errorCode: entry.errorCode || "ERR_OFFLINE_SYNC_FAILED",
      retryCount: 0,
      payloadSummary: entry.payloadSummary,
      details: entry.details,
    };

    const updated = [newEntry, ...logs];
    this.saveLogs(updated);
    return newEntry;
  },

  async retryLog(id: string): Promise<{ success: boolean; message: string }> {
    const logs = this.getLogs();
    const target = logs.find((l) => l.id === id);
    if (!target) return { success: false, message: "Log entry not found" };

    // Update status to retry_pending
    this.saveLogs(
      logs.map((l) => (l.id === id ? { ...l, status: "retry_pending" as const, retryCount: l.retryCount + 1 } : l))
    );

    try {
      // Perform real or simulated batch reconciliation
      const response = await fetch("/api/sync/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actions: [
            {
              id: target.id,
              type: target.actionType,
              entity: target.entity,
              payload: target.details || { summary: target.payloadSummary },
              timestamp: Date.now(),
            },
          ],
          clientTimestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const currentLogs = this.getLogs();
        const resolved = currentLogs.map((l) =>
          l.id === id
            ? {
                ...l,
                status: "resolved" as const,
                resolvedAt: new Date().toLocaleTimeString(),
                timestamp: "Resolved",
              }
            : l
        );
        this.saveLogs(resolved);
        return { success: true, message: `Successfully synchronized ${target.entity}` };
      } else {
        throw new Error(`Sync responded with status ${response.status}`);
      }
    } catch (err: any) {
      // Mark as failed again with incremented count
      const currentLogs = this.getLogs();
      const failedAgain = currentLogs.map((l) =>
        l.id === id
          ? {
              ...l,
              status: "failed" as const,
              timestamp: "Retry failed just now",
              errorMessage: `Retry failed: ${err.message || "Network unreachable"}`,
            }
          : l
      );
      this.saveLogs(failedAgain);
      return { success: false, message: err.message || "Failed to sync" };
    }
  },

  async retryAll(): Promise<{ succeeded: number; failed: number }> {
    const logs = this.getLogs();
    const failedLogs = logs.filter((l) => l.status === "failed" || l.status === "retry_pending");

    let succeeded = 0;
    let failed = 0;

    for (const log of failedLogs) {
      const res = await this.retryLog(log.id);
      if (res.success) {
        succeeded++;
      } else {
        failed++;
      }
    }

    return { succeeded, failed };
  },

  removeLog(id: string) {
    const logs = this.getLogs();
    const updated = logs.filter((l) => l.id !== id);
    this.saveLogs(updated);
  },

  clearResolved() {
    const logs = this.getLogs();
    const updated = logs.filter((l) => l.status !== "resolved");
    this.saveLogs(updated);
  },

  clearAll() {
    this.saveLogs([]);
  },

  simulateSyncFailure(): OfflineActivityLogEntry {
    const sampleFailures = [
      {
        actionType: "SOIL_TELEMETRY",
        entity: "Soil Node KIK-09 (Field 3)",
        errorMessage: "Mesh collision: Dual packet transmission on 868.1MHz ISM channel",
        errorCode: "ERR_LORA_CHANNEL_BUSY",
        payloadSummary: "Moisture: 14.1%, NPK: 42-18-24, Temp: 22.8°C",
      },
      {
        actionType: "SUBMIT_CONTRACT",
        entity: "Forward Escrow Contract #AGRI-CTR-2026-904",
        errorMessage: "Weighbridge geofence mismatch: Transporter GPS outside designated 50m radius",
        errorCode: "ERR_ORACLE_GEOFENCE_REJECT",
        payloadSummary: "Tonnage: 32 MT Maize, Value: $8,960, Escrow State: Pending GPS Validation",
      },
      {
        actionType: "GENERAL_SYNC",
        entity: "Continental Agronomic Pest Alert Cache",
        errorMessage: "Network drop: Edge ping exceeded 5000ms timeout threshold",
        errorCode: "ERR_EDGE_TIMEOUT_504",
        payloadSummary: "Pest vector: Fall Armyworm spore migration vector east of Rift Valley",
      },
    ];

    const pick = sampleFailures[Math.floor(Math.random() * sampleFailures.length)];
    return this.logFailure(pick);
  },

  subscribe(listener: LogListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useOfflineActivityLogs() {
  const [logs, setLogs] = useState<OfflineActivityLogEntry[]>(() => offlineActivityLogger.getLogs());

  useEffect(() => {
    // Initial fetch
    setLogs(offlineActivityLogger.getLogs());
    const unsubscribe = offlineActivityLogger.subscribe((updated) => {
      setLogs([...updated]);
    });
    return () => unsubscribe();
  }, []);

  const failedCount = logs.filter((l) => l.status === "failed").length;
  const pendingRetryCount = logs.filter((l) => l.status === "retry_pending").length;
  const resolvedCount = logs.filter((l) => l.status === "resolved").length;

  return {
    logs,
    failedCount,
    pendingRetryCount,
    resolvedCount,
    logFailure: (entry: Parameters<typeof offlineActivityLogger.logFailure>[0]) =>
      offlineActivityLogger.logFailure(entry),
    retryLog: (id: string) => offlineActivityLogger.retryLog(id),
    retryAll: () => offlineActivityLogger.retryAll(),
    removeLog: (id: string) => offlineActivityLogger.removeLog(id),
    clearResolved: () => offlineActivityLogger.clearResolved(),
    clearAll: () => offlineActivityLogger.clearAll(),
    simulateSyncFailure: () => offlineActivityLogger.simulateSyncFailure(),
  };
}
