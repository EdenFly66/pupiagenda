export const feedbackCategories = [
  "idea",
  "improvement",
  "bug",
  "usability",
  "other",
] as const;

export const feedbackStatuses = [
  "pending",
  "reviewed",
  "planned",
  "in_progress",
  "done",
  "rejected",
] as const;

export const feedbackPriorities = ["low", "medium", "high", "critical"] as const;
export const feedbackTargetVersions = ["backlog", "v2.1", "v2.2", "v3.0"] as const;

export type FeedbackCategory = (typeof feedbackCategories)[number];
export type FeedbackStatus = (typeof feedbackStatuses)[number];
export type FeedbackPriority = (typeof feedbackPriorities)[number];
export type FeedbackTargetVersion = (typeof feedbackTargetVersions)[number];

export type FeedbackRow = {
  id: string;
  user_id: string;
  category: FeedbackCategory | string;
  status: FeedbackStatus | string;
  priority: FeedbackPriority | string;
  target_version: FeedbackTargetVersion | string | null;
  title: string;
  message: string;
  admin_notes: string | null;
  admin_decision: string | null;
  created_at: string;
  updated_at: string;
};

export type FeedbackItem = {
  id: string;
  category: FeedbackCategory | string;
  status: FeedbackStatus | string;
  priority: FeedbackPriority | string;
  targetVersion: FeedbackTargetVersion | string | null;
  title: string;
  message: string;
  adminNotes: string | null;
  adminDecision: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateFeedbackInput = {
  userId: string;
  category: FeedbackCategory;
  title: string;
  message: string;
};

export const feedbackSelectColumns =
  "id,user_id,category,status,priority,target_version,title,message,admin_notes,admin_decision,created_at,updated_at";

export const feedbackCategoryLabels: Record<FeedbackCategory, string> = {
  idea: "Idea",
  improvement: "Mejora",
  bug: "Problema",
  usability: "Usabilidad",
  other: "Otro",
};

export const feedbackPriorityLabels: Record<FeedbackPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Critica",
};

export const feedbackStatusLabels: Record<FeedbackStatus, string> = {
  pending: "Pendiente",
  reviewed: "Revisada",
  planned: "Planificada",
  in_progress: "En progreso",
  done: "Completada",
  rejected: "Rechazada",
};

export const feedbackTargetVersionLabels: Record<FeedbackTargetVersion, string> = {
  backlog: "Backlog",
  "v2.1": "V2.1",
  "v2.2": "V2.2",
  "v3.0": "V3.0",
};

export function mapFeedbackRow(row: FeedbackRow): FeedbackItem {
  return {
    id: row.id,
    category: row.category,
    status: row.status,
    priority: row.priority,
    targetVersion: row.target_version,
    title: row.title,
    message: row.message,
    adminNotes: row.admin_notes,
    adminDecision: row.admin_decision,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function formatFeedbackDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
