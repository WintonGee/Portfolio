"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import EducationTimeline from "./EducationTimeline";

export default function About() {
  return (
    <section
      id="about"
      className="py-32 bg-gradient-to-b from-brand-beige-light to-brand-beige"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-brand-text mb-6">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-xl text-brand-text-light max-w-3xl mx-auto">
              Passionate about building intelligent systems that make a
              difference
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Professional Photo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center mb-16"
            >
              <div className="relative group">
                <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-organic-2xl ring-4 ring-brand-secondary/20">
                  <Image
                    src="/headshot.jpg"
                    alt="Winton Gee - AI/ML Engineer"
                    width={256}
                    height={256}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>

                {/* Floating accent elements */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full opacity-80"
                />
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-brand-secondary to-brand-primary rounded-full opacity-80"
                />
              </div>
            </motion.div>

            {/* About Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Main content */}
              <div className="space-y-6 text-center">
                <p className="text-lg text-brand-text-light leading-relaxed">
                  I'm a passionate AI/ML Engineer with over 5 years of
                  experience building intelligent systems that solve real-world
                  problems. My expertise spans machine learning, deep learning,
                  natural language processing, and computer vision.
                </p>

                <p className="text-lg text-brand-text-light leading-relaxed">
                  I specialize in developing end-to-end ML pipelines, from data
                  preprocessing to production deployment. I'm particularly
                  interested in healthcare AI, where I've worked on medical
                  image analysis and predictive modeling for patient outcomes.
                </p>

                <p className="text-lg text-brand-text-light leading-relaxed">
                  When I'm not coding, you'll find me exploring the latest
                  research papers, contributing to open-source projects, or
                  mentoring aspiring data scientists. I believe in the power of
                  AI to make the world a better place.
                </p>
              </div>

              {/* Education Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="pt-8"
              >
                <h3 className="text-2xl font-semibold text-brand-text mb-8 text-center">
                  My <span className="gradient-text">Journey</span>
                </h3>
                <EducationTimeline />
              </motion.div>

              {/* Key Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8"
              >
                <div className="text-center p-6 bg-brand-beige-light rounded-xl shadow-organic">
                  <div className="text-3xl font-bold text-brand-primary mb-2">
                    5+
                  </div>
                  <div className="text-sm text-brand-text-light">
                    Years Experience
                  </div>
                </div>
                <div className="text-center p-6 bg-brand-beige-light rounded-xl shadow-organic">
                  <div className="text-3xl font-bold text-brand-primary mb-2">
                    50+
                  </div>
                  <div className="text-sm text-brand-text-light">Projects</div>
                </div>
                <div className="text-center p-6 bg-brand-beige-light rounded-xl shadow-organic">
                  <div className="text-3xl font-bold text-brand-primary mb-2">
                    10+
                  </div>
                  <div className="text-sm text-brand-text-light">AI Models</div>
                </div>
                <div className="text-center p-6 bg-brand-beige-light rounded-xl shadow-organic">
                  <div className="text-3xl font-bold text-brand-primary mb-2">
                    3
                  </div>
                  <div className="text-sm text-brand-text-light">
                    Research Papers
                  </div>
                </div>
              </motion.div>

              {/* Core Technologies - Simplified */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="pt-6"
              >
                <h3 className="text-2xl font-semibold text-brand-text mb-8 text-center">
                  Core Technologies
                </h3>

                <div className="flex flex-wrap gap-3 justify-center">
                  {[
                    "Python",
                    "TensorFlow",
                    "PyTorch",
                    "React",
                    "Next.js",
                    "AWS",
                    "Docker",
                    "FastAPI",
                    "SQL",
                    "MongoDB",
                    "Git",
                    "Linux",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 text-brand-primary text-sm font-medium rounded-full border border-brand-primary/20 hover:from-brand-primary/20 hover:to-brand-secondary/20 hover:border-brand-primary transition-all duration-300 cursor-pointer"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
