const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to read all markdown files from a directory
function readMarkdownFiles(dirPath) {
  const files = [];

  function traverseDir(currentPath) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverseDir(fullPath);
      } else if (item.endsWith(".md")) {
        const content = fs.readFileSync(fullPath, "utf8");
        const relativePath = path.relative(process.cwd(), fullPath);

        files.push({
          path: relativePath,
          content: content,
          category: path.dirname(relativePath).split("/").pop(),
        });
      }
    }
  }

  traverseDir(dirPath);
  return files;
}

// Function to generate embeddings
async function generateEmbeddings() {
  try {
    console.log("🚀 Starting chatbot embeddings generation...");

    // Read all markdown files from the chatbot data directory
    const chatbotDataDir = path.join(process.cwd(), "data", "chatbot");
    const files = readMarkdownFiles(chatbotDataDir);

    if (files.length === 0) {
      console.log("❌ No markdown files found in data/chatbot directory");
      return;
    }

    console.log(`📁 Found ${files.length} markdown files`);

    const embeddings = [];
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    // Process each file
    for (const file of files) {
      console.log(`📄 Processing: ${file.path}`);

      try {
        // Generate embedding for the content
        const result = await model.embedContent(file.content);
        const embedding = result.embedding.values;

        embeddings.push({
          id: `chatbot_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          content: file.content,
          metadata: {
            title: path.basename(file.path, ".md"),
            category: file.category,
            filePath: file.path,
            type: "chatbot_data",
            lastUpdated: new Date().toISOString(),
          },
          embedding: embedding,
        });

        console.log(`✅ Generated embedding for: ${file.path}`);

        // Add a small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`❌ Error processing ${file.path}:`, error.message);
      }
    }

    // Save embeddings to file
    const outputPath = path.join(
      process.cwd(),
      "data",
      "chatbot-embeddings.json"
    );
    fs.writeFileSync(outputPath, JSON.stringify(embeddings, null, 2));

    console.log(`🎉 Successfully generated ${embeddings.length} embeddings`);
    console.log(`💾 Saved to: ${outputPath}`);

    // Generate summary
    const summary = {
      totalEmbeddings: embeddings.length,
      categories: [...new Set(embeddings.map((e) => e.metadata.category))],
      generatedAt: new Date().toISOString(),
      files: embeddings.map((e) => ({
        path: e.metadata.filePath,
        category: e.metadata.category,
        title: e.metadata.title,
      })),
    };

    const summaryPath = path.join(
      process.cwd(),
      "data",
      "chatbot-embeddings-summary.json"
    );
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    console.log(`📊 Summary saved to: ${summaryPath}`);
  } catch (error) {
    console.error("❌ Error generating embeddings:", error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  generateEmbeddings();
}

module.exports = { generateEmbeddings };
