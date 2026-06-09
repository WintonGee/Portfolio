import { NextResponse } from "next/server";
import { listKnowledge } from "../../../lib/db/knowledge";

export const dynamic = "force-dynamic";

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
