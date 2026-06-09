export interface AccessClaims {
  aud: string | string[];
  email?: string;
  exp: number;
  [k: string]: unknown;
}

export function decodeJwtPayload(token: string): AccessClaims {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Malformed JWT");
  const json = Buffer.from(parts[1], "base64url").toString("utf8");
  return JSON.parse(json) as AccessClaims;
}

export function validateAccessClaims(
  payload: AccessClaims,
  opts: { aud: string; email: string; now: number }
): { ok: boolean; reason?: string } {
  const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!opts.aud || !auds.includes(opts.aud)) return { ok: false, reason: "aud" };
  if (payload.exp <= opts.now) return { ok: false, reason: "expired" };
  if (!payload.email || payload.email.toLowerCase() !== opts.email.toLowerCase())
    return { ok: false, reason: "email" };
  return { ok: true };
}
