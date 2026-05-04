"use client";

import { Lightbulb, MessageSquareText, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { feedbackCreatedEventName } from "@/components/feedback/feedback-form";
import { FeedbackStatusBadge } from "@/components/feedback/feedback-status-badge";
import { SectionCard } from "@/components/ui/section-card";
import { getUserFeedback } from "@/lib/feedback";
import {
  feedbackCategoryLabels,
  formatFeedbackDate,
  type FeedbackCategory,
  type FeedbackItem,
} from "@/lib/feedback-types";

type FeedbackHistoryProps = {
  userId: string;
};

export function FeedbackHistory({ userId }: FeedbackHistoryProps) {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadFeedback() {
      setLoading(true);
      setError(null);

      try {
        const feedback = await getUserFeedback(userId);

        if (!active) {
          return;
        }

        setItems(feedback);
      } catch {
        if (!active) {
          return;
        }

        setItems([]);
        setError("No pudimos cargar tu historial de sugerencias.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadFeedback();

    function handleCreated() {
      loadFeedback();
    }

    window.addEventListener(feedbackCreatedEventName, handleCreated);

    return () => {
      active = false;
      window.removeEventListener(feedbackCreatedEventName, handleCreated);
    };
  }, [userId]);

  if (loading) {
    return <FeedbackHistoryLoading />;
  }

  if (error) {
    return <FeedbackHistoryError message={error} />;
  }

  if (items.length === 0) {
    return <FeedbackHistoryEmpty />;
  }

  return (
    <SectionCard className="rounded-3xl border-rose-100 bg-white/90">
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Historial de sugerencias
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          Revisa lo que has enviado y su estado actual.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <FeedbackHistoryItem key={item.id} item={item} />
        ))}
      </div>
    </SectionCard>
  );
}

function FeedbackHistoryItem({ item }: { item: FeedbackItem }) {
  return (
    <article className="rounded-3xl border border-rose-100 bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
          <p className="mt-1 text-sm text-muted">
            {formatFeedbackDate(item.createdAt)}
          </p>
        </div>
        <FeedbackStatusBadge status={item.status} />
      </div>

      <p className="mt-4 whitespace-pre-line text-sm leading-6 text-muted">
        {item.message}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-rose-100 pt-4">
        <MetadataPill
          label={formatCategoryLabel(item.category)}
          iconLabel="Categoria"
        />
      </div>

      {item.adminNotes ? (
        <div className="mt-4 rounded-2xl border border-leaf bg-leaf-soft p-4 text-sm leading-6 text-leaf-strong">
          {item.adminNotes}
        </div>
      ) : null}
    </article>
  );
}

function MetadataPill({
  iconLabel,
  label,
}: {
  iconLabel: string;
  label: string;
}) {
  return (
    <span className="inline-flex h-8 items-center justify-center gap-2 rounded-full border border-rose-100 bg-white px-3 text-xs font-semibold text-muted">
      <MessageSquareText className="size-3.5" aria-hidden="true" />
      <span className="sr-only">{iconLabel}: </span>
      {label}
    </span>
  );
}

function FeedbackHistoryLoading() {
  return (
    <SectionCard className="rounded-3xl border-rose-100 bg-white/90">
      <div className="space-y-4" aria-label="Cargando sugerencias">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-3xl border border-rose-100 bg-background"
          />
        ))}
      </div>
    </SectionCard>
  );
}

function FeedbackHistoryEmpty() {
  return (
    <SectionCard className="rounded-3xl border-dashed border-rose-200 bg-white/80">
      <div className="py-6 text-center">
        <Lightbulb className="mx-auto size-9 text-brand-active" aria-hidden="true" />
        <h2 className="mt-3 text-base font-semibold text-foreground">
          Aun no has enviado sugerencias
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
          Cuando envies una idea o aviso, quedara registrado en este historial.
        </p>
      </div>
    </SectionCard>
  );
}

function FeedbackHistoryError({ message }: { message: string }) {
  return (
    <SectionCard className="rounded-3xl border-rose-200 bg-white/90">
      <div className="py-6 text-center">
        <RefreshCw className="mx-auto size-9 text-brand-active" aria-hidden="true" />
        <h2 className="mt-3 text-base font-semibold text-foreground">
          No se pudo cargar el historial
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
          {message}
        </p>
      </div>
    </SectionCard>
  );
}

function formatCategoryLabel(value: string) {
  return feedbackCategoryLabels[value as FeedbackCategory] ?? value;
}
