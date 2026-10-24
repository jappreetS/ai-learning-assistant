import type { Metadata } from "next";
import { Placeholder } from "@/components/shell/Placeholder";

export const metadata: Metadata = { title: "Review plan" };

export default function ReviewPlanPage() {
  return (
    <Placeholder
      title="Review plan"
      description="A suggested plan you can edit and approve before it becomes active."
      next={{ href: "/roadmap", label: "Roadmap" }}
    />
  );
}