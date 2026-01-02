"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getUserChats({
  limit = 20,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: [], error: "Unauthorized", count: 0 };
  }

  const { data, count, error } = await supabase
    .from("chats")
    .select("*", { count: "exact" }) // Get total count
    .eq("user_id", user.id)
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1); // Supabase range is inclusive

  if (error) {
    return { data: [], error: error.message, count: 0 };
  }

  return { data: data || [], error: null, count: count || 0 };
}