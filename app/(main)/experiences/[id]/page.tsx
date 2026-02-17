import { notFound } from "next/navigation";
import { experiences } from "@/data/visual";
import ExperienceDetailClient from "@/components/shared/experience-detail-client";

// Get experience by ID
function getExperience(id: string) {
  const experienceId = parseInt(id, 10);
  return experiences.find((exp) => exp.id === experienceId);
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
