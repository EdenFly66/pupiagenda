import { ClinicalTimeline } from "@/components/history/clinical-timeline";
import { PageHeader } from "@/components/ui/page-header";
import { mockClinicalSessions } from "@/lib/mock-clinical-sessions";

export default function HistoryPage() {
  return (
    <div className="space-y-8 bg-[radial-gradient(circle_at_top_left,#fff0f3_0,transparent_30rem)]">
      <PageHeader
        eyebrow="Registro"
        title="Historial clinico"
        description="Timeline mock para revisar sesiones, borradores y pendientes por paciente."
      />

      <ClinicalTimeline sessions={mockClinicalSessions} />
    </div>
  );
}
