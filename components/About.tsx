"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
  return (
    <section
      id="about"
      className="py-32 bg-gradient-to-b from-white to-gray-50 dark:from-slate-800 dark:to-slate-900"
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
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Passionate about building intelligent systems that make a
              difference
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="relative w-80 h-80 rounded-full overflow-hidden shadow-2xl">
                  <Image
                    src="/headshot.jpg"
                    alt="Winton Gee - AI/ML Engineer"
                    width={320}
                    height={320}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
                {/* Floating elements */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-80"
                />
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-80"
                />
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
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  I'm a passionate AI/ML Engineer with over 5 years of
                  experience building intelligent systems that solve real-world
                  problems. My expertise spans machine learning, deep learning,
                  natural language processing, and computer vision, with a
                  strong foundation in software engineering and data science.
                </p>

                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  I specialize in developing end-to-end ML pipelines, from data
                  preprocessing and model training to deployment and monitoring.
                  I'm particularly interested in the intersection of AI and
                  healthcare, where I've worked on projects involving medical
                  image analysis and predictive modeling for patient outcomes.
                </p>

                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
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
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
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
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
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
                            boxShadow: "0 8px 25px rgba(168, 85, 247, 0.3)",
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full border border-purple-200 dark:border-purple-700 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-800/50 dark:hover:to-pink-800/50 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 cursor-pointer"
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
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
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
                            boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full border border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-800/50 dark:hover:to-cyan-800/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer"
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
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></span>
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
                            boxShadow: "0 8px 25px rgba(34, 197, 94, 0.3)",
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-full border border-green-200 dark:border-green-700 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-800/50 dark:hover:to-emerald-800/50 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 cursor-pointer"
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
