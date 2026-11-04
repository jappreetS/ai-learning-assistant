import { extractText, getDocumentProxy } from "unpdf";

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  const isPdf =
    file instanceof File &&
    (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"));
  if (!isPdf) {
    return Response.json({ error: "Choose a PDF" }, { status: 400 });
  }

  const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
  const { text } = await extractText(pdf, { mergePages: true });
  const value = (Array.isArray(text) ? text.join("\n") : text).trim();
  if (!value) {
    return Response.json({ error: "This PDF has no text" }, { status: 422 });
  }
  return Response.json({ text: value });
}