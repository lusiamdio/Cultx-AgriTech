/**
 * CULTx Production Performance & Operational Latency Telemetry Engine
 * Monitors edge response latency, connection speed (4G / 3G / 2G), and offline transitions.
 */

export interface SystemEfficiencyMetrics {
  edgeLatencyMs: number;
  connectionType: "wifi" | "4g" | "3g" | "2g" | "offline";
  isOnline: boolean;
  saveDataMode: boolean;
  heapUsedMB?: number;
  lastPingTimestamp: number;
}

type MetricsListener = (metrics: SystemEfficiencyMetrics) => void;

class PerformanceMetricsEngine {
  private currentMetrics: SystemEfficiencyMetrics = {
    edgeLatencyMs: 34,
    connectionType: "4g",
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    saveDataMode: false,
    lastPingTimestamp: Date.now(),
  };

  private listeners: Set<MetricsListener> = new Set();
  private pingInterval: any = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.initConnectionListeners();
      this.startEdgeTelemetry();
    }
  }

  private initConnectionListeners() {
    window.addEventListener("online", () => {
      this.currentMetrics.isOnline = true;
      this.currentMetrics.connectionType = this.detectConnectionType();
      this.notifyListeners();
    });

    window.addEventListener("offline", () => {
      this.currentMetrics.isOnline = false;
      this.currentMetrics.connectionType = "offline";
      this.currentMetrics.edgeLatencyMs = 0;
      this.notifyListeners();
    });

    // Check Network Information API (Chrome/Android)
    const navConn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (navConn) {
      this.currentMetrics.saveDataMode = Boolean(navConn.saveData);
      navConn.addEventListener("change", () => {
        this.currentMetrics.connectionType = this.detectConnectionType();
        this.currentMetrics.saveDataMode = Boolean(navConn.saveData);
        this.notifyListeners();
      });
    }
  }

  private detectConnectionType(): "wifi" | "4g" | "3g" | "2g" | "offline" {
    if (!navigator.onLine) return "offline";
    const navConn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (!navConn) return "4g";

    const effType = navConn.effectiveType;
    if (effType === "2g" || effType === "slow-2g") return "2g";
    if (effType === "3g") return "3g";
    if (navConn.type === "wifi") return "wifi";
    return "4g";
  }

  private startEdgeTelemetry() {
    // Initial edge ping
    this.measureEdgePing();

    // Check edge health every 30 seconds
    this.pingInterval = setInterval(() => {
      if (this.currentMetrics.isOnline) {
        this.measureEdgePing();
      }
    }, 30000);
  }

  public async measureEdgePing(): Promise<number> {
    if (!navigator.onLine) {
      this.currentMetrics.edgeLatencyMs = 0;
      this.notifyListeners();
      return 0;
    }

    const t0 = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch("/api/health", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const t1 = performance.now();
      const latency = Math.round(t1 - t0);

      this.currentMetrics.edgeLatencyMs = latency > 0 ? latency : 18;
      this.currentMetrics.isOnline = res.ok;
      this.currentMetrics.lastPingTimestamp = Date.now();

      // Memory metrics if available in Chromium
      if ((performance as any).memory) {
        this.currentMetrics.heapUsedMB = Math.round(
          (performance as any).memory.usedJSHeapSize / (1024 * 1024)
        );
      }

      this.notifyListeners();
      return this.currentMetrics.edgeLatencyMs;
    } catch {
      this.currentMetrics.edgeLatencyMs = 0;
      this.notifyListeners();
      return 0;
    }
  }

  public getMetrics(): SystemEfficiencyMetrics {
    return { ...this.currentMetrics };
  }

  public subscribe(listener: MetricsListener): () => void {
    this.listeners.add(listener);
    listener(this.currentMetrics);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      try {
        listener({ ...this.currentMetrics });
      } catch (e) {
        console.warn("Metrics listener error:", e);
      }
    }
  }

  public destroy() {
    if (this.pingInterval) clearInterval(this.pingInterval);
  }
}

export const performanceTelemetry = new PerformanceMetricsEngine();
