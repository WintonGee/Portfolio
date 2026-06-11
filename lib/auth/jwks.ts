interface Jwk {
  kid: string;
  kty: string;
  n: string;
  e: string;
  alg?: string;
}

// In-memory JWKS cache (per isolate). Refreshed when a kid is missing.
let cache: { domain: string; keys: Jwk[]; fetchedAt: number } | null = null;
let inflight: { domain: string; promise: Promise<Jwk[]> } | null = null;
const TTL_MS = 60 * 60 * 1000;
// Floor between forced refreshes so unknown-kid tokens can't trigger an
// upstream JWKS fetch per request.
const MIN_REFETCH_MS = 30 * 1000;

async function getKeys(teamDomain: string): Promise<Jwk[]> {
  const fresh =
    cache && cache.domain === teamDomain && Date.now() - cache.fetchedAt < TTL_MS;
  if (fresh) return cache!.keys;
  if (inflight && inflight.domain === teamDomain) return inflight.promise;
  const promise = (async () => {
    try {
      const url = `https://${teamDomain}/cdn-cgi/access/certs`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`JWKS fetch failed: ${res.status}`);
      const json = (await res.json()) as { keys: Jwk[] };
      cache = { domain: teamDomain, keys: json.keys, fetchedAt: Date.now() };
      return json.keys;
    } finally {
      inflight = null;
    }
  })();
  inflight = { domain: teamDomain, promise };
  return promise;
}

/** Verify the RS256 signature of `token` against the team's JWKS. */
export async function verifyJwtSignature(
  token: string,
  teamDomain: string
): Promise<boolean> {
  const [headerB64, payloadB64, sigB64] = token.split(".");
  if (!headerB64 || !payloadB64 || !sigB64) return false;
  const header = JSON.parse(
    Buffer.from(headerB64, "base64url").toString("utf8")
  ) as { kid?: string };
  if (!header.kid) return false;

  let keys = await getKeys(teamDomain);
  let jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) {
    if (cache && Date.now() - cache.fetchedAt < MIN_REFETCH_MS) return false;
    cache = null; // force refresh in case keys rotated
    keys = await getKeys(teamDomain);
    jwk = keys.find((k) => k.kid === header.kid);
    if (!jwk) return false;
  }

  const key = await crypto.subtle.importKey(
    "jwk",
    { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: "RS256", ext: true },
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signature = Uint8Array.from(Buffer.from(sigB64, "base64url"));
  return crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, signature, data);
}
