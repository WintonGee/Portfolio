"use client";

import { motion } from "framer-motion";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  institution?: string;
  isCurrent?: boolean;
}

const timelineData: TimelineItem[] = [
  {
    year: "2018 - 2020",
    title: "Mechanical Engineering Foundation",
    description:
      "Started my academic journey in Mechanical Engineering, building a strong foundation in problem-solving, mathematics, and engineering principles.",
    institution: "Initial Engineering Studies",
  },
  {
    year: "2020 - 2021",
    title: "The COVID-19 Catalyst & Discovery",
    description:
      "During the pandemic, I discovered programming and fell in love with the creative problem-solving it offered. This pivotal moment changed my entire career trajectory.",
    institution: "Self-Directed Learning",
  },
  {
    year: "2021 - 2023",
    title: "Transition to Computer Science",
    description:
      "Formally shifted to Computer Science, earning my Associate's degree while building a solid foundation in programming, algorithms, and software development.",
    institution: "City College of San Francisco",
  },
  {
    year: "2023 - Present",
    title: "Specialization in AI/ML",
    description:
      "Pursuing a Bachelor's degree in Computer Science with a concentration in Artificial Intelligence, focusing on machine learning, deep learning, and intelligent systems.",
    institution: "California Polytechnic State University, San Luis Obispo",
    isCurrent: true,
  },
];

export default function EducationTimeline() {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-primary via-brand-secondary to-brand-primary opacity-60 hidden md:block"></div>

      <div className="space-y-12">
        {timelineData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="relative flex items-start"
          >
            {/* Timeline dot */}
            <div className="relative z-10 flex-shrink-0">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                viewport={{ once: true }}
                className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-organic-lg ${
                  item.isCurrent
                    ? "bg-gradient-to-r from-brand-primary to-brand-secondary animate-pulse"
                    : "bg-gradient-to-r from-brand-secondary to-brand-primary"
                }`}
              >
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-brand-beige-light flex items-center justify-center">
                  <div
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                      item.isCurrent ? "bg-brand-primary" : "bg-brand-secondary"
                    }`}
                  ></div>
                </div>
              </motion.div>

              {/* Current indicator */}
              {item.isCurrent && (
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary opacity-30"
                />
              )}
            </div>

            {/* Content card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
              viewport={{ once: true }}
              className="ml-4 md:ml-8 flex-1"
            >
              <div className="bg-brand-beige-light rounded-2xl p-4 md:p-6 shadow-organic-lg border border-brand-secondary/20 hover:shadow-organic-xl transition-all duration-300 hover:border-brand-primary/30">
                {/* Year badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 text-brand-primary border border-brand-primary/20 mb-4">
                  {item.year}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-brand-text mb-3">
                  {item.title}
                </h3>

                {/* Institution */}
                {item.institution && (
                  <p className="text-brand-primary font-medium mb-3 text-sm">
                    {item.institution}
                  </p>
                )}

                {/* Description */}
                <p className="text-brand-text-light leading-relaxed">
                  {item.description}
                </p>

                {/* Current status indicator */}
                {item.isCurrent && (
                  <div className="mt-4 flex items-center text-brand-primary text-sm font-medium">
                    <div className="w-2 h-2 rounded-full bg-brand-primary mr-2 animate-pulse"></div>
                    Currently Pursuing
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 rounded-full opacity-60"></div>
      <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-brand-secondary/20 to-brand-primary/20 rounded-full opacity-60"></div>
    </div>
  );
}
