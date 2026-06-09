import { getDb } from "./client";

export interface ResumeMeta {
  id: string;
  filename: string;
  r2_key: string;
  size: number | null;
  updated_at: string;
}

export async function getResumeMeta(): Promise<ResumeMeta | null> {
  return await getDb()
    .prepare("SELECT * FROM resume_meta WHERE id = 'current'")
    .first<ResumeMeta>();
}

export async function setResumeMeta(meta: {
  filename: string;
  r2_key: string;
  size: number;
}): Promise<void> {
  await getDb()
    .prepare(
      `INSERT INTO resume_meta (id, filename, r2_key, size, updated_at)
       VALUES ('current', ?1, ?2, ?3, ?4)
       ON CONFLICT(id) DO UPDATE SET filename=?1, r2_key=?2, size=?3, updated_at=?4`
    )
    .bind(meta.filename, meta.r2_key, meta.size, new Date().toISOString())
    .run();
}
