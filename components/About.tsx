"use client";

import { motion } from "framer-motion";
import EducationTimeline from "./EducationTimeline";
import { AnimatedSection, AnimatedCard } from "./ui/AnimatedSection";
import {
  TECHNOLOGIES,
  PROFICIENCY_COLORS,
  Technology,
} from "../data/about-data";

export default function About() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="max-w-4xl mx-auto">
        {/* About Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Education Timeline */}
          <AnimatedSection delay={0.3} className="pt-8">
            <EducationTimeline />
          </AnimatedSection>

          {/* Complete Tech Stack - Categorized */}
          <AnimatedCard delay={0.4} className="pt-6">
            <h3 className="text-2xl font-semibold text-brand-text mb-6 text-center">
              Complete Tech Stack
            </h3>

            {/* Proficiency Legend */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 ${PROFICIENCY_COLORS.expert.bg} ${PROFICIENCY_COLORS.expert.text} text-xs font-medium rounded-full border ${PROFICIENCY_COLORS.expert.border}`}
                >
                  Expert
                </span>
                <span className="text-sm text-brand-text-light">
                  Deep expertise
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 ${PROFICIENCY_COLORS.advanced.bg} ${PROFICIENCY_COLORS.advanced.text} text-xs font-medium rounded-full border ${PROFICIENCY_COLORS.advanced.border}`}
                >
                  Advanced
                </span>
                <span className="text-sm text-brand-text-light">
                  Strong skills
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 ${PROFICIENCY_COLORS.proficient.bg} ${PROFICIENCY_COLORS.proficient.text} text-xs font-medium rounded-full border ${PROFICIENCY_COLORS.proficient.border}`}
                >
                  Proficient
                </span>
                <span className="text-sm text-brand-text-light">
                  Working knowledge
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(TECHNOLOGIES).map(([category, technologies]) => (
                <div key={category} className="text-center">
                  <h4 className="text-lg font-semibold text-brand-text mb-4">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {technologies.map((tech: Technology) => {
                      const colors = PROFICIENCY_COLORS[tech.proficiency];
                      return (
                        <motion.span
                          key={tech.name}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          viewport={{ once: true }}
                          className={`px-3 py-2 ${colors.bg} ${colors.text} text-sm font-medium rounded-full border ${colors.border} ${colors.shadow} hover:scale-105 transition-all duration-300 cursor-pointer`}
                          title={`${
                            tech.proficiency.charAt(0).toUpperCase() +
                            tech.proficiency.slice(1)
                          } level`}
                        >
                          {tech.name}
                        </motion.span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </motion.div>
      </div>
    </div>
  );
}
