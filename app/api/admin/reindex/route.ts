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
    await upsertVector(doc.id, doc.content, {
      title: doc.title,
      category: doc.category,
    });
    if (doc.vector_id !== doc.id) {
      await upsertKnowledge({ ...doc, vector_id: doc.id });
    }
    count++;
  }
  return Response.json({ reindexed: count });
}
