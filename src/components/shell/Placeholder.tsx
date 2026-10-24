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
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">{description}</p>
      {next ? (
        <Link href={next.href} className="mt-6 inline-block text-sm font-medium text-rail">
          {next.label}
        </Link>
      ) : null}
    </main>
  );
}