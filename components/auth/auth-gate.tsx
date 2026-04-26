"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!active) {
        return;
      }

      if (!data.session) {
        router.replace("/login");
        return;
      }

      setAuthorized(true);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setAuthorized(false);
        router.replace("/login");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="rounded-3xl border border-rose-100 bg-white/90 p-6 text-sm font-medium text-muted shadow-sm">
          Verificando sesion...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
