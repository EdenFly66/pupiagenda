import { ClinicalTimeline } from "@/components/history/clinical-timeline";
import { PageHeader } from "@/components/ui/page-header";

export default function HistoryPage() {
  return (
    <div className="space-y-8 bg-[radial-gradient(circle_at_top_left,#fff0f3_0,transparent_30rem)]">
      <PageHeader
        eyebrow="Registro"
        title="Historial clinico"
        description="Timeline con sesiones reales guardadas en Supabase."
      />

      <ClinicalTimeline />
    </div>
  );
}
