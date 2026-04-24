export type PatientStatus = "active" | "inactive" | "discharged" | "paused";

export type PatientRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  pronouns: string | null;
  birth_date: string | null;
  gender: string | null;
  civil_status: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  health_insurance: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  appointment_schedule: string | null;
  therapist_consultation_reason: string | null;
  client_consultation_reason: string | null;
  co_constructed_goal: string | null;
  guardian_name: string | null;
  guardian_email: string | null;
  guardian_phone: string | null;
  family_composition: string | null;
  primary_support_group: string | null;
  social_environment: string | null;
  education_context: string | null;
  judicial_context: string | null;
  substance_use: string | null;
  violence_history: string | null;
  suicide_risk: string | null;
  previous_treatment: string | null;
  status: PatientStatus | string | null;
  created_at: string | null;
};

export const patientSelectColumns = `
  id,
  first_name,
  last_name,
  pronouns,
  birth_date,
  gender,
  civil_status,
  email,
  phone,
  address,
  health_insurance,
  emergency_contact_name,
  emergency_contact_phone,
  appointment_schedule,
  therapist_consultation_reason,
  client_consultation_reason,
  co_constructed_goal,
  guardian_name,
  guardian_email,
  guardian_phone,
  family_composition,
  primary_support_group,
  social_environment,
  education_context,
  judicial_context,
  substance_use,
  violence_history,
  suicide_risk,
  previous_treatment,
  status,
  created_at
`;

export function getPatientFullName(patient: Pick<PatientRow, "first_name" | "last_name">) {
  const fullName = [patient.first_name, patient.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || "Paciente sin nombre";
}

export function formatPatientCreatedAt(value: string | null) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatPatientBirthDate(value: string | null) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

export function displayValue(value: string | null | undefined) {
  return value?.trim() || "Sin dato";
}
