import type { Metadata } from "next";
import Link from "next/link";

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

const currentWeek = weeks.find((week) => week.state === "Current");

export default function RoadmapPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Roadmap</h1>
      <p className="mt-3 max-w-xl text-muted">
        The Staff Frontend sample, already underway.
      </p>
      <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 rounded-xl border border-line bg-panel px-5 py-4 shadow-sm">
        <div>
          <p className="text-2xl font-bold tracking-tight">4 of 12</p>
          <p className="text-sm text-muted">Week</p>
        </div>
        <div>
          <p className="text-base font-semibold">{currentWeek?.title}</p>
          <p className="text-sm text-muted">This week</p>
        </div>
      </div>
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
              {week.state === "Current" ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/sessions"
                    className="inline-flex rounded-full bg-rail px-4 py-2 text-sm font-semibold text-surface hover:bg-raildeep"
                  >
                    Sessions
                  </Link>
                  <Link
                    href="/progress"
                    className="inline-flex rounded-full bg-surface px-4 py-2 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--line)] hover:text-rail"
                  >
                    Progress
                  </Link>
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}