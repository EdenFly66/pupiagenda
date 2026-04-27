import {
  clinicalSessionStatusLabels,
  clinicalSessionStatuses,
  type ClinicalTimelineSession,
} from "@/lib/clinical-session-types";

type HistorySummaryProps = {
  sessions: ClinicalTimelineSession[];
};

export function HistorySummary({ sessions }: HistorySummaryProps) {
  const counts = clinicalSessionStatuses.map((status) => ({
    label: clinicalSessionStatusLabels[status],
    status,
    value: sessions.filter((session) => session.status === status).length,
  }));

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <SummaryCard label="Total sesiones" value={sessions.length} prominent />
      {counts.map((item) => (
        <SummaryCard key={item.status} label={item.label} value={item.value} />
      ))}
    </section>
  );
}

function SummaryCard({
  label,
  prominent = false,
  value,
}: {
  label: string;
  prominent?: boolean;
  value: number;
}) {
  return (
    <div
      className={`rounded-3xl border p-4 shadow-sm ${
        prominent
          ? "border-rose-200 bg-brand text-brand-foreground"
          : "border-rose-100 bg-white/90 text-foreground"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-normal ${
          prominent ? "text-brand-foreground" : "text-muted"
        }`}
      >
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
