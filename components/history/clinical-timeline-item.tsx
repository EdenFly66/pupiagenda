"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useState } from "react";
import { SessionStatusBadge } from "@/components/history/session-status-badge";
import { SessionPDFExportButton } from "@/components/pdf/session-pdf-export-button";
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
                {formattedDate}
              </h3>
              <SessionStatusBadge status={session.status} />
            </div>
            <p className="mt-2 text-sm font-medium text-brand">
              {session.patientName}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
            {session.patientId ? (
              <Link
                href={`/pacientes/${session.patientId}`}
              className="inline-flex h-10 w-full items-center justify-center rounded-2xl border border-leaf bg-white px-4 text-sm font-semibold text-leaf-foreground shadow-sm transition hover:bg-leaf-soft hover:text-leaf-strong sm:w-auto"
              >
                Ver paciente
              </Link>
            ) : null}
            <Link
              href={`/sesiones/${session.id}/editar`}
              className="inline-flex h-10 w-full items-center justify-center rounded-2xl bg-brand px-4 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover hover:text-brand-foreground active:bg-brand-active sm:w-auto"
            >
              Editar sesion
            </Link>
            <SessionPDFExportButton session={session} />
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
          <InfoBlock label="Estado emocional" value={session.emotionalState} />
          <InfoBlock label="Motivo / foco" value={session.motivo} />
        </div>

        <div className="mt-4 rounded-2xl bg-background p-4">
          <p className="text-xs font-semibold uppercase tracking-normal text-muted">
            {session.hasSessionSummary ? "Resumen de sesion" : "Contenido de sesion"}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground">
            {session.summary}
          </p>
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
          className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-2xl border border-leaf bg-white px-4 text-sm font-semibold text-leaf-foreground transition hover:bg-leaf-soft hover:text-leaf-strong sm:w-auto"
        >
          {expanded ? "Ocultar detalle" : "Ver detalle"}
        </button>
      </div>
    </article>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-rose-50/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-normal text-muted">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Detail({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-2xl bg-background p-4">
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
