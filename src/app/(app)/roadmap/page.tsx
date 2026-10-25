import type { Metadata } from "next";

export const metadata: Metadata = { title: "Roadmap" };

const weeks = [
  {
    label: "W1–2",
    state: "Complete",
    stateClass: "text-good",
    title: "Staff-shaped system design reps",
    detail:
      "Weekly frontend platform design prompt and a written tradeoff memo. Review it against a staff rubric.",
  },
  {
    label: "W3–4",
    state: "Current",
    stateClass: "text-rail",
    title: "Architecture review practice",
    detail:
      "Critique two open-source frontend architectures. Write one RFC for a fictional multi-team change.",
  },
  {
    label: "W5–7",
    state: "Upcoming",
    stateClass: "text-muted",
    title: "Design system governance project",
    detail:
      "Define a contribution model, a versioning policy, and a migration playbook, as if shipping to four teams.",
  },
  {
    label: "W8–9",
    state: "Upcoming",
    stateClass: "text-muted",
    title: "Accessibility program spike",
    detail:
      "Audit one product surface to WCAG 2.2 AA. Write a remediation plan and an owner model.",
  },
  {
    label: "W10–12",
    state: "Upcoming",
    stateClass: "text-muted",
    title: "Leadership presentation",
    detail:
      "A 30-minute architecture talk, plus the memos, RFCs, and before-and-after metrics for interviews.",
  },
];

export default function RoadmapPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Roadmap</h1>
      <p className="mt-3 max-w-xl text-muted">
        The Staff Frontend sample, already underway.
      </p>
      <ol className="mt-8 flex flex-col gap-3">
        {weeks.map((week) => (
          <li
            key={week.label}
            className={`grid gap-3 rounded-xl border bg-panel p-4 sm:grid-cols-[7rem_1fr] ${week.state === "Current" ? "border-rail" : "border-line"
              }`}
          >
            <p className={`text-sm font-semibold ${week.stateClass}`}>{week.state}</p>
            <div>
              <p className="font-mono text-xs text-rail">{week.label}</p>
              <h2 className="mt-1 text-base font-semibold">{week.title}</h2>
              <p className="mt-1 text-sm text-muted">{week.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}