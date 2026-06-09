import { getDb } from "./client";

export interface ProjectRow {
  id: string;
  slug: string;
  data: Record<string, unknown>;
  featured: boolean;
  sort_order: number;
  updated_at: string;
}

interface RawProjectRow {
  id: string;
  slug: string;
  data: string;
  featured: number;
  sort_order: number;
  updated_at: string;
}

function parse(row: RawProjectRow): ProjectRow {
  return {
    id: row.id,
    slug: row.slug,
    data: JSON.parse(row.data),
    featured: row.featured === 1,
    sort_order: row.sort_order,
    updated_at: row.updated_at,
  };
}

export async function listProjects(): Promise<ProjectRow[]> {
  const { results } = await getDb()
    .prepare("SELECT * FROM projects ORDER BY sort_order, id")
    .all<RawProjectRow>();
  return (results ?? []).map(parse);
}

export async function getProjectBySlug(slug: string): Promise<ProjectRow | null> {
  const row = await getDb()
    .prepare("SELECT * FROM projects WHERE slug = ?")
    .bind(slug)
    .first<RawProjectRow>();
  return row ? parse(row) : null;
}

export async function upsertProject(p: {
  id: string;
  slug: string;
  data: Record<string, unknown>;
  featured: boolean;
  sort_order?: number;
}): Promise<void> {
  await getDb()
    .prepare(
      `INSERT INTO projects (id, slug, data, featured, sort_order, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6)
       ON CONFLICT(id) DO UPDATE SET slug=?2, data=?3, featured=?4, sort_order=?5, updated_at=?6`
    )
    .bind(
      p.id,
      p.slug,
      JSON.stringify(p.data),
      p.featured ? 1 : 0,
      p.sort_order ?? 0,
      new Date().toISOString()
    )
    .run();
}

export async function deleteProject(id: string): Promise<void> {
  await getDb().prepare("DELETE FROM projects WHERE id = ?").bind(id).run();
}
