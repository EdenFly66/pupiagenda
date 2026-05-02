export const announcementTypes = [
  "info",
  "improvement",
  "warning",
  "maintenance",
  "release",
] as const;

export type AnnouncementType = (typeof announcementTypes)[number];

export type AnnouncementRow = {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  is_active: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  publishedAt: string;
};

export const announcementSelectColumns =
  "id,title,content,type,is_active,published_at,created_at,updated_at";

export function mapAnnouncementRow(row: AnnouncementRow): Announcement {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    type: row.type,
    publishedAt: row.published_at,
  };
}

export function formatAnnouncementDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}