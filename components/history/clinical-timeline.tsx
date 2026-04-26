"use client";

import { useEffect, useMemo, useState } from "react";
import { ClinicalTimelineItem } from "@/components/history/clinical-timeline-item";
import { HistoryFilters } from "@/components/history/history-filters";
import {
  mapClinicalSessionRow,
  clinicalSessionSelectColumns,
  type ClinicalSessionRow,
  type ClinicalTimelineSession,
} from "@/lib/clinical-session-types";
import { supabase } from "@/lib/supabase";

export function ClinicalTimeline({
  initialPatientId,
}: {
  initialPatientId?: string;
}) {
  const [sessions, setSessions] = useState<ClinicalTimelineSession[]>([]);
  const [query, setQuery] = useState("");
  const [patientId, setPatientId] = useState(initialPatientId ?? "all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSessions() {
      setLoading(true);
      setError(null);

      let request = supabase
        .from("clinical_sessions")
        .select(clinicalSessionSelectColumns)
        .order("session_date", { ascending: false });

      if (initialPatientId) {
        request = request.eq("patient_id", initialPatientId);
      }

      const { data, error: queryError } = await request;

      if (!active) {
        return;
      }

      if (queryError) {
        setSessions([]);
        setError(queryError.message);
      } else {
        setSessions((data as ClinicalSessionRow[] | null ?? []).map(mapClinicalSessionRow));
      }

      setLoading(false);
    }

    loadSessions();

    return () => {
      active = false;
    };
  }, [initialPatientId]);

  const patientOptions = useMemo(() => {
    const patients = new Map<string, string>();

    sessions.forEach((session) => {
      if (session.patientId) {
        patients.set(session.patientId, session.patientName);
      }
    });

    return Array.from(patients, ([id, name]) => ({ id, name })).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    const normalizedQuery = normalize(query);

    return sessions.filter((session) => {
      const matchesPatient = patientId === "all" || session.patientId === patientId;
      const searchable = normalize(
        [
          session.patientName,
          session.motivo,
          session.summary,
          session.status,
          session.emotionalState,
          session.axisEvaluation,
          session.sessionContent,
          session.clinicalHypothesis,
          session.interventions,
          session.objectiveProgress,
          session.keyIdeas,
          session.nextSessionPlan,
          session.homeworkOrTasks,
          session.observations,
        ].join(" "),
      );

      return matchesPatient && searchable.includes(normalizedQuery);
    });
  }, [patientId, query, sessions]);

  return (
    <div className="space-y-6">
      <HistoryFilters
        constrainedPatientId={initialPatientId}
        query={query}
        patientId={patientId}
        patients={patientOptions}
        onQueryChange={setQuery}
        onPatientChange={setPatientId}
      />

      {loading ? (
        <TimelineLoading />
      ) : error ? (
        <TimelineError message={error} />
      ) : filteredSessions.length > 0 ? (
        <div className="relative space-y-5 before:absolute before:bottom-6 before:left-[7px] before:top-6 before:w-px before:bg-rose-200">
          {filteredSessions.map((session) => (
            <ClinicalTimelineItem key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-rose-200 bg-white/80 p-8 text-center">
          <p className="font-semibold">
            {sessions.length === 0
              ? "No hay sesiones registradas."
              : "No hay sesiones para esos filtros."}
          </p>
          <p className="mt-2 text-sm text-muted">
            {sessions.length === 0
              ? "Cuando guardes sesiones clinicas apareceran aqui."
              : "Ajusta el paciente o texto de busqueda."}
          </p>
        </div>
      )}
    </div>
  );
}

function TimelineLoading() {
  return (
    <div className="relative space-y-5 before:absolute before:bottom-6 before:left-[7px] before:top-6 before:w-px before:bg-rose-200">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="relative pl-8">
          <div className="absolute left-0 top-7 size-4 rounded-full border-4 border-white bg-rose-200" />
          <div className="h-56 animate-pulse rounded-3xl border border-rose-100 bg-white/70 p-6 shadow-sm">
            <div className="h-5 w-1/3 rounded-full bg-rose-100" />
            <div className="mt-4 h-4 w-1/4 rounded-full bg-rose-100" />
            <div className="mt-8 space-y-3">
              <div className="h-4 rounded-full bg-rose-100" />
              <div className="h-4 w-5/6 rounded-full bg-rose-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineError({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-white/90 p-8">
      <p className="font-semibold text-rose-900">
        No se pudo cargar el historial clinico.
      </p>
      <p className="mt-2 text-sm leading-6 text-muted">{message}</p>
    </div>
  );
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}
