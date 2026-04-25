"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useState } from "react";
import { SessionStatusBadge } from "@/components/history/session-status-badge";
import type { ClinicalTimelineSession } from "@/lib/clinical-session-types";

export function ClinicalTimelineItem({
  session,
}: {
  session: ClinicalTimelineSession;
}) {
  const [expanded, setExpanded] = useState(false);
  const formattedDate = formatSessionDate(session.sessionDate);

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
              {formattedDate}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {session.patientId ? (
              <Link
                href={`/pacientes/${session.patientId}`}
                className="inline-flex h-10 items-center justify-center rounded-2xl border border-rose-100 bg-white px-4 text-sm font-semibold text-foreground shadow-sm transition hover:bg-rose-50"
              >
                Ver paciente
              </Link>
            ) : null}
            <Link
              href={`/sesiones/${session.id}/editar`}
              className="inline-flex h-10 items-center justify-center rounded-2xl bg-brand px-4 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-[#87304a] hover:text-white"
            >
              Editar sesion
            </Link>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-base font-semibold">{session.motivo}</p>
          <p className="text-sm leading-6 text-muted">{session.summary}</p>
        </div>

        {expanded ? (
          <div className="mt-6 grid gap-4 border-t border-rose-100 pt-5 lg:grid-cols-2">
            <Detail title="Estado emocional" value={session.emotionalState} />
            <Detail title="Evaluacion por eje" value={session.axisEvaluation} />
            <Detail title="Contenido de sesion" value={session.sessionContent} />
            <Detail title="Hipotesis clinica" value={session.clinicalHypothesis} />
            <Detail title="Intervenciones" value={session.interventions} />
            <Detail title="Progreso de objetivos" value={session.objectiveProgress} />
            <Detail title="Ideas clave" value={session.keyIdeas} />
            <Detail title="Plan proxima sesion" value={session.nextSessionPlan} />
            <Detail title="Tareas" value={session.homeworkOrTasks} />
            <Detail title="Observaciones" value={session.observations} />
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

function formatSessionDate(value: string | null) {
  if (!value) {
    return "Sin fecha";
  }

  return format(new Date(`${value}T12:00:00`), "d 'de' MMMM yyyy", {
    locale: es,
  });
}
