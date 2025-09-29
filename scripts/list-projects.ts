#!/usr/bin/env tsx

import {
  getAllProjects,
  getFeaturedProjects,
  getProjectCategories,
} from "../lib/content-server";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDuration(startDate: string, endDate?: string): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} days`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? "s" : ""}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? "s" : ""}`;
  }
}

function displayProject(project: any, index: number) {
  console.log(`\n${index + 1}. ${project.title}`);
  console.log(`   📝 ${project.description}`);
  console.log(`   🏷️  Tags: ${project.tags.join(", ")}`);
  console.log(
    `   🔧 Technologies: ${project.technologies
      .map((t: any) => t.name)
      .join(", ")}`
  );
  console.log(
    `   📅 Duration: ${formatDuration(project.date.start, project.date.end)}`
  );
  console.log(
    `   📊 Status: ${project.status} ${project.featured ? "⭐ (Featured)" : ""}`
  );

  if (project.links.github) {
    console.log(`   🔗 GitHub: ${project.links.github}`);
  }
  if (project.links.live) {
    console.log(`   🌐 Live: ${project.links.live}`);
  }

  if (project.metrics) {
    console.log(`   📈 Metrics:`);
    if (project.metrics.performance) {
      console.log(`      • Performance: ${project.metrics.performance}`);
    }
    if (project.metrics.impact) {
      console.log(`      • Impact: ${project.metrics.impact}`);
    }
    if (project.metrics.scale) {
      console.log(`      • Scale: ${project.metrics.scale}`);
    }
  }
}

function displayCategories() {
  const categories = getProjectCategories();

  console.log("\n📂 Project Categories:");
  categories.forEach((category) => {
    console.log(`\n${category.name.toUpperCase()}`);
    console.log(`   ${category.description}`);
    console.log(`   Projects: ${category.projects.length}`);

    category.projects.forEach((project, index) => {
      console.log(
        `   ${index + 1}. ${project.title} ${project.featured ? "⭐" : ""}`
      );
    });
  });
}

async function main() {
  console.log("🚀 Portfolio Project Manager\n");

  const allProjects = getAllProjects();
  const featuredProjects = getFeaturedProjects();

  console.log(`📊 Portfolio Statistics:`);
  console.log(`   Total Projects: ${allProjects.length}`);
  console.log(`   Featured Projects: ${featuredProjects.length}`);
  console.log(
    `   Completed: ${
      allProjects.filter((p) => p.status === "completed").length
    }`
  );
  console.log(
    `   In Progress: ${
      allProjects.filter((p) => p.status === "in-progress").length
    }`
  );
  console.log(
    `   Archived: ${allProjects.filter((p) => p.status === "archived").length}`
  );

  if (featuredProjects.length > 0) {
    console.log("\n⭐ Featured Projects:");
    featuredProjects.forEach((project, index) => {
      displayProject(project, index);
    });
  }

  console.log("\n📋 All Projects:");
  allProjects.forEach((project, index) => {
    displayProject(project, index);
  });

  displayCategories();

  console.log("\n✅ Project listing complete!");
  console.log("\n💡 Tips:");
  console.log('   • Use "npm run create-project" to add new projects');
  console.log("   • Edit project files in /content/projects/");
  console.log("   • Add project images to /content/projects/");
}

main().catch(console.error);
