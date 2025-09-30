// About section data and constants

export const STATS_DATA = [
  {
    value: "2+",
    label: "Years Experience",
  },
  {
    value: "10+",
    label: "Projects",
  },
  {
    value: "5+",
    label: "Technologies",
  },
  {
    value: "1",
    label: "Featured Project",
  },
];

// Proficiency levels for visual indicators
export type ProficiencyLevel = "expert" | "advanced" | "proficient";

export interface Technology {
  name: string;
  proficiency: ProficiencyLevel;
}

export const TECHNOLOGIES: Record<string, Technology[]> = {
  "AI & Machine Learning": [
    { name: "Python", proficiency: "expert" },
    { name: "OpenAI API", proficiency: "expert" },
    { name: "Google Gemini AI", proficiency: "expert" },
    { name: "TensorFlow", proficiency: "advanced" },
    { name: "AI Integration", proficiency: "expert" },
    { name: "RAG Systems", proficiency: "advanced" },
  ],
  "Frontend Development": [
    { name: "TypeScript", proficiency: "expert" },
    { name: "JavaScript", proficiency: "expert" },
    { name: "React.js", proficiency: "expert" },
    { name: "Next.js", proficiency: "advanced" },
    { name: "Tailwind CSS", proficiency: "expert" },
    { name: "Material-UI", proficiency: "advanced" },
    { name: "HTML/CSS", proficiency: "expert" },
  ],
  "Backend & Database": [
    { name: "Node.js", proficiency: "expert" },
    { name: "Express.js", proficiency: "advanced" },
    { name: "MongoDB", proficiency: "advanced" },
    { name: "Supabase", proficiency: "proficient" },
    { name: "SQL", proficiency: "expert" },
    { name: "JWT Authentication", proficiency: "advanced" },
    { name: "REST APIs", proficiency: "expert" },
    { name: "Axios", proficiency: "expert" },
  ],
};

// Color mapping for proficiency levels
export const PROFICIENCY_COLORS = {
  expert: {
    bg: "bg-brand-primary",
    text: "text-white",
    border: "border-brand-primary-dark",
    shadow: "shadow-organic-lg",
  },
  advanced: {
    bg: "bg-brand-secondary",
    text: "text-white",
    border: "border-brand-secondary-dark",
    shadow: "shadow-organic",
  },
  proficient: {
    bg: "bg-brand-beige-light",
    text: "text-brand-text",
    border: "border-brand-secondary/50",
    shadow: "shadow-organic",
  },
};
