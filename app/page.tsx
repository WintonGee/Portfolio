import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="container mx-auto px-4 py-32">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Winton Gee
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            AI/ML Engineer & Software Developer
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/resume/AIML_Resume_WintonGee.pdf"
              target="_blank"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              View Resume
            </a>
            <a
              href="mailto:winton.gee@example.com"
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <About />

      {/* Projects Section */}
      <Projects />

      {/* Chatbot Section */}
      <section id="chat" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Ask Me Anything
        </h2>
        <div className="max-w-4xl mx-auto">
          <Chatbot />
        </div>
      </section>
    </main>
  );
}
