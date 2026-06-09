// Skill data types (relocated from data/skills-data.ts so the data file can live
// in D1 instead of the repo).

export interface SkillUsage {
  projectId: string;
  projectTitle: string;
  usage: string; // How the skill was used in the project
  category: "ai" | "frontend" | "backend" | "devops" | "data";
}

export interface SkillData {
  name: string;
  logo: string;
  description: string;
  category: "ai" | "frontend" | "backend" | "devops" | "data";
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
  usage: SkillUsage[];
}
