import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProjectCaseStudyClient from "./ProjectCaseStudyClient";

// Project data for FoodManager (PantryCraft)
const projects = [
  {
    slug: "foodmanager",
    title: "FoodManager (PantryCraft)",
    summary:
      "A web application that helps users manage their ingredients efficiently and generate AI-powered recipe suggestions based on available items. Built with React.js, MongoDB, and OpenAI API to reduce food waste and simplify meal planning.",
    technologies: [
      "React.js",
      "Material-UI",
      "Node.js",
      "Express.js",
      "MongoDB",
      "OpenAI API",
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
      "Integrated OpenAI API for intelligent recipe suggestions and ingredient matching",
      "Created responsive design optimized for desktop and mobile devices",
      "Implemented JWT-based authentication and user management",
      "Added real-time ingredient updates and recipe generation",
      "Built comprehensive CRUD operations for ingredient management",
    ],
    outcomes: [
      "Successfully integrated AI-powered recipe suggestions using OpenAI GPT models",
      "Created intuitive user interface for efficient ingredient management",
      "Implemented responsive design that works seamlessly across devices",
      "Reduced food waste through better ingredient tracking and utilization",
      "Simplified meal planning with contextual recipe recommendations",
      "Built scalable full-stack application with modern technologies",
    ],
    images: [
      {
        src: "/images/projects/foodmanager/foodmanager.svg",
        alt: "FoodManager Application Interface",
        caption:
          "The main interface showing ingredient management and AI recipe suggestions",
      },
      {
        src: "/images/projects/foodmanager/foodmanager-dashboard.svg",
        alt: "Dashboard View",
        caption:
          "Dashboard showing ingredient categories and expiration tracking",
      },
    ],
    githubUrl: "https://github.com/WintonGee/FoodManager",
    reportUrl:
      "https://drive.google.com/file/d/1ez2tc4DKTKrDWslWheUKjhegmqm7X7P7/view?usp=sharing",
    duration: "5 months",
    teamSize: "1 person",
    role: "Full-stack Developer",
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
