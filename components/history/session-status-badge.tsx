import {
  clinicalSessionStatusLabels,
  type ClinicalSessionStatus,
} from "@/lib/clinical-session-types";
import { cn } from "@/lib/utils";

const statusStyles: Record<ClinicalSessionStatus, string> = {
  finalized: "border-emerald-200 bg-emerald-50 text-emerald-800",
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
