import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export async function getAuthenticatedUser(): Promise<User> {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Necesitas iniciar sesion para continuar.");
  }

  return data.user;
}
