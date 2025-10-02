"use client";

import { motion } from "framer-motion";
import EducationTimeline from "./EducationTimeline";
import { AnimatedSection, AnimatedCard } from "./ui/AnimatedSection";
import { TECHNOLOGIES } from "../data/about-data";

// Journey Section Component
export function JourneySection() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection delay={0.3} className="pt-8">
          <EducationTimeline />
        </AnimatedSection>
      </div>
    </div>
  );
}

// Tech Stack Section Component
export function TechStackSection() {
  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 180, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-brand-primary/8 to-brand-secondary/8 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            x: [0, -8, 0],
            rotate: [0, -180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-brand-secondary/8 to-brand-primary/8 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <AnimatedCard delay={0.4} className="pt-6">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-5xl font-bold text-brand-text mb-6"
            >
              Complete{" "}
              <span className="gradient-text font-extrabold">Tech Stack</span>
            </motion.h3>
          </div>

          {/* Enhanced Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {Object.entries(TECHNOLOGIES).map(
              ([category, technologies], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2 + categoryIndex * 0.1,
                  }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  {/* Category Card */}
                  <div className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-2xl p-8 shadow-organic-lg border border-white/20 hover:shadow-organic-2xl hover:border-brand-primary/20 transition-all duration-500 group-hover:scale-[1.02] h-full">
                    {/* Category Header */}
                    <div className="text-center mb-8">
                      <h4 className="text-xl font-bold text-brand-text mb-3 group-hover:text-brand-primary transition-colors duration-300">
                        {category}
                      </h4>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Technology Badges */}
                    <div className="flex flex-wrap gap-3 justify-center">
                      {technologies.map((techItem, techIndex) => {
                        // Handle grouped technologies (arrays) and individual technologies
                        if (Array.isArray(techItem)) {
                          // Grouped technologies - render them in a connected row
                          return (
                            <div
                              key={`group-${techIndex}`}
                              className="flex gap-2"
                            >
                              {techItem.map((tech, groupIndex) => (
                                <motion.div
                                  key={tech.name}
                                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                  transition={{
                                    duration: 0.4,
                                    delay:
                                      0.4 +
                                      categoryIndex * 0.1 +
                                      techIndex * 0.05 +
                                      groupIndex * 0.02,
                                    type: "spring",
                                    stiffness: 100,
                                  }}
                                  viewport={{ once: true }}
                                  whileHover={{
                                    scale: 1.08,
                                    y: -2,
                                    transition: { duration: 0.2 },
                                  }}
                                  className="group/tech cursor-pointer"
                                >
                                  <div className="flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-brand-beige/80 to-brand-beige-light/80 text-brand-text text-sm font-semibold rounded-xl border border-brand-secondary/30 hover:from-brand-primary/15 hover:to-brand-secondary/15 hover:border-brand-primary/50 hover:text-brand-primary hover:shadow-organic transition-all duration-300 backdrop-blur-sm">
                                    <img
                                      src={tech.logo}
                                      alt={`${tech.name} logo`}
                                      className="w-5 h-5 flex-shrink-0 group-hover/tech:scale-110 transition-transform duration-300"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                    <span className="whitespace-nowrap">
                                      {tech.name}
                                    </span>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          );
                        } else {
                          // Individual technology
                          return (
                            <motion.div
                              key={techItem.name}
                              initial={{ opacity: 0, scale: 0.8, y: 20 }}
                              whileInView={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{
                                duration: 0.4,
                                delay:
                                  0.4 + categoryIndex * 0.1 + techIndex * 0.05,
                                type: "spring",
                                stiffness: 100,
                              }}
                              viewport={{ once: true }}
                              whileHover={{
                                scale: 1.08,
                                y: -2,
                                transition: { duration: 0.2 },
                              }}
                              className="group/tech cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-brand-beige/80 to-brand-beige-light/80 text-brand-text text-sm font-semibold rounded-xl border border-brand-secondary/30 hover:from-brand-primary/15 hover:to-brand-secondary/15 hover:border-brand-primary/50 hover:text-brand-primary hover:shadow-organic transition-all duration-300 backdrop-blur-sm">
                                <img
                                  src={techItem.logo}
                                  alt={`${techItem.name} logo`}
                                  className="w-5 h-5 flex-shrink-0 group-hover/tech:scale-110 transition-transform duration-300"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                                <span className="whitespace-nowrap">
                                  {techItem.name}
                                </span>
                              </div>
                            </motion.div>
                          );
                        }
                      })}
                    </div>
                  </div>

                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
                </motion.div>
              )
            )}
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}

// Legacy About component for backward compatibility
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
        </motion.div>
      </div>
    </div>
  );
}
