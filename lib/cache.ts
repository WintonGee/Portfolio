/** Tiny read-through cache over the Workers Cache API, keyed by a synthetic URL.
 *  Used to keep public D1 reads fast; invalidated explicitly on admin writes. */
const ORIGIN = "https://portfolio-cache.internal";

export async function cached<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>
): Promise<T> {
  if (typeof caches === "undefined") return loader();
  const cache = (caches as unknown as { default: Cache }).default;
  const req = new Request(`${ORIGIN}/${key}`);
  const hit = await cache.match(req);
  if (hit) return (await hit.json()) as T;

  const data = await loader();
  await cache.put(
    req,
    new Response(JSON.stringify(data), {
      headers: { "Cache-Control": `public, max-age=${ttlSeconds}` },
    })
  );
  return data;
}

export async function invalidate(key: string): Promise<void> {
  if (typeof caches === "undefined") return;
  const cache = (caches as unknown as { default: Cache }).default;
  await cache.delete(new Request(`${ORIGIN}/${key}`));
}

export const CACHE_KEYS = {
  home: "home-content",
  projects: "projects-list",
  knowledge: "knowledge-list",
} as const;
