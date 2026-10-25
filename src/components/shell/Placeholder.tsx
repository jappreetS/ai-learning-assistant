import Link from "next/link";

export function Placeholder({
  title,
  description,
  next,
}: {
  title: string;
  description: string;
  next?: { href: string; label: string };
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-3 max-w-xl text-muted">{description}</p>
      {next ? (
        <Link
          href={next.href}
          className="mt-6 inline-flex rounded-full bg-rail px-4 py-2 text-sm font-semibold text-surface hover:bg-raildeep"
        >
          {next.label}
        </Link>
      ) : null}
    </main>
  );
}