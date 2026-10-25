import type { Metadata } from "next";
import { Placeholder } from "@/components/shell/Placeholder";

export const metadata: Metadata = { title: "Job Applications" };

export default function ApplicationsPage() {
  return (
    <Placeholder
      title="Job Applications"
      description="Each application will link to the gaps and plan for that role."
    />
  );
}