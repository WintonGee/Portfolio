import { NextRequest } from "next/server";
import { denyIfNotAdmin } from "../../../../lib/auth/require-admin";
import {
  listKnowledge,
  upsertKnowledge,
  deleteKnowledge,
} from "../../../../lib/db/knowledge";
import { upsertVector, deleteVector } from "../../../../lib/rag/vectorize";

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
    return new Response("id, title, category, content are required", {
      status: 400,
    });
  }

  await upsertKnowledge({
    id: body.id,
    title: body.title,
    category: body.category,
    content: body.content,
    vector_id: body.id,
  });
  // Re-embed into Vectorize so chat reflects the edit immediately.
  await upsertVector(body.id, body.content, {
    title: body.title,
    category: body.category,
  });

  return Response.json({ ok: true, id: body.id });
}

// Knowledge ids contain "/" (e.g. "professional/summary"), so a [id] dynamic
// segment can't represent them. Delete via ?id=<encoded> instead.
export async function DELETE(request: NextRequest) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return new Response("id query param required", { status: 400 });
  await deleteKnowledge(id);
  await deleteVector(id);
  return Response.json({ ok: true });
}
