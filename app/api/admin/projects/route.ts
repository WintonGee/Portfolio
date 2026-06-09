import { NextRequest } from "next/server";
import { denyIfNotAdmin } from "../../../../lib/auth/require-admin";
import {
  listProjects,
  upsertProject,
  deleteProject,
} from "../../../../lib/db/projects";
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
