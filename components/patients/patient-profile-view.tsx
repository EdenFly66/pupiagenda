"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { SessionStatusBadge } from "@/components/history/session-status-badge";
import { PatientHistoryPDFExportButton } from "@/components/pdf/patient-history-pdf-export-button";
import { SessionPDFExportButton } from "@/components/pdf/session-pdf-export-button";
import { PatientDocumentsSection } from "@/components/patients/patient-documents-section";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import {
  clinicalSessionSelectColumns,
  mapClinicalSessionRow,
  type ClinicalSessionRow,
  type ClinicalTimelineSession,
} from "@/lib/clinical-session-types";
import {
  formatPatientBirthDate,
  formatPatientCreatedAt,
  getPatientFullName,
  patientSelectColumns,
  type PatientRow,
} from "@/lib/patient-types";
import { getAuthenticatedUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const recentSessionsLimit = 5;

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

      const user = await getAuthenticatedUser();
      const [patientResult, sessionsResult] = await Promise.all([
        supabase
          .from("patients")
          .select(patientSelectColumns)
          .eq("id", patientId)
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("clinical_sessions")
          .select(clinicalSessionSelectColumns)
          .eq("patient_id", patientId)
          .eq("user_id", user.id)
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
          description="Preparando la ficha clinica."
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

  const recentSessions = sessions.slice(0, recentSessionsLimit);
  const lastSession = sessions[0] ?? null;
  const age = getPatientAge(patient.birth_date);

  return (
    <div className="space-y-6 bg-[radial-gradient(circle_at_top_left,var(--theme-soft-bg)_0,transparent_28rem)]">
      <PageHeader
        eyebrow="Perfil de paciente"
        title={getPatientFullName(patient)}
        description="Vista clinica organizada para revision rapida y seguimiento."
        action={<ProfileActions patient={patient} sessions={sessions} />}
      />

      <SummaryPanel
        age={age}
        lastSession={lastSession}
        patient={patient}
        sessionsCount={sessions.length}
      />

      <ClinicalAlerts patient={patient} />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionBlock title="Identificacion">
          <DetailGrid>
            <Detail label="Nombre" value={profileValue(patient.first_name)} />
            <Detail label="Apellido" value={profileValue(patient.last_name)} />
            <Detail label="Pronombres" value={profileValue(patient.pronouns)} />
            <Detail label="Edad" value={age ? `${age} anos` : "No registrado"} />
            <Detail
              label="Nacimiento"
              value={formatNullableBirthDate(patient.birth_date)}
            />
            <Detail label="Genero" value={profileValue(patient.gender)} />
            <Detail
              label="Estado civil"
              value={profileValue(patient.civil_status)}
            />
            <Detail
              label="Fecha de creacion"
              value={formatPatientCreatedAt(patient.created_at)}
            />
          </DetailGrid>
        </SectionBlock>

        <SectionBlock title="Contacto" tone="warm">
          <DetailGrid>
            <Detail label="Correo" value={profileValue(patient.email)} />
            <Detail label="Telefono" value={profileValue(patient.phone)} />
            <Detail label="Direccion" value={profileValue(patient.address)} />
            <Detail
              label="Prevision"
              value={profileValue(patient.health_insurance)}
            />
            <Detail
              label="Horario de atencion"
              value={formatAppointmentSchedule(patient.appointment_schedule)}
            />
            <Detail
              label="Contacto emergencia"
              value={profileValue(patient.emergency_contact_name)}
            />
            <Detail
              label="Telefono emergencia"
              value={profileValue(patient.emergency_contact_phone)}
            />
          </DetailGrid>
        </SectionBlock>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <SectionBlock title="Apoderado">
          <DetailGrid>
            <Detail label="Nombre" value={profileValue(patient.guardian_name)} />
            <Detail
              label="Correo"
              value={profileValue(patient.guardian_email)}
            />
            <Detail
              label="Telefono"
              value={profileValue(patient.guardian_phone)}
            />
          </DetailGrid>
        </SectionBlock>

        <SectionBlock title="Motivo de consulta" tone="warm">
          <div className="grid gap-4">
            <LongDetail
              title="Motivo terapeuta"
              value={profileValue(patient.therapist_consultation_reason)}
            />
            <LongDetail
              title="Motivo consultante"
              value={profileValue(patient.client_consultation_reason)}
            />
            <LongDetail
              title="Objetivo co-construido"
              value={profileValue(patient.co_constructed_goal)}
              highlight
            />
            <LongDetail
              title="Tratamiento previo"
              value={profileValue(patient.previous_treatment)}
            />
          </div>
        </SectionBlock>
      </div>

      <SectionBlock title="Area psicosocial">
        <div className="grid gap-4 lg:grid-cols-2">
          <LongDetail
            title="Composicion familiar"
            value={profileValue(patient.family_composition)}
          />
          <LongDetail
            title="Grupo de apoyo principal"
            value={profileValue(patient.primary_support_group)}
          />
          <LongDetail
            title="Entorno social"
            value={profileValue(patient.social_environment)}
          />
          <LongDetail
            title="Contexto educativo"
            value={profileValue(patient.education_context)}
          />
          <LongDetail
            title="Contexto judicial"
            value={profileValue(patient.judicial_context)}
          />
          <LongDetail
            title="Consumo de sustancias"
            value={profileValue(patient.substance_use)}
          />
          <LongDetail
            title="Historia de violencia"
            value={profileValue(patient.violence_history)}
          />
          <LongDetail
            title="Riesgo suicida"
            value={profileValue(patient.suicide_risk)}
          />
        </div>
      </SectionBlock>

      <PatientDocumentsSection patientId={patient.id} />

      <RecentSessionsSection
        patientId={patient.id}
        recentSessions={recentSessions}
        sessionsCount={sessions.length}
      />
    </div>
  );
}

function SummaryPanel({
  age,
  lastSession,
  patient,
  sessionsCount,
}: {
  age: number | null;
  lastSession: ClinicalTimelineSession | null;
  patient: PatientRow;
  sessionsCount: number;
}) {
  return (
    <section className="rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold text-foreground">
              {getPatientFullName(patient)}
            </h3>
            <PatientStatusPill status={patient.status} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted">
            <SummaryChip label="Edad" value={age ? `${age} anos` : "No registrado"} />
            <SummaryChip
              label="Pronombres"
              value={profileValue(patient.pronouns)}
            />
            <SummaryChip
              label="Ultima sesion"
              value={formatSessionDate(lastSession?.sessionDate ?? null)}
            />
            <SummaryChip label="Total sesiones" value={`${sessionsCount}`} />
          </div>
        </div>

        <div className="rounded-3xl border border-rose-100 bg-background p-4 lg:max-w-md">
          <p className="text-xs font-semibold uppercase tracking-normal text-brand">
            Objetivo co-construido
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground">
            {profileValue(patient.co_constructed_goal)}
          </p>
        </div>
      </div>
    </section>
  );
}

function ClinicalAlerts({ patient }: { patient: PatientRow }) {
  const alerts = useMemo(
    () =>
      [
        { label: "Riesgo suicida", value: patient.suicide_risk },
        { label: "Historia de violencia", value: patient.violence_history },
        { label: "Contexto judicial", value: patient.judicial_context },
      ].filter((alert) => hasValue(alert.value)),
    [patient.judicial_context, patient.suicide_risk, patient.violence_history],
  );

  if (alerts.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-3 md:grid-cols-3">
      {alerts.map((alert) => (
        <div
          key={alert.label}
          className="rounded-3xl border border-rose-200 bg-rose-50/80 p-4 shadow-sm"
        >
          <p className="text-sm font-semibold text-rose-950">{alert.label}</p>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-rose-900">
            {profileValue(alert.value)}
          </p>
        </div>
      ))}
    </section>
  );
}

function RecentSessionsSection({
  patientId,
  recentSessions,
  sessionsCount,
}: {
  patientId: string;
  recentSessions: ClinicalTimelineSession[];
  sessionsCount: number;
}) {
  return (
    <SectionBlock title="Sesiones recientes" tone="warm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted">
          Ultimas {Math.min(sessionsCount, recentSessionsLimit)} sesiones para
          revisar continuidad clinica sin salir del perfil.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link
            href={`/sesiones/nueva?patientId=${patientId}`}
            className="inline-flex h-10 w-full items-center justify-center rounded-2xl bg-brand px-4 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover hover:text-brand-foreground active:bg-brand-active sm:w-auto"
          >
            Nueva sesion
          </Link>
          <Link
            href={`/historial?patientId=${patientId}`}
            className="inline-flex h-10 w-full items-center justify-center rounded-2xl border border-leaf bg-white px-4 text-sm font-semibold text-leaf-foreground shadow-sm transition hover:bg-leaf-soft hover:text-leaf-strong sm:w-auto"
          >
            Ver historial completo
          </Link>
        </div>
      </div>

      {recentSessions.length > 0 ? (
        <div className="mt-6 space-y-4">
          {recentSessions.map((session) => (
            <PatientSessionItem key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-rose-200 bg-white/70 p-8 text-center">
          <p className="font-semibold">Sin sesiones registradas.</p>
          <p className="mt-2 text-sm text-muted">
            Crea una nueva sesion para comenzar el historial de esta paciente.
          </p>
        </div>
      )}
    </SectionBlock>
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

function ProfileActions({
  patient,
  sessions,
}: {
  patient: PatientRow;
  sessions: ClinicalTimelineSession[];
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Link
        href="/pacientes"
        className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-leaf bg-white px-5 text-sm font-semibold text-leaf-foreground shadow-sm transition hover:bg-leaf-soft hover:text-leaf-strong sm:w-auto"
      >
        Volver
      </Link>
      <Link
        href={`/pacientes/${patient.id}/editar`}
        className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-leaf bg-white px-5 text-sm font-semibold text-leaf-foreground shadow-sm transition hover:bg-leaf-soft hover:text-leaf-strong sm:w-auto"
      >
        Editar paciente
      </Link>
      <PatientHistoryPDFExportButton patient={patient} sessions={sessions} />
      <Link
        href={`/sesiones/nueva?patientId=${patient.id}`}
        className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover hover:text-brand-foreground active:bg-brand-active sm:w-auto"
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
      className="inline-flex h-11 items-center justify-center rounded-2xl border border-leaf bg-white px-5 text-sm font-semibold text-leaf-foreground shadow-sm transition hover:bg-leaf-soft hover:text-leaf-strong"
    >
      Volver
    </Link>
  );
}

function SectionBlock({
  children,
  title,
  tone = "plain",
}: {
  children: ReactNode;
  title: string;
  tone?: "plain" | "warm";
}) {
  return (
    <SectionCard
      className={`rounded-3xl border-rose-100 ${
        tone === "warm" ? "bg-background" : "bg-white/90"
      }`}
    >
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <div className="mt-5">{children}</div>
    </SectionCard>
  );
}

function DetailGrid({ children }: { children: ReactNode }) {
  return <dl className="grid gap-3 sm:grid-cols-2">{children}</dl>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-rose-soft p-4">
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
    <article className="rounded-3xl border border-rose-100 bg-white/85 p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand">
            {formatSessionDate(session.sessionDate)}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h4 className="text-base font-semibold">{session.motivo}</h4>
            <SessionStatusBadge status={session.status} />
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="inline-flex h-10 w-full items-center justify-center rounded-2xl border border-leaf bg-white px-4 text-sm font-semibold text-leaf-foreground transition hover:bg-leaf-soft hover:text-leaf-strong sm:w-auto"
          >
            {expanded ? "Ocultar detalle" : "Ver detalle"}
          </button>
          <Link
            href={`/sesiones/${session.id}/editar`}
            className="inline-flex h-10 w-full items-center justify-center rounded-2xl bg-brand px-4 text-sm font-semibold text-brand-foreground transition hover:bg-brand-hover hover:text-brand-foreground active:bg-brand-active sm:w-auto"
          >
            Editar sesion
          </Link>
          <SessionPDFExportButton session={session} />
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
    <div className="rounded-2xl bg-background p-4">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{value}</p>
    </div>
  );
}

function LongDetail({
  highlight = false,
  title,
  value,
}: {
  highlight?: boolean;
  title: string;
  value: string;
}) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        highlight
          ? "border border-rose-100 bg-white shadow-sm"
          : "bg-rose-soft"
      }`}
    >
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{value}</p>
    </div>
  );
}

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-rose-100 bg-rose-50/70 px-3 py-1">
      <span className="font-semibold text-foreground">{label}:</span>
      <span className="ml-1">{value}</span>
    </span>
  );
}

function PatientStatusPill({ status }: { status: string | null }) {
  const normalizedStatus = status?.trim() || "not_registered";
  const label = patientStatusLabels[normalizedStatus] ?? profileValue(status);

  return (
    <span className="inline-flex rounded-full border border-leaf bg-leaf-soft px-3 py-1 text-xs font-semibold text-leaf-strong">
      {label}
    </span>
  );
}

function profileValue(value: string | null | undefined) {
  return value?.trim() || "No registrado";
}

function formatAppointmentSchedule(value: string | null | undefined) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return "No registrado";
  }

  const time = /^(\d{2}):(\d{2})(?::\d{2})?$/.exec(trimmedValue);

  if (!time) {
    return trimmedValue;
  }

  return `${time[1]}:${time[2]} hrs`;
}

function hasValue(value: string | null | undefined) {
  return Boolean(value?.trim());
}

function formatNullableBirthDate(value: string | null) {
  return value ? formatPatientBirthDate(value) : "No registrado";
}

function getPatientAge(value: string | null) {
  if (!value) {
    return null;
  }

  const birthDate = new Date(`${value}T12:00:00`);
  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function formatSessionDate(value: string | null) {
  if (!value) {
    return "No registrado";
  }

  return format(new Date(`${value}T12:00:00`), "d 'de' MMMM yyyy", {
    locale: es,
  });
}

const patientStatusLabels: Record<string, string> = {
  active: "Activa",
  evaluation: "En evaluacion",
  inactive: "Inactiva",
  paused: "Pausada",
  discharged: "Alta",
  not_registered: "No registrado",
};
