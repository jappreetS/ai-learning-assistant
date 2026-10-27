"use client";

import { useState } from "react";
import { Field } from "@/components/ui/Field";

const sessions = [
  {
    date: "Oct 22",
    duration: "45 min",
    stage: "Practiced",
    title: "RFC draft — cache invalidation",
    note: "Wrote the problem statement and two alternatives. Blocked on real latency numbers.",
  },
  {
    date: "Oct 20",
    duration: "90 min",
    stage: "Studied",
    title: "Critique: Remix data loading model",
    note: "Annotated tradeoffs against the Next.js App Router for multi-zone apps.",
  },
  {
    date: "Oct 18",
    duration: "60 min",
    stage: "Applied",
    title: "Performance memo rewrite",
    note: "Reframed the LCP work as a platform pattern other teams can reuse.",
  },
  {
    date: "Oct 15",
    duration: "40 min",
    stage: "Practiced",
    title: "System design prompt #2",
    note: "Designed a notification inbox for 10M users. Weak on multi-region consistency.",
  },
];

const panelClass = "rounded-xl border border-line bg-surface p-5 shadow-sm";

export function SessionsScreen() {
  const [date, setDate] = useState("2026-10-22");
  const [duration, setDuration] = useState("45 min");
  const [skill, setSkill] = useState("Architecture reviews and RFCs");
  const [stage, setStage] = useState("Practiced");
  const [note, setNote] = useState(
    "Drafted sections 1–2 of the multi-team cache invalidation RFC. Listed alternatives and failure modes.",
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
      <p className="mt-3 max-w-xl text-muted">
        A short record of what you studied, practiced, applied, or demonstrated.
      </p>
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
        <section className={panelClass}>
          <h2 className="text-base font-semibold">New session</h2>
          <div className="mt-4 flex flex-col gap-4">
            <Field label="Date" type="date" value={date} onChange={setDate} />
            <Field
              label="Duration"
              value={duration}
              onChange={setDuration}
              options={["25 min", "45 min", "90 min", "2+ hours"]}
            />
            <Field
              label="Skill"
              value={skill}
              onChange={setSkill}
              options={[
                "Frontend system design",
                "Architecture reviews and RFCs",
                "Design system governance",
                "Accessibility program leadership",
              ]}
            />
            <Field
              label="Stage"
              value={stage}
              onChange={setStage}
              options={["Studied", "Practiced", "Applied", "Demonstrated"]}
            />
            <Field label="What happened" value={note} onChange={setNote} multiline />
          </div>
        </section>
        <section className={panelClass}>
          <h2 className="text-base font-semibold">Recent sessions</h2>
          <ol className="mt-4">
            {sessions.map((session) => (
              <li
                key={session.title}
                className="border-b border-line py-3 last:border-b-0"
              >
                <p className="font-mono text-xs text-muted">
                  {session.date} · {session.duration} · {session.stage}
                </p>
                <h3 className="mt-1 text-base font-semibold">{session.title}</h3>
                <p className="mt-1 text-sm text-muted">{session.note}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}