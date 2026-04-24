export type PatientRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string | null;
};

export function getPatientFullName(patient: PatientRow) {
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
