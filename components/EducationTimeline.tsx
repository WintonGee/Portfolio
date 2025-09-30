"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  institution?: string;
  isCurrent?: boolean;
  category: "professional" | "academic";
  type?: string; // e.g., "Internship", "Full-time", "Research", "Education"
}

// Helper function to extract start date from date string
function extractStartDate(dateString: string): number {
  // Handle different date formats
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

// Helper function to sort items chronologically (oldest first)
function sortItemsChronologically(items: TimelineItem[]): TimelineItem[] {
  return [...items].sort((a, b) => {
    const dateA = extractStartDate(a.year);
    const dateB = extractStartDate(b.year);
    return dateA - dateB;
  });
}

// Helper function to add spacing for overlapping points
function addSpacingToOverlappingPoints(items: TimelineItem[]): TimelineItem[] {
  const sortedItems = sortItemsChronologically(items);
  const spacedItems: TimelineItem[] = [];
  const spacingThreshold = 0.15; // Minimum spacing between points (in years)

  for (let i = 0; i < sortedItems.length; i++) {
    const currentItem = { ...sortedItems[i] };
    const currentDate = extractStartDate(currentItem.year);

    // Check if this point is too close to the previous one
    if (spacedItems.length > 0) {
      const lastItem = spacedItems[spacedItems.length - 1];
      const lastDate = extractStartDate(lastItem.year);

      if (currentDate - lastDate < spacingThreshold) {
        // Add spacing by adjusting the date slightly
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
        currentItem.year = `${monthNames[month - 1]} ${year}`;
      }
    }

    spacedItems.push(currentItem);
  }

  return spacedItems;
}

interface UnifiedTimelineProps {
  items: TimelineItem[];
}

function UnifiedTimeline({ items }: UnifiedTimelineProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [filterCategory, setFilterCategory] = useState<
    "all" | "professional" | "academic"
  >("all");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sort items chronologically and add spacing for overlapping points
  const sortedItems = addSpacingToOverlappingPoints(items);

  // Filter items based on selected category
  const filteredItems =
    filterCategory === "all"
      ? sortedItems
      : sortedItems.filter((item) => item.category === filterCategory);

  // Prepare data for Recharts with separate lines
  const professionalItems = filteredItems.filter(
    (item) => item.category === "professional"
  );
  const academicItems = filteredItems.filter(
    (item) => item.category === "academic"
  );

  const professionalData = professionalItems.map((item, index) => ({
    year: extractStartDate(item.year),
    progression: index + 1,
    item: item,
    isCurrent: item.isCurrent,
    category: item.category,
    type: item.type,
  }));

  const academicData = academicItems.map((item, index) => ({
    year: extractStartDate(item.year),
    progression: index + 1,
    item: item,
    isCurrent: item.isCurrent,
    category: item.category,
    type: item.type,
  }));

  // Custom dot component for timeline points with visible labels
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const isCurrent = payload?.isCurrent;
    const category = payload?.category;
    const item = payload?.item;

    // Different colors for different categories
    const getCategoryColor = (cat: string) => {
      if (isCurrent) return "#ef4444"; // Red for current
      if (cat === "professional") return "#6366f1"; // Blue for professional
      return "#10b981"; // Green for academic
    };

    const color = getCategoryColor(category);

    return (
      <g>
        {/* Main dot */}
        <motion.circle
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: payload.progression * 0.1 }}
          cx={cx}
          cy={cy}
          r={10}
          fill={color}
          stroke={color}
          strokeWidth={3}
          className="cursor-pointer hover:r-14 transition-all duration-300"
          onClick={() =>
            setActiveIndex(
              activeIndex === payload.progression - 1
                ? null
                : payload.progression - 1
            )
          }
          onMouseEnter={() =>
            !isMobile && setActiveIndex(payload.progression - 1)
          }
          onMouseLeave={() => !isMobile && setActiveIndex(null)}
        />

        {/* Category indicator */}
        <motion.circle
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: payload.progression * 0.1 + 0.2 }}
          cx={cx}
          cy={cy}
          r={4}
          fill="white"
          className="pointer-events-none"
        />

        {/* Visible label */}
        <motion.text
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: payload.progression * 0.1 + 0.3 }}
          x={cx}
          y={cy - 20}
          textAnchor="middle"
          className="text-xs font-medium fill-gray-700 pointer-events-none"
          style={{ fontSize: "10px" }}
        >
          {item?.title}
        </motion.text>

        {/* Institution/Type label */}
        <motion.text
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: payload.progression * 0.1 + 0.4 }}
          x={cx}
          y={cy + 25}
          textAnchor="middle"
          className="text-xs fill-gray-500 pointer-events-none"
          style={{ fontSize: "9px" }}
        >
          {item?.institution?.split(",")[0] || item?.type}
        </motion.text>
      </g>
    );
  };

  // Helper function to get concise hover description
  const getHoverDescription = (item: TimelineItem): string => {
    const descriptions: { [key: string]: string } = {
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

    return descriptions[item.title] || item.description;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-brand-beige-light rounded-2xl p-4 shadow-organic-xl border border-brand-secondary/20 max-w-sm">
          <div className="space-y-3">
            {/* Year badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 text-brand-primary border border-brand-primary/20">
              {data.item.year}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-brand-text">
              {data.item.title}
            </h3>

            {/* Institution */}
            {data.item.institution && (
              <p className="text-brand-primary font-medium text-sm">
                {data.item.institution}
              </p>
            )}

            {/* Concise Description */}
            <p className="text-brand-text-light leading-relaxed text-sm">
              {getHoverDescription(data.item)}
            </p>

            {/* Current status indicator */}
            {data.item.isCurrent && (
              <div className="flex items-center text-brand-primary text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-brand-primary mr-2 animate-pulse"></div>
                Currently Working
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h4 className="text-3xl font-bold text-brand-text mb-2">My Journey</h4>
        <div className="w-24 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto rounded-full mb-6"></div>

        {/* Filter Controls */}
        <div className="flex justify-center gap-4 mb-8">
          {[
            { key: "all", label: "All", color: "bg-gray-500" },
            {
              key: "professional",
              label: "Professional",
              color: "bg-blue-500",
            },
            { key: "academic", label: "Academic", color: "bg-green-500" },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilterCategory(filter.key as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filterCategory === filter.key
                  ? `${filter.color} text-white shadow-lg`
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Chart Container */}
      <div className="relative h-[600px] md:h-[700px] bg-gradient-to-br from-brand-beige/30 to-brand-beige-light/30 rounded-2xl p-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart margin={{ top: 60, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(107, 114, 128, 0.1)"
            />
            <XAxis
              type="number"
              dataKey="year"
              domain={["dataMin - 1", "dataMax + 1"]}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={{ stroke: "#6B7280" }}
              tickLine={{ stroke: "#6B7280" }}
              label={{
                value: "Timeline (Years)",
                position: "insideBottom",
                offset: -10,
                style: { textAnchor: "middle", fontSize: 14, fill: "#6B7280" },
              }}
            />
            <YAxis
              type="number"
              domain={[
                0,
                Math.max(professionalItems.length, academicItems.length) + 1,
              ]}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={{ stroke: "#6B7280" }}
              tickLine={{ stroke: "#6B7280" }}
              label={{
                value: "Career Progression",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fontSize: 14, fill: "#6B7280" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Professional Line */}
            {professionalData.length > 0 && (
              <Line
                data={professionalData}
                type="monotone"
                dataKey="progression"
                stroke="#6366f1"
                strokeWidth={3}
                dot={<CustomDot />}
                activeDot={{ r: 12, stroke: "#6366f1", strokeWidth: 3 }}
                fill="url(#professionalGradient)"
                name="Professional"
              />
            )}

            {/* Academic Line */}
            {academicData.length > 0 && (
              <Line
                data={academicData}
                type="monotone"
                dataKey="progression"
                stroke="#10b981"
                strokeWidth={3}
                dot={<CustomDot />}
                activeDot={{ r: 12, stroke: "#10b981", strokeWidth: 3 }}
                fill="url(#academicGradient)"
                name="Academic"
              />
            )}

            <defs>
              <linearGradient
                id="professionalGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="rgba(99, 102, 241, 0.3)" />
                <stop offset="100%" stopColor="rgba(99, 102, 241, 0.05)" />
              </linearGradient>
              <linearGradient id="academicGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(16, 185, 129, 0.3)" />
                <stop offset="100%" stopColor="rgba(16, 185, 129, 0.05)" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const timelineData: TimelineItem[] = [
  // Professional Experience
  {
    year: "July 2024 - Present",
    title: "AI Engineer",
    description:
      "Working with top foundational model labs to improve output quality and provide actionable feedback to enhance multimodal generative AI. Increased model-generated code correctness by 5% and reduced hallucinations across 25+ backend tasks.",
    institution: "Mercor",
    isCurrent: true,
    category: "professional",
    type: "Full-time",
  },
  {
    year: "April 2024 - August 2024",
    title: "Founder",
    description:
      "Founded CoChat.io, an AI-driven platform for interactive online personas. Launched MVP in TypeScript/React with PostgreSQL + Supabase backend, shipping core features to 15 test users. Engineered AI personalization with embeddings and RAG pipelines.",
    institution: "CoChat.io",
    category: "professional",
    type: "Startup",
  },
  {
    year: "March 2024 - April 2024",
    title: "Python Software Engineer",
    description:
      "Trained and refined AI models to improve their backend code generation capabilities using Python and LLMs. Developed and evaluated backend code generation in Python and Java for three top foundational model labs, increasing model reliability.",
    institution: "AfterQuery Experts",
    category: "professional",
    type: "Contract",
  },
  {
    year: "September 2022 - December 2022",
    title: "AI Ethics Research",
    description:
      "Conducted research into the ethical implications and societal impact of advancing artificial intelligence systems. Proposed fairness reforms for AI risk assessment tools by evaluating 5 research papers focused on bias mitigation.",
    institution: "Cal Poly, San Luis Obispo",
    category: "professional",
    type: "Research",
  },
  {
    year: "June 2023 - September 2023",
    title: "Software Engineer Intern",
    description:
      "Built scalable AWS Lambda microservices in Python, automating processing of 150M+ USPS data points. Ensured 100% data consistency by aligning 29 database schemas with Azure DevOps documentation via MySQL.",
    institution: "Ricoh USA, Inc.",
    category: "professional",
    type: "Internship",
  },
  {
    year: "March 2020 - September 2022",
    title: "Software Developer",
    description:
      "Developed and maintained software solutions with a focus on API development and integration. Modernized legacy backend API by engineering 150+ functions with Java 8, reducing post-deploy bug volume by 40%.",
    institution: "Tribot",
    category: "professional",
    type: "Full-time",
  },
  {
    year: "January 2015 - April 2015",
    title: "Computers & Technology Apprentice",
    description:
      "Developed practical skills in technology systems and problem-solving within a fast-paced fintech environment. Gained hands-on experience with modern technology stacks and agile development methodologies.",
    institution: "Square",
    category: "professional",
    type: "Apprenticeship",
  },
  {
    year: "September 2014 - December 2014",
    title: "Computers & Technology Apprentice",
    description:
      "Gained foundational experience in corporate technology stacks and IT systems through direct mentorship from senior engineering staff. Developed early understanding of enterprise software development practices.",
    institution: "LinkedIn",
    category: "professional",
    type: "Apprenticeship",
  },

  // Academic Experience
  {
    year: "June 2024 - May 2025",
    title: "Data Science, Mathematics, Engineering",
    description:
      "Advanced studies in data science, mathematics, and engineering at City College of San Francisco. Focused on statistical analysis, machine learning algorithms, and engineering principles to complement computer science foundation.",
    institution: "City College of San Francisco",
    category: "academic",
    type: "Advanced Studies",
  },
  {
    year: "September 2022 - June 2024",
    title: "B.S. Computer Science",
    description:
      "Earned Bachelor of Science in Computer Science from California Polytechnic State University, San Luis Obispo. Specialized in AI/ML with advanced coursework in machine learning, neural networks, natural language processing, and intelligent systems.",
    institution: "California Polytechnic State University, San Luis Obispo",
    category: "academic",
    type: "Bachelor's Degree",
  },
  {
    year: "August 2019 - May 2022",
    title: "Building a Formal CS Foundation",
    description:
      "Formally transitioned to Computer Science, building a rigorous foundation in data structures, algorithms, object-oriented programming, and software engineering. Earned Associate of Science in Data Science and Mathematics.",
    institution: "City College of San Francisco",
    category: "academic",
    type: "Associate's Degree",
  },
];

export default function EducationTimeline() {
  return <UnifiedTimeline items={timelineData} />;
}
