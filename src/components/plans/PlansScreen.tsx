"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

const plans = [
  {
    id: "staff-fe",
    role: "Staff Frontend Engineer",
    detail: "Northwind Labs · 12-week plan · Week 4",
    stats: [
      { value: "33%", label: "complete" },
      { value: "9", label: "sessions" },
      { value: "5", label: "gaps in motion" },
    ],
  },
  {
    id: "senior-fs",
    role: "Senior Full-Stack Engineer",
    detail: "Harbor Payments · 10-week plan · Week 1",
    stats: [
      { value: "8%", label: "complete" },
      { value: "2", label: "sessions" },
      { value: "6", label: "gaps queued" },
    ],
  },
];

export function PlansScreen() {
  const [activeId, setActiveId] = useState("staff-fe");
  const active = plans.find((plan) => plan.id === activeId) ?? plans[0];

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Plans</h1>
      <p className="mt-3 max-w-xl text-muted">
        Each plan keeps its own gaps, sessions, and progress.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {plans.map((plan) => {
          const selected = plan.id === activeId;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setActiveId(plan.id)}
              className={`rounded-xl border bg-surface p-5 text-left shadow-sm ${selected
                ? "border-rail shadow-[0_0_0_3px_color-mix(in_oklab,var(--rail)_16%,transparent)]"
                : "border-line"
                }`}
            >
              {selected ? (
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
            </button>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-muted">{active.role} is active.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button href="/roadmap">Roadmap</Button>
        <Button href="/role" variant="quiet">
          Target role
        </Button>
      </div>
    </main>
  );
}