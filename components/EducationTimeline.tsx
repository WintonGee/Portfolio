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

  // Custom dot component for timeline points with visible labels
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const isCurrent = payload?.isCurrent;
    const category = payload?.category;
    const item = payload?.item;
    const color = getCategoryColor(category, isCurrent);

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
    return HOVER_DESCRIPTIONS[item.title] || item.description;
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
          {FILTER_OPTIONS.map((filter) => (
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
      <div
        className={`relative h-[${TIMELINE_CONFIG.CHART_HEIGHT.mobile}px] md:h-[${TIMELINE_CONFIG.CHART_HEIGHT.desktop}px] bg-gradient-to-br from-brand-beige/30 to-brand-beige-light/30 rounded-2xl p-6`}
      >
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

export default function EducationTimeline() {
  return <UnifiedTimeline items={timelineData} />;
}
