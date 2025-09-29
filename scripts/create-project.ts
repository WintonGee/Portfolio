#!/usr/bin/env tsx

import fs from "fs";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

const projectTemplate = `---
title: "{{TITLE}}"
description: "{{DESCRIPTION}}"
imageUrl: "/content/projects/{{SLUG}}.jpg"
tags: [{{TAGS}}]
technologies:
  - category: "{{CATEGORY1}}"
    name: "{{TECH1}}"
  - category: "{{CATEGORY2}}"
    name: "{{TECH2}}"
  - category: "{{CATEGORY3}}"
    name: "{{TECH3}}"
links:
  live: "{{LIVE_URL}}"
  github: "{{GITHUB_URL}}"
  caseStudy: "/projects/{{SLUG}}"
status: "{{STATUS}}"
featured: {{FEATURED}}
date:
  start: "{{START_DATE}}"
  end: "{{END_DATE}}"
metrics:
  performance: "{{PERFORMANCE}}"
  impact: "{{IMPACT}}"
  scale: "{{SCALE}}"
challenges:
  - "{{CHALLENGE1}}"
  - "{{CHALLENGE2}}"
solutions:
  - "{{SOLUTION1}}"
  - "{{SOLUTION2}}"
learnings:
  - "{{LEARNING1}}"
  - "{{LEARNING2}}"
---

## Project Overview

{{LONG_DESCRIPTION}}

## Technical Implementation

### Key Features
- Feature 1
- Feature 2
- Feature 3

### Technologies Used
- Technology 1
- Technology 2
- Technology 3

## Results and Impact

### Performance Metrics
- Metric 1
- Metric 2
- Metric 3

### Business Impact
- Impact 1
- Impact 2
- Impact 3

## Future Enhancements

- Enhancement 1
- Enhancement 2
- Enhancement 3
`;

async function createProject() {
  console.log("🚀 Creating a new project...\n");

  try {
    // Get project details
    const title = await question("Project title: ");
    const description = await question("Short description: ");
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    console.log("\n📝 Project details:");
    console.log(`Title: ${title}`);
    console.log(`Slug: ${slug}`);
    console.log(`Description: ${description}\n`);

    // Get technologies
    console.log("Available categories: ai, frontend, backend, devops, data");
    const tech1 = await question("Technology 1 (format: category:name): ");
    const tech2 = await question("Technology 2 (format: category:name): ");
    const tech3 = await question("Technology 3 (format: category:name): ");

    // Get tags
    const tagsInput = await question("Tags (comma-separated): ");
    const tags = tagsInput
      .split(",")
      .map((tag) => `"${tag.trim()}"`)
      .join(", ");

    // Get links
    const liveUrl = await question("Live URL (optional): ");
    const githubUrl = await question("GitHub URL (optional): ");

    // Get status and dates
    const status = await question("Status (completed/in-progress/archived): ");
    const featured = await question("Featured? (true/false): ");
    const startDate = await question("Start date (YYYY-MM-DD): ");
    const endDate = await question("End date (YYYY-MM-DD, optional): ");

    // Get metrics
    const performance = await question("Performance metric: ");
    const impact = await question("Impact description: ");
    const scale = await question("Scale description: ");

    // Get challenges and solutions
    const challenge1 = await question("Challenge 1: ");
    const challenge2 = await question("Challenge 2: ");
    const solution1 = await question("Solution 1: ");
    const solution2 = await question("Solution 2: ");
    const learning1 = await question("Learning 1: ");
    const learning2 = await question("Learning 2: ");

    // Get long description
    const longDescription = await question("Long description: ");

    // Parse technologies
    const [cat1, name1] = tech1.split(":");
    const [cat2, name2] = tech2.split(":");
    const [cat3, name3] = tech3.split(":");

    // Create content
    let content = projectTemplate
      .replace(/{{TITLE}}/g, title)
      .replace(/{{DESCRIPTION}}/g, description)
      .replace(/{{SLUG}}/g, slug)
      .replace(/{{TAGS}}/g, tags)
      .replace(/{{CATEGORY1}}/g, cat1.trim())
      .replace(/{{TECH1}}/g, name1.trim())
      .replace(/{{CATEGORY2}}/g, cat2.trim())
      .replace(/{{TECH2}}/g, name2.trim())
      .replace(/{{CATEGORY3}}/g, cat3.trim())
      .replace(/{{TECH3}}/g, name3.trim())
      .replace(/{{LIVE_URL}}/g, liveUrl || "")
      .replace(/{{GITHUB_URL}}/g, githubUrl || "")
      .replace(/{{STATUS}}/g, status)
      .replace(/{{FEATURED}}/g, featured)
      .replace(/{{START_DATE}}/g, startDate)
      .replace(/{{END_DATE}}/g, endDate || "")
      .replace(/{{PERFORMANCE}}/g, performance)
      .replace(/{{IMPACT}}/g, impact)
      .replace(/{{SCALE}}/g, scale)
      .replace(/{{CHALLENGE1}}/g, challenge1)
      .replace(/{{CHALLENGE2}}/g, challenge2)
      .replace(/{{SOLUTION1}}/g, solution1)
      .replace(/{{SOLUTION2}}/g, solution2)
      .replace(/{{LEARNING1}}/g, learning1)
      .replace(/{{LEARNING2}}/g, learning2)
      .replace(/{{LONG_DESCRIPTION}}/g, longDescription);

    // Write file
    const projectsDir = path.join(process.cwd(), "content", "projects");
    const filePath = path.join(projectsDir, `${slug}.md`);

    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir, { recursive: true });
    }

    fs.writeFileSync(filePath, content);

    console.log(`\n✅ Project created successfully!`);
    console.log(`📁 File: ${filePath}`);
    console.log(`🔗 URL: /projects/${slug}`);
    console.log(`\n📋 Next steps:`);
    console.log(`1. Add project image to /content/projects/${slug}.jpg`);
    console.log(`2. Review and edit the generated content`);
    console.log(`3. Test the project page`);
  } catch (error) {
    console.error("❌ Error creating project:", error);
  } finally {
    rl.close();
  }
}

createProject();
