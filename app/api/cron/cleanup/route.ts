import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const { error: feedbackError } = await supabase
    .from("feedback")
    .delete()
    .eq("status", "rejected")
    .lt("created_at", cutoff);

  const { error: announcementsError } = await supabase
    .from("announcements")
    .delete()
    .lt("published_at", cutoff);

  if (feedbackError || announcementsError) {
    console.error("Cleanup error:", feedbackError || announcementsError);
    return new Response("Error", { status: 500 });
  }

  return new Response("OK");
}