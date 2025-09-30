"use client";

import { motion } from "framer-motion";
import EducationTimeline from "./EducationTimeline";
import { AnimatedSection, AnimatedCard } from "./ui/AnimatedSection";
import { TECHNOLOGIES } from "../data/about-data";

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
            <h3 className="text-3xl font-bold text-brand-text mb-8 text-center">
              Complete Tech Stack
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(TECHNOLOGIES).map(([category, technologies]) => (
                <div key={category} className="text-center">
                  <h4 className="text-lg font-semibold text-brand-text mb-4">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {technologies.map((tech) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="px-3 py-2 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 text-brand-primary text-sm font-medium rounded-full border border-brand-primary/20 hover:from-brand-primary/20 hover:to-brand-secondary/20 hover:border-brand-primary hover:scale-105 transition-all duration-300 cursor-pointer"
                      >
                        {tech}
                      </motion.span>
                    ))}
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
