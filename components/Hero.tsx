"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "./ui/Button";
import {
  CodeBracketIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  EnvelopeIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center bg-gradient-to-br from-brand-beige via-brand-beige-light to-brand-beige-dark relative overflow-hidden"
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
      <div className="container mx-auto px-8 py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center max-w-7xl mx-auto">
          {/* Left Column - Enhanced Personal Section */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center lg:items-start space-y-16"
          >
            {/* Professional Photo with Enhanced Styling */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative group"
            >
              <div className="relative w-72 h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-organic-2xl ring-4 ring-brand-secondary/20 hover:ring-brand-primary/30 transition-all duration-700">
                <Image
                  src="/headshot.jpg"
                  alt="Winton Gee - AI/ML Engineer"
                  width={384}
                  height={384}
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
              className="text-center lg:text-left space-y-8"
            >
              {/* Greeting with Enhanced Typography */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-2xl text-brand-text font-semibold tracking-tight"
              >
                Hi, I'm Winton 👋
              </motion.p>

              {/* Enhanced Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-lg text-brand-text-light max-w-md leading-relaxed"
              >
                Passionate about continuous learning and exploring the latest AI
                technologies to build innovative solutions that push the
                boundaries of what's possible
              </motion.p>

              {/* Enhanced Location with Alumni Status */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-center lg:justify-start gap-3 text-brand-text-light">
                  <MapPinIcon className="w-5 h-5 text-brand-primary" />
                  <span className="text-base font-medium">
                    San Francisco, CA
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-brand-text-light">
                  <a
                    href="https://www.calpoly.edu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-brand-beige-light rounded-full border border-brand-secondary/30 hover:bg-gradient-to-r hover:from-brand-primary/10 hover:to-brand-secondary/10 hover:text-brand-primary hover:border-brand-primary transition-all duration-300 cursor-pointer hover:scale-105"
                    aria-label="Visit Cal Poly website"
                  >
                    Cal Poly Alumni
                  </a>
                  <a
                    href="https://www.ccsf.edu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-brand-beige-light rounded-full border border-brand-secondary/30 hover:bg-gradient-to-r hover:from-brand-primary/10 hover:to-brand-secondary/10 hover:text-brand-primary hover:border-brand-primary transition-all duration-300 cursor-pointer hover:scale-105"
                    aria-label="Visit CCSF website"
                  >
                    CCSF Alumni
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column - Enhanced Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-16"
          >
            {/* Enhanced Typography Hierarchy */}
            <div className="space-y-10">
              {/* Main Headline with Balanced Typography */}
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-brand-text leading-tight tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <span className="font-serif">AI/ML</span>{" "}
                <span className="gradient-text font-serif">Engineer</span>
              </motion.h1>

              {/* Balanced Subheading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="space-y-6"
              >
                <h2 className="text-2xl md:text-3xl font-light text-brand-text-light leading-tight">
                  Building Intelligent Systems
                </h2>
                <p className="text-lg text-brand-text-light max-w-2xl leading-relaxed">
                  I specialize in developing AI-powered solutions using Python,
                  TypeScript, and modern frameworks. Currently working as a
                  contract AI/ML Engineer for Mercor, I leverage cutting-edge
                  technologies including Gemini and OpenAI to build intelligent
                  systems that solve real-world problems.
                </p>
              </motion.div>
            </div>

            {/* Enhanced Action Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="space-y-10"
            >
              {/* Enhanced Button Layout */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/resume/AIML_Resume_WintonGee.pdf" size="lg">
                  View Resume
                </Button>
                <Button
                  href="mailto:wintongee@gmail.com?subject=Let's Connect - Portfolio Inquiry&body=Hi Winton,%0D%0A%0D%0AI came across your portfolio and would like to connect regarding potential opportunities.%0D%0A%0D%0ABest regards,"
                  variant="secondary"
                  size="lg"
                >
                  Let's Connect
                </Button>
              </div>

              {/* Enhanced Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="flex flex-wrap items-center justify-center sm:justify-start gap-4"
              >
                <a
                  href="https://linkedin.com/in/wintongee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-brand-text-light hover:text-brand-primary transition-all duration-300 hover:scale-105"
                  aria-label="Visit LinkedIn profile"
                >
                  <BuildingOfficeIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>
                <a
                  href="https://github.com/wintongee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-brand-text-light hover:text-brand-primary transition-all duration-300 hover:scale-105"
                  aria-label="Visit GitHub profile"
                >
                  <CodeBracketIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-medium">GitHub</span>
                </a>
                <a
                  href="mailto:wintongee@gmail.com"
                  className="group flex items-center gap-2 text-brand-text-light hover:text-brand-primary transition-all duration-300 hover:scale-105"
                  aria-label="Send email"
                >
                  <EnvelopeIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-medium">Email</span>
                </a>
                <a
                  href="/resume/AIML_Resume_WintonGee.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-brand-text-light hover:text-brand-primary transition-all duration-300 hover:scale-105"
                  aria-label="View resume"
                >
                  <DocumentTextIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-medium">Resume</span>
                </a>
              </motion.div>
            </motion.div>

            {/* Enhanced Technologies Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.0 }}
              className="pt-12"
            >
              <p className="text-base text-brand-text-light mb-8 font-semibold tracking-wide uppercase">
                Core Technologies
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  "Python",
                  "TypeScript",
                  "React",
                  "SQL",
                  "Gemini",
                  "OpenAI",
                  "Cursor",
                ].map((tech, index) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                    className="px-6 py-3 bg-brand-beige-light text-brand-text text-base font-medium rounded-full shadow-organic border border-brand-secondary/50 hover:bg-gradient-to-r hover:from-brand-primary/10 hover:to-brand-secondary/10 hover:text-brand-primary hover:border-brand-primary hover:shadow-organic-lg transition-all duration-300 cursor-pointer hover:scale-105"
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
