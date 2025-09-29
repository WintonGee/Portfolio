import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { glob } from "glob";
import matter from "gray-matter";

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

interface PortfolioContext {
  personalInfo: string;
  skills: string[];
  experience: string;
  projects: string[];
}

async function generateEmbeddings() {
  console.log("🚀 Starting embeddings generation...");

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }

  const embeddings: EmbeddingData[] = [];

  // Portfolio context information
  const portfolioContext: PortfolioContext = {
    personalInfo: `
      I'm Winton Gee, an AI/ML Engineer and Software Developer with expertise in artificial intelligence,
      machine learning, and modern web technologies. I specialize in creating intelligent solutions
      and scalable applications that leverage cutting-edge AI technologies.
    `,
    skills: [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "AI/ML",
      "TensorFlow",
      "PyTorch",
      "Next.js",
      "React",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "SQL",
      "Git",
      "Docker",
    ],
    experience: `
      I have extensive experience in AI/ML engineering, working on machine learning models,
      data analysis, and intelligent systems. My background includes developing and deploying
      AI solutions, working with large datasets, and creating scalable ML pipelines.
      I'm passionate about applying AI to solve real-world problems.
    `,
    projects: [],
  };

  try {
    // No project files to process - keeping it simple
    console.log("📁 No project files to process - keeping portfolio simple");

    // Add portfolio context embeddings
    console.log("📝 Adding portfolio context...");
    const contextChunks = [
      `Personal Information: ${portfolioContext.personalInfo}`,
      `Skills: ${portfolioContext.skills.join(", ")}`,
      `Experience: ${portfolioContext.experience}`,
      `Projects: ${portfolioContext.projects.join(", ")}`,
    ];

    for (let i = 0; i < contextChunks.length; i++) {
      const chunk = contextChunks[i];
      const embedding = await generateEmbedding(genAI, chunk);

      embeddings.push({
        id: `portfolio-context-${i}`,
        content: chunk,
        metadata: {
          title: "Portfolio Context",
          description: "General portfolio information",
          tags: ["portfolio", "context"],
          date: new Date().toISOString(),
          filePath: "portfolio-context",
        },
        embedding: embedding,
      });
    }

    // Save embeddings to JSON file
    const outputPath = join(process.cwd(), "data", "embeddings.json");
    const outputDir = join(process.cwd(), "data");

    // Create data directory if it doesn't exist
    try {
      require("fs").mkdirSync(outputDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    writeFileSync(outputPath, JSON.stringify(embeddings, null, 2));

    console.log(`✅ Generated ${embeddings.length} embeddings`);
    console.log(`📄 Saved to: ${outputPath}`);

    // Create a summary file
    const summary = {
      totalEmbeddings: embeddings.length,
      projectFiles: 0,
      generatedAt: new Date().toISOString(),
      model: "text-embedding-004",
    };

    writeFileSync(
      join(outputDir, "embeddings-summary.json"),
      JSON.stringify(summary, null, 2)
    );

    console.log("📊 Summary saved to: data/embeddings-summary.json");
  } catch (error) {
    console.error("❌ Error generating embeddings:", error);
    process.exit(1);
  }
}

async function generateEmbedding(
  genAI: GoogleGenerativeAI,
  text: string
): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  generateEmbeddings().catch(console.error);
}

export { generateEmbeddings };
