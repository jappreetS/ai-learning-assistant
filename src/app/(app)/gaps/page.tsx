import type { Metadata } from "next";
import { SkillGapsScreen } from "@/components/gaps/SkillGapsScreen";

export const metadata: Metadata = { title: "Skill gaps" };

export default function SkillGapsPage() {
  return <SkillGapsScreen />;
}