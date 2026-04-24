import { PatientsView } from "@/components/patients/patients-view";
import { PageHeader } from "@/components/ui/page-header";

export default function PatientsPage() {
  return (
    <div className="space-y-6 bg-[radial-gradient(circle_at_top_left,#fff0f3_0,transparent_28rem)]">
      <PageHeader
        eyebrow="Gestion"
        title="Pacientes"
        description="Listado visual para revisar contacto, estado del proceso y ultima sesion."
        action={
          <button
            type="button"
            className="inline-flex h-11 items-center rounded-2xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-[#87304a]"
          >
            Nueva paciente
          </button>
        }
      />

      <PatientsView />
    </div>
  );
}
