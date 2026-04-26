export type PatientDocumentType =
  | "ficha_ingreso"
  | "consentimiento"
  | "psicometria"
  | "informe"
  | "certificado"
  | "derivacion"
  | "otro";

export type PatientDocumentRow = {
  id: string;
  patient_id: string;
  user_id: string | null;
  title: string | null;
  document_type: PatientDocumentType | string | null;
  file_name: string | null;
  file_path: string | null;
  file_type: string | null;
  file_size_bytes: number | null;
  created_at: string | null;
};

export const patientDocumentTypes: PatientDocumentType[] = [
  "ficha_ingreso",
  "consentimiento",
  "psicometria",
  "informe",
  "certificado",
  "derivacion",
  "otro",
];

export const patientDocumentTypeLabels: Record<PatientDocumentType, string> = {
  ficha_ingreso: "Ficha de ingreso",
  consentimiento: "Consentimiento",
  psicometria: "Psicometria",
  informe: "Informe",
  certificado: "Certificado",
  derivacion: "Derivacion",
  otro: "Otro",
};

export const patientDocumentSelectColumns = `
  id,
  patient_id,
  user_id,
  title,
  document_type,
  file_name,
  file_path,
  file_type,
  file_size_bytes,
  created_at
`;

export function getPatientDocumentTypeLabel(value: string | null | undefined) {
  if (!value) {
    return "No registrado";
  }

  return patientDocumentTypeLabels[value as PatientDocumentType] ?? value;
}
