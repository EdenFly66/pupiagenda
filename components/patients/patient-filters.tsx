import {
  patientStatusFilters,
  type PatientStatusFilter,
} from "@/lib/mock-patients";
import { cn } from "@/lib/utils";

type PatientFiltersProps = {
  value: PatientStatusFilter;
  onChange: (value: PatientStatusFilter) => void;
};

export function PatientFilters({ value, onChange }: PatientFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Filtrar pacientes por estado">
      {patientStatusFilters.map((filter) => {
        const active = filter.value === value;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            className={cn(
              "h-10 rounded-full border px-4 text-sm font-semibold transition",
              active
                ? "border-brand bg-brand text-brand-foreground shadow-sm"
                : "border-rose-100 bg-white/80 text-muted hover:border-rose-200 hover:bg-rose-50 hover:text-foreground",
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
