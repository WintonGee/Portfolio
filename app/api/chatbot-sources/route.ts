import { NextResponse } from "next/server";
import { CHATBOT_SOURCES } from "../../../lib/chatbot-sources";

// Data is generated at build time by scripts/generate-chatbot-sources.js so we
// don't touch the filesystem at runtime (unavailable on the Workers runtime).
export async function GET() {
  return NextResponse.json(CHATBOT_SOURCES);
}
