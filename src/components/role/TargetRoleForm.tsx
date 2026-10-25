"use client";

import { useState } from "react";

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
    "mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-rail";

  return (
    <label className="block text-sm font-medium">
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

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2">
        {choices.map((item) => {
          const selected = choice === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setChoice(item.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${selected ? "bg-rail/10 text-rail" : "text-muted"
                }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {choice === "resume-jd" ? (
        <div className="mt-6 flex flex-col gap-4">
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
      ) : (
        <p className="mt-6 text-sm text-muted">These fields are next.</p>
      )}
    </div>
  );
}