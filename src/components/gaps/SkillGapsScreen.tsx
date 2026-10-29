"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const groups = [
  { kind: "match", label: "Matches", pill: "Match", pillClass: "bg-good/15 text-good" },
  { kind: "gap", label: "Gaps", pill: "Gap", pillClass: "bg-bad/15 text-bad" },
  { kind: "proof", label: "Still need proof", pill: "Proof", pillClass: "bg-warn/15 text-warn" },
] as const;

type Gap = { id: string; kind: "match" | "gap" | "proof"; name: string; detail: string; position: number };

export function SkillGapsScreen() {
  const [gaps, setGaps] = useState<Gap[] | null>(null);
  const router = useRouter();
  const [roleId, setRoleId] = useState<string | null>(null);
  const [proposing, setProposing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      const roleResponse = await fetch("/api/v1/target-roles");
      const role: { id: string } | null = await roleResponse.json();
      setRoleId(role?.id ?? null);
      if (!role || ignore) {
        if (!ignore) setGaps([]);
        return;
      }
      const gapResponse = await fetch(`/api/v1/target-roles/${role.id}/gaps`);
      const rows: Gap[] = await gapResponse.json();
      if (!ignore) setGaps(rows);
    }
    void load();
    return () => {
      ignore = true;
    };
  }, []);

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
    router.push(`/roadmap/review?plan=${body.plan.id}`);
  }

  const saved = gaps ?? [];

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Skill gaps</h1>
      <p className="mt-3 max-w-xl text-muted">
        Matches, gaps, and skills that still need proof for that role.
      </p>
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
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={propose}
          disabled={proposing || !roleId}
          className="inline-flex rounded-full bg-rail px-4 py-2 text-sm font-semibold text-surface hover:bg-raildeep"
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