import { HistoryPageView } from "@/components/history/history-page-view";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ patientId?: string }>;
}) {
  const { patientId } = await searchParams;

  return <HistoryPageView initialPatientId={patientId} />;
}
