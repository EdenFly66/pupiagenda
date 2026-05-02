export const adminFeedbackStatuses = [
  "pending",
  "reviewed",
  "planned",
  "done",
  "rejected",
] as const;

export type AdminFeedbackStatus = (typeof adminFeedbackStatuses)[number];

export type FeedbackAdminRow = {
  id: string;
  user_id?: string | null;
  email: string | null;
  title: string;
  message: string;
  category: string;
  priority: string;
  status: AdminFeedbackStatus | string;
  admin_notes: string | null;
  created_at: string;
  updated_at?: string | null;
};

export type AdminFeedbackItem = {
  id: string;
  userId: string | null;
  email: string;
  title: string;
  message: string;
  category: string;
  priority: string;
  status: AdminFeedbackStatus | string;
  adminNotes: string;
  createdAt: string;
};

export type UpdateAdminFeedbackInput = {
  id: string;
  status?: AdminFeedbackStatus;
  adminNotes?: string;
};

export const feedbackAdminSelectColumns =
  "id,email,title,message,category,priority,status,admin_notes,created_at";

export const adminFeedbackStatusLabels: Record<AdminFeedbackStatus, string> = {
  pending: "Pendiente",
  reviewed: "Revisada",
  planned: "Planificada",
  done: "Completada",
  rejected: "Rechazada",
};

export function mapFeedbackAdminRow(
  row: FeedbackAdminRow,
): AdminFeedbackItem {
  return {
    id: row.id,
    userId: row.user_id ?? null,
    email: row.email ?? "Sin correo",
    title: row.title,
    message: row.message,
    category: row.category,
    priority: row.priority,
    status: row.status,
    adminNotes: row.admin_notes ?? "",
    createdAt: row.created_at,
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
