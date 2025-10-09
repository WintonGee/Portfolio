"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "./ChatMessage";
import { Message } from "../../hooks/useChatbot";
import { useScrollToBottom } from "../../hooks/useScrollToBottom";

interface ChatMessagesProps {
  messages: Message[];
  expandedSources: Set<string>;
  onToggleSources: (messageId: string) => void;
}

/**
 * Chat messages container component
 */
export default function ChatMessages({
  messages,
  expandedSources,
  onToggleSources,
}: ChatMessagesProps) {
  const { containerRef, scrollToBottom } = useScrollToBottom();

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
      style={{ maxHeight: "400px" }}
    >
      <AnimatePresence>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isExpanded={expandedSources.has(message.id)}
            onToggleSources={onToggleSources}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

