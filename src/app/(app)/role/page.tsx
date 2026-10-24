import type { Metadata } from "next";
import { Placeholder } from "@/components/shell/Placeholder";

export const metadata: Metadata = { title: "Target role" };

export default function TargetRolePage() {
  return (
    <Placeholder
      title="Target role"
      description="Describe the role you want with a resume and job description, a job description only, or a role you write yourself."
      next={{ href: "/gaps", label: "Skill gaps" }}
    />
  );
}