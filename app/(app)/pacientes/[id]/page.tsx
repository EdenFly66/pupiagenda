import Link from "next/link";
import { notFound } from "next/navigation";
import { PatientStatusBadge } from "@/components/patients/patient-status-badge";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { getPatientById, mockPatients } from "@/lib/mock-patients";

export function generateStaticParams() {
  return mockPatients.map((patient) => ({
    id: patient.id,
  }));
}

export default async function PatientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = getPatientById(id);

  if (!patient) {
    notFound();
  }

  return (
    <div className="space-y-6 bg-[radial-gradient(circle_at_top_left,#fff0f3_0,transparent_28rem)]">
      <PageHeader
        eyebrow="Perfil de paciente"
        title={patient.name}
        description="Ficha visual mock con informacion de contacto, estado y resumen del proceso."
        action={
          <Link
            href="/pacientes"
            className="inline-flex h-11 items-center rounded-2xl border border-rose-100 bg-white px-5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-rose-50"
          >
            Volver
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
        <SectionCard className="rounded-3xl border-rose-100 bg-white/90">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold">{patient.name}</h3>
              <p className="mt-1 text-sm text-muted">
                {patient.pronouns} / {patient.age} anos
              </p>
            </div>
            <PatientStatusBadge status={patient.status} />
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Detail label="Correo" value={patient.email} />
            <Detail label="Telefono" value={patient.phone} />
            <Detail label="Ultima sesion" value={patient.lastSession} />
            <Detail label="Proxima sesion" value={patient.nextSession} />
          </dl>
        </SectionCard>

        <SectionCard className="rounded-3xl border-rose-100 bg-[#fffaf8]">
          <h3 className="text-base font-semibold">Motivo de consulta</h3>
          <p className="mt-3 text-sm leading-6 text-muted">{patient.reason}</p>
          <div className="mt-6 rounded-2xl bg-white p-4">
            <p className="text-sm font-semibold">Nota breve</p>
            <p className="mt-2 text-sm leading-6 text-muted">{patient.notes}</p>
          </div>
        </SectionCard>
      </div>

      <SectionCard className="rounded-3xl border-rose-100 bg-white/90">
        <h3 className="text-base font-semibold">Linea de sesiones mock</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {["Evaluacion", "Plan de trabajo", "Seguimiento"].map((item) => (
            <div key={item} className="rounded-2xl bg-rose-50/70 p-4">
              <p className="text-sm font-semibold">{item}</p>
              <p className="mt-2 text-sm text-muted">
                Espacio reservado para hitos clinicos cuando exista backend.
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
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
