import { NextResponse } from "next/server";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

interface SourceFile {
  path: string;
  content: string;
  title: string;
  category: string;
}

export async function GET() {
  try {
    const chatbotDir = join(process.cwd(), "data", "chatbot");
    const sources: SourceFile[] = [];

    // Function to recursively read markdown files
    const readMarkdownFiles = (dir: string, basePath: string = ""): void => {
      if (!existsSync(dir)) return;

      const items = readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = join(dir, item.name);
        const relativePath = basePath ? `${basePath}/${item.name}` : item.name;

        if (item.isDirectory()) {
          readMarkdownFiles(fullPath, relativePath);
        } else if (item.isFile() && item.name.endsWith(".md")) {
          try {
            const content = readFileSync(fullPath, "utf-8");
            const category = basePath.split("/")[0] || "personal";
            const title = item.name
              .replace(".md", "")
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());

            sources.push({
              path: `data/chatbot/${relativePath}`,
              content,
              title,
              category,
            });
          } catch (error) {
            console.error(`Error reading file ${fullPath}:`, error);
          }
        }
      }
    };

    readMarkdownFiles(chatbotDir);

    return NextResponse.json(sources);
  } catch (error) {
    console.error("Error loading chatbot sources:", error);
    return NextResponse.json([], { status: 500 });
  }
}
