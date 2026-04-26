import Link from "next/link";

type PatientFilterOption = {
  id: string;
  name: string;
};

type HistoryFiltersProps = {
  constrainedPatientId?: string;
  query: string;
  patientId: string;
  patients: PatientFilterOption[];
  onQueryChange: (value: string) => void;
  onPatientChange: (value: string) => void;
};

export function HistoryFilters({
  constrainedPatientId,
  query,
  patientId,
  patients,
  onQueryChange,
  onPatientChange,
}: HistoryFiltersProps) {
  const isConstrained = Boolean(constrainedPatientId);

  return (
    <section className="rounded-3xl border border-rose-100 bg-[#fffaf8] p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_240px_auto]">
        <label className="block">
          <span className="sr-only">Buscar en historial</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="h-11 w-full rounded-2xl border border-rose-100 bg-white/95 px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-stone-400 focus:border-brand focus:ring-4 focus:ring-rose-100"
            placeholder="Buscar por paciente, motivo, desarrollo, intervenciones o tareas"
            type="search"
          />
        </label>

        <label className="block">
          <span className="sr-only">Filtrar por paciente</span>
          <select
            value={patientId}
            onChange={(event) => onPatientChange(event.target.value)}
            className="h-11 w-full rounded-2xl border border-rose-100 bg-white/95 px-4 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-rose-100"
          >
            <option value="all">Todas las pacientes</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </label>

        {isConstrained ? (
          <Link
            href="/historial"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-rose-100 bg-white px-4 text-sm font-semibold text-foreground shadow-sm transition hover:bg-rose-50"
          >
            Ver historial general
          </Link>
        ) : null}
      </div>
    </section>
  );
}
