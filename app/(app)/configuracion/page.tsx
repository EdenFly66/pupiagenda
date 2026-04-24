import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

const settings = [
  { title: "Datos de la consulta", description: "Nombre, especialidad y datos de contacto." },
  { title: "Preferencias de agenda", description: "Duración por defecto y horarios visibles." },
  { title: "Plantillas clínicas", description: "Textos base para notas y objetivos de sesión." },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sistema"
        title="Configuración"
        description="Opciones iniciales del producto. Aún no hay guardado ni autenticación."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {settings.map((item) => (
          <SectionCard key={item.title}>
            <h3 className="text-base font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
            <button
              type="button"
              className="mt-5 inline-flex h-9 items-center rounded-lg border border-border px-3 text-sm font-semibold transition hover:bg-background"
            >
              Revisar
            </button>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
