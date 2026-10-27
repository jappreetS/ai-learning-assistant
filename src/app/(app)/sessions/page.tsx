import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sessions" };

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

export default function SessionsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
      <p className="mt-3 max-w-xl text-muted">
        A short record of what you studied, practiced, applied, or demonstrated.
      </p>
      <ol className="mt-8 flex flex-col gap-3">
        {sessions.map((session) => (
          <li key={session.title} className="rounded-xl border border-line bg-panel p-4">
            <p className="text-sm text-muted">
              {session.date} · {session.duration} · {session.stage}
            </p>
            <h2 className="mt-1 text-base font-semibold">{session.title}</h2>
            <p className="mt-1 text-sm text-muted">{session.note}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}