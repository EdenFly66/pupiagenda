export const feedbackCategories = [
  "idea",
  "improvement",
  "bug",
  "usability",
  "other",
] as const;

export const feedbackStatuses = [
  "new",
  "in_review",
  "planned",
  "done",
  "closed",
] as const;

export const feedbackPriorities = ["low", "medium", "high"] as const;

export type FeedbackCategory = (typeof feedbackCategories)[number];
export type FeedbackStatus = (typeof feedbackStatuses)[number];
export type FeedbackPriority = (typeof feedbackPriorities)[number];

export type FeedbackRow = {
  id: string;
  user_id: string;
  category: FeedbackCategory | string;
  status: FeedbackStatus | string;
  priority: FeedbackPriority | string;
  title: string;
  message: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type FeedbackItem = {
  id: string;
  category: FeedbackCategory | string;
  status: FeedbackStatus | string;
  priority: FeedbackPriority | string;
  title: string;
  message: string;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateFeedbackInput = {
  userId: string;
  category: FeedbackCategory;
  priority: FeedbackPriority;
  title: string;
  message: string;
};

export const feedbackSelectColumns =
  "id,user_id,category,status,priority,title,message,admin_notes,created_at,updated_at";

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
};

export function mapFeedbackRow(row: FeedbackRow): FeedbackItem {
  return {
    id: row.id,
    category: row.category,
    status: row.status,
    priority: row.priority,
    title: row.title,
    message: row.message,
    adminNotes: row.admin_notes,
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
