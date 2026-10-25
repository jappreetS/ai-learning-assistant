"use client";

import { useState } from "react";

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

export function ReviewPlan() {
  const [details, setDetails] = useState(weeks.map((week) => week.detail));
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Review plan</h1>
      <p className="mt-3 max-w-xl text-muted">
        A 12-week Staff Frontend sample. It becomes the roadmap when you approve it.
      </p>
      <ol className="mt-8 flex flex-col gap-3">
        {weeks.map((week, index) => (
          <li
            key={week.label}
            className="grid gap-3 rounded-xl border border-line bg-panel p-4 sm:grid-cols-[4.5rem_1fr_auto]"
          >
            <p className="font-mono text-xs text-rail">{week.label}</p>
            <div>
              <h2 className="text-base font-semibold">{week.title}</h2>
              {editing === week.label ? (
                <textarea
                  className="mt-1 min-h-24 w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-rail focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--rail)_12%,transparent)]"
                  value={details[index]}
                  onChange={(event) =>
                    setDetails((current) =>
                      current.map((detail, detailIndex) =>
                        detailIndex === index ? event.target.value : detail,
                      ),
                    )
                  }
                />
              ) : (
                <p className="mt-1 text-sm text-muted">{details[index]}</p>
              )}
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
            <button
              type="button"
              onClick={() => setEditing(editing === week.label ? null : week.label)}
              className="text-sm font-semibold text-muted hover:text-ink"
            >
              {editing === week.label ? "Done" : "Edit"}
            </button>
          </li>
        ))}
      </ol>
    </main>
  );
}