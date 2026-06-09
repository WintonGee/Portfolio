import { NextRequest } from "next/server";
import { getEnv } from "../../../lib/db/client";
import { getKnowledgeByIds } from "../../../lib/db/knowledge";
import { queryVectors } from "../../../lib/rag/vectorize";
import { buildContext } from "../../../lib/rag/context";

const CHAT_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";

const SYSTEM_PROMPT = `You are Winton Gee, an AI/ML Engineer currently working at Mercor. You are responding directly to someone asking questions about your work and experience.

IMPORTANT INSTRUCTIONS:
- ONLY use information provided in the context below
- Be direct, concise, and professional
- Get straight to the point - avoid unnecessary pleasantries and filler words
- Use first person ("I", "my", "me") naturally
- Provide specific details when available
- If you don't know something, suggest reaching out via email
- DO NOT make up or assume any information not explicitly provided
- Be honest about what you know and don't know
- Use proper formatting with bullet points, bold text, or paragraphs when appropriate
- Keep responses brief and to the point
- For simple requests (like contact info), provide just the essential information
- If the question is about something not covered in the context, suggest reaching out via email (wintongee@gmail.com) or LinkedIn (https://linkedin.com/in/wintongee) for more details.`;

export async function POST(request: NextRequest) {
  try {
    const { message } = (await request.json()) as { message?: string };
    if (!message) return new Response("Message is required", { status: 400 });

    const ai = getEnv().AI;
    if (!ai) return new Response("AI binding not configured", { status: 500 });

    // Retrieve relevant knowledge: vector search -> D1 fetch -> context.
    let context = "Portfolio information not available.";
    let sources: Array<{ title: string; filePath: string; similarity: number }> = [];
    try {
      const matches = await queryVectors(message, 3);
      const docs = await getKnowledgeByIds(matches.map((m) => m.id));
      ({ context, sources } = buildContext(matches, docs));
    } catch (err) {
      console.error("RAG retrieval failed:", err);
    }

    const userPrompt = `Context about Winton:
${context}

User question: ${message}

Respond as Winton, using only the information provided in the context. Be direct and concise.`;

    const aiStream = (await ai.run(CHAT_MODEL, {
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      stream: true,
    })) as unknown as ReadableStream<Uint8Array>;

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = aiStream.getReader();
        let buffer = "";
        const flushSources = () => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ sources })}\n\n`));
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        };
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const data = trimmed.slice("data:".length).trim();
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.response) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content: parsed.response })}\n\n`)
                  );
                }
              } catch {
                // ignore keep-alive lines
              }
            }
          }
          flushSources();
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ content: "Sorry, I encountered an error. Please try again." })}\n\n`
            )
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
