// Timeline-related types

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  institution?: string;
  isCurrent?: boolean;
  category: "professional" | "academic";
  type?: string; // e.g., "Internship", "Full-time", "Research", "Education"
}

export interface TimelineData {
  year: number;
  progression: number;
  item: TimelineItem;
  isCurrent: boolean;
  category: string;
  type?: string;
}

export type FilterCategory = "all" | "professional" | "academic";

export interface FilterOption {
  key: FilterCategory;
  label: string;
  color: string;
}
