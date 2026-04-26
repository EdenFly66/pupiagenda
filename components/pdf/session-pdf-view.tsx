import type { CSSProperties } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  clinicalSessionStatusLabels,
  type ClinicalTimelineSession,
} from "@/lib/clinical-session-types";

type SessionPDFViewProps = {
  session: ClinicalTimelineSession;
};

const colors = {
  background: "#FFFFFF",
  border: "#E8DCDC",
  muted: "#6E6363",
  text: "#2E2A2A",
  title: "#C9436E",
};

export function SessionPDFView({ session }: SessionPDFViewProps) {
  return (
    <article style={styles.page}>
      <header style={styles.header}>
        <p style={styles.eyebrow}>PupiAgenda - Informe de sesion clinica</p>
        <h1 style={styles.patientName}>{session.patientName}</h1>
        <div style={styles.headerGrid}>
          <HeaderField label="Fecha" value={formatSessionDate(session.sessionDate)} />
          <HeaderField
            label="Estado"
            value={clinicalSessionStatusLabels[session.status]}
          />
          <HeaderField label="Estado emocional" value={session.emotionalState} />
        </div>
      </header>

      <main style={styles.main}>
        <PDFSection title="Motivo de consulta" value={session.motivo} />
        <PDFSection title="Contenido de sesion" value={session.sessionContent} />
        <PDFSection title="Hipotesis clinica" value={session.clinicalHypothesis} />
        <PDFSection title="Intervenciones" value={session.interventions} />
        <PDFSection
          title="Progreso en objetivos"
          value={session.objectiveProgress}
        />
        <PDFSection title="Ideas principales" value={session.keyIdeas} />
        <PDFSection title="Plan proxima sesion" value={session.nextSessionPlan} />
        <PDFSection title="Tareas" value={session.homeworkOrTasks} />
        <PDFSection title="Observaciones" value={session.observations} />
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

function PDFSection({ title, value }: { title: string; value: string }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <p style={styles.sectionText}>{value || "No registrado"}</p>
    </section>
  );
}

function formatSessionDate(value: string | null) {
  if (!value) {
    return "No registrada";
  }

  return format(new Date(`${value}T12:00:00`), "d 'de' MMMM yyyy", {
    locale: es,
  });
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
    fontSize: "14px",
    lineHeight: 1.45,
    margin: "5px 0 0",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginTop: "30px",
  },
  section: {
    backgroundColor: colors.background,
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    breakInside: "avoid",
    padding: "16px",
  },
  sectionTitle: {
    color: colors.title,
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "1.2px",
    lineHeight: 1.3,
    margin: 0,
    textTransform: "uppercase",
  },
  sectionText: {
    color: colors.text,
    fontSize: "13px",
    lineHeight: 1.65,
    margin: "12px 0 0",
    whiteSpace: "pre-wrap",
  },
};
