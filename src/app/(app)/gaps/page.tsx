import type { Metadata } from "next";
import { Placeholder } from "@/components/shell/Placeholder";

export const metadata: Metadata = { title: "Skill gaps" };

export default function SkillGapsPage() {
  return (
    <Placeholder
      title="Skill gaps"
      description="Matches, gaps, and skills that still need proof for that role."
      next={{ href: "/roadmap/review", label: "Review plan" }}
    />
  );
}