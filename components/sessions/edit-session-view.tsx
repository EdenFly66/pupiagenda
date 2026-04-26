"use client";

import { useEffect, useState } from "react";
import { SessionForm } from "@/components/sessions/session-form";
import { PageHeader } from "@/components/ui/page-header";
import {
  clinicalSessionSelectColumns,
  mapClinicalSessionRow,
  normalizeSessionStatus,
  type ClinicalSessionRow,
} from "@/lib/clinical-session-types";
import { getAuthenticatedUser } from "@/lib/auth";
import type { SessionFormState } from "@/lib/session-form-types";
import { supabase } from "@/lib/supabase";

export function EditSessionView({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<ClinicalSessionRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      setLoading(true);
      setError(null);

      const user = await getAuthenticatedUser();
      const { data, error: queryError } = await supabase
        .from("clinical_sessions")
        .select(clinicalSessionSelectColumns)
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (!active) {
        return;
      }

      if (queryError) {
        setSession(null);
        setError(queryError.message);
      } else {
        setSession((data as ClinicalSessionRow | null) ?? null);
      }

      setLoading(false);
    }

    loadSession();

    return () => {
      active = false;
    };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Sesiones"
          title="Cargando sesion"
          description="Preparando el registro clinico."
        />
        <div className="h-64 animate-pulse rounded-3xl border border-rose-100 bg-white/70" />
      </div>
    );
  }

  if (error) {
    return (
      <SessionState
        title="No se pudo cargar la sesion"
        description={error}
      />
    );
  }

  if (!session) {
    return (
      <SessionState
        title="Sesion no encontrada"
        description="No existe un registro visible con ese identificador."
      />
    );
  }

  const timelineSession = mapClinicalSessionRow(session);

  return (
    <div className="space-y-8 bg-[radial-gradient(circle_at_top_left,#fff0f3_0,transparent_30rem)]">
      <PageHeader
        eyebrow="Editar sesion"
        title="Editando sesion existente"
        description={`Paciente: ${timelineSession.patientName}. Los cambios actualizaran esta sesion sin crear duplicados.`}
      />

      <SessionForm
        initialPatientId={timelineSession.patientId}
        initialStatus={normalizeSessionStatus(session.status)}
        initialValues={toSessionFormState(session)}
        mode="edit"
        patientName={timelineSession.patientName}
        sessionId={session.id}
      />
    </div>
  );
}

function SessionState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Sesiones" title={title} description={description} />
    </div>
  );
}

function toSessionFormState(session: ClinicalSessionRow): SessionFormState {
  return {
    patientId: session.patient_id ?? "",
    sessionDate: parseSessionDate(session.session_date),
    emotionalState: session.emotional_state ?? session.estado_emocional ?? "",
    axisEvaluation: session.axis_evaluation ?? "",
    sessionContent: session.session_content ?? session.desarrollo ?? "",
    clinicalHypothesis: session.clinical_hypothesis ?? "",
    interventions: session.interventions ?? session.intervenciones ?? "",
    objectiveProgress: session.objective_progress ?? "",
    keyIdeas: session.key_ideas ?? "",
    nextSessionPlan: session.next_session_plan ?? "",
    sessionSummary: session.session_summary ?? "",
    homeworkOrTasks: session.homework_or_tasks ?? session.tareas ?? "",
    observations: session.observations ?? session.observaciones ?? "",
  };
}

function parseSessionDate(value: string | null) {
  if (!value) {
    return new Date();
  }

  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}
