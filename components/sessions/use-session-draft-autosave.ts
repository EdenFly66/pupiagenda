"use client";

import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import type {
  SessionFormState,
  StoredSessionDraft,
} from "@/lib/session-form-types";

const DRAFT_STORAGE_KEY = "pupiagenda:clinical-session-draft:v1";
const AUTOSAVE_DELAY_MS = 1000;

export type DraftAutosaveStatus =
  | "idle"
  | "pending"
  | "saving"
  | "saved"
  | "error";

export function useSessionDraftAutosave({
  form,
  enabled,
}: {
  form: SessionFormState;
  enabled: boolean;
}) {
  const [status, setStatus] = useState<DraftAutosaveStatus>("idle");
  const [draftToRestore, setDraftToRestore] = useState<StoredSessionDraft | null>(
    null,
  );
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const hasContent = useMemo(() => hasDraftContent(form), [form]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const draft = readStoredDraft();

      if (draft) {
        setDraftToRestore(draft);
        setLastSavedAt(draft.saved_at);
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!enabled || draftToRestore || !hasContent) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setStatus("saving");

      try {
        const draft = toStoredDraft(form);
        window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
        setLastSavedAt(draft.saved_at);
        setStorageError(null);
        setStatus("saved");
      } catch (error) {
        setStorageError(
          error instanceof Error ? error.message : "No se pudo guardar el borrador.",
        );
        setStatus("error");
      }
    }, AUTOSAVE_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [draftToRestore, enabled, form, hasContent]);

  function clearDraft() {
    try {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignored intentionally. A failed cleanup should not block the saved session.
    }

    setDraftToRestore(null);
    setLastSavedAt(null);
    setStatus("idle");
  }

  function dismissRestorePrompt() {
    setDraftToRestore(null);
  }

  return {
    clearDraft,
    dismissRestorePrompt,
    draftToRestore,
    lastSavedAt,
    status,
    storageError,
  };
}

export function draftToFormState(draft: StoredSessionDraft): SessionFormState {
  return {
    patientId: draft.patient_id,
    sessionDate: parseStoredDate(draft.session_date),
    emotionalState: draft.emotional_state,
    axisEvaluation: draft.axis_evaluation,
    sessionContent: draft.session_content,
    clinicalHypothesis: draft.clinical_hypothesis,
    interventions: draft.interventions,
    objectiveProgress: draft.objective_progress,
    keyIdeas: draft.key_ideas,
    nextSessionPlan: draft.next_session_plan,
    sessionSummary: draft.session_summary,
    homeworkOrTasks: draft.homework_or_tasks,
    observations: draft.observations,
  };
}

function readStoredDraft() {
  try {
    const rawDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);

    if (!rawDraft) {
      return null;
    }

    const parsedDraft = JSON.parse(rawDraft);

    if (!isStoredSessionDraft(parsedDraft)) {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      return null;
    }

    return parsedDraft;
  } catch {
    try {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignore cleanup failure after invalid JSON.
    }

    return null;
  }
}

function toStoredDraft(form: SessionFormState): StoredSessionDraft {
  return {
    patient_id: form.patientId,
    session_date: format(form.sessionDate, "yyyy-MM-dd"),
    emotional_state: form.emotionalState,
    axis_evaluation: form.axisEvaluation,
    session_content: form.sessionContent,
    clinical_hypothesis: form.clinicalHypothesis,
    interventions: form.interventions,
    objective_progress: form.objectiveProgress,
    key_ideas: form.keyIdeas,
    next_session_plan: form.nextSessionPlan,
    session_summary: form.sessionSummary,
    homework_or_tasks: form.homeworkOrTasks,
    observations: form.observations,
    saved_at: new Date().toISOString(),
  };
}

function hasDraftContent(form: SessionFormState) {
  return [
    form.patientId,
    form.emotionalState,
    form.axisEvaluation,
    form.sessionContent,
    form.clinicalHypothesis,
    form.interventions,
    form.objectiveProgress,
    form.keyIdeas,
    form.nextSessionPlan,
    form.sessionSummary,
    form.homeworkOrTasks,
    form.observations,
  ].some((value) => value.trim().length > 0);
}

function isStoredSessionDraft(value: unknown): value is StoredSessionDraft {
  if (!value || typeof value !== "object") {
    return false;
  }

  const draft = value as Record<string, unknown>;
  const requiredStringFields: Array<keyof StoredSessionDraft> = [
    "patient_id",
    "session_date",
    "emotional_state",
    "axis_evaluation",
    "session_content",
    "clinical_hypothesis",
    "interventions",
    "objective_progress",
    "key_ideas",
    "next_session_plan",
    "session_summary",
    "homework_or_tasks",
    "observations",
    "saved_at",
  ];

  return requiredStringFields.every((field) => typeof draft[field] === "string");
}

function parseStoredDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}
