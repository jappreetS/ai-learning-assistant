import type { Metadata } from "next";

import { RoadmapScreen } from "@/components/roadmap/RoadmapScreen";

export const metadata: Metadata = { title: "Roadmap" };

export default function RoadmapPage() {
  return <RoadmapScreen />;
}