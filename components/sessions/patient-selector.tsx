import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import {
  getPatientFullName,
  patientSelectColumns,
  type PatientRow,
} from "@/lib/patient-types";
import { getAuthenticatedUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

type PatientSelectorProps = {
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

export function PatientSelector({ value, onChange }: PatientSelectorProps) {
  const [patients, setPatients] = useState<PatientRow[]>([]);
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

  return (
    <label className="block">
      <span className="text-sm font-semibold text-foreground">Paciente</span>
      <select
        name="patientId"
        value={value}
        onChange={onChange}
        disabled={loading}
        className="mt-2 h-12 w-full rounded-2xl border border-rose-100 bg-white/95 px-4 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-rose-100"
      >
        <option value="">
          {loading ? "Cargando pacientes..." : "Seleccionar paciente"}
        </option>
        {patients.map((patient) => (
          <option key={patient.id} value={patient.id}>
            {getPatientFullName(patient)}
          </option>
        ))}
      </select>
      {error ? (
        <p className="mt-2 text-sm text-rose-800">
          No se pudieron cargar pacientes: {error}
        </p>
      ) : null}
    </label>
  );
}
