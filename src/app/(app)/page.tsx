import { Placeholder } from "@/components/shell/Placeholder";
import Link from "next/link";

const steps = [
  {
    title: "Target role",
    detail: "A resume and a job description, a job description only, or a role you write.",
  },
  {
    title: "Skill gaps",
    detail: "Matches, gaps, and skills that still need proof.",
  },
  {
    title: "Review plan",
    detail: "A plan you edit and approve before it becomes the roadmap.",
  },
  {
    title: "Job Applications",
    detail: "The same gaps and plan, linked to a role you are applying for.",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-3xl flex-col justify-center px-5 py-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          AI Learning Assistant
        </h1>
        <p className="mt-4 text-xl font-medium tracking-tight">
          Close skill gaps for the roles you are applying to.
        </p>
        <p className="mt-3 max-w-xl text-muted">
          Describe a target role, approve a plan, and record sessions. Job
          Applications uses the same gaps and the same plan.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/role"
            className="inline-flex rounded-full bg-rail px-4 py-2.5 text-sm font-semibold text-surface hover:bg-raildeep"
          >
            Target role
          </Link>
          <Link
            href="/applications"
            className="inline-flex rounded-full bg-surface px-4 py-2.5 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--line)] hover:text-rail"
          >
            Job Applications
          </Link>
        </div>
      </section>
      <section className="border-t border-line">
        <div className="mx-auto w-full max-w-5xl px-5 py-12">
          <h2 className="text-2xl font-bold tracking-tight">
            From a role to a plan you approve
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-xl border border-line bg-surface p-4"
              >
                <p className="font-mono text-[11px] font-medium tracking-[0.14em] text-rail uppercase">
                  {index + 1}
                </p>
                <p className="mt-2 font-semibold">{step.title}</p>
                <p className="mt-1 text-sm text-muted">{step.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}