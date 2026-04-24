export type PatientStatus = "active" | "evaluation" | "paused" | "discharged";

export type Patient = {
  id: string;
  name: string;
  pronouns: string;
  age: number;
  email: string;
  phone: string;
  status: PatientStatus;
  lastSession: string;
  reason: string;
  nextSession: string;
  notes: string;
};

export const patientStatusLabels: Record<PatientStatus, string> = {
  active: "Activa",
  evaluation: "En evaluacion",
  paused: "Pausada",
  discharged: "Alta",
};

export const patientStatusFilters = [
  { label: "Todos", value: "all" },
  { label: "Activos", value: "active" },
  { label: "En evaluacion", value: "evaluation" },
  { label: "Pausados", value: "paused" },
  { label: "Alta", value: "discharged" },
] as const;

export type PatientStatusFilter = (typeof patientStatusFilters)[number]["value"];

export const mockPatients: Patient[] = [
  {
    id: "martina-lopez",
    name: "Martina Lopez",
    pronouns: "ella",
    age: 7,
    email: "martina.lopez@familia.cl",
    phone: "+56 9 6123 4801",
    status: "active",
    lastSession: "23 Abr 2026",
    reason: "Acompanamiento en lenguaje expresivo y tolerancia a cambios.",
    nextSession: "30 Abr 2026, 09:00",
    notes: "Familia comprometida con rutina semanal. Reforzar anticipacion visual.",
  },
  {
    id: "tomas-rivas",
    name: "Tomas Rivas",
    pronouns: "el",
    age: 9,
    email: "tomas.rivas@familia.cl",
    phone: "+56 9 7710 2284",
    status: "active",
    lastSession: "22 Abr 2026",
    reason: "Seguimiento de habilidades sociales y autorregulacion.",
    nextSession: "29 Abr 2026, 11:30",
    notes: "Buen avance en identificacion emocional. Mantener objetivos actuales.",
  },
  {
    id: "isidora-pena",
    name: "Isidora Pena",
    pronouns: "ella",
    age: 6,
    email: "isidora.pena@familia.cl",
    phone: "+56 9 8322 1940",
    status: "evaluation",
    lastSession: "21 Abr 2026",
    reason: "Evaluacion inicial por dificultades de atencion sostenida.",
    nextSession: "28 Abr 2026, 16:00",
    notes: "Pendiente entrevista escolar y pauta familiar complementaria.",
  },
  {
    id: "benjamin-soto",
    name: "Benjamin Soto",
    pronouns: "el",
    age: 8,
    email: "benjamin.soto@familia.cl",
    phone: "+56 9 5451 9033",
    status: "paused",
    lastSession: "10 Abr 2026",
    reason: "Proceso pausado por organizacion familiar temporal.",
    nextSession: "Por definir",
    notes: "Contactar a fin de mes para revisar continuidad del plan.",
  },
  {
    id: "renata-fuentes",
    name: "Renata Fuentes",
    pronouns: "ella",
    age: 10,
    email: "renata.fuentes@familia.cl",
    phone: "+56 9 3367 1189",
    status: "discharged",
    lastSession: "02 Abr 2026",
    reason: "Cierre de proceso tras cumplimiento de objetivos terapeuticos.",
    nextSession: "Sin sesiones agendadas",
    notes: "Alta con recomendaciones para seguimiento escolar trimestral.",
  },
  {
    id: "samuel-arias",
    name: "Samuel Arias",
    pronouns: "el",
    age: 5,
    email: "samuel.arias@familia.cl",
    phone: "+56 9 4490 2675",
    status: "evaluation",
    lastSession: "18 Abr 2026",
    reason: "Observacion inicial de comunicacion y juego funcional.",
    nextSession: "26 Abr 2026, 10:00",
    notes: "Preparar devolucion inicial con foco en fortalezas familiares.",
  },
];

export function getPatientById(id: string) {
  return mockPatients.find((patient) => patient.id === id);
}
