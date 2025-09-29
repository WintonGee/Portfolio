"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Sample project data - replace with your actual projects
const projects = [
  {
    title: "AI-Powered Medical Diagnosis System",
    description:
      "Developed a deep learning model using CNN and transfer learning to assist radiologists in detecting early-stage lung cancer from chest X-rays. Achieved 94% accuracy and reduced diagnosis time by 60%.",
    imageUrl: "/placeholder-medical-ai.jpg", // Replace with actual image
    tags: ["Python", "TensorFlow", "CNN", "Medical AI", "OpenCV"],
    liveUrl: "https://medical-ai-demo.vercel.app",
    githubUrl: "https://github.com/wintongee/medical-ai-diagnosis",
    caseStudyUrl: "/projects/ai-medical-diagnosis",
  },
  {
    title: "Real-time Sentiment Analysis API",
    description:
      "Built a scalable REST API using FastAPI and deployed on AWS that performs real-time sentiment analysis on social media posts. Handles 10,000+ requests per minute with 99.9% uptime.",
    imageUrl: "/placeholder-sentiment-api.jpg", // Replace with actual image
    tags: ["Python", "FastAPI", "AWS", "NLP", "Docker", "Redis"],
    liveUrl: "https://sentiment-api-docs.vercel.app",
    githubUrl: "https://github.com/wintongee/sentiment-analysis-api",
    caseStudyUrl: "/projects/sentiment-analysis-api",
  },
  {
    title: "Autonomous Trading Bot",
    description:
      "Created an ML-powered cryptocurrency trading bot using reinforcement learning. The bot analyzes market patterns and executes trades automatically, achieving 15% average monthly returns.",
    imageUrl: "/placeholder-trading-bot.jpg", // Replace with actual image
    tags: [
      "Python",
      "Reinforcement Learning",
      "Pandas",
      "Binance API",
      "MLflow",
    ],
    githubUrl: "https://github.com/wintongee/autonomous-trading-bot",
  },
  {
    title: "Computer Vision Object Detection",
    description:
      "Implemented YOLO v8 for real-time object detection in video streams. Optimized for edge devices using TensorRT, achieving 30 FPS on NVIDIA Jetson Nano.",
    imageUrl: "/placeholder-object-detection.jpg", // Replace with actual image
    tags: ["Python", "YOLO", "OpenCV", "TensorRT", "Edge Computing"],
    liveUrl: "https://object-detection-demo.vercel.app",
    githubUrl: "https://github.com/wintongee/object-detection-yolo",
  },
  {
    title: "Natural Language Processing Pipeline",
    description:
      "Built an end-to-end NLP pipeline for document classification and named entity recognition. Processes 1M+ documents daily with 97% accuracy using transformer models.",
    imageUrl: "/placeholder-nlp-pipeline.jpg", // Replace with actual image
    tags: ["Python", "Transformers", "spaCy", "Apache Airflow", "PostgreSQL"],
    githubUrl: "https://github.com/wintongee/nlp-document-pipeline",
  },
  {
    title: "Predictive Analytics Dashboard",
    description:
      "Developed an interactive dashboard using React and D3.js for visualizing ML model predictions and business metrics. Features real-time updates and advanced filtering capabilities.",
    imageUrl: "/placeholder-dashboard.jpg", // Replace with actual image
    tags: ["React", "D3.js", "TypeScript", "Node.js", "MongoDB"],
    liveUrl: "https://analytics-dashboard.vercel.app",
    githubUrl: "https://github.com/wintongee/predictive-analytics-dashboard",
  },
];

interface ProjectItemProps {
  project: (typeof projects)[0];
  index: number;
}

function ProjectItem({ project, index }: ProjectItemProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="mb-24"
    >
      <div
        className={`grid lg:grid-cols-2 gap-12 items-center ${
          !isEven ? "lg:grid-flow-col-dense" : ""
        }`}
      >
        {/* Project Image */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
          viewport={{ once: true }}
          className={`relative group ${!isEven ? "lg:col-start-2" : ""}`}
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src={project.imageUrl}
              alt={project.title}
              width={600}
              height={400}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Overlay content */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    View Code
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Floating accent */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5,
            }}
            className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20"
          />
        </motion.div>

        {/* Project Content */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
          viewport={{ once: true }}
          className={`space-y-6 ${
            !isEven ? "lg:col-start-1 lg:row-start-1" : ""
          }`}
        >
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              {project.title}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Technology Tags */}
          <div className="flex flex-wrap gap-3">
            {project.tags.map((tag, tagIndex) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1 + 0.4 + tagIndex * 0.05,
                }}
                viewport={{ once: true }}
                className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full border border-blue-200 dark:border-blue-700"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            {project.caseStudyUrl && (
              <Link
                href={project.caseStudyUrl}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 transform border-2 border-blue-500/20"
              >
                <span className="relative z-10 flex items-center gap-2">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Case Study
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
              </Link>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 transform flex items-center gap-2"
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
                className="group px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 transform flex items-center gap-2"
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
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ProjectsNew() {
  return (
    <section
      id="projects"
      className="py-32 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A showcase of my recent AI/ML projects, from computer vision and
              natural language processing to predictive analytics and autonomous
              systems. Each project demonstrates my expertise in building
              scalable, production-ready solutions.
            </p>
          </motion.div>

          {/* Projects List */}
          <div className="space-y-8">
            {projects.map((project, index) => (
              <ProjectItem key={index} project={project} index={index} />
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <div className="glass-effect rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Interested in collaborating?
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                I'm always excited to work on new projects and explore
                innovative solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:wintongee@gmail.com"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 transform"
                >
                  <span className="relative z-10">Get In Touch</span>
                </a>
                <a
                  href="https://github.com/wintongee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
                >
                  View All Projects
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
