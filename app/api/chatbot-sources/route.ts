import { NextResponse } from "next/server";
import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { join } from "path";

interface SourceFile {
  path: string;
  content: string;
  title: string;
  category: string;
  lastModified: string;
  size: number;
  lines: number;
  words: number;
  description: string;
  tags: string[];
}

// Cache the result for 1 hour (3600 seconds)
export const revalidate = 3600;

export async function GET() {
  try {
    const chatbotDir = join(process.cwd(), "data", "chatbot");
    const sources: SourceFile[] = [];

    // Function to extract description from content
    const extractDescription = (content: string): string => {
      const lines = content.split("\n");
      for (const line of lines) {
        if (
          line.trim() &&
          !line.startsWith("#") &&
          !line.startsWith("-") &&
          !line.startsWith("*")
        ) {
          return (
            line.trim().substring(0, 100) +
            (line.trim().length > 100 ? "..." : "")
          );
        }
      }
      return "No description available";
    };

    // Function to extract tags from content
    const extractTags = (content: string, category: string): string[] => {
      const tags = [category];
      const contentLower = content.toLowerCase();

      // Add technology tags
      if (contentLower.includes("ai") || contentLower.includes("ml"))
        tags.push("ai-ml");
      if (contentLower.includes("python")) tags.push("python");
      if (
        contentLower.includes("javascript") ||
        contentLower.includes("typescript")
      )
        tags.push("web");
      if (contentLower.includes("contact") || contentLower.includes("email"))
        tags.push("contact");
      if (
        contentLower.includes("education") ||
        contentLower.includes("university")
      )
        tags.push("education");
      if (contentLower.includes("work") || contentLower.includes("job"))
        tags.push("professional");

      return [...new Set(tags)];
    };

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
            const stats = statSync(fullPath);
            const category = basePath.split("/")[0] || "personal";
            const title = item.name
              .replace(".md", "")
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());

            const lines = content.split("\n").length;
            const words = content
              .split(/\s+/)
              .filter((word) => word.length > 0).length;
            const description = extractDescription(content);
            const tags = extractTags(content, category);

            sources.push({
              path: `data/chatbot/${relativePath}`,
              content,
              title,
              category,
              lastModified: stats.mtime.toISOString(),
              size: stats.size,
              lines,
              words,
              description,
              tags,
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
