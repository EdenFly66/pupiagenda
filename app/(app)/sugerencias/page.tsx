"use client";

import { useEffect, useState } from "react";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import { FeedbackHistory } from "@/components/feedback/feedback-history";
import { PageHeader } from "@/components/ui/page-header";
import { getAuthenticatedUser } from "@/lib/auth";

export default function SuggestionsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      setLoading(true);
      setError(null);

      try {
        const user = await getAuthenticatedUser();

        if (!active) {
          return;
        }

        setUserId(user.id);
      } catch {
        if (!active) {
          return;
        }

        setUserId(null);
        setError("Necesitas iniciar sesion para enviar sugerencias.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6 bg-[radial-gradient(circle_at_top_left,var(--theme-soft-bg)_0,transparent_30rem)]">
      <PageHeader
        eyebrow="Participacion"
        title="Sugerencias"
        description="Envia ideas, mejoras o avisos para ayudar a priorizar la evolucion de PupiAgenda."
      />

      {loading ? (
        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="h-96 animate-pulse rounded-3xl border border-rose-100 bg-white/70" />
          <div className="h-96 animate-pulse rounded-3xl border border-rose-100 bg-white/70" />
        </div>
      ) : error || !userId ? (
        <div className="rounded-3xl border border-rose-200 bg-white/90 p-6 text-sm leading-6 text-rose-900">
          {error ?? "No pudimos preparar la pagina de sugerencias."}
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr] xl:items-start">
          <FeedbackForm userId={userId} />
          <FeedbackHistory userId={userId} />
        </div>
      )}
    </div>
  );
}
