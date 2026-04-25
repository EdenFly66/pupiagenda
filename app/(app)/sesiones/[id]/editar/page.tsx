import { EditSessionView } from "@/components/sessions/edit-session-view";

export default async function EditSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditSessionView sessionId={id} />;
}
