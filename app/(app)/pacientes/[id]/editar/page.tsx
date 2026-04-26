import { EditPatientView } from "@/components/patients/edit-patient-view";

export default async function EditPatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditPatientView patientId={id} />;
}
