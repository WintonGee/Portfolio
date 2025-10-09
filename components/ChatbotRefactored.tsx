"use client";

import { motion } from "framer-motion";
import { useChatbot } from "../hooks/useChatbot";
import ChatHeader from "./chatbot/ChatHeader";
import ChatMessages from "./chatbot/ChatMessages";
import ChatInput from "./chatbot/ChatInput";

/**
 * Main chatbot component with AI integration
 * Refactored to use custom hooks and smaller components
 */
export default function ChatbotRefactored() {
  const {
    messages,
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
  } = useChatbot();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 w-96 h-[500px] bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 z-50 flex flex-col"
    >
      <ChatHeader
        onSourcesClick={handleSourcesClick}
        sourcesButtonClicked={sourcesButtonClicked}
      />

      <ChatMessages
        messages={messages}
        expandedSources={expandedSources}
        onToggleSources={toggleSourcesExpansion}
      />

      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onQuickSelect={handleQuickSelect}
      />
    </motion.div>
  );
}

