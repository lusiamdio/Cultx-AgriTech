import type { NextFunction, Request, RequestHandler, Response } from "express";

export type AuthenticatedUser = { id: string; email?: string; roles: string[] };

declare global { namespace Express { interface Request { auth?: AuthenticatedUser } } }

const roleValues = new Set(["farmer", "cooperative", "buyer", "agribusiness", "logistics", "finance", "government", "researcher", "input_supplier", "superadmin"]);

const configuration = () => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
};

const sendError = (res: Response, status: number, code: string, message: string) =>
  res.status(status).json({ error: { code, message, requestId: res.locals.requestId } });

const bearerToken = (request: Request) => {
  const value = request.header("authorization");
  return value?.match(/^Bearer\s+(.+)$/i)?.[1] || null;
};

export const requireAuth: RequestHandler = async (request, response, next) => {
  const config = configuration();
  const token = bearerToken(request);
  if (!config) return sendError(response, 503, "AUTH_UNAVAILABLE", "Authentication is not configured.");
  if (!token) return sendError(response, 401, "UNAUTHENTICATED", "A bearer token is required.");

  try {
    const userResponse = await fetch(`${config.url}/auth/v1/user`, {
      headers: { apikey: config.key, Authorization: `Bearer ${token}` },
    });
    if (!userResponse.ok) return sendError(response, 401, "UNAUTHENTICATED", "The access token is invalid or expired.");
    const user = await userResponse.json() as { id?: string; email?: string };
    if (!user.id) return sendError(response, 401, "UNAUTHENTICATED", "The access token is invalid.");

    const profileResponse = await fetch(`${config.url}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=role`, {
      headers: { apikey: config.key, Authorization: `Bearer ${token}` },
    });
    if (!profileResponse.ok) return sendError(response, 403, "PROFILE_UNAVAILABLE", "An authorized profile is required.");
    const profiles = await profileResponse.json() as Array<{ role?: string }>;
    const role = profiles[0]?.role;
    if (!role || !roleValues.has(role)) return sendError(response, 403, "FORBIDDEN", "The account does not have an authorized role.");
    request.auth = { id: user.id, email: user.email, roles: [role] };
    next();
  } catch {
    sendError(response, 503, "AUTH_UNAVAILABLE", "Authentication could not be verified.");
  }
};

export const requireRole = (...roles: string[]): RequestHandler => (request, response, next) => {
  if (!request.auth) return sendError(response, 401, "UNAUTHENTICATED", "Authentication is required.");
  if (!request.auth.roles.some((role) => roles.includes(role))) return sendError(response, 403, "FORBIDDEN", "Your role is not authorized for this action.");
  next();
};

// Resource membership is not yet modeled in the Supabase schema. Deny by default
// until a normalized, RLS-protected membership model is introduced.
const requireResourceAccess = (): RequestHandler => (request, response, next) => {
  if (!request.auth) return sendError(response, 401, "UNAUTHENTICATED", "Authentication is required.");
  if (request.auth.roles.includes("superadmin")) return next();
  return sendError(response, 403, "FORBIDDEN", "No verified resource grant exists for this account.");
};

export const requireFarmAccess = (_farmId: string) => requireResourceAccess();
export const requireOrganizationAccess = (_organizationId: string) => requireResourceAccess();
