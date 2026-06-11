import { NextResponse } from "next/server";
import { listKnowledge } from "../../../lib/db/knowledge";
import { cached, CACHE_KEYS } from "../../../lib/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  const docs = await cached(CACHE_KEYS.knowledge, 60, listKnowledge);
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
