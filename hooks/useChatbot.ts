import { useState, useRef, useCallback } from "react";

export interface Message {
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

/**
 * Custom hook for managing chatbot state and functionality
 * @returns Object with chatbot state and handlers
 */
export function useChatbot() {
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
  const [sourcesButtonClicked, setSourcesButtonClicked] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Set<string>>(
    new Set()
  );

  const quickSelectOptions = [
    "Tell me about your AI/ML experience",
    "What projects have you worked on?",
    "What technologies do you use?",
  ];

  const handleQuickSelect = useCallback((option: string) => {
    setInput(option);
  }, []);

  const handleSourcesClick = useCallback(() => {
    setSourcesButtonClicked(true);
    window.open("/chatbot-sources", "_blank");
    setTimeout(() => setSourcesButtonClicked(false), 300);
  }, []);

  const toggleSourcesExpansion = useCallback((messageId: string) => {
    setExpandedSources((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
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
                    setMessages((prev) => {
                      const updated = [...prev];
                      const lastMessage = updated[updated.length - 1];
                      if (lastMessage && lastMessage.role === "assistant") {
                        lastMessage.content += parsed.content;
                      }
                      return updated;
                    });
                  }
                  if (parsed.sources) {
                    setMessages((prev) => {
                      const updated = [...prev];
                      const lastMessage = updated[updated.length - 1];
                      if (lastMessage && lastMessage.role === "assistant") {
                        lastMessage.sources = parsed.sources;
                      }
                      return updated;
                    });
                  }
                } catch (error) {
                  console.error("Error parsing chunk:", error);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading]
  );

  return {
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    sourcesButtonClicked,
    expandedSources,
    quickSelectOptions,
    handleQuickSelect,
    handleSourcesClick,
    toggleSourcesExpansion,
    handleSubmit,
  };
}

