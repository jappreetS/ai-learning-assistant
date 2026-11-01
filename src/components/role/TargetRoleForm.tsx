"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Field } from "@/components/ui/Field";

const choices = [
  { id: "resume-jd", label: "Resume and job description" },
  { id: "jd-only", label: "Job description only" },
  { id: "written", label: "A role you write" },
] as const;

type Choice = (typeof choices)[number]["id"];

export function TargetRoleForm() {
  const jobId = useSearchParams().get("job");
  const [choice, setChoice] = useState<Choice>("resume-jd");
  const [roleTitle, setRoleTitle] = useState("");
  const [company, setCompany] = useState("");
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [onlyJobDescription, setOnlyJobDescription] = useState("");
  const [writtenTitle, setWrittenTitle] = useState("");
  const [writtenSkills, setWrittenSkills] = useState("");
  const [level, setLevel] = useState("");

  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const canSave =
    choice === "resume-jd"
      ? Boolean(roleTitle.trim() && company.trim() && resume.trim() && jobDescription.trim())
      : choice === "jd-only"
        ? Boolean(onlyJobDescription.trim())
        : Boolean(writtenTitle.trim() && writtenSkills.trim() && level);

  async function saveAndOpenGaps() {
    setSaving(true);
    setMessage("");
    const body =
      choice === "resume-jd"
        ? { source: choice, roleTitle, company, resumeExcerpt: resume, jobDescription }
        : choice === "jd-only"
          ? { source: choice, jobDescription: onlyJobDescription }
          : { source: choice, roleTitle: writtenTitle, writtenSkills, level };
    const response = await fetch("/api/v1/target-roles", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      setSaving(false);
      setMessage("Could not save the role.");
      return;
    }
    const role: { id: string } = await response.json();
    const analysis = await fetch(`/api/v1/target-roles/${role.id}/analysis`, { method: "POST" });
    setSaving(false);
    if (!analysis.ok) {
      setMessage("The model did not return skill gaps.");
      return;
    }
    router.push(jobId ? `/gaps?job=${jobId}` : "/gaps");
  }

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
            <Field
              label="Current level"
              value={level}
              onChange={setLevel}
              options={[
                { value: "", label: "Choose a level" },
                "Mid",
                "Senior",
                "Staff",
                "Principal",
              ]}
            />
          </div>
        )}
        <button
          type="button"
          onClick={saveAndOpenGaps}
          disabled={saving || !canSave}
          className="mt-6 inline-flex rounded-full bg-rail px-4 py-2 text-sm font-semibold text-surface hover:bg-raildeep disabled:cursor-not-allowed disabled:opacity-50"
        >
          Skill gaps
        </button>
        {message ? <p className="mt-4 text-sm text-muted">{message}</p> : null}
      </div>
    </div>
  );
}