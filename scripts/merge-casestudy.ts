import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { caseStudies } from "../app/projects/[slug]/case-studies";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const sql = caseStudies
  .map((cs) => {
    const json = JSON.stringify(cs).replace(/'/g, "''");
    // Merge caseStudy into the existing data JSON via json_set.
    return `UPDATE projects SET data = json_set(data, '$.caseStudy', json('${json}')) WHERE slug = '${cs.slug}';`;
  })
  .join("\n");
fs.writeFileSync(path.join(root, "merge.sql"), sql + "\n");
console.log(`Wrote merge.sql for ${caseStudies.length} case studies`);
