"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
      content:
        "Hi there! I'm Winton, and I'm excited to chat with you about my work, projects, and experience. Feel free to ask me anything!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sourcesButtonClicked, setSourcesButtonClicked] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickSelectOptions = [
    "Tell me about your AI/ML experience",
    "What projects have you worked on?",
    "What technologies do you use?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleQuickSelect = (option: string) => {
    setInput(option);
  };

  const handleSourcesClick = () => {
    setSourcesButtonClicked(true);
    window.open("/chatbot-sources", "_blank");
    // Reset the visual feedback after a short delay
    setTimeout(() => setSourcesButtonClicked(false), 300);
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
    <div className="bg-brand-beige-light rounded-lg shadow-organic-lg overflow-hidden border border-brand-secondary/30">
      {/* Chat Header */}
      <div className="bg-brand-primary text-brand-beige p-3 sm:p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base sm:text-lg font-semibold">
              Chat with Winton
            </h3>
            <p className="text-brand-beige-light text-xs sm:text-sm">
              Ask me about my work, projects, and experience
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSourcesClick}
            className={`text-xs px-3 py-1.5 rounded-full transition-all duration-300 border font-medium relative group ${
              sourcesButtonClicked
                ? "bg-gradient-to-r from-brand-primary/40 to-brand-primary/50 border-brand-primary/60 text-brand-beige shadow-organic-lg scale-95"
                : "bg-gradient-to-r from-brand-secondary/20 to-brand-secondary/30 hover:from-brand-secondary/30 hover:to-brand-secondary/40 text-brand-beige border-brand-secondary/30 hover:border-brand-secondary/50 shadow-organic hover:shadow-organic-lg"
            }`}
            title="See the information sources used by this chatbot"
          >
            Sources
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-brand-primary text-brand-beige text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
              View knowledge sources
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-brand-primary"></div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="h-80 sm:h-96 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
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

            <div className="flex flex-col max-w-xs sm:max-w-sm lg:max-w-lg">
              {/* Message bubble */}
              <div
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-organic ${
                  message.role === "user"
                    ? "bg-brand-primary text-white"
                    : "bg-brand-secondary text-brand-text"
                }`}
              >
                <div className="text-xs sm:text-sm leading-relaxed">
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

              {/* Timestamp and sender label */}
              <div
                className={`flex items-center gap-2 mt-1 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span className="text-xs text-brand-text-light/60">
                  {message.role === "user" ? "You" : "Winton"}
                </span>
                <span className="text-xs text-brand-text-light/40">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Sources for assistant messages */}
              {message.role === "assistant" &&
                message.sources &&
                message.sources.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-brand-text-light/70 mb-2 font-medium">
                      Sources:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {message.sources.map((source, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            window.open("/chatbot-sources", "_blank")
                          }
                          className="text-xs bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary px-3 py-1.5 rounded-full border border-brand-primary/20 hover:border-brand-primary/40 transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md group"
                          title={`View source: ${source.title}`}
                        >
                          <svg
                            className="w-3 h-3 text-brand-primary group-hover:scale-110 transition-transform duration-200"
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
                          {source.title}
                        </motion.button>
                      ))}
                    </div>
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
            <div className="bg-brand-secondary text-brand-text px-3 sm:px-4 py-2 rounded-lg shadow-organic">
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
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Select Options */}
      {messages.length === 1 && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 bg-gradient-to-r from-brand-beige-light/30 to-brand-beige/30">
          <p className="text-sm text-brand-text-light mb-4 text-center font-medium">
            Try asking about:
          </p>
          <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto">
            {quickSelectOptions.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleQuickSelect(option)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-3 text-sm bg-white text-brand-text rounded-xl hover:bg-brand-secondary hover:text-brand-text transition-all duration-200 border-2 border-brand-secondary/30 hover:border-brand-primary hover:shadow-organic-lg whitespace-nowrap font-medium shadow-sm"
              >
                {option}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 sm:p-6 border-t border-brand-secondary/30 bg-gradient-to-r from-brand-beige-light/50 to-brand-beige/50"
      >
        <div className="flex space-x-3 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about my work, projects, or experience..."
              className="w-full px-4 py-3 text-sm sm:text-base border-2 border-brand-secondary/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white text-brand-text placeholder-brand-text-light/70 shadow-sm hover:shadow-md transition-all duration-200"
              disabled={isLoading}
            />
            {/* Input focus indicator */}
            <div className="absolute inset-0 rounded-xl border-2 border-transparent pointer-events-none transition-all duration-200 focus-within:border-brand-primary/20"></div>
          </div>
          <motion.button
            type="submit"
            disabled={!input.trim() || isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-brand-primary to-brand-primary-light hover:from-brand-primary-dark hover:to-brand-primary disabled:from-brand-secondary disabled:to-brand-secondary text-brand-beige px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 shadow-organic hover:shadow-organic-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-brand-beige/30 border-t-brand-beige rounded-full animate-spin"></div>
                <span>Sending...</span>
              </div>
            ) : (
              "Send"
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
