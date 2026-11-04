export function PdfFill({
  onText,
  onMessage,
}: {
  onText: (text: string) => void;
  onMessage: (message: string) => void;
}) {
  async function read(file: File | undefined) {
    if (!file) return;
    const body = new FormData();
    body.set("file", file);
    onMessage("Reading PDF...");
    const response = await fetch("/api/v1/pdf-text", { method: "POST", body });
    const payload: { text?: string; error?: string } = await response.json();
    if (!response.ok || !payload.text) {
      onMessage(payload.error ?? "Could not read that PDF");
      return;
    }
    onText(payload.text);
    onMessage("");
  }

  return (
    <label className="mt-2 inline-flex cursor-pointer text-sm font-semibold text-rail">
      Upload PDF
      <input
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          void read(file);
        }}
      />
    </label>
  );
}