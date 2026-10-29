import { z } from "zod";

const gapSchema = z.object({
  kind: z.enum(["match", "gap", "proof"]),
  name: z.string().min(1),
  detail: z.string().min(1),
});

const replySchema = z.object({
  gaps: z.array(gapSchema).min(1),
});

export type SkillGapDraft = z.infer<typeof gapSchema>;

type RoleText = {
  roleTitle: string | null;
  company: string | null;
  level: string | null;
  resumeExcerpt: string | null;
  jobDescription: string | null;
  writtenSkills: string | null;
};

function rolePrompt(role: RoleText) {
  const lines = [
    role.roleTitle && `Role: ${role.roleTitle}`,
    role.company && `Company: ${role.company}`,
    role.level && `Level: ${role.level}`,
    role.resumeExcerpt && `Resume: ${role.resumeExcerpt}`,
    role.jobDescription && `Job description: ${role.jobDescription}`,
    role.writtenSkills && `Skills the role needs: ${role.writtenSkills}`,
  ].filter(Boolean);

  return `Compare the person with this target role. Return JSON only, in this shape:
{"gaps":[{"kind":"match","name":"...","detail":"..."}]}
kind is match, gap, or proof.
match means the person already shows the skill.
gap means the role needs it and the person does not show it.
proof means the skill may be present but there is no evidence yet.
Return 3 to 6 items.

${lines.join("\n")}`;
}

export async function askForSkillGaps(role: RoleText): Promise<SkillGapDraft[]> {
  const response = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      prompt: rolePrompt(role),
      stream: false,
      format: "json",
    }),
  });
  if (!response.ok) {
    throw new Error("Ollama did not answer");
  }

  const body: { response?: string } = await response.json();
  const parsed = replySchema.safeParse(JSON.parse(body.response ?? ""));
  if (!parsed.success) {
    throw new Error("The model reply was not usable");
  }
  return parsed.data.gaps;
}