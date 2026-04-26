export type ClinicalSessionStatus = "draft" | "completed" | "cancelled" | "no_show";

export type ClinicalSessionPatient = {
  id: string;
  first_name: string | null;
  last_name: string | null;
};

export type ClinicalSessionRow = {
  id: string;
  patient_id: string | null;
  session_date: string | null;
  status: ClinicalSessionStatus | string | null;
  emotional_state: string | null;
  axis_evaluation: string | null;
  session_content: string | null;
  clinical_hypothesis: string | null;
  interventions: string | null;
  objective_progress: string | null;
  key_ideas: string | null;
  next_session_plan: string | null;
  session_summary: string | null;
  homework_or_tasks: string | null;
  observations: string | null;
  motivo: string | null;
  desarrollo: string | null;
  observaciones: string | null;
  intervenciones: string | null;
  estado_emocional: string | null;
  tareas: string | null;
  patients: ClinicalSessionPatient | ClinicalSessionPatient[] | null;
};

export type ClinicalTimelineSession = {
  id: string;
  patientId: string;
  patientName: string;
  sessionDate: string | null;
  status: ClinicalSessionStatus;
  motivo: string;
  summary: string;
  hasSessionSummary: boolean;
  emotionalState: string;
  axisEvaluation: string;
  sessionContent: string;
  clinicalHypothesis: string;
  interventions: string;
  objectiveProgress: string;
  keyIdeas: string;
  nextSessionPlan: string;
  homeworkOrTasks: string;
  observations: string;
};

export const clinicalSessionStatuses: ClinicalSessionStatus[] = [
  "draft",
  "completed",
  "cancelled",
  "no_show",
];

export const clinicalSessionStatusLabels: Record<ClinicalSessionStatus, string> = {
  draft: "Borrador",
  completed: "Finalizada",
  cancelled: "Cancelada",
  no_show: "No asistio",
};

export const clinicalSessionSelectColumns = `
  id,
  patient_id,
  session_date,
  status,
  emotional_state,
  axis_evaluation,
  session_content,
  clinical_hypothesis,
  interventions,
  objective_progress,
  key_ideas,
  next_session_plan,
  session_summary,
  homework_or_tasks,
  observations,
  motivo,
  desarrollo,
  observaciones,
  intervenciones,
  estado_emocional,
  tareas,
  patients (
    id,
    first_name,
    last_name
  )
`;

export function mapClinicalSessionRow(
  session: ClinicalSessionRow,
): ClinicalTimelineSession {
  const patient = Array.isArray(session.patients)
    ? session.patients[0]
    : session.patients;
  const sessionContent =
    clean(session.session_content) || clean(session.desarrollo) || "Sin contenido registrado.";
  const sessionSummary = clean(session.session_summary);
  const summary =
    sessionSummary ||
    truncateText(sessionContent, 170);

  return {
    id: session.id,
    patientId: session.patient_id ?? "",
    patientName: patient ? getClinicalPatientName(patient) : "Paciente sin nombre",
    sessionDate: session.session_date,
    status: normalizeSessionStatus(session.status),
    motivo: clean(session.motivo) || clean(session.axis_evaluation) || "Sin motivo registrado",
    summary,
    hasSessionSummary: Boolean(sessionSummary),
    emotionalState:
      clean(session.emotional_state) || clean(session.estado_emocional) || "Sin dato",
    axisEvaluation: clean(session.axis_evaluation) || "Sin evaluacion registrada.",
    sessionContent,
    clinicalHypothesis: clean(session.clinical_hypothesis) || "Sin hipotesis registrada.",
    interventions:
      clean(session.interventions) ||
      clean(session.intervenciones) ||
      "Sin intervenciones registradas.",
    objectiveProgress: clean(session.objective_progress) || "Sin progreso registrado.",
    keyIdeas: clean(session.key_ideas) || "Sin ideas clave registradas.",
    nextSessionPlan: clean(session.next_session_plan) || "Sin plan registrado.",
    homeworkOrTasks:
      clean(session.homework_or_tasks) || clean(session.tareas) || "Sin tareas registradas.",
    observations:
      clean(session.observations) ||
      clean(session.observaciones) ||
      "Sin observaciones registradas.",
  };
}

export function normalizeSessionStatus(
  status: ClinicalSessionStatus | string | null,
): ClinicalSessionStatus {
  if (
    status === "draft" ||
    status === "completed" ||
    status === "cancelled" ||
    status === "no_show"
  ) {
    return status;
  }

  return "completed";
}

function getClinicalPatientName(patient: ClinicalSessionPatient) {
  const fullName = [patient.first_name, patient.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || "Paciente sin nombre";
}

function clean(value: string | null | undefined) {
  return value?.trim() ?? "";
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim()}...`;
}
