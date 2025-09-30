#!/usr/bin/env node

/**
 * Script to download company logos for the timeline
 * This script helps find and download logos for companies that might not have been found
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

// Company logo sources and fallback URLs
const logoSources = {
  mercor: [
    "https://logo.clearbit.com/mercor.com",
    "https://logo.clearbit.com/mercor.io",
  ],
  cochat: [
    "https://logo.clearbit.com/cochat.io",
    "https://logo.clearbit.com/cochat.com",
  ],
  afterquery: [
    "https://logo.clearbit.com/afterquery.com",
    "https://logo.clearbit.com/afterquery.io",
  ],
  tribot: [
    "https://logo.clearbit.com/tribot.com",
    "https://logo.clearbit.com/tribot.io",
  ],
  calpoly: [
    "https://logo.clearbit.com/calpoly.edu",
    "https://logo.clearbit.com/calpoly.org",
  ],
  ccsf: [
    "https://logo.clearbit.com/ccsf.edu",
    "https://logo.clearbit.com/ccsf.org",
  ],
  ricoh: [
    "https://logo.clearbit.com/ricoh-usa.com",
    "https://logo.clearbit.com/ricoh.com",
  ],
  square: [
    "https://logo.clearbit.com/squareup.com",
    "https://logo.clearbit.com/square.com",
  ],
  linkedin: [
    "https://logo.clearbit.com/linkedin.com",
    "https://logo.clearbit.com/linkedin.org",
  ],
};

function downloadLogo(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);

    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            console.log(`✅ Downloaded: ${filename}`);
            resolve();
          });
        } else {
          console.log(
            `❌ Failed to download ${url} (Status: ${response.statusCode})`
          );
          reject(new Error(`HTTP ${response.statusCode}`));
        }
      })
      .on("error", (err) => {
        console.log(`❌ Error downloading ${url}: ${err.message}`);
        reject(err);
      });
  });
}

async function downloadAllLogos() {
  const logosDir = path.join(__dirname, "..", "public", "logos");

  // Ensure logos directory exists
  if (!fs.existsSync(logosDir)) {
    fs.mkdirSync(logosDir, { recursive: true });
  }

  console.log("🚀 Starting logo downloads...\n");

  for (const [company, urls] of Object.entries(logoSources)) {
    const filename = path.join(logosDir, `${company}.png`);

    // Skip if logo already exists and has content
    if (fs.existsSync(filename) && fs.statSync(filename).size > 100) {
      console.log(`⏭️  Skipping ${company} (already exists)`);
      continue;
    }

    console.log(`📥 Downloading ${company} logo...`);

    let downloaded = false;
    for (const url of urls) {
      try {
        await downloadLogo(url, filename);
        downloaded = true;
        break;
      } catch (error) {
        // Try next URL
        continue;
      }
    }

    if (!downloaded) {
      console.log(`⚠️  Could not download ${company} logo from any source`);
    }
  }

  console.log("\n✨ Logo download process completed!");
  console.log("\n📋 Next steps:");
  console.log("1. Check the downloaded logos in public/logos/");
  console.log("2. Replace any placeholder logos with better ones if needed");
  console.log("3. Test the timeline in your browser");
}

// Run the script
downloadAllLogos().catch(console.error);
