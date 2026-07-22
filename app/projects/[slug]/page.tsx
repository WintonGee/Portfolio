import { notFound } from "next/navigation";
import ProjectCaseStudyClient from "./ProjectCaseStudyClient";
import { getProjectBySlug } from "@/lib/db/projects";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectCaseStudy({ params }: Props) {
  const { slug } = await params;
  const row = await getProjectBySlug(slug);
  const caseStudy = (row?.data as { caseStudy?: unknown })?.caseStudy;
  if (!caseStudy) notFound();
  // ProjectCaseStudyClient defines its own Project shape; the D1 JSON matches it.
  return <ProjectCaseStudyClient project={caseStudy as any} />;
}
