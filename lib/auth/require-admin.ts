import { getEnv, isDev } from "../db/client";
import { decodeJwtPayload, validateAccessClaims } from "./jwt";
import { verifyJwtSignature } from "./jwks";

export interface AdminResult {
  ok: boolean;
  email?: string;
  status?: number;
  message?: string;
}

/** Verify the caller is the authorized admin.
 *  - In development, bypass (Access is not in front of local dev).
 *  - In production, require a valid Cf-Access-Jwt-Assertion whose email matches ADMIN_EMAIL. */
export async function requireAdmin(request: Request): Promise<AdminResult> {
  const env = getEnv();
  const adminEmail = env.ADMIN_EMAIL;

  if (isDev()) {
    return { ok: true, email: adminEmail };
  }

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) return { ok: false, status: 401, message: "Missing Access token" };

  if (!env.CF_ACCESS_TEAM_DOMAIN || !env.CF_ACCESS_AUD) {
    return { ok: false, status: 503, message: "Access not configured" };
  }

  const sigOk = await verifyJwtSignature(token, env.CF_ACCESS_TEAM_DOMAIN);
  if (!sigOk) return { ok: false, status: 401, message: "Invalid token signature" };

  let payload;
  try {
    payload = decodeJwtPayload(token);
  } catch {
    return { ok: false, status: 401, message: "Malformed token" };
  }

  const result = validateAccessClaims(payload, {
    aud: env.CF_ACCESS_AUD,
    email: adminEmail,
    now: Math.floor(Date.now() / 1000),
  });
  if (!result.ok)
    return { ok: false, status: 403, message: `Forbidden (${result.reason})` };

  return { ok: true, email: payload.email };
}

/** Helper: return a Response if not admin, else null. */
export async function denyIfNotAdmin(request: Request): Promise<Response | null> {
  const r = await requireAdmin(request);
  if (r.ok) return null;
  return new Response(r.message ?? "Unauthorized", { status: r.status ?? 401 });
}
