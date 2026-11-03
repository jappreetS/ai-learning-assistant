"use client";

import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/Button";
import { readJson } from "@/lib/api";

const stages = ["studied", "practiced", "applied", "demonstrated"] as const;

type Skill = {
  id: string;
  name: string;
  stage: (typeof stages)[number] | null;
  latestNote: string;
  nextStep: string;
};

function label(stage: string) {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

function StageBar({ stage }: { stage: Skill["stage"] }) {
  const filled = stage ? stages.indexOf(stage) + 1 : 0;
  return (
    <div className="mt-2 flex gap-1" aria-hidden="true">
      {stages.map((item, index) => (
        <span
          key={item}
          className={`h-1.5 flex-1 rounded-full ${index < filled ? "bg-rail" : "bg-line"}`}
        />
      ))}
    </div>
  );
}

export function ProgressScreen() {

  const plans = useQuery({
    queryKey: ["plans"],
    queryFn: () => readJson<{ id: string; active: boolean }[]>("/api/v1/plans"),
  });
  const active = plans.data?.find((plan) => plan.active);
  const skills = useQuery({
    queryKey: ["plans", active?.id, "skills"],
    queryFn: () => readJson<Skill[]>(`/api/v1/plans/${active!.id}/skills`),
    enabled: Boolean(active),
  });
  const loading = plans.isPending || (Boolean(active) && skills.isPending);
  const failed = plans.isError || skills.isError;
  const rows = skills.data ?? [];

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
      <p className="mt-3 max-w-xl text-muted">
        How far each skill has moved: Studied, Practiced, Applied, Demonstrated.
      </p>
      <ol className="mt-6 flex flex-wrap gap-2">
        {stages.map((stage) => (
          <li
            key={stage}
            className="rounded-full border border-line bg-panel px-2.5 py-1 font-mono text-xs text-muted"
          >
            {label(stage)}
          </li>
        ))}
      </ol>
      {loading ? (
        <p className="mt-8 text-sm text-muted">Loading progress...</p>
      ) : failed ? (
        <p className="mt-8 text-sm text-muted">Could not load progress</p>
      ) : !active ? (
        <p className="mt-8 text-sm text-muted">No plan is active.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-surface shadow-sm">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Skill</th>
                <th className="px-4 py-3 font-medium">Stage</th>
                <th className="px-4 py-3 font-medium">Latest note</th>
                <th className="px-4 py-3 font-medium">Next step</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((skill) => (
                <tr key={skill.id} className="border-t border-line align-top">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{skill.name}</p>
                    <StageBar stage={skill.stage} />
                  </td>
                  <td className="px-4 py-3 text-sm">{skill.stage ? label(skill.stage) : "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted">{skill.latestNote || "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted">{skill.nextStep || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-2">
        <Button href="/sessions">Sessions</Button>
        <Button href="/roadmap" variant="quiet">
          Roadmap
        </Button>
      </div>
    </main>
  );
}