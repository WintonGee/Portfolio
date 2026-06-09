import { cached, CACHE_KEYS } from "./cache";
import { getContentBlock } from "./db/content";
import { listProjects, type ProjectRow } from "./db/projects";
import type { Project } from "@/types/project";

export interface HomeContent {
  about: { stats: unknown; technologies: unknown } | null;
  skills: unknown | null;
  timeline: unknown | null;
}

export async function loadHomeContent(): Promise<HomeContent> {
  return cached(CACHE_KEYS.home, 60, async () => ({
    about: await getContentBlock("about"),
    skills: await getContentBlock("skills"),
    timeline: await getContentBlock("timeline"),
  }));
}

export async function loadProjects(): Promise<Project[]> {
  const rows = await cached<ProjectRow[]>(CACHE_KEYS.projects, 60, listProjects);
  return rows.map((r) => r.data as unknown as Project);
}
