"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type Plan = { id: string; fromModel: boolean };
type Week = { id: string; label: string; title: string; detail: string };

export function ReviewPlan() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedId = searchParams.get("plan");
  const jobId = searchParams.get("job");
  const [planId, setPlanId] = useState<string | null>(null);
  const [fromModel, setFromModel] = useState(true);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!requestedId) {
        if (!ignore) setMessage("No proposed plan.");
        return;
      }
      const planResponse = await fetch("/api/v1/plans");
      const plans: Plan[] = await planResponse.json();
      const plan = plans.find((item) => item.id === requestedId);
      if (!plan || ignore) {
        if (!ignore) setMessage("No proposed plan.");
        return;
      }
      setPlanId(plan.id);
      setFromModel(plan.fromModel);
      const weekResponse = await fetch(`/api/v1/plans/${plan.id}/weeks`);
      const rows: Week[] = await weekResponse.json();
      if (!ignore) setWeeks(rows);
    }
    void load();
    return () => {
      ignore = true;
    };
  }, [requestedId]);

  async function approve() {
    if (!planId) return;
    const approved = await fetch(`/api/v1/plans/${planId}/approve`, { method: "POST" });
    if (!approved.ok) {
      setMessage("Could not approve the plan.");
      return;
    }
    const activated = await fetch(`/api/v1/plans/${planId}/activate`, { method: "POST" });
    if (!activated.ok) {
      setMessage("Could not make the plan active.");
      return;
    }
    if (jobId) {
      const linked = await fetch(`/api/v1/job-applications/${jobId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      if (!linked.ok) {
        setMessage("Could not attach the plan to the job.");
        return;
      }
    }
    router.push("/roadmap");
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Review plan</h1>
      <p className="mt-3 max-w-xl text-muted">
        These weeks were proposed from the skill gaps. Approve to make this the roadmap.
      </p>
      {planId && !fromModel ? (
        <p className="mt-3 text-sm text-muted">The model did not write this plan.</p>
      ) : null}
      <ol className="mt-8 flex flex-col gap-3">
        {weeks.map((week) => (
          <li key={week.id} className="grid gap-3 rounded-xl border border-line bg-panel p-4 sm:grid-cols-[4.5rem_1fr]">
            <p className="font-mono text-xs text-rail">{week.label}</p>
            <div>
              <h2 className="text-base font-semibold">{week.title}</h2>
              <p className="mt-1 text-sm text-muted">{week.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      {message ? <p className="mt-6 text-sm text-muted">{message}</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={approve}
          className="inline-flex rounded-full bg-rail px-4 py-2 text-sm font-semibold text-surface hover:bg-raildeep"
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