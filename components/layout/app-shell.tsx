"use client";

import { CalendarHeart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { navigationItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar pathname={pathname} />
      <div className="min-h-screen lg:pl-72">
        <TopHeader />
        <main className="px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
      <MobileNavigation pathname={pathname} />
    </div>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border bg-surface lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-border px-6">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-rose-100 text-brand">
          <CalendarHeart className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-base font-semibold">PupiAgenda</p>
          <p className="text-sm text-muted">Gestion clinica</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-4 py-5" aria-label="Principal">
        {navigationItems.map((item) => (
          <NavigationLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>
      <div className="border-t border-border px-6 py-5">
        <p className="text-sm font-medium">Consulta activa</p>
        <p className="mt-1 text-sm text-muted">Base visual sin backend</p>
      </div>
    </aside>
  );
}

function TopHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted">PupiAgenda</p>
          <h1 className="truncate text-lg font-semibold text-foreground">
            Panel de trabajo
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">Equipo clinico</p>
            <p className="text-xs text-muted">Modo demo</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-2xl border border-border bg-background text-sm font-semibold">
            EC
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileNavigation({ pathname }: { pathname: string }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface px-2 pb-3 pt-2 shadow-[0_-10px_30px_rgba(159,61,90,0.12)] lg:hidden"
      aria-label="Navegacion movil"
    >
      <div className="grid grid-cols-5 gap-1">
        {navigationItems.map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-xs font-medium text-muted transition hover:bg-rose-50 hover:text-brand",
                active &&
                  "bg-brand text-brand-foreground shadow-sm hover:bg-[#87304a] hover:text-white",
              )}
            >
              <item.icon className="size-5" strokeWidth={2.2} aria-hidden="true" />
              <span className="max-w-full truncate">{item.shortLabel}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function NavigationLink({
  item,
  pathname,
}: {
  item: (typeof navigationItems)[number];
  pathname: string;
}) {
  const active = isActivePath(pathname, item.href);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-rose-50 hover:text-brand",
        active &&
          "bg-brand text-brand-foreground shadow-sm hover:bg-[#87304a] hover:text-white",
      )}
    >
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-xl bg-rose-50 text-muted transition group-hover:bg-rose-100 group-hover:text-brand",
          active &&
            "bg-white/15 text-brand-foreground group-hover:bg-white/20 group-hover:text-white",
        )}
      >
        <item.icon className="size-4" strokeWidth={2.2} aria-hidden="true" />
      </span>
      {item.label}
    </Link>
  );
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
