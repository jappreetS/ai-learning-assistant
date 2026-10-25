"use client";

import { useState } from "react";
import Link from "next/link";

const choices = [
  { id: "resume-jd", label: "Resume and job description" },
  { id: "jd-only", label: "Job description only" },
  { id: "written", label: "A role you write" },
] as const;

type Choice = (typeof choices)[number]["id"];

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  const className =
    "mt-1.5 w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-rail focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--rail)_12%,transparent)]";

  return (
    <label className="block text-sm font-semibold">
      {label}
      {multiline ? (
        <textarea
          className={`${className} min-h-32`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className={className}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

export function TargetRoleForm() {
  const [choice, setChoice] = useState<Choice>("resume-jd");
  const [roleTitle, setRoleTitle] = useState("Staff Frontend Engineer");
  const [company, setCompany] = useState(
    "Northwind Labs — Staff Frontend Engineer (Remote)",
  );
  const [resume, setResume] = useState("Senior Frontend Engineer · 8 years");
  const [jobDescription, setJobDescription] = useState(
    "We're hiring a Staff Frontend Engineer.",
  );
  const [onlyJobDescription, setOnlyJobDescription] = useState(
    "Senior Full-Stack Engineer — payments platform. Required: Node.js, PostgreSQL, React.",
  );
  const [writtenTitle, setWrittenTitle] = useState("Staff Frontend Engineer");
  const [writtenSkills, setWrittenSkills] = useState(
    "System design for frontend platforms\nDesign system governance\nWeb performance",
  );
  const [level, setLevel] = useState("Senior");

  return (
    <div className="mt-8">
      <div className="flex w-fit max-w-full flex-wrap gap-1 rounded-full border border-line bg-panel p-1">
        {choices.map((item) => {
          const selected = choice === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setChoice(item.id)}
              className={`rounded-full px-3.5 py-2 text-sm font-semibold ${selected ? "bg-surface text-raildeep shadow-sm" : "text-muted"
                }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="mt-4 rounded-xl border border-line bg-surface p-5 shadow-sm">
        {choice === "resume-jd" ? (
          <div className="flex flex-col gap-4">
            <Field label="Role title" value={roleTitle} onChange={setRoleTitle} />
            <Field label="Company" value={company} onChange={setCompany} />
            <Field label="Resume excerpt" value={resume} onChange={setResume} multiline />
            <Field
              label="Job description"
              value={jobDescription}
              onChange={setJobDescription}
              multiline
            />
          </div>
        ) : choice === "jd-only" ? (
          <div>
            <Field
              label="Job description"
              value={onlyJobDescription}
              onChange={setOnlyJobDescription}
              multiline
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <Field label="Role title" value={writtenTitle} onChange={setWrittenTitle} />
            <Field
              label="Skills this role needs"
              value={writtenSkills}
              onChange={setWrittenSkills}
              multiline
            />
            <label className="block text-sm font-semibold">
              Current level
              <select
                className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-rail focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--rail)_12%,transparent)]"
                value={level}
                onChange={(event) => setLevel(event.target.value)}
              >
                <option>Mid</option>
                <option>Senior</option>
                <option>Staff</option>
                <option>Principal</option>
              </select>
            </label>
          </div>
        )}
        <Link
          href="/gaps"
          className="mt-6 inline-flex rounded-full bg-rail px-4 py-2 text-sm font-semibold text-surface hover:bg-raildeep"
        >
          Skill gaps
        </Link>
      </div>
    </div>
  );
}