import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";

const records = [
  { date: "23 Abr 2026", patient: "Martina López", summary: "Trabajo en lenguaje expresivo." },
  { date: "22 Abr 2026", patient: "Benjamín Soto", summary: "Control de objetivos mensuales." },
  { date: "21 Abr 2026", patient: "Tomás Rivas", summary: "Seguimiento de atención y conducta." },
];

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Registro"
        title="Historial"
        description="Base visual para consultar sesiones pasadas, notas y evolución clínica."
      />

      <SectionCard>
        <div className="divide-y divide-border">
          {records.map((record) => (
            <article key={`${record.date}-${record.patient}`} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-semibold">{record.patient}</h3>
                <time className="text-sm font-medium text-brand">{record.date}</time>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{record.summary}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
