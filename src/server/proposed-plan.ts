import { z } from "zod";

const weekSchema = z.object({
  label: z.string().min(1),
  title: z.string().min(1),
  detail: z.string().min(1),
});

const replySchema = z.object({
  lengthWeeks: z.number().int().positive(),
  weeks: z.array(weekSchema).min(1),
});

export type ProposedWeek = z.infer<typeof weekSchema>;
export type ProposedPlan = z.infer<typeof replySchema>;

type GapText = { kind: string; name: string; detail: string };

function planPrompt(gaps: GapText[]) {
  const lines = gaps.map((gap) => `${gap.kind}: ${gap.name}. ${gap.detail}`);
  return `Turn these skill gaps into a learning plan. Return JSON only, in this shape:
{"lengthWeeks":12,"weeks":[{"label":"W1-2","title":"...","detail":"..."}]}
lengthWeeks is the total number of weeks.
Each label is a week or a week range, such as W1-2.
Return 3 to 5 weeks. The last week number must not pass lengthWeeks.

${lines.join("\n")}`;
}

export async function askForPlan(gaps: GapText[]): Promise<ProposedPlan> {
  const response = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      prompt: planPrompt(gaps),
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
  return parsed.data;
}