"use client";

import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminFeedbackTable } from "@/components/admin/admin-feedback-table";
import { SectionCard } from "@/components/ui/section-card";
import { PageHeader } from "@/components/ui/page-header";
import { getIsAdmin } from "@/lib/admin";
import { getAuthenticatedUser } from "@/lib/auth";

type AdminState = "loading" | "allowed" | "restricted" | "error";

export default function AdminPage() {
  const [state, setState] = useState<AdminState>("loading");

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      setState("loading");

      try {
        const user = await getAuthenticatedUser();
        const isAdmin = await getIsAdmin(user.id);

        if (!active) {
          return;
        }

        setState(isAdmin ? "allowed" : "restricted");
      } catch {
        if (!active) {
          return;
        }

        setState("error");
      }
    }

    checkAdmin();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6 bg-[radial-gradient(circle_at_top_left,var(--theme-soft-bg)_0,transparent_30rem)]">
      <PageHeader
        eyebrow="Administracion"
        title="Panel admin"
        description="Revision y seguimiento de sugerencias enviadas por usuarios."
      />

      {state === "loading" ? (
        <div className="h-80 animate-pulse rounded-3xl border border-rose-100 bg-white/70" />
      ) : state === "allowed" ? (
        <AdminFeedbackTable />
      ) : (
        <RestrictedAccess error={state === "error"} />
      )}
    </div>
  );
}

function RestrictedAccess({ error }: { error: boolean }) {
  return (
    <SectionCard className="rounded-3xl border-rose-200 bg-white/90">
      <div className="py-8 text-center">
        <ShieldCheck className="mx-auto size-10 text-brand-active" aria-hidden="true" />
        <h2 className="mt-3 text-lg font-semibold text-foreground">
          Acceso restringido
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
          {error
            ? "No pudimos validar tus permisos de administracion en este momento."
            : "Esta seccion solo esta disponible para cuentas administradoras."}
        </p>
      </div>
    </SectionCard>
  );
}
