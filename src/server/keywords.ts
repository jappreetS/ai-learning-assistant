const skip = new Set([
  "about",
  "the role",
  "tech stack",
  "requirements",
  "responsibilities",
  "must-haves",
  "must haves",
  "nice-to-haves",
  "nice to haves",
  "what you'll do",
  "what you'll need",
  "nice to have",
]);

const small = new Set(["and", "or", "the", "a", "an", "with", "for", "to", "of", "in", "on"]);

export function keywordsIn(jobDescription: string, resume: string) {
  const resumeFolded = resume.toLowerCase();
  const seen = new Set<string>();
  const keywords: { name: string; present: boolean }[] = [];

  for (const piece of jobDescription.split(/[\n,;()•|/]+/)) {
    const name = piece.replace(/^[\s\p{Extended_Pictographic}]+/u, "").replace(/\.+$/u, "").trim();
    const folded = name.toLowerCase();
    if (name.length < 2 || name.length > 48 || skip.has(folded) || small.has(folded) || seen.has(folded)) continue;
    if (folded.startsWith("about ") || folded.startsWith("and ") || folded.startsWith("or ")) continue;
    const words = folded.split(/\s+/);
    if (words.length > 4) continue;
    if (words.length === 1 && !/[A-Z0-9.]/.test(name)) continue;
    if (!/\p{L}/u.test(name)) continue;
    seen.add(folded);
    keywords.push({ name, present: resumeFolded.includes(folded) });
  }

  return keywords;
}