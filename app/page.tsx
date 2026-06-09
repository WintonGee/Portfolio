import HomeClient from "./HomeClient";
import { loadHomeContent, loadProjects } from "@/lib/content-loader";
import type { SkillData } from "@/types/skill";
import type { TimelineItem } from "@/types/timeline";

export const dynamic = "force-dynamic";

interface TechItem {
  name: string;
  logo: string;
}
type TechEntry = TechItem | TechItem[];

export default async function Home() {
  const [content, projects] = await Promise.all([
    loadHomeContent(),
    loadProjects(),
  ]);

  const about = (content.about ?? { technologies: {} }) as {
    technologies: Record<string, TechEntry[]>;
  };

  return (
    <HomeClient
      projects={projects}
      technologies={about.technologies ?? {}}
      skills={(content.skills ?? {}) as Record<string, SkillData>}
      timeline={(content.timeline ?? []) as TimelineItem[]}
    />
  );
}
