"use client";

import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export default function FloatingChatButton() {
  const scrollToChat = () => {
    const chatSection = document.getElementById("chat");
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={scrollToChat}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-gradient-to-r from-brand-primary to-brand-primary-light hover:from-brand-primary-dark hover:to-brand-primary text-white p-3 sm:p-4 rounded-full shadow-organic-xl hover:shadow-organic-2xl transition-all duration-300 hover:scale-110 transform group border-2 border-brand-secondary/30 hover:border-brand-secondary"
      aria-label="Chat with Winton"
      title="Ask me anything!"
    >
      {/* Chat Bubble Icon */}
      <ChatBubbleLeftRightIcon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-200" />

      {/* Organic pulse animation ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-primary/30 to-brand-primary-light/30 animate-ping opacity-40"></div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-primary/20 to-brand-primary-light/20 blur-sm"></div>
    </button>
  );
}
