import { patientStatusLabels, type PatientStatus } from "@/lib/mock-patients";
import { cn } from "@/lib/utils";

const statusStyles: Record<PatientStatus, string> = {
  active: "border-rose-200 bg-rose-50 text-rose-800",
  evaluation: "border-violet-200 bg-violet-50 text-violet-800",
  paused: "border-stone-200 bg-stone-100 text-stone-700",
  discharged: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

export function PatientStatusBadge({ status }: { status: PatientStatus }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold",
        statusStyles[status],
      )}
    >
      {patientStatusLabels[status]}
    </span>
  );
}
