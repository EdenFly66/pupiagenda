"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={
        compact
          ? "inline-flex size-10 items-center justify-center rounded-2xl border border-border bg-background text-muted transition hover:bg-leaf-soft hover:text-leaf-strong disabled:cursor-not-allowed disabled:text-muted"
          : "inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-leaf bg-white px-4 text-sm font-semibold text-leaf-foreground shadow-sm transition hover:bg-leaf-soft hover:text-leaf-strong disabled:cursor-not-allowed disabled:bg-background disabled:text-muted"
      }
      title="Cerrar sesion"
    >
      <LogOut className="size-4" aria-hidden="true" />
      {compact ? null : loading ? "Cerrando..." : "Cerrar sesion"}
    </button>
  );
}
