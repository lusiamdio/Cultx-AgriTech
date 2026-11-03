import { test, after } from "node:test";
import assert from "node:assert/strict";
import { app } from "../server";

process.env.SUPABASE_URL = "https://auth.example.test";
process.env.SUPABASE_PUBLISHABLE_KEY = "test-public-key";
delete process.env.GEMINI_API_KEY;
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = String(input);
  if (!url.startsWith("https://auth.example.test/")) return originalFetch(input, init);
  const token = new Headers(init?.headers).get("authorization");
  if (token === "Bearer unavailable") return new Response(null, { status: 503 });
  if (url.includes("/auth/v1/user")) return token === "Bearer valid" || token === "Bearer admin"
    ? Response.json({ id: "test-user" }) : new Response(null, { status: 401 });
  return Response.json([{ role: token === "Bearer admin" ? "superadmin" : "farmer" }]);
};
const server = app.listen(0, "127.0.0.1");
await new Promise<void>((resolve) => server.once("listening", resolve));
const address = server.address();
if (!address || typeof address === "string") throw new Error("No test server address");
const base = `http://127.0.0.1:${address.port}`;
after(() => { server.close(); globalThis.fetch = originalFetch; });

test("health reveals no configuration and API requires verified credentials", async () => {
  const health = await originalFetch(`${base}/api/health`);
  assert.deepEqual(await health.json(), { status: "ok" });
  assert.equal(health.headers.get("x-powered-by"), null);
  const unauthenticated = await originalFetch(`${base}/api/gemini/copilot`, { method: "POST", headers: { "content-type": "application/json" }, body: '{"query":"test"}' });
  assert.equal(unauthenticated.status, 401);
  const invalid = await originalFetch(`${base}/api/gemini/copilot`, { method: "POST", headers: { authorization: "Bearer bad", "content-type": "application/json" }, body: '{"query":"test"}' });
  assert.equal(invalid.status, 401);
});

test("AI failures and unimplemented transactions never report success", async () => {
  for (const path of ["/api/gemini/copilot", "/api/sync/batch", "/api/oracles/weighbridge-escrow", "/api/aggregations/optimize", "/api/ussd/session"]) {
    const response = await originalFetch(`${base}${path}`, { method: "POST", headers: { authorization: "Bearer valid", "content-type": "application/json" }, body: '{"query":"test"}' });
    assert.equal(response.status, 503, path);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal((await response.json()).success, undefined);
  }
});

test("privileged operations enforce profile roles", async () => {
  const post = (token: string) => originalFetch(`${base}/api/gemini/policy-simulator`, { method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: "{}" });
  assert.equal((await post("valid")).status, 403);
  assert.equal((await post("admin")).status, 503);
});

test("invalid requests and unknown API routes do not fall through to the SPA", async () => {
  const invalid = await originalFetch(`${base}/api/gemini/copilot`, { method: "POST", headers: { authorization: "Bearer valid", "content-type": "application/json" }, body: "[]" });
  assert.equal(invalid.status, 400);
  const missing = await originalFetch(`${base}/api/does-not-exist`, { headers: { authorization: "Bearer valid" } });
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).error.code, "NOT_FOUND");
});

test("authentication provider outages do not masquerade as invalid credentials", async () => {
  const response = await originalFetch(`${base}/api/gemini/copilot`, { method: "POST", headers: { authorization: "Bearer unavailable", "content-type": "application/json" }, body: '{"query":"test"}' });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error.code, "AUTH_UNAVAILABLE");
});
