import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { StatCard } from "@/components/ui/stat-card";

const todaySessions = [
  { time: "09:00", patient: "Martina López", type: "Evaluación inicial" },
  { time: "11:30", patient: "Tomás Rivas", type: "Seguimiento" },
  { time: "16:00", patient: "Isidora Peña", type: "Terapia individual" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Resumen"
        title="Dashboard"
        description="Vista general de la agenda, pacientes activos y próximas sesiones."
        action={
          <Link
            href="/sesiones/nueva"
            className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground transition hover:bg-teal-800"
          >
            Nueva sesión
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Sesiones hoy" value="3" helper="2 confirmadas, 1 pendiente" />
        <StatCard label="Pacientes activos" value="18" helper="4 con controles esta semana" />
        <StatCard label="Notas por cerrar" value="5" helper="Pendientes de revisión clínica" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <SectionCard>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold">Agenda de hoy</h3>
              <p className="mt-1 text-sm text-muted">Sesiones programadas para la jornada.</p>
            </div>
            <Link href="/historial" className="text-sm font-semibold text-brand">
              Ver historial
            </Link>
          </div>
          <div className="mt-5 divide-y divide-border">
            {todaySessions.map((session) => (
              <div key={`${session.time}-${session.patient}`} className="flex gap-4 py-4">
                <div className="w-16 text-sm font-semibold text-brand">{session.time}</div>
                <div>
                  <p className="font-medium">{session.patient}</p>
                  <p className="mt-1 text-sm text-muted">{session.type}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard>
          <h3 className="text-base font-semibold">Prioridades</h3>
          <div className="mt-5 space-y-4">
            <div className="rounded-lg bg-background p-4">
              <p className="text-sm font-medium">Actualizar fichas</p>
              <p className="mt-1 text-sm text-muted">Completar antecedentes de nuevos pacientes.</p>
            </div>
            <div className="rounded-lg bg-background p-4">
              <p className="text-sm font-medium">Preparar sesiones</p>
              <p className="mt-1 text-sm text-muted">Revisar objetivos antes de cada atención.</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
