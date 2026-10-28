"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";

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
  const [skills, setSkills] = useState<Skill[]>([]);
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
      const skillResponse = await fetch(`/api/v1/plans/${active.id}/skills`);
      const rows: Skill[] = await skillResponse.json();
      if (!ignore) setSkills(rows);
    }
    void load();
    return () => {
      ignore = true;
    };
  }, []);

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
            {skills.map((skill) => (
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
      {message ? <p className="mt-6 text-sm text-muted">{message}</p> : null}
      <div className="mt-6 flex flex-wrap gap-2">
        <Button href="/sessions">Sessions</Button>
        <Button href="/roadmap" variant="quiet">
          Roadmap
        </Button>
      </div>
    </main>
  );
}