import { mockPatients } from "@/lib/mock-patients";
import {
  clinicalSessionStatusFilters,
  type ClinicalSessionStatusFilter,
} from "@/lib/mock-clinical-sessions";

type HistoryFiltersProps = {
  query: string;
  patientId: string;
  status: ClinicalSessionStatusFilter;
  onQueryChange: (value: string) => void;
  onPatientChange: (value: string) => void;
  onStatusChange: (value: ClinicalSessionStatusFilter) => void;
};

export function HistoryFilters({
  query,
  patientId,
  status,
  onQueryChange,
  onPatientChange,
  onStatusChange,
}: HistoryFiltersProps) {
  return (
    <section className="rounded-3xl border border-rose-100 bg-[#fffaf8] p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_220px_180px]">
        <label className="block">
          <span className="sr-only">Buscar en historial</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="h-11 w-full rounded-2xl border border-rose-100 bg-white/95 px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-stone-400 focus:border-brand focus:ring-4 focus:ring-rose-100"
            placeholder="Buscar por foco, resumen, intervenciones o tareas"
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
            {mockPatients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="sr-only">Filtrar por estado</span>
          <select
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as ClinicalSessionStatusFilter)
            }
            className="h-11 w-full rounded-2xl border border-rose-100 bg-white/95 px-4 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-rose-100"
          >
            {clinicalSessionStatusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
