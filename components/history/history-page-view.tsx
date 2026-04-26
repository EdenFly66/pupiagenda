"use client";

import { useEffect, useState } from "react";
import { ClinicalTimeline } from "@/components/history/clinical-timeline";
import { PageHeader } from "@/components/ui/page-header";
import {
  getPatientFullName,
  patientSelectColumns,
  type PatientRow,
} from "@/lib/patient-types";
import { supabase } from "@/lib/supabase";

export function HistoryPageView({
  initialPatientId,
}: {
  initialPatientId?: string;
}) {
  const [patientName, setPatientName] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPatientName() {
      if (!initialPatientId) {
        setPatientName(null);
        return;
      }

      const { data } = await supabase
        .from("patients")
        .select(patientSelectColumns)
        .eq("id", initialPatientId)
        .maybeSingle();

      if (!active) {
        return;
      }

      setPatientName(data ? getPatientFullName(data as PatientRow) : null);
    }

    loadPatientName();

    return () => {
      active = false;
    };
  }, [initialPatientId]);

  const isPatientHistory = Boolean(initialPatientId);

  return (
    <div className="space-y-8 bg-[radial-gradient(circle_at_top_left,#fff0f3_0,transparent_30rem)]">
      <PageHeader
        eyebrow="Registro"
        title={
          isPatientHistory
            ? `Historial clinico de ${patientName ?? "paciente"}`
            : "Historial clinico"
        }
        description={
          isPatientHistory
            ? "Timeline filtrado por paciente, con busqueda dentro de sus sesiones."
            : "Timeline con sesiones reales guardadas en Supabase."
        }
      />

      <ClinicalTimeline
        key={initialPatientId ?? "all"}
        initialPatientId={initialPatientId}
      />
    </div>
  );
}
