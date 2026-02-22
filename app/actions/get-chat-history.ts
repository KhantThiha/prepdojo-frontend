import { createClient } from "@/lib/supabase/client";
import { UIMessage } from 'ai';

// Define types for clarity (matching your DB structure)
type DBMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string | null;
  parts: any[] | null; // Raw DB structure
  metadata: any | null;
  created_at: string;
};

export async function getChatHistory(chatId: string): Promise<UIMessage[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true })
    

  if (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }

  if (!data) return [];

  return data.map((msg: DBMessage) => {
    // Initialize an empty array for UIMessage parts
    const finalParts: any[] = [];

    // 1. Handle TEXT Content
    // Convert the raw DB string into a standard SDK TextPart
    if (msg.content) {
      finalParts.push({
        type: 'text',
        text: msg.content
      });
    }

    // 2. Handle TOOL Content
    // Transform raw DB tool structures into SDK ToolParts
    if (msg.parts && Array.isArray(msg.parts) && msg.parts.length > 0) {
      const transformedTools = transformParts(msg.parts);
      finalParts.push(...transformedTools);
    }

    // 3. Assemble the UIMessage
    // Note: We pass 'parts'. We do not need 'content' string at this level,
    // as the SDK reads from 'parts'.
    const message: UIMessage = {
      id: msg.id,
      role: msg.role,
      parts: finalParts
    };

    // 4. Attach metadata if present
    if (msg.metadata) {
      message.metadata = msg.metadata;
    }

    return message;
  });
}

/**
 * Transforms raw DB tool parts into SDK-compatible UIMessageParts
 */
function transformParts(rawParts: any[]): any[] {
  return rawParts.map((part) => {
    // Case 1: Text Part (if saved explicitly as an object)
    if (part.type === 'text') {
      return part;
    }

    // Case 2: Tool Part (Saved as raw OpenAI tool-call structure)
    if (part.type === 'tool-call' && part.data && Array.isArray(part.data)) {
      // part.data is an array of raw chunks. We find the one with the function name.
      const toolCallChunk = part.data.find(
        (item: any) => item.type === 'function' && item.function?.name
      );

      if (toolCallChunk && toolCallChunk.function) {
        const toolName = toolCallChunk.function.name;
        let argument = toolCallChunk.function.arguments;

        // Arguments might be a stringified JSON (from streaming), so parse it
        if (typeof argument === 'string') {
          try {
            argument = JSON.parse(argument);
          } catch (e) {
            console.error("Failed to parse tool arguments", e);
            argument = {}; // Fallback to empty object
          }
        }

        // Return SDK-compatible format: { type: "tool-{name}", input: ... }
        return {
          type: `tool-${toolName}`,
          input: argument
        };
      }
    }

    // Case 3: Fallback (return as is if unrecognized)
    return part;
  });
}