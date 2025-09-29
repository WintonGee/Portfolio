"use client";

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
      className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 transform group"
      aria-label="Scroll to chat section"
    >
      {/* Chat Bubble Icon */}
      <svg
        className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>

      {/* Pulse animation ring */}
      <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20"></div>
    </button>
  );
}
