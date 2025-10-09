"use client";

import { motion } from "framer-motion";
import { CHATBOT_CONFIG } from "../../lib/constants";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onQuickSelect: (option: string) => void;
}

/**
 * Chat input component with quick select options
 */
export default function ChatInput({
  input,
  setInput,
  onSubmit,
  isLoading,
  onQuickSelect,
}: ChatInputProps) {
  return (
    <div className="p-4 border-t border-white/10">
      {/* Quick Select Options */}
      <div className="mb-4">
        <div className="text-sm text-white/70 mb-2">Quick questions:</div>
        <div className="flex flex-wrap gap-2">
          {CHATBOT_CONFIG.quickSelectOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => onQuickSelect(option)}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about my work or experience..."
          disabled={isLoading}
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50"
        />
        <motion.button
          type="submit"
          disabled={!input.trim() || isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-brand-primary hover:bg-brand-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
        >
          {isLoading ? "Sending..." : "Send"}
        </motion.button>
      </form>
    </div>
  );
}
