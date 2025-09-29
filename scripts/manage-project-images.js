#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Script to manage project images and organization
 * Usage: node scripts/manage-project-images.js [command]
 */

const PROJECTS_DIR = path.join(__dirname, "../content/projects");
const IMAGES_DIR = path.join(__dirname, "../public/images/projects");

function listProjects() {
  console.log("📁 Available Projects:");
  const projects = fs
    .readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  projects.forEach((project) => {
    console.log(`  📂 ${project}`);
    const projectDir = path.join(PROJECTS_DIR, project);
    const files = fs.readdirSync(projectDir);
    files.forEach((file) => {
      console.log(`    📄 ${file}`);
    });
  });
}

function createProjectStructure(projectName) {
  const projectDir = path.join(PROJECTS_DIR, projectName);
  const imagesDir = path.join(IMAGES_DIR, projectName);

  // Create project directory
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
    console.log(`✅ Created project directory: ${projectDir}`);
  }

  // Create images directory
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log(`✅ Created images directory: ${imagesDir}`);
  }

  // Create README template
  const readmePath = path.join(projectDir, "README.md");
  if (!fs.existsSync(readmePath)) {
    const readmeContent = `# ${projectName} Project

This folder contains all the documentation and resources for the ${projectName} project.

## Contents

- Add your project documentation here
- Include any relevant files or reports

## Project Overview

[Describe your project here]

## Technologies Used

- List your technologies here

## Project Links

- GitHub Repository: [Add your GitHub link]
- Live Demo: [Add your live demo link if available]

## Development Timeline

- Start Date: [Add start date]
- End Date: [Add end date]
- Duration: [Add duration]
- Team Size: [Add team size]
- Role: [Add your role]
`;

    fs.writeFileSync(readmePath, readmeContent);
    console.log(`✅ Created README template: ${readmePath}`);
  }

  console.log(`🎉 Project structure created for: ${projectName}`);
}

function generatePlaceholderImage(
  projectName,
  imageName,
  width = 800,
  height = 600
) {
  const imagesDir = path.join(IMAGES_DIR, projectName);
  const imagePath = path.join(imagesDir, `${imageName}.svg`);

  const svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#gradient)"/>
  <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="48px" font-weight="bold" fill="white" text-anchor="middle">📱</text>
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="24px" fill="rgba(255, 255, 255, 0.8)" text-anchor="middle">${projectName} Project</text>
  <text x="50%" y="65%" font-family="Arial, sans-serif" font-size="18px" fill="rgba(255, 255, 255, 0.7)" text-anchor="middle">Project Screenshot</text>
</svg>`;

  fs.writeFileSync(imagePath, svgContent);
  console.log(`✅ Created placeholder image: ${imagePath}`);
}

// Command line interface
const command = process.argv[2];
const projectName = process.argv[3];

switch (command) {
  case "list":
    listProjects();
    break;
  case "create":
    if (!projectName) {
      console.error(
        "❌ Please provide a project name: node scripts/manage-project-images.js create [project-name]"
      );
      process.exit(1);
    }
    createProjectStructure(projectName);
    break;
  case "placeholder":
    if (!projectName) {
      console.error(
        "❌ Please provide a project name: node scripts/manage-project-images.js placeholder [project-name] [image-name]"
      );
      process.exit(1);
    }
    const imageName = process.argv[4] || "placeholder";
    generatePlaceholderImage(projectName, imageName);
    break;
  default:
    console.log(`
📁 Project Image Manager

Usage:
  node scripts/manage-project-images.js [command] [options]

Commands:
  list                    - List all projects and their contents
  create [project-name]   - Create organized folder structure for a new project
  placeholder [project] [image] - Generate placeholder image for a project

Examples:
  node scripts/manage-project-images.js list
  node scripts/manage-project-images.js create my-new-project
  node scripts/manage-project-images.js placeholder my-project main-image
`);
}

module.exports = {
  listProjects,
  createProjectStructure,
  generatePlaceholderImage,
};
