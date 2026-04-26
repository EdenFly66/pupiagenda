export type ClinicalTemplateData = {
  patient_name?: string | null;
  session_date?: string | Date | null;
  emotional_state?: string | null;
  session_content?: string | null;
  interventions?: string | null;
  objective_progress?: string | null;
  observations?: string | null;
};

export function generateSessionSummary(data: ClinicalTemplateData) {
  const sections = [
    sentence(
      `Sesion clinica de ${patientName(data.patient_name)} realizada el ${sessionDate(data.session_date)}.`,
    ),
    data.emotional_state
      ? `La paciente se presenta con estado emocional ${clean(data.emotional_state)}.`
      : "",
    data.session_content
      ? `Durante la sesion se aborda: ${clean(data.session_content)}`
      : "",
    data.interventions
      ? `Se realizan las siguientes intervenciones: ${clean(data.interventions)}`
      : "",
    data.objective_progress
      ? `Respecto de los objetivos, se observa: ${clean(data.objective_progress)}`
      : "",
    data.observations
      ? `Observaciones clinicas relevantes: ${clean(data.observations)}`
      : "",
  ];

  return joinParagraph(sections);
}

export function generateClinicalEvolution(data: ClinicalTemplateData) {
  const sections = [
    sentence(
      `Evolucion clinica de ${patientName(data.patient_name)} al ${sessionDate(data.session_date)}.`,
    ),
    data.emotional_state
      ? `En el plano emocional, se registra estado ${clean(data.emotional_state)}.`
      : "",
    data.session_content
      ? `El proceso terapeutico muestra elementos asociados a: ${clean(data.session_content)}`
      : "",
    data.interventions
      ? `Las intervenciones aplicadas se orientan a: ${clean(data.interventions)}`
      : "",
    data.objective_progress
      ? `Avance observado en objetivos: ${clean(data.objective_progress)}`
      : "",
    data.observations
      ? `Se consideran como antecedentes para seguimiento: ${clean(data.observations)}`
      : "",
  ];

  return joinParagraph(sections);
}

function patientName(value: string | null | undefined) {
  return clean(value) || "la paciente";
}

function sessionDate(value: string | Date | null | undefined) {
  if (!value) {
    return "fecha no registrada";
  }

  const date = value instanceof Date ? value : new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return clean(String(value)) || "fecha no registrada";
  }

  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function clean(value: string | null | undefined) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function sentence(value: string) {
  const cleanValue = clean(value);

  if (!cleanValue || /[.!?]$/.test(cleanValue)) {
    return cleanValue;
  }

  return `${cleanValue}.`;
}

function joinParagraph(values: string[]) {
  return values.map(clean).filter(Boolean).join(" ");
}
