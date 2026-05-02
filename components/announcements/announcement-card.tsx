import {
  AlertTriangle,
  Bell,
  Info,
  Rocket,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import {
  formatAnnouncementDate,
  type Announcement,
  type AnnouncementType,
} from "@/lib/announcement-types";
import { cn } from "@/lib/utils";

type AnnouncementMeta = {
  label: string;
  icon: LucideIcon;
  className: string;
};

const announcementMeta: Record<AnnouncementType, AnnouncementMeta> = {
  info: {
    label: "Información",
    icon: Info,
    className: "border-rose-100 bg-white/90 text-brand-active",
  },
  improvement: {
    label: "Mejora",
    icon: Sparkles,
    className: "border-leaf bg-leaf-soft text-leaf-strong",
  },
  warning: {
    label: "Aviso",
    icon: AlertTriangle,
    className: "border-amber-200 bg-amber-50 text-amber-900",
  },
  maintenance: {
    label: "Mantención",
    icon: Wrench,
    className: "border-rose-200 bg-rose-50 text-rose-900",
  },
  release: {
    label: "Lanzamiento",
    icon: Rocket,
    className: "border-rose-100 bg-background text-brand-active",
  },
};

export function AnnouncementCard({
  announcement,
}: {
  announcement: Announcement;
}) {
  const meta = announcementMeta[announcement.type] ?? announcementMeta.info;
  const Icon = meta.icon;

  return (
    <article className="rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-sm transition hover:border-rose-200 hover:bg-white hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={cn(
              "inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border",
              meta.className,
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </span>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold leading-7 text-foreground">
              {announcement.title}
            </h2>

            <p className="mt-1 text-sm text-muted">
              {formatAnnouncementDate(announcement.publishedAt)}
            </p>
          </div>
        </div>

        <span
          className={cn(
            "inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-full border px-3 text-xs font-semibold",
            meta.className,
          )}
        >
          <Bell className="size-3.5" aria-hidden="true" />
          {meta.label}
        </span>
      </div>

      <p className="mt-5 whitespace-pre-line text-sm leading-7 text-muted">
        {announcement.content}
      </p>
    </article>
  );
}