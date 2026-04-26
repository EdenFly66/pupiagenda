"use client";

import { useEffect, useState } from "react";
import {
  PatientForm,
  patientRowToFormState,
} from "@/components/patients/patient-form";
import { PageHeader } from "@/components/ui/page-header";
import {
  getPatientFullName,
  patientSelectColumns,
  type PatientRow,
} from "@/lib/patient-types";
import { getAuthenticatedUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export function EditPatientView({ patientId }: { patientId: string }) {
  const [patient, setPatient] = useState<PatientRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPatient() {
      setLoading(true);
      setError(null);

      const user = await getAuthenticatedUser();
      const { data, error: queryError } = await supabase
        .from("patients")
        .select(patientSelectColumns)
        .eq("id", patientId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (!active) {
        return;
      }

      if (queryError) {
        setPatient(null);
        setError(queryError.message);
      } else {
        setPatient(data);
      }

      setLoading(false);
    }

    loadPatient();

    return () => {
      active = false;
    };
  }, [patientId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Pacientes"
          title="Cargando paciente"
          description="Preparando la ficha editable."
        />
        <div className="h-64 animate-pulse rounded-3xl border border-rose-100 bg-white/70" />
      </div>
    );
  }

  if (error) {
    return (
      <EditPatientMessage
        title="No se pudo cargar el paciente"
        description={error}
      />
    );
  }

  if (!patient) {
    return (
      <EditPatientMessage
        title="Paciente no encontrado"
        description="No existe un registro visible con ese identificador."
      />
    );
  }

  return (
    <div className="space-y-8 bg-[radial-gradient(circle_at_top_left,#fff0f3_0,transparent_28rem)]">
      <PageHeader
        eyebrow="Pacientes"
        title={`Editar ${getPatientFullName(patient)}`}
        description="Actualiza identificacion, contacto y datos clinicos sin crear duplicados."
      />

      <PatientForm
        cancelHref={`/pacientes/${patient.id}`}
        initialValues={patientRowToFormState(patient)}
        mode="edit"
        patientId={patient.id}
      />
    </div>
  );
}

function EditPatientMessage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Pacientes" title={title} description={description} />
    </div>
  );
}
