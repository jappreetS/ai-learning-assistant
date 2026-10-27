import type { Metadata } from "next";

export const metadata: Metadata = { title: "Progress" };

const stages = ["Studied", "Practiced", "Applied", "Demonstrated"] as const;

const skills = [
  {
    name: "Frontend system design",
    stage: "Practiced",
    filled: 2,
    partial: true,
    note: "Two scored design memos (Oct 12, Oct 15).",
    next: "Ship one memo that includes failure modes and capacity numbers.",
  },
  {
    name: "Architecture reviews and RFCs",
    stage: "Practiced",
    filled: 2,
    partial: false,
    note: "RFC draft, sections 1–2 (Oct 22).",
    next: "Finish the RFC and get a peer review.",
  },
  {
    name: "Design system governance",
    stage: "Studied",
    filled: 1,
    partial: false,
    note: "Notes on two open-source contribution models.",
    next: "Start the week-5 governance outline.",
  },
  {
    name: "Accessibility program leadership",
    stage: "—",
    filled: 0,
    partial: false,
    note: "—",
    next: "Schedule the week-8 audit.",
  },
];

function StageBar({ filled, partial }: { filled: number; partial: boolean }) {
  return (
    <div className="mt-2 flex gap-1" aria-hidden="true">
      {stages.map((stage, index) => {
        const className =
          index < filled ? "bg-rail" : index === filled && partial ? "bg-rail/40" : "bg-line";
        return <span key={stage} className={`h-1.5 flex-1 rounded-full ${className}`} />;
      })}
    </div>
  );
}

export default function ProgressPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
      <p className="mt-3 max-w-xl text-muted">
        How far each skill has moved: Studied, Practiced, Applied, Demonstrated.
      </p>
      <ol className="mt-6 flex flex-wrap gap-2">
        {stages.map((stage) => (
          <li
            key={stage}
            className="rounded-full border border-line bg-panel px-2.5 py-1 font-mono text-xs text-muted"
          >
            {stage}
          </li>
        ))}
      </ol>
      <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-surface shadow-sm">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Skill</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">Latest note</th>
              <th className="px-4 py-3 font-medium">Next step</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.name} className="border-t border-line align-top">
                <td className="px-4 py-3">
                  <p className="font-semibold">{skill.name}</p>
                  <StageBar filled={skill.filled} partial={skill.partial} />
                </td>
                <td className="px-4 py-3 text-sm">{skill.stage}</td>
                <td className="px-4 py-3 text-sm text-muted">{skill.note}</td>
                <td className="px-4 py-3 text-sm text-muted">{skill.next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}