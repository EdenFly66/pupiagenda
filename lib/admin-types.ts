export const adminFeedbackStatuses = [
  "pending",
  "reviewed",
  "planned",
  "in_progress",
  "done",
  "rejected",
] as const;

export const adminFeedbackPriorities = ["low", "medium", "high", "critical"] as const;
export const adminFeedbackTargetVersions = ["backlog", "v2.1", "v2.2", "v3.0"] as const;

export type AdminFeedbackStatus = (typeof adminFeedbackStatuses)[number];
export type AdminFeedbackPriority = (typeof adminFeedbackPriorities)[number];
export type AdminFeedbackTargetVersion = (typeof adminFeedbackTargetVersions)[number];

export type FeedbackAdminRow = {
  id: string;
  user_id?: string | null;
  email?: string | null;
  title?: string | null;
  message?: string | null;
  category?: string | null;
  priority?: AdminFeedbackPriority | string | null;
  status?: AdminFeedbackStatus | string | null;
  target_version?: AdminFeedbackTargetVersion | string | null;
  admin_notes?: string | null;
  admin_decision?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AdminFeedbackItem = {
  id: string;
  userId: string | null;
  email: string;
  title: string;
  message: string;
  category: string;
  priority: AdminFeedbackPriority | string;
  status: AdminFeedbackStatus | string;
  targetVersion: AdminFeedbackTargetVersion | string;
  adminNotes: string;
  adminDecision: string;
  createdAt: string;
};

export type UpdateAdminFeedbackInput = {
  id: string;
  status?: AdminFeedbackStatus;
  priority?: AdminFeedbackPriority;
  targetVersion?: AdminFeedbackTargetVersion;
  adminNotes?: string;
  adminDecision?: string;
};

export const adminFeedbackStatusLabels: Record<AdminFeedbackStatus, string> = {
  pending: "Pendiente",
  reviewed: "Revisada",
  planned: "Planificada",
  in_progress: "En progreso",
  done: "Completada",
  rejected: "Rechazada",
};

export const adminFeedbackPriorityLabels: Record<AdminFeedbackPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Critica",
};

export const adminFeedbackTargetVersionLabels: Record<AdminFeedbackTargetVersion, string> = {
  backlog: "Backlog",
  "v2.1": "V2.1",
  "v2.2": "V2.2",
  "v3.0": "V3.0",
};

export function mapFeedbackAdminRow(
  row: FeedbackAdminRow,
): AdminFeedbackItem {
  return {
    id: row.id,
    userId: row.user_id ?? null,
    email: row.email ?? "Sin correo",
    title: row.title ?? "Sin titulo",
    message: row.message ?? "",
    category: row.category ?? "other",
    priority: row.priority ?? "medium",
    status: row.status ?? "pending",
    targetVersion: row.target_version ?? "backlog",
    adminNotes: row.admin_notes ?? "",
    adminDecision: row.admin_decision ?? "",
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

export function formatAdminFeedbackDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
