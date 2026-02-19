import { notFound } from "next/navigation";
import { experiences } from "@/data/visual";
import ExperienceDetailClient from "@/components/shared/experience-detail-client";
import { cache } from "react";

// Cache the experiences data access
const getExperiences = cache(() => experiences);

// Get experience by ID - cached for static generation
const getExperience = cache((id: string) => {
  const experienceId = parseInt(id, 10);
  const expData = getExperiences();
  return expData.find((exp) => exp.id === experienceId);
});

// Generate static params for all experience IDs - using cached data
export async function generateStaticParams() {
  const expData = getExperiences();
  return expData.map((experience) => ({
    id: experience.id.toString(),
  }));
}

// Main page component
export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const experience = getExperience(id);

  if (!experience) {
    notFound();
  }

  return <ExperienceDetailClient experience={experience} />;
}
