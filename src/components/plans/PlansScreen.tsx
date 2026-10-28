"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";

type Plan = {
  id: string;
  roleTitle: string;
  company: string;
  lengthWeeks: number;
  currentWeek: number;
  active: boolean;
  approved: boolean;
};

export function PlansScreen() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/v1/plans");
    setPlans(await response.json());
  }

  useEffect(() => {
    void load();
  }, []);

  async function activate(plan: Plan) {
    const response = await fetch(`/api/v1/plans/${plan.id}/activate`, { method: "POST" });
    if (!response.ok) {
      const body: { error?: string } = await response.json();
      setMessage(body.error ?? "Could not activate");
      return;
    }
    setMessage("");
    await load();
  }

  const active = plans.find((plan) => plan.active);

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Plans</h1>
      <p className="mt-3 max-w-xl text-muted">
        Each plan keeps its own gaps, sessions, and progress.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => activate(plan)}
            className={`rounded-xl border bg-surface p-5 text-left shadow-sm ${plan.active
                ? "border-rail shadow-[0_0_0_3px_color-mix(in_oklab,var(--rail)_16%,transparent)]"
                : "border-line"
              }`}
          >
            {plan.active ? (
              <p className="mb-3 w-fit rounded-full bg-rail/10 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide text-raildeep">
                Active now
              </p>
            ) : null}
            <h2 className="text-lg font-bold tracking-tight">{plan.roleTitle}</h2>
            <p className="mt-1 text-sm text-muted">
              {plan.company} · {plan.lengthWeeks}-week plan · Week {plan.currentWeek}
            </p>
            <p className="mt-3 text-sm text-muted">{plan.approved ? "Approved" : "Not approved"}</p>
          </button>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted">
        {message || (active ? `${active.roleTitle} is active.` : "No plan is active.")}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button href="/roadmap">Roadmap</Button>
        <Button href="/role" variant="quiet">
          Target role
        </Button>
      </div>
    </main>
  );
}