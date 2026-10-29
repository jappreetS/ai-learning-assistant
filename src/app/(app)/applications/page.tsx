import type { Metadata } from "next";

import { ApplicationsScreen } from "@/components/applications/ApplicationsScreen";

export const metadata: Metadata = { title: "Job Applications" };

export default function ApplicationsPage() {
  return <ApplicationsScreen />;
}