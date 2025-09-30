"use client";

import { motion } from "framer-motion";
import EducationTimeline from "./EducationTimeline";
import { AnimatedSection, AnimatedCard } from "./ui/AnimatedSection";
import { STATS_DATA, TECHNOLOGIES } from "../data/about-data";
import { commonClasses } from "../lib/utils";

export default function About() {
  return (
    <section
      id="about"
      className="py-32 bg-gradient-to-b from-brand-beige-light to-brand-beige"
    >
      <div className={commonClasses.container}>
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-20">
            <h2 className={commonClasses.heading}>
              About <span className="gradient-text">Me</span>
            </h2>
            <p className={commonClasses.subheading}>
              Passionate about building intelligent systems that make a
              difference
            </p>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto">
            {/* About Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Main narrative paragraphs */}
              <div className="space-y-6 text-center">
                <p className="text-lg text-brand-text-light leading-relaxed">
                  As a passionate AI/ML Engineer, my focus is on building
                  intelligent full-stack applications that solve real-world
                  problems. I specialize in developing end-to-end intelligent
                  systems, from designing responsive frontend interfaces to
                  engineering backend APIs and databases. I'm particularly
                  passionate about leveraging AI models to create intuitive
                  features and user experiences.
                </p>

                <p className="text-lg text-brand-text-light leading-relaxed">
                  When I'm not coding, you'll find me exploring new
                  technologies, contributing to open-source projects, or working
                  on personal projects that combine my interests in food and
                  technology, such as developing an AI-powered application to
                  reduce food waste. I believe in the power of technology to
                  make everyday tasks more efficient and enjoyable.
                </p>
              </div>

              {/* Key Stats */}
              <AnimatedCard
                delay={0.3}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8"
              >
                {STATS_DATA.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-6 bg-brand-beige-light rounded-xl shadow-organic"
                  >
                    <div className="text-3xl font-bold text-brand-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-brand-text-light">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </AnimatedCard>

              {/* Core Technologies - Categorized */}
              <AnimatedCard delay={0.4} className="pt-6">
                <h3 className="text-2xl font-semibold text-brand-text mb-8 text-center">
                  Core Technologies
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {Object.entries(TECHNOLOGIES).map(
                    ([category, technologies]) => (
                      <div key={category} className="text-center">
                        <h4 className="text-lg font-semibold text-brand-text mb-4">
                          {category}
                        </h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-2 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 text-brand-primary text-sm font-medium rounded-full border border-brand-primary/20 hover:from-brand-primary/20 hover:to-brand-secondary/20 hover:border-brand-primary transition-all duration-300 cursor-pointer"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </AnimatedCard>

              {/* Education Timeline */}
              <AnimatedSection delay={0.5} className="pt-8">
                <EducationTimeline />
              </AnimatedSection>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
