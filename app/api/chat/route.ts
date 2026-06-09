import { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { EMBEDDINGS_DATA } from "../../../lib/embeddings";

// Workers AI models. The embedding model MUST match the one used to generate
// data/chatbot-embeddings.json (see scripts/generate-chatbot-embeddings.js),
// otherwise the stored vectors and the query vector live in different spaces.
const EMBEDDING_MODEL = "@cf/baai/bge-base-en-v1.5";
const CHAT_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";

interface EmbeddingData {
  id: string;
  content: string;
  metadata: {
    title: string;
    category: string;
    filePath: string;
    type: string;
    lastUpdated: string;
  };
  embedding: number[];
}

function loadEmbeddings(): EmbeddingData[] {
  // Use embedded data (always available)
  return EMBEDDINGS_DATA;
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

async function getRelevantContext(
  ai: Ai,
  userMessage: string,
  embeddings: EmbeddingData[]
): Promise<{
  context: string;
  sources: Array<{ title: string; filePath: string; similarity: number }>;
}> {
  try {
    // If no embeddings available, return empty context
    if (!embeddings || embeddings.length === 0) {
      return {
        context: "Portfolio information not available.",
        sources: [],
      };
    }

    // Generate embedding for user message using Workers AI
    const embeddingResponse = (await ai.run(EMBEDDING_MODEL, {
      text: userMessage,
      pooling: "cls",
    })) as unknown as { data: number[][] };
    const userVector = embeddingResponse.data[0];

    if (!userVector) {
      return {
        context: "Portfolio information not available.",
        sources: [],
      };
    }

    // Calculate cosine similarity and find most relevant content
    const similarities = embeddings.map((item) => {
      const similarity = cosineSimilarity(userVector, item.embedding);
      return { ...item, similarity };
    });

    // Filter out low similarity items and sort by similarity
    const filteredSimilarities = similarities.filter(
      (item) => item.similarity > 0.1
    );
    const relevantItems = filteredSimilarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);

    // Combine relevant content
    const context = relevantItems.map((item) => item.content).join("\n\n");

    // Extract source information
    const sources = relevantItems.map((item) => ({
      title: item.metadata.title,
      filePath: item.metadata.filePath,
      similarity: item.similarity,
    }));

    return { context, sources };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error getting relevant context:", error);
    }
    return {
      context: "Portfolio information not available.",
      sources: [],
    };
  }
}

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

    if (!message) {
      return new Response("Message is required", { status: 400 });
    }

    const { env } = getCloudflareContext();
    const ai = env.AI;

    if (!ai) {
      return new Response("AI binding not configured", { status: 500 });
    }

    // Load embeddings and get relevant context
    const embeddings = loadEmbeddings();
    const { context: relevantContext, sources } = await getRelevantContext(
      ai,
      message,
      embeddings
    );

    const userPrompt = `Context about Winton:
${relevantContext}

User question: ${message}

Respond as Winton, using only the information provided in the context. Be direct and concise.`;

    // Generate a streaming response using Workers AI
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
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ sources })}\n\n`)
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        };

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            // Keep the last (possibly partial) line in the buffer
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
                    encoder.encode(
                      `data: ${JSON.stringify({ content: parsed.response })}\n\n`
                    )
                  );
                }
              } catch {
                // Ignore non-JSON keep-alive lines
              }
            }
          }

          flushSources();
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                content: "Sorry, I encountered an error. Please try again.",
              })}\n\n`
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
