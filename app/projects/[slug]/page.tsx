import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProjectCaseStudyClient from "./ProjectCaseStudyClient";

// Project data for Portfolio and FoodManager
const projects = [
  {
    slug: "portfolio",
    title: "AI-Powered Portfolio Website",
    summary:
      "A modern, responsive portfolio website showcasing AI/ML engineering skills with interactive hover cards, real-time chatbot integration, and advanced animations. Built with Next.js, TypeScript, and AI-powered features including Google Gemini integration for intelligent responses.",
    technologies: [
      "Next.js",
      "TypeScript",
      "React.js",
      "Tailwind CSS",
      "Google Gemini AI",
      "AI Integration",
      "REST APIs",
      "Axios",
      "HTML/CSS",
      "Framer Motion",
    ],
    problem:
      "Traditional portfolio websites are static and don't effectively showcase technical skills or provide interactive experiences. Visitors need a way to understand not just what technologies I know, but how I've actually used them in real projects. Additionally, there was a need for an intelligent way to answer questions about my experience and projects.",
    solution:
      "I developed a comprehensive portfolio website that combines modern web development with AI integration. The site features interactive hover cards that show exactly where each technology was used, an AI-powered chatbot for intelligent responses, and advanced animations that demonstrate technical proficiency while providing an engaging user experience.",
    technicalDetails: [
      "Built with Next.js 14 using App Router for modern React patterns and server-side rendering",
      "Implemented TypeScript throughout for type safety and better developer experience",
      "Created custom hover card component with React portals to solve z-index stacking issues",
      "Integrated Google Gemini AI for intelligent chatbot responses about portfolio content",
      "Designed responsive layout with Tailwind CSS and custom organic color palette",
      "Implemented Framer Motion for smooth animations and scroll-triggered effects",
      "Built skill usage tracking system that maps technologies to specific project implementations",
      "Created floating chat button with persistent AI assistance",
      "Optimized performance with Next.js Image component and code splitting",
      "Implemented SEO optimization with meta tags and structured data",
      "Added accessibility features with proper ARIA labels and keyboard navigation",
      "Used React portals for hover card rendering to ensure proper layering",
    ],
    outcomes: [
      "Successfully created an interactive portfolio that demonstrates technical skills in real-time",
      "Implemented AI chatbot that provides intelligent responses about projects and experience",
      "Built hover card system that shows exact technology usage across different projects",
      "Achieved excellent performance scores with Next.js optimization features",
      "Created responsive design that works seamlessly across all devices",
      "Demonstrated advanced React patterns including portals, custom hooks, and context",
      "Integrated modern AI APIs with proper error handling and fallback strategies",
      "Delivered production-ready application with comprehensive accessibility features",
      "Showcased full-stack development skills with frontend, backend, and AI integration",
      "Built scalable architecture that can easily accommodate new projects and skills",
    ],
    images: [
      {
        src: "/images/projects/portfolio/portfolio-hero.png",
        alt: "Portfolio Website Hero Section",
        caption:
          "The main hero section showcasing the modern design and AI integration",
      },
      {
        src: "/images/projects/portfolio/portfolio-journey.png",
        alt: "Interactive Journey Timeline",
        caption:
          "Interactive journey timeline showing professional and academic progression with filtering capabilities",
      },
    ],
    liveUrl: "https://wintongee.com",
    githubUrl: "https://github.com/WintonGee/Portfolio",
    duration: "3 months",
    teamSize: "1 person",
    role: "Full-stack Developer & AI Engineer",
    codeImplementation: {
      aiIntegration: {
        model: "Google Gemini AI",
        features: [
          "Context-aware responses about portfolio content",
          "Intelligent project recommendations",
          "Real-time chat interface",
          "Fallback error handling",
        ],
        prompt: `You are an AI assistant for Winton Gee's portfolio website. You help visitors learn about his projects, skills, and experience. Provide helpful, accurate information about his work in AI/ML engineering, web development, and software engineering. Be conversational and professional.`,
        maxTokens: 1000,
        temperature: 0.7,
      },
      apiEndpoint: "/api/chat",
      errorHandling:
        "Comprehensive error handling with fallback responses and user feedback",
      caching: "Next.js built-in caching with ISR for optimal performance",
    },
  },
  {
    slug: "foodmanager",
    title: "FoodManager (PantryCraft)",
    summary:
      "A web application that helps users manage their ingredients efficiently and generate AI-powered recipe suggestions based on available items. Built with React.js, MongoDB, and OpenAI to reduce food waste and simplify meal planning.",
    technologies: [
      "React.js",
      "Material-UI",
      "Node.js",
      "Express.js",
      "MongoDB",
      "OpenAI",
      "JavaScript",
      "Axios",
    ],
    problem:
      "Many people face challenges in keeping track of ingredients in their pantry, planning meals with available ingredients, and reducing food waste due to forgotten or expired items. Finding creative recipes with limited ingredients is also a common struggle.",
    solution:
      "I developed a comprehensive web application that combines ingredient management with AI-powered recipe suggestions. The system helps users track their pantry items, monitor expiration dates, and discover new recipes based on available ingredients using OpenAI's GPT models.",
    technicalDetails: [
      "Built React.js frontend with Material-UI for consistent, modern design",
      "Implemented Node.js/Express.js backend with RESTful API endpoints",
      "Designed flexible MongoDB schema for ingredient and recipe storage",
      "Integrated OpenAI GPT-3.5 Turbo API for intelligent recipe suggestions",
      "Created responsive design optimized for desktop and mobile devices",
      "Implemented JWT-based authentication and user management",
      "Added real-time ingredient updates and recipe generation",
      "Built comprehensive CRUD operations for ingredient management",
      "Optimized API costs with GPT-3.5 Turbo at $0.0015/1K input tokens, $0.002/1K output tokens",
      "Implemented prompt engineering for efficient token usage and cost optimization",
    ],
    outcomes: [
      "Successfully integrated AI-powered recipe suggestions using OpenAI GPT-3.5 Turbo",
      "Created intuitive user interface for efficient ingredient management",
      "Implemented responsive design that works seamlessly across devices",
      "Reduced food waste through better ingredient tracking and utilization",
      "Simplified meal planning with contextual recipe recommendations",
      "Built scalable full-stack application with modern technologies",
      "Achieved cost-effective AI integration with optimized token usage",
      "Delivered production-ready application with comprehensive error handling",
    ],
    images: [
      {
        src: "/images/projects/foodmanager/foodmanager-overview.png",
        alt: "FoodManager Application Interface",
        caption:
          "The main interface showing ingredient management and AI recipe suggestions",
      },
      {
        src: "/images/projects/foodmanager/foodmanager-interface.png",
        alt: "Application Interface",
        caption: "Detailed view of the application interface and features",
      },
      {
        src: "/images/projects/foodmanager/foodmanager-cost-dashboard.png",
        alt: "Cost Dashboard View",
        caption:
          "GPT-3.5 Turbo cost usage dashboard showing API consumption and pricing analytics",
      },
      {
        src: "/images/projects/foodmanager/foodmanager-cover.png",
        alt: "Project Overview",
        caption:
          "Complete project overview showing the FoodManager application interface and features",
      },
    ],
    githubUrl: "https://github.com/WintonGee/FoodManager",
    reportUrl:
      "https://drive.google.com/file/d/1ez2tc4DKTKrDWslWheUKjhegmqm7X7P7/view?usp=sharing",
    duration: "5 months",
    teamSize: "1 person",
    role: "Full-stack Developer",
    codeImplementation: {
      gptIntegration: {
        model: "GPT-3.5 Turbo",
        pricing: {
          input: "$0.0015 per 1K tokens",
          output: "$0.002 per 1K tokens",
        },
        prompt: `You are a helpful cooking assistant. Based on the available ingredients: {ingredients}, suggest 3 creative recipes that can be made with these ingredients. Include cooking time, difficulty level, and step-by-step instructions.`,
        maxTokens: 500,
        temperature: 0.7,
      },
      apiEndpoint: "/api/recipes/suggest",
      errorHandling: "Comprehensive error handling with fallback responses",
      caching: "Redis caching for frequently requested recipe combinations",
    },
  },
  {
    slug: "cochat",
    title: "CoChat",
    summary:
      "AI-powered digital presence platform that creates personalized chatbots representing individuals or businesses. Built with Next.js, Supabase, and OpenAI to enable natural conversations and voice cloning capabilities for authentic digital interactions.",
    technologies: [
      "Next.js",
      "TypeScript",
      "React.js",
      "Tailwind CSS",
      "Supabase",
      "PostgreSQL",
      "SQL",
      "JWT",
      "OpenAI",
      "AI Integration",
      "REST APIs",
    ],
    problem:
      "In today's digital world, maintaining a consistent and engaging online presence is crucial for personal and business success. However, many challenges exist: 24/7 availability, consistent messaging across interactions, scalability for multiple conversations, creating authentic digital interactions, and technical barriers for non-technical users.",
    solution:
      "I developed CoChat as an AI-powered digital presence platform that enables individuals and businesses to create personalized chatbots that represent them authentically. The platform combines advanced AI technology with voice cloning capabilities to create digital twins that can engage in natural conversations, always ready to empower personal and business brand growth.",
    technicalDetails: [
      "Built Next.js 14 with App Router for modern React patterns and server-side rendering",
      "Implemented TypeScript throughout for type safety and better developer experience",
      "Integrated Supabase backend with PostgreSQL and pgvector for vector storage",
      "Created Supabase Edge Functions for serverless AI processing and response generation",
      "Implemented OpenAI GPT models for intelligent, contextual responses",
      "Built voice cloning technology for authentic digital interactions",
      "Designed multi-tenant architecture with proper data isolation and security",
      "Created effortless setup process requiring no technical expertise from users",
      "Implemented vector embeddings for semantic search and context understanding",
      "Built real-time chat interface with conversation history and context management",
      "Added voice synthesis and audio processing capabilities",
      "Created comprehensive user profile management and customization options",
    ],
    outcomes: [
      "Successfully created AI-powered chatbots that authentically represent individuals and businesses",
      "Implemented voice cloning technology for natural, realistic digital interactions",
      "Built scalable multi-tenant platform with proper security and data isolation",
      "Created effortless setup process that handles technical complexity behind the scenes",
      "Achieved 24/7 digital presence availability for users and businesses",
      "Implemented advanced AI integration with OpenAI for intelligent responses",
      "Built modern, responsive interface optimized for all devices",
      "Created system that maintains consistent brand messaging across all interactions",
      "Demonstrated full-stack development with Next.js, Supabase, and AI integration",
      "Delivered production-ready platform with comprehensive user management",
    ],
    images: [
      {
        src: "/images/projects/cochat/cochat-demo.png",
        alt: "CoChat Demo Interface",
        caption:
          "The main CoChat interface showing AI chatbot conversation and digital presence features",
      },
      {
        src: "/images/projects/cochat/cochat-interface.png",
        alt: "CoChat Interface",
        caption:
          "Detailed view of the CoChat interface showing AI response generation and user profile settings",
      },
      {
        src: "/images/projects/cochat/cochat-overview.png",
        alt: "CoChat Platform Overview",
        caption:
          "Platform overview showing multiple AI profiles, digital presence analytics, and voice cloning features",
      },
    ],
    liveUrl: "https://www.cochat.io/",
    duration: "6 months",
    teamSize: "1 person",
    role: "Full-stack Developer & AI Engineer",
    codeImplementation: {
      aiIntegration: {
        model: "OpenAI GPT Models",
        features: [
          "Contextual response generation based on user data",
          "Voice cloning and synthesis technology",
          "Semantic search with vector embeddings",
          "Multi-modal AI interactions",
        ],
        prompt: `You are a digital representation of {user_name}. Based on the provided information about {user_name}, respond authentically as them. Maintain their personality, expertise, and communication style while being helpful and engaging.`,
        maxTokens: 500,
        temperature: 0.7,
      },
      apiEndpoint: "/api/chat",
      errorHandling:
        "Comprehensive error handling with fallback responses and user feedback",
      caching:
        "Supabase Edge Functions with built-in caching for optimal performance",
    },
  },
  {
    slug: "trustyfaq",
    title: "TrustyFAQ",
    summary:
      "AI-powered FAQ management system solving the real problem of team leads being overwhelmed with repetitive questions. Built with semantic search and intelligent responses to provide instant answers, eliminating the need to scroll through traditional FAQ lists.",
    technologies: [
      "Next.js",
      "TypeScript",
      "React.js",
      "Tailwind CSS",
      "FastAPI",
      "Python",
      "Supabase",
      "PostgreSQL",
      "SQL",
      "JWT",
      "Google Gemini AI",
      "RAG Systems",
      "REST APIs",
      "pgvector",
      "Celery",
      "Redis",
    ],
    problem:
      "During my time at Mercor, I observed team leads constantly being bombarded with FAQ-type questions, even when comprehensive FAQs already existed. The root issue wasn't lack of information - it was user experience friction. People don't want to scroll through long FAQ lists, they want immediate answers. Traditional keyword search often returns irrelevant results, and the context switching required to find answers disrupts workflow.",
    solution:
      "I designed TrustyFAQ as an AI-powered FAQ management system that eliminates scrolling fatigue through semantic search and intelligent responses. The system uses vector embeddings to understand user intent and provides instant, relevant answers as users type. This reduces team lead interruptions while making knowledge more accessible through natural language queries.",
    technicalDetails: [
      "Built Next.js 14 frontend with App Router and shadcn/ui components for modern UI",
      "Implemented FastAPI backend with automatic documentation and type hints",
      "Integrated Supabase with PostgreSQL and pgvector extension for vector search",
      "Created semantic search using vector embeddings for similarity matching",
      "Implemented Google Gemini AI for intelligent content generation and responses",
      "Built multi-tenant architecture with Supabase Row Level Security",
      "Added Celery task queue with Redis for background processing and caching",
      "Designed real-time search with debounced queries and React Query caching",
      "Created workspace isolation for secure multi-tenant data access",
      "Implemented AI-powered content enhancement and smart categorization",
      "Built responsive design optimized for desktop, tablet, and mobile",
      "Added public FAQ pages for external access and sharing",
    ],
    outcomes: [
      "Successfully implemented vector-based semantic search that eliminates scrolling through FAQ lists",
      "Built AI-powered system that provides instant answers to natural language queries",
      "Created multi-tenant SaaS platform with secure data isolation between organizations",
      "Implemented intelligent content generation using Google Gemini AI",
      "Achieved high-performance search with pgvector and optimized database queries",
      "Built modern, responsive interface that works seamlessly across all devices",
      "Demonstrated full-stack development with modern Python and TypeScript frameworks",
      "Created system that reduces repetitive questions while improving knowledge accessibility",
    ],
    images: [
      {
        src: "/images/projects/trustyfaq/trustyfaq-front.png",
        alt: "TrustyFAQ Main Interface",
        caption:
          "The main TrustyFAQ interface showing the modern design and search functionality",
      },
      {
        src: "/images/projects/trustyfaq/trustyfaq-demo.png",
        alt: "TrustyFAQ Demo Interface",
        caption:
          "Demo interface showcasing the AI-powered search and response capabilities",
      },
    ],
    liveUrl: "https://trustyfaq.vercel.app/",
    duration: "4 months",
    teamSize: "1 person",
    role: "Full-stack Developer & Product Designer",
    codeImplementation: {
      aiIntegration: {
        model: "Google Gemini AI",
        features: [
          "Content generation and enhancement",
          "Intelligent response generation",
          "Semantic search with vector embeddings",
          "Context-aware search results",
        ],
        prompt: `You are an intelligent FAQ assistant. Based on the following FAQ content and user query, provide a helpful, accurate response. If the query doesn't match the FAQ content, suggest related topics or ask for clarification.`,
        maxTokens: 300,
        temperature: 0.3,
      },
      apiEndpoint: "/api/faqs/search",
      errorHandling:
        "Comprehensive error handling with fallback responses and rate limiting",
      caching: "Redis caching for search results and AI responses",
    },
  },
];

interface ProjectCaseStudyProps {
  params: {
    slug: string;
  };
}

export default function ProjectCaseStudy({ params }: ProjectCaseStudyProps) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return <ProjectCaseStudyClient project={project} />;
}

// Generate static params for all projects
export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}
