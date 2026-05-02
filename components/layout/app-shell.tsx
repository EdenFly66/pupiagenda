"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import { AppLogo } from "@/components/brand/AppLogo";
import { getIsAdmin } from "@/lib/admin";
import { supabase } from "@/lib/supabase";
import {
  adminNavigationItem,
  adminNavigationItems,
  navigationItems,
} from "@/lib/navigation";
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
        <main className="px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const visibleNavigationItems = useMemo(
    () => (isAdmin ? adminNavigationItems : navigationItems),
    [isAdmin],
  );

  useEffect(() => {
    let active = true;

    async function loadAdminState() {
      const { data } = await supabase.auth.getUser();

      if (!active || !data.user) {
        if (active) {
          setIsAdmin(false);
        }
        return;
      }

      const admin = await getIsAdmin(data.user.id);

      if (active) {
        setIsAdmin(admin);
      }
    }

    loadAdminState();

    return () => {
      active = false;
    };
  }, []);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border bg-surface lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-border px-6">
        <AppLogo className="shrink-0" size={85} preload />
        <div>
          <p className="text-base font-semibold">PupiAgenda</p>
          <p className="text-sm text-muted">Agenda clinica</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-4 py-5" aria-label="Principal">
        {isAdmin === null ? (
          <NavigationLoading />
        ) : (
          visibleNavigationItems.map((item) => (
            <NavigationLink key={item.href} item={item} pathname={pathname} />
          ))
        )}
      </nav>
      <div className="border-t border-border px-6 py-5">
        <LogoutButton />
      </div>
    </aside>
  );
}

function NavigationLoading() {
  return (
    <div className="space-y-2" aria-label="Cargando navegacion">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-12 animate-pulse rounded-2xl bg-rose-soft"
        />
      ))}
    </div>
  );
}

function NavigationLink({
  item,
  pathname,
}: {
  item: (typeof navigationItems)[number] | typeof adminNavigationItem;
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
          "!bg-brand !text-brand-foreground shadow-sm hover:!bg-brand-hover hover:!text-brand-foreground active:!bg-brand-active",
      )}
    >
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-xl bg-rose-soft text-muted transition group-hover:bg-white group-hover:text-leaf-strong",
          active &&
            "!bg-transparent !text-brand-foreground group-hover:!text-brand-foreground",
        )}
      >
        <item.icon
          className={cn("size-4", active && "!text-brand-foreground")}
          strokeWidth={2.2}
          aria-hidden="true"
        />
      </span>
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
