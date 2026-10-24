import type { Metadata } from "next";
import { Placeholder } from "@/components/shell/Placeholder";

export const metadata: Metadata = { title: "Progress" };

export default function ProgressPage() {
  return (
    <Placeholder
      title="Progress"
      description="How far each skill has moved: Studied, Practiced, Applied, Demonstrated."
      next={{ href: "/plans", label: "Plans" }}
    />
  );
}