import Link from "next/link";
import type { Patient } from "@/lib/mock-patients";
import { PatientStatusBadge } from "./patient-status-badge";

export function PatientCard({ patient }: { patient: Patient }) {
  return (
    <Link
      href={`/pacientes/${patient.id}`}
      className="group block rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-200 hover:bg-white hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-foreground">
            {patient.name}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {patient.pronouns} / {patient.age} anos
          </p>
        </div>
        <PatientStatusBadge status={patient.status} />
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted">
        {patient.reason}
      </p>

      <div className="mt-5 grid gap-3 text-sm">
        <InfoRow label="Correo" value={patient.email} />
        <InfoRow label="Telefono" value={patient.phone} />
        <InfoRow label="Ultima sesion" value={patient.lastSession} />
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
