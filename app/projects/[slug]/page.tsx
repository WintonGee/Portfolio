import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProjectCaseStudyClient from "./ProjectCaseStudyClient";

// Project data for Paper Invoice, FoodManager, and CoChat
const projects = [
  {
    slug: "paperinvoice",
    title: "Paper Invoice",
    summary:
      "Offline-first iOS invoice app built with React Native and Expo in just 7 days, helping contractors and freelancers create professional PDF invoices in 30 seconds. Features complete privacy with device-only data storage and gained 37 users in the first week after launch.",
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "React.js",
      "React Native Paper",
      "AsyncStorage",
      "PDF Generation",
      "iOS Development",
    ],
    problem:
      "Contractors and freelancers face challenges with traditional invoicing tools: they're time-consuming, require constant internet connectivity, upload sensitive data to cloud servers, charge monthly subscriptions, and often include unnecessary complexity. Most people want a simple, fast, and private way to create professional invoices without the overhead.",
    solution:
      "I built Paper Invoice as an offline-first iOS app that enables invoice creation in ~30 seconds with complete privacy. The app stores all data locally on the device (never uploaded to servers), requires no account or internet connection, and features a streamlined workflow with saved rates and client management. Built in just 7 days using React Native and Expo, it launched on the App Store with a one-time purchase model.",
    technicalDetails: [
      "Built with React Native and Expo for rapid mobile development (7-day timeline)",
      "Implemented TypeScript throughout for type safety and code quality",
      "Used React Native Paper for Material Design UI components",
      "Created offline-first architecture with AsyncStorage for local data persistence",
      "Implemented custom PDF generation for professional invoice output",
      "Designed streamlined UX workflow to achieve 30-second invoice creation",
      "Built client management system with saved hourly rates for quick access",
      "Added invoice status tracking (draft, sent, paid)",
      "Implemented flexible sharing via email, AirDrop, Messages, and file export",
      "Created custom branding features for business logos and personalization",
      "Ensured complete privacy with device-only storage and zero tracking",
      "Published to iOS App Store with one-time purchase monetization model",
    ],
    outcomes: [
      "Successfully launched production iOS app in just 7 days from start to App Store",
      "Achieved 37 user acquisitions organically in the first week without marketing",
      "Delivered 30-second invoice creation target with streamlined UX",
      "Implemented true offline-first architecture with complete privacy",
      "Created professional PDF generation suitable for business use",
      "Built sustainable business model with one-time purchase ($39.99)",
      "Demonstrated rapid MVP development using React Native and Expo",
      "Validated product-market fit with strong early user adoption",
    ],
    images: [
      {
        src: "/images/projects/paperinvoice/invoice-list-organized.png",
        alt: "Paper Invoice - Stay Organized",
        caption:
          "Invoice list view showing draft, sent, and paid invoices with status indicators for easy organization",
      },
      {
        src: "/images/projects/paperinvoice/create-invoice-offline.png",
        alt: "Paper Invoice - Works Offline",
        caption:
          "Create new invoices completely offline with client selection, due dates, and line items",
      },
      {
        src: "/images/projects/paperinvoice/branding-settings.png",
        alt: "Paper Invoice - Your Brand",
        caption:
          "Settings screen with branding customization, business credentials, and payment method options",
      },
      {
        src: "/images/projects/paperinvoice/professional-invoice-preview.png",
        alt: "Paper Invoice - Professional Invoices",
        caption:
          "Professional invoice preview with share button for email, text, AirDrop, or file export",
      },
      {
        src: "/images/projects/paperinvoice/saved-rates.png",
        alt: "Paper Invoice - Faster Invoicing",
        caption:
          "My Rates view with saved hourly rates for quick invoice creation and recurring clients",
      },
    ],
    liveUrl: "https://paperinvoice.app/",
    appStoreUrl: "https://apps.apple.com/us/app/paper-invoice-pdf-maker/id6756224960",
    duration: "7 days",
    teamSize: "1 person",
    role: "Founder & Mobile Developer",
    codeImplementation: {
      framework: "React Native + Expo",
      storage: "AsyncStorage (device-only)",
      pdfGeneration: "Custom PDF library",
      features: [
        "Offline-first data persistence",
        "Client and rate management",
        "Invoice status tracking",
        "Custom branding and templates",
        "Native sharing (email, AirDrop, Messages)",
      ],
      developmentTime: "7 days from start to App Store launch",
      userAcquisition: "37 users in first week (organic)",
      apiEndpoint: "N/A (Offline-first mobile app)",
      errorHandling: "Local error handling with user feedback",
      caching: "Device-only AsyncStorage persistence",
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
