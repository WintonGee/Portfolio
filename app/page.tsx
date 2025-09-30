"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ProjectsNew from "@/components/ProjectsNew";
import Chatbot from "@/components/Chatbot";
import FloatingChatButton from "@/components/FloatingChatButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-beige to-brand-beige-light">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Timeline Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative py-32 bg-gradient-to-b from-brand-beige-light to-brand-beige"
      >
        {/* Section divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-secondary to-transparent"></div>
        <div className="container mx-auto px-4">
          <About />
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative"
      >
        {/* Section divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-secondary to-transparent"></div>
        <ProjectsNew />
      </motion.section>

      {/* Chatbot Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        id="chat"
        className="py-32 bg-gradient-to-b from-brand-beige-light to-brand-beige"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-brand-text mb-6">
              Ask Me <span className="gradient-text">Anything</span>
            </h2>
            <p className="text-xl text-brand-text-light max-w-3xl mx-auto">
              Have questions about my work, AI/ML, or want to discuss a
              potential collaboration? I'm here to help!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Chatbot />
          </motion.div>
        </div>
      </motion.section>

      {/* Floating Chat Button */}
      <FloatingChatButton />
    </main>
  );
}
