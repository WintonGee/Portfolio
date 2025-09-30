import { FilterOption } from "../types/timeline";

// Timeline configuration constants
export const TIMELINE_CONFIG = {
  SPACING_THRESHOLD: 0.15, // Minimum spacing between points (in years)
  CHART_HEIGHT: {
    mobile: 600,
    desktop: 700,
  },
  COLORS: {
    professional: "#6366f1",
    academic: "#10b981",
    current: "#ef4444",
  },
} as const;

// Filter options for timeline
export const FILTER_OPTIONS: FilterOption[] = [
  { key: "all", label: "All", color: "bg-brand-primary" },
  { key: "professional", label: "Professional", color: "bg-brand-primary" },
  { key: "academic", label: "Academic", color: "bg-brand-secondary" },
];

// Hover descriptions for timeline items
export const HOVER_DESCRIPTIONS: Record<string, string> = {
  "AI Engineer":
    "Working with top foundational model labs to improve AI output quality and reduce hallucinations across 25+ backend tasks.",
  Founder:
    "Founded CoChat.io, an AI-driven platform for interactive online personas. Launched MVP with TypeScript/React and PostgreSQL.",
  "Python Software Engineer":
    "Trained and refined AI models for backend code generation using Python and LLMs, increasing model reliability.",
  "Software Engineer Intern":
    "Built scalable AWS Lambda microservices in Python, automating processing of 150M+ USPS data points.",
  "Software Developer":
    "Developed and maintained software solutions with API development focus. Modernized legacy backend with Java 8.",
  "Computers & Technology Apprentice":
    "Gained foundational experience in corporate technology stacks and enterprise software development.",
  "B.S. Computer Science":
    "Earned Bachelor of Science in Computer Science from Cal Poly, specializing in AI/ML with advanced coursework in machine learning and neural networks.",
  "Data Science, Mathematics, Engineering":
    "Advanced studies in data science, mathematics, and engineering at CCSF, focusing on statistical analysis and machine learning algorithms.",
  "Building a Formal CS Foundation":
    "Built rigorous foundation in data structures, algorithms, and software engineering at City College.",
  "AI Ethics Research":
    "Conducted research on ethical implications of AI systems, proposing fairness reforms for risk assessment tools.",
};
