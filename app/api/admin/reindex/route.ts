import { NextRequest } from "next/server";
import { listKnowledge, upsertKnowledge } from "../../../../lib/db/knowledge";
import { upsertVector } from "../../../../lib/rag/vectorize";
import { isDev } from "../../../../lib/db/client";

export async function POST(_request: NextRequest) {
  // Dev-only guard until Task 5.1 wires requireAdmin here.
  if (!isDev()) {
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
