# Cloudflare-Powered Portfolio Rebuild — Design

**Date:** 2026-06-09
**Status:** Approved (design), pending implementation plan

## Goal

Turn the portfolio from a build-time-baked static site into a **fully Cloudflare-powered,
live-editable** application. Add an admin **dashboard** (gated by Cloudflare Access /
Zero Trust for `wintongee@gmail.com`) where the owner can edit the chatbot knowledge
base, the resume PDF, the structured site content, and the projects — all persisted in
Cloudflare storage instead of files in the repo. Remove the accumulated bloat (the 457KB
baked embeddings file, the build-time embedding scripts, and the hardcoded data modules).

## Decisions (locked during brainstorming)

- **Stack:** Refactor in place on **Next.js 15 + OpenNext on Workers** (a Vercel→OpenNext
  migration just landed; a from-scratch Workers-native rewrite would throw away that work
  and every existing component). The bloat to remove is the baked data, not the framework.
- **Domain:** Site has a **custom domain on a Cloudflare zone**, so Cloudflare Access
  self-hosted applications can gate the dashboard hostname/paths.
- **Dashboard scope:** Edit **chatbot knowledge**, **resume PDF**, **site content**
  (about/skills/timeline), and **projects**.
- **Visual design:** **Keep the current look** (beige/brand theme, existing layout and
  components). This is a storage + dashboard change, not a redesign.
- **Site-content editing depth:** Store each structured section as a JSON document in D1;
  the dashboard provides **simple forms for common fields plus a raw-JSON editor** for the
  deeply-nested structural parts. No bespoke form per nested shape.

## Architecture overview

| Concern | Today | After |
|---|---|---|
| Chatbot knowledge | 24 `.md` files → baked into `lib/embeddings.ts` (457KB) | **D1** (source text) + **Vectorize** (vectors) |
| Resume PDF | `public/resume/*.pdf` in the bundle | **R2** object, streamed via a route |
| Site content (about/skills/timeline) | hardcoded `data/*.ts` | **D1** JSON documents |
| Projects | `data/projects.json` | **D1** rows |
| Admin gate | none | **Cloudflare Access** + server-side JWT/email verification |

The homepage and project pages become **server components that read content from D1 at
request time**, cached via the Cache API with a short TTL that is busted on save, then pass
data to the existing client components. The current visual look is preserved; only the data
source changes.

### Cloudflare bindings (wrangler.jsonc)

- `AI` — Workers AI (already present). Used for embeddings (`@cf/baai/bge-base-en-v1.5`)
  and chat (`@cf/meta/llama-3.1-8b-instruct-fast`).
- `DB` — **D1** database `portfolio-db`. Source of truth for all editable text content.
- `VECTORIZE` — **Vectorize** index `portfolio-knowledge`, **768 dimensions, cosine** metric
  (must match the embedding model's output, or upserts/queries misbehave).
- `ASSETS_BUCKET` — **R2** bucket `portfolio-assets`. Stores the resume PDF (and any future
  uploaded binary assets).
- `ASSETS` — static assets binding (already present).

## Data model (D1)

```sql
-- Chatbot knowledge documents (replaces data/chatbot/**/*.md)
CREATE TABLE knowledge_docs (
  id          TEXT PRIMARY KEY,        -- stable slug, e.g. "professional/summary"
  title       TEXT NOT NULL,
  category    TEXT NOT NULL,           -- e.g. "professional", "projects", "skills"
  content     TEXT NOT NULL,           -- markdown
  vector_id   TEXT,                    -- id used in Vectorize (== id)
  updated_at  TEXT NOT NULL            -- ISO timestamp
);

-- Structured site content sections (replaces data/about-data.ts, skills-data.ts, timeline-data.ts)
CREATE TABLE content_blocks (
  key         TEXT PRIMARY KEY,        -- "about" | "skills" | "timeline"
  data        TEXT NOT NULL,           -- JSON document matching the section's TS shape
  updated_at  TEXT NOT NULL
);

-- Projects (replaces data/projects.json)
CREATE TABLE projects (
  id          TEXT PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  data        TEXT NOT NULL,           -- JSON document matching types/project Project shape
  featured    INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  updated_at  TEXT NOT NULL
);

-- Resume metadata (the binary lives in R2)
CREATE TABLE resume_meta (
  id          TEXT PRIMARY KEY DEFAULT 'current',
  filename    TEXT NOT NULL,
  r2_key      TEXT NOT NULL,
  size        INTEGER,
  updated_at  TEXT NOT NULL
);
```

Storing site content and projects as JSON documents (rather than fully normalized columns)
keeps the existing TypeScript shapes intact and lets the dashboard offer a raw-JSON editor
for nested structures, while the render layer just `JSON.parse`s into the current types.

## Chatbot RAG (the core de-bloat)

1. On **knowledge-doc save** (`POST /api/admin/knowledge`):
   - Write the doc to D1.
   - Embed `content` with the `AI` binding (`bge-base-en-v1.5`, `pooling: "cls"`).
   - Upsert into Vectorize: `{ id, values, metadata: { docId, title, category } }`.
   - On **delete**, remove from both D1 and Vectorize.
2. On **chat** (`POST /api/chat`):
   - Embed the user query with the same model.
   - `VECTORIZE.query(queryVector, { topK: 3, returnMetadata: true })`.
   - Fetch the matched docs' `content` from D1 by id (text is the source of truth in D1,
     not Vectorize metadata, since markdown can exceed metadata size limits).
   - Build the context and stream a Llama response (existing streaming logic preserved).
3. One vector per document initially (matches today's whole-file embedding). Chunking is a
   noted future enhancement, not in scope.

**Removed:** `lib/embeddings.ts`, `scripts/embed-embeddings.js`,
`scripts/generate-chatbot-embeddings.js`, `scripts/generate-chatbot-sources.js`, the
`prepare-data` build step, and the in-memory cosine-similarity code path. Editing knowledge
no longer requires a rebuild.

## Auth — Cloudflare Access

- A **self-hosted Access application** on the custom domain protects `/dashboard*` and
  `/api/admin/*`. Policy: allow **email == wintongee@gmail.com** only. (Manual one-time
  setup in the Zero Trust dashboard; documented in the plan.)
- **Defense in depth:** a shared `requireAdmin(request, env)` helper runs in every admin API
  handler. It verifies the `Cf-Access-Jwt-Assertion` JWT against the team's public keys
  (`https://<team>.cloudflareaccess.com/cdn-cgi/access/certs`), checks `aud` against the
  Access application AUD, and confirms the `email` claim equals the allowed address. The
  team domain and AUD are provided via Worker vars. Mutations are rejected if verification
  fails, independent of the edge policy.

## Dashboard

`/dashboard` (Next app route, client components) with four tabs, each backed by
`/api/admin/*`:

- **Knowledge** — list/create/edit/delete docs in a markdown editor; save triggers re-embed.
- **Resume** — preview current PDF (served from R2) + upload a replacement.
- **Site content** — simple forms for common about/skills/timeline fields, with a raw-JSON
  editor fallback for nested structures; save validates JSON shape before writing.
- **Projects** — list + create/edit/delete form (JSON-document editor for the full Project
  shape, with key fields surfaced as inputs).

The dashboard reuses the existing brand styling/components where practical.

## Render layer changes

- Convert `app/page.tsx` into a server component (or add a thin server wrapper) that reads
  `content_blocks` and `projects` from D1 and passes them to the existing client components
  (`About`, `ProjectsNew`, etc.), preserving the current look and animations.
- `app/projects/[slug]/page.tsx` reads the project from D1 instead of `lib/content.ts`.
- `lib/content.ts` and `lib/chatbot-sources.ts` become thin D1-backed query helpers (or are
  removed if the page is dropped — see open items).
- Add a Cache-API layer keyed by content version so public reads are fast and cache is
  busted on admin save (bump a `version` value in KV/D1 or purge specific cache keys).
- The resume download link points to a `/resume` (or `/api/resume`) route that streams the
  current PDF from R2.

## Migration & seed

A one-time seed (run via `wrangler` against the remote bindings) loads existing repo content
into Cloudflare so nothing is lost in the cutover:

- `data/chatbot/**/*.md` → `knowledge_docs` rows → embedded → Vectorize upserts.
- `data/about-data.ts`, `skills-data.ts`, `timeline-data.ts` → `content_blocks` JSON rows.
- `data/projects.json` → `projects` rows.
- `public/resume/Winton_Gee_Resume.pdf` → R2 + `resume_meta` row.

After a verified cutover, the old data files and dead scripts are deleted and `package.json`
dependencies are audited (confirm `recharts`, `dotenv`, etc. are still used; remove if not).

## Cleanup / bloat removal (summary)

- Delete `lib/embeddings.ts` (457KB) and the three generation scripts + `prepare-data` step.
- Delete `data/chatbot/**`, `data/*.ts`, `data/projects.json`, `public/resume/*` once seeded.
- Audit and trim unused dependencies.
- Simplify `package.json` build scripts (no more pre-build data generation).

## Error handling

- Admin APIs: 401 on failed Access verification, 400 on invalid payloads (validate JSON
  shape), 500 with logged error otherwise. Never partially commit — write D1 then Vectorize;
  if Vectorize upsert fails, surface the error and mark the doc as needing re-embed.
- Chat API: fall back to a graceful "information not available" context if Vectorize/D1 are
  unavailable (preserves current resilience).
- Public reads: if D1 read fails, serve last-good cached content where possible.

## Testing

- Unit/integration: admin auth helper (valid/invalid/missing JWT, wrong email), D1 query
  helpers, embed+upsert path (mock AI/Vectorize), chat retrieval path.
- Local dev via `wrangler dev`/`opennextjs-cloudflare preview` with local D1/R2/Vectorize.
- Manual: dashboard CRUD end-to-end on a preview deploy; verify Access gate blocks
  non-owner; verify chatbot answers reflect edited knowledge without a rebuild.

## Open items / out of scope

- Chatbot knowledge **chunking** (kept as one-vector-per-doc for now).
- The standalone `/chatbot-sources` page: keep it (now D1-backed) or fold into the dashboard
  — decide during planning.
- Rollback/versioning of edits (history table) — not in scope for v1.
- Rich WYSIWYG editing — markdown/JSON editors only for v1.
