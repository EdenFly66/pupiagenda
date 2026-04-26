import type { PatientStatus } from "@/lib/patient-types";
import { cn } from "@/lib/utils";

const patientStatusLabels: Record<string, string> = {
  active: "Activo",
  evaluation: "En evaluacion",
  inactive: "Inactivo",
  paused: "Pausado",
  discharged: "Alta",
};

const statusStyles: Record<string, string> = {
  active: "border-rose-200 bg-rose-50 text-rose-800",
  evaluation: "border-violet-200 bg-violet-50 text-violet-800",
  inactive: "border-stone-200 bg-stone-100 text-stone-700",
  paused: "border-stone-200 bg-stone-100 text-stone-700",
  discharged: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

export function PatientStatusBadge({
  status,
}: {
  status: PatientStatus | string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold",
        statusStyles[status] ?? "border-rose-100 bg-white text-muted",
      )}
    >
      {patientStatusLabels[status] ?? status}
    </span>
  );
}
