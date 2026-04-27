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
  active: "border-leaf bg-leaf-soft text-leaf-strong",
  evaluation: "border-brand-active bg-rose-soft text-brand-active",
  inactive: "border-stone-300 bg-stone-100 text-stone-800",
  paused: "border-stone-300 bg-stone-100 text-stone-800",
  discharged: "border-leaf bg-leaf-soft text-leaf-strong",
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
