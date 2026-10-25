import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Skill gaps" };

const groups = [
  {
    label: "Matches",
    pill: "Match",
    pillClass: "bg-good/15 text-good",
    skills: [
      { name: "React + TypeScript", detail: "8 years, design system ownership cited" },
      { name: "Web performance", detail: "Measured LCP win on checkout" },
      { name: "Mentoring", detail: "Team lead and hire-loop experience" },
      { name: "Next.js App Router", detail: "Listed as the current stack" },
      { name: "Testing (Jest / Playwright)", detail: "Aligns with the posting" },
      { name: "GraphQL client work", detail: "Present, federation still open" },
      { name: "Cross-team delivery", detail: "Multi-team design system rollout" },
    ],
  },
  {
    label: "Gaps",
    pill: "Gap",
    pillClass: "bg-bad/15 text-bad",
    skills: [
      {
        name: "Frontend system design at staff scope",
        detail: "The posting expects architecture tradeoffs with staff-level backend",
      },
      {
        name: "Architecture reviews and RFCs",
        detail: "No written RFC or design doc yet",
      },
      {
        name: "Accessibility program leadership",
        detail: "A differentiator the posting asks for",
      },
      {
        name: "Presenting to engineering leadership",
        detail: "An interview signal the resume does not show",
      },
      {
        name: "Design system governance at scale",
        detail: "Adoption is there, multi-org governance is thinner",
      },
    ],
  },
  {
    label: "Still need proof",
    pill: "Proof",
    pillClass: "bg-warn/15 text-warn",
    skills: [
      {
        name: "GraphQL federation",
        detail: "Client use is clear, the federation role is not",
      },
      {
        name: "Distributed systems literacy",
        detail: "Resume notes limited design-review exposure",
      },
      {
        name: "Hiring bar for staff peers",
        detail: "Ran loops, the seniority of that bar is not specified",
      },
    ],
  },
];

export default function SkillGapsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Skill gaps</h1>
      <p className="mt-3 max-w-xl text-muted">
        Matches, gaps, and skills that still need proof for that role.
      </p>
      <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 rounded-xl border border-line bg-panel px-5 py-4 shadow-sm">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-2xl font-bold tracking-tight">{group.skills.length}</p>
            <p className="text-sm text-muted">{group.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {groups.map((group) => (
          <section key={group.label}>
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-medium uppercase ${group.pillClass}`}
              >
                {group.pill}
              </span>
              {group.label}
            </h2>
            <ul className="flex flex-col gap-2">
              {group.skills.map((skill) => (
                <li
                  key={skill.name}
                  className="rounded-lg border border-line bg-panel px-3.5 py-3"
                >
                  <p className="text-sm font-semibold">{skill.name}</p>
                  <p className="mt-1 text-sm text-muted">{skill.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/roadmap/review"
          className="inline-flex rounded-full bg-rail px-4 py-2 text-sm font-semibold text-surface hover:bg-raildeep"
        >
          Review plan
        </Link>
        <Link
          href="/role"
          className="inline-flex rounded-full bg-surface px-4 py-2 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--line)] hover:text-rail"
        >
          Back to Target role
        </Link>
      </div>
    </main>
  );
}