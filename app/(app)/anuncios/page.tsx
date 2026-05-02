import { AnnouncementsList } from "@/components/announcements/announcements-list";
import { PageHeader } from "@/components/ui/page-header";

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6 bg-[radial-gradient(circle_at_top_left,var(--theme-soft-bg)_0,transparent_30rem)]">
      <PageHeader
        eyebrow="Novedades"
        title="Anuncios"
        description="Cambios, mejoras y avisos importantes para usar PupiAgenda con claridad."
      />

      <AnnouncementsList />
    </div>
  );
}
