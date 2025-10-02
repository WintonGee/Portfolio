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

import { TimelineItem, FilterCategory } from "../types/timeline";
import { timelineData } from "../data/timeline-data";
import {
  FILTER_OPTIONS,
  HOVER_DESCRIPTIONS,
  TIMELINE_CONFIG,
} from "../lib/timeline-constants";
import {
  addSpacingToOverlappingPoints,
  filterItemsByCategory,
  transformToChartData,
  getCategoryColor,
} from "../lib/timeline-utils";

interface UnifiedTimelineProps {
  items: TimelineItem[];
}

function UnifiedTimeline({ items }: UnifiedTimelineProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Process timeline data
  const sortedItems = addSpacingToOverlappingPoints(items);
  const filteredItems = filterItemsByCategory(sortedItems, filterCategory);

  // Separate professional and academic items
  const professionalItems = filteredItems.filter(
    (item) => item.category === "professional"
  );
  const academicItems = filteredItems.filter(
    (item) => item.category === "academic"
  );

  // Transform to chart data
  const professionalData = transformToChartData(professionalItems);
  const academicData = transformToChartData(academicItems);

  // Helper function to get logo path for institution
  const getLogoPath = (institution: string): string => {
    const logoMap: Record<string, string> = {
      Mercor: "/logos/companies/mercor.png",
      "CoChat.io": "/logos/companies/cochat.png",
      "AfterQuery Experts": "/logos/companies/afterquery.png",
      "Cal Poly, San Luis Obispo": "/logos/companies/calpoly-mustangs.png",
      "California Polytechnic State University, San Luis Obispo":
        "/logos/companies/calpoly-mustangs.png",
      "Ricoh USA, Inc.": "/logos/companies/ricoh.png",
      Tribot: "/logos/companies/tribot.png",
      Square: "/logos/companies/square.png",
      LinkedIn: "/logos/companies/linkedin.png",
      "City College of San Francisco": "/logos/companies/ccsf.png",
    };

    // Try exact match first
    if (logoMap[institution]) {
      return logoMap[institution];
    }

    // Try partial matches for variations
    const lowerInstitution = institution.toLowerCase();
    if (lowerInstitution.includes("mercor"))
      return "/logos/companies/mercor.png";
    if (lowerInstitution.includes("cochat"))
      return "/logos/companies/cochat.png";
    if (lowerInstitution.includes("afterquery"))
      return "/logos/companies/afterquery.png";
    if (
      lowerInstitution.includes("cal poly") ||
      lowerInstitution.includes("calpoly")
    )
      return "/logos/companies/calpoly-mustangs.png";
    if (lowerInstitution.includes("ricoh")) return "/logos/companies/ricoh.png";
    if (lowerInstitution.includes("tribot"))
      return "/logos/companies/tribot.png";
    if (lowerInstitution.includes("square"))
      return "/logos/companies/square.png";
    if (lowerInstitution.includes("linkedin"))
      return "/logos/companies/linkedin.png";
    if (
      lowerInstitution.includes("city college") ||
      lowerInstitution.includes("ccsf")
    )
      return "/logos/companies/ccsf.png";

    return "/logos/companies/default.png";
  };

  // Custom dot component for timeline points with logos
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const isCurrent = payload?.isCurrent;
    const category = payload?.category;
    const item = payload?.item;
    const color = getCategoryColor(category, isCurrent);
    const logoPath = getLogoPath(item?.institution || "");

    return (
      <g>
        {/* Logo background circle */}
        <motion.circle
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: payload.progression * 0.1 }}
          cx={cx}
          cy={cy}
          r={isMobile ? 16 : 20}
          fill="white"
          stroke={color}
          strokeWidth={3}
          className="cursor-pointer hover:scale-110 transition-all duration-300"
          onClick={() =>
            setActiveIndex(
              activeIndex === payload.progression - 1
                ? null
                : payload.progression - 1
            )
          }
        />

        {/* Logo image */}
        <motion.foreignObject
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: payload.progression * 0.1 + 0.2 }}
          x={cx - (isMobile ? 12 : 16)}
          y={cy - (isMobile ? 12 : 16)}
          width={isMobile ? 24 : 32}
          height={isMobile ? 24 : 32}
          className="pointer-events-none"
        >
          <div
            className={`${
              isMobile ? "w-6 h-6" : "w-8 h-8"
            } rounded-full overflow-hidden`}
          >
            <img
              src={logoPath}
              alt={`${item?.institution} logo`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/logos/companies/default.png";
              }}
            />
          </div>
        </motion.foreignObject>

        {/* Current status indicator */}
        {isCurrent && (
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.3,
              delay: payload.progression * 0.1 + 0.3,
            }}
            cx={cx + 14}
            cy={cy - 14}
            r={5}
            fill="#ef4444"
            className="pointer-events-none animate-pulse"
          />
        )}

        {/* Visible label */}
        <motion.text
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: payload.progression * 0.1 + 0.3 }}
          x={cx + (isMobile ? 20 : 30)}
          y={cy + 5}
          textAnchor="start"
          className="text-xs font-medium fill-gray-700 pointer-events-none"
          style={{ fontSize: isMobile ? "9px" : "11px" }}
        >
          {item?.title}
        </motion.text>
      </g>
    );
  };

  // Helper function to get concise hover description
  const getHoverDescription = (item: TimelineItem): string => {
    return HOVER_DESCRIPTIONS[item.title] || item.description;
  };

  // Helper function to get logo for tooltip
  const getTooltipLogo = (item: TimelineItem): string => {
    return getLogoPath(item.institution || "");
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const logoPath = getTooltipLogo(data.item);

      return (
        <div className="bg-brand-beige-light rounded-2xl p-3 sm:p-4 shadow-organic-xl border border-brand-secondary/20 max-w-xs sm:max-w-sm">
          <div className="space-y-3">
            {/* Year badge with logo */}
            <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 text-brand-primary border border-brand-primary/20">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden mr-2 flex-shrink-0">
                <img
                  src={logoPath}
                  alt={`${data.item.institution} logo`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/logos/companies/default.png";
                  }}
                />
              </div>
              {data.item.year}
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-brand-text">
              {data.item.title}
            </h3>

            {/* Institution */}
            {data.item.institution && (
              <p className="text-brand-primary font-medium text-xs sm:text-sm">
                {data.item.institution}
              </p>
            )}

            {/* Concise Description */}
            <p className="text-brand-text-light leading-relaxed text-xs sm:text-sm">
              {getHoverDescription(data.item)}
            </p>

            {/* Current status indicator */}
            {data.item.isCurrent && (
              <div className="flex items-center text-brand-primary text-xs sm:text-sm font-medium">
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
        className="text-center mb-8 sm:mb-10 lg:mb-12"
      >
        <h2 className="text-heading-xl text-brand-text mb-4 sm:mb-6">
          My <span className="gradient-text">Journey</span>
        </h2>

        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilterCategory(filter.key as any)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                filterCategory === filter.key
                  ? `${filter.color} text-white shadow-organic-lg border-2 border-brand-primary/20`
                  : "bg-brand-beige-light text-brand-text border-2 border-brand-secondary/30 hover:bg-brand-beige-dark hover:border-brand-secondary/50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Chart Container */}
      <div
        className="relative bg-gradient-to-br from-brand-beige-light/50 to-brand-beige/50 rounded-2xl p-2 sm:p-4 border border-brand-secondary/20"
        style={{
          height: isMobile
            ? `${TIMELINE_CONFIG.CHART_HEIGHT.mobile}px`
            : `${TIMELINE_CONFIG.CHART_HEIGHT.desktop}px`,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            margin={{
              top: isMobile ? 30 : 50,
              right: isMobile ? 30 : 60,
              left: isMobile ? 10 : 20,
              bottom: isMobile ? 30 : 50,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(107, 114, 128, 0.1)"
            />
            <XAxis
              type="number"
              dataKey="year"
              domain={["dataMin - 1", "dataMax + 1"]}
              tick={{ fontSize: isMobile ? 10 : 12, fill: "#6B7280" }}
              axisLine={{ stroke: "#6B7280" }}
              tickLine={{ stroke: "#6B7280" }}
              tickFormatter={(value) => Math.round(value).toString()}
              ticks={(() => {
                // Generate whole number ticks based on the data range
                const minYear = Math.floor(
                  Math.min(
                    ...professionalData.map((d) => d.year),
                    ...academicData.map((d) => d.year)
                  )
                );
                const maxYear = Math.ceil(
                  Math.max(
                    ...professionalData.map((d) => d.year),
                    ...academicData.map((d) => d.year)
                  )
                );
                const ticks = [];
                for (let year = minYear; year <= maxYear; year++) {
                  ticks.push(year);
                }
                return ticks;
              })()}
              label={{
                value: "Timeline (Years)",
                position: "insideBottom",
                offset: -10,
                style: {
                  textAnchor: "middle",
                  fontSize: isMobile ? 12 : 14,
                  fill: "#6B7280",
                },
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

export default function EducationTimeline() {
  return <UnifiedTimeline items={timelineData} />;
}
