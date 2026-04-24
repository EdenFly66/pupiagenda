import { PatientForm } from "@/components/patients/patient-form";
import { PageHeader } from "@/components/ui/page-header";

export default function NewPatientPage() {
  return (
    <div className="space-y-8 bg-[radial-gradient(circle_at_top_left,#fff0f3_0,transparent_28rem)]">
      <PageHeader
        eyebrow="Pacientes"
        title="Nuevo paciente"
        description="Crea un registro basico en Supabase. La ficha clinica se completara en siguientes etapas."
      />

      <PatientForm />
    </div>
  );
}
