"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav } from "@/lib/nav";

function Mark() {
  return (
    <svg className="size-8 shrink-0 rounded-md" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" fill="#f7f6f3" />
      <rect x="10" y="8" width="16" height="48" fill="var(--rail)" />
      <rect x="10" y="40" width="36" height="16" fill="var(--signal)" />
      <rect x="40" y="40" width="14" height="16" fill="#3d6fe0" />
    </svg>
  );
}

function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" onClick={onNavigate} className="flex min-w-0 items-center gap-2.5">
      <Mark />
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-tight">Learning</span>
        <span className="block font-mono text-[10px] text-muted">Roadmaps</span>
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {nav.map((group, index) => (
        <nav key={group.label} className={`px-3 py-4 ${index > 0 ? "mt-2 border-t border-line" : ""}`} aria-label={group.label}>
          <p className="px-2 pb-1.5 font-mono text-[10px] tracking-[0.14em] text-faint uppercase">
            {group.label}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm ${active
                      ? "bg-rail/10 font-medium text-rail"
                      : "text-muted hover:bg-rail/5 hover:text-ink"
                      }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${active ? "bg-rail" : "bg-line"}`}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ))}
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="flex min-h-screen bg-paper text-ink">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface/70 lg:flex">
        <div className="flex h-16 items-center border-b border-line px-5">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavLinks />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-3 border-b border-line bg-surface/70 px-4 py-3 lg:hidden">
          <Brand onNavigate={close} />
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-md text-ink shadow-[inset_0_0_0_1px_var(--line)]"
            aria-expanded={open}
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true">{open ? "×" : "☰"}</span>
          </button>
        </header>

        {open ? (
          <div className="border-b border-line bg-surface lg:hidden">
            <NavLinks onNavigate={close} />
          </div>
        ) : null}

        <header className="hidden h-16 items-center justify-end gap-3 border-b border-line px-8 lg:flex">
          <span className="font-mono text-[11px] text-muted">Not signed in</span>
          <button
            type="button"
            className="rounded-md px-3 py-2 text-sm font-medium shadow-[inset_0_0_0_1px_var(--line)]"
          >
            Sign out
          </button>
        </header>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}