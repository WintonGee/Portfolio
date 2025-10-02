// Skills data with descriptions and project usage information

export interface SkillUsage {
  projectId: string;
  projectTitle: string;
  usage: string; // How the skill was used in the project
  category: "ai" | "frontend" | "backend" | "devops" | "data";
}

export interface SkillData {
  name: string;
  logo: string;
  description: string;
  category: "ai" | "frontend" | "backend" | "devops" | "data";
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
  usage: SkillUsage[];
}

export const SKILLS_DATA: Record<string, SkillData> = {
  // AI & Machine Learning
  Python: {
    name: "Python",
    logo: "/logos/tech/python.svg",
    description:
      "Versatile programming language for AI/ML, data analysis, and backend development. Used for building intelligent systems and data processing pipelines.",
    category: "ai",
    proficiency: "advanced",
    usage: [
      {
        projectId: "foodmanager",
        projectTitle: "FoodManager (PantryCraft)",
        usage:
          "Backend API development and AI integration for recipe suggestions",
        category: "ai",
      },
      {
        projectId: "trustyfaq",
        projectTitle: "TrustyFAQ",
        usage:
          "FastAPI backend development with AI integration and vector search",
        category: "ai",
      },
    ],
  },
  "OpenAI API": {
    name: "OpenAI API",
    logo: "/logos/tech/openai.svg",
    description:
      "Integration with OpenAI's GPT models for natural language processing, content generation, and intelligent automation.",
    category: "ai",
    proficiency: "advanced",
    usage: [
      {
        projectId: "foodmanager",
        projectTitle: "FoodManager (PantryCraft)",
        usage: "AI-powered recipe suggestions based on available ingredients",
        category: "ai",
      },
    ],
  },
  "Google Gemini AI": {
    name: "Google Gemini AI",
    logo: "/logos/tech/gemini.svg",
    description:
      "Google's advanced AI model for multimodal understanding, text generation, and intelligent content creation.",
    category: "ai",
    proficiency: "advanced",
    usage: [
      {
        projectId: "portfolio",
        projectTitle: "AI-Powered Portfolio Website",
        usage:
          "AI-powered chatbot integration for intelligent portfolio responses",
        category: "ai",
      },
      {
        projectId: "trustyfaq",
        projectTitle: "TrustyFAQ",
        usage: "AI-powered content generation and intelligent FAQ responses",
        category: "ai",
      },
    ],
  },
  TensorFlow: {
    name: "TensorFlow",
    logo: "/logos/tech/tensorflow.svg",
    description:
      "Open-source machine learning framework for building and deploying ML models, neural networks, and deep learning applications.",
    category: "ai",
    proficiency: "intermediate",
    usage: [
      {
        projectId: "foodmanager",
        projectTitle: "FoodManager (PantryCraft)",
        usage:
          "Machine learning models for ingredient classification and recommendation systems",
        category: "ai",
      },
    ],
  },
  "AI Integration": {
    name: "AI Integration",
    logo: "/logos/tech/ai-integration.svg",
    description:
      "Designing and implementing AI-powered features in applications, including API integration, model deployment, and intelligent automation.",
    category: "ai",
    proficiency: "advanced",
    usage: [
      {
        projectId: "foodmanager",
        projectTitle: "FoodManager (PantryCraft)",
        usage:
          "End-to-end AI integration for intelligent recipe suggestions and ingredient management",
        category: "ai",
      },
      {
        projectId: "portfolio",
        projectTitle: "AI-Powered Portfolio Website",
        usage:
          "AI chatbot integration with Google Gemini for intelligent portfolio interactions",
        category: "ai",
      },
    ],
  },
  "RAG Systems": {
    name: "RAG Systems",
    logo: "/logos/tech/rag-systems.svg",
    description:
      "Retrieval-Augmented Generation systems that combine information retrieval with language generation for context-aware AI responses.",
    category: "ai",
    proficiency: "intermediate",
    usage: [
      {
        projectId: "portfolio",
        projectTitle: "AI-Powered Portfolio Website",
        usage:
          "RAG system for AI chatbot to provide context-aware responses about portfolio content",
        category: "ai",
      },
      {
        projectId: "trustyfaq",
        projectTitle: "TrustyFAQ",
        usage:
          "RAG system for semantic FAQ search with vector embeddings and intelligent responses",
        category: "ai",
      },
    ],
  },

  // Frontend Development
  TypeScript: {
    name: "TypeScript",
    logo: "/logos/tech/typescript.svg",
    description:
      "Strongly-typed JavaScript superset that enhances code quality, developer experience, and maintainability in large-scale applications.",
    category: "frontend",
    proficiency: "advanced",
    usage: [
      {
        projectId: "portfolio",
        projectTitle: "AI-Powered Portfolio Website",
        usage:
          "Full type safety throughout the application with advanced TypeScript patterns",
        category: "frontend",
      },
      {
        projectId: "trustyfaq",
        projectTitle: "TrustyFAQ",
        usage:
          "Type-safe frontend development with React Query and modern patterns",
        category: "frontend",
      },
    ],
  },
  JavaScript: {
    name: "JavaScript",
    logo: "/logos/tech/javascript.svg",
    description:
      "Core web development language for building interactive user interfaces, dynamic content, and full-stack applications.",
    category: "frontend",
    proficiency: "advanced",
    usage: [
      {
        projectId: "foodmanager",
        projectTitle: "FoodManager (PantryCraft)",
        usage:
          "Frontend development with React.js and dynamic user interactions",
        category: "frontend",
      },
    ],
  },
  "React.js": {
    name: "React.js",
    logo: "/logos/tech/react.svg",
    description:
      "Popular JavaScript library for building user interfaces with component-based architecture and efficient state management.",
    category: "frontend",
    proficiency: "advanced",
    usage: [
      {
        projectId: "foodmanager",
        projectTitle: "FoodManager (PantryCraft)",
        usage:
          "Main frontend framework for building the ingredient management interface",
        category: "frontend",
      },
      {
        projectId: "portfolio",
        projectTitle: "AI-Powered Portfolio Website",
        usage:
          "Component-based architecture with advanced patterns like portals and custom hooks",
        category: "frontend",
      },
      {
        projectId: "trustyfaq",
        projectTitle: "TrustyFAQ",
        usage:
          "React components with React Query for state management and modern hooks",
        category: "frontend",
      },
    ],
  },
  "Next.js": {
    name: "Next.js",
    logo: "/logos/tech/nextjs.svg",
    description:
      "React framework for production with server-side rendering, static site generation, and optimized performance.",
    category: "frontend",
    proficiency: "advanced",
    usage: [
      {
        projectId: "portfolio",
        projectTitle: "AI-Powered Portfolio Website",
        usage:
          "Next.js 14 with App Router, SSR, and API routes for AI integration",
        category: "frontend",
      },
      {
        projectId: "trustyfaq",
        projectTitle: "TrustyFAQ",
        usage: "Next.js 14 frontend with App Router and shadcn/ui components",
        category: "frontend",
      },
    ],
  },
  "Tailwind CSS": {
    name: "Tailwind CSS",
    logo: "/logos/tech/tailwindcss.svg",
    description:
      "Utility-first CSS framework for rapid UI development with consistent design systems and responsive layouts.",
    category: "frontend",
    proficiency: "advanced",
    usage: [
      {
        projectId: "portfolio",
        projectTitle: "AI-Powered Portfolio Website",
        usage:
          "Custom design system with organic color palette and responsive utilities",
        category: "frontend",
      },
      {
        projectId: "trustyfaq",
        projectTitle: "TrustyFAQ",
        usage:
          "Modern UI styling with shadcn/ui components and responsive design",
        category: "frontend",
      },
    ],
  },
  "Material-UI": {
    name: "Material-UI",
    logo: "/logos/tech/materialui.svg",
    description:
      "React component library implementing Google's Material Design principles for consistent, modern user interfaces.",
    category: "frontend",
    proficiency: "advanced",
    usage: [
      {
        projectId: "foodmanager",
        projectTitle: "FoodManager (PantryCraft)",
        usage: "UI component library for consistent design and user experience",
        category: "frontend",
      },
    ],
  },
  "HTML/CSS": {
    name: "HTML/CSS",
    logo: "/logos/tech/htmlcss.svg",
    description:
      "Fundamental web technologies for structuring content and styling user interfaces with semantic markup and responsive design.",
    category: "frontend",
    proficiency: "expert",
    usage: [
      {
        projectId: "foodmanager",
        projectTitle: "FoodManager (PantryCraft)",
        usage:
          "Core web technologies for building the application structure and styling",
        category: "frontend",
      },
      {
        projectId: "portfolio",
        projectTitle: "AI-Powered Portfolio Website",
        usage:
          "Semantic HTML structure and advanced CSS with custom properties and animations",
        category: "frontend",
      },
    ],
  },

  // Backend & Database
  Supabase: {
    name: "Supabase",
    logo: "/logos/tech/supabase.svg",
    description:
      "Open-source Firebase alternative providing database, authentication, and real-time features with PostgreSQL backend.",
    category: "backend",
    proficiency: "intermediate",
    usage: [
      {
        projectId: "trustyfaq",
        projectTitle: "TrustyFAQ",
        usage:
          "PostgreSQL database with pgvector extension for vector search and multi-tenant architecture",
        category: "backend",
      },
    ],
  },
  SQL: {
    name: "SQL",
    logo: "/logos/tech/sql.svg",
    description:
      "Structured Query Language for managing and manipulating relational databases with complex queries and data relationships.",
    category: "backend",
    proficiency: "advanced",
    usage: [
      {
        projectId: "trustyfaq",
        projectTitle: "TrustyFAQ",
        usage:
          "Complex database queries for FAQ management and vector search operations",
        category: "backend",
      },
    ],
  },
  FastAPI: {
    name: "FastAPI",
    logo: "/logos/tech/fastapi.svg",
    description:
      "Modern Python web framework for building APIs with automatic documentation, type hints, and high performance.",
    category: "backend",
    proficiency: "intermediate",
    usage: [
      {
        projectId: "trustyfaq",
        projectTitle: "TrustyFAQ",
        usage:
          "High-performance Python API with automatic documentation and type hints",
        category: "backend",
      },
    ],
  },
  "Node.js": {
    name: "Node.js",
    logo: "/logos/tech/nodejs.svg",
    description:
      "JavaScript runtime for server-side development, enabling full-stack JavaScript applications with event-driven architecture.",
    category: "backend",
    proficiency: "advanced",
    usage: [
      {
        projectId: "foodmanager",
        projectTitle: "FoodManager (PantryCraft)",
        usage:
          "Backend server runtime for API development and server-side logic",
        category: "backend",
      },
    ],
  },
  "Express.js": {
    name: "Express.js",
    logo: "/logos/tech/express.svg",
    description:
      "Minimalist web framework for Node.js, providing robust features for web and mobile applications with middleware support.",
    category: "backend",
    proficiency: "advanced",
    usage: [
      {
        projectId: "foodmanager",
        projectTitle: "FoodManager (PantryCraft)",
        usage:
          "Web framework for building RESTful APIs and handling HTTP requests",
        category: "backend",
      },
    ],
  },
  MongoDB: {
    name: "MongoDB",
    logo: "/logos/tech/mongodb.svg",
    description:
      "NoSQL document database for flexible data storage, ideal for applications with evolving schemas and complex data structures.",
    category: "backend",
    proficiency: "advanced",
    usage: [
      {
        projectId: "foodmanager",
        projectTitle: "FoodManager (PantryCraft)",
        usage:
          "Primary database for storing ingredients, recipes, and user data",
        category: "backend",
      },
    ],
  },
  "JWT Authentication": {
    name: "JWT Authentication",
    logo: "/logos/tech/jwt.png",
    description:
      "JSON Web Token-based authentication system for secure user sessions and stateless authentication in web applications.",
    category: "backend",
    proficiency: "advanced",
    usage: [
      {
        projectId: "trustyfaq",
        projectTitle: "TrustyFAQ",
        usage: "Secure authentication system for multi-tenant SaaS platform",
        category: "backend",
      },
    ],
  },
  "REST APIs": {
    name: "REST APIs",
    logo: "/logos/tech/restapi.svg",
    description:
      "Representational State Transfer architecture for building scalable web services with standard HTTP methods and status codes.",
    category: "backend",
    proficiency: "advanced",
    usage: [
      {
        projectId: "foodmanager",
        projectTitle: "FoodManager (PantryCraft)",
        usage:
          "API architecture for ingredient management and recipe suggestion endpoints",
        category: "backend",
      },
      {
        projectId: "portfolio",
        projectTitle: "AI-Powered Portfolio Website",
        usage:
          "Next.js API routes for AI chatbot integration and data handling",
        category: "backend",
      },
    ],
  },
  Axios: {
    name: "Axios",
    logo: "/logos/tech/axios.svg",
    description:
      "Promise-based HTTP client for making API requests with interceptors, request/response transformation, and error handling.",
    category: "backend",
    proficiency: "advanced",
    usage: [
      {
        projectId: "foodmanager",
        projectTitle: "FoodManager (PantryCraft)",
        usage:
          "HTTP client for frontend-backend communication and API requests",
        category: "backend",
      },
      {
        projectId: "portfolio",
        projectTitle: "AI-Powered Portfolio Website",
        usage: "HTTP client for AI API communication and data fetching",
        category: "backend",
      },
    ],
  },
};

// Helper function to get skill data by name
export function getSkillData(skillName: string): SkillData | undefined {
  return SKILLS_DATA[skillName];
}

// Helper function to get all skills by category
export function getSkillsByCategory(category: string): SkillData[] {
  return Object.values(SKILLS_DATA).filter(
    (skill) => skill.category === category
  );
}
