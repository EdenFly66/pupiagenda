"use client";

import { format } from "date-fns";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { PatientSelector } from "@/components/sessions/patient-selector";
import { SessionActions } from "@/components/sessions/session-actions";
import { SessionDatePicker } from "@/components/sessions/session-date-picker";
import { SessionTextarea } from "@/components/sessions/session-textarea";
import type { ClinicalSessionStatus } from "@/lib/clinical-session-types";
import { supabase } from "@/lib/supabase";

type SessionFormState = {
  patientId: string;
  sessionDate: Date;
  emotionalState: string;
  axisEvaluation: string;
  sessionContent: string;
  clinicalHypothesis: string;
  interventions: string;
  objectiveProgress: string;
  keyIdeas: string;
  nextSessionPlan: string;
  sessionSummary: string;
  homeworkOrTasks: string;
  observations: string;
};

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
}: {
  initialPatientId?: string;
}) {
  const [form, setForm] = useState<SessionFormState>(() =>
    getInitialForm(initialPatientId),
  );
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState("Autoguardado listo");
  const [savingStatus, setSavingStatus] = useState<ClinicalSessionStatus | null>(
    null,
  );
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const autoSaveLabel = useMemo(() => {
    if (autoSaveStatus === "Guardando") {
      return "Autoguardando...";
    }

    if (lastSavedAt) {
      return `Autoguardado a las ${lastSavedAt}`;
    }

    return autoSaveStatus;
  }, [autoSaveStatus, lastSavedAt]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const savedAt = formatTime();
      console.log("Autoguardado simulado", form);
      setLastSavedAt(savedAt);
      setAutoSaveStatus("Guardado");
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [form, isDirty]);

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
    setForm((current) => ({ ...current, [name]: value }));
    setIsDirty(true);
    setAutoSaveStatus("Guardando");
    setSaveError(null);
    setSuccessMessage(null);
  }

  function updateSessionDate(date: Date) {
    setForm((current) => ({ ...current, sessionDate: date }));
    setIsDirty(true);
    setAutoSaveStatus("Guardando");
    setSaveError(null);
    setSuccessMessage(null);
  }

  async function saveSession(status: ClinicalSessionStatus) {
    setSaveError(null);
    setSuccessMessage(null);

    if (!form.patientId) {
      setSaveError("Selecciona una paciente antes de guardar la sesion.");
      return;
    }

    setSavingStatus(status);

    const payload = {
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

    const { error } = await supabase.from("clinical_sessions").insert(payload);

    console.log("Resultado guardado sesion", { status, payload, error });

    if (error) {
      setSaveError(error.message);
      setSavingStatus(null);
      return;
    }

    const savedAt = formatTime();
    setLastSavedAt(savedAt);
    setAutoSaveStatus("Sesion guardada");
    setSuccessMessage(successMessageForStatus(status));
    setForm(getInitialForm(initialPatientId));
    setIsDirty(false);
    setSavingStatus(null);
  }

  return (
    <form className="mx-auto max-w-5xl space-y-8">
      <section className="rounded-3xl border border-rose-100 bg-[#fffaf8] p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 md:grid-cols-[1fr_220px]">
          <PatientSelector value={form.patientId} onChange={updateField} />
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
        autoSaveLabel={autoSaveLabel}
        isDirty={isDirty}
        savingStatus={savingStatus}
        onSave={(status) => void saveSession(status)}
      />
    </form>
  );
}

function Card({ children }: { children: React.ReactNode }) {
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

function successMessageForStatus(status: ClinicalSessionStatus) {
  const messages: Record<ClinicalSessionStatus, string> = {
    draft: "Borrador guardado.",
    completed: "Sesion finalizada.",
    cancelled: "Sesion cancelada.",
    no_show: "Inasistencia registrada.",
  };

  return messages[status];
}

function formatTime() {
  return new Intl.DateTimeFormat("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}
