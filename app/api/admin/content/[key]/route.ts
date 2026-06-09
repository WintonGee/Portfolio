import { NextRequest } from "next/server";
import { denyIfNotAdmin } from "../../../../../lib/auth/require-admin";
import {
  getContentBlock,
  setContentBlock,
  type ContentKey,
} from "../../../../../lib/db/content";
import { invalidate, CACHE_KEYS } from "../../../../../lib/cache";

const VALID: ContentKey[] = ["about", "skills", "timeline"];
interface Ctx {
  params: Promise<{ key: string }>;
}

export async function GET(request: NextRequest, ctx: Ctx) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;
  const { key } = await ctx.params;
  if (!VALID.includes(key as ContentKey))
    return new Response("Bad key", { status: 400 });
  return Response.json(await getContentBlock(key as ContentKey));
}

export async function PUT(request: NextRequest, ctx: Ctx) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;
  const { key } = await ctx.params;
  if (!VALID.includes(key as ContentKey))
    return new Response("Bad key", { status: 400 });
  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  await setContentBlock(key as ContentKey, data);
  await invalidate(CACHE_KEYS.home);
  return Response.json({ ok: true });
}
