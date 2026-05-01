import { UserPlus } from "lucide-react";
import Link from "next/link";
import { PatientsView } from "@/components/patients/patients-view";
import { PageHeader } from "@/components/ui/page-header";

export default function PatientsPage() {
  return (
    <div className="space-y-6 bg-[radial-gradient(circle_at_top_left,var(--theme-soft-bg)_0,transparent_28rem)]">
      <PageHeader
        eyebrow="Gestion"
        title="Pacientes"
        description="Listado visual para revisar contacto, estado del proceso y ultima sesion."
        action={
          <Link
            href="/pacientes/nuevo"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover hover:text-brand-foreground active:bg-brand-active focus:outline-none focus:ring-4 focus:ring-rose-soft sm:w-auto"
          >
            <UserPlus className="size-4" aria-hidden="true" />
            Nuevo paciente
          </Link>
        }
      />

      <PatientsView />
    </div>
  );
}
