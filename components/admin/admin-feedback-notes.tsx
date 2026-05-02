"use client";

import { Save } from "lucide-react";
import { useState } from "react";
import { updateAdminFeedback } from "@/lib/admin";

type AdminFeedbackNotesProps = {
  feedbackId: string;
  value: string;
  onSaved: () => Promise<void>;
};

export function AdminFeedbackNotes({
  feedbackId,
  onSaved,
  value,
}: AdminFeedbackNotesProps) {
  const [notes, setNotes] = useState(value);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      await updateAdminFeedback({ id: feedbackId, adminNotes: notes });
      await onSaved();
      setMessage("Notas guardadas.");
    } catch (saveError) {
      setMessage(
        saveError instanceof Error
          ? saveError.message
          : "No se pudieron guardar las notas.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-normal text-muted">
          Notas admin
        </span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="mt-2 min-h-28 w-full resize-y rounded-2xl border border-rose-100 bg-white px-3 py-3 text-sm leading-6 text-foreground shadow-sm outline-none transition placeholder:text-placeholder focus:border-brand focus:ring-4 focus:ring-rose-soft disabled:cursor-not-allowed disabled:bg-neutral-soft"
          placeholder="Agrega contexto interno para seguimiento."
          disabled={saving}
        />
      </label>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-h-5 text-xs text-muted">{saving ? "Guardando..." : message}</p>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || notes.trim() === value.trim()}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-brand px-4 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover hover:text-brand-foreground active:bg-brand-active disabled:cursor-not-allowed disabled:bg-rose-soft disabled:text-brand-active sm:w-auto"
        >
          <Save className="size-4" aria-hidden="true" />
          Guardar notas
        </button>
      </div>
    </div>
  );
}
