"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import { StrawberryLogo } from "@/components/brand/StrawberryLogo";
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
        <main className="px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10">
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
        <StrawberryLogo className="shrink-0" size="md" />
        <div>
          <p className="text-base font-semibold">PupiAgenda</p>
          <p className="text-sm text-muted">Agenda clinica</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-4 py-5" aria-label="Principal">
        {navigationItems.map((item) => (
          <NavigationLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>
      <div className="border-t border-border px-6 py-5">
        <LogoutButton />
      </div>
    </aside>
  );
}

function TopHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <StrawberryLogo className="shrink-0" size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted">PupiAgenda</p>
            <h1 className="truncate text-lg font-semibold text-foreground">
              Panel de trabajo
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">Equipo clinico</p>
            <p className="text-xs text-muted">Sesion activa</p>
          </div>
          <LogoutButton compact />
        </div>
      </div>
    </header>
  );
}

function MobileNavigation({ pathname }: { pathname: string }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface px-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_color-mix(in_srgb,var(--theme-primary)_18%,transparent)] lg:hidden"
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
                "flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-xs font-medium text-muted transition hover:bg-leaf-soft hover:text-leaf-strong",
                active &&
                  "bg-brand text-brand-foreground shadow-sm hover:bg-brand-hover hover:text-brand-foreground active:bg-brand-active",
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
        "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-leaf-soft hover:text-leaf-strong",
        active &&
          "bg-brand text-brand-foreground shadow-sm hover:bg-brand-hover hover:text-brand-foreground active:bg-brand-active",
      )}
    >
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-xl bg-rose-soft text-muted transition group-hover:bg-white group-hover:text-leaf-strong",
          active && "bg-transparent text-brand-foreground group-hover:text-brand-foreground",
        )}
      >
        <item.icon className="size-4" strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
