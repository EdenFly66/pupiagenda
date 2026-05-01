"use client";

import {
  CalendarPlus,
  ClipboardList,
  History,
  LayoutDashboard,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SessionStatusBadge } from "@/components/history/session-status-badge";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { StatCard } from "@/components/ui/stat-card";
import {
  clinicalSessionSelectColumns,
  mapClinicalSessionRow,
  type ClinicalSessionRow,
  type ClinicalTimelineSession,
} from "@/lib/clinical-session-types";
import {
  formatPatientCreatedAt,
  getPatientFullName,
  patientSelectColumns,
  type PatientRow,
} from "@/lib/patient-types";
import { getAuthenticatedUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

type DashboardStats = {
  activePatients: number;
  totalSessions: number;
  draftSessions: number;
  uploadedDocuments: number;
};

type DashboardData = {
  stats: DashboardStats;
  recentSessions: ClinicalTimelineSession[];
  recentPatients: PatientRow[];
  pendingDrafts: ClinicalTimelineSession[];
};

const emptyStats: DashboardStats = {
  activePatients: 0,
  totalSessions: 0,
  draftSessions: 0,
  uploadedDocuments: 0,
};

export function DashboardView() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError(null);

      try {
        const user = await getAuthenticatedUser();

        const [
          activePatientsResult,
          totalSessionsResult,
          draftSessionsResult,
          documentsResult,
          recentSessionsResult,
          recentPatientsResult,
          pendingDraftsResult,
        ] = await Promise.all([
          supabase
            .from("patients")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("status", "active"),
          supabase
            .from("clinical_sessions")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id),
          supabase
            .from("clinical_sessions")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("status", "draft"),
          supabase
            .from("patient_documents")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id),
          supabase
            .from("clinical_sessions")
            .select(clinicalSessionSelectColumns)
            .eq("user_id", user.id)
            .order("session_date", { ascending: false })
            .limit(5),
          supabase
            .from("patients")
            .select(patientSelectColumns)
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("clinical_sessions")
            .select(clinicalSessionSelectColumns)
            .eq("user_id", user.id)
            .eq("status", "draft")
            .order("session_date", { ascending: false })
            .limit(6),
        ]);

        const firstError =
          activePatientsResult.error ??
          totalSessionsResult.error ??
          draftSessionsResult.error ??
          documentsResult.error ??
          recentSessionsResult.error ??
          recentPatientsResult.error ??
          pendingDraftsResult.error;

        if (firstError) {
          throw firstError;
        }

        if (!active) {
          return;
        }

        setData({
          stats: {
            activePatients: activePatientsResult.count ?? 0,
            totalSessions: totalSessionsResult.count ?? 0,
            draftSessions: draftSessionsResult.count ?? 0,
            uploadedDocuments: documentsResult.count ?? 0,
          },
          recentSessions: ((recentSessionsResult.data as ClinicalSessionRow[] | null) ?? [])
            .map(mapClinicalSessionRow),
          recentPatients: (recentPatientsResult.data as PatientRow[] | null) ?? [],
          pendingDrafts: ((pendingDraftsResult.data as ClinicalSessionRow[] | null) ?? [])
            .map(mapClinicalSessionRow),
        });
      } catch (loadError) {
        if (!active) {
          return;
        }

        setData(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "No se pudo cargar el dashboard.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <DashboardLoading />;
  }

  if (error) {
    return (
      <DashboardShell>
        <SectionCard className="rounded-3xl border-rose-100 bg-white/90">
          <EmptyState
            title="No se pudo cargar el dashboard"
            description={error}
          />
        </SectionCard>
      </DashboardShell>
    );
  }

  const dashboardData = data ?? {
    stats: emptyStats,
    recentSessions: [],
    recentPatients: [],
    pendingDrafts: [],
  };

  return (
    <DashboardShell>
      <StatsGrid stats={dashboardData.stats} />

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <RecentActivity
          patients={dashboardData.recentPatients}
          sessions={dashboardData.recentSessions}
        />
        <PendingDrafts drafts={dashboardData.pendingDrafts} />
      </div>

      <QuickAccess />
    </DashboardShell>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6 bg-[radial-gradient(circle_at_top_left,var(--theme-soft-bg)_0,transparent_28rem)]">
      <PageHeader
        eyebrow="Resumen clinico"
        title="Dashboard"
        description="Estado del dia, pendientes y accesos rapidos para continuar el trabajo clinico."
        action={
          <Link
            href="/sesiones/nueva"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover hover:text-brand-foreground active:bg-brand-active sm:w-auto"
          >
            <CalendarPlus className="size-4" aria-hidden="true" />
            Nueva sesion
          </Link>
        }
      />
      {children}
    </div>
  );
}

function DashboardLoading() {
  return (
    <DashboardShell>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-3xl border border-rose-100 bg-white/70"
          />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="h-96 animate-pulse rounded-3xl border border-rose-100 bg-white/70" />
        <div className="h-96 animate-pulse rounded-3xl border border-rose-100 bg-white/70" />
      </div>
    </DashboardShell>
  );
}

function StatsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Pacientes activos"
        value={`${stats.activePatients}`}
        helper="Fichas actualmente en seguimiento."
      />
      <StatCard
        label="Sesiones totales"
        value={`${stats.totalSessions}`}
        helper="Registros clinicos guardados."
      />
      <StatCard
        label="Borradores pendientes"
        value={`${stats.draftSessions}`}
        helper="Sesiones que requieren revision."
      />
      <StatCard
        label="Documentos subidos"
        value={`${stats.uploadedDocuments}`}
        helper="Adjuntos disponibles en fichas."
      />
    </div>
  );
}

function RecentActivity({
  patients,
  sessions,
}: {
  patients: PatientRow[];
  sessions: ClinicalTimelineSession[];
}) {
  const hasActivity = sessions.length > 0 || patients.length > 0;

  return (
    <SectionCard className="rounded-3xl border-rose-100 bg-white/90">
      <SectionHeading
        title="Actividad reciente"
        description="Ultimos registros para retomar contexto rapidamente."
      />

      {!hasActivity ? (
        <EmptyState
          title="Aun no hay actividad"
          description="Cuando registres pacientes o sesiones, apareceran aqui."
        />
      ) : (
        <div className="mt-5 grid gap-5 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <ActivityColumn title="Ultimas sesiones">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <SessionActivityItem key={session.id} session={session} />
              ))
            ) : (
              <SmallEmptyState text="Sin sesiones recientes." />
            )}
          </ActivityColumn>

          <ActivityColumn title="Pacientes recientes">
            {patients.length > 0 ? (
              patients.map((patient) => (
                <PatientActivityItem key={patient.id} patient={patient} />
              ))
            ) : (
              <SmallEmptyState text="Sin pacientes recientes." />
            )}
          </ActivityColumn>
        </div>
      )}
    </SectionCard>
  );
}

function PendingDrafts({ drafts }: { drafts: ClinicalTimelineSession[] }) {
  return (
    <SectionCard className="rounded-3xl border-rose-100 bg-background">
      <SectionHeading
        title="Borradores pendientes"
        description="Sesiones guardadas como borrador para completar o finalizar."
      />

      {drafts.length > 0 ? (
        <div className="mt-5 space-y-3">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="rounded-3xl border border-rose-100 bg-white/85 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {draft.patientName}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {formatDashboardDate(draft.sessionDate)}
                  </p>
                </div>
                <SessionStatusBadge status={draft.status} />
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
                {draft.summary}
              </p>
              <Link
                href={`/sesiones/${draft.id}/editar`}
                className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-2xl bg-brand px-4 text-sm font-semibold text-brand-foreground transition hover:bg-brand-hover hover:text-brand-foreground active:bg-brand-active sm:w-auto"
              >
                Editar sesion
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Sin borradores pendientes"
          description="No hay sesiones en borrador por completar."
        />
      )}
    </SectionCard>
  );
}

function QuickAccess() {
  const links = [
    {
      href: "/pacientes/nuevo",
      title: "Nueva paciente",
      description: "Crear ficha clinica.",
      icon: UserPlus,
    },
    {
      href: "/sesiones/nueva",
      title: "Nueva sesion",
      description: "Registrar atencion.",
      icon: CalendarPlus,
    },
    {
      href: "/historial",
      title: "Historial clinico",
      description: "Revisar evolucion.",
      icon: History,
    },
    {
      href: "/pacientes",
      title: "Pacientes",
      description: "Buscar y editar fichas.",
      icon: Users,
    },
  ];

  return (
    <SectionCard className="rounded-3xl border-rose-100 bg-white/90">
      <SectionHeading
        title="Accesos rapidos"
        description="Atajos principales para el flujo diario."
      />
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-3xl border border-rose-100 bg-background p-4 transition hover:border-leaf hover:bg-leaf-soft"
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-active shadow-sm transition group-hover:bg-white group-hover:text-leaf-strong">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground transition group-hover:text-leaf-strong">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted transition group-hover:text-leaf-foreground">
                    {item.description}
                  </span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </SectionCard>
  );
}

function ActivityColumn({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

function SessionActivityItem({ session }: { session: ClinicalTimelineSession }) {
  return (
    <Link
      href={`/sesiones/${session.id}/editar`}
      className="block rounded-3xl border border-rose-100 bg-background p-4 transition hover:border-leaf hover:bg-leaf-soft"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {session.patientName}
          </p>
          <p className="mt-1 text-sm text-muted">
            {formatDashboardDate(session.sessionDate)}
          </p>
        </div>
        <SessionStatusBadge status={session.status} />
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
        {session.summary}
      </p>
    </Link>
  );
}

function PatientActivityItem({ patient }: { patient: PatientRow }) {
  return (
    <Link
      href={`/pacientes/${patient.id}`}
      className="block rounded-3xl border border-rose-100 bg-background p-4 transition hover:border-leaf hover:bg-leaf-soft"
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-active shadow-sm">
          <ClipboardList className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-foreground">
            {getPatientFullName(patient)}
          </span>
          <span className="mt-1 block text-sm text-muted">
            Creada {formatPatientCreatedAt(patient.created_at)}
          </span>
        </span>
      </div>
    </Link>
  );
}

function SectionHeading({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <div>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

function EmptyState({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="mt-5 rounded-3xl border border-dashed border-rose-200 bg-white/70 p-6 text-center">
      <LayoutDashboard className="mx-auto size-8 text-brand-active" aria-hidden="true" />
      <p className="mt-3 font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

function SmallEmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-rose-200 bg-white/70 p-4 text-sm text-muted">
      {text}
    </div>
  );
}

function formatDashboardDate(value: string | null) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}
