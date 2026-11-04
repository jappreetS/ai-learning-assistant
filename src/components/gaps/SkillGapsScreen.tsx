"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
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
type Role = {
  id: string;
  source: "resume-jd" | "jd-only" | "written";
  resumeExcerpt: string | null;
  jobDescription: string | null;
};
type Keyword = { name: string; present: boolean };

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(text: string, names: string[], className: string) {
  const sorted = [...names].filter(Boolean).sort((a, b) => b.length - a.length);
  if (sorted.length === 0) return text;
  const pattern = new RegExp(sorted.map(escapeRegExp).join("|"), "gi");
  const parts = text.split(pattern);
  const marks = text.match(pattern) ?? [];
  return parts.flatMap((part, index) => [
    part,
    marks[index] ? (
      <mark key={`${marks[index]}-${index}`} className={`rounded px-0.5 ${className}`}>
        {marks[index]}
      </mark>
    ) : null,
  ]);
}

export function SkillGapsScreen() {
  const jobId = useSearchParams().get("job");
  const router = useRouter();
  const role = useQuery({
    queryKey: ["target-role"],
    queryFn: () => readJson<Role | null>("/api/v1/target-roles"),
  });
  const gaps = useQuery({
    queryKey: ["target-role", role.data?.id, "gaps"],
    enabled: Boolean(role.data),
    queryFn: () => readJson<Gap[]>(`/api/v1/target-roles/${role.data!.id}/gaps`),
  });
  const keywords = useQuery({
    queryKey: ["target-role", role.data?.id, "keywords"],
    enabled: Boolean(role.data),
    queryFn: () =>
      readJson<{ keywords: Keyword[] }>(`/api/v1/target-roles/${role.data!.id}/keywords`),
  });
  const loading = role.isPending || (Boolean(role.data) && (gaps.isPending || keywords.isPending));
  const failed = role.isError || gaps.isError || keywords.isError;
  const roleId = role.data?.id ?? null;
  const queryClient = useQueryClient();
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
  const keywordRows = keywords.data?.keywords ?? [];

  function alreadySaved(name: string) {
    return saved.some((gap) => gap.kind === "gap" && gap.name.toLowerCase() === name.toLowerCase());
  }

  async function saveKeyword(name: string) {
    if (!roleId || alreadySaved(name)) return;
    const position = saved.reduce((max, gap) => Math.max(max, gap.position), 0) + 1;
    const response = await fetch(`/api/v1/target-roles/${roleId}/gaps`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        kind: "gap",
        name,
        detail: `Add a bullet that shows ${name}.`,
        position,
      }),
    });
    if (!response.ok) {
      setMessage("Could not save that gap.");
      return;
    }
    setMessage("");
    await queryClient.invalidateQueries({ queryKey: ["target-role", roleId, "gaps"] });
  }
  const showComparison =
    role.data?.source === "resume-jd" && Boolean(role.data.resumeExcerpt) && Boolean(role.data.jobDescription);

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
          {showComparison ? (
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <section className="rounded-xl border border-line bg-surface p-5 shadow-sm">
                <h2 className="text-base font-semibold">Resume</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
                  {highlight(
                    role.data?.resumeExcerpt ?? "",
                    keywordRows.filter((item) => item.present).map((item) => item.name),
                    "bg-good/15 text-good",
                  )}
                </p>
              </section>
              <section className="rounded-xl border border-line bg-surface p-5 shadow-sm">
                <h2 className="text-base font-semibold">Job description</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
                  {highlight(
                    role.data?.jobDescription ?? "",
                    keywordRows.filter((item) => !item.present).map((item) => item.name),
                    "bg-bad/15 text-bad",
                  )}
                </p>
                <ul className="mt-4 flex flex-col gap-3">
                  {keywordRows
                    .filter((item) => !item.present)
                    .map((item) => {
                      const savedAlready = alreadySaved(item.name);
                      return (
                        <li key={item.name}>
                          <p className="text-sm font-semibold text-bad">{item.name}</p>
                          <p className="mt-1 text-sm text-muted">Add a bullet that shows {item.name}.</p>
                          <button
                            type="button"
                            onClick={() => saveKeyword(item.name)}
                            disabled={savedAlready}
                            className="mt-2 inline-flex rounded-full bg-surface px-3 py-1 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--line)] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {savedAlready ? "Saved as a gap" : "Save as a gap"}
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </section>
            </div>
          ) : null}
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