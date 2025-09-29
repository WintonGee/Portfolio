import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Project, ProjectCategory, ProjectFilters } from "@/types/project";

const contentDirectory = path.join(process.cwd(), "content");

// Get all project files
export function getAllProjectFiles(): string[] {
  const projectsPath = path.join(contentDirectory, "projects");

  if (!fs.existsSync(projectsPath)) {
    return [];
  }

  return fs
    .readdirSync(projectsPath)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(projectsPath, file));
}

// Parse a single project file
export function getProjectBySlug(slug: string): Project | null {
  const filePath = path.join(contentDirectory, "projects", `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    id: slug,
    ...data,
    longDescription: content,
  } as Project;
}

// Get all projects
export function getAllProjects(): Project[] {
  const files = getAllProjectFiles();

  return files
    .map((file) => {
      const slug = path.basename(file, ".md");
      return getProjectBySlug(slug);
    })
    .filter((project): project is Project => project !== null)
    .sort(
      (a, b) =>
        new Date(b.date.start).getTime() - new Date(a.date.start).getTime()
    );
}

// Get featured projects
export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((project) => project.featured);
}

// Get projects by category
export function getProjectsByCategory(category: string): Project[] {
  return getAllProjects().filter((project) =>
    project.technologies.some((tech) => tech.category === category)
  );
}

// Get projects by status
export function getProjectsByStatus(status: Project["status"]): Project[] {
  return getAllProjects().filter((project) => project.status === status);
}

// Filter projects
export function filterProjects(filters: ProjectFilters): Project[] {
  let projects = getAllProjects();

  if (filters.category) {
    projects = projects.filter((project) =>
      project.technologies.some((tech) => tech.category === filters.category)
    );
  }

  if (filters.status) {
    projects = projects.filter((project) => project.status === filters.status);
  }

  if (filters.featured !== undefined) {
    projects = projects.filter(
      (project) => project.featured === filters.featured
    );
  }

  if (filters.technology) {
    projects = projects.filter((project) =>
      project.technologies.some((tech) =>
        tech.name.toLowerCase().includes(filters.technology!.toLowerCase())
      )
    );
  }

  return projects;
}

// Get project categories
export function getProjectCategories(): ProjectCategory[] {
  const projects = getAllProjects();
  const categories: { [key: string]: Project[] } = {};

  projects.forEach((project) => {
    project.technologies.forEach((tech) => {
      if (!categories[tech.category]) {
        categories[tech.category] = [];
      }
      if (!categories[tech.category].find((p) => p.id === project.id)) {
        categories[tech.category].push(project);
      }
    });
  });

  return Object.entries(categories).map(([name, projectList]) => ({
    name,
    description: getCategoryDescription(name),
    projects: projectList,
  }));
}

function getCategoryDescription(category: string): string {
  const descriptions: { [key: string]: string } = {
    ai: "Artificial Intelligence and Machine Learning projects",
    frontend: "Frontend development and user interface projects",
    backend: "Backend development and API projects",
    devops: "DevOps, deployment, and infrastructure projects",
    data: "Data science, analysis, and visualization projects",
  };

  return descriptions[category] || "Project category";
}

// Get related projects
export function getRelatedProjects(
  currentProject: Project,
  limit: number = 3
): Project[] {
  const allProjects = getAllProjects();
  const currentTags = currentProject.tags;

  return allProjects
    .filter((project) => project.id !== currentProject.id)
    .map((project) => ({
      project,
      score: project.tags.filter((tag) => currentTags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.project);
}
