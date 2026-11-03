"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Shimmer } from "@/components/ui/Shimmer";
import { readJson } from "@/lib/api";

const groups = [
  { kind: "match", label: "Matches", pill: "Match", pillClass: "bg-good/15 text-good" },
  { kind: "gap", label: "Gaps", pill: "Gap", pillClass: "bg-bad/15 text-bad" },
  { kind: "proof", label: "Still need proof", pill: "Proof", pillClass: "bg-warn/15 text-warn" },
] as const;

type Gap = { id: string; kind: "match" | "gap" | "proof"; name: string; detail: string; position: number };

export function SkillGapsScreen() {
  const jobId = useSearchParams().get("job");
  const router = useRouter();
  const role = useQuery({
    queryKey: ["target-role"],
    queryFn: () => readJson<{ id: string } | null>("/api/v1/target-roles"),
  });
  const gaps = useQuery({
    queryKey: ["target-role", role.data?.id, "gaps"],
    enabled: Boolean(role.data),
    queryFn: () => readJson<Gap[]>(`/api/v1/target-roles/${role.data!.id}/gaps`),
  });
  const loading = role.isPending || (Boolean(role.data) && gaps.isPending);
  const failed = role.isError || gaps.isError;
  const roleId = role.data?.id ?? null;
  const [proposing, setProposing] = useState(false);
  const [message, setMessage] = useState("");

  async function propose() {
    if (!roleId) return;
    setProposing(true);
    setMessage("");
    const response = await fetch(`/api/v1/target-roles/${roleId}/plan`, { method: "POST" });
    setProposing(false);
    if (!response.ok) {
      setMessage("Could not propose a plan.");
      return;
    }
    const body: { plan: { id: string } } = await response.json();
    const job = jobId ? `&job=${jobId}` : "";
    router.push(`/roadmap/review?plan=${body.plan.id}${job}`);
  }

  const saved = gaps.data ?? [];

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Skill gaps</h1>
      <p className="mt-3 max-w-xl text-muted">
        Matches, gaps, and skills that still need proof for that role.
      </p>
      {loading ? (
        <div className="mt-8 grid gap-4 lg:grid-cols-3" aria-busy="true" aria-label="Loading skill gaps">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index}>
              <Shimmer className="h-8 w-12" />
              <Shimmer className="mt-4 h-16 w-full" />
              <Shimmer className="mt-2 h-16 w-full" />
            </div>
          ))}
        </div>
      ) : failed ? (
        <p className="mt-8 text-sm text-muted">Could not load skill gaps</p>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 rounded-xl border border-line bg-panel px-5 py-4 shadow-sm">
            {groups.map((group) => (
              <div key={group.kind}>
                <p className="text-2xl font-bold tracking-tight">
                  {saved.filter((gap) => gap.kind === group.kind).length}
                </p>
                <p className="text-sm text-muted">{group.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {groups.map((group) => (
              <section key={group.kind}>
                <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
                  <span className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-medium uppercase ${group.pillClass}`}>
                    {group.pill}
                  </span>
                  {group.label}
                </h2>
                <ul className="flex flex-col gap-2">
                  {saved
                    .filter((gap) => gap.kind === group.kind)
                    .map((gap) => (
                      <li key={gap.id} className="rounded-lg border border-line bg-panel px-3.5 py-3">
                        <p className="text-sm font-semibold">{gap.name}</p>
                        <p className="mt-1 text-sm text-muted">{gap.detail}</p>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
      {message ? <p className="mt-6 text-sm text-muted">{message}</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={propose}
          disabled={proposing || !roleId || saved.length === 0}
          className="inline-flex rounded-full bg-rail px-4 py-2 text-sm font-semibold text-surface hover:bg-raildeep disabled:cursor-not-allowed disabled:opacity-50"
        >
          Review plan
        </button>
        <Link href="/role" className="inline-flex rounded-full bg-surface px-4 py-2 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--line)] hover:text-rail">
          Back to Target role
        </Link>
      </div>
    </main>
  );
}