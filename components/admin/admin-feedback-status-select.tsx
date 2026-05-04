"use client";

import { useState } from "react";
import { updateAdminFeedback } from "@/lib/admin";
import {
  adminFeedbackPriorities,
  adminFeedbackPriorityLabels,
  adminFeedbackStatuses,
  adminFeedbackStatusLabels,
  adminFeedbackTargetVersionLabels,
  adminFeedbackTargetVersions,
  type AdminFeedbackPriority,
  type AdminFeedbackStatus,
  type AdminFeedbackTargetVersion,
} from "@/lib/admin-types";

type AdminFeedbackStatusSelectProps = {
  feedbackId: string;
  status: string;
  priority: string;
  targetVersion: string;
  onSaved: () => Promise<void>;
};

export function AdminFeedbackStatusSelect({
  feedbackId,
  onSaved,
  priority: initialPriority,
  status: initialStatus,
  targetVersion: initialTargetVersion,
}: AdminFeedbackStatusSelectProps) {
  const [status, setStatus] = useState(initialStatus);
  const [priority, setPriority] = useState(initialPriority);
  const [targetVersion, setTargetVersion] = useState(initialTargetVersion);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      setStatus(initialStatus);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar el estado.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handlePriorityChange(nextPriority: AdminFeedbackPriority) {
    setPriority(nextPriority);
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateAdminFeedback({ id: feedbackId, priority: nextPriority });
      await onSaved();
      setSuccess("Prioridad actualizada.");
    } catch (saveError) {
      setPriority(initialPriority);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar la prioridad.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleTargetVersionChange(nextTargetVersion: AdminFeedbackTargetVersion) {
    setTargetVersion(nextTargetVersion);
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateAdminFeedback({ id: feedbackId, targetVersion: nextTargetVersion });
      await onSaved();
      setSuccess("Version objetivo actualizada.");
    } catch (saveError) {
      setTargetVersion(initialTargetVersion);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar la version objetivo.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
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
          {getUnknownOption(status, adminFeedbackStatuses, "Estado actual")}
          {adminFeedbackStatuses.map((option) => (
            <option key={option} value={option}>
              {adminFeedbackStatusLabels[option]}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-normal text-muted">
          Prioridad
        </span>
        <select
          value={priority}
          onChange={(event) =>
            handlePriorityChange(event.target.value as AdminFeedbackPriority)
          }
          disabled={saving}
          className="mt-2 h-10 w-full rounded-2xl border border-rose-100 bg-white px-3 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-rose-soft disabled:cursor-not-allowed disabled:bg-neutral-soft"
        >
          {getUnknownOption(priority, adminFeedbackPriorities, "Prioridad actual")}
          {adminFeedbackPriorities.map((option) => (
            <option key={option} value={option}>
              {adminFeedbackPriorityLabels[option]}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-normal text-muted">
          Version objetivo
        </span>
        <select
          value={targetVersion}
          onChange={(event) =>
            handleTargetVersionChange(event.target.value as AdminFeedbackTargetVersion)
          }
          disabled={saving}
          className="mt-2 h-10 w-full rounded-2xl border border-rose-100 bg-white px-3 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-rose-soft disabled:cursor-not-allowed disabled:bg-neutral-soft"
        >
          {getUnknownOption(targetVersion, adminFeedbackTargetVersions, "Version actual")}
          {adminFeedbackTargetVersions.map((option) => (
            <option key={option} value={option}>
              {adminFeedbackTargetVersionLabels[option]}
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

function getUnknownOption<T extends readonly string[]>(
  value: string,
  options: T,
  label: string,
) {
  return options.some((option) => option === value) ? null : (
    <option value={value} disabled>
      {label}: {value}
    </option>
  );
}
