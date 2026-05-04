import {
  CheckCircle2,
  CircleDot,
  Clock3,
  ListTodo,
  Sparkles,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { FeedbackStatus } from "@/lib/feedback-types";
import { cn } from "@/lib/utils";

type StatusMeta = {
  label: string;
  icon: LucideIcon;
  className: string;
};

const statusMeta: Record<FeedbackStatus, StatusMeta> = {
  pending: {
    label: "Recibida",
    icon: CircleDot,
    className: "border-rose-100 bg-white/90 text-brand-active",
  },
  reviewed: {
    label: "En revision",
    icon: Clock3,
    className: "border-amber-200 bg-amber-50 text-amber-900",
  },
  planned: {
    label: "Planificada",
    icon: Sparkles,
    className: "border-leaf bg-leaf-soft text-leaf-strong",
  },
  in_progress: {
    label: "En progreso",
    icon: ListTodo,
    className: "border-leaf bg-leaf-soft text-leaf-strong",
  },
  done: {
    label: "Completada",
    icon: CheckCircle2,
    className: "border-leaf bg-leaf-soft text-leaf-strong",
  },
  rejected: {
    label: "Rechazada",
    icon: XCircle,
    className: "border-rose-200 bg-rose-50 text-rose-900",
  },
};

export function FeedbackStatusBadge({ status }: { status: string }) {
  const meta = statusMeta[status as FeedbackStatus] ?? statusMeta.pending;
  const Icon = meta.icon;

  return (
    <span
      className={cn(
        "inline-flex h-8 items-center justify-center gap-2 rounded-full border px-3 text-xs font-semibold",
        meta.className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {meta.label}
    </span>
  );
}
