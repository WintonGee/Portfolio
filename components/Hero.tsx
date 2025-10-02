"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "./ui/Button";
import {
  CodeBracketIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center bg-gradient-to-br from-brand-beige via-brand-beige-light to-brand-beige-dark relative overflow-hidden pt-16 sm:pt-20 lg:pt-24"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary floating element */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-16 right-16 w-40 h-40 bg-gradient-to-r from-brand-primary/15 to-brand-secondary/15 rounded-full blur-2xl"
        />
        {/* Secondary floating element */}
        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -12, 0],
            rotate: [0, -360, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute bottom-24 left-16 w-32 h-32 bg-gradient-to-r from-brand-secondary/15 to-brand-primary/15 rounded-full blur-2xl"
        />
        {/* Tertiary accent element */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, 8, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute top-1/3 left-1/4 w-20 h-20 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-full blur-xl"
        />
      </div>

      {/* Main Container with Perfect Spacing */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-8 sm:pb-12 lg:pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Left Column - Enhanced Personal Section */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center lg:items-start space-y-6 sm:space-y-8 lg:space-y-10"
          >
            {/* Professional Photo with Enhanced Styling */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative group"
            >
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-organic-2xl ring-4 ring-brand-secondary/20 hover:ring-brand-primary/30 transition-all duration-700">
                <Image
                  src="/headshot.jpg"
                  alt="Winton Gee - AI/ML Engineer"
                  width={320}
                  height={320}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>

              {/* Enhanced Floating Accent Elements */}
              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, 8, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-6 -right-6 w-10 h-10 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full opacity-90 shadow-organic-lg"
              />
              <motion.div
                animate={{
                  y: [0, 12, 0],
                  rotate: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
                className="absolute -bottom-6 -left-6 w-8 h-8 bg-gradient-to-r from-brand-secondary to-brand-primary rounded-full opacity-90 shadow-organic-lg"
              />
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  x: [0, 6, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
                className="absolute top-1/4 -left-4 w-6 h-6 bg-gradient-to-r from-brand-primary/80 to-brand-secondary/80 rounded-full opacity-70"
              />
            </motion.div>

            {/* Enhanced Introduction Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center lg:text-left space-y-4 sm:space-y-6 lg:space-y-8"
            >
              {/* Greeting with Enhanced Typography */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="space-y-3"
              >
                <h1 className="text-2xl sm:text-3xl lg:text-4xl text-brand-text font-bold tracking-tight">
                  Hi, I'm Winton 👋
                </h1>

                {/* Location moved here */}
                <div className="flex items-center justify-center lg:justify-start gap-3 text-brand-text-light">
                  <MapPinIcon className="w-5 h-5 text-brand-primary" />
                  <span className="text-base font-medium">
                    San Francisco, CA
                  </span>
                </div>
              </motion.div>

              {/* Enhanced Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-lg sm:text-xl text-brand-text-light max-w-lg leading-relaxed font-medium"
              >
                Currently building AI solutions at{" "}
                <span className="text-brand-primary font-semibold">Mercor</span>
                , specializing in intelligent systems powered by modern
                frameworks and APIs.
              </motion.p>

              {/* Contact Information - Boxed Style, Email First */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="flex flex-col sm:flex-row items-center lg:items-start gap-3 sm:gap-4"
              >
                {/* Email */}
                <motion.a
                  href="mailto:wintongee@gmail.com"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-brand-beige-light/50 hover:bg-brand-beige-light border border-brand-secondary/20 hover:border-brand-primary/30 transition-all duration-300 group"
                >
                  <div className="p-1.5 rounded-lg bg-brand-primary/10 group-hover:bg-brand-primary/20 transition-colors duration-300">
                    <EnvelopeIcon className="w-4 h-4 text-brand-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="text-base font-medium text-brand-text-light group-hover:text-brand-text transition-colors duration-300">
                    wintongee@gmail.com
                  </span>
                </motion.a>

                {/* Phone */}
                <motion.a
                  href="tel:+14158063004"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-brand-beige-light/50 hover:bg-brand-beige-light border border-brand-secondary/20 hover:border-brand-primary/30 transition-all duration-300 group"
                >
                  <div className="p-1.5 rounded-lg bg-brand-primary/10 group-hover:bg-brand-primary/20 transition-colors duration-300">
                    <PhoneIcon className="w-4 h-4 text-brand-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="text-base font-medium text-brand-text-light group-hover:text-brand-text transition-colors duration-300">
                    (415) 806-3004
                  </span>
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column - Enhanced Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-8 sm:space-y-10 lg:space-y-12"
          >
            {/* Enhanced Typography Hierarchy */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Main Headline with Balanced Typography */}
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-brand-text leading-tight tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <span className="font-extrabold">AI/ML</span>{" "}
                <span className="gradient-text font-extrabold">Engineer</span>
              </motion.h1>

              {/* Balanced Subheading */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="text-2xl sm:text-3xl md:text-4xl font-light text-brand-text-light leading-tight"
              >
                Building{" "}
                <span className="text-brand-primary font-semibold">
                  Intelligent
                </span>{" "}
                Systems
              </motion.h2>
            </div>

            {/* Enhanced Action Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Enhanced Button Layout */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  href="/resume/AIML_Resume_WintonGee.pdf"
                  size="lg"
                  download="Winton_Gee_Resume.pdf"
                >
                  Download Resume
                </Button>
                <Button
                  href="https://linkedin.com/in/wintongee"
                  variant="secondary"
                  size="lg"
                >
                  Let's Connect
                </Button>
              </div>

              {/* Social Links - LinkedIn & GitHub Only */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6"
              >
                <a
                  href="https://linkedin.com/in/wintongee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-brand-text-light hover:text-brand-primary transition-all duration-300 hover:scale-105"
                  aria-label="Visit LinkedIn profile"
                >
                  <BuildingOfficeIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-base font-medium">LinkedIn</span>
                </a>
                <a
                  href="https://github.com/wintongee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-brand-text-light hover:text-brand-primary transition-all duration-300 hover:scale-105"
                  aria-label="Visit GitHub profile"
                >
                  <CodeBracketIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-base font-medium">GitHub</span>
                </a>
              </motion.div>
            </motion.div>

            {/* Enhanced Technologies Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.0 }}
              className="pt-6 sm:pt-8"
            >
              <p className="text-sm sm:text-base text-brand-text-light mb-4 sm:mb-6 font-semibold tracking-wide uppercase">
                Core Expertise
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 justify-center lg:justify-start">
                {[
                  "Python",
                  "TypeScript",
                  "React",
                  "SQL",
                  "Cursor",
                  "OpenAI",
                  "Gemini",
                ].map((tech, index) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                    className="px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-brand-beige-light text-brand-text text-sm sm:text-base font-medium rounded-full shadow-organic border border-brand-secondary/50 hover:bg-gradient-to-r hover:from-brand-primary/10 hover:to-brand-secondary/10 hover:text-brand-primary hover:border-brand-primary hover:shadow-organic-lg transition-all duration-300 cursor-pointer hover:scale-105"
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
