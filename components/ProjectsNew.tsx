"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getAllProjects } from "@/lib/content";
import { Project } from "@/types/project";
import Button from "./ui/Button";

interface ProjectItemProps {
  project: Project;
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
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    Live Demo
                  </a>
                )}
                {project.links.github && (
                  <a
                    href={project.links.github}
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
            {project.technologies.map((tech, tagIndex) => (
              <motion.span
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1 + 0.4 + tagIndex * 0.05,
                }}
                viewport={{ once: true }}
                className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full border border-blue-200 dark:border-blue-700"
              >
                {tech.name}
              </motion.span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            {project.links.caseStudy && (
              <Link href={project.links.caseStudy}>
                <Button size="lg" className="border-2 border-blue-500/20">
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
                </Button>
              </Link>
            )}

            {project.links.live && (
              <Button href={project.links.live} variant="outline" size="md">
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
              </Button>
            )}

            {project.links.github && (
              <Button href={project.links.github} variant="outline" size="md">
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
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ProjectsNew() {
  const projects = getAllProjects();

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
              <ProjectItem key={project.id} project={project} index={index} />
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
                <Button href="mailto:wintongee@gmail.com" size="lg">
                  Get In Touch
                </Button>
                <Button
                  href="https://github.com/wintongee"
                  variant="secondary"
                  size="lg"
                >
                  View All Projects
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
