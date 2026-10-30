"use client";

import { useEffect, useState } from "react";
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

  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      const response = await fetch("/api/v1/target-roles");
      const role: {
        source: Choice;
        roleTitle: string | null;
        company: string | null;
        resumeExcerpt: string | null;
        jobDescription: string | null;
        writtenSkills: string | null;
        level: string | null;
      } | null = await response.json();
      if (!role || ignore) return;
      setChoice(role.source);
      if (role.source === "resume-jd") {
        setRoleTitle(role.roleTitle ?? "");
        setCompany(role.company ?? "");
        setResume(role.resumeExcerpt ?? "");
        setJobDescription(role.jobDescription ?? "");
      } else if (role.source === "jd-only") {
        setOnlyJobDescription(role.jobDescription ?? "");
      } else {
        setWrittenTitle(role.roleTitle ?? "");
        setWrittenSkills(role.writtenSkills ?? "");
        setLevel(role.level ?? "Senior");
      }
    }
    void load();
    return () => {
      ignore = true;
    };
  }, []);

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
              options={["Mid", "Senior", "Staff", "Principal"]}
            />
          </div>
        )}
        <button
          type="button"
          onClick={saveAndOpenGaps}
          disabled={saving}
          className="mt-6 inline-flex rounded-full bg-rail px-4 py-2 text-sm font-semibold text-surface hover:bg-raildeep"
        >
          Skill gaps
        </button>
        {message ? <p className="mt-4 text-sm text-muted">{message}</p> : null}
      </div>
    </div>
  );
}