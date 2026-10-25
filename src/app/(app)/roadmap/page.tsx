import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Roadmap" };

const weeks = [
  {
    label: "W1–2",
    state: "Complete",
    stateClass: "text-good",
    title: "Staff-shaped system design reps",
    detail: "Two memos filed. Solid on constraints. Deepen failure modes next pass.",
  },
  {
    label: "W3–4",
    state: "Current",
    stateClass: "text-rail",
    title: "Architecture review practice",
    detail: "Open-source critique 2 is underway. Draft RFC is due Friday.",
  },
  {
    label: "W5–7",
    state: "Upcoming",
    stateClass: "text-muted",
    title: "Design system governance project",
    detail: "Starts week 5.",
  },
  {
    label: "W8–9",
    state: "Upcoming",
    stateClass: "text-muted",
    title: "Accessibility program spike",
    detail: "Weeks 8–9.",
  },
  {
    label: "W10–12",
    state: "Upcoming",
    stateClass: "text-muted",
    title: "Leadership presentation",
    detail: "Weeks 10–12.",
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
        {weeks.map((week, index) => (
          <li key={week.label} className="flex">
            <div className="relative w-3 shrink-0">
              {index > 0 ? (
                <span className="absolute top-0 left-1/2 h-1/2 w-0.5 -translate-x-1/2 bg-rail" />
              ) : null}
              {index < weeks.length - 1 ? (
                <span className="absolute top-1/2 left-1/2 h-[calc(50%+0.75rem)] w-0.5 -translate-x-1/2 bg-rail" />
              ) : null}
              <span
                className={`absolute top-1/2 left-1/2 z-10 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-rail ${week.state === "Complete" ? "bg-rail" : "bg-paper"
                  }`}
              />
            </div>
            <div
              className={`ml-4 flex-1 rounded-xl border bg-panel p-4 ${week.state === "Current"
                  ? "border-rail shadow-[0_0_0_3px_color-mix(in_oklab,var(--rail)_16%,transparent)]"
                  : "border-line"
                }`}
            >
              <p
                className={`font-mono text-[11px] font-medium uppercase tracking-wider ${week.stateClass}`}
              >
                {week.state}
              </p>
              <p className="mt-2 font-mono text-xs text-rail">{week.label}</p>
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