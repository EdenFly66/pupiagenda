import { SessionForm } from "@/components/sessions/session-form";
import { PageHeader } from "@/components/ui/page-header";

export default async function NewSessionPage({
  searchParams,
}: {
  searchParams: Promise<{ patientId?: string | string[] }>;
}) {
  const patientIdParam = (await searchParams).patientId;
  const initialPatientId = Array.isArray(patientIdParam)
    ? patientIdParam[0] ?? ""
    : patientIdParam ?? "";

  return (
    <div className="space-y-8 bg-[radial-gradient(circle_at_top_left,#fff0f3_0,transparent_30rem)]">
      <PageHeader
        eyebrow="Sesiones"
        title="Nueva sesi&oacute;n"
        description="Espacio de escritura rapido y tranquilo para registrar una sesion clinica sin distracciones."
      />

      <SessionForm initialPatientId={initialPatientId} />
    </div>
  );
}
