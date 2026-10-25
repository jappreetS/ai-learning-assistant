import type { Metadata } from "next";

export const metadata: Metadata = { title: "Review plan" };

const weeks = [
  {
    label: "W1–2",
    title: "Staff-shaped system design reps",
    detail:
      "Weekly frontend platform design prompt and a written tradeoff memo. Review it against a staff rubric.",
    skills: ["System design", "Written RFCs"],
  },
  {
    label: "W3–4",
    title: "Architecture review practice",
    detail:
      "Critique two open-source frontend architectures. Write one RFC for a fictional multi-team change.",
    skills: ["RFCs", "Leadership signal"],
  },
  {
    label: "W5–7",
    title: "Design system governance project",
    detail:
      "Define a contribution model, a versioning policy, and a migration playbook, as if shipping to four teams.",
    skills: ["Design systems", "Governance"],
  },
  {
    label: "W8–9",
    title: "Accessibility program spike",
    detail:
      "Audit one product surface to WCAG 2.2 AA. Write a remediation plan and an owner model.",
    skills: ["Accessibility"],
  },
  {
    label: "W10–12",
    title: "Leadership presentation",
    detail:
      "A 30-minute architecture talk, plus the memos, RFCs, and before-and-after metrics for interviews.",
    skills: ["Demonstrated", "Interview ready"],
  },
];

export default function ReviewPlanPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Review plan</h1>
      <p className="mt-3 max-w-xl text-muted">
        A 12-week Staff Frontend sample. It becomes the roadmap when you approve it.
      </p>
      <ol className="mt-8 flex flex-col gap-3">
        {weeks.map((week) => (
          <li
            key={week.label}
            className="grid gap-3 rounded-xl border border-line bg-panel p-4 sm:grid-cols-[4.5rem_1fr]"
          >
            <p className="font-mono text-xs text-rail">{week.label}</p>
            <div>
              <h2 className="text-base font-semibold">{week.title}</h2>
              <p className="mt-1 text-sm text-muted">{week.detail}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {week.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-line bg-surface px-2 py-0.5 text-xs text-muted"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}