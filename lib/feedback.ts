import {
  feedbackSelectColumns,
  mapFeedbackRow,
  type CreateFeedbackInput,
  type FeedbackItem,
  type FeedbackRow,
} from "@/lib/feedback-types";
import { supabase } from "@/lib/supabase";

export async function getUserFeedback(userId: string): Promise<FeedbackItem[]> {
  const { data, error } = await supabase
    .from("feedback")
    .select(feedbackSelectColumns)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("No se pudo cargar el historial de sugerencias.");
  }

  return ((data as FeedbackRow[] | null) ?? []).map(mapFeedbackRow);
}

export async function createFeedback(input: CreateFeedbackInput) {
  const { error } = await supabase.from("feedback").insert({
    user_id: input.userId,
    category: input.category,
    status: "new",
    priority: input.priority,
    title: input.title,
    message: input.message,
  });

  if (error) {
    throw new Error("No se pudo enviar la sugerencia.");
  }
}
