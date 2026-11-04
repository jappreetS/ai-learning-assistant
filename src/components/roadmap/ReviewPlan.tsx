"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Shimmer } from "@/components/ui/Shimmer";
import { readJson } from "@/lib/api";

type Plan = { id: string; fromModel: boolean };
type Week = { id: string; label: string; title: string; detail: string };

export function ReviewPlan() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedId = searchParams.get("plan");
  const jobId = searchParams.get("job");
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const plan = useQuery({
    queryKey: ["plans", requestedId],
    enabled: Boolean(requestedId),
    queryFn: async () => {
      const plans = await readJson<Plan[]>("/api/v1/plans");
      return plans.find((item) => item.id === requestedId) ?? null;
    },
  });
  const weeks = useQuery({
    queryKey: ["plans", requestedId, "weeks"],
    enabled: Boolean(plan.data),
    queryFn: () => readJson<Week[]>(`/api/v1/plans/${requestedId}/weeks`),
  });
  const loading = Boolean(requestedId) && (plan.isPending || (Boolean(plan.data) && weeks.isPending));
  const failed = plan.isError || weeks.isError;
  const rows = weeks.data ?? [];

  async function approve() {
    if (!plan.data) return;
    const approved = await fetch(`/api/v1/plans/${plan.data.id}/approve`, { method: "POST" });
    if (!approved.ok) {
      setMessage("Could not approve the plan.");
      return;
    }
    const activated = await fetch(`/api/v1/plans/${plan.data.id}/activate`, { method: "POST" });
    if (!activated.ok) {
      setMessage("Could not make the plan active.");
      return;
    }
    if (jobId) {
      const linked = await fetch(`/api/v1/job-applications/${jobId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ planId: plan.data.id }),
      });
      if (!linked.ok) {
        setMessage("Could not attach the plan to the job.");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["job-applications"] });
    }
    await queryClient.invalidateQueries({ queryKey: ["plans"] });
    router.push("/roadmap");
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Review plan</h1>
      <p className="mt-3 max-w-xl text-muted">
        These weeks were proposed from the skill gaps. Approve to make this the roadmap.
      </p>
      {plan.data && !plan.data.fromModel ? (
        <p className="mt-3 text-sm text-muted">The model did not write this plan.</p>
      ) : null}
      {loading ? (
        <div className="mt-8 flex flex-col gap-3" aria-busy="true" aria-label="Loading plan">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="rounded-xl border border-line bg-panel p-4">
              <Shimmer className="h-3 w-16" />
              <Shimmer className="mt-3 h-4 w-1/2" />
              <Shimmer className="mt-2 h-3 w-full" />
            </div>
          ))}
        </div>
      ) : failed ? (
        <p className="mt-8 text-sm text-muted">Could not load plan</p>
      ) : !plan.data ? (
        <p className="mt-8 text-sm text-muted">No proposed plan.</p>
      ) : (
      <ol className="mt-8 flex flex-col gap-3">
        {rows.map((week) => (
          <li key={week.id} className="grid gap-3 rounded-xl border border-line bg-panel p-4 sm:grid-cols-[4.5rem_1fr]">
            <p className="font-mono text-xs text-rail">{week.label}</p>
            <div>
              <h2 className="text-base font-semibold">{week.title}</h2>
              <p className="mt-1 text-sm text-muted">{week.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      )}
      {message ? <p className="mt-6 text-sm text-muted">{message}</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={approve}
          disabled={!plan.data}
          className="inline-flex rounded-full bg-rail px-4 py-2 text-sm font-semibold text-surface hover:bg-raildeep disabled:opacity-50"
        >
          Approve
        </button>
        <Link
          href="/gaps"
          className="inline-flex rounded-full bg-surface px-4 py-2 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--line)] hover:text-rail"
        >
          Skill gaps
        </Link>
      </div>
    </main>
  );
}