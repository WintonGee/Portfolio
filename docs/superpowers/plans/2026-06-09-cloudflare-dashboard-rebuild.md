# Cloudflare-Powered Portfolio Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move all editable portfolio content (chatbot knowledge, resume PDF, site content, projects) out of repo files into Cloudflare storage (D1 + Vectorize + R2), rewrite the chatbot RAG to use Vectorize, and add a Cloudflare Access–gated `/dashboard` for `wintongee@gmail.com` to edit it all live — no rebuild required.

**Architecture:** Stay on Next.js 15 + OpenNext on Workers (refactor in place). D1 is the source of truth for text content; Vectorize holds knowledge embeddings; R2 holds the resume PDF. Public pages become server components that read D1 (with a small Cache-API layer). Admin API routes are protected both by a Cloudflare Access self-hosted application and by server-side JWT verification.

**Tech Stack:** Next.js 15 (App Router), React 19, OpenNext Cloudflare, Workers AI (`@cf/baai/bge-base-en-v1.5`, `@cf/meta/llama-3.1-8b-instruct-fast`), D1, Vectorize, R2, Cloudflare Access, Tailwind, vitest (new, for unit tests), tsx (new, for the seed generator).

**Phasing (each phase is independently shippable/testable):**
- **Phase 0** — Provision Cloudflare resources + wire bindings + types.
- **Phase 1** — Data-access layer + seed existing content into D1/R2.
- **Phase 2** — RAG rewrite (chat via D1+Vectorize) + reindex + delete baked embeddings.
- **Phase 3** — Public render layer reads from D1 (homepage, projects, case study, sources).
- **Phase 4** — Access auth helper (server-side JWT verification).
- **Phase 5** — Admin API routes (knowledge, content, projects, resume, reindex).
- **Phase 6** — Dashboard UI.
- **Phase 7** — Cloudflare Access setup (manual) + bloat removal + dependency audit + deploy.

**Conventions used throughout:**
- Bindings are read via `getCloudflareContext().env` from `@opennextjs/cloudflare`.
- All new server modules live under `lib/`. Admin routes under `app/api/admin/`.
- Every admin route calls `requireAdmin(request)` (Task 4.3) before doing anything.
- Commit after each task with the message shown in its final step.

---

## Phase 0 — Provision resources & wire bindings

> **Pre-flight (verified 2026-06-09):** `npx wrangler whoami` confirms an OAuth token for wintongee@gmail.com (account `8bb39934486d16014e0f95d391c379b4`) with d1/workers write scopes, so provisioning in Task 0.2 can run directly. Before Phase 7, also confirm the deployed Worker actually serves the **custom domain** (Workers → your worker → Settings → Domains & Routes) — Cloudflare Access can only gate the custom hostname, not `*.workers.dev`.

### Task 0.1: Install dev dependencies (vitest, tsx)

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add dev dependencies**

Run:
```bash
npm install -D vitest@^2 tsx@^4
```

- [ ] **Step 2: Add test + seed scripts to package.json**

In `package.json` `"scripts"`, add these entries (keep existing ones):
```json
    "test": "vitest run",
    "test:watch": "vitest",
    "seed:gen": "tsx scripts/generate-seed-sql.ts"
```

- [ ] **Step 3: Create vitest config**

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Verify the runner works (no tests yet = passes)**

Run: `npm test`
Expected: vitest runs and reports "no test files found" or 0 failures (exit 0).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add vitest and tsx for tests and seeding"
```

---

### Task 0.2: Create Cloudflare resources (D1, Vectorize, R2)

**Files:** none (CLI provisioning). Capture the printed `database_id` for the next task.

- [ ] **Step 1: Create the D1 database**

Run: `npx wrangler d1 create portfolio-db`
Expected: prints a config block including `database_id = "<uuid>"`. **Copy that uuid.**

- [ ] **Step 2: Create the Vectorize index (must match the embed model: 768 dims, cosine)**

Run: `npx wrangler vectorize create portfolio-knowledge --dimensions=768 --metric=cosine`
Expected: "✅ Successfully created index 'portfolio-knowledge'".

- [ ] **Step 3: Create a metadata index on `category` (enables filtered queries later)**

Run: `npx wrangler vectorize create-metadata-index portfolio-knowledge --property-name=category --type=string`
Expected: success message. (If it errors that the property is optional, this is non-fatal — proceed.)

- [ ] **Step 4: Create the R2 bucket**

Run: `npx wrangler r2 bucket create portfolio-assets`
Expected: "Created bucket 'portfolio-assets'".

- [ ] **Step 5: No commit** (no files changed). Proceed to 0.3.

---

### Task 0.3: Wire bindings + vars into wrangler.jsonc

**Files:**
- Modify: `wrangler.jsonc`

- [ ] **Step 1: Replace `wrangler.jsonc` with the bindings + vars block**

Replace the whole file with (substitute `<DATABASE_ID>` from Task 0.2 Step 1):
```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "portfolio-website",
  "compatibility_date": "2026-06-05",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "ai": {
    "binding": "AI"
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "portfolio-db",
      "database_id": "<DATABASE_ID>"
    }
  ],
  "vectorize": [
    {
      "binding": "VECTORIZE",
      "index_name": "portfolio-knowledge"
    }
  ],
  "r2_buckets": [
    {
      "binding": "ASSETS_BUCKET",
      "bucket_name": "portfolio-assets"
    }
  ],
  "vars": {
    "ADMIN_EMAIL": "wintongee@gmail.com",
    "CF_ACCESS_TEAM_DOMAIN": "",
    "CF_ACCESS_AUD": "",
    "ENVIRONMENT": "production"
  },
  "observability": {
    "enabled": true
  }
}
```
> `CF_ACCESS_TEAM_DOMAIN` and `CF_ACCESS_AUD` stay empty until Phase 7 (after the Access app exists). Empty AUD means JWT verification will refuse all admin access in production until set — which is the safe default.

- [ ] **Step 2: Regenerate the Cloudflare env types**

Run: `npm run cf-typegen`
Expected: rewrites `cloudflare-env.d.ts`; the `CloudflareEnv` interface now includes `DB`, `VECTORIZE`, `ASSETS_BUCKET`, `AI`, `ADMIN_EMAIL`, `CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD`, `ENVIRONMENT`.

- [ ] **Step 3: Verify types include the new bindings**

Run: `grep -E "DB:|VECTORIZE:|ASSETS_BUCKET:|ADMIN_EMAIL" cloudflare-env.d.ts`
Expected: matches for each binding/var.

- [ ] **Step 4: Commit**

```bash
git add wrangler.jsonc cloudflare-env.d.ts
git commit -m "feat: add D1, Vectorize, R2 bindings and admin vars"
```

---

### Task 0.4: Define the D1 schema and apply it

**Files:**
- Create: `lib/db/schema.sql`

- [ ] **Step 1: Write the schema**

Create `lib/db/schema.sql`:
```sql
-- Chatbot knowledge documents (replaces data/chatbot/**/*.md)
CREATE TABLE IF NOT EXISTS knowledge_docs (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  category    TEXT NOT NULL,
  content     TEXT NOT NULL,
  vector_id   TEXT,
  updated_at  TEXT NOT NULL
);

-- Structured site content sections (about/skills/timeline)
CREATE TABLE IF NOT EXISTS content_blocks (
  key         TEXT PRIMARY KEY,
  data        TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);

-- Projects (card data + case-study detail combined as JSON)
CREATE TABLE IF NOT EXISTS projects (
  id          TEXT PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  data        TEXT NOT NULL,
  featured    INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  updated_at  TEXT NOT NULL
);

-- Resume metadata (binary lives in R2)
CREATE TABLE IF NOT EXISTS resume_meta (
  id          TEXT PRIMARY KEY DEFAULT 'current',
  filename    TEXT NOT NULL,
  r2_key      TEXT NOT NULL,
  size        INTEGER,
  updated_at  TEXT NOT NULL
);
```

- [ ] **Step 2: Apply schema to the LOCAL D1 (for dev)**

Run: `npx wrangler d1 execute portfolio-db --local --file=lib/db/schema.sql`
Expected: "Executed ... commands" success.

- [ ] **Step 3: Apply schema to the REMOTE D1**

Run: `npx wrangler d1 execute portfolio-db --remote --file=lib/db/schema.sql`
Expected: success. (Confirm prompt with `y` if asked.)

- [ ] **Step 4: Verify tables exist remotely**

Run: `npx wrangler d1 execute portfolio-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"`
Expected: lists `knowledge_docs`, `content_blocks`, `projects`, `resume_meta`.

- [ ] **Step 5: Commit**

```bash
git add lib/db/schema.sql
git commit -m "feat: add D1 schema for knowledge, content, projects, resume"
```

---

## Phase 1 — Data-access layer & seed

### Task 1.1: D1 client accessor

**Files:**
- Create: `lib/db/client.ts`

- [ ] **Step 1: Write the accessor**

Create `lib/db/client.ts`:
```ts
import { getCloudflareContext } from "@opennextjs/cloudflare";

/** Returns the bound Cloudflare env (DB, VECTORIZE, ASSETS_BUCKET, AI, vars). */
export function getEnv(): CloudflareEnv {
  return getCloudflareContext().env;
}

/** Convenience accessor for the D1 database binding. */
export function getDb(): D1Database {
  return getEnv().DB;
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors from this file.

- [ ] **Step 3: Commit**

```bash
git add lib/db/client.ts
git commit -m "feat: add D1 client accessor"
```

---

### Task 1.2: Knowledge-doc queries

**Files:**
- Create: `lib/db/knowledge.ts`

- [ ] **Step 1: Write the query module**

Create `lib/db/knowledge.ts`:
```ts
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add lib/db/knowledge.ts
git commit -m "feat: add knowledge_docs D1 queries"
```

---

### Task 1.3: Content-block and project queries

**Files:**
- Create: `lib/db/content.ts`
- Create: `lib/db/projects.ts`

- [ ] **Step 1: Write `lib/db/content.ts`**

```ts
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
```

- [ ] **Step 2: Write `lib/db/projects.ts`**

```ts
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
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add lib/db/content.ts lib/db/projects.ts
git commit -m "feat: add content_blocks and projects D1 queries"
```

---

### Task 1.4: Resume metadata queries

**Files:**
- Create: `lib/db/resume.ts`

- [ ] **Step 1: Write the module**

```ts
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
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit`
Expected: no new errors.
```bash
git add lib/db/resume.ts
git commit -m "feat: add resume_meta D1 queries"
```

---

### Task 1.5: Seed-SQL generator (existing files → SQL)

**Files:**
- Create: `scripts/generate-seed-sql.ts`

- [ ] **Step 1: Write the generator**

Create `scripts/generate-seed-sql.ts`. It imports the existing TS/JSON data modules and reads the markdown files, then emits `seed.sql`:
```ts
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SKILLS_DATA } from "../data/skills-data";
import { STATS_DATA, TECHNOLOGIES } from "../data/about-data";
import { timelineData } from "../data/timeline-data";
import projectsJson from "../data/projects.json";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const now = "2026-06-09T00:00:00.000Z";
const sql: string[] = [];

function q(value: string): string {
  return "'" + value.replace(/'/g, "''") + "'";
}

// --- knowledge_docs from data/chatbot/**/*.md ---
const chatbotDir = path.join(root, "data", "chatbot");
function walk(dir: string): string[] {
  return fs.readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return fs.statSync(full).isDirectory()
      ? walk(full)
      : name.endsWith(".md")
        ? [full]
        : [];
  });
}
for (const file of walk(chatbotDir)) {
  const rel = path.relative(chatbotDir, file).replace(/\\/g, "/"); // e.g. professional/summary.md
  const id = rel.replace(/\.md$/, ""); // professional/summary
  const category = path.dirname(rel).split("/")[0];
  const title = path.basename(rel, ".md");
  const content = fs.readFileSync(file, "utf8");
  sql.push(
    `INSERT INTO knowledge_docs (id, title, category, content, vector_id, updated_at) VALUES (${q(id)}, ${q(title)}, ${q(category)}, ${q(content)}, NULL, ${q(now)});`
  );
}

// --- content_blocks ---
const about = { stats: STATS_DATA, technologies: TECHNOLOGIES };
sql.push(
  `INSERT INTO content_blocks (key, data, updated_at) VALUES ('about', ${q(JSON.stringify(about))}, ${q(now)});`
);
sql.push(
  `INSERT INTO content_blocks (key, data, updated_at) VALUES ('skills', ${q(JSON.stringify(SKILLS_DATA))}, ${q(now)});`
);
sql.push(
  `INSERT INTO content_blocks (key, data, updated_at) VALUES ('timeline', ${q(JSON.stringify(timelineData))}, ${q(now)});`
);

// --- projects (card data from projects.json) ---
(projectsJson as Array<Record<string, unknown>>).forEach((p, i) => {
  const id = String(p.id);
  sql.push(
    `INSERT INTO projects (id, slug, data, featured, sort_order, updated_at) VALUES (${q(id)}, ${q(id)}, ${q(JSON.stringify(p))}, ${p.featured ? 1 : 0}, ${i}, ${q(now)});`
  );
});

fs.writeFileSync(path.join(root, "seed.sql"), sql.join("\n") + "\n");
console.log(`Wrote seed.sql with ${sql.length} statements`);
```
> Note: case-study detail (the rich array in `app/projects/[slug]/page.tsx`) is merged into the project `data` in Task 3.4 via a follow-up migration; v1 seed loads the card data so the homepage works. See Task 3.4 for the case-study merge.

- [ ] **Step 2: Generate seed.sql**

Run: `npm run seed:gen`
Expected: "Wrote seed.sql with N statements" (N ≈ 24 md + 3 content + 3 projects = ~30).

- [ ] **Step 3: Sanity-check the file**

Run: `head -3 seed.sql && wc -l seed.sql`
Expected: valid INSERT statements; line count ≈ statement count.

- [ ] **Step 4: Commit the generator (not seed.sql — it's a build artifact)**

Add `seed.sql` to `.gitignore`:
```bash
echo "seed.sql" >> .gitignore
git add scripts/generate-seed-sql.ts .gitignore
git commit -m "feat: add seed-SQL generator from existing content"
```

---

### Task 1.6: Apply the seed to D1 + upload resume to R2

**Files:** none (CLI). Depends on `seed.sql` from Task 1.5.

- [ ] **Step 1: Seed LOCAL D1**

Run: `npx wrangler d1 execute portfolio-db --local --file=seed.sql`
Expected: "Executed N commands" success.

- [ ] **Step 2: Seed REMOTE D1**

Run: `npx wrangler d1 execute portfolio-db --remote --file=seed.sql`
Expected: success.

- [ ] **Step 3: Verify row counts (remote)**

Run: `npx wrangler d1 execute portfolio-db --remote --command="SELECT (SELECT COUNT(*) FROM knowledge_docs) AS k, (SELECT COUNT(*) FROM content_blocks) AS c, (SELECT COUNT(*) FROM projects) AS p;"`
Expected: `k`≈24, `c`=3, `p`=3.

- [ ] **Step 4: Upload the resume PDF to R2 + record metadata**

```bash
npx wrangler r2 object put portfolio-assets/resume/Winton_Gee_Resume.pdf --file=public/resume/Winton_Gee_Resume.pdf --remote
```
Then record metadata remotely (size in bytes — get it with `wc -c < public/resume/Winton_Gee_Resume.pdf`):
```bash
SIZE=$(wc -c < public/resume/Winton_Gee_Resume.pdf)
npx wrangler d1 execute portfolio-db --remote --command="INSERT INTO resume_meta (id, filename, r2_key, size, updated_at) VALUES ('current','Winton_Gee_Resume.pdf','resume/Winton_Gee_Resume.pdf',$SIZE,'2026-06-09T00:00:00.000Z') ON CONFLICT(id) DO UPDATE SET filename='Winton_Gee_Resume.pdf', r2_key='resume/Winton_Gee_Resume.pdf', size=$SIZE;"
```
Also upload to local R2 for dev:
```bash
npx wrangler r2 object put portfolio-assets/resume/Winton_Gee_Resume.pdf --file=public/resume/Winton_Gee_Resume.pdf --local
npx wrangler d1 execute portfolio-db --local --command="INSERT INTO resume_meta (id, filename, r2_key, size, updated_at) VALUES ('current','Winton_Gee_Resume.pdf','resume/Winton_Gee_Resume.pdf',$SIZE,'2026-06-09T00:00:00.000Z') ON CONFLICT(id) DO UPDATE SET r2_key='resume/Winton_Gee_Resume.pdf';"
```

- [ ] **Step 5: Verify R2 object exists**

Run: `npx wrangler r2 object get portfolio-assets/resume/Winton_Gee_Resume.pdf --remote --file=/tmp/check.pdf && file /tmp/check.pdf`
Expected: "/tmp/check.pdf: PDF document".

- [ ] **Step 6: No commit** (data lives in Cloudflare, not git).

---

## Phase 2 — RAG rewrite

### Task 2.1: Embedding + Vectorize helper

**Files:**
- Create: `lib/rag/vectorize.ts`

- [ ] **Step 1: Write the helper**

Create `lib/rag/vectorize.ts`:
```ts
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
  const res = await getEnv().VECTORIZE.query(values, {
    topK,
    returnMetadata: false,
  });
  return (res.matches ?? []).map((m) => ({ id: m.id, score: m.score }));
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit`
Expected: no new errors.
```bash
git add lib/rag/vectorize.ts
git commit -m "feat: add embedding + Vectorize helper"
```

---

### Task 2.2: Pure RAG context builder (TDD)

**Files:**
- Create: `lib/rag/context.ts`
- Test: `lib/rag/context.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/rag/context.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { buildContext } from "./context";
import type { KnowledgeDoc } from "../db/knowledge";

const doc = (id: string, content: string): KnowledgeDoc => ({
  id,
  title: id,
  category: "professional",
  content,
  vector_id: id,
  updated_at: "2026-06-09T00:00:00.000Z",
});

describe("buildContext", () => {
  it("orders docs by match score and joins their content", () => {
    const docs = [doc("a", "Alpha"), doc("b", "Bravo")];
    const matches = [
      { id: "b", score: 0.9 },
      { id: "a", score: 0.5 },
    ];
    const { context, sources } = buildContext(matches, docs);
    expect(context).toBe("Bravo\n\nAlpha");
    expect(sources.map((s) => s.title)).toEqual(["b", "a"]);
    expect(sources[0].similarity).toBe(0.9);
  });

  it("returns a fallback when there are no matches", () => {
    const { context, sources } = buildContext([], []);
    expect(context).toBe("Portfolio information not available.");
    expect(sources).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/rag/context.test.ts`
Expected: FAIL — "Cannot find module './context'".

- [ ] **Step 3: Implement `lib/rag/context.ts`**

```ts
import type { KnowledgeDoc } from "../db/knowledge";

export interface Source {
  title: string;
  filePath: string;
  similarity: number;
}

/** Given scored matches and the fetched docs, assemble the prompt context
 *  and source list in match order. */
export function buildContext(
  matches: Array<{ id: string; score: number }>,
  docs: KnowledgeDoc[]
): { context: string; sources: Source[] } {
  if (matches.length === 0) {
    return { context: "Portfolio information not available.", sources: [] };
  }
  const byId = new Map(docs.map((d) => [d.id, d]));
  const ordered = matches
    .map((m) => ({ match: m, doc: byId.get(m.id) }))
    .filter((x): x is { match: typeof x.match; doc: KnowledgeDoc } => !!x.doc);

  const context = ordered.map((x) => x.doc.content).join("\n\n");
  const sources = ordered.map((x) => ({
    title: x.doc.title,
    filePath: x.doc.id,
    similarity: x.match.score,
  }));
  return { context, sources };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run lib/rag/context.test.ts`
Expected: PASS (2 passed).

- [ ] **Step 5: Commit**

```bash
git add lib/rag/context.ts lib/rag/context.test.ts
git commit -m "feat: add RAG context builder with tests"
```

---

### Task 2.3: Rewrite the chat route to use D1 + Vectorize

**Files:**
- Modify: `app/api/chat/route.ts` (full replacement)

- [ ] **Step 1: Replace the file**

Replace `app/api/chat/route.ts` entirely:
```ts
import { NextRequest } from "next/server";
import { getEnv } from "../../../lib/db/client";
import { getKnowledgeByIds } from "../../../lib/db/knowledge";
import { queryVectors } from "../../../lib/rag/vectorize";
import { buildContext } from "../../../lib/rag/context";

const CHAT_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";

const SYSTEM_PROMPT = `You are Winton Gee, an AI/ML Engineer currently working at Mercor. You are responding directly to someone asking questions about your work and experience.

IMPORTANT INSTRUCTIONS:
- ONLY use information provided in the context below
- Be direct, concise, and professional
- Get straight to the point - avoid unnecessary pleasantries and filler words
- Use first person ("I", "my", "me") naturally
- Provide specific details when available
- If you don't know something, suggest reaching out via email
- DO NOT make up or assume any information not explicitly provided
- Be honest about what you know and don't know
- Use proper formatting with bullet points, bold text, or paragraphs when appropriate
- Keep responses brief and to the point
- For simple requests (like contact info), provide just the essential information
- If the question is about something not covered in the context, suggest reaching out via email (wintongee@gmail.com) or LinkedIn (https://linkedin.com/in/wintongee) for more details.`;

export async function POST(request: NextRequest) {
  try {
    const { message } = (await request.json()) as { message?: string };
    if (!message) return new Response("Message is required", { status: 400 });

    const ai = getEnv().AI;
    if (!ai) return new Response("AI binding not configured", { status: 500 });

    // Retrieve relevant knowledge: vector search -> D1 fetch -> context.
    let context = "Portfolio information not available.";
    let sources: Array<{ title: string; filePath: string; similarity: number }> = [];
    try {
      const matches = await queryVectors(message, 3);
      const docs = await getKnowledgeByIds(matches.map((m) => m.id));
      ({ context, sources } = buildContext(matches, docs));
    } catch (err) {
      console.error("RAG retrieval failed:", err);
    }

    const userPrompt = `Context about Winton:
${context}

User question: ${message}

Respond as Winton, using only the information provided in the context. Be direct and concise.`;

    const aiStream = (await ai.run(CHAT_MODEL, {
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      stream: true,
    })) as unknown as ReadableStream<Uint8Array>;

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = aiStream.getReader();
        let buffer = "";
        const flushSources = () => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ sources })}\n\n`));
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        };
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const data = trimmed.slice("data:".length).trim();
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.response) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content: parsed.response })}\n\n`)
                  );
                }
              } catch {
                // ignore keep-alive lines
              }
            }
          }
          flushSources();
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ content: "Sorry, I encountered an error. Please try again." })}\n\n`
            )
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors. (`lib/embeddings.ts` is still present but now unused — removed in Task 2.5.)

- [ ] **Step 3: Commit**

```bash
git add app/api/chat/route.ts
git commit -m "feat: rewrite chat route to use D1 + Vectorize RAG"
```

---

### Task 2.4: Reindex endpoint (populate Vectorize from D1)

**Files:**
- Create: `app/api/admin/reindex/route.ts`

> This endpoint is admin-gated in Task 5.x via `requireAdmin`. For now (auth not built yet) it temporarily allows local-dev calls. Task 5.1 adds the guard.

- [ ] **Step 1: Write the route**

Create `app/api/admin/reindex/route.ts`:
```ts
import { NextRequest } from "next/server";
import { listKnowledge, upsertKnowledge } from "../../../../lib/db/knowledge";
import { upsertVector } from "../../../../lib/rag/vectorize";
import { getEnv } from "../../../../lib/db/client";

export async function POST(_request: NextRequest) {
  // Dev-only guard until Task 5.1 wires requireAdmin here.
  if (getEnv().ENVIRONMENT !== "development") {
    return new Response("Reindex disabled outside development", { status: 403 });
  }
  const docs = await listKnowledge();
  let count = 0;
  for (const doc of docs) {
    await upsertVector(doc.id, doc.content, {
      title: doc.title,
      category: doc.category,
    });
    await upsertKnowledge({ ...doc, vector_id: doc.id });
    count++;
  }
  return Response.json({ reindexed: count });
}
```

- [ ] **Step 2: Run the dev server with bindings and reindex**

Run (in one terminal): `npm run preview` (builds with OpenNext and serves with bindings; uses **local** D1/Vectorize/R2 by default).
Then in another terminal: `curl -X POST http://localhost:8788/api/admin/reindex`
Expected: `{"reindexed": 24}` (or however many knowledge docs).
> Note the actual local preview port from the `npm run preview` output and use it.

- [ ] **Step 3: Reindex REMOTE Vectorize**

The remote Vectorize index must also be populated. Deploy first is required for remote bindings, OR run the reindex against remote by temporarily configuring preview with `--remote`. Simplest: defer remote reindex to **after first deploy** in Task 7.5, which calls this endpoint against the deployed URL with `ENVIRONMENT=development` temporarily, OR run a one-off:
```bash
npx wrangler dev --remote --test-scheduled
```
is not applicable here. **Decision:** remote Vectorize is populated in Task 7.5 after deploy. For now, local Vectorize is enough to test the chat flow locally.

- [ ] **Step 4: Verify the chat works locally end-to-end**

With `npm run preview` running and local Vectorize populated, run:
```bash
curl -N -X POST http://localhost:8788/api/chat -H 'Content-Type: application/json' -d '{"message":"Where does Winton work?"}'
```
Expected: an SSE stream whose content mentions Mercor, followed by a `sources` event.

- [ ] **Step 5: Commit**

```bash
git add app/api/admin/reindex/route.ts
git commit -m "feat: add reindex endpoint to populate Vectorize from D1"
```

---

### Task 2.5: Delete the baked embeddings + generation scripts

**Files:**
- Delete: `lib/embeddings.ts` (457KB)
- Delete: `scripts/embed-embeddings.js`
- Delete: `scripts/generate-chatbot-embeddings.js`
- Delete: `data/chatbot-embeddings.json`, `data/chatbot-embeddings-summary.json`
- Modify: `package.json` (drop `prepare-data` from build)

- [ ] **Step 1: Remove the files**

```bash
git rm lib/embeddings.ts scripts/embed-embeddings.js scripts/generate-chatbot-embeddings.js data/chatbot-embeddings.json data/chatbot-embeddings-summary.json
```

- [ ] **Step 2: Update build scripts in `package.json`**

Replace the `prepare-data`, `build`, `preview`, `deploy` scripts with (drop the data-generation step):
```json
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build",
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
```
Delete the `"prepare-data": ...` line entirely.

- [ ] **Step 3: Verify nothing imports the deleted modules**

Run: `grep -rn "lib/embeddings\|embed-embeddings\|generate-chatbot-embeddings\|chatbot-embeddings.json" app lib components scripts data 2>/dev/null`
Expected: no matches.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove baked embeddings and build-time embedding scripts"
```

---

## Phase 3 — Public render layer reads from D1

### Task 3.1: Cache-API content layer

**Files:**
- Create: `lib/cache.ts`

- [ ] **Step 1: Write the cache helper**

Create `lib/cache.ts`:
```ts
/** Tiny read-through cache over the Workers Cache API, keyed by a synthetic URL.
 *  Used to keep public D1 reads fast; invalidated explicitly on admin writes. */
const ORIGIN = "https://portfolio-cache.internal";

export async function cached<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>
): Promise<T> {
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
  const cache = (caches as unknown as { default: Cache }).default;
  await cache.delete(new Request(`${ORIGIN}/${key}`));
}

export const CACHE_KEYS = {
  home: "home-content",
  projects: "projects-list",
} as const;
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit`
Expected: no new errors.
```bash
git add lib/cache.ts
git commit -m "feat: add Cache-API content layer with explicit invalidation"
```

---

### Task 3.2: Server-side content loaders

**Files:**
- Create: `lib/content-loader.ts`

- [ ] **Step 1: Write loaders that wrap D1 reads in the cache**

Create `lib/content-loader.ts`:
```ts
import { cached, CACHE_KEYS } from "./cache";
import { getContentBlock } from "./db/content";
import { listProjects, type ProjectRow } from "./db/projects";
import type { Project } from "@/types/project";

export interface HomeContent {
  about: { stats: unknown; technologies: unknown } | null;
  skills: unknown | null;
  timeline: unknown | null;
}

export async function loadHomeContent(): Promise<HomeContent> {
  return cached(CACHE_KEYS.home, 60, async () => ({
    about: await getContentBlock("about"),
    skills: await getContentBlock("skills"),
    timeline: await getContentBlock("timeline"),
  }));
}

export async function loadProjects(): Promise<Project[]> {
  const rows = await cached<ProjectRow[]>(CACHE_KEYS.projects, 60, listProjects);
  return rows.map((r) => r.data as unknown as Project);
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit`
Expected: no new errors.
```bash
git add lib/content-loader.ts
git commit -m "feat: add cached server-side content loaders"
```

---

### Task 3.3: Make the homepage server-driven (data from D1, look unchanged)

**Files:**
- Create: `app/HomeClient.tsx` (moved client markup)
- Modify: `app/page.tsx` (becomes a server component)
- Modify: `components/ProjectsNew.tsx` (accept `projects` prop)
- Modify: `components/About.tsx` (accept `technologies` + `skills` props)
- Modify: `components/EducationTimeline.tsx` (accept `timeline` prop)

> The goal is byte-for-byte identical visuals; only the data source changes. Components keep their markup; they now receive data via props instead of importing `data/*`.

- [ ] **Step 1: Add prop to `ProjectsNew`**

In `components/ProjectsNew.tsx`, change the component to accept projects via props instead of `getAllProjects()`. Replace the import and the call site:
- Remove `import { getAllProjects } from "@/lib/content";`
- Change the default export signature to `export default function ProjectsNew({ projects }: { projects: Project[] })` and use `projects` where `getAllProjects()` was called.

(If `getAllProjects()` is called inside the component body, replace that local with the `projects` prop. Keep all JSX unchanged.)

- [ ] **Step 2: Add props to `About.tsx`**

In `components/About.tsx`:
- Remove `import { TECHNOLOGIES } from "../data/about-data";` and `import { getSkillData } from "../data/skills-data";`
- Change `TechStackSection` to `export function TechStackSection({ technologies, skills }: { technologies: Record<string, any[]>; skills: Record<string, any> })`.
- Replace `Object.entries(TECHNOLOGIES)` with `Object.entries(technologies)`.
- Replace `getSkillData(name)` calls with `skills[name]` lookups (the skills block is the `SKILLS_DATA` record keyed by name).

- [ ] **Step 3: Add prop to `EducationTimeline.tsx`**

In `components/EducationTimeline.tsx`, replace its `import { timelineData } from "../data/timeline-data"` with a `timeline` prop: `export default function EducationTimeline({ timeline }: { timeline: TimelineItem[] })`, and use `timeline` where `timelineData` was used. `JourneySection` in `About.tsx` must pass `timeline` through, so also give `JourneySection` a `timeline` prop and forward it.

- [ ] **Step 4: Create `app/HomeClient.tsx`**

Move the entire current JSX body of `app/page.tsx` into a new client component that takes data props:
```tsx
"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { JourneySection, TechStackSection } from "@/components/About";
import ProjectsNew from "@/components/ProjectsNew";
import Chatbot from "@/components/Chatbot";
import CollaborationCTA from "@/components/CollaborationCTA";
import FloatingChatButton from "@/components/FloatingChatButton";
import Footer from "@/components/Footer";
import type { Project } from "@/types/project";
import type { TimelineItem } from "@/types/timeline";

interface Props {
  projects: Project[];
  technologies: Record<string, any[]>;
  skills: Record<string, any>;
  timeline: TimelineItem[];
}

export default function HomeClient({ projects, technologies, skills, timeline }: Props) {
  return (
    // PASTE the exact <main>...</main> JSX from the current app/page.tsx here,
    // changing only:
    //   <JourneySection />            -> <JourneySection timeline={timeline} />
    //   <TechStackSection />          -> <TechStackSection technologies={technologies} skills={skills} />
    //   <ProjectsNew />               -> <ProjectsNew projects={projects} />
    // Everything else (sections, motion, classNames) stays identical.
  );
}
```
> The engineer must paste the existing `<main>` markup from `app/page.tsx` verbatim, applying only the three prop changes listed.

- [ ] **Step 5: Replace `app/page.tsx` with a server component**

> `force-dynamic` is **required**: a plain async server component is prerendered during `next build`, where `getCloudflareContext().env.DB` and `caches.default` don't exist (no request context) and the build throws. `force-dynamic` makes the page render per-request instead.

```tsx
import HomeClient from "./HomeClient";
import { loadHomeContent, loadProjects } from "@/lib/content-loader";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [content, projects] = await Promise.all([loadHomeContent(), loadProjects()]);
  const about = (content.about ?? { technologies: {} }) as { technologies: Record<string, any[]> };
  return (
    <HomeClient
      projects={projects}
      technologies={about.technologies ?? {}}
      skills={(content.skills ?? {}) as Record<string, any>}
      timeline={(content.timeline ?? []) as any[]}
    />
  );
}
```

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors. Fix any prop-type mismatches surfaced.

- [ ] **Step 7: Verify the homepage renders unchanged**

With `npm run preview` running (local D1 seeded), open the local preview URL in a browser. Confirm: timeline, tech stack (with hover cards), and the 3 project cards all render exactly as before.

- [ ] **Step 8: Commit**

```bash
git add app/page.tsx app/HomeClient.tsx components/ProjectsNew.tsx components/About.tsx components/EducationTimeline.tsx
git commit -m "feat: drive homepage content from D1 (look unchanged)"
```

---

### Task 3.4: Consolidate project case-study data into D1

**Files:**
- Create: `scripts/merge-casestudy.ts` (one-off generator that emits an UPDATE SQL)
- Modify: `app/projects/[slug]/page.tsx` (read from D1)
- Modify: `lib/content.ts` (D1-backed or removed)

- [ ] **Step 1: Write a one-off merge generator**

The rich case-study array currently lives inline in `app/projects/[slug]/page.tsx`. Create `scripts/merge-casestudy.ts` that imports that array (export it first — see Step 2) and emits `merge.sql` updating each project's `data` JSON to include a `caseStudy` field:
```ts
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { caseStudies } from "../app/projects/[slug]/case-studies";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const sql = caseStudies
  .map((cs) => {
    const json = JSON.stringify(cs).replace(/'/g, "''");
    // Merge caseStudy into existing data JSON via json_set.
    return `UPDATE projects SET data = json_set(data, '$.caseStudy', json('${json}')) WHERE slug = '${cs.slug}';`;
  })
  .join("\n");
fs.writeFileSync(path.join(root, "merge.sql"), sql + "\n");
console.log(`Wrote merge.sql for ${caseStudies.length} case studies`);
```

- [ ] **Step 2: Extract the case-study array into a module**

Create `app/projects/[slug]/case-studies.ts` containing the current inline `projects` array from `app/projects/[slug]/page.tsx`, exported as `export const caseStudies = [ ... ] as const;` (move the array verbatim; keep the `slug` field on each).

- [ ] **Step 3: Generate and apply the merge**

```bash
npx tsx scripts/merge-casestudy.ts
npx wrangler d1 execute portfolio-db --local --file=merge.sql
npx wrangler d1 execute portfolio-db --remote --file=merge.sql
```
Expected: 3 rows updated each.

- [ ] **Step 4: Update the case-study page to read from D1**

Replace `app/projects/[slug]/page.tsx`:
> Like the homepage, this page reads D1 at request time, so it must be `force-dynamic` (no build-time prerender / no `generateStaticParams` hitting D1).

```tsx
import { notFound } from "next/navigation";
import ProjectCaseStudyClient from "./ProjectCaseStudyClient";
import { getProjectBySlug } from "@/lib/db/projects";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectCaseStudy({ params }: Props) {
  const { slug } = await params;
  const row = await getProjectBySlug(slug);
  const caseStudy = (row?.data as { caseStudy?: unknown })?.caseStudy;
  if (!caseStudy) notFound();
  return <ProjectCaseStudyClient project={caseStudy as any} />;
}
```
> `generateStaticParams` is intentionally removed: with `force-dynamic`, slugs render on demand and we avoid reading D1 during `next build`.

- [ ] **Step 5: Make `lib/content.ts` D1-backed (or delete if unused)**

After Task 3.3, `ProjectsNew` no longer imports `getAllProjects`. Check remaining usages:
Run: `grep -rn "lib/content\"" app components lib`
- If no other file imports it, delete it: `git rm lib/content.ts`.
- If something still imports `getAllProjects`/etc., reimplement those functions on top of `listProjects()` from `lib/db/projects.ts` (async), updating callers to await.

- [ ] **Step 6: Verify case-study pages render from D1**

With `npm run preview` running, visit `/projects/foodmanager`, `/projects/cochat`, `/projects/paperinvoice`. Confirm each renders the full case study identically to before.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: consolidate project case-study data into D1"
```

---

### Task 3.5: Resume download route (stream from R2) + chatbot-sources from D1

**Files:**
- Create: `app/resume/route.ts`
- Modify: `app/api/chatbot-sources/route.ts` (read from D1)
- Delete: `scripts/generate-chatbot-sources.js`, `lib/chatbot-sources.ts`
- Update: resume links in components to point at `/resume`

- [ ] **Step 1: Write the resume route**

Create `app/resume/route.ts`:
```ts
import { getEnv } from "../../lib/db/client";
import { getResumeMeta } from "../../lib/db/resume";

export async function GET() {
  const meta = await getResumeMeta();
  if (!meta) return new Response("Resume not found", { status: 404 });
  const obj = await getEnv().ASSETS_BUCKET.get(meta.r2_key);
  if (!obj) return new Response("Resume file missing", { status: 404 });
  return new Response(obj.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${meta.filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
```

- [ ] **Step 2: Repoint resume links**

Run: `grep -rn "resume/Winton_Gee_Resume.pdf\|/resume/" app components`
For each link to the static PDF, change the `href` to `/resume`. (Keep button text/styling.)

- [ ] **Step 3: Rewrite chatbot-sources API to read D1**

Replace `app/api/chatbot-sources/route.ts`:
```ts
import { NextResponse } from "next/server";
import { listKnowledge } from "../../../lib/db/knowledge";

export async function GET() {
  const docs = await listKnowledge();
  const sources = docs.map((d) => ({
    path: d.id,
    content: d.content,
    title: d.title,
    category: d.category,
    lastModified: d.updated_at,
    size: d.content.length,
    lines: d.content.split("\n").length,
    words: d.content.trim().split(/\s+/).length,
    description: "",
    tags: [d.category],
  }));
  return NextResponse.json(sources);
}
```

- [ ] **Step 4: Check the sources page consumes the API (not the static module)**

Run: `grep -rn "lib/chatbot-sources\|CHATBOT_SOURCES" app components`
- If `app/chatbot-sources/page.tsx` imports `CHATBOT_SOURCES` directly, change it to `fetch("/api/chatbot-sources")` in a client effect (or make the page a server component that calls `listKnowledge()`).
- Then delete the generated module + script:
```bash
git rm lib/chatbot-sources.ts scripts/generate-chatbot-sources.js
```

- [ ] **Step 5: Typecheck + verify**

Run: `npx tsc --noEmit` (expect no errors).
With `npm run preview` running: visit `/resume` (PDF loads), `/chatbot-sources` (lists docs), and `/api/chatbot-sources` (JSON array).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: serve resume from R2 and chatbot-sources from D1"
```

---

## Phase 4 — Auth (Cloudflare Access)

### Task 4.1: JWT parsing + claim validation (TDD)

**Files:**
- Create: `lib/auth/jwt.ts`
- Test: `lib/auth/jwt.test.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/auth/jwt.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { decodeJwtPayload, validateAccessClaims } from "./jwt";

function b64url(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj)).toString("base64url");
}

describe("decodeJwtPayload", () => {
  it("decodes the payload segment", () => {
    const token = `x.${b64url({ email: "a@b.com", exp: 99 })}.y`;
    expect(decodeJwtPayload(token)).toEqual({ email: "a@b.com", exp: 99 });
  });
  it("throws on malformed tokens", () => {
    expect(() => decodeJwtPayload("nope")).toThrow();
  });
});

describe("validateAccessClaims", () => {
  const base = {
    aud: ["APP_AUD"],
    email: "wintongee@gmail.com",
    exp: 2000,
  };
  const opts = { aud: "APP_AUD", email: "wintongee@gmail.com", now: 1000 };

  it("accepts a valid payload", () => {
    expect(validateAccessClaims(base, opts).ok).toBe(true);
  });
  it("rejects a wrong email", () => {
    expect(validateAccessClaims({ ...base, email: "evil@x.com" }, opts).ok).toBe(false);
  });
  it("rejects a wrong audience", () => {
    expect(validateAccessClaims({ ...base, aud: ["OTHER"] }, opts).ok).toBe(false);
  });
  it("rejects an expired token", () => {
    expect(validateAccessClaims({ ...base, exp: 500 }, opts).ok).toBe(false);
  });
  it("accepts a string aud equal to the app aud", () => {
    expect(validateAccessClaims({ ...base, aud: "APP_AUD" }, opts).ok).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run lib/auth/jwt.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/auth/jwt.ts`**

```ts
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
```
> Note: `Buffer` is available on the Workers runtime with `nodejs_compat` (already enabled). The unit tests run under Node, where `Buffer` is native.

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run lib/auth/jwt.test.ts`
Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
git add lib/auth/jwt.ts lib/auth/jwt.test.ts
git commit -m "feat: add Access JWT parsing + claim validation with tests"
```

---

### Task 4.2: JWKS signature verification

**Files:**
- Create: `lib/auth/jwks.ts`

- [ ] **Step 1: Write the verifier (WebCrypto RS256)**

Create `lib/auth/jwks.ts`:
```ts
interface Jwk {
  kid: string;
  kty: string;
  n: string;
  e: string;
  alg?: string;
}

// In-memory JWKS cache (per isolate). Refreshed when a kid is missing.
let cache: { domain: string; keys: Jwk[]; fetchedAt: number } | null = null;
const TTL_MS = 60 * 60 * 1000;

async function getKeys(teamDomain: string): Promise<Jwk[]> {
  const fresh = cache && cache.domain === teamDomain && Date.now() - cache.fetchedAt < TTL_MS;
  if (fresh) return cache!.keys;
  const url = `https://${teamDomain}/cdn-cgi/access/certs`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`JWKS fetch failed: ${res.status}`);
  const json = (await res.json()) as { keys: Jwk[] };
  cache = { domain: teamDomain, keys: json.keys, fetchedAt: Date.now() };
  return json.keys;
}

/** Verify the RS256 signature of `token` against the team's JWKS. */
export async function verifyJwtSignature(
  token: string,
  teamDomain: string
): Promise<boolean> {
  const [headerB64, payloadB64, sigB64] = token.split(".");
  if (!headerB64 || !payloadB64 || !sigB64) return false;
  const header = JSON.parse(Buffer.from(headerB64, "base64url").toString("utf8")) as {
    kid?: string;
  };
  if (!header.kid) return false;

  let keys = await getKeys(teamDomain);
  let jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) {
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
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit`
Expected: no new errors.
```bash
git add lib/auth/jwks.ts
git commit -m "feat: add JWKS RS256 signature verification for Access tokens"
```

---

### Task 4.3: `requireAdmin` guard

**Files:**
- Create: `lib/auth/require-admin.ts`

- [ ] **Step 1: Write the guard**

Create `lib/auth/require-admin.ts`:
```ts
import { getEnv } from "../db/client";
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

  if (env.ENVIRONMENT === "development") {
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
  if (!result.ok) return { ok: false, status: 403, message: `Forbidden (${result.reason})` };

  return { ok: true, email: payload.email };
}

/** Helper: return a Response if not admin, else null. */
export async function denyIfNotAdmin(request: Request): Promise<Response | null> {
  const r = await requireAdmin(request);
  if (r.ok) return null;
  return new Response(r.message ?? "Unauthorized", { status: r.status ?? 401 });
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit`
Expected: no new errors.
```bash
git add lib/auth/require-admin.ts
git commit -m "feat: add requireAdmin guard (Access JWT + dev bypass)"
```

---

## Phase 5 — Admin API routes

### Task 5.1: Guard the reindex route

**Files:**
- Modify: `app/api/admin/reindex/route.ts`

- [ ] **Step 1: Replace the dev-only guard with `requireAdmin`**

Replace the guard block in `app/api/admin/reindex/route.ts`:
```ts
import { NextRequest } from "next/server";
import { listKnowledge, upsertKnowledge } from "../../../../lib/db/knowledge";
import { upsertVector } from "../../../../lib/rag/vectorize";
import { denyIfNotAdmin } from "../../../../lib/auth/require-admin";

export async function POST(request: NextRequest) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;

  const docs = await listKnowledge();
  let count = 0;
  for (const doc of docs) {
    await upsertVector(doc.id, doc.content, { title: doc.title, category: doc.category });
    await upsertKnowledge({ ...doc, vector_id: doc.id });
    count++;
  }
  return Response.json({ reindexed: count });
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit`
Expected: no new errors.
```bash
git add app/api/admin/reindex/route.ts
git commit -m "feat: protect reindex route with requireAdmin"
```

---

### Task 5.2: Knowledge admin routes (list/create/update/delete + re-embed)

**Files:**
- Create: `app/api/admin/knowledge/route.ts`
- Create: `app/api/admin/knowledge/[id]/route.ts`

- [ ] **Step 1: Write list + create/update route**

Create `app/api/admin/knowledge/route.ts`:
```ts
import { NextRequest } from "next/server";
import { denyIfNotAdmin } from "../../../../lib/auth/require-admin";
import { listKnowledge, upsertKnowledge } from "../../../../lib/db/knowledge";
import { upsertVector } from "../../../../lib/rag/vectorize";

export async function GET(request: NextRequest) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;
  return Response.json(await listKnowledge());
}

export async function POST(request: NextRequest) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;

  const body = (await request.json()) as {
    id?: string;
    title?: string;
    category?: string;
    content?: string;
  };
  if (!body.id || !body.title || !body.category || !body.content) {
    return new Response("id, title, category, content are required", { status: 400 });
  }

  await upsertKnowledge({
    id: body.id,
    title: body.title,
    category: body.category,
    content: body.content,
    vector_id: body.id,
  });
  // Re-embed into Vectorize so chat reflects the edit immediately.
  await upsertVector(body.id, body.content, { title: body.title, category: body.category });

  return Response.json({ ok: true, id: body.id });
}
```

- [ ] **Step 2: Write get-one + delete route**

Create `app/api/admin/knowledge/[id]/route.ts`:
```ts
import { NextRequest } from "next/server";
import { denyIfNotAdmin } from "../../../../../lib/auth/require-admin";
import { getKnowledge, deleteKnowledge } from "../../../../../lib/db/knowledge";
import { deleteVector } from "../../../../../lib/rag/vectorize";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, ctx: Ctx) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  const doc = await getKnowledge(decodeURIComponent(id));
  if (!doc) return new Response("Not found", { status: 404 });
  return Response.json(doc);
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  const realId = decodeURIComponent(id);
  await deleteKnowledge(realId);
  await deleteVector(realId);
  return Response.json({ ok: true });
}
```
> The knowledge `id` is a path like `professional/summary` which contains a slash; the dashboard must URL-encode it before calling this route. Because the slash creates nested route segments, the dashboard will instead call DELETE on `/api/admin/knowledge?id=<encoded>` — see Step 3 for the query-based variant that avoids the slash problem.

- [ ] **Step 3: Add query-param delete/get to the collection route (handles slashed ids)**

Since knowledge ids contain `/`, the `[id]` dynamic segment can't represent them. Add `DELETE` (and a single-`GET` via `?id=`) to `app/api/admin/knowledge/route.ts` instead, and treat the `[id]` route as unused (delete it):
```bash
git rm app/api/admin/knowledge/[id]/route.ts 2>/dev/null || true
```
Append to `app/api/admin/knowledge/route.ts`:
```ts
import { getKnowledge, deleteKnowledge } from "../../../../lib/db/knowledge";
import { deleteVector } from "../../../../lib/rag/vectorize";

export async function DELETE(request: NextRequest) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return new Response("id query param required", { status: 400 });
  await deleteKnowledge(id);
  await deleteVector(id);
  return Response.json({ ok: true });
}
```
> Keep imports de-duplicated at the top of the file (merge the new imports with existing ones). Remove the duplicate `getKnowledge` import if unused.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Verify locally (dev bypass active)**

With `npm run preview` running (ENVIRONMENT defaults to production in wrangler vars — temporarily set `"ENVIRONMENT": "development"` in `wrangler.jsonc` vars for local testing, then revert before deploy):
```bash
curl http://localhost:8788/api/admin/knowledge | head
curl -X POST http://localhost:8788/api/admin/knowledge -H 'Content-Type: application/json' \
  -d '{"id":"test/hello","title":"Hello","category":"test","content":"# Hello world"}'
curl "http://localhost:8788/api/admin/knowledge?id=test/hello" -X DELETE
```
Expected: list returns JSON; POST returns `{ok:true}`; DELETE returns `{ok:true}`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add knowledge admin routes with re-embed on save"
```

---

### Task 5.3: Content + projects + resume admin routes

**Files:**
- Create: `app/api/admin/content/[key]/route.ts`
- Create: `app/api/admin/projects/route.ts`
- Create: `app/api/admin/resume/route.ts`

- [ ] **Step 1: Content route (GET/PUT by key, with cache invalidation)**

Create `app/api/admin/content/[key]/route.ts`:
```ts
import { NextRequest } from "next/server";
import { denyIfNotAdmin } from "../../../../../lib/auth/require-admin";
import { getContentBlock, setContentBlock, type ContentKey } from "../../../../../lib/db/content";
import { invalidate, CACHE_KEYS } from "../../../../../lib/cache";

const VALID: ContentKey[] = ["about", "skills", "timeline"];
interface Ctx { params: Promise<{ key: string }>; }

export async function GET(request: NextRequest, ctx: Ctx) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;
  const { key } = await ctx.params;
  if (!VALID.includes(key as ContentKey)) return new Response("Bad key", { status: 400 });
  return Response.json(await getContentBlock(key as ContentKey));
}

export async function PUT(request: NextRequest, ctx: Ctx) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;
  const { key } = await ctx.params;
  if (!VALID.includes(key as ContentKey)) return new Response("Bad key", { status: 400 });
  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  await setContentBlock(key as ContentKey, data);
  await invalidate(CACHE_KEYS.home);
  return Response.json({ ok: true });
}
```

- [ ] **Step 2: Projects route (GET list, POST upsert, DELETE by id)**

Create `app/api/admin/projects/route.ts`:
```ts
import { NextRequest } from "next/server";
import { denyIfNotAdmin } from "../../../../lib/auth/require-admin";
import { listProjects, upsertProject, deleteProject } from "../../../../lib/db/projects";
import { invalidate, CACHE_KEYS } from "../../../../lib/cache";

export async function GET(request: NextRequest) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;
  return Response.json(await listProjects());
}

export async function POST(request: NextRequest) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;
  const body = (await request.json()) as {
    id?: string;
    slug?: string;
    data?: Record<string, unknown>;
    featured?: boolean;
    sort_order?: number;
  };
  if (!body.id || !body.slug || !body.data) {
    return new Response("id, slug, data required", { status: 400 });
  }
  await upsertProject({
    id: body.id,
    slug: body.slug,
    data: body.data,
    featured: !!body.featured,
    sort_order: body.sort_order ?? 0,
  });
  await invalidate(CACHE_KEYS.projects);
  return Response.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return new Response("id required", { status: 400 });
  await deleteProject(id);
  await invalidate(CACHE_KEYS.projects);
  return Response.json({ ok: true });
}
```

- [ ] **Step 3: Resume route (GET meta, POST multipart upload to R2)**

Create `app/api/admin/resume/route.ts`:
```ts
import { NextRequest } from "next/server";
import { denyIfNotAdmin } from "../../../../lib/auth/require-admin";
import { getEnv } from "../../../../lib/db/client";
import { getResumeMeta, setResumeMeta } from "../../../../lib/db/resume";

export async function GET(request: NextRequest) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;
  return Response.json(await getResumeMeta());
}

export async function POST(request: NextRequest) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return new Response("file field required", { status: 400 });
  if (file.type !== "application/pdf") return new Response("PDF only", { status: 400 });

  const key = "resume/Winton_Gee_Resume.pdf";
  const bytes = await file.arrayBuffer();
  await getEnv().ASSETS_BUCKET.put(key, bytes, {
    httpMetadata: { contentType: "application/pdf" },
  });
  await setResumeMeta({ filename: file.name, r2_key: key, size: bytes.byteLength });
  return Response.json({ ok: true, size: bytes.byteLength });
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Verify content/projects/resume routes locally (dev bypass)**

With `npm run preview` running and `ENVIRONMENT` temporarily `development`:
```bash
curl http://localhost:8788/api/admin/content/about | head
curl http://localhost:8788/api/admin/projects | head
curl http://localhost:8788/api/admin/resume
```
Expected: JSON for each.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add content, projects, resume admin routes"
```

---

## Phase 6 — Dashboard UI

### Task 6.1: Dashboard shell + tabs

**Files:**
- Create: `app/dashboard/page.tsx`
- Create: `app/dashboard/DashboardClient.tsx`

- [ ] **Step 1: Server page (reads admin email from Access header)**

Create `app/dashboard/page.tsx`:
```tsx
import { headers } from "next/headers";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const h = await headers();
  const email = h.get("cf-access-authenticated-user-email") ?? "developer (local)";
  return <DashboardClient email={email} />;
}
```

- [ ] **Step 2: Client shell with four tabs**

Create `app/dashboard/DashboardClient.tsx`:
```tsx
"use client";

import { useState } from "react";
import KnowledgeTab from "./KnowledgeTab";
import ContentTab from "./ContentTab";
import ProjectsTab from "./ProjectsTab";
import ResumeTab from "./ResumeTab";

const TABS = ["Knowledge", "Resume", "Site Content", "Projects"] as const;
type Tab = (typeof TABS)[number];

export default function DashboardClient({ email }: { email: string }) {
  const [tab, setTab] = useState<Tab>("Knowledge");
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-beige to-brand-beige-light p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-brand-text">Dashboard</h1>
          <span className="text-sm text-brand-text/70">{email}</span>
        </header>
        <nav className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                tab === t
                  ? "bg-brand-primary text-white"
                  : "bg-white/60 text-brand-text hover:bg-white"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-organic-lg">
          {tab === "Knowledge" && <KnowledgeTab />}
          {tab === "Resume" && <ResumeTab />}
          {tab === "Site Content" && <ContentTab />}
          {tab === "Projects" && <ProjectsTab />}
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Create placeholder tab files so it compiles**

Create four minimal stubs (replaced in 6.2–6.5):
`app/dashboard/KnowledgeTab.tsx`, `ContentTab.tsx`, `ProjectsTab.tsx`, `ResumeTab.tsx`, each:
```tsx
"use client";
export default function Tab() {
  return <div className="text-brand-text/70">Coming up next.</div>;
}
```
(Name each function for clarity but the default export is what matters.)

- [ ] **Step 4: Typecheck + verify the shell renders**

Run: `npx tsc --noEmit` (no errors).
With `npm run preview`, visit `/dashboard` — four tabs switch correctly.

- [ ] **Step 5: Commit**

```bash
git add app/dashboard
git commit -m "feat: add dashboard shell with tab navigation"
```

---

### Task 6.2: Knowledge tab (list/edit/create/delete)

**Files:**
- Modify: `app/dashboard/KnowledgeTab.tsx`

- [ ] **Step 1: Implement the tab**

Replace `app/dashboard/KnowledgeTab.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";

interface Doc {
  id: string;
  title: string;
  category: string;
  content: string;
}

export default function KnowledgeTab() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [editing, setEditing] = useState<Doc | null>(null);
  const [status, setStatus] = useState("");

  async function load() {
    const res = await fetch("/api/admin/knowledge");
    if (res.ok) setDocs(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    setStatus("Saving…");
    const res = await fetch("/api/admin/knowledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setStatus(res.ok ? "Saved + re-embedded." : `Error ${res.status}`);
    if (res.ok) {
      setEditing(null);
      load();
    }
  }

  async function remove(id: string) {
    setStatus("Deleting…");
    const res = await fetch(`/api/admin/knowledge?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setStatus(res.ok ? "Deleted." : `Error ${res.status}`);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-brand-text">Chatbot Knowledge</h2>
        <button
          className="px-3 py-1.5 rounded-lg bg-brand-primary text-white text-sm"
          onClick={() =>
            setEditing({ id: "", title: "", category: "professional", content: "" })
          }
        >
          + New doc
        </button>
      </div>

      {editing ? (
        <div className="space-y-3">
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="id (e.g. professional/summary)"
            value={editing.id}
            onChange={(e) => setEditing({ ...editing, id: e.target.value })}
          />
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="title"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="category"
              value={editing.category}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
            />
          </div>
          <textarea
            className="w-full border rounded-lg px-3 py-2 text-sm font-mono h-64"
            placeholder="# Markdown content"
            value={editing.content}
            onChange={(e) => setEditing({ ...editing, content: e.target.value })}
          />
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm" onClick={save}>
              Save
            </button>
            <button className="px-4 py-2 rounded-lg bg-gray-200 text-sm" onClick={() => setEditing(null)}>
              Cancel
            </button>
            <span className="text-sm text-brand-text/70 self-center">{status}</span>
          </div>
        </div>
      ) : (
        <ul className="divide-y">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-brand-text">{d.title}</p>
                <p className="text-xs text-brand-text/60">{d.id}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-sm text-brand-primary" onClick={() => setEditing(d)}>
                  Edit
                </button>
                <button className="text-sm text-red-600" onClick={() => remove(d.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!editing && status && <p className="text-sm text-brand-text/70">{status}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + verify**

Run: `npx tsc --noEmit` (no errors).
With `npm run preview` (ENVIRONMENT=development), open `/dashboard` → Knowledge: list shows docs; edit one and save → "Saved + re-embedded."; create a temp doc and delete it.

- [ ] **Step 3: Verify the edit reaches the chatbot**

Edit a knowledge doc (e.g. change a detail in `professional/summary`), save, then in the chatbot ask a question about that detail. Confirm the answer reflects the edit (no rebuild).

- [ ] **Step 4: Commit**

```bash
git add app/dashboard/KnowledgeTab.tsx
git commit -m "feat: knowledge dashboard tab with live re-embed"
```

---

### Task 6.3: Resume tab (preview + upload)

**Files:**
- Modify: `app/dashboard/ResumeTab.tsx`

- [ ] **Step 1: Implement**

Replace `app/dashboard/ResumeTab.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";

interface Meta {
  filename: string;
  size: number | null;
  updated_at: string;
}

export default function ResumeTab() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [status, setStatus] = useState("");

  async function load() {
    const res = await fetch("/api/admin/resume");
    if (res.ok) setMeta(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("Uploading…");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/resume", { method: "POST", body: form });
    setStatus(res.ok ? "Uploaded." : `Error ${res.status}`);
    load();
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-brand-text">Resume</h2>
      {meta && (
        <p className="text-sm text-brand-text/70">
          Current: {meta.filename} ({meta.size ?? "?"} bytes) — updated {meta.updated_at}
        </p>
      )}
      {/* No <iframe>: next.config.mjs sets a global `frame-ancestors 'none'` CSP +
          X-Frame-Options: DENY, which blocks framing /resume even same-origin.
          Link out instead. */}
      <a
        href="/resume"
        target="_blank"
        rel="noreferrer"
        className="inline-block px-4 py-2 rounded-lg bg-white/60 text-brand-text text-sm hover:bg-white"
      >
        Open current resume ↗
      </a>
      <br />
      <label className="inline-block">
        <span className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm cursor-pointer">
          Upload new PDF
        </span>
        <input type="file" accept="application/pdf" className="hidden" onChange={upload} />
      </label>
      <span className="text-sm text-brand-text/70 ml-3">{status}</span>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + verify**

Run: `npx tsc --noEmit` (no errors).
With `npm run preview`: Resume tab shows current metadata + an "Open current resume" link (opens the PDF in a new tab); upload a different PDF and confirm `/resume` reflects it after reload.

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/ResumeTab.tsx
git commit -m "feat: resume dashboard tab with R2 upload"
```

---

### Task 6.4: Site-content tab (form + raw JSON)

**Files:**
- Modify: `app/dashboard/ContentTab.tsx`

- [ ] **Step 1: Implement a JSON editor per content key**

Replace `app/dashboard/ContentTab.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";

const KEYS = ["about", "skills", "timeline"] as const;
type Key = (typeof KEYS)[number];

export default function ContentTab() {
  const [key, setKey] = useState<Key>("about");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  async function load(k: Key) {
    setStatus("Loading…");
    const res = await fetch(`/api/admin/content/${k}`);
    if (res.ok) {
      setText(JSON.stringify(await res.json(), null, 2));
      setStatus("");
    } else {
      setStatus(`Error ${res.status}`);
    }
  }
  useEffect(() => {
    load(key);
  }, [key]);

  async function save() {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setStatus("Invalid JSON — fix before saving.");
      return;
    }
    setStatus("Saving…");
    const res = await fetch(`/api/admin/content/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });
    setStatus(res.ok ? "Saved." : `Error ${res.status}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {KEYS.map((k) => (
          <button
            key={k}
            onClick={() => setKey(k)}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              key === k ? "bg-brand-primary text-white" : "bg-white/60"
            }`}
          >
            {k}
          </button>
        ))}
      </div>
      <textarea
        className="w-full border rounded-lg px-3 py-2 text-xs font-mono h-96"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex gap-2 items-center">
        <button className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm" onClick={save}>
          Save
        </button>
        <span className="text-sm text-brand-text/70">{status}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + verify**

Run: `npx tsc --noEmit` (no errors).
With `npm run preview`: Site Content tab loads `about`/`skills`/`timeline` JSON; edit a timeline description, save → "Saved."; reload homepage and confirm the change appears (cache invalidated on save).

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/ContentTab.tsx
git commit -m "feat: site-content dashboard tab (JSON editor)"
```

---

### Task 6.5: Projects tab (list + JSON editor)

**Files:**
- Modify: `app/dashboard/ProjectsTab.tsx`

- [ ] **Step 1: Implement**

Replace `app/dashboard/ProjectsTab.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";

interface Row {
  id: string;
  slug: string;
  data: Record<string, unknown>;
  featured: boolean;
  sort_order: number;
}

export default function ProjectsTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  async function load() {
    const res = await fetch("/api/admin/projects");
    if (res.ok) setRows(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  function edit(r: Row) {
    setEditing(r);
    setText(JSON.stringify(r.data, null, 2));
  }

  async function save() {
    if (!editing) return;
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(text);
    } catch {
      setStatus("Invalid JSON.");
      return;
    }
    setStatus("Saving…");
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing.id,
        slug: editing.slug,
        data,
        featured: editing.featured,
        sort_order: editing.sort_order,
      }),
    });
    setStatus(res.ok ? "Saved." : `Error ${res.status}`);
    if (res.ok) {
      setEditing(null);
      load();
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/projects?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setStatus(res.ok ? "Deleted." : `Error ${res.status}`);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-brand-text">Projects</h2>
        <button
          className="px-3 py-1.5 rounded-lg bg-brand-primary text-white text-sm"
          onClick={() => {
            const blank: Row = { id: "", slug: "", data: {}, featured: false, sort_order: rows.length };
            setEditing(blank);
            setText("{}");
          }}
        >
          + New project
        </button>
      </div>

      {editing ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="id"
              value={editing.id}
              onChange={(e) => setEditing({ ...editing, id: e.target.value })}
            />
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="slug"
              value={editing.slug}
              onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
            />
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={editing.featured}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
              />
              featured
            </label>
          </div>
          <textarea
            className="w-full border rounded-lg px-3 py-2 text-xs font-mono h-96"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex gap-2 items-center">
            <button className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm" onClick={save}>
              Save
            </button>
            <button className="px-4 py-2 rounded-lg bg-gray-200 text-sm" onClick={() => setEditing(null)}>
              Cancel
            </button>
            <span className="text-sm text-brand-text/70">{status}</span>
          </div>
        </div>
      ) : (
        <ul className="divide-y">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-brand-text">
                  {String((r.data as { title?: string }).title ?? r.slug)}
                </p>
                <p className="text-xs text-brand-text/60">
                  {r.slug} {r.featured ? "· featured" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="text-sm text-brand-primary" onClick={() => edit(r)}>
                  Edit
                </button>
                <button className="text-sm text-red-600" onClick={() => remove(r.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!editing && status && <p className="text-sm text-brand-text/70">{status}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + verify**

Run: `npx tsc --noEmit` (no errors).
With `npm run preview`: Projects tab lists 3 projects; edit one's `summary`, save → "Saved."; reload homepage and confirm the card text updated.

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/ProjectsTab.tsx
git commit -m "feat: projects dashboard tab (JSON editor)"
```

---

## Phase 7 — Access setup, cleanup, deploy

### Task 7.1: First deploy (so the Access app has a hostname to protect)

**Files:** none.

- [ ] **Step 1: Ensure `ENVIRONMENT` is `production` in `wrangler.jsonc`**

Run: `grep '"ENVIRONMENT"' wrangler.jsonc`
Expected: `"ENVIRONMENT": "production"`. (Revert any local `development` change.)

- [ ] **Step 2: Build + deploy**

Run: `npm run deploy`
Expected: OpenNext builds and `wrangler deploy` prints the deployed URL + custom domain route.

- [ ] **Step 3: Confirm the public site works on the live URL**

Visit the live URL. Homepage renders, `/resume` serves the PDF, `/projects/<slug>` works. (Chatbot will say "information not available" until remote Vectorize is populated in Task 7.3.)

- [ ] **Step 4: No commit.**

---

### Task 7.2: Create the Cloudflare Access application (manual)

**Files:**
- Modify: `wrangler.jsonc` (fill `CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD`)

- [ ] **Step 1: Create ONE self-hosted Access application covering both paths**

> **Critical:** use a **single** Access application, not two. Two separate apps issue separate per-app cookies with different AUDs; the browser would authenticate the dashboard but a same-origin `fetch('/api/admin/...')` would hit an unauthenticated second app, get a 302 to the Access login (which `fetch` can't follow), and every save would fail. One application → one cookie → both paths authorized by the same AUD.

In the Cloudflare dashboard → **Zero Trust → Access → Applications → Add an application → Self-hosted**:
- **Application name:** Portfolio Admin
- **Session duration:** 24h (or preference)
- **Application domain / paths:** add the custom domain **twice on the same application**, once with path `dashboard` and once with path `api/admin` (Access lets one self-hosted app include multiple domain+path rows). This makes one app cover both `/dashboard*` and `/api/admin*`.
- Save and **copy the single Application Audience (AUD) tag** from the application's Overview — this one AUD goes into `CF_ACCESS_AUD`.

- [ ] **Step 2: Confirm both paths are on the one application**

In the application's **Overview → Application domains**, verify both `…/dashboard` and `…/api/admin` are listed under the same app. Do NOT create a second application. The public site (`/`, `/resume`, `/projects/*`, `/api/chat`) is intentionally NOT included, so it stays open.

- [ ] **Step 3: Add the policy (allow only the owner email)**

Policy: **Action = Allow**, **Include = Emails = wintongee@gmail.com**. Save.

- [ ] **Step 4: Note your team domain**

It's `https://<team-name>.cloudflareaccess.com`. The value for `CF_ACCESS_TEAM_DOMAIN` is `<team-name>.cloudflareaccess.com` (no scheme).

- [ ] **Step 5: Fill the vars in `wrangler.jsonc`**

Set:
```jsonc
    "CF_ACCESS_TEAM_DOMAIN": "<team-name>.cloudflareaccess.com",
    "CF_ACCESS_AUD": "<AUD-tag-from-step-1>",
```

- [ ] **Step 6: Redeploy with the vars**

Run: `npm run deploy`
Expected: deploy succeeds.

- [ ] **Step 7: Commit (vars are non-secret identifiers)**

```bash
git add wrangler.jsonc
git commit -m "chore: configure Cloudflare Access team domain and AUD"
```

---

### Task 7.3: Populate remote Vectorize + verify the gate

**Files:** none.

- [ ] **Step 1: Reindex remote Vectorize via the deployed (authenticated) endpoint**

Open the live `/dashboard` in your browser (this forces the Access login as wintongee@gmail.com and sets the Access cookie). Then trigger reindex from the same authenticated browser session — add a temporary "Reindex" button OR call it via the browser console:
```js
await fetch("/api/admin/reindex", { method: "POST" }).then((r) => r.json());
```
Expected: `{ reindexed: <count> }`. (The browser carries the Access JWT cookie, so `requireAdmin` passes.)

- [ ] **Step 2: Verify the chatbot answers from remote Vectorize**

On the live site, ask the chatbot "Where does Winton work?" — expect a Mercor-based answer with sources.

- [ ] **Step 3: Verify the Access gate blocks non-owners**

In an incognito window, visit `/dashboard` → redirected to Cloudflare Access login; logging in with a non-allowed email is denied. Visit `/api/admin/knowledge` directly without auth → 401/Access challenge.

- [ ] **Step 4: Verify the public site is NOT gated**

In incognito, confirm `/`, `/resume`, `/projects/<slug>`, and the chatbot all work without login.

- [ ] **Step 5: No commit.**

---

### Task 7.4: Remove now-dead files (bloat cleanup)

**Files:**
- Delete: `data/about-data.ts`, `data/skills-data.ts`, `data/timeline-data.ts`, `data/projects.json`
- Delete: `data/chatbot/**` (now in D1)
- Delete: `public/resume/Winton_Gee_Resume.pdf` (now in R2)
- Delete: `scripts/setup-env.sh`, `scripts/optimize-images.js` if unused
- Delete: `app/projects/[slug]/case-studies.ts` only if no longer imported (it was a migration source)

- [ ] **Step 1: Confirm nothing imports the data modules anymore**

Run:
```bash
grep -rn "data/about-data\|data/skills-data\|data/timeline-data\|data/projects.json\|data/chatbot\|case-studies" app components lib scripts
```
Expected: no matches (the seed/merge generators in `scripts/` DO import them — keep those scripts, or accept they break after deletion since seeding is done). **Decision:** keep `scripts/generate-seed-sql.ts` and `scripts/merge-casestudy.ts` working by NOT deleting their imports prematurely — instead move the now-migrated source data deletion to AFTER confirming remote D1 is fully seeded (it is, by Task 1.6/3.4). The generators are one-time tools; if you delete their inputs, also delete the generators.

- [ ] **Step 2: Delete migrated inputs + their one-time generators together**

```bash
git rm -r data/chatbot
git rm data/about-data.ts data/skills-data.ts data/timeline-data.ts data/projects.json
git rm public/resume/Winton_Gee_Resume.pdf
git rm scripts/generate-seed-sql.ts scripts/merge-casestudy.ts app/projects/[slug]/case-studies.ts
```

- [ ] **Step 3: Verify build still works**

Run: `npm run build`
Expected: Next build completes with no module-not-found errors.

- [ ] **Step 4: Typecheck + test**

Run: `npx tsc --noEmit && npm test`
Expected: no errors; all unit tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove migrated data files and one-time seed scripts"
```

---

### Task 7.5: Dependency audit + README/UPDATES

**Files:**
- Modify: `package.json` (remove unused deps)
- Modify: `README.md`, `UPDATES.md`

- [ ] **Step 1: Find unused dependencies**

Run:
```bash
for dep in recharts dotenv @radix-ui/react-hover-card remark-gfm react-markdown; do
  echo "== $dep =="; grep -rn "$dep" app components lib hooks 2>/dev/null | head -2;
done
```
For any dep with no matches, remove it: `npm uninstall <dep>`. (Verify `dotenv` — it was only used by the deleted embedding scripts; likely removable. Verify `recharts` — only remove if unused.)

- [ ] **Step 2: Update README/UPDATES to describe the new architecture**

In `README.md`, replace the chatbot/data sections with: "Content lives in Cloudflare D1; chatbot uses Vectorize; resume in R2; edit everything at `/dashboard` (gated by Cloudflare Access). No rebuild needed to update content." Add a short "Dashboard & storage" section documenting the bindings and the Access app.

- [ ] **Step 3: Build + typecheck once more**

Run: `npm run build && npx tsc --noEmit`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: audit dependencies and update docs for Cloudflare architecture"
```

---

### Task 7.6: Final deploy + smoke test

**Files:** none.

- [ ] **Step 1: Deploy**

Run: `npm run deploy`
Expected: success, prints live URL.

- [ ] **Step 2: Full smoke test on the live site**

Verify in order:
1. Public homepage renders (timeline, tech stack, projects) — unchanged look.
2. `/resume` serves the PDF.
3. Chatbot answers a question with sources.
4. `/dashboard` requires Access login as wintongee@gmail.com.
5. From the dashboard: edit a knowledge doc → chatbot reflects it; edit a project → homepage card updates; upload a resume → `/resume` updates; edit site content → homepage updates.
6. Incognito: `/dashboard` and `/api/admin/*` are blocked; public pages work.

- [ ] **Step 3: Final commit (if any doc tweaks) + open PR**

```bash
git add -A && git commit -m "docs: final notes" || true
```
(Open the PR when ready — see Execution Handoff.)

---

## Self-Review

**Spec coverage check:**
- Dashboard gated by Access for wintongee@gmail.com → Tasks 4.x, 5.x, 6.1, 7.2, 7.3. ✓
- Edit chatbot knowledge → Tasks 5.2, 6.2 (with live re-embed). ✓
- Edit resume PDF → Tasks 1.6, 3.5, 5.3, 6.3 (R2). ✓
- Edit site content → Tasks 1.3, 5.3, 6.4. ✓
- Edit projects → Tasks 1.3, 3.4, 5.3, 6.5. ✓
- Cloudflare storage instead of files → D1 (0.4, 1.x), Vectorize (2.x), R2 (1.6, 3.5). ✓
- Rebuild / remove bloat → 2.5 (baked embeddings + scripts), 3.5 (sources gen), 7.4 (data files), 7.5 (deps). ✓
- Keep current look → 3.3 preserves markup, props-only changes. ✓
- Migration without data loss → 1.5, 1.6, 3.4 seed. ✓

**Type consistency:** `KnowledgeDoc`, `ProjectRow`, `ContentKey`, `AccessClaims`, `Source` are defined once and reused. `requireAdmin`/`denyIfNotAdmin` signatures are stable across all admin routes. Cache keys come from `CACHE_KEYS`.

**Known risk flagged inline:** `generateStaticParams` reading D1 at build (Task 3.4 Step 4) has a documented fallback to dynamic rendering. Remote Vectorize population is explicitly deferred to Task 7.3 with a concrete method.

**Placeholder scan:** No "TBD"/"implement later". The one verbatim-paste instruction (Task 3.3 Step 4, HomeClient JSX) references the exact existing markup and lists the only three changes — acceptable because reproducing the full 140-line section inline would be error-prone vs. moving it.
