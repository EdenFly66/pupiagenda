"use client";

import { Megaphone, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

import { AnnouncementCard } from "@/components/announcements/announcement-card";
import { SectionCard } from "@/components/ui/section-card";
import { getActiveAnnouncements } from "@/lib/announcements";
import type { Announcement } from "@/lib/announcement-types";

export function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadAnnouncements() {
      setLoading(true);
      setError(null);

      try {
        const activeAnnouncements = await getActiveAnnouncements();

        if (!active) return;

        setAnnouncements(activeAnnouncements);
      } catch (err) {
        console.error("Announcements load error:", err);

        if (!active) return;

        setAnnouncements([]);
        setError(
          "No pudimos cargar las novedades. Intenta nuevamente en unos minutos.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAnnouncements();

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <AnnouncementsLoading />;
  if (error) return <AnnouncementsError message={error} />;
  if (announcements.length === 0) return <AnnouncementsEmpty />;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {announcements.map((announcement) => (
        <AnnouncementCard
          key={announcement.id}
          announcement={announcement}
        />
      ))}
    </div>
  );
}

function AnnouncementsLoading() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-56 animate-pulse rounded-3xl border border-rose-100 bg-white/70 p-5"
        />
      ))}
    </div>
  );
}

function AnnouncementsEmpty() {
  return (
    <SectionCard className="rounded-3xl border-dashed border-rose-200 bg-white/80">
      <div className="py-6 text-center">
        <Megaphone className="mx-auto size-9 text-brand-active" />

        <h2 className="mt-3 text-base font-semibold">
          Aún no hay novedades
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Cuando haya mejoras, cambios importantes o avisos del sistema,
          aparecerán aquí.
        </p>
      </div>
    </SectionCard>
  );
}

function AnnouncementsError({ message }: { message: string }) {
  return (
    <SectionCard className="rounded-3xl border-rose-200 bg-white/90">
      <div className="py-6 text-center">
        <RefreshCw className="mx-auto size-9 text-brand-active" />

        <h2 className="mt-3 text-base font-semibold">
          No se pudieron cargar los anuncios
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          {message}
        </p>
      </div>
    </SectionCard>
  );
}