import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { requireAuth, requireRole } from "./server/auth";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "DENY");
  if (req.path.startsWith("/api/")) res.setHeader("Cache-Control", "no-store");
  next();
});
// Health is public; every other API requires a verified Supabase identity.
app.use("/api", (req, res, next) => req.path === "/health" && req.method === "GET" ? next() : requireAuth(req, res, next));
app.use(express.json({ limit: "10mb" }));
app.use("/api", (req, res, next) => {
  if (req.method === "POST" && (!req.body || typeof req.body !== "object" || Array.isArray(req.body))) {
    return res.status(400).json({ error: { code: "INVALID_INPUT", message: "A JSON object is required." } });
  }
  next();
});
app.use("/api/gemini/policy-simulate", requireRole("government", "superadmin"));
app.use("/api/gemini/policy-simulator", requireRole("government", "superadmin"));
app.use("/api/gemini/inventory-compliance-report", requireRole("agribusiness", "superadmin"));

const unavailable = (res: express.Response, code = "AI_UNAVAILABLE") =>
  res.status(503).json({ error: { code, message: "This service is currently unavailable." } });

// Initialize Gemini SDK with User-Agent header as required
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    try {
      genAI = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (e) {
      console.warn("Failed to initialize Gemini client.");
    }
  }
  return genAI;
}

// A public liveness check contains no configuration or process details.
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// 1. AI Agricultural Copilot Endpoint
app.post("/api/gemini/copilot", async (req, res) => {
  const { query, farmContext, language = "English" } = req.body;
  const ai = getGeminiClient();

  if (typeof query !== "string" || !query.trim() || query.length > 10000 || typeof language !== "string" || language.length > 100) {
    return res.status(400).json({ error: "Missing query" });
  }

  if (ai) {
    try {
      const prompt = `You are AgriIntel Copilot, the authoritative Pan-African Agricultural Operating System AI advisor.
User Language: ${language}
Context:
${farmContext ? JSON.stringify(farmContext, null, 2) : "General Pan-African farming & agribusiness context"}

Farmer/User Query: "${query}"

Provide an actionable, authoritative, concise response formatted in clear markdown. Include:
1. Direct answer with clear agricultural reasoning.
2. Immediate operational actions (with timeframe or quantitative guidelines e.g. liters/ha, days, kg/ha).
3. Risk or opportunity assessment for African smallholders / commercial growers.
If the language is not English, respond in the requested language (${language}) or provide an English answer with regional terminology.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      const text = response.text;
      if (!text) return unavailable(res);

      return res.json({
        success: true,
        answer: text,
        source: "gemini-3.8-flash",
      });
    } catch (err: any) {
      console.error("Gemini Copilot request failed.");
      // Return a service error below.
    }
  }

  return unavailable(res);
});

// 2. AI Crop Doctor (Vision & Diagnostic)
app.post("/api/gemini/crop-doctor", async (req, res) => {
  const imageBase64 = req.body.imageBase64 || req.body.imageData || req.body.image;
  const { cropType = "Maize", symptomsDescription = "" } = req.body;
  const ai = getGeminiClient();

  if (typeof imageBase64 !== "string" || !imageBase64) return res.status(400).json({ error: { code: "INVALID_INPUT", message: "An image is required." } });
  if (ai) {
    try {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";

      const prompt = `You are AgriIntel Crop Doctor, an expert agronomist specialized in African crops (Maize, Cassava, Cocoa, Coffee, Wheat, Rice, Sorghum, Cowpeas, Vegetables).
Crop examined: ${cropType}
Additional notes: ${symptomsDescription}

Analyze the crop image carefully and return JSON strictly with this structure:
{
  "diseaseName": "Name of disease, pest, or nutrient deficiency",
  "pathogenType": "Fungal | Bacterial | Viral | Pest | Nutrient Deficiency",
  "confidence": 92,
  "severity": "Low | Moderate | Severe | Critical",
  "symptoms": ["Symptom 1", "Symptom 2", "Symptom 3"],
  "recommendedActions": ["Immediate step", "Chemical/biological treatment", "Field management step"],
  "organicAlternatives": ["Eco-friendly remedy"],
  "preventativeMeasures": ["Future rotation/spacing guide"],
  "professionalDisclaimer": "This AI diagnostic provides advisory intelligence. For certified confirmation, consult your local agricultural extension officer or certified agronomist."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: {
          parts: [
            { inlineData: { mimeType, data: base64Data } },
            { text: prompt },
          ],
        },
        config: {
          responseMimeType: "application/json",
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ success: true, result: parsed, source: "gemini-3.8-flash" });
      }
    } catch (e: any) {
      console.error("Crop Doctor request failed.");
    }
  }

  return unavailable(res);
});

// 3. Digital Contract Risk Audit
app.post("/api/gemini/contract-audit", async (req, res) => {
  const { contractDetails } = req.body;
  const ai = getGeminiClient();

  if (ai && contractDetails) {
    try {
      const prompt = `You are AgriIntel Legal & Trade AI. Audit this African agricultural purchase contract for financial, logistical, and legal risks:
${JSON.stringify(contractDetails, null, 2)}

Return JSON:
{
  "riskScore": 25,
  "overallVerdict": "Low Risk | Moderate Risk | High Risk",
  "identifiedRisks": [
    { "title": "...", "severity": "High | Medium | Low", "description": "...", "remedy": "..." }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      if (response.text) {
        return res.json({ success: true, audit: JSON.parse(response.text) });
      }
    } catch (err) {
      console.error("Contract audit request failed.");
    }
  }

  return unavailable(res);
});

// 4. Policy Simulator
app.post(["/api/gemini/policy-simulate", "/api/gemini/policy-simulator"], async (req, res) => {
  const { country = "Kenya", policyChange, policyProposal, baseline } = req.body;
  const targetPolicy = policyProposal || policyChange || "National agricultural subsidy and input credit optimization.";
  const ai = getGeminiClient();

  if (ai && targetPolicy) {
    try {
      const prompt = `You are AgriIntel National Agricultural Policy Simulator for ${country}.
Simulate the economic, yield, and food security impacts of this policy intervention:
"${targetPolicy}"
Baseline data: ${JSON.stringify(baseline || {})}

Return JSON:
{
  "projectedYieldIncreasePct": 14,
  "projectedProductionChange": "+14.0%",
  "farmerIncomeChange": "+8.2%",
  "fiscalCostUSD": "$42 Million USD",
  "governmentCostEstimate": "$42 Million USD (equivalent to 1.8% agricultural budget)",
  "forexSavingsUSD": "$68 Million USD",
  "netEconomicBenefitUSD": "+$26 Million USD Net Surplus",
  "foodPriceImpact": "-3.8%",
  "foodSecurityIndexChange": "+5.2 points",
  "regionalBeneficiaries": "485,000 smallholders",
  "keyRecommendations": [
    "Target smallholders under 5 hectares via digital e-vouchers on CULTx Mobile to prevent leakage",
    "Combine fertilizer distribution with certified hybrid drought-tolerant seed",
    "Monitor soil acidity (pH) to prevent soil acidification from excess ammonium nitrate"
  ],
  "unintendedConsequences": ["Soil nutrient imbalance if nitrogen over-subsidized without P&K", "Cross-border smuggling arbitrage"],
  "aiAnalysis": "3-4 sentence comprehensive policy rationale and mitigation strategies."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({
          success: true,
          simulation: parsed,
          ...parsed,
        });
      }
    } catch (err) {
      console.error("Policy simulator request failed.");
    }
  }

  return unavailable(res);
});

// 5. Commodity Price Forecast
app.post("/api/gemini/price-forecast", async (req, res) => {
  const { commodity = "Maize", country = "South Africa", currentPrice = "R5,420/t" } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `Analyze 30-day commodity price trajectory for ${commodity} in ${country} (current spot: ${currentPrice}).
Return JSON:
{
  "forecastPercentage": "+6.8%",
  "forecastPrice": "R5,788/t",
  "confidenceScore": 89,
  "trend": "BULLISH | BEARISH | STABLE",
  "primaryDrivers": ["Driver 1", "Driver 2", "Driver 3"],
  "marketAnalysis": "Short paragraph explaining macroeconomic and harvest trends.",
  "recommendedAction": "Hold inventory for 21 days or lock forward contract at R5,750."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      if (response.text) {
        return res.json({ success: true, forecast: JSON.parse(response.text) });
      }
    } catch (e) {
      console.error("Price forecast request failed.");
    }
  }

  return unavailable(res);
});

// Real-time market and climate feeds require a verified data source.
app.get(["/api/gemini/market-prices", "/api/gemini/climate-intelligence"], (_req, res) => unavailable(res, "DATA_UNAVAILABLE"));

// 6. Inventory Global Food Security & Regional Export Compliance Assessment
app.post("/api/gemini/inventory-compliance-report", async (req, res) => {
  const { inventorySummary, projectedQuarters, regionalBufferThreshold = 15 } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are the Chief Food Security Auditor and Agronomic Trade Compliance Specialist for Pan-African Agricultural Systems.
Evaluate current agricultural supply-chain inventory and 3-quarter demand projections against:
1. UN FAO Committee on World Food Security (CFS-RAI Principles)
2. Codex Alimentarius & Chemical Safety (MRL) standards
3. Regional Cross-Border Export Compliance (SADC, COMESA, AfCFTA 15% mandatory strategic buffer reserve)
4. ISTA certified hybrid seed purity & germination protocols

Inventory & Forecast Data:
${JSON.stringify({ inventorySummary, projectedQuarters, regionalBufferThreshold }, null, 2)}

Provide a rigorous, authoritative audit report strictly in JSON:
{
  "reportTitle": "Global Food Security & Regional Export Inventory Compliance Assessment",
  "executiveSummary": "2-3 sentence executive synopsis highlighting food security alignment and buffer vulnerabilities.",
  "complianceScore": 92,
  "auditReadinessTier": "Tier-1 Certified (AfCFTA & Codex SPS Compliant)",
  "regionalExportThresholdMet": false,
  "currentBufferMarginPct": 11.4,
  "mandatoryBufferThresholdPct": 15.0,
  "evaluatedPillars": [
    {
      "pillar": "Codex Alimentarius & Chemical Safety (MRL)",
      "status": "Compliant | Warning | Critical",
      "score": 96,
      "details": "Specific verification of storage segregation, heavy metal assays, and safe handling."
    },
    {
      "pillar": "FAO CFS-RAI Principle 6: Sustainable Nutrient Balance",
      "status": "Compliant | Warning | Critical",
      "score": 78,
      "details": "Evaluation of NPK vs Urea vs DAP ratio to prevent soil degradation."
    },
    {
      "pillar": "Regional Strategic Buffer Reserve (AfCFTA / SADC)",
      "status": "Compliant | Warning | Critical",
      "score": 64,
      "details": "Analysis of predictive stock levels against the mandatory 15% regional export reserve threshold."
    },
    {
      "pillar": "Certified Hybrid Seed Purity & Germination (ISTA)",
      "status": "Compliant | Warning | Critical",
      "score": 98,
      "details": "Analysis of seed stock genetic purity and germination buffer."
    },
    {
      "pillar": "Post-Harvest Moisture & Hermetic Integrity",
      "status": "Compliant | Warning | Critical",
      "score": 91,
      "details": "Assessment of silo storage moisture (< 12.5%) and mycotoxin risk."
    }
  ],
  "criticalVulnerabilities": [
    {
      "item": "Name of input (e.g. Urea 46-0-0)",
      "issue": "Specific deficit or regulatory risk",
      "remedy": "Operational corrective action"
    }
  ],
  "actionableDirectives": [
    "Directive 1",
    "Directive 2",
    "Directive 3"
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      if (response.text) {
        return res.json({ success: true, report: JSON.parse(response.text), source: "gemini-3.8-flash" });
      }
    } catch (err) {
      console.error("Inventory compliance report generation failed.");
    }
  }

  return unavailable(res);
});

// These operations have no backend integration yet; never report simulated success.
app.post(["/api/sync/batch", "/api/oracles/weighbridge-escrow", "/api/aggregations/optimize", "/api/ussd/session"], (_req, res) => unavailable(res, "SERVICE_UNAVAILABLE"));
app.get("/api/diagnostics/efficiency", requireRole("superadmin"), (_req, res) => res.json({ success: true, uptimeSeconds: Math.round(process.uptime()) }));

app.use("/api", (_req, res) => res.status(404).json({ error: { code: "NOT_FOUND", message: "API route not found." } }));

// Vite Middleware for development vs Static Production Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CULTx / AgriIntel] Server active on http://0.0.0.0:${PORT}`);
  });
}

if (process.env.NODE_ENV !== "test") startServer();

export { app };
