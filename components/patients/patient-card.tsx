import Link from "next/link";
import type { PatientRow } from "@/lib/patient-types";
import {
  displayValue,
  formatPatientCreatedAt,
  getPatientFullName,
} from "@/lib/patient-types";

export function PatientCard({ patient }: { patient: PatientRow }) {
  const fullName = getPatientFullName(patient);

  return (
    <Link
      href={`/pacientes/${patient.id}`}
      className="group block rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-200 hover:bg-white hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-foreground">
            {fullName}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {displayValue(patient.pronouns)} / {displayValue(patient.status)}
          </p>
        </div>
        <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800">
          Supabase
        </span>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted">
        {displayValue(
          patient.therapist_consultation_reason ||
            patient.client_consultation_reason,
        )}
      </p>

      <div className="mt-5 grid gap-3 text-sm">
        <InfoRow label="Nombre" value={patient.first_name ?? "Sin dato"} />
        <InfoRow label="Apellido" value={patient.last_name ?? "Sin dato"} />
        <InfoRow label="Correo" value={patient.email ?? "Sin correo"} />
        <InfoRow label="Telefono" value={patient.phone ?? "Sin telefono"} />
        <InfoRow label="Apoderado" value={displayValue(patient.guardian_name)} />
        <InfoRow label="Creado" value={formatPatientCreatedAt(patient.created_at)} />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-rose-100 pt-4">
        <span className="text-xs font-semibold uppercase tracking-normal text-muted">
          Ver perfil
        </span>
        <span className="flex size-8 items-center justify-center rounded-full bg-rose-50 text-brand transition group-hover:bg-brand group-hover:text-brand-foreground">
          -&gt;
        </span>
      </div>
    </Link>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <span className="shrink-0 text-muted">{label}</span>
      <span className="truncate font-medium text-foreground">{value}</span>
    </div>
  );
}
