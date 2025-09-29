import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-20 bg-white dark:bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            About Me
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative w-80 h-80 rounded-full overflow-hidden shadow-2xl">
                <Image
                  src="/headshot.jpg"
                  alt="Winton Gee - AI/ML Engineer"
                  width={320}
                  height={320}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>

            {/* About Text */}
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                I'm a passionate AI/ML Engineer with over 5 years of experience
                building intelligent systems that solve real-world problems. My
                expertise spans machine learning, deep learning, natural
                language processing, and computer vision, with a strong
                foundation in software engineering and data science.
              </p>

              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                I specialize in developing end-to-end ML pipelines, from data
                preprocessing and model training to deployment and monitoring.
                I'm particularly interested in the intersection of AI and
                healthcare, where I've worked on projects involving medical
                image analysis and predictive modeling for patient outcomes.
              </p>

              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                When I'm not coding, you'll find me exploring the latest
                research papers, contributing to open-source projects, or
                mentoring aspiring data scientists. I believe in the power of AI
                to make the world a better place and am always excited to work
                on projects that have a positive impact.
              </p>

              {/* Skills/Technologies */}
              <div className="pt-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Core Technologies
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Python",
                    "TensorFlow",
                    "PyTorch",
                    "Scikit-learn",
                    "Pandas",
                    "NumPy",
                    "React",
                    "Next.js",
                    "TypeScript",
                    "Node.js",
                    "Docker",
                    "AWS",
                    "SQL",
                    "MongoDB",
                    "Git",
                    "Linux",
                    "Jupyter",
                    "MLflow",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
