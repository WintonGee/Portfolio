import { getDb } from "./client";

export type ContentKey = "about" | "skills" | "timeline";

export async function getContentBlock<T = unknown>(
  key: ContentKey
): Promise<T | null> {
  const row = await getDb()
    .prepare("SELECT data FROM content_blocks WHERE key = ?")
    .bind(key)
    .first<{ data: string }>();
  return row ? (JSON.parse(row.data) as T) : null;
}

export async function setContentBlock(key: ContentKey, data: unknown): Promise<void> {
  await getDb()
    .prepare(
      `INSERT INTO content_blocks (key, data, updated_at) VALUES (?1, ?2, ?3)
       ON CONFLICT(key) DO UPDATE SET data=?2, updated_at=?3`
    )
    .bind(key, JSON.stringify(data), new Date().toISOString())
    .run();
}
