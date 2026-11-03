"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { readJson } from "@/lib/api";

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
  const plans = useQuery({
    queryKey: ["plans"],
    queryFn: () => readJson<Plan[]>("/api/v1/plans"),
  });
  const plan = plans.data?.find((item) => item.active);
  const weeks = useQuery({
    queryKey: ["plans", plan?.id, "weeks"],
    queryFn: () => readJson<Week[]>(`/api/v1/plans/${plan!.id}/weeks`),
    enabled: Boolean(plan),
  });
  const loading = plans.isPending || (Boolean(plan) && weeks.isPending);
  const failed = plans.isError || weeks.isError;
  const rows = weeks.data ?? [];
  const current = rows.find((week) => plan && weekState(week.label, plan.currentWeek) === "Current");
  const showWeeks = Boolean(plan) && !loading && !failed;

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Roadmap</h1>
      <p className="mt-3 max-w-xl text-muted">
        {loading
          ? "Loading roadmap..."
          : failed
            ? "Could not load roadmap"
            : plan
              ? `${plan.roleTitle}, week ${plan.currentWeek} of ${plan.lengthWeeks}.`
              : "No plan is active."}
      </p>
      {showWeeks && plan ? (
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
      {showWeeks && plan ? (
        <ol className="mt-8 flex flex-col gap-3">
          {rows.map((week, index) => {
            const state = plan ? weekState(week.label, plan.currentWeek) : "Upcoming";
            return (
              <li key={week.id} className="flex">
                <div className="relative w-3 shrink-0">
                  {index > 0 ? (
                    <span className="absolute top-0 left-1/2 h-1/2 w-0.5 -translate-x-1/2 bg-rail" />
                  ) : null}
                  {index < rows.length - 1 ? (
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
      ) : null}
    </main>
  );
}