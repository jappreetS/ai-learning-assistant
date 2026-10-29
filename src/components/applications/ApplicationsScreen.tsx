"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Plan = {
  id: string;
  currentWeek: number;
  lengthWeeks: number;
  active: boolean;
};

type Application = {
  id: string;
  roleTitle: string;
  company: string;
  stage: "saved" | "applied" | "interviewing";
  planId: string | null;
};

const stageLabel = {
  saved: "Saved",
  applied: "Applied",
  interviewing: "Interviewing",
} as const;

const stageClass = {
  saved: "border border-line text-muted",
  applied: "bg-signal/15 text-signal",
  interviewing: "bg-rail/10 text-raildeep",
} as const;

const linkClass = "text-sm font-semibold text-rail hover:underline";

export function ApplicationsScreen() {
  const router = useRouter();
  const [rows, setRows] = useState<Application[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      const [applicationResponse, planResponse] = await Promise.all([
        fetch("/api/v1/job-applications"),
        fetch("/api/v1/plans"),
      ]);
      const applications: Application[] = await applicationResponse.json();
      const planRows: Plan[] = await planResponse.json();
      if (!ignore) {
        setRows(applications);
        setPlans(planRows);
      }
    }
    void load();
    return () => {
      ignore = true;
    };
  }, []);

  async function openPlan(planId: string) {
    const response = await fetch(`/api/v1/plans/${planId}/activate`, { method: "POST" });
    if (!response.ok) {
      setMessage("Could not open that plan.");
      return;
    }
    router.push("/roadmap");
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
      <p className="mt-3 max-w-xl text-muted">Saved applications. Each row can point at a plan.</p>
      <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-surface shadow-sm">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">Skill readiness</th>
              <th className="px-4 py-3 font-medium">Learning link</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const plan = plans.find((item) => item.id === row.planId);
              return (
                <tr key={row.id} className="border-t border-line">
                  <td className="px-4 py-3 font-semibold">{row.roleTitle}</td>
                  <td className="px-4 py-3 text-sm">{row.company}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${stageClass[row.stage]}`}>
                      {stageLabel[row.stage]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">
                    {plan ? `Week ${plan.currentWeek} of ${plan.lengthWeeks}` : "No plan yet"}
                  </td>
                  <td className="px-4 py-3">
                    {plan?.active ? (
                      <Link href="/roadmap" className={linkClass}>
                        Roadmap
                      </Link>
                    ) : plan ? (
                      <button type="button" className={linkClass} onClick={() => openPlan(plan.id)}>
                        Roadmap
                      </button>
                    ) : (
                      <Link href="/role" className={linkClass}>
                        Target role
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {message ? <p className="mt-6 text-sm text-muted">{message}</p> : null}
    </main>
  );
}