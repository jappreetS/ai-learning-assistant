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
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-ink/45 lg:hidden"
          aria-label="Close navigation"
          onClick={close}
        />
      ) : null}

      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-30 flex w-[min(280px,86vw)] flex-col gap-4 border-r border-line bg-surface/70 p-4 transition-transform lg:static lg:z-auto lg:w-auto lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
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

      <div className="flex min-h-screen min-w-0 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-line bg-paper/90 px-5 backdrop-blur">
          <button
            type="button"
            className="rounded-md border border-line px-2.5 py-1.5 text-sm font-semibold lg:hidden"
            aria-expanded={open}
            aria-controls="sidebar"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>
          <h1 className="min-w-0 flex-1 text-[15px] font-bold tracking-tight">
            {isApplications ? "Job Applications" : "AI Learning Assistant"}
          </h1>
          <Link
            href={isApplications ? "/" : "/role"}
            onClick={close}
            className="shrink-0 rounded-full bg-rail px-3.5 py-1.5 text-[13px] font-semibold text-surface hover:bg-raildeep"
          >
            {isApplications ? "Open learning" : "Target role"}
          </Link>
        </header>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}