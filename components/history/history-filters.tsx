import Link from "next/link";
import {
  clinicalSessionStatusLabels,
  clinicalSessionStatuses,
  type ClinicalSessionStatus,
} from "@/lib/clinical-session-types";

type PatientFilterOption = {
  id: string;
  name: string;
};

type HistoryFiltersProps = {
  constrainedPatientId?: string;
  dateFrom: string;
  dateTo: string;
  patientId: string;
  patients: PatientFilterOption[];
  query: string;
  status: ClinicalSessionStatus | "all";
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onPatientChange: (value: string) => void;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: ClinicalSessionStatus | "all") => void;
};

const controlClassName =
  "mt-2 h-11 w-full rounded-2xl border border-rose-100 bg-white/95 px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-stone-400 focus:border-brand focus:ring-4 focus:ring-rose-100";

export function HistoryFilters({
  constrainedPatientId,
  dateFrom,
  dateTo,
  patientId,
  patients,
  query,
  status,
  onDateFromChange,
  onDateToChange,
  onPatientChange,
  onQueryChange,
  onStatusChange,
}: HistoryFiltersProps) {
  const isConstrained = Boolean(constrainedPatientId);

  return (
    <section className="rounded-3xl border border-rose-100 bg-[#fffaf8] p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_220px_190px]">
        <label className="block">
          <span className="text-sm font-semibold text-foreground">Buscar</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className={controlClassName}
            placeholder="Buscar por paciente, foco, contenido o tareas"
            type="search"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-foreground">
            Paciente
          </span>
          <select
            value={patientId}
            onChange={(event) => onPatientChange(event.target.value)}
            className={controlClassName}
          >
            <option value="all">Todas las pacientes</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-foreground">Estado</span>
          <select
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as ClinicalSessionStatus | "all")
            }
            className={controlClassName}
          >
            <option value="all">Todos los estados</option>
            {clinicalSessionStatuses.map((sessionStatus) => (
              <option key={sessionStatus} value={sessionStatus}>
                {clinicalSessionStatusLabels[sessionStatus]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[190px_190px_auto]">
        <label className="block">
          <span className="text-sm font-semibold text-foreground">Desde</span>
          <input
            value={dateFrom}
            onChange={(event) => onDateFromChange(event.target.value)}
            className={controlClassName}
            type="date"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-foreground">Hasta</span>
          <input
            value={dateTo}
            onChange={(event) => onDateToChange(event.target.value)}
            className={controlClassName}
            type="date"
          />
        </label>

        {isConstrained ? (
          <Link
            href="/historial"
            className="inline-flex h-11 items-center justify-center self-end rounded-2xl border border-rose-100 bg-white px-4 text-sm font-semibold text-foreground shadow-sm transition hover:bg-rose-50"
          >
            Ver historial general
          </Link>
        ) : null}
      </div>
    </section>
  );
}
