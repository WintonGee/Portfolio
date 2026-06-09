import { getEnv } from "../../lib/db/client";
import { getResumeMeta } from "../../lib/db/resume";

export const dynamic = "force-dynamic";

export async function GET() {
  const meta = await getResumeMeta();
  if (!meta) return new Response("Resume not found", { status: 404 });
  const obj = await getEnv().ASSETS_BUCKET.get(meta.r2_key);
  if (!obj) return new Response("Resume file missing", { status: 404 });
  return new Response(obj.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${meta.filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
