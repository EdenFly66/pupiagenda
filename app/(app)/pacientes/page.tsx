import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

const patients = [
  { name: "Martina López", age: "7 años", status: "En seguimiento", next: "Hoy 09:00" },
  { name: "Tomás Rivas", age: "9 años", status: "Plan activo", next: "Hoy 11:30" },
  { name: "Isidora Peña", age: "6 años", status: "Evaluación", next: "Hoy 16:00" },
  { name: "Benjamín Soto", age: "8 años", status: "Control mensual", next: "Lunes 10:00" },
];

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Gestión"
        title="Pacientes"
        description="Listado inicial para revisar pacientes, estado de atención y próxima sesión."
      />

      <SectionCard className="overflow-hidden p-0">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-base font-semibold">Pacientes recientes</h3>
        </div>
        <div className="divide-y divide-border">
          {patients.map((patient) => (
            <Link
              key={patient.name}
              href="/pacientes"
              className="grid gap-3 px-5 py-4 transition hover:bg-background sm:grid-cols-[1fr_140px_160px]"
            >
              <div>
                <p className="font-medium">{patient.name}</p>
                <p className="mt-1 text-sm text-muted">{patient.age}</p>
              </div>
              <p className="text-sm text-muted sm:self-center">{patient.status}</p>
              <p className="text-sm font-medium text-brand sm:self-center sm:text-right">
                {patient.next}
              </p>
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
