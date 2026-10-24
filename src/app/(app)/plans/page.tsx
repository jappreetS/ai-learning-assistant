import type { Metadata } from "next";
import { Placeholder } from "@/components/shell/Placeholder";

export const metadata: Metadata = { title: "Plans" };

export default function PlansPage() {
  return (
    <Placeholder
      title="Plans"
      description="Switch the active plan. Each plan keeps its own gaps, sessions, and progress."
      next={{ href: "/", label: "Home" }}
    />
  );
}