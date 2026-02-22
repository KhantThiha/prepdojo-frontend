"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateQuizMetadata({
  messageId,
  score,
  answers,
}: {
  messageId: string;
  score: number;
  answers: Record<number, number>;
}) {
  const supabase = createClient();

  // 1. Fetch current metadata to prevent overwriting other data (e.g., user_location, other tool results)
  const { data: existingData, error: fetchError } = await (await supabase)
    .from("messages")
    .select("metadata")
    .eq("id", messageId)
    .single();

  if (fetchError) {
    console.error("Error fetching existing metadata:", fetchError);
    throw new Error("Failed to load message for updating.");
  }

  // 2. Merge existing metadata with the new Quiz Result
  const existingMetadata = existingData?.metadata || {};
  const newMetadata = {
    ...existingMetadata, // Preserve existing data!
    quiz_result: {
      score,
      answers,
      completed_at: new Date().toISOString(),
    },
  };

  // 3. Update
  const { error } = await (await supabase)
    .from("messages")
    .update({
      metadata: newMetadata, // Upload the merged object
    })
    .eq("id", messageId);

  if (error) {
    console.error("Error updating quiz metadata:", error);
    throw new Error("Failed to save quiz results.");
  }
}