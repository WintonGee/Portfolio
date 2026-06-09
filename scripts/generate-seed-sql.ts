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
