import { NextRequest } from "next/server";
import { StreamingTextResponse } from "ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync, existsSync } from "fs";
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
    // Debug: Log current working directory and available files
    console.log("Current working directory:", process.cwd());
    
    // Try multiple possible paths for embeddings
    const possiblePaths = [
      join(process.cwd(), "data", "chatbot-embeddings.json"),
      join(process.cwd(), "data", "embeddings.json"),
      join(process.cwd(), "public", "chatbot-embeddings.json"),
      join(process.cwd(), ".next", "server", "data", "chatbot-embeddings.json"),
      join(process.cwd(), ".next", "server", "data", "embeddings.json"),
    ];

    for (const path of possiblePaths) {
      console.log("Looking for embeddings at:", path);
      console.log("File exists:", existsSync(path));
      
      if (existsSync(path)) {
        console.log("Loading embeddings from:", path);
        const embeddingsData = readFileSync(path, "utf-8");
        return JSON.parse(embeddingsData);
      }
    }

    // If no file exists, return empty array
    console.warn(
      "No embeddings files found. Chatbot will work without context."
    );
    return [];
  } catch (error) {
    console.error("Error loading embeddings:", error);
    return [];
  }
}

async function getRelevantContext(
  genAI: GoogleGenerativeAI,
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

    // Generate embedding for user message
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const userEmbedding = await model.embedContent(userMessage);
    const userVector = userEmbedding.embedding.values;

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
    console.error("Error getting relevant context:", error);
    return {
      context: "Portfolio information not available.",
      sources: [],
    };
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
    const { context: relevantContext, sources } = await getRelevantContext(
      genAI,
      message,
      embeddings
    );

    // Create prompt with context
    const prompt = `
You are Winton Gee, an AI/ML Engineer currently working at Mercor. You are responding directly to someone asking questions about your work and experience.

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

Context about Winton:
${relevantContext}

User question: ${message}

Respond as Winton, using only the information provided in the context. Be direct and concise. If the question is about something not covered in the context, suggest reaching out via email (wintongee@gmail.com) or LinkedIn (https://linkedin.com/in/wintongee) for more details.
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
          // Send sources information at the end
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ sources: sources })}\n\n`)
          );
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
