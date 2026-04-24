"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useState } from "react";
import { SessionStatusBadge } from "@/components/history/session-status-badge";
import type { ClinicalSession } from "@/lib/mock-clinical-sessions";

export function ClinicalTimelineItem({
  session,
}: {
  session: ClinicalSession;
}) {
  const [expanded, setExpanded] = useState(false);
  const formattedDate = format(new Date(`${session.date}T12:00:00`), "d 'de' MMMM yyyy", {
    locale: es,
  });

  return (
    <article className="relative pl-8">
      <div className="absolute left-0 top-7 size-4 rounded-full border-4 border-white bg-brand shadow-sm shadow-rose-200" />
      <div className="rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-sm transition hover:border-rose-200 hover:shadow-md sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                {session.patientName}
              </h3>
              <SessionStatusBadge status={session.status} />
            </div>
            <p className="mt-2 text-sm font-medium text-brand">
              Sesion {session.sessionNumber} / {formattedDate}
            </p>
          </div>
          <Link
            href={`/pacientes/${session.patientId}`}
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-rose-100 bg-white px-4 text-sm font-semibold text-foreground shadow-sm transition hover:bg-rose-50"
          >
            Ver paciente
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-base font-semibold">{session.focus}</p>
          <p className="text-sm leading-6 text-muted">{session.summary}</p>
        </div>

        {expanded ? (
          <div className="mt-6 grid gap-4 border-t border-rose-100 pt-5 lg:grid-cols-2">
            <Detail title="Desarrollo de sesion" value={session.development} />
            <Detail title="Intervenciones" value={session.interventions} />
            <Detail title="Observaciones" value={session.observations} />
            <Detail title="Tareas" value={session.tasks} />
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-6 inline-flex h-10 items-center rounded-2xl bg-rose-50 px-4 text-sm font-semibold text-brand transition hover:bg-rose-100"
        >
          {expanded ? "Ocultar detalle" : "Ver detalle"}
        </button>
      </div>
    </article>
  );
}

function Detail({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-2xl bg-[#fffaf8] p-4">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-muted">{value}</p>
    </section>
  );
}
