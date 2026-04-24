export type ClinicalSessionStatus = "finalized";

export type ClinicalSessionPatient = {
  id: string;
  first_name: string | null;
  last_name: string | null;
};

export type ClinicalSessionRow = {
  id: string;
  patient_id: string | null;
  session_date: string | null;
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
  motivo: string;
  summary: string;
  status: ClinicalSessionStatus;
  desarrollo: string;
  intervenciones: string;
  observaciones: string;
  tareas: string;
};

export const clinicalSessionStatusLabels: Record<ClinicalSessionStatus, string> = {
  finalized: "Finalizada",
};

export function mapClinicalSessionRow(
  session: ClinicalSessionRow,
): ClinicalTimelineSession {
  const patient = Array.isArray(session.patients)
    ? session.patients[0]
    : session.patients;

  const desarrollo = session.desarrollo?.trim() || "Sin desarrollo registrado.";

  return {
    id: session.id,
    patientId: session.patient_id ?? "",
    patientName: patient ? getClinicalPatientName(patient) : "Paciente sin nombre",
    sessionDate: session.session_date,
    motivo: session.motivo?.trim() || "Sin motivo registrado",
    summary: truncateText(desarrollo, 170),
    status: "finalized",
    desarrollo,
    intervenciones:
      session.intervenciones?.trim() || "Sin intervenciones registradas.",
    observaciones:
      session.observaciones?.trim() || "Sin observaciones registradas.",
    tareas: session.tareas?.trim() || "Sin tareas registradas.",
  };
}

function getClinicalPatientName(patient: ClinicalSessionPatient) {
  const fullName = [patient.first_name, patient.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || "Paciente sin nombre";
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim()}...`;
}
