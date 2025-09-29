import ProjectCard from "./ProjectCard";

// Sample project data - replace with your actual projects
const projects = [
  {
    title: "AI-Powered Medical Diagnosis System",
    description:
      "Developed a deep learning model using CNN and transfer learning to assist radiologists in detecting early-stage lung cancer from chest X-rays. Achieved 94% accuracy and reduced diagnosis time by 60%.",
    imageUrl: "/placeholder-medical-ai.jpg", // Replace with actual image
    tags: ["Python", "TensorFlow", "CNN", "Medical AI", "OpenCV"],
    liveUrl: "https://medical-ai-demo.vercel.app",
    githubUrl: "https://github.com/wintongee/medical-ai-diagnosis",
  },
  {
    title: "Real-time Sentiment Analysis API",
    description:
      "Built a scalable REST API using FastAPI and deployed on AWS that performs real-time sentiment analysis on social media posts. Handles 10,000+ requests per minute with 99.9% uptime.",
    imageUrl: "/placeholder-sentiment-api.jpg", // Replace with actual image
    tags: ["Python", "FastAPI", "AWS", "NLP", "Docker", "Redis"],
    liveUrl: "https://sentiment-api-docs.vercel.app",
    githubUrl: "https://github.com/wintongee/sentiment-analysis-api",
  },
  {
    title: "Autonomous Trading Bot",
    description:
      "Created an ML-powered cryptocurrency trading bot using reinforcement learning. The bot analyzes market patterns and executes trades automatically, achieving 15% average monthly returns.",
    imageUrl: "/placeholder-trading-bot.jpg", // Replace with actual image
    tags: [
      "Python",
      "Reinforcement Learning",
      "Pandas",
      "Binance API",
      "MLflow",
    ],
    githubUrl: "https://github.com/wintongee/autonomous-trading-bot",
  },
  {
    title: "Computer Vision Object Detection",
    description:
      "Implemented YOLO v8 for real-time object detection in video streams. Optimized for edge devices using TensorRT, achieving 30 FPS on NVIDIA Jetson Nano.",
    imageUrl: "/placeholder-object-detection.jpg", // Replace with actual image
    tags: ["Python", "YOLO", "OpenCV", "TensorRT", "Edge Computing"],
    liveUrl: "https://object-detection-demo.vercel.app",
    githubUrl: "https://github.com/wintongee/object-detection-yolo",
  },
  {
    title: "Natural Language Processing Pipeline",
    description:
      "Built an end-to-end NLP pipeline for document classification and named entity recognition. Processes 1M+ documents daily with 97% accuracy using transformer models.",
    imageUrl: "/placeholder-nlp-pipeline.jpg", // Replace with actual image
    tags: ["Python", "Transformers", "spaCy", "Apache Airflow", "PostgreSQL"],
    githubUrl: "https://github.com/wintongee/nlp-document-pipeline",
  },
  {
    title: "Predictive Analytics Dashboard",
    description:
      "Developed an interactive dashboard using React and D3.js for visualizing ML model predictions and business metrics. Features real-time updates and advanced filtering capabilities.",
    imageUrl: "/placeholder-dashboard.jpg", // Replace with actual image
    tags: ["React", "D3.js", "TypeScript", "Node.js", "MongoDB"],
    liveUrl: "https://analytics-dashboard.vercel.app",
    githubUrl: "https://github.com/wintongee/predictive-analytics-dashboard",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              My Work & Projects
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A showcase of my recent AI/ML projects, from computer vision and
              natural language processing to predictive analytics and autonomous
              systems. Each project demonstrates my expertise in building
              scalable, production-ready solutions.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.title}
                description={project.description}
                imageUrl={project.imageUrl}
                tags={project.tags}
                liveUrl={project.liveUrl}
                githubUrl={project.githubUrl}
              />
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Interested in collaborating or learning more about my work?
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="mailto:winton.gee@example.com"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 transform"
              >
                Get In Touch
              </a>
              <a
                href="https://github.com/wintongee"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-gray-600 dark:border-gray-400 text-gray-600 dark:text-gray-400 hover:bg-gray-600 hover:text-white dark:hover:bg-gray-400 dark:hover:text-gray-900 font-semibold py-3 px-8 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 transform"
              >
                View All Projects
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
