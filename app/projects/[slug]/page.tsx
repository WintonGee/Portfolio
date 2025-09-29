import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProjectCaseStudyClient from "./ProjectCaseStudyClient";

// Sample project data - replace with your actual projects
const projects = [
  {
    slug: "ai-medical-diagnosis",
    title: "AI-Powered Medical Diagnosis System",
    summary:
      "A deep learning system that assists radiologists in detecting early-stage lung cancer from chest X-rays with 94% accuracy.",
    technologies: [
      "Python",
      "TensorFlow",
      "CNN",
      "Medical AI",
      "OpenCV",
      "DICOM",
    ],
    problem:
      "Early detection of lung cancer is crucial for patient survival, but manual analysis of chest X-rays is time-consuming and can miss subtle signs of early-stage cancer. Radiologists often face high workloads and may miss critical details in complex cases.",
    solution:
      "I developed a deep learning model using Convolutional Neural Networks (CNN) and transfer learning techniques. The system processes chest X-rays in real-time, highlighting potential areas of concern and providing confidence scores for each detection.",
    technicalDetails: [
      "Implemented a custom CNN architecture based on ResNet-50 with medical imaging optimizations",
      "Used transfer learning with pre-trained models on ImageNet, then fine-tuned on medical datasets",
      "Applied data augmentation techniques including rotation, scaling, and intensity adjustments",
      "Implemented attention mechanisms to focus on relevant anatomical regions",
      "Built a REST API using FastAPI for real-time inference",
      "Created a web interface for radiologists to review AI-assisted diagnoses",
    ],
    outcomes: [
      "Achieved 94% accuracy in detecting early-stage lung cancer",
      "Reduced diagnosis time by 60% for radiologists",
      "Processed over 10,000 chest X-rays with consistent results",
      "Received positive feedback from medical professionals",
      "Published research paper in Medical AI Journal",
    ],
    images: [
      {
        src: "/placeholder-medical-ai-1.jpg",
        alt: "AI Diagnosis Interface",
        caption:
          "The AI-powered diagnosis interface showing detected anomalies",
      },
      {
        src: "/placeholder-medical-ai-2.jpg",
        alt: "Model Architecture",
        caption: "CNN architecture diagram with attention mechanisms",
      },
    ],
    liveUrl: "https://medical-ai-demo.vercel.app",
    githubUrl: "https://github.com/wintongee/medical-ai-diagnosis",
    duration: "6 months",
    teamSize: "3 people",
    role: "Lead AI Engineer",
  },
  {
    slug: "sentiment-analysis-api",
    title: "Real-time Sentiment Analysis API",
    summary:
      "A scalable REST API that performs real-time sentiment analysis on social media posts, handling 10,000+ requests per minute.",
    technologies: [
      "Python",
      "FastAPI",
      "AWS",
      "NLP",
      "Docker",
      "Redis",
      "BERT",
    ],
    problem:
      "Companies need to monitor public sentiment about their brands and products in real-time, but existing solutions are either too slow or too expensive for high-volume social media monitoring.",
    solution:
      "I built a high-performance sentiment analysis API using state-of-the-art NLP models and optimized infrastructure. The system processes text in multiple languages and provides detailed sentiment scores with confidence levels.",
    technicalDetails: [
      "Fine-tuned BERT model on social media datasets for improved accuracy",
      "Implemented Redis caching for frequently analyzed text patterns",
      "Used AWS Lambda for serverless scaling during peak traffic",
      "Built custom tokenization pipeline for social media text preprocessing",
      "Implemented rate limiting and request queuing for fair resource usage",
      "Created comprehensive monitoring and alerting system",
    ],
    outcomes: [
      "Handles 10,000+ requests per minute with 99.9% uptime",
      "Achieved 89% accuracy on sentiment classification",
      "Reduced API response time to under 100ms average",
      "Served over 1 million requests in first month",
      "Generated $50K+ in revenue for the company",
    ],
    images: [
      {
        src: "/placeholder-sentiment-api-1.jpg",
        alt: "API Dashboard",
        caption:
          "Real-time monitoring dashboard showing API performance metrics",
      },
      {
        src: "/placeholder-sentiment-api-2.jpg",
        alt: "Sentiment Analysis Results",
        caption: "Example sentiment analysis results with confidence scores",
      },
    ],
    liveUrl: "https://sentiment-api-docs.vercel.app",
    githubUrl: "https://github.com/wintongee/sentiment-analysis-api",
    duration: "4 months",
    teamSize: "2 people",
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
