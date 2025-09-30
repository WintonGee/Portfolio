import { TimelineItem, TimelineData, FilterCategory } from "../types/timeline";
import { extractStartDate } from "./utils";
import { TIMELINE_CONFIG } from "./timeline-constants";

// Sort items chronologically (oldest first)
export function sortItemsChronologically(
  items: TimelineItem[]
): TimelineItem[] {
  return [...items].sort((a, b) => {
    const dateA = extractStartDate(a.year);
    const dateB = extractStartDate(b.year);
    return dateA - dateB;
  });
}

// Add spacing for overlapping points
export function addSpacingToOverlappingPoints(
  items: TimelineItem[]
): TimelineItem[] {
  const sortedItems = sortItemsChronologically(items);
  const spacedItems: TimelineItem[] = [];
  const spacingThreshold = TIMELINE_CONFIG.SPACING_THRESHOLD;

  for (let i = 0; i < sortedItems.length; i++) {
    const currentItem = { ...sortedItems[i] };
    const currentDate = extractStartDate(currentItem.year);

    // Check if this point is too close to the previous one
    if (spacedItems.length > 0) {
      const lastItem = spacedItems[spacedItems.length - 1];
      const lastDate = extractStartDate(lastItem.year);

      if (currentDate - lastDate < spacingThreshold) {
        // Add spacing by adjusting the date slightly, but preserve the original year range
        const adjustedDate = lastDate + spacingThreshold;
        const year = Math.floor(adjustedDate);
        const month = Math.round((adjustedDate % 1) * 12) + 1;
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        // Only modify the year if it's a single date, preserve ranges
        if (!currentItem.year.includes(" - ")) {
          currentItem.year = `${monthNames[month - 1]} ${year}`;
        }
        // For date ranges, keep the original year but adjust the internal date for positioning
        (currentItem as any)._adjustedDate = adjustedDate;
      }
    }

    spacedItems.push(currentItem);
  }

  return spacedItems;
}

// Filter items by category
export function filterItemsByCategory(
  items: TimelineItem[],
  category: FilterCategory
): TimelineItem[] {
  return category === "all"
    ? items
    : items.filter((item) => item.category === category);
}

// Transform items to chart data
export function transformToChartData(items: TimelineItem[]): TimelineData[] {
  return items.map((item, index) => ({
    year: (item as any)._adjustedDate || extractStartDate(item.year),
    progression: index + 1,
    item: item,
    isCurrent: item.isCurrent ?? false,
    category: item.category,
    type: item.type,
  }));
}

// Get category color
export function getCategoryColor(category: string, isCurrent: boolean): string {
  if (isCurrent) return TIMELINE_CONFIG.COLORS.current;
  if (category === "professional") return TIMELINE_CONFIG.COLORS.professional;
  return TIMELINE_CONFIG.COLORS.academic;
}
