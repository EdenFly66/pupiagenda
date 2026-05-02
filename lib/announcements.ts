import {
  announcementSelectColumns,
  mapAnnouncementRow,
  type Announcement,
  type AnnouncementRow,
} from "@/lib/announcement-types";
import { supabase } from "@/lib/supabase";

const ANNOUNCEMENT_VISIBLE_DAYS = 30;

export async function getActiveAnnouncements(): Promise<Announcement[]> {
  const visibleFrom = new Date();
  visibleFrom.setDate(visibleFrom.getDate() - ANNOUNCEMENT_VISIBLE_DAYS);

  const { data, error } = await supabase
    .from("announcements")
    .select(announcementSelectColumns)
    .eq("is_active", true)
    .gte("published_at", visibleFrom.toISOString())
    .order("published_at", { ascending: false });

  if (error) {
    console.warn("Announcements query failed:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error("No se pudieron cargar los anuncios.");
  }

  return ((data ?? []) as AnnouncementRow[]).map(mapAnnouncementRow);
}