"use client";

import { motion } from "framer-motion";
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
            {/* About Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Main narrative paragraphs */}
              <div className="space-y-6 text-center">
                <p className="text-lg text-brand-text-light leading-relaxed">
                  I'm a passionate software developer with experience building
                  full-stack applications that solve real-world problems. My
                  expertise spans web development, AI integration, and modern
                  JavaScript frameworks.
                </p>

                <p className="text-lg text-brand-text-light leading-relaxed">
                  I specialize in developing end-to-end web applications, from
                  frontend user interfaces to backend APIs and database design.
                  I'm particularly interested in AI integration, where I've
                  worked on applications that leverage AI APIs to provide
                  intelligent features and user experiences.
                </p>

                <p className="text-lg text-brand-text-light leading-relaxed">
                  When I'm not coding, you'll find me exploring new
                  technologies, contributing to open-source projects, or working
                  on personal projects that combine my interests in food,
                  technology, and problem-solving. I believe in the power of
                  technology to make everyday tasks more efficient and
                  enjoyable.
                </p>
              </div>

              {/* Key Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8"
              >
                <div className="text-center p-6 bg-brand-beige-light rounded-xl shadow-organic">
                  <div className="text-3xl font-bold text-brand-primary mb-2">
                    2+
                  </div>
                  <div className="text-sm text-brand-text-light">
                    Years Experience
                  </div>
                </div>
                <div className="text-center p-6 bg-brand-beige-light rounded-xl shadow-organic">
                  <div className="text-3xl font-bold text-brand-primary mb-2">
                    10+
                  </div>
                  <div className="text-sm text-brand-text-light">Projects</div>
                </div>
                <div className="text-center p-6 bg-brand-beige-light rounded-xl shadow-organic">
                  <div className="text-3xl font-bold text-brand-primary mb-2">
                    5+
                  </div>
                  <div className="text-sm text-brand-text-light">
                    Technologies
                  </div>
                </div>
                <div className="text-center p-6 bg-brand-beige-light rounded-xl shadow-organic">
                  <div className="text-3xl font-bold text-brand-primary mb-2">
                    1
                  </div>
                  <div className="text-sm text-brand-text-light">
                    Featured Project
                  </div>
                </div>
              </motion.div>

              {/* Core Technologies - Categorized */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="pt-6"
              >
                <h3 className="text-2xl font-semibold text-brand-text mb-8 text-center">
                  Core Technologies
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* AI / Web Technologies */}
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-brand-text mb-4">
                      AI / Web Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        "OpenAI API",
                        "React.js",
                        "Node.js",
                        "MongoDB",
                        "JavaScript",
                        "Material-UI",
                        "Express.js",
                        "Axios",
                      ].map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-2 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 text-brand-primary text-sm font-medium rounded-full border border-brand-primary/20 hover:from-brand-primary/20 hover:to-brand-secondary/20 hover:border-brand-primary transition-all duration-300 cursor-pointer"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Frontend Development */}
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-brand-text mb-4">
                      Frontend Development
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {["React", "Next.js", "TypeScript", "Tailwind CSS"].map(
                        (tech) => (
                          <span
                            key={tech}
                            className="px-3 py-2 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 text-brand-primary text-sm font-medium rounded-full border border-brand-primary/20 hover:from-brand-primary/20 hover:to-brand-secondary/20 hover:border-brand-primary transition-all duration-300 cursor-pointer"
                          >
                            {tech}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Backend & Tools */}
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-brand-text mb-4">
                      Backend & Tools
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        "Express.js",
                        "MongoDB",
                        "JWT",
                        "Git",
                        "VS Code",
                        "npm",
                        "REST APIs",
                        "JSON",
                        "HTTP",
                        "CORS",
                      ].map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-2 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 text-brand-primary text-sm font-medium rounded-full border border-brand-primary/20 hover:from-brand-primary/20 hover:to-brand-secondary/20 hover:border-brand-primary transition-all duration-300 cursor-pointer"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Education Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="pt-8"
              >
                <h3 className="text-2xl font-semibold text-brand-text mb-8 text-center">
                  My <span className="gradient-text">Journey</span>
                </h3>
                <EducationTimeline />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
