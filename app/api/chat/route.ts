import { NextRequest } from "next/server";
import { StreamingTextResponse } from "ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import { join } from "path";

// Load environment variables
import { config } from "dotenv";
config({ path: ".env.local" });

interface EmbeddingData {
  id: string;
  content: string;
  metadata: {
    title: string;
    description: string;
    tags: string[];
    date: string;
    featured?: boolean;
    liveUrl?: string;
    githubUrl?: string;
    imageUrl?: string;
    filePath: string;
  };
  embedding: number[];
}

async function loadEmbeddings(): Promise<EmbeddingData[]> {
  try {
    const embeddingsPath = join(process.cwd(), "data", "embeddings.json");
    const embeddingsData = readFileSync(embeddingsPath, "utf-8");
    return JSON.parse(embeddingsData);
  } catch (error) {
    console.error("Error loading embeddings:", error);
    return [];
  }
}

async function getRelevantContext(
  genAI: GoogleGenerativeAI,
  userMessage: string,
  embeddings: EmbeddingData[]
): Promise<string> {
  try {
    // Generate embedding for user message
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const userEmbedding = await model.embedContent(userMessage);
    const userVector = userEmbedding.embedding.values;

    // Calculate cosine similarity and find most relevant content
    const similarities = embeddings.map((item) => {
      const similarity = cosineSimilarity(userVector, item.embedding);
      return { ...item, similarity };
    });

    // Sort by similarity and take top 3 most relevant
    const relevantItems = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);

    // Combine relevant content
    const context = relevantItems.map((item) => item.content).join("\n\n");

    return context;
  } catch (error) {
    console.error("Error getting relevant context:", error);
    return "Portfolio information not available.";
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return new Response("Message is required", { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return new Response("Gemini API key not configured", { status: 500 });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Load embeddings and get relevant context
    const embeddings = await loadEmbeddings();
    const relevantContext = await getRelevantContext(
      genAI,
      message,
      embeddings
    );

    // Create prompt with context
    const prompt = `
You are Winton Gee, and you are responding directly to someone who is asking you questions about your work and experience. Use the following context about yourself to answer questions accurately and personally.

Context about Winton:
${relevantContext}

User question: ${message}

Respond as if you are Winton speaking directly to the person. Use first person ("I", "my", "me") and be conversational, friendly, and authentic. Share your experiences, projects, and skills as if you're having a personal conversation. If the user asks about something not covered in the context, politely let them know and suggest what information you can share about your work and experience.

Keep your response natural, engaging, and personal. Focus on your skills, projects, and experience when relevant.
`;

    // Generate response using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContentStream(prompt);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ content: chunkText })}\n\n`
              )
            );
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
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
        }
      },
    });

    return new StreamingTextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

