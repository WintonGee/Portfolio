"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
// Using inline SVG icons instead of Heroicons

interface Project {
  slug: string;
  title: string;
  summary: string;
  technologies: string[];
  problem: string;
  solution: string;
  technicalDetails: string[];
  outcomes: string[];
  images: Array<{
    src: string;
    alt: string;
    caption: string;
  }>;
  liveUrl?: string;
  githubUrl?: string;
  reportUrl?: string;
  duration: string;
  teamSize: string;
  role: string;
  codeImplementation?: {
    gptIntegration: {
      model: string;
      pricing: {
        input: string;
        output: string;
      };
      prompt: string;
      maxTokens: number;
      temperature: number;
    };
    apiEndpoint: string;
    errorHandling: string;
    caching: string;
  };
}

interface ProjectCaseStudyClientProps {
  project: Project;
}

export default function ProjectCaseStudyClient({
  project,
}: ProjectCaseStudyClientProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Portfolio
            </Link>
            <div className="flex gap-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  View Code
                </a>
              )}
              {project.reportUrl && (
                <a
                  href={project.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Project Report
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Project Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {project.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              {project.summary}
            </p>

            {/* Project Meta */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8">
              <span>
                <strong>Duration:</strong> {project.duration}
              </span>
              <span>
                <strong>Team:</strong> {project.teamSize}
              </span>
              <span>
                <strong>Role:</strong> {project.role}
              </span>
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap justify-center gap-3">
              {project.technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full border border-blue-200 dark:border-blue-700"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* The Problem */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              The Problem
            </h2>
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-lg">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {project.problem}
              </p>
            </div>
          </motion.section>

          {/* My Solution */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              My Solution & Technical Details
            </h2>
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-r-lg mb-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {project.solution}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Key Technical Implementations:
              </h3>
              <ul className="space-y-3">
                {project.technicalDetails.map((detail, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {detail}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Project Images */}
          {project.images && project.images.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Project Screenshots
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {project.images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                  >
                    <div className="relative aspect-video overflow-hidden rounded-lg shadow-lg">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      {image.caption}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Outcomes & Results */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Outcomes & Results
            </h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <ul className="space-y-4">
                {project.outcomes.map((outcome, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-lg text-gray-700 dark:text-gray-300">
                      {outcome}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Code Implementation & AI Integration */}
          {project.codeImplementation && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                AI Integration & Code Implementation
              </h2>

              {/* GPT-3.5 Turbo Integration */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-l-4 border-purple-500 p-6 rounded-r-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  🤖 OpenAI GPT-3.5 Turbo Integration
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Model Configuration
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>
                        <strong>Model:</strong>{" "}
                        {project.codeImplementation.gptIntegration.model}
                      </li>
                      <li>
                        <strong>Max Tokens:</strong>{" "}
                        {project.codeImplementation.gptIntegration.maxTokens}
                      </li>
                      <li>
                        <strong>Temperature:</strong>{" "}
                        {project.codeImplementation.gptIntegration.temperature}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Pricing Structure
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>
                        <strong>Input:</strong>{" "}
                        {
                          project.codeImplementation.gptIntegration.pricing
                            .input
                        }
                      </li>
                      <li>
                        <strong>Output:</strong>{" "}
                        {
                          project.codeImplementation.gptIntegration.pricing
                            .output
                        }
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* API Implementation */}
              <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🔧 API Implementation Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                      Endpoint
                    </h4>
                    <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm">
                      {project.codeImplementation.apiEndpoint}
                    </code>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                      Error Handling
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {project.codeImplementation.errorHandling}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                      Caching Strategy
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {project.codeImplementation.caching}
                    </p>
                  </div>
                </div>
              </div>

              {/* Prompt Engineering */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  💡 Prompt Engineering
                </h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {project.codeImplementation.gptIntegration.prompt}
                  </pre>
                </div>
              </div>
            </motion.section>
          )}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Interested in this project?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Let's discuss how we can work together on similar challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:wintongee@gmail.com"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
              >
                Get In Touch
              </a>
              {project.reportUrl && (
                <a
                  href={project.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
                >
                  View Project Report
                </a>
              )}
              <Link
                href="/"
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
              >
                View More Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
