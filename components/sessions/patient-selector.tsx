import type { ChangeEvent } from "react";
import { mockPatients } from "@/lib/mock-patients";

type PatientSelectorProps = {
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

export function PatientSelector({ value, onChange }: PatientSelectorProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-foreground">Paciente</span>
      <select
        name="patientId"
        value={value}
        onChange={onChange}
        className="mt-2 h-12 w-full rounded-2xl border border-rose-100 bg-white/95 px-4 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-rose-100"
      >
        <option value="">Seleccionar paciente</option>
        {mockPatients.map((patient) => (
          <option key={patient.id} value={patient.id}>
            {patient.name}
          </option>
        ))}
      </select>
    </label>
  );
}
