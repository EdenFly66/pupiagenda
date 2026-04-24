"use client";

import { useMemo, useState } from "react";
import { ClinicalTimelineItem } from "@/components/history/clinical-timeline-item";
import { HistoryFilters } from "@/components/history/history-filters";
import type {
  ClinicalSession,
  ClinicalSessionStatusFilter,
} from "@/lib/mock-clinical-sessions";

export function ClinicalTimeline({
  sessions,
}: {
  sessions: ClinicalSession[];
}) {
  const [query, setQuery] = useState("");
  const [patientId, setPatientId] = useState("all");
  const [status, setStatus] = useState<ClinicalSessionStatusFilter>("all");

  const filteredSessions = useMemo(() => {
    const normalizedQuery = normalize(query);

    return sessions.filter((session) => {
      const matchesPatient = patientId === "all" || session.patientId === patientId;
      const matchesStatus = status === "all" || session.status === status;
      const searchable = normalize(
        [
          session.patientName,
          session.focus,
          session.summary,
          session.development,
          session.interventions,
          session.observations,
          session.tasks,
        ].join(" "),
      );

      return (
        matchesPatient &&
        matchesStatus &&
        searchable.includes(normalizedQuery)
      );
    });
  }, [patientId, query, sessions, status]);

  return (
    <div className="space-y-6">
      <HistoryFilters
        query={query}
        patientId={patientId}
        status={status}
        onQueryChange={setQuery}
        onPatientChange={setPatientId}
        onStatusChange={setStatus}
      />

      {filteredSessions.length > 0 ? (
        <div className="relative space-y-5 before:absolute before:bottom-6 before:left-[7px] before:top-6 before:w-px before:bg-rose-200">
          {filteredSessions.map((session) => (
            <ClinicalTimelineItem key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-rose-200 bg-white/80 p-8 text-center">
          <p className="font-semibold">No hay sesiones para esos filtros.</p>
          <p className="mt-2 text-sm text-muted">
            Ajusta el paciente, estado o texto de busqueda.
          </p>
        </div>
      )}
    </div>
  );
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}
