"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/Button";
import { Shimmer } from "@/components/ui/Shimmer";

async function readPlans(): Promise<Plan[]> {
  const response = await fetch("/api/v1/plans");
  if (!response.ok) throw new Error("Could not load plans");
  return response.json();
}

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
  const queryClient = useQueryClient();
  const plans = useQuery({ queryKey: ["plans"], queryFn: readPlans });
  const [message, setMessage] = useState("");

  async function activate(plan: Plan) {
    const response = await fetch(`/api/v1/plans/${plan.id}/activate`, { method: "POST" });
    if (!response.ok) {
      const body: { error?: string } = await response.json();
      setMessage(body.error ?? "Could not activate");
      return;
    }
    setMessage("");
    await queryClient.invalidateQueries({ queryKey: ["plans"] });
  }

  async function remove(plan: Plan) {
    if (!confirm(`Delete ${plan.roleTitle}?`)) return;
    const response = await fetch(`/api/v1/plans/${plan.id}`, { method: "DELETE" });
    if (!response.ok) {
      setMessage("Could not delete that plan.");
      return;
    }
    setMessage("");
    await queryClient.invalidateQueries({ queryKey: ["plans"] });
  }

  const rows = plans.data ?? [];
  const active = rows.find((plan) => plan.active);

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Plans</h1>
      <p className="mt-3 max-w-xl text-muted">
        Each plan keeps its own gaps, sessions, and progress.
      </p>
      {plans.isPending ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2" aria-busy="true" aria-label="Loading plans">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="rounded-xl border border-line bg-surface p-5 shadow-sm">
              <Shimmer className="h-4 w-2/3" />
              <Shimmer className="mt-3 h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : plans.isError ? null : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {rows.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl border bg-surface p-5 text-left shadow-sm ${plan.active
                ? "border-rail shadow-[0_0_0_3px_color-mix(in_oklab,var(--rail)_16%,transparent)]"
                : "border-line"
                }`}
            >
              <button type="button" onClick={() => activate(plan)} className="w-full text-left">
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
              <button
                type="button"
                onClick={() => remove(plan)}
                className="mt-4 inline-flex rounded-full bg-surface px-4 py-2 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--line)] hover:text-rail"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      {plans.isPending ? null : (
        <p className="mt-6 text-sm text-muted">
          {message
            ? message
            : plans.isError
              ? "Could not load plans"
              : active
                ? `${active.roleTitle} is active.`
                : "No plan is active."}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button href="/roadmap">Roadmap</Button>
        <Button href="/role" variant="quiet">
          Target role
        </Button>
      </div>
    </main>
  );
}