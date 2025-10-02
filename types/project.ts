export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  images?: string[]; // Additional project images
  tags: string[];
  technologies: {
    category: "ai" | "frontend" | "backend" | "devops" | "data";
    name: string;
  }[];
  links: {
    live?: string;
    github?: string;
    demo?: string;
    caseStudy?: string;
    report?: string;
  };
  status: "completed" | "in-progress" | "archived";
  featured: boolean;
  date: {
    start: string; // YYYY-MM-DD format
    end?: string; // YYYY-MM-DD format, optional for ongoing projects
  };
  metrics?: {
    performance?: string;
    impact?: string;
    scale?: string;
  };
  challenges?: string[];
  solutions?: string[];
  learnings?: string[];
}

export interface ProjectCategory {
  name: string;
  description: string;
  projects: Project[];
}

export interface ProjectFilters {
  category?: string;
  status?: Project["status"];
  featured?: boolean;
  technology?: string;
}
