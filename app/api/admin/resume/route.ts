import { NextRequest } from "next/server";
import { denyIfNotAdmin } from "../../../../lib/auth/require-admin";
import { getEnv } from "../../../../lib/db/client";
import { getResumeMeta, setResumeMeta } from "../../../../lib/db/resume";

export async function GET(request: NextRequest) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;
  return Response.json(await getResumeMeta());
}

export async function POST(request: NextRequest) {
  const denied = await denyIfNotAdmin(request);
  if (denied) return denied;
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return new Response("file field required", { status: 400 });
  if (file.type !== "application/pdf") return new Response("PDF only", { status: 400 });

  const key = "resume/Winton_Gee_Resume.pdf";
  const bytes = await file.arrayBuffer();
  await getEnv().ASSETS_BUCKET.put(key, bytes, {
    httpMetadata: { contentType: "application/pdf" },
  });
  await setResumeMeta({ filename: file.name, r2_key: key, size: bytes.byteLength });
  return Response.json({ ok: true, size: bytes.byteLength });
}
