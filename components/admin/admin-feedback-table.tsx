"use client";

import { Inbox, ShieldCheck, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AdminFeedbackNotes } from "@/components/admin/admin-feedback-notes";
import { AdminFeedbackStatusSelect } from "@/components/admin/admin-feedback-status-select";
import { SectionCard } from "@/components/ui/section-card";
import { getAdminFeedback } from "@/lib/admin";
import {
  adminFeedbackStatusLabels,
  formatAdminFeedbackDate,
  type AdminFeedbackItem,
  type AdminFeedbackStatus,
} from "@/lib/admin-types";

export function AdminFeedbackTable() {
  const [items, setItems] = useState<AdminFeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadFeedback() {
      setLoading(true);
      setError(null);

      try {
        const feedback = await getAdminFeedback();

        if (!active) {
          return;
        }

        setItems(feedback);
      } catch {
        if (!active) {
          return;
        }

        setItems([]);
        setError("No pudimos cargar las sugerencias del panel admin.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadFeedback();

    return () => {
      active = false;
    };
  }, []);

  const refreshFeedback = useCallback(async () => {
    try {
      const feedback = await getAdminFeedback();
      setItems(feedback);
    } catch {
      throw new Error("El cambio se guardo, pero no pudimos refrescar la lista.");
    }
  }, []);

  if (loading) {
    return <AdminFeedbackLoading />;
  }

  if (error) {
    return <AdminFeedbackError message={error} />;
  }

  if (items.length === 0) {
    return <AdminFeedbackEmpty />;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-sm"
        >
          <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
            <div className="min-w-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted">{item.email}</p>
                  <h2 className="mt-1 text-lg font-semibold leading-7 text-foreground">
                    {item.title}
                  </h2>
                </div>
                <StatusPill status={item.status} />
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted">
                {item.message}
              </p>

              <dl className="mt-5 grid gap-3 border-t border-rose-100 pt-4 text-sm sm:grid-cols-3">
                <Metadata label="Categoria" value={item.category} />
                <Metadata label="Prioridad" value={item.priority} />
                <Metadata
                  label="Creada"
                  value={formatAdminFeedbackDate(item.createdAt)}
                />
              </dl>
            </div>

            <div className="space-y-4 rounded-3xl border border-rose-100 bg-background p-4">
              <AdminFeedbackStatusSelect
                key={`${item.id}-${item.status}`}
                feedbackId={item.id}
                value={item.status}
                onSaved={refreshFeedback}
              />
              <AdminFeedbackNotes
                key={`${item.id}-${item.adminNotes}`}
                feedbackId={item.id}
                value={item.adminNotes}
                onSaved={refreshFeedback}
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const label =
    adminFeedbackStatusLabels[status as AdminFeedbackStatus] ?? status;

  return (
    <span className="inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-full border border-leaf bg-leaf-soft px-3 text-xs font-semibold text-leaf-strong">
      <ShieldCheck className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

function Metadata({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-white/70 px-3 py-2">
      <dt className="text-xs font-semibold uppercase tracking-normal text-muted">
        {label}
      </dt>
      <dd className="mt-1 truncate font-medium text-foreground">{value}</dd>
    </div>
  );
}

function AdminFeedbackLoading() {
  return (
    <div className="space-y-4" aria-label="Cargando sugerencias admin">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-72 animate-pulse rounded-3xl border border-rose-100 bg-white/70"
        />
      ))}
    </div>
  );
}

function AdminFeedbackEmpty() {
  return (
    <SectionCard className="rounded-3xl border-dashed border-rose-200 bg-white/80">
      <div className="py-6 text-center">
        <Inbox className="mx-auto size-9 text-brand-active" aria-hidden="true" />
        <h2 className="mt-3 text-base font-semibold text-foreground">
          No hay sugerencias
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
          Cuando las usuarias envien sugerencias, apareceran en este panel.
        </p>
      </div>
    </SectionCard>
  );
}

function AdminFeedbackError({ message }: { message: string }) {
  return (
    <SectionCard className="rounded-3xl border-rose-200 bg-white/90">
      <div className="py-6 text-center">
        <TriangleAlert className="mx-auto size-9 text-brand-active" aria-hidden="true" />
        <h2 className="mt-3 text-base font-semibold text-foreground">
          No se pudo cargar el panel
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
          {message}
        </p>
      </div>
    </SectionCard>
  );
}
