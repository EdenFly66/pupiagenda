"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import {
  clinicalSessionSelectColumns,
  mapClinicalSessionRow,
  type ClinicalSessionRow,
  type ClinicalTimelineSession,
} from "@/lib/clinical-session-types";
import { SessionStatusBadge } from "@/components/history/session-status-badge";
import {
  displayValue,
  formatPatientBirthDate,
  formatPatientCreatedAt,
  getPatientFullName,
  patientSelectColumns,
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
          .select(patientSelectColumns)
          .eq("id", patientId)
          .maybeSingle(),
        supabase
          .from("clinical_sessions")
          .select(clinicalSessionSelectColumns)
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
        description="Ficha clinica y psicosocial leida desde Supabase."
        action={<ProfileActions patientId={patient.id} />}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <SectionCard className="rounded-3xl border-rose-100 bg-white/90">
          <h3 className="text-base font-semibold">Identificacion y contacto</h3>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Detail label="Nombre" value={displayValue(patient.first_name)} />
            <Detail label="Apellido" value={displayValue(patient.last_name)} />
            <Detail label="Pronombres" value={displayValue(patient.pronouns)} />
            <Detail label="Nacimiento" value={formatPatientBirthDate(patient.birth_date)} />
            <Detail label="Genero" value={displayValue(patient.gender)} />
            <Detail label="Estado civil" value={displayValue(patient.civil_status)} />
            <Detail label="Correo" value={displayValue(patient.email)} />
            <Detail label="Telefono" value={displayValue(patient.phone)} />
            <Detail label="Direccion" value={displayValue(patient.address)} />
            <Detail label="Prevision" value={displayValue(patient.health_insurance)} />
            <Detail label="Estado" value={displayValue(patient.status)} />
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

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard className="rounded-3xl border-rose-100 bg-white/90">
          <h3 className="text-base font-semibold">Apoderado y emergencia</h3>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Detail label="Apoderado" value={displayValue(patient.guardian_name)} />
            <Detail label="Correo apoderado" value={displayValue(patient.guardian_email)} />
            <Detail label="Telefono apoderado" value={displayValue(patient.guardian_phone)} />
            <Detail label="Contacto emergencia" value={displayValue(patient.emergency_contact_name)} />
            <Detail label="Telefono emergencia" value={displayValue(patient.emergency_contact_phone)} />
            <Detail label="Horario atencion" value={displayValue(patient.appointment_schedule)} />
          </dl>
        </SectionCard>

        <SectionCard className="rounded-3xl border-rose-100 bg-[#fffaf8]">
          <h3 className="text-base font-semibold">Motivo de consulta</h3>
          <div className="mt-6 space-y-4">
            <LongDetail title="Motivo terapeuta" value={displayValue(patient.therapist_consultation_reason)} />
            <LongDetail title="Motivo consultante" value={displayValue(patient.client_consultation_reason)} />
            <LongDetail title="Objetivo co-construido" value={displayValue(patient.co_constructed_goal)} />
            <LongDetail title="Tratamiento previo" value={displayValue(patient.previous_treatment)} />
          </div>
        </SectionCard>
      </div>

      <SectionCard className="rounded-3xl border-rose-100 bg-white/90">
        <h3 className="text-base font-semibold">Area psicosocial</h3>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <LongDetail title="Composicion familiar" value={displayValue(patient.family_composition)} />
          <LongDetail title="Grupo de apoyo principal" value={displayValue(patient.primary_support_group)} />
          <LongDetail title="Entorno social" value={displayValue(patient.social_environment)} />
          <LongDetail title="Contexto educativo" value={displayValue(patient.education_context)} />
          <LongDetail title="Contexto judicial" value={displayValue(patient.judicial_context)} />
          <LongDetail title="Consumo de sustancias" value={displayValue(patient.substance_use)} />
          <LongDetail title="Historia de violencia" value={displayValue(patient.violence_history)} />
          <LongDetail title="Riesgo suicida" value={displayValue(patient.suicide_risk)} />
        </div>
      </SectionCard>

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
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h4 className="text-base font-semibold">{session.motivo}</h4>
            <SessionStatusBadge status={session.status} />
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="inline-flex h-10 items-center justify-center rounded-2xl bg-rose-50 px-4 text-sm font-semibold text-brand transition hover:bg-rose-100"
          >
            {expanded ? "Ocultar detalle" : "Ver detalle"}
          </button>
          <Link
            href={`/sesiones/${session.id}/editar`}
            className="inline-flex h-10 items-center justify-center rounded-2xl bg-brand px-4 text-sm font-semibold text-brand-foreground transition hover:bg-[#87304a] hover:text-white"
          >
            Editar sesion
          </Link>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted">{session.summary}</p>

      {expanded ? (
        <div className="mt-5 grid gap-4 border-t border-rose-100 pt-5 lg:grid-cols-2">
          <SessionDetail title="Estado emocional" value={session.emotionalState} />
          <SessionDetail title="Evaluacion por eje" value={session.axisEvaluation} />
          <SessionDetail title="Contenido" value={session.sessionContent} />
          <SessionDetail title="Hipotesis" value={session.clinicalHypothesis} />
          <SessionDetail title="Intervenciones" value={session.interventions} />
          <SessionDetail title="Progreso objetivos" value={session.objectiveProgress} />
          <SessionDetail title="Ideas clave" value={session.keyIdeas} />
          <SessionDetail title="Plan proxima sesion" value={session.nextSessionPlan} />
          <SessionDetail title="Tareas" value={session.homeworkOrTasks} />
          <SessionDetail title="Observaciones" value={session.observations} />
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

function LongDetail({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-rose-50/60 p-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
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
