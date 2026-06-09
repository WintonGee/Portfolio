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
