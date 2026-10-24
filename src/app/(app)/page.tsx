import { Placeholder } from "@/components/shell/Placeholder";
export default function HomePage() {
  return (
    <Placeholder
      title="AI Learning Assistant"
      description="Describe a target role, see the skill gaps, and follow a plan you approve."
      next={{ href: "/role", label: "Target role" }}
    />
  );
}