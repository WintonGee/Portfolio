"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 md:h-[500px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl">
      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse"></div>
    </div>
  ),
});

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1
                className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="font-serif">Winton</span>{" "}
                <span className="gradient-text font-serif">Gee</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-2"
              >
                <h2 className="text-2xl md:text-3xl font-light text-gray-600 dark:text-gray-300">
                  AI/ML Engineer & Software Developer
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg">
                  Building intelligent systems that solve real-world problems
                  through machine learning, deep learning, and innovative
                  software solutions.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="/resume/AIML_Resume_WintonGee.pdf"
                target="_blank"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 transform"
              >
                <span className="relative z-10">View Resume</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
              </a>

              <a
                href="mailto:wintongee@gmail.com"
                className="group px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
              >
                Contact Me
              </a>
            </motion.div>

            {/* Tech Stack Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="pt-8"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Technologies I work with:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Python",
                  "TensorFlow",
                  "PyTorch",
                  "React",
                  "Next.js",
                  "AWS",
                  "Docker",
                ].map((tech, index) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                    whileHover={{
                      scale: 1.1,
                      y: -2,
                      boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
                    }}
                    className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - 3D Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <Hero3D />
              {/* Floating elements */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  x: [0, 10, 0],
                  rotate: [0, 360, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-80"
              />
              <motion.div
                animate={{
                  y: [0, 15, 0],
                  x: [0, -8, 0],
                  rotate: [0, -360, 0],
                  scale: [1, 0.9, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-80"
              />
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  x: [0, 12, 0],
                  rotate: [0, 180, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute top-1/2 -right-8 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-60"
              />
              <motion.div
                animate={{
                  y: [0, 20, 0],
                  x: [0, -15, 0],
                  rotate: [0, -180, 0],
                  scale: [1, 0.8, 1],
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute top-1/3 -left-6 w-5 h-5 bg-gradient-to-r from-green-400 to-teal-500 rounded-full opacity-70"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
