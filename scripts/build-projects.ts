#!/usr/bin/env tsx

import fs from "fs";
import path from "path";
import { getAllProjects } from "../lib/content";

async function buildProjects() {
  console.log("🔨 Building projects data...");

  try {
    // Get all projects from markdown files
    const projects = getAllProjects();

    // Write to static JSON file
    const outputPath = path.join(process.cwd(), "data", "projects.json");
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2));

    console.log(`✅ Generated ${projects.length} projects`);
    console.log(`📁 Output: ${outputPath}`);

    // Show project summary
    const featured = projects.filter((p) => p.featured);
    const completed = projects.filter((p) => p.status === "completed");
    const inProgress = projects.filter((p) => p.status === "in-progress");

    console.log("\n📊 Project Summary:");
    console.log(`   Total: ${projects.length}`);
    console.log(`   Featured: ${featured.length}`);
    console.log(`   Completed: ${completed.length}`);
    console.log(`   In Progress: ${inProgress.length}`);

    console.log("\n🎯 Featured Projects:");
    featured.forEach((project, index) => {
      console.log(`   ${index + 1}. ${project.title}`);
    });
  } catch (error) {
    console.error("❌ Error building projects:", error);
    process.exit(1);
  }
}

buildProjects();
