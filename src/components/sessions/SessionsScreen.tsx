"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

type Skill = { id: string; name: string };
type Session = {
  id: string;
  skillId: string;
  occurredOn: string;
  duration: string;
  stage: string;
  note: string;
};

const stages = ["Studied", "Practiced", "Applied", "Demonstrated"];
const panelClass = "rounded-xl border border-line bg-surface p-5 shadow-sm";

function sessionDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function SessionsScreen() {
  const [planId, setPlanId] = useState<string | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [stage, setStage] = useState("");
  const [note, setNote] = useState("");
  const [skillId, setSkillId] = useState("");
  const [message, setMessage] = useState("");


  async function load(activePlanId: string) {
    const [skillResponse, sessionResponse] = await Promise.all([
      fetch(`/api/v1/plans/${activePlanId}/skills`),
      fetch(`/api/v1/plans/${activePlanId}/sessions`),
    ]);
    const skillRows: Skill[] = await skillResponse.json();
    setSkills(skillRows);
    setSessions(await sessionResponse.json());
    setSkillId("");
  }

  useEffect(() => {
    let ignore = false;
    async function start() {
      const response = await fetch("/api/v1/plans");
      const plans: { id: string; active: boolean }[] = await response.json();
      const active = plans.find((plan) => plan.active);
      if (!active || ignore) {
        if (!ignore) setMessage("No plan is active.");
        return;
      }
      setPlanId(active.id);
      await load(active.id);
    }
    void start();
    return () => {
      ignore = true;
    };
  }, []);

  async function saveSession() {
    if (!planId || !skillId) return;
    const response = await fetch(`/api/v1/plans/${planId}/sessions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        skillId,
        occurredOn: date,
        duration,
        stage: stage.toLowerCase(),
        note,
      }),
    });
    if (!response.ok) {
      setMessage("Could not save the session.");
      return;
    }
    setMessage("");
    setNote("");
    await load(planId);
  }

  return (
    <main className="mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col px-5 py-6">
      <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
      <p className="mt-3 max-w-xl text-muted">
        A short record of what you studied, practiced, applied, or demonstrated.
      </p>
      <div className="mt-6 grid min-h-0 flex-1 items-stretch gap-6 lg:grid-cols-2">
        <section className={`${panelClass} min-h-0 overflow-y-auto`}>
          <h2 className="text-base font-semibold">New session</h2>
          <div className="mt-4 flex flex-col gap-4">
            <Field label="Date" type="date" value={date} onChange={setDate} />
            <Field
              label="Duration"
              value={duration}
              onChange={setDuration}
              options={[
                { value: "", label: "Choose a duration" },
                "25 min",
                "45 min",
                "90 min",
                "2+ hours",
              ]}
            />
            <Field
              label="Skill"
              value={skillId}
              onChange={setSkillId}
              options={skills.map((skill) => ({ value: skill.id, label: skill.name }))}
            />
            <Field label="Stage" value={stage} onChange={setStage} options={[{ value: "", label: "Choose a stage" }, ...stages]} />
            <Field label="What happened" value={note} onChange={setNote} multiline />
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={saveSession}
                disabled={!planId || !date || !duration || !skillId || !stage || !note.trim()}
              >
                Save session
              </Button>
              <Button href="/progress" variant="quiet">
                Progress
              </Button>
            </div>
          </div>
        </section>
        <section className={`${panelClass} flex min-h-0 flex-col`}>
          <h2 className="text-base font-semibold">Recent sessions</h2>
          <ol className="mt-4 min-h-0 flex-1 overflow-y-auto">
            {sessions.map((session) => {
              const skill = skills.find((item) => item.id === session.skillId);
              return (
                <li key={session.id} className="border-b border-line py-3 last:border-b-0">
                  <p className="font-mono text-xs text-muted">
                    {sessionDate(session.occurredOn)} · {session.duration} ·{" "}
                    {session.stage.charAt(0).toUpperCase() + session.stage.slice(1)}
                  </p>
                  <h3 className="mt-1 text-base font-semibold">{skill?.name ?? "Skill"}</h3>
                  <p className="mt-1 text-sm text-muted">{session.note}</p>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
      {message ? <p className="mt-6 text-sm text-muted">{message}</p> : null}
    </main>
  );
}