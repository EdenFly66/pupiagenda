import type { CSSProperties } from "react";
import {
  clinicalSessionStatusLabels,
  type ClinicalTimelineSession,
} from "@/lib/clinical-session-types";
import {
  formatPatientBirthDate,
  getPatientFullName,
  type PatientRow,
} from "@/lib/patient-types";

type PatientHistoryPDFViewProps = {
  patient: PatientRow;
  sessions: ClinicalTimelineSession[];
};

const colors = {
  background: "#FFFFFF",
  border: "#E8DCDC",
  muted: "#6E6363",
  text: "#2E2A2A",
  title: "#C9436E",
};

export function PatientHistoryPDFView({
  patient,
  sessions,
}: PatientHistoryPDFViewProps) {
  return (
    <article style={styles.page}>
      <header style={styles.header}>
        <p style={styles.eyebrow}>PupiAgenda - Historial clinico</p>
        <h1 style={styles.patientName}>{getPatientFullName(patient)}</h1>
        <div style={styles.headerGrid}>
          <HeaderField label="Pronombres" value={displayValue(patient.pronouns)} />
          <HeaderField label="Nacimiento / edad" value={formatBirthAndAge(patient)} />
          <HeaderField label="Generado" value={formatLongDate(new Date())} />
        </div>
      </header>

      <main style={styles.main}>
        <PDFGroup title="Resumen clinico">
          <PDFSection
            title="Motivo de consulta segun terapeuta"
            value={patient.therapist_consultation_reason}
          />
          <PDFSection
            title="Motivo de consulta segun consultante"
            value={patient.client_consultation_reason}
          />
          <PDFSection
            title="Objetivo co-construido"
            value={patient.co_constructed_goal}
          />
        </PDFGroup>

        <PDFGroup title="Area psicosocial">
          <PDFGrid>
            <PDFSection title="Nucleo familiar" value={patient.family_composition} />
            <PDFSection
              title="Grupo primario de apoyo"
              value={patient.primary_support_group}
            />
            <PDFSection title="Ambiente social" value={patient.social_environment} />
            <PDFSection title="Educacion" value={patient.education_context} />
            <PDFSection title="Sistema judicial" value={patient.judicial_context} />
            <PDFSection title="Consumo de sustancias" value={patient.substance_use} />
            <PDFSection
              title="Antecedentes de violencia"
              value={patient.violence_history}
            />
            <PDFSection title="Riesgo suicida" value={patient.suicide_risk} />
            <PDFSection title="Tratamiento previo" value={patient.previous_treatment} />
          </PDFGrid>
        </PDFGroup>

        <PDFGroup title="Historial de sesiones">
          {sessions.length > 0 ? (
            <div style={styles.sessionsList}>
              {sessions.map((session) => (
                <SessionBlock key={session.id} session={session} />
              ))}
            </div>
          ) : (
            <p style={styles.emptyText}>No hay sesiones registradas.</p>
          )}
        </PDFGroup>
      </main>
    </article>
  );
}

function HeaderField({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.headerField}>
      <p style={styles.headerLabel}>{label}</p>
      <p style={styles.headerValue}>{value}</p>
    </div>
  );
}

function PDFGroup({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section style={styles.group}>
      <h2 style={styles.groupTitle}>{title}</h2>
      <div style={styles.groupContent}>{children}</div>
    </section>
  );
}

function PDFGrid({ children }: { children: React.ReactNode }) {
  return <div style={styles.grid}>{children}</div>;
}

function PDFSection({
  title,
  value,
}: {
  title: string;
  value: string | null | undefined;
}) {
  return (
    <section style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      <p style={styles.sectionText}>{displayValue(value)}</p>
    </section>
  );
}

function SessionBlock({ session }: { session: ClinicalTimelineSession }) {
  return (
    <article style={styles.session}>
      <div style={styles.sessionHeader}>
        <div>
          <p style={styles.sessionDate}>{formatSessionDate(session.sessionDate)}</p>
          <h3 style={styles.sessionTitle}>{session.motivo}</h3>
        </div>
        <p style={styles.sessionStatus}>
          {clinicalSessionStatusLabels[session.status]}
        </p>
      </div>

      <div style={styles.sessionGrid}>
        <PDFSection title="Estado emocional" value={session.emotionalState} />
        <PDFSection title="Resumen de sesion" value={session.summary} />
        <PDFSection title="Contenido" value={session.sessionContent} />
        <PDFSection title="Intervenciones" value={session.interventions} />
        <PDFSection
          title="Progreso en objetivos"
          value={session.objectiveProgress}
        />
        <PDFSection title="Plan proxima sesion" value={session.nextSessionPlan} />
        <PDFSection title="Tareas" value={session.homeworkOrTasks} />
        <PDFSection title="Observaciones" value={session.observations} />
      </div>
    </article>
  );
}

function formatBirthAndAge(patient: PatientRow) {
  const age = getPatientAge(patient.birth_date);
  const birthDate = patient.birth_date
    ? formatPatientBirthDate(patient.birth_date)
    : "No registrada";

  return age === null ? birthDate : `${birthDate} / ${age} anos`;
}

function getPatientAge(value: string | null) {
  if (!value) {
    return null;
  }

  const birthDate = new Date(`${value}T12:00:00`);
  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function formatSessionDate(value: string | null) {
  if (!value) {
    return "Fecha no registrada";
  }

  return formatLongDate(new Date(`${value}T12:00:00`));
}

function formatLongDate(value: Date) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
}

function displayValue(value: string | null | undefined) {
  return value?.trim() || "No registrado";
}

const styles: Record<string, CSSProperties> = {
  page: {
    backgroundColor: colors.background,
    boxSizing: "border-box",
    color: colors.text,
    fontFamily: "Arial, Helvetica, sans-serif",
    padding: "48px 56px",
    width: "794px",
  },
  header: {
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: "24px",
  },
  eyebrow: {
    color: colors.muted,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.6px",
    margin: 0,
    textTransform: "uppercase",
  },
  patientName: {
    color: colors.text,
    fontSize: "26px",
    fontWeight: 700,
    lineHeight: 1.25,
    margin: "12px 0 0",
  },
  headerGrid: {
    display: "grid",
    gap: "16px",
    gridTemplateColumns: "1fr 1fr 1fr",
    marginTop: "18px",
  },
  headerField: {
    minWidth: 0,
  },
  headerLabel: {
    color: colors.title,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.2px",
    margin: 0,
    textTransform: "uppercase",
  },
  headerValue: {
    color: colors.text,
    fontSize: "13px",
    lineHeight: 1.45,
    margin: "5px 0 0",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    marginTop: "30px",
  },
  group: {
    breakInside: "avoid",
  },
  groupTitle: {
    color: colors.title,
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: 1.3,
    margin: "0 0 14px",
  },
  groupContent: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  grid: {
    display: "grid",
    gap: "12px",
    gridTemplateColumns: "1fr 1fr",
  },
  section: {
    backgroundColor: colors.background,
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    breakInside: "avoid",
    padding: "14px",
  },
  sectionTitle: {
    color: colors.title,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1px",
    lineHeight: 1.3,
    margin: 0,
    textTransform: "uppercase",
  },
  sectionText: {
    color: colors.text,
    fontSize: "12px",
    lineHeight: 1.65,
    margin: "10px 0 0",
    whiteSpace: "pre-wrap",
  },
  sessionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  session: {
    border: `1px solid ${colors.border}`,
    borderRadius: "14px",
    breakInside: "avoid",
    padding: "16px",
  },
  sessionHeader: {
    alignItems: "flex-start",
    borderBottom: `1px solid ${colors.border}`,
    display: "flex",
    gap: "16px",
    justifyContent: "space-between",
    paddingBottom: "12px",
  },
  sessionDate: {
    color: colors.title,
    fontSize: "12px",
    fontWeight: 700,
    margin: 0,
  },
  sessionTitle: {
    color: colors.text,
    fontSize: "15px",
    fontWeight: 700,
    lineHeight: 1.35,
    margin: "5px 0 0",
  },
  sessionStatus: {
    border: `1px solid ${colors.border}`,
    borderRadius: "999px",
    color: colors.text,
    fontSize: "11px",
    fontWeight: 700,
    margin: 0,
    padding: "5px 9px",
    whiteSpace: "nowrap",
  },
  sessionGrid: {
    display: "grid",
    gap: "12px",
    gridTemplateColumns: "1fr 1fr",
    marginTop: "14px",
  },
  emptyText: {
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    color: colors.muted,
    fontSize: "13px",
    lineHeight: 1.6,
    margin: 0,
    padding: "16px",
  },
};
