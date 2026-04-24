"use client";

import { useMemo, useState } from "react";
import { PatientCard } from "@/components/patients/patient-card";
import { PatientFilters } from "@/components/patients/patient-filters";
import { PatientSearch } from "@/components/patients/patient-search";
import {
  mockPatients,
  type PatientStatusFilter,
} from "@/lib/mock-patients";

export function PatientsView() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<PatientStatusFilter>("all");

  const filteredPatients = useMemo(() => {
    const normalizedQuery = normalize(query);

    return mockPatients.filter((patient) => {
      const matchesStatus = status === "all" || patient.status === status;
      const searchable = normalize(
        `${patient.name} ${patient.email} ${patient.phone}`,
      );
      const matchesQuery = searchable.includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [query, status]);

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-rose-100 bg-[#fffaf8] p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <PatientSearch value={query} onChange={setQuery} />
          <PatientFilters value={status} onChange={setStatus} />
        </div>
      </div>

      {filteredPatients.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-rose-200 bg-white/80 p-8 text-center">
          <p className="font-semibold">No hay pacientes para esos filtros.</p>
          <p className="mt-2 text-sm text-muted">
            Prueba con otro estado o revisa el texto de busqueda.
          </p>
        </div>
      )}
    </div>
  );
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}
