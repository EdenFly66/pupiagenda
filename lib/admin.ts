import {
  mapProductVersionRow,
  mapFeedbackAdminRow,
  type AdminFeedbackPriority,
  type AdminFeedbackItem,
  type FeedbackAdminRow,
  type ProductVersion,
  type ProductVersionRow,
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

export async function getProductVersions(): Promise<ProductVersion[]> {
  const { data, error } = await supabase
    .from("product_versions")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Product versions query error:", error);
    throw new Error("No se pudieron cargar las versiones del roadmap.");
  }

  return ((data as ProductVersionRow[] | null) ?? [])
    .map(mapProductVersionRow)
    .filter((version) => version.name.trim().toLowerCase() !== "backlog");
}

export async function createProductVersion(name: string): Promise<ProductVersion> {
  const normalizedName = name.trim();

  if (normalizedName.length < 2) {
    throw new Error("El nombre de la version debe tener al menos 2 caracteres.");
  }

  if (normalizedName.toLowerCase() === "backlog") {
    throw new Error("Backlog es una vista global, no una version.");
  }

  const { data, error } = await supabase
    .from("product_versions")
    .insert({ name: normalizedName })
    .select("*")
    .single();

  if (error) {
    throw new Error("No se pudo crear la version.");
  }

  return mapProductVersionRow(data as ProductVersionRow);
}

export async function deleteProductVersion(versionId: string) {
  const { error: updateError } = await supabase
    .from("feedback")
    .update({ version_id: null })
    .eq("version_id", versionId);

  if (updateError) {
    throw new Error("No se pudieron mover las features a Sin version.");
  }

  const { error } = await supabase
    .from("product_versions")
    .delete()
    .eq("id", versionId);

  if (error) {
    throw new Error("No se pudo eliminar la version.");
  }
}

export async function updateAdminFeedbackStatus(
  feedbackId: string,
  status: UpdateAdminFeedbackInput["status"],
) {
  const { error } = await supabase
    .from("feedback")
    .update({ status })
    .eq("id", feedbackId);

  if (error) {
    throw new Error(
      "No se pudo mover la sugerencia. Revisa que tu cuenta tenga permisos de administracion.",
    );
  }
}

export async function updateAdminFeedbackPriority(
  feedbackId: string,
  priority: AdminFeedbackPriority,
) {
  const { error } = await supabase
    .from("feedback")
    .update({ priority })
    .eq("id", feedbackId);

  if (error) {
    throw new Error(
      "No se pudo actualizar la prioridad. Revisa que tu cuenta tenga permisos de administracion.",
    );
  }
}

export async function updateAdminFeedbackVersion(
  feedbackId: string,
  versionId: string | null,
) {
  const { error } = await supabase
    .from("feedback")
    .update({ version_id: versionId })
    .eq("id", feedbackId);

  if (error) {
    throw new Error(
      "No se pudo asignar la version. Revisa que tu cuenta tenga permisos de administracion.",
    );
  }
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
