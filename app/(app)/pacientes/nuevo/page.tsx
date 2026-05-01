import { PatientForm } from "@/components/patients/patient-form";
import { PageHeader } from "@/components/ui/page-header";

export default function NewPatientPage() {
  return (
    <div className="space-y-8 bg-[radial-gradient(circle_at_top_left,var(--theme-soft-bg)_0,transparent_28rem)]">
      <PageHeader
        eyebrow="Pacientes"
        title="Nuevo paciente"
        description="Crea una ficha inicial y completa la informacion clinica relevante."
      />

      <PatientForm />
    </div>
  );
}
