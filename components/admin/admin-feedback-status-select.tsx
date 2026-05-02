"use client";

import { useState } from "react";
import { updateAdminFeedback } from "@/lib/admin";
import {
  adminFeedbackStatuses,
  adminFeedbackStatusLabels,
  type AdminFeedbackStatus,
} from "@/lib/admin-types";

type AdminFeedbackStatusSelectProps = {
  feedbackId: string;
  value: string;
  onSaved: () => Promise<void>;
};

export function AdminFeedbackStatusSelect({
  feedbackId,
  onSaved,
  value,
}: AdminFeedbackStatusSelectProps) {
  const [status, setStatus] = useState(value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const hasKnownStatus = adminFeedbackStatuses.some((option) => option === value);

  async function handleChange(nextStatus: AdminFeedbackStatus) {
    setStatus(nextStatus);
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateAdminFeedback({ id: feedbackId, status: nextStatus });
      await onSaved();
      setSuccess("Estado actualizado.");
    } catch (saveError) {
      setStatus(value);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar el estado.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-normal text-muted">
          Estado
        </span>
        <select
          value={status}
          onChange={(event) =>
            handleChange(event.target.value as AdminFeedbackStatus)
          }
          disabled={saving}
          className="mt-2 h-10 w-full rounded-2xl border border-rose-100 bg-white px-3 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-rose-soft disabled:cursor-not-allowed disabled:bg-neutral-soft"
        >
          {!hasKnownStatus ? (
            <option value={value} disabled>
              Estado actual: {value}
            </option>
          ) : null}
          {adminFeedbackStatuses.map((option) => (
            <option key={option} value={option}>
              {adminFeedbackStatusLabels[option]}
            </option>
          ))}
        </select>
      </label>
      <p className="mt-2 min-h-5 text-xs text-muted">
        {saving ? "Guardando..." : error ?? success}
      </p>
    </div>
  );
}
