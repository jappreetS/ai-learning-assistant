"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { applicationsNav, learningNav, type NavGroup } from "@/lib/nav";

function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-rail/10"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-raildeep text-xs font-bold tracking-tight text-surface">
        CK
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-bold tracking-tight">Career Kit</span>
        <span className="block text-xs font-medium text-muted">Learning + Applications</span>
      </span>
    </Link>
  );
}

function ProductSwitch({
  isApplications,
  onNavigate,
}: {
  isApplications: boolean;
  onNavigate?: () => void;
}) {
  const item = (href: string, label: string, hint: string, active: boolean) => (
    <Link
      href={href}
      onClick={onNavigate}
      role="tab"
      aria-selected={active}
      className={`rounded-md px-2.5 py-2 text-left text-sm font-semibold ${active
        ? "bg-rail/10 text-rail shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--rail)_25%,transparent)]"
        : "text-muted hover:bg-rail/10 hover:text-ink"
        }`}
    >
      {label}
      <span className="mt-0.5 block text-[11px] font-medium text-muted">{hint}</span>
    </Link>
  );

  return (
    <div
      className="grid gap-1 rounded-[10px] bg-panel p-1 shadow-[inset_0_0_0_1px_var(--line)]"
      role="tablist"
      aria-label="Product"
    >
      {item("/", "AI Learning Assistant", "Skill gaps, roadmaps, progress", !isApplications)}
      {item("/applications", "Job Applications", "Tracker · shared plans", isApplications)}
    </div>
  );
}

function NavLinks({ group, onNavigate }: { group: NavGroup; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5" aria-label={group.label}>
      <p className="mb-1.5 flex items-center gap-2 px-2.5 pt-1">
        <span className="font-mono text-[11px] font-medium tracking-[0.16em] text-rail uppercase">
          {group.label}
        </span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
      </p>
      <ul className="flex flex-col gap-0.5">
        {group.items.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={`block rounded-md px-2.5 py-2 text-sm font-medium ${active
                  ? "bg-rail/10 text-rail shadow-[inset_3px_0_0_var(--rail)]"
                  : "text-muted hover:bg-rail/10 hover:text-ink"
                  }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isApplications = pathname === "/applications";
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="h-dvh overflow-hidden lg:grid lg:grid-cols-[240px_1fr]">
      <aside
        id="sidebar"
        className={`fixed inset-x-0 top-14 bottom-0 z-30 flex w-full flex-col gap-4 bg-surface p-4 transition-transform lg:static lg:h-dvh lg:overflow-hidden lg:inset-y-0 lg:z-auto lg:w-auto lg:translate-x-0 lg:border-r lg:border-line lg:bg-surface/70 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <Brand onNavigate={close} />
        <ProductSwitch isApplications={isApplications} onNavigate={close} />
        <div className="flex-1 overflow-y-auto">
          <NavLinks
            group={isApplications ? applicationsNav : learningNav}
            onNavigate={close}
          />
        </div>
      </aside>

      <div className="flex h-dvh min-w-0 flex-col overflow-hidden">
        <header className="shrink-0 z-10 flex h-14 items-center justify-between gap-3 border-b border-line bg-paper/90 px-5 backdrop-blur">
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="sidebar"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
          <p className="hidden min-w-0 flex-1 text-[15px] font-bold tracking-tight lg:block">
            {isApplications ? "Job Applications" : "AI Learning Assistant"}
          </p>
          <Link
            href={isApplications ? "/" : "/role"}
            onClick={close}
            className="shrink-0 rounded-full bg-rail px-3.5 py-1.5 text-[13px] font-semibold text-surface hover:bg-raildeep"
          >
            {isApplications ? "Open learning" : "Target role"}
          </Link>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}