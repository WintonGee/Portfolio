"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "../../hooks/useChatbot";

interface ChatMessageProps {
  message: Message;
  isExpanded: boolean;
  onToggleSources: (messageId: string) => void;
}

/**
 * Individual chat message component
 */
export default function ChatMessage({
  message,
  isExpanded,
  onToggleSources,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-brand-primary text-white"
            : "bg-white/10 backdrop-blur-sm text-brand-text"
        }`}
      >
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <button
              onClick={() => onToggleSources(message.id)}
              className="text-xs text-white/70 hover:text-white transition-colors"
            >
              {isExpanded ? "Hide" : "Show"} Sources ({message.sources.length})
            </button>

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-1"
              >
                {message.sources.map((source, index) => (
                  <div
                    key={index}
                    className="text-xs text-white/60 bg-white/5 rounded px-2 py-1"
                  >
                    <div className="font-medium">{source.title}</div>
                    <div className="text-white/40">
                      Similarity: {(source.similarity * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        )}

        <div className="text-xs text-white/50 mt-2">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
}
