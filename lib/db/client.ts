import { getCloudflareContext } from "@opennextjs/cloudflare";

/** Returns the bound Cloudflare env (DB, VECTORIZE, ASSETS_BUCKET, AI, vars). */
export function getEnv(): CloudflareEnv {
  return getCloudflareContext().env;
}

/** Convenience accessor for the D1 database binding. */
export function getDb(): D1Database {
  return getEnv().DB;
}
