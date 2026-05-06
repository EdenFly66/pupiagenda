import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing cleanup env vars", {
      hasUrl: Boolean(supabaseUrl),
      hasServiceRoleKey: Boolean(serviceRoleKey),
    });

    return new Response("Missing environment variables", { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const cutoff = new Date(
    Date.now() - 14 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { error: feedbackError } = await supabase
    .from("feedback")
    .delete()
    .eq("status", "rejected")
    .lt("created_at", cutoff);

  if (feedbackError) {
    console.error("Feedback cleanup error:", feedbackError);
    return new Response("Feedback cleanup failed", { status: 500 });
  }

  const { error: announcementsError } = await supabase
    .from("announcements")
    .delete()
    .lt("published_at", cutoff);

  if (announcementsError) {
    console.error("Announcements cleanup error:", announcementsError);
    return new Response("Announcements cleanup failed", { status: 500 });
  }

  return new Response("OK");
}