"use client";

import { Send } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { createFeedback } from "@/lib/feedback";
import {
  feedbackCategoryLabels,
  type FeedbackCategory,
} from "@/lib/feedback-types";

export const feedbackCreatedEventName = "pupiagenda:feedback-created";

const categoryOptions: FeedbackCategory[] = [
  "idea",
  "improvement",
  "bug",
  "usability",
  "other",
];

type FeedbackFormProps = {
  userId: string;
};

export function FeedbackForm({ userId }: FeedbackFormProps) {
  const [category, setCategory] = useState<FeedbackCategory>("idea");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedTitle = title.trim();
    const normalizedMessage = message.trim();

    setSuccess(null);
    setError(null);

    if (normalizedTitle.length < 3) {
      setError("El titulo debe tener al menos 3 caracteres.");
      return;
    }

    if (normalizedMessage.length < 10) {
      setError("El mensaje debe tener al menos 10 caracteres.");
      return;
    }

    setSubmitting(true);

    try {
      await createFeedback({
        userId,
        category,
        title: normalizedTitle,
        message: normalizedMessage,
      });

      setCategory("idea");
      setTitle("");
      setMessage("");
      setSuccess("Gracias. Tu sugerencia fue enviada correctamente.");
      window.dispatchEvent(new CustomEvent(feedbackCreatedEventName));
    } catch {
      setError("No pudimos enviar tu sugerencia. Intentalo nuevamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-sm"
      noValidate
    >
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Enviar sugerencia
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          Describe la idea, problema o mejora. La prioridad sera evaluada internamente.
        </p>
      </div>

      <div className="mt-5">
        <label className="block">
          <span className="text-sm font-semibold text-foreground">Categoria</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as FeedbackCategory)}
            className={inputClassName}
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {feedbackCategoryLabels[option]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-foreground">Titulo</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={inputClassName}
          minLength={3}
          required
          placeholder="Ej: Mejorar vista semanal"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-foreground">Mensaje</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={`${inputClassName} min-h-36 resize-y py-3 leading-6`}
          minLength={10}
          required
          placeholder="Describe la idea, problema o mejora. La prioridad sera evaluada internamente."
        />
      </label>

      {error ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mt-5 rounded-2xl border border-leaf bg-leaf-soft p-4 text-sm leading-6 text-leaf-strong">
          {success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover hover:text-brand-foreground active:bg-brand-active disabled:cursor-not-allowed disabled:bg-rose-soft disabled:text-brand-active sm:w-auto"
      >
        <Send className="size-4" aria-hidden="true" />
        {submitting ? "Enviando..." : "Enviar sugerencia"}
      </button>
    </form>
  );
}

const inputClassName =
  "mt-2 w-full rounded-2xl border border-rose-100 bg-white/95 px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-placeholder focus:border-brand focus:ring-4 focus:ring-rose-soft disabled:cursor-not-allowed disabled:bg-neutral-soft";
