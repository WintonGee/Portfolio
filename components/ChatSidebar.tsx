"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Question category type definition
export interface QuestionCategory {
  category: string;
  questions: {
    label: string;      // Short display text
    question: string;   // Full question to send to chatbot
  }[];
}

// Component props interface
interface ChatSidebarProps {
  categories: QuestionCategory[];
  onQuestionSelect: (question: string) => void;
  isVisible?: boolean;
}

/**
 * ChatSidebar Component
 *
 * A minimalist, professional sidebar with collapseable categories displaying
 * pre-defined questions for the portfolio chatbot. Designed to match the
 * portfolio's branding: cream/off-white backgrounds, dark green accents,
 * and clean typography.
 *
 * @param categories - Array of question categories with their questions
 * @param onQuestionSelect - Callback function when a question is clicked
 * @param isVisible - Optional visibility toggle for responsive behavior
 */
export default function ChatSidebar({
  categories,
  onQuestionSelect,
  isVisible = true,
}: ChatSidebarProps) {
  // Track which categories are expanded (first category expanded by default)
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set([0])
  );

  const toggleCategory = (index: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (!isVisible) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-full bg-brand-beige-light rounded-lg border border-brand-secondary/30 shadow-organic overflow-hidden flex flex-col"
    >
      {/* Sidebar Header */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-primary-light p-4 border-b border-brand-primary-dark/20 flex-shrink-0">
        <h3 className="text-lg font-semibold text-brand-beige">
          Quick Questions
        </h3>
      </div>

      {/* Scrollable Categories Container */}
      <div className="overflow-y-auto flex-1 p-4 space-y-3">
        {categories.map((categoryData, categoryIndex) => {
          const isExpanded = expandedCategories.has(categoryIndex);
          const questionCount = categoryData.questions.length;

          return (
            <div
              key={categoryIndex}
              className="bg-white rounded-lg border border-brand-secondary/20 shadow-sm overflow-hidden"
            >
              {/* Category Header - Clickable to expand/collapse */}
              <motion.button
                onClick={() => toggleCategory(categoryIndex)}
                whileHover={{ backgroundColor: "rgba(210, 180, 140, 0.08)" }}
                whileTap={{ scale: 0.99 }}
                className="w-full px-4 py-3 flex items-center justify-between gap-3 transition-colors duration-200 group"
              >
                <div className="flex-1 text-left">
                  <h4 className="text-sm font-semibold text-brand-text group-hover:text-brand-primary-dark transition-colors duration-200">
                    {categoryData.category}
                  </h4>
                  <p className="text-xs text-brand-text-light/70 mt-0.5">
                    {questionCount} question{questionCount !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Chevron indicator */}
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex-shrink-0"
                >
                  <svg
                    className="w-5 h-5 text-brand-primary group-hover:text-brand-primary-dark transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.div>
              </motion.button>

              {/* Questions List - Animated collapse/expand */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 space-y-2 border-t border-brand-secondary/10">
                      {categoryData.questions.map((item, questionIndex) => (
                        <motion.button
                          key={questionIndex}
                          onClick={() => onQuestionSelect(item.question)}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.2,
                            delay: questionIndex * 0.05,
                          }}
                          whileHover={{ scale: 1.01, x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full text-left px-3 py-2.5 mt-2 bg-brand-beige-light/50 hover:bg-brand-secondary/15 border border-brand-secondary/0 hover:border-brand-primary/30 rounded-md transition-all duration-200 group"
                          title={item.question}
                        >
                          <div className="flex items-start gap-2.5">
                            {/* Dot indicator instead of icon for cleaner look */}
                            <div className="flex-shrink-0 mt-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary group-hover:bg-brand-primary-dark transition-colors duration-200"></div>
                            </div>

                            {/* Question Label - Short display text */}
                            <span className="text-xs text-brand-text group-hover:text-brand-primary-dark transition-colors duration-200 font-medium leading-relaxed">
                              {item.label}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.aside>
  );
}
