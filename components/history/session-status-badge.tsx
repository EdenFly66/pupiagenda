import {
  clinicalSessionStatusLabels,
  type ClinicalSessionStatus,
} from "@/lib/mock-clinical-sessions";
import { cn } from "@/lib/utils";

const statusStyles: Record<ClinicalSessionStatus, string> = {
  draft: "border-stone-200 bg-stone-100 text-stone-700",
  finalized: "border-emerald-200 bg-emerald-50 text-emerald-800",
  pending: "border-violet-200 bg-violet-50 text-violet-800",
};

export function SessionStatusBadge({ status }: { status: ClinicalSessionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold",
        statusStyles[status],
      )}
    >
      {clinicalSessionStatusLabels[status]}
    </span>
  );
}
