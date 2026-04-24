import { mockPatients } from "@/lib/mock-patients";

export type ClinicalSessionStatus = "draft" | "finalized" | "pending";

export type ClinicalSession = {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  sessionNumber: number;
  focus: string;
  summary: string;
  status: ClinicalSessionStatus;
  development: string;
  interventions: string;
  observations: string;
  tasks: string;
};

export const clinicalSessionStatusLabels: Record<ClinicalSessionStatus, string> = {
  draft: "Borrador",
  finalized: "Finalizada",
  pending: "Pendiente",
};

export const clinicalSessionStatusFilters = [
  { label: "Todos", value: "all" },
  { label: "Borrador", value: "draft" },
  { label: "Finalizada", value: "finalized" },
  { label: "Pendiente", value: "pending" },
] as const;

export type ClinicalSessionStatusFilter =
  (typeof clinicalSessionStatusFilters)[number]["value"];

function patientName(patientId: string) {
  return mockPatients.find((patient) => patient.id === patientId)?.name ?? patientId;
}

const clinicalSessions: ClinicalSession[] = [
  {
    id: "session-006",
    patientId: "martina-lopez",
    patientName: patientName("martina-lopez"),
    date: "2026-04-23",
    sessionNumber: 12,
    focus: "Lenguaje expresivo",
    summary: "Se trabajo narracion breve, turnos conversacionales y anticipacion.",
    status: "finalized",
    development:
      "Martina llego tranquila y participo con buena disposicion. Se inicio con rutina de bienvenida, luego actividades de narracion con apoyo visual. Logro sostener la atencion durante bloques cortos y pidio pausas con guia verbal.",
    interventions:
      "Modelado de frases, preguntas abiertas, apoyo visual secuenciado y refuerzo de turnos conversacionales.",
    observations:
      "Mejor respuesta cuando las instrucciones se presentan en pasos breves. Se observa menor frustracion frente a correcciones.",
    tasks:
      "Practicar relato de tres pasos con una actividad cotidiana y registrar dos ejemplos para la proxima sesion.",
  },
  {
    id: "session-005",
    patientId: "tomas-rivas",
    patientName: patientName("tomas-rivas"),
    date: "2026-04-22",
    sessionNumber: 9,
    focus: "Autorregulacion",
    summary: "Sesion centrada en reconocimiento emocional y acuerdos de pausa.",
    status: "draft",
    development:
      "Tomas inicio con energia alta. Se utilizo escala emocional y se revisaron situaciones escolares recientes. Pudo identificar senales corporales previas a frustracion con apoyo de ejemplos concretos.",
    interventions:
      "Escala de intensidad, respiracion guiada, role play de solicitud de ayuda y cierre con acuerdo familiar.",
    observations:
      "Requiere mas tiempo para transitar entre actividades. Responde bien a opciones limitadas.",
    tasks:
      "Usar tarjeta de pausa una vez al dia y registrar en que momento fue util.",
  },
  {
    id: "session-004",
    patientId: "isidora-pena",
    patientName: patientName("isidora-pena"),
    date: "2026-04-21",
    sessionNumber: 2,
    focus: "Evaluacion inicial",
    summary: "Se completo observacion de juego, atencion sostenida y respuesta a instrucciones.",
    status: "pending",
    development:
      "Isidora exploro materiales con interes. La atencion fue variable, con mejor desempeno en tareas manipulativas. Se recogieron antecedentes complementarios para preparar devolucion.",
    interventions:
      "Observacion estructurada, juego guiado, instrucciones de uno y dos pasos y pausa sensorial breve.",
    observations:
      "Pendiente integrar informacion escolar. La familia refiere cambios recientes en rutina de sueno.",
    tasks:
      "Enviar pauta familiar completada antes de la siguiente sesion.",
  },
  {
    id: "session-003",
    patientId: "samuel-arias",
    patientName: patientName("samuel-arias"),
    date: "2026-04-18",
    sessionNumber: 1,
    focus: "Comunicacion y juego",
    summary: "Primera observacion de comunicacion espontanea y juego funcional.",
    status: "finalized",
    development:
      "Samuel se mostro reservado al inicio y luego aumento la exploracion. Se observaron iniciativas comunicativas principalmente gestuales y buena respuesta a imitacion.",
    interventions:
      "Juego paralelo, imitacion motora, espera activa, expansion comunicativa y seguimiento de iniciativa.",
    observations:
      "Se recomienda mantener sesiones con alta predictibilidad y pocos materiales simultaneos.",
    tasks:
      "Realizar juego de turnos simple cinco minutos diarios.",
  },
  {
    id: "session-002",
    patientId: "benjamin-soto",
    patientName: patientName("benjamin-soto"),
    date: "2026-04-10",
    sessionNumber: 7,
    focus: "Control mensual",
    summary: "Revision de objetivos y acuerdo de pausa temporal del proceso.",
    status: "finalized",
    development:
      "Se revisaron avances del ultimo mes y disponibilidad familiar. Benjamin participo en actividad breve de cierre y eligio estrategias que le resultaron utiles.",
    interventions:
      "Revision colaborativa de objetivos, cierre simbolico y entrega de recomendaciones de continuidad.",
    observations:
      "Pausa coordinada por organizacion familiar. Sin indicadores de retroceso en la ultima revision.",
    tasks:
      "Mantener rutina de lectura compartida dos veces por semana.",
  },
  {
    id: "session-001",
    patientId: "renata-fuentes",
    patientName: patientName("renata-fuentes"),
    date: "2026-04-02",
    sessionNumber: 14,
    focus: "Cierre de proceso",
    summary: "Sesion de alta con devolucion y recomendaciones de seguimiento.",
    status: "finalized",
    development:
      "Renata participo activamente en la revision de logros. Se converso con familia sobre senales de alerta y estrategias de mantencion.",
    interventions:
      "Devolucion de avances, plan de mantencion, recomendaciones escolares y cierre del proceso.",
    observations:
      "Objetivos cumplidos. Se sugiere seguimiento escolar trimestral preventivo.",
    tasks:
      "Enviar informe final a familia y colegio.",
  },
];

export const mockClinicalSessions = [...clinicalSessions].sort((a, b) =>
  b.date.localeCompare(a.date),
);
