"use client";

import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { PatientSelector } from "@/components/sessions/patient-selector";
import { SessionActions } from "@/components/sessions/session-actions";
import { SessionDatePicker } from "@/components/sessions/session-date-picker";
import { SessionTextarea } from "@/components/sessions/session-textarea";
import { supabase } from "@/lib/supabase";

type SessionFormState = {
  patientId: string;
  sessionDate: Date;
  reason: string;
  development: string;
  clinicalObservations: string;
  interventions: string;
  emotionalState: string;
  assignedTasks: string;
};

const initialState: SessionFormState = {
  patientId: "",
  sessionDate: new Date(),
  reason: "",
  development: "",
  clinicalObservations: "",
  interventions: "",
  emotionalState: "",
  assignedTasks: "",
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
  const [isSaving, setIsSaving] = useState(false);
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

  useEffect(() => {
    const handleDocumentClick = (event: globalThis.MouseEvent) => {
      if (!isDirty) {
        return;
      }

      const target = event.target as Element | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;

      if (!anchor || anchor.target || event.metaKey || event.ctrlKey) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) {
        return;
      }

      const confirmed = window.confirm(
        "Tienes cambios sin guardar. Deseas salir de esta sesion?",
      );

      if (!confirmed) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
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

  async function saveSession(kind: "final" | "draft") {
    setSaveError(null);
    setSuccessMessage(null);

    if (!form.patientId) {
      setSaveError("Selecciona una paciente antes de guardar la sesion.");
      return;
    }

    setIsSaving(true);

    const payload = {
      patient_id: form.patientId,
      session_date: format(form.sessionDate, "yyyy-MM-dd"),
      motivo: cleanOptional(form.reason),
      desarrollo: cleanOptional(form.development),
      observaciones: cleanOptional(form.clinicalObservations),
      intervenciones: cleanOptional(form.interventions),
      estado_emocional: cleanOptional(form.emotionalState),
      tareas: cleanOptional(form.assignedTasks),
    };

    const { error } = await supabase.from("clinical_sessions").insert(payload);

    console.log("Resultado guardado sesion", { kind, payload, error });

    if (error) {
      setSaveError(error.message);
      setIsSaving(false);
      return;
    }

    const savedAt = formatTime();
    setLastSavedAt(savedAt);
    setAutoSaveStatus(kind === "final" ? "Sesion guardada" : "Borrador guardado");
    setSuccessMessage(
      kind === "final"
        ? "Sesion guardada correctamente."
        : "Borrador guardado correctamente.",
    );
    setForm(getInitialForm(initialPatientId));
    setIsDirty(false);
    setIsSaving(false);
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

        <label className="mt-6 block">
          <span className="text-sm font-semibold text-foreground">
            Motivo de la sesion
          </span>
          <input
            name="reason"
            value={form.reason}
            onChange={updateField}
            className="mt-2 h-14 w-full rounded-2xl border border-rose-100 bg-white/95 px-4 text-base text-foreground shadow-sm outline-none transition placeholder:text-stone-400 focus:border-brand focus:ring-4 focus:ring-rose-100"
            placeholder="Ej: seguimiento semanal, evaluacion inicial, cierre de objetivos"
          />
        </label>
      </section>

      <section className="rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-sm sm:p-7">
        <SessionTextarea
          label="Desarrollo de la sesion"
          name="development"
          value={form.development}
          onChange={updateField}
          rows={10}
          placeholder="Escribe aqui el relato principal de la sesion, avances, dificultades, respuestas observadas y acuerdos relevantes."
          helper="Campo principal. Dejalo amplio para escribir sin interrupciones."
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-sm sm:p-6">
          <SessionTextarea
            label="Observaciones clinicas"
            name="clinicalObservations"
            value={form.clinicalObservations}
            onChange={updateField}
            rows={7}
            placeholder="Registra observaciones de comunicacion, conducta, participacion o contexto familiar."
          />
        </div>

        <div className="rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-sm sm:p-6">
          <SessionTextarea
            label="Intervenciones realizadas"
            name="interventions"
            value={form.interventions}
            onChange={updateField}
            rows={7}
            placeholder="Describe tecnicas, ejercicios, apoyos, materiales o estrategias usadas durante la sesion."
          />
        </div>
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

          <SessionTextarea
            label="Tareas asignadas"
            name="assignedTasks"
            value={form.assignedTasks}
            onChange={updateField}
            rows={6}
            placeholder="Anota ejercicios, recomendaciones o acuerdos para realizar antes de la proxima sesion."
          />
        </div>
      </section>

      <SessionActions
        autoSaveLabel={autoSaveLabel}
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={() => void saveSession("final")}
        onDraft={() => void saveSession("draft")}
      />
    </form>
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

function formatTime() {
  return new Intl.DateTimeFormat("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}
