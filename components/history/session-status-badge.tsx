import {
  clinicalSessionStatusLabels,
  type ClinicalSessionStatus,
} from "@/lib/clinical-session-types";
import { cn } from "@/lib/utils";

const statusStyles: Record<ClinicalSessionStatus, string> = {
  draft: "border-brand-active bg-rose-soft text-brand-active",
  completed: "border-leaf bg-leaf-soft text-leaf-strong",
  cancelled: "border-danger bg-danger-soft text-danger",
  no_show: "border-neutral-text bg-neutral-soft text-neutral-text",
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
