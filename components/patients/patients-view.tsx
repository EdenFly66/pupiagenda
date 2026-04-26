"use client";

import { useEffect, useMemo, useState } from "react";
import { PatientCard } from "@/components/patients/patient-card";
import { PatientSearch } from "@/components/patients/patient-search";
import {
  getPatientFullName,
  patientSelectColumns,
  type PatientRow,
} from "@/lib/patient-types";
import { getAuthenticatedUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export function PatientsView() {
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPatients() {
      setLoading(true);
      setError(null);

      const user = await getAuthenticatedUser();
      const { data, error: queryError } = await supabase
        .from("patients")
        .select(patientSelectColumns)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!active) {
        return;
      }

      if (queryError) {
        setPatients([]);
        setError(queryError.message);
      } else {
        setPatients(data ?? []);
      }

      setLoading(false);
    }

    loadPatients();

    return () => {
      active = false;
    };
  }, []);

  const filteredPatients = useMemo(() => {
    const normalizedQuery = normalize(query);

    return patients.filter((patient) => {
      const searchable = normalize(
        [
          getPatientFullName(patient),
          patient.first_name,
          patient.last_name,
          patient.email,
          patient.phone,
          patient.pronouns,
          patient.status,
          patient.guardian_name,
          patient.therapist_consultation_reason,
          patient.client_consultation_reason,
        ].join(" "),
      );

      return searchable.includes(normalizedQuery);
    });
  }, [patients, query]);

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-rose-100 bg-[#fffaf8] p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <PatientSearch value={query} onChange={setQuery} />
          <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-medium text-muted">
            {loading ? "Cargando..." : `${filteredPatients.length} pacientes`}
          </div>
        </div>
      </div>

      {loading ? (
        <PatientsLoading />
      ) : error ? (
        <PatientsError message={error} />
      ) : filteredPatients.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-rose-200 bg-white/80 p-8 text-center">
          <p className="font-semibold">
            {query ? "No hay pacientes para esa busqueda." : "No hay pacientes."}
          </p>
          <p className="mt-2 text-sm text-muted">
            {query
              ? "Prueba con otro nombre, correo o telefono."
              : "Crea una ficha para comenzar el seguimiento."}
          </p>
        </div>
      )}
    </div>
  );
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function PatientsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-72 animate-pulse rounded-3xl border border-rose-100 bg-white/70 p-5 shadow-sm"
        >
          <div className="h-5 w-2/3 rounded-full bg-rose-100" />
          <div className="mt-3 h-4 w-1/3 rounded-full bg-rose-100" />
          <div className="mt-8 space-y-3">
            <div className="h-4 rounded-full bg-rose-100" />
            <div className="h-4 rounded-full bg-rose-100" />
            <div className="h-4 w-4/5 rounded-full bg-rose-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PatientsError({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-white/90 p-8">
      <p className="font-semibold text-rose-900">No se pudieron cargar pacientes.</p>
      <p className="mt-2 text-sm leading-6 text-muted">{message}</p>
      <p className="mt-4 text-sm leading-6 text-muted">
        Revisa tu conexion e intenta nuevamente. Si el problema persiste,
        vuelve a iniciar sesion.
      </p>
    </div>
  );
}
