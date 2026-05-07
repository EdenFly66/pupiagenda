import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("Cleanup env check:", {
    hasUrl: Boolean(supabaseUrl),
    hasServiceRoleKey: Boolean(serviceRoleKey),
    serviceRoleLength: serviceRoleKey?.length,
    serviceRoleStart: serviceRoleKey?.slice(0, 24),
  });

  if (!supabaseUrl || !serviceRoleKey) {
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
    console.error("Feedback cleanup error:", {
      code: feedbackError.code,
      message: feedbackError.message,
      details: feedbackError.details,
      hint: feedbackError.hint,
    });

    return new Response(
      `Feedback cleanup failed: ${feedbackError.message}`,
      { status: 500 },
    );
  }

  const { error: announcementsError } = await supabase
    .from("announcements")
    .delete()
    .lt("published_at", cutoff);

  if (announcementsError) {
    console.error("Announcements cleanup error:", {
      code: announcementsError.code,
      message: announcementsError.message,
      details: announcementsError.details,
      hint: announcementsError.hint,
    });

    return new Response(
      `Announcements cleanup failed: ${announcementsError.message}`,
      { status: 500 },
    );
  }

  return new Response("OK");
}