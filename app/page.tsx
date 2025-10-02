"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { JourneySection, TechStackSection } from "@/components/About";
import ProjectsNew from "@/components/ProjectsNew";
import Chatbot from "@/components/Chatbot";
import FloatingChatButton from "@/components/FloatingChatButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-beige to-brand-beige-light">
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
        className="relative py-12 sm:py-16 bg-gradient-to-b from-brand-beige-light to-brand-beige"
      >
        {/* Section divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/60 to-transparent"></div>
        <div className="container mx-auto px-4">
          <JourneySection />
        </div>
      </motion.section>

      {/* Tech Stack Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative py-12 sm:py-16 bg-gradient-to-b from-brand-beige to-brand-beige-light"
      >
        {/* Section divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/60 to-transparent"></div>
        <div className="container mx-auto px-4">
          <TechStackSection />
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        id="projects"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-brand-beige-light to-brand-beige"
      >
        {/* Section divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/60 to-transparent"></div>
        <div className="container mx-auto px-4">
          <ProjectsNew />
        </div>
      </motion.section>

      {/* Chatbot Section - Hidden but functional */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        id="chat"
        className="hidden relative py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-brand-beige to-brand-beige-light"
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
            className="max-w-4xl mx-auto px-2 sm:px-0"
          >
            <Chatbot />
          </motion.div>
        </div>
      </motion.section>

      {/* Floating Chat Button - Hidden but functional */}
      <div className="hidden">
        <FloatingChatButton />
      </div>
    </main>
  );
}
