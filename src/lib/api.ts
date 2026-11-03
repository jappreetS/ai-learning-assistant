export async function readJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) throw new Error("Could not load");
  return response.json();
}