// Utility functions for the portfolio

// Date extraction utilities
export function extractStartDate(dateString: string): number {
  const dateFormats = [
    /(\w+)\s+(\d{4})/, // "July 2025" or "September 2022"
    /(\d{4})/, // Just year
  ];

  for (const format of dateFormats) {
    const match = dateString.match(format);
    if (match) {
      if (match[1] && match[2]) {
        // Month and year format
        const month = match[1];
        const year = parseInt(match[2]);
        const monthMap: { [key: string]: number } = {
          January: 1,
          February: 2,
          March: 3,
          April: 4,
          May: 5,
          June: 6,
          July: 7,
          August: 8,
          September: 9,
          October: 10,
          November: 11,
          December: 12,
        };
        return year + (monthMap[month] || 0) / 12;
      } else if (match[1]) {
        // Just year
        return parseInt(match[1]);
      }
    }
  }

  return 0;
}

// Common animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Common CSS classes
export const commonClasses = {
  container: "container mx-auto px-4",
  section: "py-32",
  heading: "text-5xl font-bold text-brand-text mb-6",
  subheading: "text-xl text-brand-text-light max-w-3xl mx-auto",
  card: "bg-brand-beige-light rounded-2xl p-4 shadow-organic-xl border border-brand-secondary/20",
  button:
    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
} as const;
