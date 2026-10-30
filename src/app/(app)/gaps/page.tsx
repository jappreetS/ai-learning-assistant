import type { Metadata } from "next";
import { SkillGapsScreen } from "@/components/gaps/SkillGapsScreen";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Skill gaps" };

export default function SkillGapsPage() {
  return (
    <Suspense>
      <SkillGapsScreen />
    </Suspense>
  );
}