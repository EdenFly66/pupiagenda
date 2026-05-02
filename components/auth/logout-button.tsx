"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      await supabase.auth.signOut({ scope: "local" });
    } finally {
      router.replace("/login");
      router.refresh();
      window.location.replace("/login");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-leaf bg-white px-4 text-sm font-semibold text-leaf-foreground shadow-sm transition hover:bg-leaf-soft hover:text-leaf-strong disabled:cursor-not-allowed disabled:bg-background disabled:text-muted"
      title="Cerrar sesion"
    >
      <LogOut className="size-4" aria-hidden="true" />
      {loading ? "Cerrando..." : "Cerrar sesion"}
    </button>
  );
}
