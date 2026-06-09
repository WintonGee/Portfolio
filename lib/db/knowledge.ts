import { getDb } from "./client";

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  content: string;
  vector_id: string | null;
  updated_at: string;
}

export async function listKnowledge(): Promise<KnowledgeDoc[]> {
  const { results } = await getDb()
    .prepare(
      "SELECT id, title, category, content, vector_id, updated_at FROM knowledge_docs ORDER BY category, id"
    )
    .all<KnowledgeDoc>();
  return results ?? [];
}

export async function getKnowledge(id: string): Promise<KnowledgeDoc | null> {
  return await getDb()
    .prepare(
      "SELECT id, title, category, content, vector_id, updated_at FROM knowledge_docs WHERE id = ?"
    )
    .bind(id)
    .first<KnowledgeDoc>();
}

export async function getKnowledgeByIds(ids: string[]): Promise<KnowledgeDoc[]> {
  if (ids.length === 0) return [];
  const placeholders = ids.map(() => "?").join(",");
  const { results } = await getDb()
    .prepare(
      `SELECT id, title, category, content, vector_id, updated_at FROM knowledge_docs WHERE id IN (${placeholders})`
    )
    .bind(...ids)
    .all<KnowledgeDoc>();
  return results ?? [];
}

export async function upsertKnowledge(
  doc: Omit<KnowledgeDoc, "updated_at"> & { updated_at?: string }
): Promise<void> {
  const updated_at = doc.updated_at ?? new Date().toISOString();
  await getDb()
    .prepare(
      `INSERT INTO knowledge_docs (id, title, category, content, vector_id, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6)
       ON CONFLICT(id) DO UPDATE SET
         title=?2, category=?3, content=?4, vector_id=?5, updated_at=?6`
    )
    .bind(doc.id, doc.title, doc.category, doc.content, doc.vector_id, updated_at)
    .run();
}

export async function deleteKnowledge(id: string): Promise<void> {
  await getDb().prepare("DELETE FROM knowledge_docs WHERE id = ?").bind(id).run();
}
