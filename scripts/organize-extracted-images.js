#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Script to organize extracted images from PDF
 * Usage: node scripts/organize-extracted-images.js
 */

const IMAGES_DIR = path.join(
  __dirname,
  "../public/images/projects/foodmanager"
);

function organizeImages() {
  console.log("🖼️  Organizing extracted images...");

  const extractedImages = fs
    .readdirSync(IMAGES_DIR)
    .filter((file) => file.startsWith("extracted_"))
    .sort();

  console.log(`Found ${extractedImages.length} extracted images`);

  // Create organized directory structure
  const organizedDir = path.join(IMAGES_DIR, "extracted");
  if (!fs.existsSync(organizedDir)) {
    fs.mkdirSync(organizedDir, { recursive: true });
  }

  // Move and rename images with descriptive names
  const imageMappings = [
    {
      source: "extracted_-000.png",
      target: "01-main-interface.png",
      description: "Main application interface",
    },
    {
      source: "extracted_-002.png",
      target: "02-features-overview.png",
      description: "Features overview",
    },
    {
      source: "extracted_-003.png",
      target: "03-application-screenshot.png",
      description: "Application screenshot",
    },
    {
      source: "extracted_-004.png",
      target: "04-interface-detail.png",
      description: "Interface detail view",
    },
    {
      source: "extracted_-005.png",
      target: "05-ui-elements.png",
      description: "UI elements and components",
    },
    {
      source: "extracted_-006.png",
      target: "06-navigation.png",
      description: "Navigation and menu",
    },
    {
      source: "extracted_-007.png",
      target: "07-dashboard.png",
      description: "Main dashboard view",
    },
    {
      source: "extracted_-008.png",
      target: "08-recipe-suggestions.png",
      description: "AI recipe suggestions",
    },
    {
      source: "extracted_-009.png",
      target: "09-ingredient-management.png",
      description: "Ingredient management",
    },
    {
      source: "extracted_-010.png",
      target: "10-user-interface.png",
      description: "User interface components",
    },
    {
      source: "extracted_-011.png",
      target: "11-logo-banner.png",
      description: "Logo and branding",
    },
    {
      source: "extracted_-012.png",
      target: "12-diagram.png",
      description: "System diagram",
    },
    {
      source: "extracted_-013.png",
      target: "13-architecture.png",
      description: "System architecture",
    },
  ];

  imageMappings.forEach((mapping, index) => {
    const sourcePath = path.join(IMAGES_DIR, mapping.source);
    const targetPath = path.join(organizedDir, mapping.target);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(
        `✅ ${mapping.source} → ${mapping.target} (${mapping.description})`
      );
    } else {
      console.log(`⚠️  Missing: ${mapping.source}`);
    }
  });

  // Create a gallery index file
  const galleryContent = `# FoodManager Project Images

This directory contains all images extracted from the Senior Project Report PDF.

## Image Gallery

${imageMappings
  .map(
    (mapping, index) =>
      `### ${index + 1}. ${mapping.description}\n![${mapping.description}](./${
        mapping.target
      })\n`
  )
  .join("\n")}

## Usage in Portfolio

- **Main Project Image**: \`01-main-interface.png\`
- **Case Study Images**: \`03-application-screenshot.png\`, \`07-dashboard.png\`, \`08-recipe-suggestions.png\`
- **Technical Details**: \`12-diagram.png\`, \`13-architecture.png\`

## File Sizes

${imageMappings
  .map((mapping) => {
    const targetPath = path.join(organizedDir, mapping.target);
    if (fs.existsSync(targetPath)) {
      const stats = fs.statSync(targetPath);
      const sizeKB = Math.round(stats.size / 1024);
      return `- ${mapping.target}: ${sizeKB}KB`;
    }
    return `- ${mapping.target}: Not found`;
  })
  .join("\n")}
`;

  fs.writeFileSync(path.join(organizedDir, "README.md"), galleryContent);
  console.log("\n📁 Created organized image gallery in extracted/ directory");
  console.log("📄 Generated README.md with image descriptions");

  // Create symlinks for main project images
  const mainImages = [
    { source: "01-main-interface.png", target: "../foodmanager-main.png" },
    {
      source: "03-application-screenshot.png",
      target: "../foodmanager-interface.png",
    },
    { source: "07-dashboard.png", target: "../foodmanager-dashboard.png" },
  ];

  mainImages.forEach(({ source, target }) => {
    const sourcePath = path.join(organizedDir, source);
    const targetPath = path.join(IMAGES_DIR, target);

    if (fs.existsSync(sourcePath)) {
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
      }
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`🔗 Linked ${source} → ${target}`);
    }
  });

  console.log("\n🎉 Image organization complete!");
  console.log(`📊 Total images organized: ${imageMappings.length}`);
  console.log(`📁 Gallery location: ${organizedDir}`);
}

// Run the organization
organizeImages();

module.exports = { organizeImages };
