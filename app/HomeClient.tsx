"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { JourneySection, TechStackSection } from "@/components/About";
import ProjectsNew from "@/components/ProjectsNew";
import Chatbot from "@/components/Chatbot";
import CollaborationCTA from "@/components/CollaborationCTA";
import FloatingChatButton from "@/components/FloatingChatButton";
import Footer from "@/components/Footer";
import type { Project } from "@/types/project";
import type { TimelineItem } from "@/types/timeline";
import type { SkillData } from "@/types/skill";

interface TechItem {
  name: string;
  logo: string;
}
type TechEntry = TechItem | TechItem[];

interface Props {
  projects: Project[];
  technologies: Record<string, TechEntry[]>;
  skills: Record<string, SkillData>;
  timeline: TimelineItem[];
}

export default function HomeClient({
  projects,
  technologies,
  skills,
  timeline,
}: Props) {
  return (
    <main id="main-content" className="min-h-screen overflow-hidden bg-brand-beige">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Journey Section */}
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative py-16 sm:py-20 bg-[linear-gradient(180deg,#FAFAF0_0%,#F5F5DC_100%)]"
      >
        {/* Section divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/60 to-transparent"></div>
        <div className="container mx-auto px-4">
          <JourneySection timeline={timeline} />
        </div>
      </motion.section>

      {/* Tech Stack Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative py-16 sm:py-20 bg-[radial-gradient(circle_at_20%_20%,rgba(210,180,140,0.28),transparent_34%),linear-gradient(180deg,#F5F5DC_0%,#FAFAF0_100%)]"
      >
        {/* Section divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/60 to-transparent"></div>
        <div className="container mx-auto px-4">
          <TechStackSection technologies={technologies} skills={skills} />
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        id="projects"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative py-16 sm:py-24 lg:py-32 bg-[radial-gradient(circle_at_80%_10%,rgba(85,107,47,0.14),transparent_30%),linear-gradient(180deg,#FAFAF0_0%,#F5F5DC_100%)]"
      >
        {/* Section divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/60 to-transparent"></div>
        <div className="container mx-auto px-4">
          <ProjectsNew projects={projects} />
        </div>
      </motion.section>

      {/* Chatbot Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        id="chat"
        className="relative py-16 sm:py-24 lg:py-32 bg-[linear-gradient(180deg,#F5F5DC_0%,#FAFAF0_100%)]"
      >
        {/* Section divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/60 to-transparent"></div>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-heading-xl text-brand-text mb-8 sm:mb-12">
              Ask Me <span className="gradient-text">Anything</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto px-2 sm:px-4"
          >
            <Chatbot />
          </motion.div>
        </div>
      </motion.section>

      {/* Collaboration CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative py-16 sm:py-24 lg:py-32 bg-[radial-gradient(circle_at_50%_0%,rgba(210,180,140,0.34),transparent_36%),linear-gradient(180deg,#FAFAF0_0%,#F5F5DC_100%)]"
      >
        {/* Section divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/60 to-transparent"></div>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-heading-xl text-brand-text mb-8 sm:mb-12">
              Let&apos;s <span className="gradient-text">Collaborate</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <CollaborationCTA />
          </motion.div>
        </div>
      </motion.section>

      {/* Floating Chat Button */}
      <FloatingChatButton />

      {/* Footer */}
      <Footer />
    </main>
  );
}
