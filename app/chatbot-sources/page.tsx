"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface SourceFile {
  path: string;
  content: string;
  title: string;
  category: string;
}

export default function ChatbotSources() {
  const [sources, setSources] = useState<SourceFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<SourceFile | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load all markdown files from the chatbot data directory
    const loadSources = async () => {
      try {
        setError(null);
        const response = await fetch("/api/chatbot-sources");
        if (response.ok) {
          const data = await response.json();
          setSources(data);
        } else {
          setError(
            `Failed to load sources: ${response.status} ${response.statusText}`
          );
        }
      } catch (error) {
        console.error("Error loading sources:", error);
        setError("Failed to load chatbot sources. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadSources();
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showModal) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  const categories = Array.from(
    new Set(sources.map((source) => source.category))
  );
  const filteredSources = sources.filter((source) => {
    const matchesCategory =
      selectedCategory === "all" || source.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.path.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openModal = (source: SourceFile) => {
    setSelectedSource(source);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSource(null);
    setShowScrollTop(false);
  };

  const scrollToTop = () => {
    const contentArea = document.querySelector(".modal-content-scroll");
    if (contentArea) {
      contentArea.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const copyToClipboard = async () => {
    if (!selectedSource || isCopying) return;

    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(selectedSource.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = selectedSource.content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } finally {
      setIsCopying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-beige via-brand-beige-light to-brand-beige-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-brand-text-light">Loading chatbot sources...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-beige via-brand-beige-light to-brand-beige-dark flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-brand-beige-light rounded-xl shadow-organic-lg border border-brand-secondary/30 p-6">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-brand-text mb-2">
              Error Loading Sources
            </h2>
            <p className="text-brand-text-light mb-4">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-brand-primary to-brand-primary-light hover:from-brand-primary-dark hover:to-brand-primary text-brand-beige px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-organic hover:shadow-organic-lg"
            >
              Try Again
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-beige via-brand-beige-light to-brand-beige-dark relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-16 right-16 w-40 h-40 bg-gradient-to-r from-brand-primary/15 to-brand-secondary/15 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -12, 0],
            rotate: [0, -360, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute bottom-24 left-16 w-32 h-32 bg-gradient-to-r from-brand-secondary/15 to-brand-primary/15 rounded-full blur-2xl"
        />
      </div>

      {/* Navigation Header */}
      <div className="bg-brand-primary/90 text-brand-beige py-4 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-brand-beige hover:text-brand-beige-light transition-colors duration-300"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="font-medium">Back to Portfolio</span>
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-brand-primary text-brand-beige py-16 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Chatbot Knowledge Sources
            </h1>
            <p className="text-brand-beige-light text-lg max-w-2xl mx-auto">
              Explore the information sources that power my AI chatbot. These
              files contain the data I use to answer your questions.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 pr-4 text-sm bg-gradient-to-r from-brand-beige-light to-brand-beige border border-brand-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-light">
                🔍
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-text-light hover:text-brand-text transition-colors duration-200"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md min-h-[44px] flex items-center justify-center ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-brand-primary to-brand-primary-light text-brand-beige shadow-lg"
                  : "bg-gradient-to-r from-brand-beige-light to-brand-beige text-brand-text hover:from-brand-secondary/20 hover:to-brand-secondary/30 hover:text-brand-text border border-brand-secondary/50 hover:border-brand-primary shadow-sm hover:shadow-md"
              }`}
            >
              All Sources
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md min-h-[44px] flex items-center justify-center ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-brand-primary to-brand-primary-light text-brand-beige shadow-lg"
                    : "bg-gradient-to-r from-brand-beige-light to-brand-beige text-brand-text hover:from-brand-secondary/20 hover:to-brand-secondary/30 hover:text-brand-text border border-brand-secondary/50 hover:border-brand-primary shadow-sm hover:shadow-md"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Sources Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSources.map((source, index) => (
            <motion.div
              key={source.path}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-gradient-to-br from-brand-beige-light to-brand-beige rounded-xl shadow-organic-lg hover:shadow-2xl border border-brand-secondary/30 overflow-hidden hover:border-brand-primary/30 transition-all duration-300 group relative flex flex-col min-h-[400px] hover:-translate-y-2 hover:scale-[1.02]"
            >
              {/* Card Header with Gradient */}
              <div className="bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 p-4 border-b border-brand-secondary/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-brand-text group-hover:text-brand-primary transition-colors duration-300 truncate">
                    {source.title}
                  </h3>
                  <span className="text-xs bg-gradient-to-r from-brand-primary/25 to-brand-secondary/25 text-brand-primary-dark px-3 py-1 rounded-full font-medium border border-brand-primary/40 flex-shrink-0 ml-2 shadow-sm">
                    {source.category}
                  </span>
                </div>
                <p className="text-xs text-brand-text-light/60 mt-2 truncate">
                  📁 {source.path}
                </p>
              </div>

              {/* Card Content */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="prose prose-sm max-w-none text-brand-text-light flex-1 flex flex-col">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed bg-brand-beige/30 p-3 rounded-lg border border-brand-secondary/20 flex-1 h-full flex flex-col justify-start">
                    {source.content.length > 300
                      ? `${source.content.substring(0, 300)}...`
                      : source.content}
                  </div>
                </div>

                {/* File Stats */}
                <div className="mt-4 flex items-center justify-between text-xs text-brand-text-light/60">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-brand-primary/60 rounded-full"></span>
                      {source.content.length} chars
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-brand-secondary/60 rounded-full"></span>
                      {source.content.split("\n").length} lines
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button - Fixed at bottom */}
              <div className="p-4 pt-0">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openModal(source)}
                  className="w-full bg-gradient-to-r from-brand-primary to-brand-primary-light hover:from-brand-primary-dark hover:to-brand-primary text-brand-beige px-6 py-3 rounded-lg text-base font-semibold transition-all duration-300 shadow-organic-lg hover:shadow-2xl flex items-center justify-center gap-2 border-2 border-brand-primary/20 hover:border-brand-primary/40 hover:shadow-brand-primary/25"
                >
                  View Full File
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSources.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="bg-brand-beige-light rounded-xl shadow-organic-lg border border-brand-secondary/30 p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-lg font-semibold text-brand-text mb-2">
                No sources found
              </h3>
              <p className="text-brand-text-light mb-4">
                {searchQuery
                  ? `No sources found matching "${searchQuery}".`
                  : selectedCategory === "all"
                  ? "No chatbot sources are available at the moment."
                  : `No sources found in the "${selectedCategory}" category.`}
              </p>
              <div className="flex gap-2 justify-center">
                {searchQuery && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchQuery("")}
                    className="bg-gradient-to-r from-brand-secondary to-brand-secondary-light hover:from-brand-secondary-dark hover:to-brand-secondary text-brand-text px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-organic hover:shadow-organic-lg"
                  >
                    Clear Search
                  </motion.button>
                )}
                {selectedCategory !== "all" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory("all")}
                    className="bg-gradient-to-r from-brand-primary to-brand-primary-light hover:from-brand-primary-dark hover:to-brand-primary text-brand-beige px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-organic hover:shadow-organic-lg"
                  >
                    View All Sources
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal for viewing full file */}
      {showModal && selectedSource && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-gradient-to-br from-brand-beige-light to-brand-beige rounded-xl shadow-2xl border border-brand-secondary/30 w-full max-w-5xl max-h-[85vh] h-[80vh] sm:h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            {/* Modal Header - Fixed */}
            <div className="bg-gradient-to-r from-brand-primary to-brand-primary-light text-brand-beige p-4 sm:p-6 flex-shrink-0 border-b border-brand-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h2
                    id="modal-title"
                    className="text-lg sm:text-xl font-bold truncate"
                  >
                    {selectedSource.title}
                  </h2>
                  <p
                    id="modal-description"
                    className="text-brand-beige-light text-xs sm:text-sm mt-1 truncate"
                  >
                    {selectedSource.path}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-xs bg-brand-beige/20 text-brand-beige px-2 py-1 rounded-full font-medium">
                    {selectedSource.category}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeModal}
                    className="text-brand-beige hover:text-brand-beige-light text-xl font-bold transition-all duration-200 p-1 rounded-full hover:bg-brand-beige/10"
                    title="Close (ESC)"
                  >
                    ×
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div
              className="flex-1 overflow-y-auto p-4 sm:p-6 relative modal-content-scroll"
              onScroll={(e) => {
                const target = e.target as HTMLElement;
                const scrollTop = target.scrollTop;
                const scrollHeight = target.scrollHeight - target.clientHeight;
                const progress =
                  scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

                setShowScrollTop(scrollTop > 100);
                setScrollProgress(progress);
              }}
            >
              {/* Scroll indicator */}
              <div className="absolute top-0 right-0 w-2 h-full bg-brand-secondary/30 rounded-full">
                <div
                  className="w-full bg-gradient-to-b from-brand-primary to-brand-primary-light rounded-full transition-all duration-300 shadow-sm"
                  style={{ height: `${scrollProgress}%` }}
                ></div>
              </div>

              <div className="prose prose-sm max-w-none text-brand-text pr-2">
                <div className="whitespace-pre-wrap text-sm leading-relaxed font-mono bg-brand-beige/30 p-4 rounded-lg border border-brand-secondary/20 overflow-x-auto">
                  {selectedSource.content}
                </div>
              </div>

              {/* Scroll to top button */}
              {showScrollTop && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={scrollToTop}
                  className="fixed bottom-20 right-6 bg-gradient-to-r from-brand-primary to-brand-primary-light hover:from-brand-primary-dark hover:to-brand-primary text-brand-beige p-3 rounded-full shadow-organic-lg hover:shadow-organic-xl transition-all duration-300 z-10"
                  title="Scroll to top"
                >
                  ↑
                </motion.button>
              )}
            </div>

            {/* Modal Footer - Fixed */}
            <div className="bg-brand-beige border-t border-brand-secondary/30 p-4 sm:p-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-brand-text-light">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
                    {selectedSource.content.length} characters
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-brand-secondary rounded-full"></span>
                    {selectedSource.content.split("\n").length} lines
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyToClipboard}
                    disabled={isCopying}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-organic hover:shadow-organic-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                      copySuccess
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-brand-secondary hover:bg-brand-secondary-dark text-brand-text"
                    }`}
                    title="Copy content to clipboard"
                  >
                    {isCopying
                      ? "Copying..."
                      : copySuccess
                      ? "Copied!"
                      : "Copy"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeModal}
                    className="bg-gradient-to-r from-brand-primary to-brand-primary-light hover:from-brand-primary-dark hover:to-brand-primary text-brand-beige px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-organic hover:shadow-organic-lg"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
