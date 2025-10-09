"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChatSidebar, { QuestionCategory } from "./ChatSidebar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: Array<{
    title: string;
    filePath: string;
    similarity: number;
  }>;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm Winton. Ask me about my work, projects, or experience.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Set<string>>(
    new Set()
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Categorized questions for sidebar - Interview-focused
  const questionCategories: QuestionCategory[] = [
    {
      category: "Availability & Logistics",
      questions: [
        { label: "Work Authorization", question: "What is your work authorization status?" },
        { label: "Location & Relocation", question: "Where are you based and are you open to relocation?" },
        { label: "Remote Work", question: "Are you open to remote work opportunities?" },
        { label: "Career Goals", question: "What are you looking for in your next role?" },
      ],
    },
    {
      category: "Education & Research",
      questions: [
        { label: "Cal Poly SLO", question: "What did you study at Cal Poly San Luis Obispo?" },
        { label: "City College SF", question: "Tell me about your studies at City College of San Francisco" },
        { label: "AI Ethics Research", question: "What was your AI Ethics research at Cal Poly about?" },
        { label: "Advanced AI Studies", question: "Why did you pursue advanced AI studies after your bachelor's?" },
      ],
    },
    {
      category: "Professional Experience",
      questions: [
        { label: "Mercor - AI Engineer", question: "What is your current role at Mercor as an AI Engineer?" },
        { label: "CoChat - Founder", question: "Tell me about founding CoChat and your role as Founder" },
        { label: "AfterQuery - Software Engineer", question: "What did you do at AfterQuery Experts as a Software Engineer?" },
        { label: "Ricoh - Software Engineer Intern", question: "Tell me about your Software Engineer internship at Ricoh" },
        { label: "Tribot - Software Developer", question: "What did you do as a Software Developer at Tribot?" },
        { label: "LinkedIn - Apprentice", question: "What did you learn from your apprenticeship at LinkedIn?" },
        { label: "Square - Apprentice", question: "What was your apprenticeship experience like at Square?" },
      ],
    },
    {
      category: "Projects & Startups",
      questions: [
        { label: "TrustyFAQ Problem", question: "What problem does TrustyFAQ solve for team leads?" },
        { label: "Semantic Search", question: "How does semantic search work in TrustyFAQ?" },
        { label: "CoChat Founding", question: "Tell me about CoChat and how you founded it" },
        { label: "Voice Cloning Tech", question: "How does voice cloning technology work in CoChat?" },
        { label: "FoodManager AI", question: "What is FoodManager and what AI features did you build?" },
        { label: "Portfolio RAG System", question: "How did you implement the RAG system in your portfolio?" },
      ],
    },
    {
      category: "Technical Deep-Dive",
      questions: [
        { label: "pgvector Choice", question: "Why did you choose pgvector for vector search?" },
        { label: "Design Trade-offs", question: "What trade-offs did you consider when designing TrustyFAQ?" },
        { label: "Testing Approach", question: "How do you approach testing in your applications?" },
        { label: "Error Handling", question: "How do you handle errors in your AI integrations?" },
        { label: "Performance Optimization", question: "How do you optimize applications for production performance?" },
        { label: "Hardest Problem", question: "What's the most challenging technical problem you've solved?" },
      ],
    },
  ];

  const scrollToBottom = () => {
    // Use setTimeout to ensure the DOM has updated
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  // Handler for sidebar question selection with auto-submit
  const handleQuestionSelect = async (question: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: question }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        sources: [],
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                done = true;
                break;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id
                        ? { ...msg, content: msg.content + parsed.content }
                        : msg
                    )
                  );
                  scrollToBottom();
                }
                if (parsed.sources) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id
                        ? { ...msg, sources: parsed.sources }
                        : msg
                    )
                  );
                }
              } catch (e) {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSourcesClick = () => {
    window.open("/chatbot-sources", "_blank");
  };

  const toggleSourcesExpansion = (messageId: string) => {
    setExpandedSources((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    // Only scroll to bottom if there are more than 1 message (avoid auto-scroll on initial load)
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        sources: [], // Initialize sources array
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                done = true;
                break;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id
                        ? { ...msg, content: msg.content + parsed.content }
                        : msg
                    )
                  );
                  // Scroll to bottom after each content update
                  scrollToBottom();
                }
                if (parsed.sources) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id
                        ? { ...msg, sources: parsed.sources }
                        : msg
                    )
                  );
                }
              } catch (e) {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-4 w-full h-[600px]">
      {/* Sidebar - Hidden on mobile, visible on tablet and up */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-4 h-full">
          <ChatSidebar
            categories={questionCategories}
            onQuestionSelect={handleQuestionSelect}
          />
        </div>
      </div>

      {/* Main Chat Component */}
      <div className="flex-1 min-w-0 h-full">
        <div className="bg-brand-beige-light rounded-lg shadow-organic-lg overflow-hidden border border-brand-secondary/30 h-full flex flex-col">
      {/* Chat Header */}
      <div className="bg-brand-primary text-brand-beige p-4 flex-shrink-0">
        <div className="flex justify-between items-center gap-4">
          <h3 className="text-lg font-semibold">Winton Gee</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSourcesClick}
            className="text-xs px-3 py-1.5 rounded-full bg-brand-secondary/20 hover:bg-brand-secondary/30 border border-brand-secondary/30 hover:border-brand-secondary/50 text-brand-beige font-medium transition-all duration-200 shadow-sm hover:shadow-organic"
            title="View knowledge sources"
          >
            Sources
          </motion.button>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } gap-3`}
          >
            {/* Avatar for assistant messages */}
            {message.role === "assistant" && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-brand-primary/20 shadow-sm">
                  <img
                    src="/headshot.jpg"
                    alt="Winton Gee"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col max-w-lg">
              {/* Message bubble */}
              <div
                className={`px-4 py-3 rounded-lg shadow-organic ${
                  message.role === "user"
                    ? "bg-brand-primary text-white"
                    : "bg-brand-secondary text-brand-text"
                }`}
              >
                <div className="text-sm leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Custom styling for better UX
                      ul: ({ children }) => (
                        <ul className="list-disc ml-4 space-y-1">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal ml-4 space-y-1">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li
                          className={
                            message.role === "user"
                              ? "text-white"
                              : "text-brand-text"
                          }
                        >
                          {children}
                        </li>
                      ),
                      strong: ({ children }) => (
                        <strong
                          className={`font-semibold ${
                            message.role === "user"
                              ? "text-white"
                              : "text-brand-text"
                          }`}
                        >
                          {children}
                        </strong>
                      ),
                      p: ({ children }) => (
                        <p
                          className={`mb-2 last:mb-0 ${
                            message.role === "user"
                              ? "text-white"
                              : "text-brand-text"
                          }`}
                        >
                          {children}
                        </p>
                      ),
                      h1: ({ children }) => (
                        <h1
                          className={`text-lg font-bold mb-2 ${
                            message.role === "user"
                              ? "text-white"
                              : "text-brand-text"
                          }`}
                        >
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2
                          className={`text-base font-bold mb-2 ${
                            message.role === "user"
                              ? "text-white"
                              : "text-brand-text"
                          }`}
                        >
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3
                          className={`text-sm font-bold mb-1 ${
                            message.role === "user"
                              ? "text-white"
                              : "text-brand-text"
                          }`}
                        >
                          {children}
                        </h3>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Timestamp - subtle and minimal */}
              <span
                className={`text-xs text-brand-text-light/40 mt-1 block ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

              {/* Sources for assistant messages - ChatGPT style */}
              {message.role === "assistant" &&
                message.sources &&
                message.sources.length > 0 && (
                  <div className="mt-3">
                    {/* Collapsed Sources Indicator */}
                    {!expandedSources.has(message.id) && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleSourcesExpansion(message.id)}
                        className="flex items-center gap-1.5 text-xs text-brand-text-light/50 hover:text-brand-text-light/70 px-2 py-1 rounded-md hover:bg-brand-secondary/5 transition-all duration-200 group"
                      >
                        <svg
                          className="w-2.5 h-2.5 text-brand-text-light/40 group-hover:text-brand-text-light/60 transition-colors duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="font-medium">
                          {message.sources.length} source
                          {message.sources.length > 1 ? "s" : ""}
                        </span>
                        <svg
                          className="w-2.5 h-2.5 text-brand-text-light/40 group-hover:text-brand-text-light/60 transition-all duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </motion.button>
                    )}

                    {/* Expanded Sources */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: expandedSources.has(message.id) ? "auto" : 0,
                        opacity: expandedSources.has(message.id) ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      {expandedSources.has(message.id) && (
                        <div className="mt-1.5 space-y-1">
                          {/* Collapse button */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleSourcesExpansion(message.id)}
                            className="flex items-center gap-1.5 text-xs text-brand-text-light/50 hover:text-brand-text-light/70 px-2 py-1 rounded-md hover:bg-brand-secondary/5 transition-all duration-200 group"
                          >
                            <svg
                              className="w-2.5 h-2.5 text-brand-text-light/40 group-hover:text-brand-text-light/60 transition-all duration-200 rotate-180"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                            <span className="font-medium">Hide sources</span>
                          </motion.button>

                          {/* Sources list */}
                          <div className="space-y-1">
                            {message.sources.map((source, index) => (
                              <motion.button
                                key={index}
                                whileHover={{ scale: 1.01, y: -0.5 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() =>
                                  window.open("/chatbot-sources", "_blank")
                                }
                                className="w-full text-left bg-white/30 hover:bg-white/50 border border-brand-secondary/10 hover:border-brand-secondary/30 rounded-md p-2 transition-all duration-200 shadow-sm hover:shadow-md group"
                                title={`View source: ${
                                  source.title
                                } (${Math.round(
                                  source.similarity * 100
                                )}% match)`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div className="flex-shrink-0">
                                      <svg
                                        className="w-3 h-3 text-brand-text-light/50 group-hover:text-brand-primary transition-colors duration-200"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                      </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-xs font-medium text-brand-text group-hover:text-brand-primary transition-colors duration-200 truncate">
                                        {source.title}
                                      </h4>
                                      <p className="text-xs text-brand-text-light/60">
                                        {Math.round(source.similarity * 100)}%
                                        match
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0">
                                    <svg
                                      className="w-3 h-3 text-brand-text-light/40 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all duration-200"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-brand-primary/20 shadow-sm">
                <img
                  src="/headshot.jpg"
                  alt="Winton Gee"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="bg-brand-secondary text-brand-text px-4 py-3 rounded-lg shadow-organic">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-brand-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-brand-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm text-brand-text-light/70">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-brand-secondary/30 flex-shrink-0"
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-3 text-sm border-2 border-brand-secondary/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white text-brand-text placeholder-brand-text-light/60 transition-all duration-200"
            disabled={isLoading}
          />
          <motion.button
            type="submit"
            disabled={!input.trim() || isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-brand-primary hover:bg-brand-primary-dark disabled:bg-brand-secondary/50 text-brand-beige px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 shadow-organic hover:shadow-organic-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-brand-beige/30 border-t-brand-beige rounded-full animate-spin"></div>
              </div>
            ) : (
              "Send"
            )}
          </motion.button>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
}
