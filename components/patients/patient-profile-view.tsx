"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import {
  formatPatientCreatedAt,
  getPatientFullName,
  type PatientRow,
} from "@/lib/patient-types";
import { supabase } from "@/lib/supabase";

export function PatientProfileView({ patientId }: { patientId: string }) {
  const [patient, setPatient] = useState<PatientRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPatient() {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from("patients")
        .select("id, first_name, last_name, email, phone, created_at")
        .eq("id", patientId)
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
          eyebrow="Perfil de paciente"
          title="Cargando paciente"
          description="Consultando informacion desde Supabase."
        />
        <div className="h-64 animate-pulse rounded-3xl border border-rose-100 bg-white/70" />
      </div>
    );
  }

  if (error) {
    return (
      <PatientProfileMessage
        title="No se pudo cargar el paciente"
        description={error}
      />
    );
  }

  if (!patient) {
    return (
      <PatientProfileMessage
        title="Paciente no encontrado"
        description="No existe un registro visible con ese identificador."
      />
    );
  }

  return (
    <div className="space-y-6 bg-[radial-gradient(circle_at_top_left,#fff0f3_0,transparent_28rem)]">
      <PageHeader
        eyebrow="Perfil de paciente"
        title={getPatientFullName(patient)}
        description="Ficha basica leida desde la tabla patients en Supabase."
        action={<BackButton />}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <SectionCard className="rounded-3xl border-rose-100 bg-white/90">
          <h3 className="text-base font-semibold">Datos de contacto</h3>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Detail label="Nombre" value={patient.first_name ?? "Sin dato"} />
            <Detail label="Apellido" value={patient.last_name ?? "Sin dato"} />
            <Detail label="Correo" value={patient.email ?? "Sin correo"} />
            <Detail label="Telefono" value={patient.phone ?? "Sin telefono"} />
          </dl>
        </SectionCard>

        <SectionCard className="rounded-3xl border-rose-100 bg-[#fffaf8]">
          <h3 className="text-base font-semibold">Registro</h3>
          <p className="mt-3 text-sm leading-6 text-muted">
            Creado el {formatPatientCreatedAt(patient.created_at)}.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted">
            La informacion clinica se agregara cuando existan mas campos y
            backend de sesiones.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}

function PatientProfileMessage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Perfil de paciente"
        title={title}
        description={description}
        action={<BackButton />}
      />
    </div>
  );
}

function BackButton() {
  return (
    <Link
      href="/pacientes"
      className="inline-flex h-11 items-center rounded-2xl border border-rose-100 bg-white px-5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-rose-50"
    >
      Volver
    </Link>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-rose-50/60 p-4">
      <dt className="text-xs font-semibold uppercase tracking-normal text-muted">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
