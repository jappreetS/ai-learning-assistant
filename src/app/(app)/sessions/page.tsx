import type { Metadata } from "next";
import { Placeholder } from "@/components/shell/Placeholder";

export const metadata: Metadata = { title: "Sessions" };

export default function SessionsPage() {
  return (
    <Placeholder
      title="Sessions"
      description="A short record of what you studied, practiced, applied, or demonstrated."
      next={{ href: "/progress", label: "Progress" }}
    />
  );
}