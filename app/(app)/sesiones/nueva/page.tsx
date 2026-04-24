import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

export default function NewSessionPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sesiones"
        title="Nueva sesión"
        description="Formulario visual inicial para registrar una atención. La persistencia se conectará más adelante."
      />

      <SectionCard>
        <form className="grid gap-5 lg:grid-cols-2">
          <Field label="Paciente" placeholder="Seleccionar paciente" />
          <Field label="Fecha y hora" placeholder="24/04/2026 09:00" />
          <Field label="Tipo de sesión" placeholder="Evaluación, seguimiento, terapia" />
          <Field label="Profesional" placeholder="Nombre del profesional" />
          <label className="lg:col-span-2">
            <span className="text-sm font-medium">Objetivo clínico</span>
            <textarea
              className="mt-2 min-h-36 w-full rounded-lg border border-border bg-white px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-teal-100"
              placeholder="Describe el foco de la sesión"
            />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-2">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground transition hover:bg-teal-800"
            >
              Guardar borrador
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-semibold transition hover:bg-background"
            >
              Cancelar
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label>
      <span className="text-sm font-medium">{label}</span>
      <input
        className="mt-2 h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-teal-100"
        placeholder={placeholder}
      />
    </label>
  );
}
