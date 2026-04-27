type PatientSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function PatientSearch({ value, onChange }: PatientSearchProps) {
  return (
    <label className="block">
      <span className="sr-only">Buscar paciente</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-2xl border border-rose-100 bg-white/90 px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-placeholder focus:border-brand focus:ring-4 focus:ring-rose-soft"
        placeholder="Buscar por nombre, correo o telefono"
        type="search"
      />
    </label>
  );
}
