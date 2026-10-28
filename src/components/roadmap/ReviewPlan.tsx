"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Week = { id: string; label: string; title: string; detail: string };

export function ReviewPlan() {
  const router = useRouter();
  const [planId, setPlanId] = useState<string | null>(null);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      const planResponse = await fetch("/api/v1/plans");
      const plans: { id: string; active: boolean }[] = await planResponse.json();
      const active = plans.find((plan) => plan.active);
      if (!active || ignore) {
        if (!ignore) setMessage("No plan is active.");
        return;
      }
      setPlanId(active.id);
      const weekResponse = await fetch(`/api/v1/plans/${active.id}/weeks`);
      const rows: Week[] = await weekResponse.json();
      if (!ignore) setWeeks(rows);
    }
    void load();
    return () => {
      ignore = true;
    };
  }, []);

  async function approve() {
    if (!planId) return;
    const response = await fetch(`/api/v1/plans/${planId}/approve`, { method: "POST" });
    if (response.ok) router.push("/roadmap");
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Review plan</h1>
      <p className="mt-3 max-w-xl text-muted">
        The active plan’s weeks. Approve it to keep this as the roadmap.
      </p>
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