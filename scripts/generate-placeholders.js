const fs = require("fs");
const path = require("path");

// Create placeholder images using canvas (Node.js)
const { createCanvas } = require("canvas");

function createPlaceholderImage(width, height, text, filename) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#667eea");
  gradient.addColorStop(1, "#764ba2");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add white overlay
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.fillRect(0, 0, width, height);

  // Add text
  ctx.fillStyle = "white";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);

  // Add subtitle
  ctx.font = "18px Arial";
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillText("FoodManager Project", width / 2, height / 2 + 40);

  // Save image
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(filename, buffer);
  console.log(`Created placeholder: ${filename}`);
}

// Create placeholder images
const projectDir = path.join(
  __dirname,
  "../public/images/projects/foodmanager"
);

// Main project image
createPlaceholderImage(
  800,
  600,
  "🍽️",
  path.join(projectDir, "foodmanager.jpg")
);

// Dashboard image
createPlaceholderImage(
  800,
  600,
  "📊",
  path.join(projectDir, "foodmanager-dashboard.jpg")
);

console.log("Placeholder images created successfully!");
