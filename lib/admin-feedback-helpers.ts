import {
  adminFeedbackStatuses,
  type AdminFeedbackItem,
  type AdminFeedbackPriority,
  type AdminFeedbackStatus,
  type ProductVersion,
} from "@/lib/admin-types";

export type AdminCategoryFilter = "all" | "idea" | "bug" | "improvement" | "other";
export type AdminPriorityFilter = "all" | AdminFeedbackPriority;
export type AdminVersionFilter = "all" | "unassigned" | string;

export type AdminFeedbackFilters = {
  category: AdminCategoryFilter;
  priority: AdminPriorityFilter;
  search: string;
  version: AdminVersionFilter;
};

const priorityRank: Record<AdminFeedbackPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function filterAdminFeedback(
  items: AdminFeedbackItem[],
  filters: AdminFeedbackFilters,
) {
  const search = normalizeSearchValue(filters.search);

  return items.filter((item) => {
    const matchesSearch =
      search.length === 0 ||
      [
        item.title,
        item.message,
        item.email,
        item.category,
      ].some((value) => normalizeSearchValue(value).includes(search));

    const matchesCategory =
      filters.category === "all" || item.category === filters.category;

    const matchesPriority =
      filters.priority === "all" || item.priority === filters.priority;

    const matchesVersion =
      filters.version === "all" ||
      (filters.version === "unassigned"
        ? item.versionId === null
        : item.versionId === filters.version);

    return matchesSearch && matchesCategory && matchesPriority && matchesVersion;
  });
}

export function sortFeedbackByPriority(items: AdminFeedbackItem[]) {
  return [...items].sort((first, second) => {
    const firstPriority =
      priorityRank[first.priority as AdminFeedbackPriority] ?? Number.MAX_SAFE_INTEGER;
    const secondPriority =
      priorityRank[second.priority as AdminFeedbackPriority] ?? Number.MAX_SAFE_INTEGER;

    if (firstPriority !== secondPriority) {
      return firstPriority - secondPriority;
    }

    return Date.parse(second.createdAt) - Date.parse(first.createdAt);
  });
}

export function groupFeedbackByStatus(items: AdminFeedbackItem[]) {
  return adminFeedbackStatuses.reduce(
    (groups, status) => {
      groups[status] = items.filter((item) => item.status === status);
      return groups;
    },
    {} as Record<AdminFeedbackStatus, AdminFeedbackItem[]>,
  );
}

export function groupFeedbackByVersion(
  items: AdminFeedbackItem[],
  versions: ProductVersion[],
) {
  const versionIds = new Set(versions.map((version) => version.id));

  return {
    unassigned: items.filter(
      (item) => !item.versionId || !versionIds.has(item.versionId),
    ),
    byVersion: versions.reduce(
      (groups, version) => {
        groups[version.id] = items.filter((item) => item.versionId === version.id);
        return groups;
      },
      {} as Record<string, AdminFeedbackItem[]>,
    ),
  };
}

function normalizeSearchValue(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("es-CL")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
