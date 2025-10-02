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
      className="mb-16 sm:mb-20 lg:mb-24"
    >
      <div
        className={`grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center ${
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
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-organic-2xl">
            <Image
              src={project.imageUrl}
              alt={project.title}
              width={600}
              height={400}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
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
            className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full opacity-20"
          />
        </motion.div>

        {/* Project Content */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
          viewport={{ once: true }}
          className={`space-y-4 sm:space-y-6 ${
            !isEven ? "lg:col-start-1 lg:row-start-1" : ""
          }`}
        >
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-brand-text">
              {project.title}
            </h3>
            <p className="text-base sm:text-lg text-brand-text-light leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Technology Tags */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
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
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 text-brand-primary text-xs sm:text-sm font-medium rounded-full border border-brand-primary/30"
              >
                {tech.name}
              </motion.span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 sm:gap-4 pt-4">
            {project.links.caseStudy && (
              <Link href={project.links.caseStudy}>
                <Button
                  size="md"
                  className="border-2 border-brand-primary/20 text-sm sm:text-base"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
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

            {project.links.report && (
              <Button
                href={project.links.report}
                variant="outline"
                size="md"
                className="text-sm sm:text-base border-2 border-brand-secondary/30"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Project Report
              </Button>
            )}

            {project.links.live && (
              <Button
                href={project.links.live}
                variant="outline"
                size="md"
                className="text-sm sm:text-base"
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Live Demo
              </Button>
            )}

            {project.links.github && (
              <Button
                href={project.links.github}
                variant="outline"
                size="md"
                className="text-sm sm:text-base"
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
    <div id="projects" className="max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12 sm:mb-16 lg:mb-20"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-text">
          Featured <span className="gradient-text">Projects</span>
        </h2>
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
        className="text-center mt-12 sm:mt-16 lg:mt-20"
      >
        <div className="glass-effect rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-brand-text mb-6 sm:mb-8">
            Interested in collaborating?
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
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
  );
}
