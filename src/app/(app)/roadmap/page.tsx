import type { Metadata } from "next";
import { Placeholder } from "@/components/shell/Placeholder";

export const metadata: Metadata = { title: "Roadmap" };

export default function RoadmapPage() {
  return (
    <Placeholder
      title="Roadmap"
      description="The plan that is currently active."
      next={{ href: "/sessions", label: "Sessions" }}
    />
  );
}