"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Project } from "@/types/project";
import Button from "./ui/Button";
import { use3DTilt } from "@/hooks/use3DTilt";

const TILT_SPRING_CONFIG = { type: "spring" as const, stiffness: 100, damping: 15 };

interface ProjectItemProps {
  project: Project;
  index: number;
}

function ProjectItem({ project, index }: ProjectItemProps) {
  const isEven = index % 2 === 0;
  const { ref: imageRef, handleMouseMove, handleMouseLeave, rotation } = use3DTilt();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className=""
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
          style={{ perspective: "1000px" }}
        >
          <motion.div
            ref={imageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{
              rotateX: rotation.x,
              rotateY: rotation.y,
            }}
            transition={TILT_SPRING_CONFIG}
            className={`relative aspect-video w-full overflow-hidden rounded-2xl shadow-organic-2xl ${
              project.id === "paperinvoice"
                ? "bg-white dark:bg-slate-900"
                : ""
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            <Image
              src={project.imageUrl}
              alt={project.title}
              width={600}
              height={400}
              className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ${
                project.id === "paperinvoice" ? "object-contain" : "object-cover"
              }`}
            />
          </motion.div>
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
            <div className="flex items-center gap-3">
              <h3 className="text-xl sm:text-2xl font-bold text-brand-text">
                {project.title}
              </h3>
              {project.status === "in-progress" && (
                <span className="px-3 py-1 bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 text-brand-primary text-xs font-medium rounded-full border border-brand-primary/30 flex items-center gap-1">
                  <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></div>
                  In Progress
                </span>
              )}
              {project.status === "completed" && (
                <span className="px-3 py-1 bg-gradient-to-r from-brand-secondary/20 to-brand-secondary-light/20 text-brand-text text-xs font-medium rounded-full border border-brand-secondary/30 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Completed
                </span>
              )}
            </div>
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
              <Button
                href={project.links.caseStudy}
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

            {project.links.appStore && (
              <Button
                href={project.links.appStore}
                variant="outline"
                size="md"
                className="text-sm sm:text-base"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
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

export default function ProjectsNew({ projects }: { projects: Project[] }) {
  return (
    <div className="max-w-7xl mx-auto">
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
      <div className="space-y-16 sm:space-y-20 lg:space-y-24">
        {projects.map((project, index) => (
          <ProjectItem key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  );
}
