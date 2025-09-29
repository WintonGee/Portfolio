"use client";

import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

// Sample project data - replace with your actual projects
const projects = [
  {
    slug: "ai-medical-diagnosis",
    title: "AI-Powered Medical Diagnosis System",
    summary:
      "A deep learning system that assists radiologists in detecting early-stage lung cancer from chest X-rays with 94% accuracy.",
    technologies: [
      "Python",
      "TensorFlow",
      "CNN",
      "Medical AI",
      "OpenCV",
      "DICOM",
    ],
    problem:
      "Early detection of lung cancer is crucial for patient survival, but manual analysis of chest X-rays is time-consuming and can miss subtle signs of early-stage cancer. Radiologists often face high workloads and may miss critical details in complex cases.",
    solution:
      "I developed a deep learning model using Convolutional Neural Networks (CNN) and transfer learning techniques. The system processes chest X-rays in real-time, highlighting potential areas of concern and providing confidence scores for each detection.",
    technicalDetails: [
      "Implemented a custom CNN architecture based on ResNet-50 with medical imaging optimizations",
      "Used transfer learning with pre-trained models on ImageNet, then fine-tuned on medical datasets",
      "Applied data augmentation techniques including rotation, scaling, and intensity adjustments",
      "Implemented attention mechanisms to focus on relevant anatomical regions",
      "Built a REST API using FastAPI for real-time inference",
      "Created a web interface for radiologists to review AI-assisted diagnoses",
    ],
    outcomes: [
      "Achieved 94% accuracy in detecting early-stage lung cancer",
      "Reduced diagnosis time by 60% for radiologists",
      "Processed over 10,000 chest X-rays with consistent results",
      "Received positive feedback from medical professionals",
      "Published research paper in Medical AI Journal",
    ],
    images: [
      {
        src: "/placeholder-medical-ai-1.jpg",
        alt: "AI Diagnosis Interface",
        caption:
          "The AI-powered diagnosis interface showing detected anomalies",
      },
      {
        src: "/placeholder-medical-ai-2.jpg",
        alt: "Model Architecture",
        caption: "CNN architecture diagram with attention mechanisms",
      },
    ],
    liveUrl: "https://medical-ai-demo.vercel.app",
    githubUrl: "https://github.com/wintongee/medical-ai-diagnosis",
    duration: "6 months",
    teamSize: "3 people",
    role: "Lead AI Engineer",
  },
  {
    slug: "sentiment-analysis-api",
    title: "Real-time Sentiment Analysis API",
    summary:
      "A scalable REST API that performs real-time sentiment analysis on social media posts, handling 10,000+ requests per minute.",
    technologies: [
      "Python",
      "FastAPI",
      "AWS",
      "NLP",
      "Docker",
      "Redis",
      "BERT",
    ],
    problem:
      "Companies need to monitor public sentiment about their brands and products in real-time, but existing solutions are either too slow or too expensive for high-volume social media monitoring.",
    solution:
      "I built a high-performance sentiment analysis API using state-of-the-art NLP models and optimized infrastructure. The system processes text in multiple languages and provides detailed sentiment scores with confidence levels.",
    technicalDetails: [
      "Fine-tuned BERT model on social media datasets for improved accuracy",
      "Implemented Redis caching for frequently analyzed text patterns",
      "Used AWS Lambda for serverless scaling during peak traffic",
      "Built custom tokenization pipeline for social media text preprocessing",
      "Implemented rate limiting and request queuing for fair resource usage",
      "Created comprehensive monitoring and alerting system",
    ],
    outcomes: [
      "Handles 10,000+ requests per minute with 99.9% uptime",
      "Achieved 89% accuracy on sentiment classification",
      "Reduced API response time to under 100ms average",
      "Served over 1 million requests in first month",
      "Generated $50K+ in revenue for the company",
    ],
    images: [
      {
        src: "/placeholder-sentiment-api-1.jpg",
        alt: "API Dashboard",
        caption:
          "Real-time monitoring dashboard showing API performance metrics",
      },
      {
        src: "/placeholder-sentiment-api-2.jpg",
        alt: "Sentiment Analysis Results",
        caption: "Example sentiment analysis results with confidence scores",
      },
    ],
    liveUrl: "https://sentiment-api-docs.vercel.app",
    githubUrl: "https://github.com/wintongee/sentiment-analysis-api",
    duration: "4 months",
    teamSize: "2 people",
    role: "Full-stack Developer",
  },
];

interface ProjectCaseStudyProps {
  params: {
    slug: string;
  };
}

export default function ProjectCaseStudy({ params }: ProjectCaseStudyProps) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

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
              <ArrowLeftIcon className="w-5 h-5" />
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
                  <ExternalLinkIcon className="w-4 h-4" />
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
                  <CodeBracketIcon className="w-4 h-4" />
                  View Code
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

// Generate static params for all projects
export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}
