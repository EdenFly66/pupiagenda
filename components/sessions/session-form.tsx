"use client";

import { format } from "date-fns";
import type { ChangeEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { PatientSelector } from "@/components/sessions/patient-selector";
import { SessionActions } from "@/components/sessions/session-actions";
import { SessionDatePicker } from "@/components/sessions/session-date-picker";
import { SessionTextarea } from "@/components/sessions/session-textarea";
import {
  NEW_SESSION_DRAFT_STORAGE_KEY,
  draftToFormState,
  useSessionDraftAutosave,
} from "@/components/sessions/use-session-draft-autosave";
import {
  clinicalSessionStatusLabels,
  type ClinicalSessionStatus,
} from "@/lib/clinical-session-types";
import {
  generateClinicalEvolution,
  generateSessionSummary,
} from "@/lib/clinicalTemplates";
import { getAuthenticatedUser } from "@/lib/auth";
import type { SessionFormState } from "@/lib/session-form-types";
import { supabase } from "@/lib/supabase";

const initialState: SessionFormState = {
  patientId: "",
  sessionDate: new Date(),
  emotionalState: "",
  axisEvaluation: "",
  sessionContent: "",
  clinicalHypothesis: "",
  interventions: "",
  objectiveProgress: "",
  keyIdeas: "",
  nextSessionPlan: "",
  sessionSummary: "",
  homeworkOrTasks: "",
  observations: "",
};

const emotionalStates = [
  "Tranquila",
  "Ansiosa",
  "Reservada",
  "Motivada",
  "Frustrada",
  "Variable",
];

export function SessionForm({
  initialPatientId = "",
  initialStatus = "draft",
  initialValues,
  mode = "create",
  patientName,
  sessionId,
}: {
  initialPatientId?: string;
  initialStatus?: ClinicalSessionStatus;
  initialValues?: SessionFormState;
  mode?: "create" | "edit";
  patientName?: string;
  sessionId?: string;
}) {
  const [form, setForm] = useState<SessionFormState>(() =>
    initialValues ?? getInitialForm(initialPatientId),
  );
  const [currentStatus, setCurrentStatus] =
    useState<ClinicalSessionStatus>(initialStatus);
  const [isDirty, setIsDirty] = useState(false);
  const [savingStatus, setSavingStatus] = useState<ClinicalSessionStatus | null>(
    null,
  );
  const [savingChanges, setSavingChanges] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    clearDraft,
    dismissRestorePrompt,
    draftToRestore,
    lastSavedAt,
    status: draftStatus,
    storageError,
  } = useSessionDraftAutosave({
    enabled: isDirty && savingStatus === null && !savingChanges,
    form,
    storageKey:
      mode === "edit" && sessionId
        ? `pupiagenda:clinical-session-draft:edit:${sessionId}:v1`
        : NEW_SESSION_DRAFT_STORAGE_KEY,
  });

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  function updateField(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    dismissRestorePrompt();
    setForm((current) => ({ ...current, [name]: value }));
    setIsDirty(true);
    setSaveError(null);
    setSuccessMessage(null);
  }

  function updateSessionDate(date: Date) {
    dismissRestorePrompt();
    setForm((current) => ({ ...current, sessionDate: date }));
    setIsDirty(true);
    setSaveError(null);
    setSuccessMessage(null);
  }

  function restoreDraft() {
    if (!draftToRestore) {
      return;
    }

    setForm(draftToFormState(draftToRestore));
    setIsDirty(true);
    setSaveError(null);
    setSuccessMessage("Borrador local restaurado.");
    dismissRestorePrompt();
  }

  function discardDraft() {
    clearDraft();
    setSuccessMessage("Borrador local descartado.");
  }

  function generateSummary() {
    dismissRestorePrompt();
    setForm((current) => ({
      ...current,
      sessionSummary: generateSessionSummary(toTemplateData(current, patientName)),
    }));
    setIsDirty(true);
    setSaveError(null);
    setSuccessMessage("Resumen generado. Puedes editarlo antes de guardar.");
  }

  function generateEvolution() {
    dismissRestorePrompt();
    setForm((current) => ({
      ...current,
      objectiveProgress: generateClinicalEvolution(
        toTemplateData(current, patientName),
      ),
    }));
    setIsDirty(true);
    setSaveError(null);
    setSuccessMessage("Evolucion generada. Puedes editarla antes de guardar.");
  }

  async function saveSession(status: ClinicalSessionStatus) {
    setSaveError(null);
    setSuccessMessage(null);

    if (!form.patientId) {
      setSaveError("Selecciona una paciente antes de guardar la sesion.");
      return;
    }

    setSavingStatus(status);

    const user = await getAuthenticatedUser();
    const payload = toSessionPayload(form, status);

    const { error } =
      mode === "edit" && sessionId
        ? await supabase
            .from("clinical_sessions")
            .update(payload)
            .eq("id", sessionId)
            .eq("user_id", user.id)
        : await supabase
            .from("clinical_sessions")
            .insert({ ...payload, user_id: user.id });

    console.log("Resultado guardado sesion", { status, payload, error });

    if (error) {
      setSaveError(error.message);
      setSavingStatus(null);
      return;
    }

    setCurrentStatus(status);
    setSuccessMessage(successMessageForStatus(status));
    setForm(mode === "edit" ? form : getInitialForm(initialPatientId));
    setIsDirty(false);
    setSavingStatus(null);
    clearDraft();
  }

  async function saveChanges() {
    setSaveError(null);
    setSuccessMessage(null);

    if (!sessionId) {
      setSaveError("No se encontro el id de la sesion a editar.");
      return;
    }

    setSavingChanges(true);

    const user = await getAuthenticatedUser();
    const payload = toSessionPayload(form, currentStatus);
    const { error } = await supabase
      .from("clinical_sessions")
      .update(payload)
      .eq("id", sessionId)
      .eq("user_id", user.id);

    console.log("Resultado actualizacion sesion", {
      sessionId,
      payload,
      error,
    });

    if (error) {
      setSaveError(error.message);
      setSavingChanges(false);
      return;
    }

    setSuccessMessage("Cambios guardados.");
    setIsDirty(false);
    setSavingChanges(false);
    clearDraft();
  }

  const draftLabel = getDraftStatusLabel(draftStatus, lastSavedAt, isDirty);

  return (
    <form className="mx-auto max-w-5xl space-y-8">
      <section className="rounded-3xl border border-rose-100 bg-[#fffaf8] p-5 shadow-sm sm:p-6">
        {draftToRestore ? (
          <div className="mb-5 rounded-3xl border border-rose-200 bg-white/90 p-4 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-foreground">
                  Hay un borrador local sin guardar.
                </p>
                <p className="mt-1 text-sm text-muted">
                  Puedes restaurarlo para continuar o descartarlo.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={discardDraft}
                  className="inline-flex h-10 items-center justify-center rounded-2xl border border-rose-100 bg-white px-4 text-sm font-semibold text-foreground transition hover:bg-rose-50"
                >
                  Descartar
                </button>
                <button
                  type="button"
                  onClick={restoreDraft}
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-brand px-4 text-sm font-semibold text-brand-foreground transition hover:bg-[#87304a] hover:text-white"
                >
                  Restaurar borrador
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-[1fr_220px]">
          {mode === "edit" ? (
            <div className="rounded-2xl border border-rose-100 bg-white/80 px-4 py-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Paciente
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {patientName ?? "Paciente asociado"}
                  </p>
                </div>
                <span className="inline-flex w-fit rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-brand">
                  {clinicalSessionStatusLabels[currentStatus]}
                </span>
              </div>
            </div>
          ) : (
            <PatientSelector value={form.patientId} onChange={updateField} />
          )}
          <SessionDatePicker
            value={form.sessionDate}
            onChange={updateSessionDate}
          />
        </div>

        {saveError ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900">
            {saveError}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
            {successMessage}
          </div>
        ) : null}

        {storageError ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900">
            No se pudo guardar el borrador local: {storageError}
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-sm sm:p-7">
        <SessionTextarea
          label="Contenido de la sesion"
          name="sessionContent"
          value={form.sessionContent}
          onChange={updateField}
          rows={10}
          placeholder="Registra el desarrollo clinico principal, hitos, respuestas y material relevante."
          helper="Campo central del registro clinico."
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SessionTextarea label="Evaluacion por eje" name="axisEvaluation" value={form.axisEvaluation} onChange={updateField} rows={6} placeholder="Eje emocional, conductual, vincular, familiar u otros." />
        </Card>
        <Card>
          <SessionTextarea label="Hipotesis clinica" name="clinicalHypothesis" value={form.clinicalHypothesis} onChange={updateField} rows={6} placeholder="Hipotesis de trabajo actualizada." />
        </Card>
        <Card>
          <SessionTextarea label="Intervenciones" name="interventions" value={form.interventions} onChange={updateField} rows={6} placeholder="Tecnicas, preguntas, actividades o estrategias usadas." />
        </Card>
        <Card>
          <SessionTextarea label="Progreso de objetivos" name="objectiveProgress" value={form.objectiveProgress} onChange={updateField} rows={6} placeholder="Avances, retrocesos o indicadores observados." />
        </Card>
        <Card>
          <SessionTextarea label="Ideas clave" name="keyIdeas" value={form.keyIdeas} onChange={updateField} rows={5} placeholder="Conceptos, frases o acuerdos relevantes." />
        </Card>
        <Card>
          <SessionTextarea label="Plan proxima sesion" name="nextSessionPlan" value={form.nextSessionPlan} onChange={updateField} rows={5} placeholder="Foco sugerido para la siguiente sesion." />
        </Card>
      </section>

      <section className="rounded-3xl border border-rose-100 bg-[#fffaf8] p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-muted">
            Plantillas automaticas para acelerar la redaccion clinica.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={generateSummary}
              className="inline-flex h-10 w-full items-center justify-center rounded-2xl border border-rose-100 bg-white px-4 text-sm font-semibold text-foreground shadow-sm transition hover:bg-rose-50 sm:w-auto"
            >
              Generar resumen
            </button>
            <button
              type="button"
              onClick={generateEvolution}
              className="inline-flex h-10 w-full items-center justify-center rounded-2xl border border-rose-100 bg-white px-4 text-sm font-semibold text-foreground shadow-sm transition hover:bg-rose-50 sm:w-auto"
            >
              Generar evolucion
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <label className="block">
            <span className="text-sm font-semibold text-foreground">
              Estado emocional
            </span>
            <select
              name="emotionalState"
              value={form.emotionalState}
              onChange={updateField}
              className="mt-2 h-12 w-full rounded-2xl border border-rose-100 bg-white/95 px-4 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-rose-100"
            >
              <option value="">Seleccionar estado</option>
              {emotionalStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>

          <SessionTextarea label="Resumen de sesion" name="sessionSummary" value={form.sessionSummary} onChange={updateField} rows={5} placeholder="Resumen breve para visualizar en el historial." />
          <SessionTextarea label="Tareas o acuerdos" name="homeworkOrTasks" value={form.homeworkOrTasks} onChange={updateField} rows={5} placeholder="Tareas, recomendaciones o acuerdos." />
          <SessionTextarea label="Observaciones" name="observations" value={form.observations} onChange={updateField} rows={5} placeholder="Notas adicionales, contexto o alertas." />
        </div>
      </section>

      <SessionActions
        autoSaveLabel={draftLabel}
        isDirty={isDirty}
        mode={mode}
        savingStatus={savingStatus}
        savingChanges={savingChanges}
        onSave={(status) => void saveSession(status)}
        onSaveChanges={mode === "edit" ? () => void saveChanges() : undefined}
      />
    </form>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-sm sm:p-6">
      {children}
    </div>
  );
}

function getInitialForm(patientId = ""): SessionFormState {
  return {
    ...initialState,
    patientId,
    sessionDate: new Date(),
  };
}

function cleanOptional(value: string) {
  const trimmedValue = value.trim();
  return trimmedValue || null;
}

function toSessionPayload(form: SessionFormState, status: ClinicalSessionStatus) {
  return {
    patient_id: form.patientId,
    session_date: format(form.sessionDate, "yyyy-MM-dd"),
    status,
    emotional_state: cleanOptional(form.emotionalState),
    axis_evaluation: cleanOptional(form.axisEvaluation),
    session_content: cleanOptional(form.sessionContent),
    clinical_hypothesis: cleanOptional(form.clinicalHypothesis),
    interventions: cleanOptional(form.interventions),
    objective_progress: cleanOptional(form.objectiveProgress),
    key_ideas: cleanOptional(form.keyIdeas),
    next_session_plan: cleanOptional(form.nextSessionPlan),
    session_summary: cleanOptional(form.sessionSummary),
    homework_or_tasks: cleanOptional(form.homeworkOrTasks),
    observations: cleanOptional(form.observations),
  };
}

function toTemplateData(form: SessionFormState, patientName?: string) {
  return {
    patient_name: patientName,
    session_date: form.sessionDate,
    emotional_state: form.emotionalState,
    session_content: form.sessionContent,
    interventions: form.interventions,
    objective_progress: form.objectiveProgress,
    observations: form.observations,
  };
}

function successMessageForStatus(status: ClinicalSessionStatus) {
  const messages: Record<ClinicalSessionStatus, string> = {
    draft: "Borrador guardado.",
    completed: "Sesion finalizada.",
    cancelled: "Sesion cancelada.",
    no_show: "Inasistencia registrada.",
  };

  return messages[status];
}

function getDraftStatusLabel(
  status: string,
  lastSavedAt: string | null,
  isDirty: boolean,
) {
  if (!isDirty && status === "idle") {
    return "Borrador local listo";
  }

  if (status === "pending" || status === "saving") {
    return "Guardando borrador...";
  }

  if (status === "saved") {
    return lastSavedAt
      ? `Borrador guardado a las ${formatDraftTime(lastSavedAt)}`
      : "Borrador guardado";
  }

  if (status === "error") {
    return "Cambios sin guardar";
  }

  return "Cambios sin guardar";
}

function formatDraftTime(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
