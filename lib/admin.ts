import {
  mapFeedbackAdminRow,
  type AdminFeedbackItem,
  type FeedbackAdminRow,
  type UpdateAdminFeedbackInput,
} from "@/lib/admin-types";
import { supabase } from "@/lib/supabase";

export async function getIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return false;
  }

  return Boolean(data);
}

export async function getAdminFeedback(): Promise<AdminFeedbackItem[]> {
  const { data, error } = await supabase
    .from("feedback_admin_view")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("Admin feedback data:", data);

  if (error) {
    console.error("Admin feedback query error:", error);
    throw new Error("No se pudo cargar el panel de sugerencias.");
  }

  return ((data as FeedbackAdminRow[] | null) ?? []).map(mapFeedbackAdminRow);
}

export async function updateAdminFeedback(input: UpdateAdminFeedbackInput) {
  const patch: Record<string, string | null> = {};

  if (input.status) {
    patch.status = input.status;
  }

  if (input.priority) {
    patch.priority = input.priority;
  }

  if (input.targetVersion) {
    patch.target_version = input.targetVersion;
  }

  if (input.adminNotes !== undefined) {
    patch.admin_notes = input.adminNotes.trim() || null;
  }

  if (input.adminDecision !== undefined) {
    patch.admin_decision = input.adminDecision.trim() || null;
  }

  if (Object.keys(patch).length === 0) {
    return;
  }

  const { error } = await supabase
    .from("feedback")
    .update(patch)
    .eq("id", input.id);

  if (error) {
    throw new Error(
      "No se pudieron guardar los cambios. Revisa que tu cuenta tenga permisos de administracion.",
    );
  }
}
