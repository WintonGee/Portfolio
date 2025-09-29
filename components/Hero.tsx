"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "./ui/Button";

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            x: [0, -8, 0],
            rotate: [0, -360, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-xl"
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Personal Photo & Introduction */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center lg:items-start space-y-8"
          >
            {/* Professional Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative group"
            >
              <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/20 dark:ring-gray-800/20">
                <Image
                  src="/headshot.jpg"
                  alt="Winton Gee - AI/ML Engineer"
                  width={320}
                  height={320}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>

              {/* Floating accent elements around photo */}
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
            </motion.div>

            {/* Quick intro text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center lg:text-left space-y-4"
            >
              <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                Hi, I'm Winton 👋
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                Passionate about building AI solutions that make a real
                difference
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <span className="font-serif">AI/ML</span>{" "}
                <span className="gradient-text font-serif">Engineer</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-light text-gray-600 dark:text-gray-300">
                  Building Intelligent Systems
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
                  I specialize in developing end-to-end machine learning
                  solutions, from data preprocessing to production deployment.
                  With expertise in computer vision, NLP, and predictive
                  analytics, I help organizations harness the power of AI to
                  solve complex problems.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button href="/resume/AIML_Resume_WintonGee.pdf" size="lg">
                View Resume
              </Button>
              <Button
                href="mailto:wintongee@gmail.com"
                variant="secondary"
                size="lg"
              >
                Let's Connect
              </Button>
            </motion.div>

            {/* Key Technologies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="pt-6"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">
                Core Technologies:
              </p>
              <div className="flex flex-wrap gap-3">
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
                    transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                    whileHover={{
                      scale: 1.1,
                      y: -2,
                      boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
                    }}
                    className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
