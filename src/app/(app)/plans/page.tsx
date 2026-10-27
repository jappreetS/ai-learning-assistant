import type { Metadata } from "next";

export const metadata: Metadata = { title: "Plans" };

const plans = [
  {
    role: "Staff Frontend Engineer",
    detail: "Northwind Labs · 12-week plan · Week 4",
    active: true,
    stats: [
      { value: "33%", label: "complete" },
      { value: "9", label: "sessions" },
      { value: "5", label: "gaps in motion" },
    ],
  },
  {
    role: "Senior Full-Stack Engineer",
    detail: "Harbor Payments · 10-week plan · Week 1",
    active: false,
    stats: [
      { value: "8%", label: "complete" },
      { value: "2", label: "sessions" },
      { value: "6", label: "gaps queued" },
    ],
  },
];

export default function PlansPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Plans</h1>
      <p className="mt-3 max-w-xl text-muted">
        Each plan keeps its own gaps, sessions, and progress.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <article
            key={plan.role}
            className={`rounded-xl border bg-surface p-5 shadow-sm ${plan.active
                ? "border-rail shadow-[0_0_0_3px_color-mix(in_oklab,var(--rail)_16%,transparent)]"
                : "border-line"
              }`}
          >
            {plan.active ? (
              <p className="mb-3 w-fit rounded-full bg-rail/10 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide text-raildeep">
                Active now
              </p>
            ) : null}
            <h2 className="text-lg font-bold tracking-tight">{plan.role}</h2>
            <p className="mt-1 text-sm text-muted">{plan.detail}</p>
            <dl className="mt-4 flex flex-wrap gap-6">
              {plan.stats.map((stat) => (
                <div key={stat.label}>
                  <dd className="text-lg font-semibold">{stat.value}</dd>
                  <dt className="text-xs text-muted">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </main>
  );
}