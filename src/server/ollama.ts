const defaultUrl = "http://127.0.0.1:11434";

export function ollamaUrl() {
  const configured = process.env.OLLAMA_URL?.trim();
  return (configured || defaultUrl).replace(/\/$/, "");
}

export async function generate(prompt: string) {
  const response = await fetch(`${ollamaUrl()}/api/generate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      prompt,
      stream: false,
      format: "json",
    }),
  });
  if (!response.ok) {
    throw new Error("Ollama did not answer");
  }
  const body: { response?: string } = await response.json();
  return body.response ?? "";
}