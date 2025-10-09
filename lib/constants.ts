/**
 * Application constants
 */

export const APP_CONFIG = {
  name: "Winton Gee Portfolio",
  description: "AI/ML Engineer Portfolio Website",
  url: "https://wintongee.com",
  author: "Winton Gee",
  email: "wintongee@gmail.com",
  linkedin: "https://linkedin.com/in/wintongee",
  github: "https://github.com/wintongee",
} as const;

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const;

export const SCROLL_THRESHOLDS = {
  navbar: 10,
  section: 100,
} as const;

export const CHATBOT_CONFIG = {
  quickSelectOptions: [
    "Tell me about your AI/ML experience",
    "What projects have you worked on?",
    "What technologies do you use?",
  ],
  initialMessage:
    "Hi! I'm Winton. Ask me about my work, projects, or experience.",
  sourcesUrl: "/chatbot-sources",
} as const;

export const NAVIGATION_ITEMS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;

export const SOCIAL_LINKS = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/wintongee",
    icon: "FaLinkedin",
  },
  { name: "GitHub", href: "https://github.com/wintongee", icon: "FaGithub" },
] as const;

