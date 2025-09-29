"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
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
      <div className="bg-brand-primary text-brand-beige p-4">
        <h3 className="text-lg font-semibold">Chat with Winton</h3>
        <p className="text-brand-beige-light text-sm">
          Ask me about my work, projects, and experience
        </p>
      </div>

      {/* Messages Container */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-lg px-4 py-3 rounded-lg shadow-organic ${
                message.role === "user"
                  ? "bg-brand-primary text-brand-beige"
                  : "bg-brand-secondary text-brand-text"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <p className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-brand-secondary text-brand-text px-4 py-2 rounded-lg shadow-organic">
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
        <div className="px-4 pb-4">
          <p className="text-sm text-brand-text-light mb-3 text-center">
            Or try one of these:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {quickSelectOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleQuickSelect(option)}
                className="px-3 py-2 text-xs bg-brand-beige text-brand-text rounded-full hover:bg-brand-secondary hover:text-brand-text transition-colors duration-200 border border-brand-secondary/50 hover:border-brand-primary hover:shadow-organic"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-brand-secondary/30"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about my work, projects, or experience..."
            className="flex-1 px-3 py-2 border border-brand-secondary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-brand-beige text-brand-text placeholder-brand-text-light"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-brand-primary hover:bg-brand-primary-dark disabled:bg-brand-secondary text-brand-beige px-4 py-2 rounded-lg transition-colors font-medium shadow-organic hover:shadow-organic-lg"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
