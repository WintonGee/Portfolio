"use client";

import { motion } from "framer-motion";
import { CHATBOT_CONFIG } from "../../lib/constants";

interface ChatHeaderProps {
  onSourcesClick: () => void;
  sourcesButtonClicked: boolean;
}

/**
 * Chat header component with sources button
 */
export default function ChatHeader({
  onSourcesClick,
  sourcesButtonClicked,
}: ChatHeaderProps) {
  return (
    <div className="p-4 border-b border-white/10 bg-white/5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
          <p className="text-sm text-white/70">
            Ask me about Winton's work, projects, or experience
          </p>
        </div>

        <motion.button
          onClick={onSourcesClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            sourcesButtonClicked
              ? "bg-green-500 text-white"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
        >
          {sourcesButtonClicked ? "Opened!" : "View Sources"}
        </motion.button>
      </div>
    </div>
  );
}

