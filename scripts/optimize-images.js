#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Check if sharp is available, if not install it
function ensureSharp() {
  try {
    require("sharp");
  } catch (error) {
    console.log("Installing sharp for image optimization...");
    execSync("npm install sharp --save-dev", { stdio: "inherit" });
  }
}

async function optimizeImages() {
  ensureSharp();
  const sharp = require("sharp");

  const publicDir = path.join(__dirname, "..", "public");
  const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  // Function to process a single image
  async function processImage(filePath, outputDir) {
    const ext = path.extname(filePath).toLowerCase();
    if (!imageExtensions.includes(ext)) return;

    const fileName = path.basename(filePath, ext);
    const webpPath = path.join(outputDir, `${fileName}.webp`);
    const avifPath = path.join(outputDir, `${fileName}.avif`);

    try {
      // Create WebP version (80% quality)
      await sharp(filePath).webp({ quality: 80 }).toFile(webpPath);

      // Create AVIF version (80% quality) - better compression than WebP
      await sharp(filePath).avif({ quality: 80 }).toFile(avifPath);

      console.log(`✅ Optimized: ${path.basename(filePath)}`);
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }

  // Function to recursively process directories
  async function processDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        await processDirectory(itemPath);
      } else if (stat.isFile()) {
        await processImage(itemPath, dir);
      }
    }
  }

  console.log("🚀 Starting image optimization...");
  await processDirectory(publicDir);
  console.log("✨ Image optimization complete!");
}

// Run the optimization
optimizeImages().catch(console.error);
