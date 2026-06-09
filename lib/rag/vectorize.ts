import { getEnv } from "../db/client";

export const EMBEDDING_MODEL = "@cf/baai/bge-base-en-v1.5";

/** Embed a single text into a 768-dim vector using Workers AI. */
export async function embed(text: string): Promise<number[]> {
  const ai = getEnv().AI;
  const res = (await ai.run(EMBEDDING_MODEL, {
    text,
    pooling: "cls",
  })) as unknown as { data: number[][] };
  const vector = res.data?.[0];
  if (!vector) throw new Error("Embedding model returned no vector");
  return vector;
}

/** Embed `content` and upsert it into Vectorize under `id`. */
export async function upsertVector(
  id: string,
  content: string,
  metadata: { title: string; category: string }
): Promise<void> {
  const values = await embed(content);
  await getEnv().VECTORIZE.upsert([
    { id, values, metadata: { docId: id, ...metadata } },
  ]);
}

export async function deleteVector(id: string): Promise<void> {
  await getEnv().VECTORIZE.deleteByIds([id]);
}

/** Embed the query and return the top-K matching doc ids with scores. */
export async function queryVectors(
  query: string,
  topK = 3
): Promise<Array<{ id: string; score: number }>> {
  const values = await embed(query);
  // Note: we only need ids + scores; the doc text is fetched from D1. Do NOT pass
  // returnMetadata:false — the Vectorize binding rejects the boolean form.
  const res = await getEnv().VECTORIZE.query(values, { topK });
  return (res.matches ?? []).map((m) => ({ id: m.id, score: m.score }));
}
