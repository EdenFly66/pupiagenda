import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { ThemeSelector } from "@/components/theme/theme-selector";
import Link from "next/link";

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

      <SectionCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-semibold">Seguridad</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Actualiza tu contraseña cuando necesites reforzar el acceso a tu cuenta.
            </p>
          </div>
          <Link
            href="/auth/reset-password"
            className="inline-flex h-10 w-full items-center justify-center rounded-2xl bg-brand px-4 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover hover:text-brand-foreground active:bg-brand-active sm:w-auto"
          >
            Cambiar contraseña
          </Link>
        </div>
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
