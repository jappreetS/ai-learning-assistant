import { ReviewPlan } from "@/components/roadmap/ReviewPlan";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Review plan" };

export default function ReviewPlanPage() {
  return <ReviewPlan />;
}