"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import {
  mapClinicalSessionRow,
  type ClinicalSessionRow,
  type ClinicalTimelineSession,
} from "@/lib/clinical-session-types";
import {
  formatPatientCreatedAt,
  getPatientFullName,
  type PatientRow,
} from "@/lib/patient-types";
import { supabase } from "@/lib/supabase";

export function PatientProfileView({ patientId }: { patientId: string }) {
  const [patient, setPatient] = useState<PatientRow | null>(null);
  const [sessions, setSessions] = useState<ClinicalTimelineSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError(null);

      const [patientResult, sessionsResult] = await Promise.all([
        supabase
          .from("patients")
          .select("id, first_name, last_name, email, phone, created_at")
          .eq("id", patientId)
          .maybeSingle(),
        supabase
          .from("clinical_sessions")
          .select(
            `
              id,
              patient_id,
              session_date,
              motivo,
              desarrollo,
              observaciones,
              intervenciones,
              estado_emocional,
              tareas,
              patients (
                id,
                first_name,
                last_name
              )
            `,
          )
          .eq("patient_id", patientId)
          .order("session_date", { ascending: false }),
      ]);

      if (!active) {
        return;
      }

      if (patientResult.error) {
        setPatient(null);
        setSessions([]);
        setError(patientResult.error.message);
      } else if (sessionsResult.error) {
        setPatient(patientResult.data);
        setSessions([]);
        setError(sessionsResult.error.message);
      } else {
        setPatient(patientResult.data);
        setSessions(
          ((sessionsResult.data as ClinicalSessionRow[] | null) ?? []).map(
            mapClinicalSessionRow,
          ),
        );
      }

      setLoading(false);
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [patientId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Perfil de paciente"
          title="Cargando paciente"
          description="Consultando informacion desde Supabase."
        />
        <div className="h-64 animate-pulse rounded-3xl border border-rose-100 bg-white/70" />
      </div>
    );
  }

  if (error) {
    return (
      <PatientProfileMessage
        title="No se pudo cargar el paciente"
        description={error}
      />
    );
  }

  if (!patient) {
    return (
      <PatientProfileMessage
        title="Paciente no encontrado"
        description="No existe un registro visible con ese identificador."
      />
    );
  }

  return (
    <div className="space-y-6 bg-[radial-gradient(circle_at_top_left,#fff0f3_0,transparent_28rem)]">
      <PageHeader
        eyebrow="Perfil de paciente"
        title={getPatientFullName(patient)}
        description="Ficha basica leida desde la tabla patients en Supabase."
        action={<ProfileActions patientId={patient.id} />}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <SectionCard className="rounded-3xl border-rose-100 bg-white/90">
          <h3 className="text-base font-semibold">Datos de contacto</h3>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Detail label="Nombre" value={patient.first_name ?? "Sin dato"} />
            <Detail label="Apellido" value={patient.last_name ?? "Sin dato"} />
            <Detail label="Correo" value={patient.email ?? "Sin correo"} />
            <Detail label="Telefono" value={patient.phone ?? "Sin telefono"} />
            <Detail
              label="Fecha de creacion"
              value={formatPatientCreatedAt(patient.created_at)}
            />
          </dl>
        </SectionCard>

        <SectionCard className="rounded-3xl border-rose-100 bg-[#fffaf8]">
          <h3 className="text-base font-semibold">Resumen clinico</h3>
          <div className="mt-6 grid gap-4">
            <Detail label="Total de sesiones" value={`${sessions.length}`} />
            <Detail
              label="Ultima sesion"
              value={formatSessionDate(sessions[0]?.sessionDate ?? null)}
            />
          </div>
        </SectionCard>
      </div>

      <SectionCard className="rounded-3xl border-rose-100 bg-white/90">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold">Sesiones de la paciente</h3>
            <p className="mt-1 text-sm text-muted">
              Timeline breve con las sesiones asociadas a esta ficha.
            </p>
          </div>
        </div>

        {sessions.length > 0 ? (
          <div className="mt-6 space-y-4">
            {sessions.map((session) => (
              <PatientSessionItem key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-rose-200 bg-[#fffaf8] p-8 text-center">
            <p className="font-semibold">Sin sesiones registradas.</p>
            <p className="mt-2 text-sm text-muted">
              Crea una nueva sesion para comenzar el historial de esta paciente.
            </p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function PatientProfileMessage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Perfil de paciente"
        title={title}
        description={description}
        action={<BackButton />}
      />
    </div>
  );
}

function ProfileActions({ patientId }: { patientId: string }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        href="/pacientes"
        className="inline-flex h-11 items-center justify-center rounded-2xl border border-rose-100 bg-white px-5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-rose-50"
      >
        Volver
      </Link>
      <Link
        href={`/sesiones/nueva?patientId=${patientId}`}
        className="inline-flex h-11 items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-[#87304a] hover:text-white"
      >
        Nueva sesion
      </Link>
    </div>
  );
}

function BackButton() {
  return (
    <Link
      href="/pacientes"
      className="inline-flex h-11 items-center justify-center rounded-2xl border border-rose-100 bg-white px-5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-rose-50"
    >
      Volver
    </Link>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-rose-50/60 p-4">
      <dt className="text-xs font-semibold uppercase tracking-normal text-muted">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

function PatientSessionItem({
  session,
}: {
  session: ClinicalTimelineSession;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-3xl border border-rose-100 bg-[#fffaf8] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand">
            {formatSessionDate(session.sessionDate)}
          </p>
          <h4 className="mt-2 text-base font-semibold">{session.motivo}</h4>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="inline-flex h-10 items-center justify-center rounded-2xl bg-rose-50 px-4 text-sm font-semibold text-brand transition hover:bg-rose-100"
        >
          {expanded ? "Ocultar detalle" : "Ver detalle"}
        </button>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted">{session.summary}</p>

      {expanded ? (
        <div className="mt-5 grid gap-4 border-t border-rose-100 pt-5 lg:grid-cols-2">
          <SessionDetail title="Desarrollo" value={session.desarrollo} />
          <SessionDetail title="Intervenciones" value={session.intervenciones} />
          <SessionDetail title="Observaciones" value={session.observaciones} />
          <SessionDetail title="Tareas" value={session.tareas} />
        </div>
      ) : null}
    </article>
  );
}

function SessionDetail({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{value}</p>
    </div>
  );
}

function formatSessionDate(value: string | null) {
  if (!value) {
    return "Sin sesiones";
  }

  return format(new Date(`${value}T12:00:00`), "d 'de' MMMM yyyy", {
    locale: es,
  });
}
