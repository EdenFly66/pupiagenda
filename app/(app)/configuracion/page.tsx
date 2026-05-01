import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { ThemeSelector } from "@/components/theme/theme-selector";

const settings = [
  {
    title: "Datos de la consulta",
    description: "Nombre, especialidad y datos de contacto visibles en la app.",
  },
  {
    title: "Preferencias de agenda",
    description: "Duracion por defecto y horarios visibles.",
  },
  {
    title: "Plantillas clinicas",
    description: "Textos base para notas, objetivos y sesiones.",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sistema"
        title="Configuracion"
        description="Preferencias generales para mantener la experiencia ordenada."
      />

      <SectionCard>
        <div className="mb-5">
          <h3 className="text-base font-semibold">Apariencia</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Personaliza la paleta visual de tu espacio clínico.
          </p>
        </div>
        <ThemeSelector />
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        {settings.map((item) => (
          <SectionCard key={item.title}>
            <h3 className="text-base font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
            <button
              type="button"
              className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-2xl border border-leaf bg-white px-4 text-sm font-semibold text-leaf-foreground transition hover:bg-leaf-soft hover:text-leaf-strong sm:w-auto"
            >
              Revisar
            </button>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
