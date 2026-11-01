"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Plan = { id: string; active: boolean; roleTitle: string; lengthWeeks: number; currentWeek: number };
type Week = { id: string; label: string; title: string; detail: string };

function weekState(label: string, currentWeek: number) {
  const match = label.match(/W(\d+)(?:-(\d+))?/);
  if (!match) return "Upcoming";
  const start = Number(match[1]);
  const end = Number(match[2] ?? match[1]);
  if (currentWeek > end) return "Complete";
  if (currentWeek >= start) return "Current";
  return "Upcoming";
}

export function RoadmapScreen() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [weeks, setWeeks] = useState<Week[]>([]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      const planResponse = await fetch("/api/v1/plans");
      const plans: Plan[] = await planResponse.json();
      const active = plans.find((item) => item.active);
      if (!active || ignore) return;
      setPlan(active);
      const weekResponse = await fetch(`/api/v1/plans/${active.id}/weeks`);
      const rows: Week[] = await weekResponse.json();
      if (!ignore) setWeeks(rows);
    }
    void load();
    return () => {
      ignore = true;
    };
  }, []);

  const current = weeks.find((week) => plan && weekState(week.label, plan.currentWeek) === "Current");

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Roadmap</h1>
      <p className="mt-3 max-w-xl text-muted">
        {plan ? `${plan.roleTitle}, week ${plan.currentWeek} of ${plan.lengthWeeks}.` : "No plan is active."}
      </p>
      {plan ? (
        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 rounded-xl border border-line bg-panel px-5 py-4 shadow-sm">
          <div>
            <p className="text-2xl font-bold tracking-tight">
              {plan.currentWeek} of {plan.lengthWeeks}
            </p>
            <p className="text-sm text-muted">Week</p>
          </div>
          <div>
            <p className="text-base font-semibold">{current?.title ?? "—"}</p>
            <p className="text-sm text-muted">This week</p>
          </div>
        </div>
      ) : null}
      <ol className="mt-8 flex flex-col gap-3">
        {weeks.map((week, index) => {
          const state = plan ? weekState(week.label, plan.currentWeek) : "Upcoming";
          return (
            <li key={week.id} className="flex">
              <div className="relative w-3 shrink-0">
                {index > 0 ? (
                  <span className="absolute top-0 left-1/2 h-1/2 w-0.5 -translate-x-1/2 bg-rail" />
                ) : null}
                {index < weeks.length - 1 ? (
                  <span className="absolute top-1/2 left-1/2 h-[calc(50%+0.75rem)] w-0.5 -translate-x-1/2 bg-rail" />
                ) : null}
                <span
                  className={`absolute top-1/2 left-1/2 z-10 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-rail ${state === "Complete" ? "bg-rail" : "bg-paper"
                    }`}
                />
              </div>
              <div
                className={`ml-4 flex-1 rounded-xl border bg-panel p-4 ${state === "Current"
                  ? "border-rail shadow-[0_0_0_3px_color-mix(in_oklab,var(--rail)_16%,transparent)]"
                  : "border-line"
                  }`}
              >
                <p
                  className={`font-mono text-[11px] font-medium uppercase tracking-wider ${state === "Complete" ? "text-good" : state === "Current" ? "text-rail" : "text-muted"
                    }`}
                >
                  {state}
                </p>
                <p className="mt-2 font-mono text-xs text-rail">{week.label}</p>
                <h2 className="mt-1 text-base font-semibold">{week.title}</h2>
                <p className="mt-1 text-sm text-muted">{week.detail}</p>
                {state === "Current" ? (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link href="/sessions" className="inline-flex rounded-full bg-rail px-4 py-2 text-sm font-semibold text-surface hover:bg-raildeep">
                      Sessions
                    </Link>
                    <Link href="/progress" className="inline-flex rounded-full bg-surface px-4 py-2 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--line)] hover:text-rail">
                      Progress
                    </Link>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </main>
  );
}