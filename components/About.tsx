"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
  return (
    <section
      id="about"
      className="py-32 bg-gradient-to-b from-brand-beige-light to-brand-beige"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-brand-text mb-6">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-xl text-brand-text-light max-w-3xl mx-auto">
              Passionate about building intelligent systems that make a
              difference
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Professional Journey Visualization */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-md">
                {/* Timeline-style visualization */}
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-4 h-4 bg-gradient-to-r from-brand-primary to-brand-primary-light rounded-full"></div>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-brand-primary/50 to-transparent"></div>
                    <div className="text-sm text-brand-text-light font-medium">
                      5+ Years Experience
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-4 h-4 bg-gradient-to-r from-brand-secondary to-brand-primary rounded-full"></div>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-brand-secondary/50 to-transparent"></div>
                    <div className="text-sm text-brand-text-light font-medium">
                      AI/ML Specialization
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-4 h-4 bg-gradient-to-r from-brand-primary-light to-brand-secondary rounded-full"></div>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-brand-primary-light/50 to-transparent"></div>
                    <div className="text-sm text-brand-text-light font-medium">
                      Production Systems
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-4 h-4 bg-gradient-to-r from-brand-secondary-dark to-brand-primary-dark rounded-full"></div>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-brand-secondary-dark/50 to-transparent"></div>
                    <div className="text-sm text-brand-text-light font-medium">
                      Healthcare AI Focus
                    </div>
                  </motion.div>
                </div>

                {/* Central achievement badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  viewport={{ once: true }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-brand-primary to-brand-primary-light rounded-full flex items-center justify-center shadow-organic-2xl"
                >
                  <span className="text-brand-beige font-bold text-lg">AI</span>
                </motion.div>
              </div>
            </motion.div>

            {/* About Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <p className="text-lg text-brand-text-light leading-relaxed">
                  I'm a passionate AI/ML Engineer with over 5 years of
                  experience building intelligent systems that solve real-world
                  problems. My expertise spans machine learning, deep learning,
                  natural language processing, and computer vision, with a
                  strong foundation in software engineering and data science.
                </p>

                <p className="text-lg text-brand-text-light leading-relaxed">
                  I specialize in developing end-to-end ML pipelines, from data
                  preprocessing and model training to deployment and monitoring.
                  I'm particularly interested in the intersection of AI and
                  healthcare, where I've worked on projects involving medical
                  image analysis and predictive modeling for patient outcomes.
                </p>

                <p className="text-lg text-brand-text-light leading-relaxed">
                  When I'm not coding, you'll find me exploring the latest
                  research papers, contributing to open-source projects, or
                  mentoring aspiring data scientists. I believe in the power of
                  AI to make the world a better place and am always excited to
                  work on projects that have a positive impact.
                </p>
              </div>

              {/* Skills/Technologies */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="pt-6"
              >
                <h3 className="text-2xl font-semibold text-brand-text mb-8">
                  Core Technologies
                </h3>

                <div className="space-y-8">
                  {/* AI / Machine Learning */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-semibold text-brand-text flex items-center gap-2">
                      <span className="w-2 h-2 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"></span>
                      AI / Machine Learning
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {[
                        "Python",
                        "TensorFlow",
                        "PyTorch",
                        "Scikit-learn",
                        "Pandas",
                        "NumPy",
                        "Jupyter",
                        "MLflow",
                      ].map((tech, index) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.6 + index * 0.05,
                          }}
                          viewport={{ once: true }}
                          whileHover={{
                            scale: 1.1,
                            y: -2,
                            boxShadow: "0 8px 25px rgba(85, 107, 47, 0.3)",
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 text-brand-primary text-sm font-medium rounded-full border border-brand-primary/30 hover:from-brand-primary/20 hover:to-brand-secondary/20 hover:border-brand-primary transition-all duration-300 cursor-pointer"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Frontend Development */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-semibold text-brand-text flex items-center gap-2">
                      <span className="w-2 h-2 bg-gradient-to-r from-brand-secondary to-brand-primary-light rounded-full"></span>
                      Frontend Development
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {[
                        "React",
                        "Next.js",
                        "TypeScript",
                        "Tailwind CSS",
                        "Framer Motion",
                        "Three.js",
                      ].map((tech, index) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.8 + index * 0.05,
                          }}
                          viewport={{ once: true }}
                          whileHover={{
                            scale: 1.1,
                            y: -2,
                            boxShadow: "0 8px 25px rgba(85, 107, 47, 0.3)",
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-brand-secondary/10 to-brand-primary-light/10 text-brand-primary text-sm font-medium rounded-full border border-brand-secondary/30 hover:from-brand-secondary/20 hover:to-brand-primary-light/20 hover:border-brand-primary transition-all duration-300 cursor-pointer"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Backend & DevOps */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-semibold text-brand-text flex items-center gap-2">
                      <span className="w-2 h-2 bg-gradient-to-r from-brand-primary-light to-brand-secondary-dark rounded-full"></span>
                      Backend & DevOps
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {[
                        "Node.js",
                        "Docker",
                        "AWS",
                        "SQL",
                        "MongoDB",
                        "Git",
                        "Linux",
                        "FastAPI",
                      ].map((tech, index) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: 1.0 + index * 0.05,
                          }}
                          viewport={{ once: true }}
                          whileHover={{
                            scale: 1.1,
                            y: -2,
                            boxShadow: "0 8px 25px rgba(85, 107, 47, 0.3)",
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-brand-primary-light/10 to-brand-secondary-dark/10 text-brand-primary text-sm font-medium rounded-full border border-brand-primary-light/30 hover:from-brand-primary-light/20 hover:to-brand-secondary-dark/20 hover:border-brand-primary transition-all duration-300 cursor-pointer"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
