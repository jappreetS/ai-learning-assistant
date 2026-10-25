import type { Metadata } from "next";

export const metadata: Metadata = { title: "Skill gaps" };

const counts = [
  { value: "7", label: "Matches" },
  { value: "5", label: "Gaps" },
  { value: "3", label: "Still need proof" },
];

export default function SkillGapsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Skill gaps</h1>
      <p className="mt-3 max-w-xl text-muted">
        Matches, gaps, and skills that still need proof for that role.
      </p>
      <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 rounded-xl border border-line bg-panel px-5 py-4 shadow-sm">
        {counts.map((item) => (
          <div key={item.label}>
            <p className="text-2xl font-bold tracking-tight">{item.value}</p>
            <p className="text-sm text-muted">{item.label}</p>
          </div>
        ))}
      </div>
    </main>
  );
}